export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  whatsapp?: boolean;
}

export interface Notification {
  id: string;
  type: 'application_status' | 'payment' | 'document_ready' | 'appointment' | 'system' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface SMSTemplate {
  type: string;
  template: {
    en: string;
    tpi: string;
    ho: string;
  };
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  isActive: boolean;
  config: Record<string, any>;
}

// PNG Telecom providers for SMS delivery
export const PNG_SMS_PROVIDERS = [
  {
    id: 'digicel_png',
    name: 'Digicel PNG',
    gateway: 'https://api.digicel.com.pg/sms',
    prefixes: ['7', '8'],
    isActive: true
  },
  {
    id: 'bmobile_png',
    name: 'bmobile Vodafone PNG',
    gateway: 'https://api.bmobile.com.pg/sms',
    prefixes: ['9'],
    isActive: true
  },
  {
    id: 'telikom_png',
    name: 'Telikom PNG',
    gateway: 'https://api.telikom.com.pg/sms',
    prefixes: ['3', '4'],
    isActive: true
  }
];

// SMS Templates for different notification types
export const SMS_TEMPLATES: Record<string, SMSTemplate> = {
  application_submitted: {
    type: 'application_submitted',
    template: {
      en: 'Your {serviceType} application #{applicationId} has been submitted successfully. Track status at: {trackingUrl}',
      tpi: 'Yu application bilong {serviceType} #{applicationId} go pinis gut. Lukluk long: {trackingUrl}',
      ho: 'Oi {serviceType} application #{applicationId} hau henia. Matahari long: {trackingUrl}'
    }
  },
  application_processing: {
    type: 'application_processing',
    template: {
      en: 'Your {serviceType} application #{applicationId} is now being processed. Est. completion: {estimatedDate}',
      tpi: 'Ol i wokim yu application bilong {serviceType} #{applicationId} nau. Bai pinis long: {estimatedDate}',
      ho: 'Oi {serviceType} application #{applicationId} hanua nau. Henia taim: {estimatedDate}'
    }
  },
  payment_required: {
    type: 'payment_required',
    template: {
      en: 'Payment required for {serviceType} application #{applicationId}. Amount: K{amount}. Pay at: {paymentUrl}',
      tpi: 'Yu mas peim K{amount} long {serviceType} application #{applicationId}. Peim long: {paymentUrl}',
      ho: 'Idua pei banee K{amount} muduka {serviceType} application #{applicationId}. Pei long: {paymentUrl}'
    }
  },
  payment_completed: {
    type: 'payment_completed',
    template: {
      en: 'Payment of K{amount} received for application #{applicationId}. Processing will continue.',
      tpi: 'Mipela kisim K{amount} long application #{applicationId}. Bai kontiniu wokim.',
      ho: 'Mada kisim banee K{amount} muduka application #{applicationId}. Bai rau hanua.'
    }
  },
  document_ready: {
    type: 'document_ready',
    template: {
      en: 'Your {documentType} is ready for download. Access: {downloadUrl} Expires: {expiryDate}',
      tpi: 'Yu {documentType} redi nau. Kisim long: {downloadUrl} Pinis long: {expiryDate}',
      ho: 'Oi {documentType} redi nau. Muduka long: {downloadUrl} Pinis long: {expiryDate}'
    }
  },
  appointment_reminder: {
    type: 'appointment_reminder',
    template: {
      en: 'Reminder: {serviceType} appointment tomorrow at {time} at {location}. Bring: {requirements}',
      tpi: 'Lukautim: {serviceType} appointment tumoro long {time} long {location}. Bringim: {requirements}',
      ho: 'Daunamira: {serviceType} appointment avei long {time} long {location}. Lao mai: {requirements}'
    }
  },
  biometric_setup_complete: {
    type: 'biometric_setup_complete',
    template: {
      en: 'Biometric authentication setup complete. Your account is now more secure.',
      tpi: 'Biometric authentication setup pinis. Akaun bilong yu i save nau.',
      ho: 'Biometric authentication setup henia. Oi account i namona secure nau.'
    }
  }
};

export class NotificationSystem {
  private static notifications: Notification[] = [];
  private static eventListeners: Map<string, Function[]> = new Map();

  // Real-time notification management
  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notification
    };

    this.notifications.unshift(newNotification);

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Trigger event listeners
    this.triggerEvent('notification_added', newNotification);

    return id;
  }

  static getNotifications(citizenId: string, unreadOnly: boolean = false): Notification[] {
    let filtered = this.notifications;

    if (unreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.triggerEvent('notification_read', notification);
      return true;
    }
    return false;
  }

  static markAllAsRead(citizenId: string): number {
    let count = 0;
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        count++;
      }
    });

    if (count > 0) {
      this.triggerEvent('notifications_read_all', { count });
    }

    return count;
  }

  // SMS Notification System
  static async sendSMS(
    phoneNumber: string,
    message: string,
    priority: 'normal' | 'high' = 'normal'
  ): Promise<boolean> {
    try {
      const provider = this.selectSMSProvider(phoneNumber);
      if (!provider) {
        console.error('No SMS provider available for phone number:', phoneNumber);
        return false;
      }

      const smsPayload = {
        to: this.formatPhoneNumber(phoneNumber),
        message: message.substring(0, 160), // SMS character limit
        priority,
        timestamp: new Date().toISOString()
      };

      // Simulate SMS sending (in production, would call actual SMS API)
      console.log(`Sending SMS via ${provider.name}:`, smsPayload);

      // Log SMS for audit trail
      this.logSMSActivity(phoneNumber, message, provider.id, 'sent');

      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      this.logSMSActivity(phoneNumber, message, 'unknown', 'failed');
      return false;
    }
  }

  static async sendTemplatedSMS(
    phoneNumber: string,
    templateType: string,
    variables: Record<string, string>,
    language: 'en' | 'tpi' | 'ho' = 'en'
  ): Promise<boolean> {
    const template = SMS_TEMPLATES[templateType];
    if (!template) {
      console.error('SMS template not found:', templateType);
      return false;
    }

    let message = template.template[language];

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return this.sendSMS(phoneNumber, message, 'normal');
  }

  // Application Status Tracking
  static async trackApplicationStatus(applicationId: string, newStatus: string, metadata?: Record<string, any>): Promise<void> {
    const notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> = {
      type: 'application_status',
      title: 'Application Status Update',
      message: `Your application #${applicationId} status has been updated to: ${newStatus}`,
      priority: 'medium',
      actionUrl: `/applications/${applicationId}`,
      actionText: 'View Details',
      metadata: { applicationId, newStatus, ...metadata }
    };

    const notificationId = this.addNotification(notification);

    // Send SMS notification if enabled
    if (metadata?.citizenId && metadata?.phoneNumber) {
      await this.sendApplicationStatusSMS(
        metadata.phoneNumber,
        applicationId,
        newStatus,
        metadata.serviceType,
        metadata.language || 'en'
      );
    }

    // Trigger webhook for external integrations
    this.triggerStatusWebhook(applicationId, newStatus, metadata);
  }

  private static async sendApplicationStatusSMS(
    phoneNumber: string,
    applicationId: string,
    status: string,
    serviceType: string,
    language: string
  ): Promise<void> {
    const templateMap: Record<string, string> = {
      'submitted': 'application_submitted',
      'processing': 'application_processing',
      'payment_required': 'payment_required',
      'completed': 'document_ready',
      'approved': 'document_ready'
    };

    const templateType = templateMap[status.toLowerCase()];
    if (templateType) {
      await this.sendTemplatedSMS(phoneNumber, templateType, {
        applicationId,
        serviceType,
        trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/track/${applicationId}`
      }, language as 'en' | 'tpi' | 'ho');
    }
  }

  // Event System for Real-time Updates
  static addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  static removeEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private static triggerEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }
  }

  // WhatsApp Integration (if available)
  static async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Integrate with WhatsApp Business API if available in PNG
      const whatsappAPI = process.env.WHATSAPP_API_URL;
      if (!whatsappAPI) {
        console.log('WhatsApp API not configured');
        return false;
      }

      // Would implement WhatsApp Business API integration
      console.log('Sending WhatsApp message:', { phoneNumber, message });
      return true;
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return false;
    }
  }

  // Utility Methods
  private static selectSMSProvider(phoneNumber: string): typeof PNG_SMS_PROVIDERS[0] | null {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const prefix = cleanNumber.slice(-7, -6); // Get the network prefix

    return PNG_SMS_PROVIDERS.find(provider =>
      provider.isActive && provider.prefixes.includes(prefix)
    ) || PNG_SMS_PROVIDERS.find(provider => provider.isActive) || null;
  }

  private static formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Add PNG country code if not present
    if (!cleaned.startsWith('675') && cleaned.length === 7) {
      cleaned = '675' + cleaned;
    }

    return '+' + cleaned;
  }

  private static logSMSActivity(phoneNumber: string, message: string, provider: string, status: string): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      phoneNumber: this.formatPhoneNumber(phoneNumber),
      messageLength: message.length,
      provider,
      status
    };

    // In production, would log to database or external logging service
    console.log('SMS Activity Log:', logEntry);
  }

  private static triggerStatusWebhook(applicationId: string, status: string, metadata?: Record<string, any>): void {
    // Send webhook to external systems for status updates
    const webhookData = {
      applicationId,
      status,
      timestamp: new Date().toISOString(),
      metadata
    };

    // In production, would send to configured webhook URLs
    console.log('Status Webhook:', webhookData);
  }

  // Emergency Notification System
  static async sendEmergencyNotification(
    message: string,
    citizenIds: string[],
    channels: ('sms' | 'push' | 'email')[] = ['sms', 'push']
  ): Promise<void> {
    const emergencyNotification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> = {
      type: 'emergency',
      title: 'Emergency Alert',
      message,
      priority: 'urgent'
    };

    // Add to all specified citizens
    citizenIds.forEach(citizenId => {
      this.addNotification({
        ...emergencyNotification,
        metadata: { citizenId }
      });
    });

    // Send via all requested channels
    if (channels.includes('sms')) {
      // Would send SMS to all citizens with registered phone numbers
      console.log('Sending emergency SMS to', citizenIds.length, 'citizens');
    }

    if (channels.includes('push')) {
      // Would send push notifications
      console.log('Sending emergency push notifications to', citizenIds.length, 'citizens');
    }

    if (channels.includes('email')) {
      // Would send emails
      console.log('Sending emergency emails to', citizenIds.length, 'citizens');
    }
  }
}
