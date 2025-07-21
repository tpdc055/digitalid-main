// Enhanced Security Framework - Legacy System Integration
// Connectors for PNG Government databases and existing systems

import { auditLogger } from '@/lib/security/audit';
import { encryption } from '@/lib/security/encryption';

export interface LegacySystem {
  id: string;
  name: string;
  type: 'database' | 'web_service' | 'file_system' | 'mainframe';
  version: string;
  endpoint: string;
  authentication: {
    type: 'basic' | 'token' | 'certificate' | 'oauth' | 'kerberos';
    credentials: Record<string, string>;
  };
  protocols: ('soap' | 'rest' | 'xmlrpc' | 'ftp' | 'database')[];
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  lastSync: number;
  errorCount: number;
  dataMapping: DataMappingConfig;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

export interface DataMappingConfig {
  tableMappings: TableMapping[];
  fieldMappings: FieldMapping[];
  transformations: DataTransformation[];
  validationRules: ValidationRule[];
}

export interface TableMapping {
  legacyTable: string;
  modernTable: string;
  syncDirection: 'read' | 'write' | 'bidirectional';
  primaryKey: string;
  lastSyncTimestamp?: number;
}

export interface FieldMapping {
  legacyField: string;
  modernField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'binary';
  transformation?: string;
  required: boolean;
  defaultValue?: any;
}

export interface DataTransformation {
  id: string;
  name: string;
  sourceField: string;
  targetField: string;
  transformationType: 'format' | 'calculate' | 'lookup' | 'concatenate' | 'split';
  parameters: Record<string, any>;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'format' | 'range' | 'custom';
  parameters: Record<string, any>;
  errorMessage: string;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: SyncError[];
  duration: number;
  timestamp: number;
}

export interface SyncError {
  recordId: string;
  error: string;
  field?: string;
  data?: any;
}

export interface DatabaseQuery {
  query: string;
  parameters: any[];
  timeout: number;
  maxRows?: number;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  headers: Record<string, string>;
  body?: any;
  timeout: number;
}

class LegacySystemManager {
  private static instance: LegacySystemManager;
  private connectedSystems: Map<string, LegacySystem> = new Map();
  private syncJobs: Map<string, NodeJS.Timeout> = new Map();
  private connectionPools: Map<string, any> = new Map();
  private readonly maxRetries = 3;
  private readonly baseRetryDelay = 1000;

  private constructor() {
    this.initializeLegacySystems();
  }

  static getInstance(): LegacySystemManager {
    if (!this.instance) {
      this.instance = new LegacySystemManager();
    }
    return this.instance;
  }

  private initializeLegacySystems(): void {
    // Initialize connections to PNG government legacy systems
    this.setupPNGGovernmentSystems();
    this.startHealthMonitoring();

    auditLogger.logEvent({
      eventType: 'LEGACY_SYSTEMS_INITIALIZED',
      category: 'system',
      severity: 'info',
      action: 'initialize',
      outcome: 'success',
      details: { systemCount: this.connectedSystems.size },
      tags: ['legacy', 'integration', 'initialization']
    });
  }

  private setupPNGGovernmentSystems(): void {
    // Civil Registration System
    const civilRegistrationSystem: LegacySystem = {
      id: 'png_civil_registration',
      name: 'PNG Civil Registration Database',
      type: 'database',
      version: '2.1.5',
      endpoint: 'jdbc:oracle:thin:@civilreg.gov.pg:1521:CIVILDB',
      authentication: {
        type: 'basic',
        credentials: {
          username: 'integration_user',
          password: 'encrypted_password_hash'
        }
      },
      protocols: ['database'],
      status: 'active',
      lastSync: Date.now() - 300000, // 5 minutes ago
      errorCount: 0,
      dataMapping: {
        tableMappings: [
          {
            legacyTable: 'BIRTH_RECORDS',
            modernTable: 'birth_certificates',
            syncDirection: 'bidirectional',
            primaryKey: 'BIRTH_CERT_NO'
          },
          {
            legacyTable: 'DEATH_RECORDS',
            modernTable: 'death_certificates',
            syncDirection: 'bidirectional',
            primaryKey: 'DEATH_CERT_NO'
          }
        ],
        fieldMappings: [
          {
            legacyField: 'FULL_NAME',
            modernField: 'full_name',
            dataType: 'string',
            required: true,
            transformation: 'titleCase'
          },
          {
            legacyField: 'DOB',
            modernField: 'date_of_birth',
            dataType: 'date',
            required: true,
            transformation: 'dateFormat'
          },
          {
            legacyField: 'FATHER_NAME',
            modernField: 'father_name',
            dataType: 'string',
            required: false,
            transformation: 'titleCase'
          }
        ],
        transformations: [
          {
            id: 'name_transform',
            name: 'Name Title Case',
            sourceField: 'FULL_NAME',
            targetField: 'full_name',
            transformationType: 'format',
            parameters: { format: 'title_case' }
          },
          {
            id: 'date_transform',
            name: 'Date Format',
            sourceField: 'DOB',
            targetField: 'date_of_birth',
            transformationType: 'format',
            parameters: { format: 'YYYY-MM-DD' }
          }
        ],
        validationRules: [
          {
            field: 'full_name',
            rule: 'required',
            parameters: {},
            errorMessage: 'Full name is required'
          },
          {
            field: 'date_of_birth',
            rule: 'format',
            parameters: { pattern: /^\d{4}-\d{2}-\d{2}$/ },
            errorMessage: 'Invalid date format'
          }
        ]
      },
      rateLimits: {
        requestsPerMinute: 100,
        requestsPerHour: 5000,
        requestsPerDay: 50000
      }
    };

    // Immigration System
    const immigrationSystem: LegacySystem = {
      id: 'png_immigration',
      name: 'PNG Immigration & Citizenship System',
      type: 'web_service',
      version: '3.0.2',
      endpoint: 'https://immigration.gov.pg/api/v2',
      authentication: {
        type: 'oauth',
        credentials: {
          client_id: 'integration_client',
          client_secret: 'encrypted_secret',
          token_endpoint: 'https://immigration.gov.pg/oauth/token'
        }
      },
      protocols: ['rest'],
      status: 'active',
      lastSync: Date.now() - 600000, // 10 minutes ago
      errorCount: 1,
      dataMapping: {
        tableMappings: [
          {
            legacyTable: 'passport_applications',
            modernTable: 'passport_applications',
            syncDirection: 'bidirectional',
            primaryKey: 'application_id'
          }
        ],
        fieldMappings: [
          {
            legacyField: 'applicant_name',
            modernField: 'citizen_name',
            dataType: 'string',
            required: true
          },
          {
            legacyField: 'passport_number',
            modernField: 'passport_number',
            dataType: 'string',
            required: false
          }
        ],
        transformations: [],
        validationRules: []
      },
      rateLimits: {
        requestsPerMinute: 50,
        requestsPerHour: 2000,
        requestsPerDay: 20000
      }
    };

    // Business Registration System
    const businessRegistrationSystem: LegacySystem = {
      id: 'png_business_registry',
      name: 'PNG Business Registration System',
      type: 'web_service',
      version: '1.8.3',
      endpoint: 'http://bizreg.gov.pg:8080/services',
      authentication: {
        type: 'basic',
        credentials: {
          username: 'portal_integration',
          password: 'encrypted_password'
        }
      },
      protocols: ['soap'],
      status: 'active',
      lastSync: Date.now() - 900000, // 15 minutes ago
      errorCount: 0,
      dataMapping: {
        tableMappings: [
          {
            legacyTable: 'company_registrations',
            modernTable: 'business_licenses',
            syncDirection: 'bidirectional',
            primaryKey: 'company_id'
          }
        ],
        fieldMappings: [
          {
            legacyField: 'company_name',
            modernField: 'business_name',
            dataType: 'string',
            required: true
          },
          {
            legacyField: 'registration_date',
            modernField: 'registration_date',
            dataType: 'date',
            required: true
          }
        ],
        transformations: [],
        validationRules: []
      },
      rateLimits: {
        requestsPerMinute: 30,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      }
    };

    // Vehicle Registration System
    const vehicleRegistrationSystem: LegacySystem = {
      id: 'png_vehicle_registry',
      name: 'PNG Motor Vehicle Registry',
      type: 'database',
      version: '1.5.1',
      endpoint: 'mysql://vehreg.gov.pg:3306/vehicle_registry',
      authentication: {
        type: 'basic',
        credentials: {
          username: 'integration_svc',
          password: 'encrypted_mysql_password'
        }
      },
      protocols: ['database'],
      status: 'maintenance',
      lastSync: Date.now() - 3600000, // 1 hour ago
      errorCount: 5,
      dataMapping: {
        tableMappings: [
          {
            legacyTable: 'vehicle_registrations',
            modernTable: 'vehicle_registrations',
            syncDirection: 'read',
            primaryKey: 'vehicle_id'
          }
        ],
        fieldMappings: [
          {
            legacyField: 'owner_name',
            modernField: 'owner_name',
            dataType: 'string',
            required: true
          },
          {
            legacyField: 'plate_number',
            modernField: 'license_plate',
            dataType: 'string',
            required: true
          }
        ],
        transformations: [],
        validationRules: []
      },
      rateLimits: {
        requestsPerMinute: 20,
        requestsPerHour: 500,
        requestsPerDay: 5000
      }
    };

    // Store systems
    this.connectedSystems.set(civilRegistrationSystem.id, civilRegistrationSystem);
    this.connectedSystems.set(immigrationSystem.id, immigrationSystem);
    this.connectedSystems.set(businessRegistrationSystem.id, businessRegistrationSystem);
    this.connectedSystems.set(vehicleRegistrationSystem.id, vehicleRegistrationSystem);
  }

  // Data Synchronization
  async syncSystemData(
    systemId: string,
    tableMapping: TableMapping,
    options: {
      batchSize?: number;
      maxRecords?: number;
      incremental?: boolean;
    } = {}
  ): Promise<SyncResult> {
    const startTime = Date.now();
    const system = this.connectedSystems.get(systemId);

    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    const syncResult: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      duration: 0,
      timestamp: startTime
    };

    try {
      auditLogger.logEvent({
        eventType: 'LEGACY_SYNC_STARTED',
        category: 'data_access',
        severity: 'info',
        action: 'sync_data',
        outcome: 'success',
        details: {
          systemId,
          table: tableMapping.legacyTable,
          direction: tableMapping.syncDirection
        },
        tags: ['legacy', 'sync', 'data']
      });

      // Get data from legacy system
      const legacyData = await this.fetchLegacyData(system, tableMapping, options);

      for (const record of legacyData) {
        try {
          // Transform data
          const transformedRecord = await this.transformRecord(
            record,
            system.dataMapping,
            tableMapping
          );

          // Validate data
          const validationErrors = await this.validateRecord(
            transformedRecord,
            system.dataMapping.validationRules
          );

          if (validationErrors.length > 0) {
            syncResult.errors.push({
              recordId: record[tableMapping.primaryKey] || 'unknown',
              error: `Validation failed: ${validationErrors.join(', ')}`,
              data: transformedRecord
            });
            syncResult.recordsFailed++;
          } else {
            // Store in modern system
            await this.storeModernData(tableMapping.modernTable, transformedRecord);
            syncResult.recordsSuccessful++;
          }

          syncResult.recordsProcessed++;

        } catch (error) {
          syncResult.errors.push({
            recordId: record[tableMapping.primaryKey] || 'unknown',
            error: error instanceof Error ? error.message : 'Unknown error',
            data: record
          });
          syncResult.recordsFailed++;
          syncResult.recordsProcessed++;
        }
      }

      // Update sync timestamp
      tableMapping.lastSyncTimestamp = Date.now();
      system.lastSync = Date.now();
      system.errorCount = Math.max(0, system.errorCount - 1); // Reduce error count on success

      syncResult.success = syncResult.recordsFailed === 0;
      syncResult.duration = Date.now() - startTime;

      auditLogger.logEvent({
        eventType: 'LEGACY_SYNC_COMPLETED',
        category: 'data_access',
        severity: syncResult.success ? 'info' : 'warning',
        action: 'sync_data',
        outcome: syncResult.success ? 'success' : 'failure',
        details: {
          systemId,
          recordsProcessed: syncResult.recordsProcessed,
          recordsSuccessful: syncResult.recordsSuccessful,
          recordsFailed: syncResult.recordsFailed,
          duration: syncResult.duration
        },
        tags: ['legacy', 'sync', 'data']
      });

    } catch (error) {
      system.errorCount++;
      syncResult.duration = Date.now() - startTime;

      auditLogger.logEvent({
        eventType: 'LEGACY_SYNC_FAILED',
        category: 'data_access',
        severity: 'error',
        action: 'sync_data',
        outcome: 'failure',
        details: {
          systemId,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: syncResult.duration
        },
        tags: ['legacy', 'sync', 'error']
      });

      throw error;
    }

    return syncResult;
  }

  // Legacy Data Access
  async queryLegacySystem(
    systemId: string,
    query: DatabaseQuery | APIRequest
  ): Promise<any[]> {
    const system = this.connectedSystems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    try {
      // Check rate limits
      if (!await this.checkRateLimit(systemId)) {
        throw new Error('Rate limit exceeded');
      }

      let results: any[] = [];

      switch (system.type) {
        case 'database':
          results = await this.executeDatabaseQuery(system, query as DatabaseQuery);
          break;
        case 'web_service':
          results = await this.executeAPIRequest(system, query as APIRequest);
          break;
        default:
          throw new Error(`Unsupported system type: ${system.type}`);
      }

      auditLogger.logEvent({
        eventType: 'LEGACY_QUERY_EXECUTED',
        category: 'data_access',
        severity: 'info',
        action: 'query_legacy',
        outcome: 'success',
        details: {
          systemId,
          resultCount: results.length
        },
        tags: ['legacy', 'query']
      });

      return results;

    } catch (error) {
      system.errorCount++;

      auditLogger.logEvent({
        eventType: 'LEGACY_QUERY_FAILED',
        category: 'data_access',
        severity: 'error',
        action: 'query_legacy',
        outcome: 'failure',
        details: {
          systemId,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        tags: ['legacy', 'query', 'error']
      });

      throw error;
    }
  }

  // Cross-system Data Verification
  async verifyCitizenData(
    citizenId: string,
    dataType: 'birth_certificate' | 'passport' | 'business_license'
  ): Promise<{
    verified: boolean;
    sources: string[];
    discrepancies: string[];
    confidence: number;
  }> {
    const verificationSources: string[] = [];
    const discrepancies: string[] = [];
    let verifiedRecords = 0;
    let totalSources = 0;

    try {
      switch (dataType) {
        case 'birth_certificate':
          // Check civil registration system
          const civilQuery: DatabaseQuery = {
            query: 'SELECT * FROM BIRTH_RECORDS WHERE CITIZEN_ID = ?',
            parameters: [citizenId],
            timeout: 10000
          };

          try {
            const civilData = await this.queryLegacySystem('png_civil_registration', civilQuery);
            totalSources++;
            if (civilData.length > 0) {
              verifiedRecords++;
              verificationSources.push('Civil Registration Database');
            } else {
              discrepancies.push('No record found in Civil Registration Database');
            }
          } catch (error) {
            discrepancies.push('Civil Registration Database unavailable');
          }
          break;

        case 'passport':
          // Check immigration system
          const immigrationRequest: APIRequest = {
            method: 'GET',
            endpoint: `/citizens/${citizenId}/passport`,
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
          };

          try {
            const passportData = await this.queryLegacySystem('png_immigration', immigrationRequest);
            totalSources++;
            if (passportData.length > 0) {
              verifiedRecords++;
              verificationSources.push('Immigration & Citizenship System');
            } else {
              discrepancies.push('No passport record found');
            }
          } catch (error) {
            discrepancies.push('Immigration system unavailable');
          }
          break;

        case 'business_license':
          // Check business registration system
          const businessQuery: APIRequest = {
            method: 'GET',
            endpoint: `/business/owner/${citizenId}`,
            headers: { 'Content-Type': 'application/json' },
            timeout: 12000
          };

          try {
            const businessData = await this.queryLegacySystem('png_business_registry', businessQuery);
            totalSources++;
            if (businessData.length > 0) {
              verifiedRecords++;
              verificationSources.push('Business Registration System');
            }
          } catch (error) {
            discrepancies.push('Business Registration system unavailable');
          }
          break;
      }

      const confidence = totalSources > 0 ? (verifiedRecords / totalSources) * 100 : 0;
      const verified = confidence >= 70; // Require 70% confidence

      auditLogger.logEvent({
        eventType: 'CITIZEN_DATA_VERIFIED',
        category: 'data_access',
        severity: 'info',
        userId: citizenId,
        action: 'verify_data',
        outcome: verified ? 'success' : 'failure',
        details: {
          dataType,
          sources: verificationSources.length,
          confidence,
          discrepancies: discrepancies.length
        },
        tags: ['legacy', 'verification']
      });

      return {
        verified,
        sources: verificationSources,
        discrepancies,
        confidence
      };

    } catch (error) {
      auditLogger.logEvent({
        eventType: 'CITIZEN_DATA_VERIFICATION_ERROR',
        category: 'data_access',
        severity: 'error',
        userId: citizenId,
        action: 'verify_data',
        outcome: 'failure',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        tags: ['legacy', 'verification', 'error']
      });

      throw error;
    }
  }

  // System Health Monitoring
  private startHealthMonitoring(): void {
    setInterval(async () => {
      for (const [systemId, system] of this.connectedSystems.entries()) {
        try {
          const isHealthy = await this.checkSystemHealth(systemId);
          const oldStatus = system.status;

          if (isHealthy && system.status === 'error') {
            system.status = 'active';
            system.errorCount = 0;
          } else if (!isHealthy && system.status === 'active') {
            system.status = 'error';
            system.errorCount++;
          }

          if (oldStatus !== system.status) {
            auditLogger.logEvent({
              eventType: 'LEGACY_SYSTEM_STATUS_CHANGED',
              category: 'system',
              severity: system.status === 'error' ? 'warning' : 'info',
              action: 'health_check',
              outcome: system.status === 'active' ? 'success' : 'failure',
              details: {
                systemId,
                oldStatus,
                newStatus: system.status,
                errorCount: system.errorCount
              },
              tags: ['legacy', 'health']
            });
          }

        } catch (error) {
          system.errorCount++;
          if (system.errorCount > 5) {
            system.status = 'error';
          }
        }
      }
    }, 60000); // Check every minute
  }

  // Implementation methods (simplified for demo)
  private async fetchLegacyData(
    system: LegacySystem,
    tableMapping: TableMapping,
    options: any
  ): Promise<any[]> {
    // Simulate fetching data from legacy system
    const mockData = [
      {
        BIRTH_CERT_NO: 'BC001',
        FULL_NAME: 'john doe',
        DOB: '1990-01-15',
        FATHER_NAME: 'james doe'
      },
      {
        BIRTH_CERT_NO: 'BC002',
        FULL_NAME: 'jane smith',
        DOB: '1985-06-22',
        FATHER_NAME: 'robert smith'
      }
    ];

    return mockData;
  }

  private async transformRecord(
    record: any,
    dataMapping: DataMappingConfig,
    tableMapping: TableMapping
  ): Promise<any> {
    const transformed: any = {};

    for (const fieldMapping of dataMapping.fieldMappings) {
      let value = record[fieldMapping.legacyField];

      // Apply transformations
      if (fieldMapping.transformation === 'titleCase' && typeof value === 'string') {
        value = value.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      }

      transformed[fieldMapping.modernField] = value;
    }

    return transformed;
  }

  private async validateRecord(record: any, rules: ValidationRule[]): Promise<string[]> {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = record[rule.field];

      switch (rule.rule) {
        case 'required':
          if (!value) {
            errors.push(rule.errorMessage);
          }
          break;
        case 'format':
          if (value && rule.parameters.pattern && !rule.parameters.pattern.test(value)) {
            errors.push(rule.errorMessage);
          }
          break;
      }
    }

    return errors;
  }

  private async storeModernData(table: string, data: any): Promise<void> {
    // Simulate storing in modern database
    console.log(`[Legacy] Storing data in ${table}:`, data);
  }

  private async executeDatabaseQuery(system: LegacySystem, query: DatabaseQuery): Promise<any[]> {
    // Simulate database query execution
    return [{ id: 1, name: 'Mock Data' }];
  }

  private async executeAPIRequest(system: LegacySystem, request: APIRequest): Promise<any[]> {
    // Simulate API request execution
    return [{ id: 1, name: 'Mock API Response' }];
  }

  private async checkRateLimit(systemId: string): Promise<boolean> {
    // Simplified rate limiting check
    return true;
  }

  private async checkSystemHealth(systemId: string): Promise<boolean> {
    const system = this.connectedSystems.get(systemId);
    if (!system) return false;

    // Simulate health check
    return system.errorCount < 5;
  }

  // Public API methods
  getConnectedSystems(): LegacySystem[] {
    return Array.from(this.connectedSystems.values());
  }

  getSystemStatus(systemId: string): LegacySystem | undefined {
    return this.connectedSystems.get(systemId);
  }

  async testConnection(systemId: string): Promise<boolean> {
    try {
      return await this.checkSystemHealth(systemId);
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const legacySystemManager = LegacySystemManager.getInstance();

// Utility functions
export function formatLegacyDate(dateString: string, format: string): string {
  const date = new Date(dateString);
  switch (format) {
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0];
    case 'DD/MM/YYYY':
      return date.toLocaleDateString('en-GB');
    default:
      return dateString;
  }
}

export function validateCitizenId(citizenId: string): boolean {
  // PNG citizen ID validation pattern
  const pattern = /^[A-Z]{2}\d{8}$/;
  return pattern.test(citizenId);
}
