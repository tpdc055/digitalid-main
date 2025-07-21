import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { z } from 'zod';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  mfaSecret?: string;
  mfaEnabled: boolean;
  roles: string[];
  permissions: string[];
  lastLogin?: number;
  failedAttempts: number;
  lockedUntil?: number;
  created: number;
  updated: number;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  created: number;
  expires: number;
  lastAccessed: number;
  ipAddress: string;
  userAgent: string;
  mfaVerified: boolean;
  deviceFingerprint?: string;
}

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'passwordHash' | 'mfaSecret'>;
  session?: Session;
  token?: string;
  refreshToken?: string;
  requiresMFA?: boolean;
  error?: string;
  remainingAttempts?: number;
}

export interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

// Validation schemas
const userSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  roles: z.array(z.string()).optional().default(['user'])
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  mfaCode: z.string().length(6).optional(),
  deviceFingerprint: z.string().optional()
});

export class AuthenticationSystem {
  private static instance: AuthenticationSystem;
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private jwtSecret: string;
  private refreshTokenSecret: string;
  private readonly maxFailedAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private readonly sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
  private readonly refreshTokenTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days

  private constructor() {
    this.jwtSecret = this.generateSecret();
    this.refreshTokenSecret = this.generateSecret();
    this.initializeAdminUser();
    this.startSessionCleanup();
  }

  static getInstance(): AuthenticationSystem {
    if (!this.instance) {
      this.instance = new AuthenticationSystem();
    }
    return this.instance;
  }

  private generateSecret(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  private async initializeAdminUser(): Promise<void> {
    const adminUser: User = {
      id: 'admin_001',
      username: 'admin',
      email: 'admin@security-framework.local',
      passwordHash: await this.hashPassword('SecureAdmin@2024'),
      mfaEnabled: true,
      mfaSecret: this.generateMFASecret(),
      roles: ['admin', 'security_officer', 'compliance_manager'],
      permissions: [
        'read:all',
        'write:all',
        'delete:all',
        'manage:users',
        'manage:encryption',
        'manage:compliance',
        'view:audit_logs',
        'generate:reports'
      ],
      failedAttempts: 0,
      created: Date.now(),
      updated: Date.now()
    };

    this.users.set(adminUser.id, adminUser);
    this.logAuthEvent('USER_CREATED', adminUser.id, 'Admin user initialized');
  }

  // User registration
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }): Promise<AuthResult> {
    try {
      const validated = userSchema.parse(userData);

      // Check if user exists
      const existingUser = Array.from(this.users.values()).find(
        u => u.username === validated.username || u.email === validated.email
      );

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists'
        };
      }

      const userId = this.generateUserId();
      const passwordHash = await this.hashPassword(validated.password);

      const user: User = {
        id: userId,
        username: validated.username,
        email: validated.email,
        passwordHash,
        mfaEnabled: false,
        roles: validated.roles || ['user'],
        permissions: this.getPermissionsForRoles(validated.roles || ['user']),
        failedAttempts: 0,
        created: Date.now(),
        updated: Date.now()
      };

      this.users.set(userId, user);
      this.logAuthEvent('USER_REGISTERED', userId, `User ${validated.username} registered`);

      return {
        success: true,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof z.ZodError ? error.issues[0].message : 'Registration failed'
      };
    }
  }

  // User login
  async login(credentials: {
    username: string;
    password: string;
    mfaCode?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }): Promise<AuthResult> {
    try {
      const validated = loginSchema.parse(credentials);

      const user = Array.from(this.users.values()).find(
        u => u.username === validated.username || u.email === validated.username
      );

      if (!user) {
        this.logAuthEvent('LOGIN_FAILED', 'unknown', `Invalid username: ${validated.username}`);
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 60000);
        this.logAuthEvent('LOGIN_BLOCKED', user.id, `Account locked for ${remainingTime} minutes`);
        return {
          success: false,
          error: `Account locked. Try again in ${remainingTime} minutes.`
        };
      }

      // Verify password
      const passwordValid = await this.verifyPassword(validated.password, user.passwordHash);
      if (!passwordValid) {
        await this.handleFailedLogin(user);
        return {
          success: false,
          error: 'Invalid credentials',
          remainingAttempts: this.maxFailedAttempts - user.failedAttempts
        };
      }

      // Check MFA if enabled
      if (user.mfaEnabled) {
        if (!validated.mfaCode) {
          return {
            success: false,
            requiresMFA: true,
            error: 'MFA code required'
          };
        }

        const mfaValid = this.verifyMFACode(user.mfaSecret!, validated.mfaCode);
        if (!mfaValid) {
          await this.handleFailedLogin(user);
          this.logAuthEvent('MFA_FAILED', user.id, 'Invalid MFA code');
          return {
            success: false,
            error: 'Invalid MFA code',
            remainingAttempts: this.maxFailedAttempts - user.failedAttempts
          };
        }
      }

      // Reset failed attempts on successful login
      user.failedAttempts = 0;
      user.lockedUntil = undefined;
      user.lastLogin = Date.now();
      user.updated = Date.now();

      // Create session
      const session = await this.createSession(user, {
        ipAddress: credentials.ipAddress || '127.0.0.1',
        userAgent: credentials.userAgent || 'Unknown',
        deviceFingerprint: validated.deviceFingerprint
      });

      this.logAuthEvent('LOGIN_SUCCESS', user.id, `User ${user.username} logged in`);

      return {
        success: true,
        user: this.sanitizeUser(user),
        session,
        token: session.token,
        refreshToken: session.refreshToken
      };
    } catch (error) {
      this.logAuthEvent('LOGIN_ERROR', 'unknown', `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  // Logout
  async logout(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
      this.logAuthEvent('LOGOUT', session.userId, 'User logged out');
      return true;
    }
    return false;
  }

  // Verify session token
  async verifyToken(token: string): Promise<Session | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      const session = this.sessions.get(decoded.sessionId);

      if (session && session.expires > Date.now()) {
        session.lastAccessed = Date.now();
        return session;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as any;
      const session = this.sessions.get(decoded.sessionId);

      if (!session || session.expires < Date.now()) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      // Create new session
      const user = this.users.get(session.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const newSession = await this.createSession(user, {
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceFingerprint: session.deviceFingerprint
      });

      // Remove old session
      this.sessions.delete(session.id);

      this.logAuthEvent('TOKEN_REFRESHED', user.id, 'Session token refreshed');

      return {
        success: true,
        user: this.sanitizeUser(user),
        session: newSession,
        token: newSession.token,
        refreshToken: newSession.refreshToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  // Setup MFA
  async setupMFA(userId: string): Promise<MFASetup | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const secret = this.generateMFASecret();
    const qrCodeUrl = this.generateQRCodeUrl(user.username, secret);
    const backupCodes = this.generateBackupCodes();

    user.mfaSecret = secret;
    user.updated = Date.now();

    this.logAuthEvent('MFA_SETUP', userId, 'MFA setup initiated');

    return {
      secret,
      qrCodeUrl,
      backupCodes
    };
  }

  // Enable MFA
  async enableMFA(userId: string, verificationCode: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user || !user.mfaSecret) return false;

    const isValid = this.verifyMFACode(user.mfaSecret, verificationCode);
    if (isValid) {
      user.mfaEnabled = true;
      user.updated = Date.now();
      this.logAuthEvent('MFA_ENABLED', userId, 'MFA enabled for user');
      return true;
    }

    return false;
  }

  // Get authentication statistics
  getAuthStats() {
    const totalUsers = this.users.size;
    const activeSessions = this.sessions.size;
    const mfaEnabledUsers = Array.from(this.users.values()).filter(u => u.mfaEnabled).length;
    const lockedUsers = Array.from(this.users.values()).filter(u => u.lockedUntil && u.lockedUntil > Date.now()).length;

    return {
      totalUsers,
      activeSessions,
      mfaEnabledUsers,
      mfaEnabledRate: Math.round((mfaEnabledUsers / totalUsers) * 100),
      lockedUsers,
      avgSessionDuration: this.calculateAvgSessionDuration(),
      securityScore: this.calculateSecurityScore()
    };
  }

  private async createSession(user: User, context: {
    ipAddress: string;
    userAgent: string;
    deviceFingerprint?: string;
  }): Promise<Session> {
    const sessionId = this.generateSessionId();
    const now = Date.now();

    const session: Session = {
      id: sessionId,
      userId: user.id,
      token: '',
      refreshToken: '',
      created: now,
      expires: now + this.sessionTimeout,
      lastAccessed: now,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      mfaVerified: user.mfaEnabled,
      deviceFingerprint: context.deviceFingerprint
    };

    // Generate JWT tokens
    session.token = jwt.sign(
      {
        sessionId,
        userId: user.id,
        roles: user.roles,
        permissions: user.permissions
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    session.refreshToken = jwt.sign(
      { sessionId },
      this.refreshTokenSecret,
      { expiresIn: '7d' }
    );

    this.sessions.set(sessionId, session);
    return session;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async handleFailedLogin(user: User): Promise<void> {
    user.failedAttempts++;

    if (user.failedAttempts >= this.maxFailedAttempts) {
      user.lockedUntil = Date.now() + this.lockoutDuration;
      this.logAuthEvent('ACCOUNT_LOCKED', user.id, `Account locked after ${this.maxFailedAttempts} failed attempts`);
    }

    user.updated = Date.now();
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateMFASecret(): string {
    return CryptoJS.lib.WordArray.random(160/8).toString();
  }

  private generateQRCodeUrl(username: string, secret: string): string {
    const issuer = encodeURIComponent('Enhanced Security Framework');
    const label = encodeURIComponent(`${issuer}:${username}`);
    return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  private verifyMFACode(secret: string, code: string): boolean {
    // Simplified TOTP verification (in production, use a proper TOTP library)
    const timeStep = Math.floor(Date.now() / 30000);
    const hash = CryptoJS.HmacSHA1(timeStep.toString(), secret);
    const truncated = parseInt(hash.toString().slice(-6), 16) % 1000000;
    const expectedCode = truncated.toString().padStart(6, '0');

    return code === expectedCode;
  }

  private getPermissionsForRoles(roles: string[]): string[] {
    const rolePermissions: Record<string, string[]> = {
      user: ['read:own', 'write:own'],
      moderator: ['read:all', 'write:own', 'moderate:content'],
      admin: ['read:all', 'write:all', 'delete:all', 'manage:users'],
      security_officer: ['view:audit_logs', 'manage:encryption', 'view:security_events'],
      compliance_manager: ['view:compliance', 'generate:reports', 'manage:policies']
    };

    const permissions = new Set<string>();
    roles.forEach(role => {
      (rolePermissions[role] || []).forEach(permission => {
        permissions.add(permission);
      });
    });

    return Array.from(permissions);
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash' | 'mfaSecret'> {
    const { passwordHash, mfaSecret, ...sanitized } = user;
    return sanitized;
  }

  private startSessionCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, session] of this.sessions.entries()) {
        if (session.expires < now) {
          this.sessions.delete(sessionId);
          this.logAuthEvent('SESSION_EXPIRED', session.userId, 'Session automatically expired');
        }
      }
    }, 60000); // Check every minute
  }

  private calculateAvgSessionDuration(): number {
    const activeSessions = Array.from(this.sessions.values());
    if (activeSessions.length === 0) return 0;

    const totalDuration = activeSessions.reduce((sum, session) => {
      return sum + (session.lastAccessed - session.created);
    }, 0);

    return Math.round(totalDuration / activeSessions.length / (60 * 1000)); // minutes
  }

  private calculateSecurityScore(): number {
    const stats = this.getAuthStats();
    let score = 70; // Base score

    // MFA adoption bonus
    score += Math.min(stats.mfaEnabledRate * 0.3, 25);

    // Active sessions penalty (too many might indicate security issues)
    if (stats.activeSessions > stats.totalUsers * 2) {
      score -= 10;
    }

    // Locked accounts penalty
    if (stats.lockedUsers > 0) {
      score -= stats.lockedUsers * 2;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private logAuthEvent(event: string, userId: string, message: string): void {
    console.log(`[AUTH] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      userId,
      message
    });
  }
}

// Export singleton instance
export const auth = AuthenticationSystem.getInstance();
