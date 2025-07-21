import { z } from 'zod';

export interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: string;
  category: 'authentication' | 'authorization' | 'data_access' | 'system' | 'security' | 'compliance';
  severity: 'info' | 'warning' | 'error' | 'critical';
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action: string;
  outcome: 'success' | 'failure' | 'blocked';
  details: Record<string, any>;
  tags: string[];
  correlationId?: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: string;
  detectedAt: number;
  resolvedAt?: number;
  affectedResources: string[];
  relatedEvents: string[];
  assignedTo?: string;
  notes: string[];
  mitigationSteps: string[];
}

export interface AuditFilter {
  startTime?: number;
  endTime?: number;
  eventTypes?: string[];
  categories?: string[];
  severities?: string[];
  userIds?: string[];
  outcomes?: string[];
  ipAddresses?: string[];
  limit?: number;
  offset?: number;
}

export interface AuditMetrics {
  totalEvents: number;
  eventsLast24h: number;
  eventsLast7d: number;
  failureRate: number;
  topEventTypes: { type: string; count: number }[];
  securityEvents: number;
  activeIncidents: number;
  averageResponseTime: number;
  complianceScore: number;
}

export interface ThreatDetection {
  id: string;
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  pattern: RegExp | string;
  enabled: boolean;
  threshold: number;
  timeWindow: number; // minutes
  actions: ('log' | 'alert' | 'block' | 'notify')[];
  lastTriggered?: number;
  triggerCount: number;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private events: Map<string, AuditEvent> = new Map();
  private incidents: Map<string, SecurityIncident> = new Map();
  private threatDetections: Map<string, ThreatDetection> = new Map();
  private maxEvents: number = 1000000; // Maximum events to store
  private retentionPeriod: number = 90 * 24 * 60 * 60 * 1000; // 90 days

  private constructor() {
    this.initializeThreatDetections();
    this.startBackgroundTasks();
  }

  static getInstance(): AuditLogger {
    if (!this.instance) {
      this.instance = new AuditLogger();
    }
    return this.instance;
  }

  private initializeThreatDetections(): void {
    const detections: ThreatDetection[] = [
      {
        id: 'brute_force_login',
        name: 'Brute Force Login Attempt',
        description: 'Multiple failed login attempts from same IP',
        severity: 'error',
        pattern: 'LOGIN_FAILED',
        enabled: true,
        threshold: 5,
        timeWindow: 15,
        actions: ['log', 'alert', 'block'],
        triggerCount: 0
      },
      {
        id: 'privilege_escalation',
        name: 'Privilege Escalation Attempt',
        description: 'User attempting to access resources above their privilege level',
        severity: 'critical',
        pattern: 'AUTHORIZATION_FAILED',
        enabled: true,
        threshold: 3,
        timeWindow: 5,
        actions: ['log', 'alert', 'notify'],
        triggerCount: 0
      },
      {
        id: 'data_exfiltration',
        name: 'Potential Data Exfiltration',
        description: 'Large amounts of data being accessed or downloaded',
        severity: 'error',
        pattern: 'DATA_EXPORT',
        enabled: true,
        threshold: 10,
        timeWindow: 60,
        actions: ['log', 'alert'],
        triggerCount: 0
      },
      {
        id: 'suspicious_ip',
        name: 'Suspicious IP Address',
        description: 'Access from known malicious IP addresses',
        severity: 'warning',
        pattern: /^(10\.0\.0\.|192\.168\.|172\.16\.)/,
        enabled: true,
        threshold: 1,
        timeWindow: 1,
        actions: ['log', 'alert'],
        triggerCount: 0
      },
      {
        id: 'off_hours_access',
        name: 'Off-Hours Access',
        description: 'System access during non-business hours',
        severity: 'warning',
        pattern: 'LOGIN_SUCCESS',
        enabled: true,
        threshold: 1,
        timeWindow: 1,
        actions: ['log'],
        triggerCount: 0
      }
    ];

    detections.forEach(detection => {
      this.threatDetections.set(detection.id, detection);
    });

    this.logEvent({
      eventType: 'THREAT_DETECTIONS_INITIALIZED',
      category: 'system',
      severity: 'info',
      action: 'initialize',
      outcome: 'success',
      details: { detectionsCount: detections.length },
      tags: ['initialization', 'threat-detection']
    });
  }

  // Log a security event
  logEvent(eventData: {
    eventType: string;
    category: AuditEvent['category'];
    severity: AuditEvent['severity'];
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    resource?: string;
    action: string;
    outcome: AuditEvent['outcome'];
    details: Record<string, any>;
    tags: string[];
    correlationId?: string;
  }): string {
    const eventId = this.generateEventId();
    const timestamp = Date.now();

    const auditEvent: AuditEvent = {
      id: eventId,
      timestamp,
      ...eventData
    };

    this.events.set(eventId, auditEvent);

    // Check for threat patterns
    this.checkThreatPatterns(auditEvent);

    // Cleanup old events if needed
    this.cleanupOldEvents();

    // Log to console for development
    console.log(`[AUDIT] ${auditEvent.eventType}:`, {
      id: eventId,
      timestamp: new Date(timestamp).toISOString(),
      severity: auditEvent.severity,
      outcome: auditEvent.outcome,
      details: auditEvent.details
    });

    return eventId;
  }

  // Check for threat patterns in events
  private checkThreatPatterns(event: AuditEvent): void {
    for (const detection of this.threatDetections.values()) {
      if (!detection.enabled) continue;

      let matched = false;

      if (typeof detection.pattern === 'string') {
        matched = event.eventType === detection.pattern;
      } else if (detection.pattern instanceof RegExp) {
        matched = detection.pattern.test(event.ipAddress || '');
      }

      if (matched) {
        this.processThreatDetection(detection, event);
      }
    }
  }

  private processThreatDetection(detection: ThreatDetection, event: AuditEvent): void {
    const timeWindow = detection.timeWindow * 60 * 1000; // Convert to milliseconds
    const windowStart = Date.now() - timeWindow;

    // Count matching events in time window
    const matchingEvents = Array.from(this.events.values()).filter(e => {
      if (e.timestamp < windowStart) return false;

      if (typeof detection.pattern === 'string') {
        return e.eventType === detection.pattern && e.ipAddress === event.ipAddress;
      } else if (detection.pattern instanceof RegExp) {
        return detection.pattern.test(e.ipAddress || '');
      }

      return false;
    });

    if (matchingEvents.length >= detection.threshold) {
      this.triggerThreatResponse(detection, event, matchingEvents);
    }
  }

  private triggerThreatResponse(detection: ThreatDetection, triggerEvent: AuditEvent, relatedEvents: AuditEvent[]): void {
    detection.lastTriggered = Date.now();
    detection.triggerCount++;

    // Create security incident
    const incident = this.createSecurityIncident(detection, triggerEvent, relatedEvents);

    // Execute configured actions
    detection.actions.forEach(action => {
      switch (action) {
        case 'log':
          this.logEvent({
            eventType: 'THREAT_DETECTED',
            category: 'security',
            severity: detection.severity,
            userId: triggerEvent.userId,
            sessionId: triggerEvent.sessionId,
            ipAddress: triggerEvent.ipAddress,
            action: 'threat_detection',
            outcome: 'success',
            details: {
              detectionId: detection.id,
              detectionName: detection.name,
              incidentId: incident.id,
              relatedEventsCount: relatedEvents.length
            },
            tags: ['threat-detection', 'security-incident']
          });
          break;

        case 'alert':
          this.sendSecurityAlert(detection, incident);
          break;

        case 'block':
          this.blockSuspiciousActivity(triggerEvent);
          break;

        case 'notify':
          this.notifySecurityTeam(detection, incident);
          break;
      }
    });
  }

  private createSecurityIncident(detection: ThreatDetection, triggerEvent: AuditEvent, relatedEvents: AuditEvent[]): SecurityIncident {
    const incidentId = this.generateIncidentId();

    const incident: SecurityIncident = {
      id: incidentId,
      title: `${detection.name} - ${triggerEvent.ipAddress}`,
      description: `${detection.description}. Detected ${relatedEvents.length} related events.`,
      severity: detection.severity,
      status: 'open',
      category: detection.name.toLowerCase().replace(/\s+/g, '_'),
      detectedAt: Date.now(),
      affectedResources: [triggerEvent.resource || 'unknown'],
      relatedEvents: relatedEvents.map(e => e.id),
      notes: [],
      mitigationSteps: this.generateMitigationSteps(detection)
    };

    this.incidents.set(incidentId, incident);
    return incident;
  }

  private generateMitigationSteps(detection: ThreatDetection): string[] {
    const steps: Record<string, string[]> = {
      brute_force_login: [
        'Block IP address temporarily',
        'Review affected user accounts',
        'Force password reset if necessary',
        'Enable additional monitoring for the IP range'
      ],
      privilege_escalation: [
        'Review user permissions immediately',
        'Audit recent access logs for the user',
        'Temporarily restrict user access',
        'Investigate potential account compromise'
      ],
      data_exfiltration: [
        'Monitor data access patterns',
        'Review data export logs',
        'Check for unauthorized file transfers',
        'Verify data classification compliance'
      ],
      suspicious_ip: [
        'Check IP reputation databases',
        'Review all activities from this IP',
        'Consider adding to blocklist',
        'Monitor for continued activity'
      ],
      off_hours_access: [
        'Verify legitimate business need',
        'Check with user manager',
        'Review access patterns',
        'Update access policies if needed'
      ]
    };

    return steps[detection.id] || ['Investigate the incident', 'Review related logs', 'Take appropriate action'];
  }

  private sendSecurityAlert(detection: ThreatDetection, incident: SecurityIncident): void {
    // In a real implementation, this would send alerts via email, SMS, or other channels
    console.log(`[SECURITY_ALERT] ${detection.name}:`, {
      incidentId: incident.id,
      severity: incident.severity,
      description: incident.description,
      timestamp: new Date().toISOString()
    });
  }

  private blockSuspiciousActivity(event: AuditEvent): void {
    // In a real implementation, this would interface with firewall/security systems
    this.logEvent({
      eventType: 'IP_BLOCKED',
      category: 'security',
      severity: 'warning',
      ipAddress: event.ipAddress,
      action: 'block_ip',
      outcome: 'success',
      details: {
        blockedIp: event.ipAddress,
        reason: 'suspicious_activity',
        originalEventId: event.id
      },
      tags: ['ip-blocking', 'security-response']
    });
  }

  private notifySecurityTeam(detection: ThreatDetection, incident: SecurityIncident): void {
    // In a real implementation, this would notify the security team
    console.log(`[SECURITY_NOTIFICATION] Incident ${incident.id} requires attention`);
  }

  // Query audit events
  queryEvents(filter: AuditFilter = {}): { events: AuditEvent[]; total: number } {
    let filteredEvents = Array.from(this.events.values());

    // Apply filters
    if (filter.startTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.startTime!);
    }
    if (filter.endTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.endTime!);
    }
    if (filter.eventTypes?.length) {
      filteredEvents = filteredEvents.filter(e => filter.eventTypes!.includes(e.eventType));
    }
    if (filter.categories?.length) {
      filteredEvents = filteredEvents.filter(e => filter.categories!.includes(e.category));
    }
    if (filter.severities?.length) {
      filteredEvents = filteredEvents.filter(e => filter.severities!.includes(e.severity));
    }
    if (filter.userIds?.length) {
      filteredEvents = filteredEvents.filter(e => e.userId && filter.userIds!.includes(e.userId));
    }
    if (filter.outcomes?.length) {
      filteredEvents = filteredEvents.filter(e => filter.outcomes!.includes(e.outcome));
    }
    if (filter.ipAddresses?.length) {
      filteredEvents = filteredEvents.filter(e => e.ipAddress && filter.ipAddresses!.includes(e.ipAddress));
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);

    const total = filteredEvents.length;

    // Apply pagination
    const offset = filter.offset || 0;
    const limit = filter.limit || 100;
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return { events: paginatedEvents, total };
  }

  // Get audit metrics
  getAuditMetrics(): AuditMetrics {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    const allEvents = Array.from(this.events.values());
    const eventsLast24h = allEvents.filter(e => e.timestamp >= last24h).length;
    const eventsLast7d = allEvents.filter(e => e.timestamp >= last7d).length;

    const failedEvents = allEvents.filter(e => e.outcome === 'failure').length;
    const failureRate = allEvents.length > 0 ? (failedEvents / allEvents.length) * 100 : 0;

    // Calculate top event types
    const eventTypeCounts = new Map<string, number>();
    allEvents.forEach(event => {
      const count = eventTypeCounts.get(event.eventType) || 0;
      eventTypeCounts.set(event.eventType, count + 1);
    });

    const topEventTypes = Array.from(eventTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const securityEvents = allEvents.filter(e => e.category === 'security').length;
    const activeIncidents = Array.from(this.incidents.values()).filter(i => i.status !== 'closed').length;

    return {
      totalEvents: allEvents.length,
      eventsLast24h,
      eventsLast7d,
      failureRate: Math.round(failureRate * 100) / 100,
      topEventTypes,
      securityEvents,
      activeIncidents,
      averageResponseTime: this.calculateAverageResponseTime(),
      complianceScore: this.calculateComplianceScore()
    };
  }

  // Get security incidents
  getSecurityIncidents(status?: string): SecurityIncident[] {
    const incidents = Array.from(this.incidents.values());
    if (status) {
      return incidents.filter(i => i.status === status);
    }
    return incidents.sort((a, b) => b.detectedAt - a.detectedAt);
  }

  // Update incident status
  updateIncident(incidentId: string, updates: Partial<SecurityIncident>): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    Object.assign(incident, updates);

    if (updates.status === 'resolved' || updates.status === 'closed') {
      incident.resolvedAt = Date.now();
    }

    this.logEvent({
      eventType: 'INCIDENT_UPDATED',
      category: 'security',
      severity: 'info',
      action: 'update_incident',
      outcome: 'success',
      details: {
        incidentId,
        updates,
        status: incident.status
      },
      tags: ['incident-management']
    });

    return true;
  }

  // Get threat detections status
  getThreatDetections(): ThreatDetection[] {
    return Array.from(this.threatDetections.values());
  }

  // Update threat detection configuration
  updateThreatDetection(detectionId: string, updates: Partial<ThreatDetection>): boolean {
    const detection = this.threatDetections.get(detectionId);
    if (!detection) return false;

    Object.assign(detection, updates);

    this.logEvent({
      eventType: 'THREAT_DETECTION_UPDATED',
      category: 'system',
      severity: 'info',
      action: 'update_threat_detection',
      outcome: 'success',
      details: {
        detectionId,
        updates
      },
      tags: ['threat-detection', 'configuration']
    });

    return true;
  }

  private calculateAverageResponseTime(): number {
    const resolvedIncidents = Array.from(this.incidents.values())
      .filter(i => i.resolvedAt);

    if (resolvedIncidents.length === 0) return 0;

    const totalTime = resolvedIncidents.reduce((sum, incident) => {
      return sum + (incident.resolvedAt! - incident.detectedAt);
    }, 0);

    return Math.round(totalTime / resolvedIncidents.length / (60 * 1000)); // minutes
  }

  private calculateComplianceScore(): number {
    // Calculate compliance score based on various factors
    const metrics = this.getAuditMetrics();
    let score = 100;

    // Deduct points for failures
    score -= Math.min(metrics.failureRate * 2, 30);

    // Deduct points for active incidents
    score -= Math.min(metrics.activeIncidents * 5, 25);

    // Deduct points if no recent events (might indicate logging issues)
    if (metrics.eventsLast24h === 0) {
      score -= 20;
    }

    return Math.max(0, Math.round(score));
  }

  private cleanupOldEvents(): void {
    if (this.events.size <= this.maxEvents) return;

    const cutoffTime = Date.now() - this.retentionPeriod;
    const eventsToDelete: string[] = [];

    for (const [eventId, event] of this.events.entries()) {
      if (event.timestamp < cutoffTime || eventsToDelete.length < (this.events.size - this.maxEvents)) {
        eventsToDelete.push(eventId);
      }
    }

    eventsToDelete.forEach(eventId => {
      this.events.delete(eventId);
    });

    if (eventsToDelete.length > 0) {
      this.logEvent({
        eventType: 'AUDIT_CLEANUP',
        category: 'system',
        severity: 'info',
        action: 'cleanup_events',
        outcome: 'success',
        details: {
          deletedCount: eventsToDelete.length,
          remainingCount: this.events.size
        },
        tags: ['maintenance', 'cleanup']
      });
    }
  }

  private startBackgroundTasks(): void {
    // Cleanup old events every hour
    setInterval(() => {
      this.cleanupOldEvents();
    }, 60 * 60 * 1000);

    // Log health check every 15 minutes
    setInterval(() => {
      this.logEvent({
        eventType: 'HEALTH_CHECK',
        category: 'system',
        severity: 'info',
        action: 'health_check',
        outcome: 'success',
        details: {
          totalEvents: this.events.size,
          totalIncidents: this.incidents.size,
          uptime: Date.now()
        },
        tags: ['health', 'monitoring']
      });
    }, 15 * 60 * 1000);
  }

  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateIncidentId(): string {
    return `incident_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();
