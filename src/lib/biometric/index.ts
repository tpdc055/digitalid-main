// Enhanced Security Framework - Biometric Authentication System
// Advanced biometric security for Papua New Guinea Government Portal

import { auditLogger } from '@/lib/security/audit';
import { encryption } from '@/lib/security/encryption';
import CryptoJS from 'crypto-js';

export interface BiometricTemplate {
  id: string;
  citizenId: string;
  type: 'fingerprint' | 'face' | 'voice' | 'iris' | 'palm';
  templateData: string; // Encrypted biometric template
  quality: number; // Quality score 0-100
  created: number;
  lastUsed?: number;
  deviceInfo: {
    manufacturer: string;
    model: string;
    os: string;
    sensor: string;
  };
  metadata: {
    enrollmentLocation: string;
    enrollmentOfficer?: string;
    verificationCount: number;
    failureCount: number;
  };
}

export interface BiometricVerificationRequest {
  citizenId: string;
  biometricType: BiometricTemplate['type'];
  capturedData: string;
  challengeNonce: string;
  deviceFingerprint: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface BiometricVerificationResult {
  verified: boolean;
  confidence: number; // Matching confidence 0-100
  template?: BiometricTemplate;
  riskScore: number; // Security risk assessment 0-100
  fraudIndicators: string[];
  verificationTime: number;
  sessionId: string;
}

export interface BiometricCapability {
  type: BiometricTemplate['type'];
  available: boolean;
  quality: 'high' | 'medium' | 'low';
  features: string[];
  securityLevel: number;
}

export interface LivenessDetectionResult {
  isLive: boolean;
  confidence: number;
  challenges: LivenessChallenge[];
  spoofingAttempts: string[];
}

export interface LivenessChallenge {
  type: 'blink' | 'smile' | 'turn_head' | 'voice_phrase' | 'finger_movement';
  instruction: string;
  completed: boolean;
  confidence: number;
}

class BiometricAuthenticationSystem {
  private static instance: BiometricAuthenticationSystem;
  private templates: Map<string, BiometricTemplate[]> = new Map();
  private verificationSessions: Map<string, BiometricVerificationResult> = new Map();
  private fraudPatterns: Map<string, number> = new Map();
  private readonly qualityThreshold = 70;
  private readonly verificationThreshold = 85;
  private readonly maxFailureAttempts = 3;

  private constructor() {
    this.initializeBiometricSystem();
  }

  static getInstance(): BiometricAuthenticationSystem {
    if (!this.instance) {
      this.instance = new BiometricAuthenticationSystem();
    }
    return this.instance;
  }

  private initializeBiometricSystem(): void {
    auditLogger.logEvent({
      eventType: 'BIOMETRIC_SYSTEM_INITIALIZED',
      category: 'system',
      severity: 'info',
      action: 'initialize',
      outcome: 'success',
      details: { capabilities: this.getSupportedCapabilities() },
      tags: ['biometric', 'initialization']
    });
  }

  // Biometric enrollment
  async enrollBiometric(
    citizenId: string,
    biometricType: BiometricTemplate['type'],
    capturedData: string,
    deviceInfo: BiometricTemplate['deviceInfo'],
    enrollmentContext: {
      location: string;
      officer?: string;
    }
  ): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      // Validate biometric quality
      const quality = await this.assessBiometricQuality(capturedData, biometricType);
      if (quality < this.qualityThreshold) {
        return {
          success: false,
          error: `Biometric quality too low (${quality}%). Please try again with better positioning.`
        };
      }

      // Check for existing templates
      const existingTemplates = this.templates.get(citizenId) || [];
      const sameTypeTemplates = existingTemplates.filter(t => t.type === biometricType);

      if (sameTypeTemplates.length >= 3) {
        return {
          success: false,
          error: 'Maximum number of templates for this biometric type already enrolled.'
        };
      }

      // Create biometric template
      const templateId = this.generateTemplateId();
      const encryptedTemplate = await this.encryptBiometricData(capturedData);

      const template: BiometricTemplate = {
        id: templateId,
        citizenId,
        type: biometricType,
        templateData: encryptedTemplate,
        quality,
        created: Date.now(),
        deviceInfo,
        metadata: {
          enrollmentLocation: enrollmentContext.location,
          enrollmentOfficer: enrollmentContext.officer,
          verificationCount: 0,
          failureCount: 0
        }
      };

      // Store template
      const userTemplates = this.templates.get(citizenId) || [];
      userTemplates.push(template);
      this.templates.set(citizenId, userTemplates);

      auditLogger.logEvent({
        eventType: 'BIOMETRIC_ENROLLED',
        category: 'authentication',
        severity: 'info',
        userId: citizenId,
        action: 'enroll_biometric',
        outcome: 'success',
        details: {
          templateId,
          biometricType,
          quality,
          location: enrollmentContext.location
        },
        tags: ['biometric', 'enrollment']
      });

      return { success: true, templateId };

    } catch (error) {
      auditLogger.logEvent({
        eventType: 'BIOMETRIC_ENROLLMENT_FAILED',
        category: 'authentication',
        severity: 'error',
        userId: citizenId,
        action: 'enroll_biometric',
        outcome: 'failure',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        tags: ['biometric', 'error']
      });

      return {
        success: false,
        error: 'Biometric enrollment failed. Please try again.'
      };
    }
  }

  // Biometric verification with anti-spoofing
  async verifyBiometric(request: BiometricVerificationRequest): Promise<BiometricVerificationResult> {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();

    try {
      // Get user templates
      const userTemplates = this.templates.get(request.citizenId) || [];
      const matchingTemplates = userTemplates.filter(t => t.type === request.biometricType);

      if (matchingTemplates.length === 0) {
        throw new Error('No biometric templates found for verification');
      }

      // Liveness detection
      const livenessResult = await this.performLivenessDetection(
        request.capturedData,
        request.biometricType
      );

      if (!livenessResult.isLive) {
        const result: BiometricVerificationResult = {
          verified: false,
          confidence: 0,
          riskScore: 100,
          fraudIndicators: ['liveness_detection_failed', ...livenessResult.spoofingAttempts],
          verificationTime: Date.now() - startTime,
          sessionId
        };

        this.logVerificationAttempt(request, result, 'liveness_failed');
        return result;
      }

      // Template matching
      let bestMatch: { template: BiometricTemplate; confidence: number } | null = null;

      for (const template of matchingTemplates) {
        const decryptedTemplate = await this.decryptBiometricData(template.templateData);
        const confidence = await this.matchBiometricTemplates(
          request.capturedData,
          decryptedTemplate,
          request.biometricType
        );

        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { template, confidence };
        }
      }

      // Risk assessment
      const riskScore = await this.assessVerificationRisk(request, bestMatch);
      const fraudIndicators = await this.detectFraudIndicators(request, bestMatch);

      const verified = bestMatch !== null &&
                      bestMatch.confidence >= this.verificationThreshold &&
                      riskScore < 50;

      const result: BiometricVerificationResult = {
        verified,
        confidence: bestMatch?.confidence || 0,
        template: verified ? bestMatch?.template : undefined,
        riskScore,
        fraudIndicators,
        verificationTime: Date.now() - startTime,
        sessionId
      };

      // Update template metadata
      if (bestMatch) {
        if (verified) {
          bestMatch.template.metadata.verificationCount++;
          bestMatch.template.lastUsed = Date.now();
        } else {
          bestMatch.template.metadata.failureCount++;
        }
      }

      this.verificationSessions.set(sessionId, result);
      this.logVerificationAttempt(request, result, verified ? 'success' : 'failed');

      return result;

    } catch (error) {
      const result: BiometricVerificationResult = {
        verified: false,
        confidence: 0,
        riskScore: 100,
        fraudIndicators: ['system_error'],
        verificationTime: Date.now() - startTime,
        sessionId
      };

      this.logVerificationAttempt(request, result, 'error');
      return result;
    }
  }

  // Multi-modal biometric verification
  async verifyMultiModal(
    citizenId: string,
    biometricData: Array<{
      type: BiometricTemplate['type'];
      data: string;
    }>,
    deviceFingerprint: string
  ): Promise<BiometricVerificationResult> {
    const results: BiometricVerificationResult[] = [];

    for (const biometric of biometricData) {
      const request: BiometricVerificationRequest = {
        citizenId,
        biometricType: biometric.type,
        capturedData: biometric.data,
        challengeNonce: this.generateNonce(),
        deviceFingerprint
      };

      const result = await this.verifyBiometric(request);
      results.push(result);
    }

    // Calculate combined confidence using weighted average
    const weights = {
      fingerprint: 0.4,
      face: 0.3,
      voice: 0.2,
      iris: 0.4,
      palm: 0.3
    };

    let weightedConfidence = 0;
    let totalWeight = 0;
    let allVerified = true;
    const allFraudIndicators: string[] = [];

    for (const result of results) {
      const weight = weights[result.template?.type || 'fingerprint'] || 0.3;
      weightedConfidence += result.confidence * weight;
      totalWeight += weight;

      if (!result.verified) {
        allVerified = false;
      }

      allFraudIndicators.push(...result.fraudIndicators);
    }

    const combinedConfidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0;
    const combinedRiskScore = Math.min(...results.map(r => r.riskScore));

    return {
      verified: allVerified && combinedConfidence >= this.verificationThreshold,
      confidence: combinedConfidence,
      riskScore: combinedRiskScore,
      fraudIndicators: [...new Set(allFraudIndicators)],
      verificationTime: Math.max(...results.map(r => r.verificationTime)),
      sessionId: this.generateSessionId()
    };
  }

  // Liveness detection
  private async performLivenessDetection(
    biometricData: string,
    type: BiometricTemplate['type']
  ): Promise<LivenessDetectionResult> {
    const challenges: LivenessChallenge[] = [];

    switch (type) {
      case 'face':
        challenges.push(
          {
            type: 'blink',
            instruction: 'Please blink your eyes',
            completed: Math.random() > 0.1, // 90% success rate simulation
            confidence: 85 + Math.random() * 15
          },
          {
            type: 'turn_head',
            instruction: 'Turn your head slightly left, then right',
            completed: Math.random() > 0.15,
            confidence: 80 + Math.random() * 20
          }
        );
        break;

      case 'fingerprint':
        challenges.push({
          type: 'finger_movement',
          instruction: 'Lift and place finger again',
          completed: Math.random() > 0.05,
          confidence: 90 + Math.random() * 10
        });
        break;

      case 'voice':
        challenges.push({
          type: 'voice_phrase',
          instruction: 'Please repeat: "Papua New Guinea Government Portal"',
          completed: Math.random() > 0.1,
          confidence: 85 + Math.random() * 15
        });
        break;
    }

    const completedChallenges = challenges.filter(c => c.completed).length;
    const isLive = completedChallenges >= Math.ceil(challenges.length * 0.7);
    const confidence = challenges.reduce((sum, c) => sum + c.confidence, 0) / challenges.length;

    const spoofingAttempts: string[] = [];
    if (!isLive) {
      spoofingAttempts.push('insufficient_liveness_response');
    }

    return {
      isLive,
      confidence,
      challenges,
      spoofingAttempts
    };
  }

  // Device capability detection
  async detectBiometricCapabilities(): Promise<BiometricCapability[]> {
    const capabilities: BiometricCapability[] = [];

    // Simulate device capability detection
    if (typeof navigator !== 'undefined') {
      // Check for Web Authentication API
      if (navigator.credentials && 'create' in navigator.credentials) {
        capabilities.push({
          type: 'fingerprint',
          available: true,
          quality: 'high',
          features: ['touch_sensor', 'encryption', 'secure_element'],
          securityLevel: 95
        });
      }

      // Check for camera
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        capabilities.push({
          type: 'face',
          available: true,
          quality: 'medium',
          features: ['camera', 'face_detection', 'liveness_check'],
          securityLevel: 85
        });
      }

      // Check for microphone
      if (navigator.mediaDevices) {
        capabilities.push({
          type: 'voice',
          available: true,
          quality: 'medium',
          features: ['microphone', 'voice_analysis', 'noise_cancellation'],
          securityLevel: 80
        });
      }
    }

    return capabilities;
  }

  // Utility methods
  private async assessBiometricQuality(data: string, type: BiometricTemplate['type']): Promise<number> {
    // Simulate quality assessment
    const baseQuality = 60 + Math.random() * 40;

    // Type-specific quality factors
    const qualityFactors = {
      fingerprint: 1.2,
      face: 1.0,
      voice: 0.9,
      iris: 1.3,
      palm: 1.1
    };

    return Math.min(100, baseQuality * (qualityFactors[type] || 1.0));
  }

  private async encryptBiometricData(data: string): Promise<string> {
    const encryptionResult = encryption.encryptDataAtRest(data);
    return encryptionResult.encrypted;
  }

  private async decryptBiometricData(encryptedData: string): Promise<string> {
    // This would decrypt using the encryption system
    return encryptedData; // Simplified for demo
  }

  private async matchBiometricTemplates(
    captured: string,
    stored: string,
    type: BiometricTemplate['type']
  ): Promise<number> {
    // Simulate template matching with realistic accuracy
    const baseAccuracy = {
      fingerprint: 95,
      face: 90,
      voice: 85,
      iris: 98,
      palm: 92
    };

    const accuracy = baseAccuracy[type] || 85;
    return accuracy + (Math.random() - 0.5) * 10;
  }

  private async assessVerificationRisk(
    request: BiometricVerificationRequest,
    match: { template: BiometricTemplate; confidence: number } | null
  ): Promise<number> {
    let riskScore = 0;

    // Location-based risk
    if (request.location) {
      // Check if location is suspicious (simplified)
      riskScore += 10;
    }

    // Device fingerprint risk
    const knownDevice = match?.template.deviceInfo.manufacturer === 'known_manufacturer';
    if (!knownDevice) {
      riskScore += 15;
    }

    // Confidence-based risk
    if (match && match.confidence < 90) {
      riskScore += (90 - match.confidence) * 0.5;
    }

    // Failure history risk
    if (match && match.template.metadata.failureCount > 3) {
      riskScore += 20;
    }

    return Math.min(100, riskScore);
  }

  private async detectFraudIndicators(
    request: BiometricVerificationRequest,
    match: { template: BiometricTemplate; confidence: number } | null
  ): Promise<string[]> {
    const indicators: string[] = [];

    // Check for rapid repeated attempts
    const recentAttempts = this.getRecentVerificationAttempts(request.citizenId);
    if (recentAttempts.length > 5) {
      indicators.push('rapid_repeated_attempts');
    }

    // Check for unusual device
    if (match && match.template.deviceInfo.manufacturer !== 'expected_manufacturer') {
      indicators.push('unusual_device');
    }

    // Check confidence threshold
    if (match && match.confidence < this.verificationThreshold + 10) {
      indicators.push('low_confidence_match');
    }

    return indicators;
  }

  private getRecentVerificationAttempts(citizenId: string): BiometricVerificationResult[] {
    const cutoffTime = Date.now() - (15 * 60 * 1000); // Last 15 minutes
    return Array.from(this.verificationSessions.values())
      .filter(session => {
        // Would need to store citizenId in session in real implementation
        return session.verificationTime > cutoffTime;
      });
  }

  private getSupportedCapabilities(): string[] {
    return ['fingerprint', 'face', 'voice', 'iris', 'palm'];
  }

  private generateTemplateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateNonce(): string {
    return CryptoJS.lib.WordArray.random(128/8).toString();
  }

  private logVerificationAttempt(
    request: BiometricVerificationRequest,
    result: BiometricVerificationResult,
    status: string
  ): void {
    auditLogger.logEvent({
      eventType: 'BIOMETRIC_VERIFICATION_ATTEMPT',
      category: 'authentication',
      severity: result.verified ? 'info' : 'warning',
      userId: request.citizenId,
      sessionId: result.sessionId,
      action: 'verify_biometric',
      outcome: result.verified ? 'success' : 'failure',
      details: {
        biometricType: request.biometricType,
        confidence: result.confidence,
        riskScore: result.riskScore,
        fraudIndicators: result.fraudIndicators,
        verificationTime: result.verificationTime,
        status
      },
      tags: ['biometric', 'verification']
    });
  }

  // Public API methods
  getBiometricStats(citizenId: string) {
    const templates = this.templates.get(citizenId) || [];
    const totalVerifications = templates.reduce((sum, t) => sum + t.metadata.verificationCount, 0);
    const totalFailures = templates.reduce((sum, t) => sum + t.metadata.failureCount, 0);

    return {
      enrolledBiometrics: templates.length,
      biometricTypes: templates.map(t => t.type),
      totalVerifications,
      totalFailures,
      successRate: totalVerifications > 0 ? ((totalVerifications / (totalVerifications + totalFailures)) * 100) : 0,
      lastUsed: Math.max(...templates.map(t => t.lastUsed || 0))
    };
  }

  async deleteBiometricTemplate(citizenId: string, templateId: string): Promise<boolean> {
    const templates = this.templates.get(citizenId) || [];
    const filteredTemplates = templates.filter(t => t.id !== templateId);

    if (filteredTemplates.length !== templates.length) {
      this.templates.set(citizenId, filteredTemplates);

      auditLogger.logEvent({
        eventType: 'BIOMETRIC_TEMPLATE_DELETED',
        category: 'authentication',
        severity: 'info',
        userId: citizenId,
        action: 'delete_template',
        outcome: 'success',
        details: { templateId },
        tags: ['biometric', 'deletion']
      });

      return true;
    }

    return false;
  }
}

// Export singleton instance
export const biometricAuth = BiometricAuthenticationSystem.getInstance();

// Utility functions
export function isBiometricSupported(): boolean {
  if (typeof navigator === 'undefined') return false;

  return !!(
    navigator.credentials ||
    navigator.mediaDevices ||
    (window as any).PublicKeyCredential
  );
}

export function getBiometricErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'insufficient_quality': 'Biometric quality is too low. Please try again with better positioning.',
    'liveness_failed': 'Liveness detection failed. Please ensure you are physically present.',
    'no_templates': 'No biometric templates found. Please enroll your biometrics first.',
    'verification_failed': 'Biometric verification failed. Please try again.',
    'fraud_detected': 'Suspicious activity detected. Please contact support.',
    'device_not_supported': 'Your device does not support biometric authentication.'
  };

  return errorMessages[error] || 'An unknown biometric error occurred.';
}
