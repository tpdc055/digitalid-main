// Enhanced Security Framework - Video Consultation System
// WebRTC-based video calling for PNG Government Portal

import { auditLogger } from '@/lib/security/audit';

export interface VideoSession {
  id: string;
  citizenId: string;
  officerId: string;
  officerName: string;
  officerDepartment: string;
  serviceType: string;
  status: 'scheduled' | 'waiting' | 'connecting' | 'active' | 'completed' | 'cancelled';
  scheduledTime?: number;
  startTime?: number;
  endTime?: number;
  duration?: number;
  recordingEnabled: boolean;
  recordingId?: string;
  transcriptionEnabled: boolean;
  transcriptionId?: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  metadata: {
    applicationId?: string;
    documents: string[];
    notes: string[];
    resolution: string;
    qualityScore: number;
    networkQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export interface Officer {
  id: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  languages: string[];
  rating: number;
  totalConsultations: number;
  availableHours: {
    start: string;
    end: string;
    timezone: string;
  };
  isOnline: boolean;
  currentLoad: number; // Number of active sessions
}

export interface ConsultationSlot {
  id: string;
  officerId: string;
  date: string;
  time: string;
  duration: number; // minutes
  available: boolean;
  serviceTypes: string[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'citizen' | 'officer';
  content: string;
  timestamp: number;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface VideoQualityStats {
  videoResolution: string;
  videoFrameRate: number;
  videoBitrate: number;
  audioBitrate: number;
  packetLoss: number;
  latency: number;
  jitter: number;
  networkType: string;
  qualityScore: number; // 0-100
}

export interface ScreenShareSession {
  id: string;
  sessionId: string;
  sharedBy: 'citizen' | 'officer';
  startTime: number;
  endTime?: number;
  documentUrl?: string;
  annotations: ScreenAnnotation[];
}

export interface ScreenAnnotation {
  id: string;
  type: 'highlight' | 'arrow' | 'text' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  timestamp: number;
  authorId: string;
}

class VideoConsultationSystem {
  private static instance: VideoConsultationSystem;
  private activeSessions: Map<string, VideoSession> = new Map();
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStreams: Map<string, MediaStream> = new Map();
  private remoteStreams: Map<string, MediaStream> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();
  private officers: Map<string, Officer> = new Map();
  private availableSlots: Map<string, ConsultationSlot[]> = new Map();
  private socketConnection: WebSocket | null = null;

  private rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // In production, add TURN servers for better connectivity
      // {
      //   urls: 'turn:turnserver.example.com:3478',
      //   username: 'username',
      //   credential: 'password'
      // }
    ],
    iceCandidatePoolSize: 10
  };

  private constructor() {
    this.initializeVideoSystem();
    this.loadMockOfficers();
  }

  static getInstance(): VideoConsultationSystem {
    if (!this.instance) {
      this.instance = new VideoConsultationSystem();
    }
    return this.instance;
  }

  private initializeVideoSystem(): void {
    this.setupWebSocketConnection();

    auditLogger.logEvent({
      eventType: 'VIDEO_SYSTEM_INITIALIZED',
      category: 'system',
      severity: 'info',
      action: 'initialize',
      outcome: 'success',
      details: { rtcConfiguration: this.rtcConfiguration },
      tags: ['video', 'webrtc', 'initialization']
    });
  }

  private setupWebSocketConnection(): void {
    // In production, this would connect to a real signaling server
    try {
      // Simulate WebSocket connection for demo
      console.log('[Video] WebSocket signaling server connected');
    } catch (error) {
      console.error('[Video] Failed to connect to signaling server:', error);
    }
  }

  // Officer Management
  private loadMockOfficers(): void {
    const mockOfficers: Officer[] = [
      {
        id: 'officer_001',
        name: 'James Namaliu',
        title: 'Senior Government Officer',
        department: 'Civil Registration',
        specialties: ['Birth Certificates', 'Identity Documents', 'Citizenship'],
        languages: ['English', 'Tok Pisin', 'Hiri Motu'],
        rating: 4.8,
        totalConsultations: 1250,
        availableHours: {
          start: '08:00',
          end: '16:30',
          timezone: 'Pacific/Port_Moresby'
        },
        isOnline: true,
        currentLoad: 2
      },
      {
        id: 'officer_002',
        name: 'Mary Kila',
        title: 'Passport Services Officer',
        department: 'Immigration & Citizenship',
        specialties: ['Passport Applications', 'Travel Documents', 'Visa Services'],
        languages: ['English', 'Tok Pisin'],
        rating: 4.9,
        totalConsultations: 890,
        availableHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'Pacific/Port_Moresby'
        },
        isOnline: true,
        currentLoad: 1
      },
      {
        id: 'officer_003',
        name: 'Peter Waragu',
        title: 'Business Services Coordinator',
        department: 'Business Registration',
        specialties: ['Business Licenses', 'Company Registration', 'Trade Permits'],
        languages: ['English', 'Tok Pisin', 'Hiri Motu'],
        rating: 4.7,
        totalConsultations: 650,
        availableHours: {
          start: '08:30',
          end: '16:00',
          timezone: 'Pacific/Port_Moresby'
        },
        isOnline: false,
        currentLoad: 0
      }
    ];

    mockOfficers.forEach(officer => {
      this.officers.set(officer.id, officer);
    });
  }

  // Session Management
  async scheduleConsultation(
    citizenId: string,
    serviceType: string,
    preferredDate: string,
    preferredTime: string,
    officerId?: string,
    applicationId?: string
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Find available officer if not specified
      let selectedOfficer: Officer | undefined;

      if (officerId) {
        selectedOfficer = this.officers.get(officerId);
        if (!selectedOfficer) {
          return { success: false, error: 'Officer not found' };
        }
      } else {
        // Auto-select best available officer
        selectedOfficer = this.findBestAvailableOfficer(serviceType);
        if (!selectedOfficer) {
          return { success: false, error: 'No officers available for this service' };
        }
      }

      const sessionId = this.generateSessionId();
      const scheduledTime = new Date(`${preferredDate}T${preferredTime}`).getTime();

      const session: VideoSession = {
        id: sessionId,
        citizenId,
        officerId: selectedOfficer.id,
        officerName: selectedOfficer.name,
        officerDepartment: selectedOfficer.department,
        serviceType,
        status: 'scheduled',
        scheduledTime,
        recordingEnabled: true,
        transcriptionEnabled: true,
        chatEnabled: true,
        screenShareEnabled: true,
        metadata: {
          applicationId,
          documents: [],
          notes: [],
          resolution: '720p',
          qualityScore: 0,
          networkQuality: 'excellent'
        }
      };

      this.activeSessions.set(sessionId, session);

      auditLogger.logEvent({
        eventType: 'VIDEO_CONSULTATION_SCHEDULED',
        category: 'system',
        severity: 'info',
        userId: citizenId,
        action: 'schedule_consultation',
        outcome: 'success',
        details: {
          sessionId,
          officerId: selectedOfficer.id,
          serviceType,
          scheduledTime
        },
        tags: ['video', 'scheduling']
      });

      return { success: true, sessionId };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule consultation'
      };
    }
  }

  async startConsultation(sessionId: string, userId: string): Promise<MediaStream | null> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      if (session.status !== 'scheduled' && session.status !== 'waiting') {
        throw new Error('Session is not available to start');
      }

      // Update session status
      session.status = 'connecting';
      session.startTime = Date.now();

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.localStreams.set(sessionId, stream);

      // Create peer connection
      const peerConnection = new RTCPeerConnection(this.rtcConfiguration);
      this.peerConnections.set(sessionId, peerConnection);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        this.remoteStreams.set(sessionId, remoteStream);
        session.status = 'active';
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In production, send to signaling server
          console.log('[Video] ICE candidate:', event.candidate);
        }
      };

      // Monitor connection quality
      this.startQualityMonitoring(sessionId, peerConnection);

      auditLogger.logEvent({
        eventType: 'VIDEO_CONSULTATION_STARTED',
        category: 'system',
        severity: 'info',
        userId,
        sessionId,
        action: 'start_consultation',
        outcome: 'success',
        details: { sessionId },
        tags: ['video', 'consultation']
      });

      return stream;

    } catch (error) {
      auditLogger.logEvent({
        eventType: 'VIDEO_CONSULTATION_START_FAILED',
        category: 'system',
        severity: 'error',
        userId,
        sessionId,
        action: 'start_consultation',
        outcome: 'failure',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        tags: ['video', 'error']
      });

      return null;
    }
  }

  async endConsultation(sessionId: string, userId: string): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) return false;

      // Update session
      session.status = 'completed';
      session.endTime = Date.now();
      if (session.startTime) {
        session.duration = session.endTime - session.startTime;
      }

      // Clean up media streams
      const localStream = this.localStreams.get(sessionId);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        this.localStreams.delete(sessionId);
      }

      const remoteStream = this.remoteStreams.get(sessionId);
      if (remoteStream) {
        this.remoteStreams.delete(sessionId);
      }

      // Close peer connection
      const peerConnection = this.peerConnections.get(sessionId);
      if (peerConnection) {
        peerConnection.close();
        this.peerConnections.delete(sessionId);
      }

      auditLogger.logEvent({
        eventType: 'VIDEO_CONSULTATION_ENDED',
        category: 'system',
        severity: 'info',
        userId,
        sessionId,
        action: 'end_consultation',
        outcome: 'success',
        details: {
          duration: session.duration,
          qualityScore: session.metadata.qualityScore
        },
        tags: ['video', 'consultation']
      });

      return true;

    } catch (error) {
      console.error('[Video] Failed to end consultation:', error);
      return false;
    }
  }

  // Screen Sharing
  async startScreenShare(sessionId: string, userId: string): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      const peerConnection = this.peerConnections.get(sessionId);
      if (peerConnection) {
        // Replace video track with screen share
        const videoSender = peerConnection.getSenders().find(sender =>
          sender.track && sender.track.kind === 'video'
        );

        if (videoSender && screenStream.getVideoTracks()[0]) {
          await videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }
      }

      auditLogger.logEvent({
        eventType: 'SCREEN_SHARE_STARTED',
        category: 'system',
        severity: 'info',
        userId,
        sessionId,
        action: 'start_screen_share',
        outcome: 'success',
        details: { sessionId },
        tags: ['video', 'screen-share']
      });

      return screenStream;

    } catch (error) {
      console.error('[Video] Screen share failed:', error);
      return null;
    }
  }

  async stopScreenShare(sessionId: string, userId: string): Promise<boolean> {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      const peerConnection = this.peerConnections.get(sessionId);
      if (peerConnection && cameraStream.getVideoTracks()[0]) {
        const videoSender = peerConnection.getSenders().find(sender =>
          sender.track && sender.track.kind === 'video'
        );

        if (videoSender) {
          await videoSender.replaceTrack(cameraStream.getVideoTracks()[0]);
        }
      }

      auditLogger.logEvent({
        eventType: 'SCREEN_SHARE_STOPPED',
        category: 'system',
        severity: 'info',
        userId,
        sessionId,
        action: 'stop_screen_share',
        outcome: 'success',
        details: { sessionId },
        tags: ['video', 'screen-share']
      });

      return true;

    } catch (error) {
      console.error('[Video] Failed to stop screen share:', error);
      return false;
    }
  }

  // Chat System
  async sendChatMessage(
    sessionId: string,
    senderId: string,
    senderType: 'citizen' | 'officer',
    content: string,
    type: 'text' | 'file' = 'text',
    fileData?: { url: string; name: string; size: number }
  ): Promise<ChatMessage> {
    const messageId = this.generateMessageId();

    const message: ChatMessage = {
      id: messageId,
      sessionId,
      senderId,
      senderType,
      content,
      timestamp: Date.now(),
      type,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      fileSize: fileData?.size
    };

    // Store message
    const sessionMessages = this.chatMessages.get(sessionId) || [];
    sessionMessages.push(message);
    this.chatMessages.set(sessionId, sessionMessages);

    auditLogger.logEvent({
      eventType: 'CHAT_MESSAGE_SENT',
      category: 'system',
      severity: 'info',
      userId: senderId,
      sessionId,
      action: 'send_message',
      outcome: 'success',
      details: { messageType: type, contentLength: content.length },
      tags: ['video', 'chat']
    });

    return message;
  }

  getChatMessages(sessionId: string): ChatMessage[] {
    return this.chatMessages.get(sessionId) || [];
  }

  // Quality Monitoring
  private startQualityMonitoring(sessionId: string, peerConnection: RTCPeerConnection): void {
    const interval = setInterval(async () => {
      try {
        const stats = await peerConnection.getStats();
        const qualityStats = this.analyzeConnectionStats(stats);

        const session = this.activeSessions.get(sessionId);
        if (session) {
          session.metadata.qualityScore = qualityStats.qualityScore;
          session.metadata.networkQuality = this.getNetworkQualityLabel(qualityStats.qualityScore);
        }

        // Stop monitoring if session is not active
        if (!session || session.status !== 'active') {
          clearInterval(interval);
        }

      } catch (error) {
        console.error('[Video] Quality monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  private analyzeConnectionStats(stats: RTCStatsReport): VideoQualityStats {
    let videoBitrate = 0;
    let audioBitrate = 0;
    let packetLoss = 0;
    let latency = 0;
    let jitter = 0;

    stats.forEach((stat) => {
      if (stat.type === 'outbound-rtp' && stat.kind === 'video') {
        videoBitrate = stat.bytesSent || 0;
      }
      if (stat.type === 'outbound-rtp' && stat.kind === 'audio') {
        audioBitrate = stat.bytesSent || 0;
      }
      if (stat.type === 'inbound-rtp') {
        packetLoss = stat.packetsLost || 0;
        jitter = stat.jitter || 0;
      }
      if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
        latency = stat.currentRoundTripTime || 0;
      }
    });

    // Calculate quality score (0-100)
    let qualityScore = 100;
    if (packetLoss > 0.05) qualityScore -= 30; // High packet loss
    if (latency > 0.3) qualityScore -= 20; // High latency
    if (videoBitrate < 500000) qualityScore -= 25; // Low bitrate

    return {
      videoResolution: '720p', // Would be detected from actual stream
      videoFrameRate: 30,
      videoBitrate,
      audioBitrate,
      packetLoss,
      latency: latency * 1000, // Convert to ms
      jitter,
      networkType: this.detectNetworkType(),
      qualityScore: Math.max(0, qualityScore)
    };
  }

  private getNetworkQualityLabel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  private detectNetworkType(): string {
    const connection = (navigator as any).connection;
    return connection?.effectiveType || 'unknown';
  }

  // Utility methods
  private findBestAvailableOfficer(serviceType: string): Officer | undefined {
    const availableOfficers = Array.from(this.officers.values())
      .filter(officer =>
        officer.isOnline &&
        officer.currentLoad < 3 && // Max 3 concurrent sessions
        officer.specialties.some(specialty =>
          specialty.toLowerCase().includes(serviceType.toLowerCase())
        )
      )
      .sort((a, b) => {
        // Sort by rating and current load
        const scoreA = a.rating - (a.currentLoad * 0.2);
        const scoreB = b.rating - (b.currentLoad * 0.2);
        return scoreB - scoreA;
      });

    return availableOfficers[0];
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Public API methods
  getAvailableOfficers(serviceType?: string): Officer[] {
    const officers = Array.from(this.officers.values());

    if (serviceType) {
      return officers.filter(officer =>
        officer.specialties.some(specialty =>
          specialty.toLowerCase().includes(serviceType.toLowerCase())
        )
      );
    }

    return officers;
  }

  getSession(sessionId: string): VideoSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  getActiveSessions(userId: string): VideoSession[] {
    return Array.from(this.activeSessions.values())
      .filter(session =>
        session.citizenId === userId || session.officerId === userId
      );
  }

  async getSessionRecording(sessionId: string): Promise<string | null> {
    // In production, this would retrieve the recording from storage
    const session = this.activeSessions.get(sessionId);
    return session?.recordingId || null;
  }

  async getSessionTranscription(sessionId: string): Promise<string | null> {
    // In production, this would retrieve the transcription from storage
    const session = this.activeSessions.get(sessionId);
    return session?.transcriptionId || null;
  }
}

// Export singleton instance
export const videoConsultation = VideoConsultationSystem.getInstance();

// Utility functions
export function isWebRTCSupported(): boolean {
  return !!(
    window.RTCPeerConnection &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}

export function getVideoConstraints(quality: 'low' | 'medium' | 'high') {
  const constraints = {
    low: { width: 640, height: 480, frameRate: 15 },
    medium: { width: 1280, height: 720, frameRate: 30 },
    high: { width: 1920, height: 1080, frameRate: 30 }
  };

  return {
    video: {
      width: { ideal: constraints[quality].width },
      height: { ideal: constraints[quality].height },
      frameRate: { ideal: constraints[quality].frameRate }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
}
