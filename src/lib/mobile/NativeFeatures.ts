// Enhanced Security Framework - Native Mobile Features
// iOS and Android native integration for PNG Government Portal

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  model: string;
  manufacturer: string;
  isTablet: boolean;
  hasNotch: boolean;
  screenSize: {
    width: number;
    height: number;
    scale: number;
  };
  capabilities: {
    biometric: boolean;
    camera: boolean;
    gps: boolean;
    nfc: boolean;
    fingerprint: boolean;
    faceId: boolean;
    touchId: boolean;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data: Record<string, any>;
  sound?: string;
  badge?: number;
  category?: string;
  priority: 'default' | 'high' | 'max';
  channelId?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface CameraResult {
  uri: string;
  width: number;
  height: number;
  type: 'image' | 'video';
  base64?: string;
  exif?: Record<string, any>;
}

export interface DocumentScanResult {
  uri: string;
  type: string;
  name: string;
  size: number;
  mimeType: string;
  pages?: number;
  confidence?: number;
}

export interface BiometricAuthResult {
  success: boolean;
  biometricType: 'fingerprint' | 'face' | 'voice' | 'none';
  error?: string;
}

export interface SecureStorageOptions {
  requireBiometric?: boolean;
  invalidateOnBiometricChange?: boolean;
  touchPrompt?: string;
  showModal?: boolean;
}

class NativeFeaturesManager {
  private static instance: NativeFeaturesManager;
  private deviceInfo: DeviceInfo | null = null;
  private notificationToken: string | null = null;
  private locationWatcher: any = null;

  private constructor() {
    this.initializeNativeFeatures();
  }

  static getInstance(): NativeFeaturesManager {
    if (!this.instance) {
      this.instance = new NativeFeaturesManager();
    }
    return this.instance;
  }

  private async initializeNativeFeatures(): Promise<void> {
    try {
      // Only initialize on client-side
      if (typeof window === 'undefined') return;

      this.deviceInfo = await this.getDeviceInfo();
      await this.requestPermissions();
      await this.setupPushNotifications();
    } catch (error) {
      console.error('[Native] Failed to initialize native features:', error);
    }
  }

  // Device Information
  async getDeviceInfo(): Promise<DeviceInfo> {
    if (this.deviceInfo) return this.deviceInfo;

    // Check if running on client-side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      // Return default values for server-side rendering
      return {
        platform: 'web',
        version: 'unknown',
        model: 'unknown',
        manufacturer: 'unknown',
        isTablet: false,
        hasNotch: false,
        screenSize: { width: 1920, height: 1080, scale: 1 },
        capabilities: {
          biometric: false,
          camera: false,
          gps: false,
          nfc: false,
          fingerprint: false,
          faceId: false,
          touchId: false
        }
      };
    }

    // Simulate native device detection
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    const deviceInfo: DeviceInfo = {
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
      version: this.extractOSVersion(userAgent),
      model: this.extractDeviceModel(userAgent),
      manufacturer: isIOS ? 'Apple' : isAndroid ? 'Android' : 'Unknown',
      isTablet: /iPad/.test(userAgent) || (isAndroid && !/Mobile/.test(userAgent)),
      hasNotch: this.detectNotch(),
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
        scale: window.devicePixelRatio || 1
      },
      capabilities: {
        biometric: await this.checkBiometricSupport(),
        camera: await this.checkCameraSupport(),
        gps: 'geolocation' in navigator,
        nfc: 'nfc' in navigator,
        fingerprint: await this.checkFingerprintSupport(),
        faceId: isIOS && await this.checkFaceIdSupport(),
        touchId: isIOS && await this.checkTouchIdSupport()
      }
    };

    this.deviceInfo = deviceInfo;
    return deviceInfo;
  }

  // Push Notifications
  async setupPushNotifications(): Promise<string | null> {
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return null;
      }

      // Register service worker for push notifications
      const registration = await navigator.serviceWorker.register('/sw.js');

      // In a real app, you would get the push subscription here
      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      this.notificationToken = mockToken;

      return mockToken;
    } catch (error) {
      console.error('[Native] Push notification setup failed:', error);
      return null;
    }
  }

  async sendLocalNotification(notification: PushNotification): Promise<boolean> {
    try {
      if (!('Notification' in window)) return false;

      const nativeNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: notification.id,
        data: notification.data,
        requireInteraction: notification.priority === 'high'
      });

      nativeNotification.onclick = () => {
        window.focus();
        nativeNotification.close();

        // Handle notification click
        if (notification.data?.url) {
          window.location.href = notification.data.url;
        }
      };

      return true;
    } catch (error) {
      console.error('[Native] Local notification failed:', error);
      return false;
    }
  }

  // Biometric Authentication
  async authenticateWithBiometric(
    reason: string = 'Authenticate to access PNG Government Portal'
  ): Promise<BiometricAuthResult> {
    try {
      // Check for Web Authentication API
      if (navigator.credentials && 'create' in navigator.credentials) {
        try {
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: new Uint8Array(32),
              timeout: 60000,
              userVerification: 'required'
            }
          });

          if (credential) {
            return {
              success: true,
              biometricType: 'fingerprint' // or detect actual type
            };
          }
        } catch (error) {
          return {
            success: false,
            biometricType: 'none',
            error: 'Biometric authentication failed'
          };
        }
      }

      // Fallback for unsupported devices
      return {
        success: false,
        biometricType: 'none',
        error: 'Biometric authentication not supported'
      };
    } catch (error) {
      return {
        success: false,
        biometricType: 'none',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Camera and Document Scanning
  async openCamera(options: {
    mediaType: 'photo' | 'video';
    quality: number;
    includeBase64: boolean;
  }): Promise<CameraResult | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Back camera for document scanning
        }
      });

      return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', options.quality);

            // Stop the stream
            stream.getTracks().forEach(track => track.stop());

            resolve({
              uri: dataUrl,
              width: canvas.width,
              height: canvas.height,
              type: 'image',
              base64: options.includeBase64 ? dataUrl.split(',')[1] : undefined
            });
          }
        };
      });
    } catch (error) {
      console.error('[Native] Camera access failed:', error);
      return null;
    }
  }

  async scanDocument(): Promise<DocumentScanResult | null> {
    try {
      // Use File API for document picking on web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';

      return new Promise((resolve) => {
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                uri: reader.result as string,
                type: file.type,
                name: file.name,
                size: file.size,
                mimeType: file.type,
                confidence: 95 // Simulated OCR confidence
              });
            };
            reader.readAsDataURL(file);
          } else {
            resolve(null);
          }
        };

        input.click();
      });
    } catch (error) {
      console.error('[Native] Document scanning failed:', error);
      return null;
    }
  }

  // Location Services
  async getCurrentLocation(
    options: {
      accuracy: 'low' | 'high';
      timeout: number;
      maximumAge: number;
    } = {
      accuracy: 'high',
      timeout: 15000,
      maximumAge: 60000
    }
  ): Promise<LocationData | null> {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
              timestamp: position.timestamp
            });
          },
          (error) => {
            console.error('[Native] Location error:', error);
            resolve(null);
          },
          {
            enableHighAccuracy: options.accuracy === 'high',
            timeout: options.timeout,
            maximumAge: options.maximumAge
          }
        );
      });
    } catch (error) {
      console.error('[Native] Location access failed:', error);
      return null;
    }
  }

  async startLocationTracking(
    callback: (location: LocationData) => void,
    options: { accuracy: 'low' | 'high'; interval: number } = {
      accuracy: 'high',
      interval: 30000
    }
  ): Promise<boolean> {
    try {
      if (!navigator.geolocation) return false;

      this.locationWatcher = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.error('[Native] Location tracking error:', error);
        },
        {
          enableHighAccuracy: options.accuracy === 'high',
          maximumAge: options.interval
        }
      );

      return true;
    } catch (error) {
      console.error('[Native] Location tracking failed:', error);
      return false;
    }
  }

  stopLocationTracking(): void {
    if (this.locationWatcher) {
      navigator.geolocation.clearWatch(this.locationWatcher);
      this.locationWatcher = null;
    }
  }

  // Secure Storage
  async storeSecureData(
    key: string,
    value: string,
    options: SecureStorageOptions = {}
  ): Promise<boolean> {
    try {
      // Use Web Crypto API for secure storage simulation
      if (options.requireBiometric) {
        const biometricResult = await this.authenticateWithBiometric(
          options.touchPrompt || 'Authenticate to store secure data'
        );

        if (!biometricResult.success) {
          return false;
        }
      }

      // In a real app, this would use platform-specific secure storage
      // For web, we'll use localStorage with encryption
      const encrypted = btoa(value); // Basic encoding for demo
      localStorage.setItem(`secure_${key}`, encrypted);

      return true;
    } catch (error) {
      console.error('[Native] Secure storage failed:', error);
      return false;
    }
  }

  async getSecureData(
    key: string,
    options: SecureStorageOptions = {}
  ): Promise<string | null> {
    try {
      if (options.requireBiometric) {
        const biometricResult = await this.authenticateWithBiometric(
          options.touchPrompt || 'Authenticate to access secure data'
        );

        if (!biometricResult.success) {
          return null;
        }
      }

      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;

      // Basic decoding for demo
      return atob(encrypted);
    } catch (error) {
      console.error('[Native] Secure data retrieval failed:', error);
      return null;
    }
  }

  // App State and Lifecycle
  addAppStateListener(
    callback: (state: 'active' | 'background' | 'inactive') => void
  ): () => void {
    const handleVisibilityChange = () => {
      const state = document.hidden ? 'background' : 'active';
      callback(state);
    };

    const handleBlur = () => callback('inactive');
    const handleFocus = () => callback('active');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }

  // Network Status
  getNetworkStatus(): {
    isConnected: boolean;
    type: string;
    isExpensive: boolean;
  } {
    return {
      isConnected: navigator.onLine,
      type: (navigator as any).connection?.effectiveType || 'unknown',
      isExpensive: (navigator as any).connection?.saveData || false
    };
  }

  addNetworkListener(
    callback: (status: { isConnected: boolean; type: string }) => void
  ): () => void {
    const handleOnline = () => callback({ isConnected: true, type: 'wifi' });
    const handleOffline = () => callback({ isConnected: false, type: 'none' });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  // Utility methods
  private async requestPermissions(): Promise<void> {
    // Request necessary permissions
    try {
      if ('permissions' in navigator) {
        const permissions = ['camera', 'microphone', 'geolocation', 'notifications'];

        for (const permission of permissions) {
          try {
            await (navigator.permissions as any).query({ name: permission });
          } catch (error) {
            // Permission not supported, continue
          }
        }
      }
    } catch (error) {
      console.error('[Native] Permission request failed:', error);
    }
  }

  private extractOSVersion(userAgent: string): string {
    const iosMatch = userAgent.match(/OS (\d+)_(\d+)/);
    const androidMatch = userAgent.match(/Android (\d+\.?\d*)/);

    if (iosMatch) return `${iosMatch[1]}.${iosMatch[2]}`;
    if (androidMatch) return androidMatch[1];

    return 'unknown';
  }

  private extractDeviceModel(userAgent: string): string {
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android.*?;\s*([^)]+)/);
      return match ? match[1] : 'Android Device';
    }
    return 'Unknown Device';
  }

  private detectNotch(): boolean {
    // Simplified notch detection
    if (typeof window === 'undefined') return false;
    return window.screen.height > 800 && window.devicePixelRatio >= 2;
  }

  private async checkBiometricSupport(): Promise<boolean> {
    return !!(navigator.credentials && 'create' in navigator.credentials);
  }

  private async checkCameraSupport(): Promise<boolean> {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
  }

  private async checkFingerprintSupport(): Promise<boolean> {
    return this.checkBiometricSupport();
  }

  private async checkFaceIdSupport(): Promise<boolean> {
    return /iPhone|iPad/.test(navigator.userAgent) && this.checkBiometricSupport();
  }

  private async checkTouchIdSupport(): Promise<boolean> {
    return /iPhone|iPad/.test(navigator.userAgent) && this.checkBiometricSupport();
  }
}

// Export singleton instance
export const nativeFeatures = NativeFeaturesManager.getInstance();

// Utility functions
export function isNativePlatform(): boolean {
  return /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return 'ios';
  if (/Android/.test(navigator.userAgent)) return 'android';
  return 'web';
}

export function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android|Mobile/.test(navigator.userAgent);
}

export function isTablet(): boolean {
  return /iPad/.test(navigator.userAgent) ||
         (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent));
}
