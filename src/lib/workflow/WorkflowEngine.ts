// Enhanced Security Framework - Advanced Workflow Automation Engine
// Inter-departmental process automation for PNG Government Portal

import { auditLogger } from '@/lib/security/audit';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'document_approval' | 'service_request' | 'inter_department' | 'compliance_check';
  departments: string[];
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  escalationRules: EscalationRule[];
  deadlines: WorkflowDeadline[];
  notifications: NotificationRule[];
  metadata: {
    author: string;
    created: number;
    lastModified: number;
    isActive: boolean;
    usage: number;
    successRate: number;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'data_entry' | 'system_action' | 'parallel' | 'decision' | 'timer';
  assignee: WorkflowAssignee;
  dependencies: string[]; // IDs of previous steps
  parallelSteps?: string[]; // For parallel execution
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  timeLimit: number; // in minutes
  autoAdvance: boolean;
  requiredFields: string[];
  optionalFields: string[];
  position: { x: number; y: number }; // For visual designer
}

export interface WorkflowAssignee {
  type: 'user' | 'role' | 'department' | 'system' | 'round_robin' | 'load_balanced';
  identifier: string;
  fallback?: string[];
}

export interface WorkflowAction {
  id: string;
  type: 'approve' | 'reject' | 'request_info' | 'forward' | 'escalate' | 'notify' | 'integrate' | 'calculate';
  parameters: Record<string, any>;
  conditions: WorkflowCondition[];
  nextStep?: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'exists';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface WorkflowTrigger {
  type: 'manual' | 'automatic' | 'scheduled' | 'webhook' | 'file_upload' | 'data_change';
  conditions: WorkflowCondition[];
  parameters: Record<string, any>;
}

export interface EscalationRule {
  id: string;
  stepId: string;
  condition: 'timeout' | 'rejection' | 'no_action' | 'custom';
  timeThreshold: number; // in minutes
  escalateTo: WorkflowAssignee;
  notificationMessage: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface WorkflowDeadline {
  stepId: string;
  type: 'soft' | 'hard';
  deadline: number; // timestamp
  action: 'notify' | 'escalate' | 'auto_approve' | 'cancel';
  responsible: string[];
}

export interface NotificationRule {
  trigger: 'step_start' | 'step_complete' | 'escalation' | 'deadline_warning' | 'workflow_complete';
  recipients: WorkflowAssignee[];
  template: string;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  timing: 'immediate' | 'batched' | 'scheduled';
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  initiator: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'escalated' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  currentStep: string;
  stepHistory: WorkflowStepExecution[];
  data: Record<string, any>;
  metadata: {
    applicationId?: string;
    citizenId?: string;
    documentUrls: string[];
    tags: string[];
    estimatedCompletion: number;
    actualCompletion?: number;
    department: string;
    serviceType: string;
  };
  created: number;
  lastModified: number;
  assignedTo?: string[];
  comments: WorkflowComment[];
  attachments: WorkflowAttachment[];
}

export interface WorkflowStepExecution {
  stepId: string;
  stepName: string;
  assignee: string;
  startTime: number;
  endTime?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'escalated' | 'skipped';
  action: string;
  decision?: 'approved' | 'rejected' | 'needs_info' | 'forwarded';
  comments?: string;
  attachments?: string[];
  nextStep?: string;
  duration?: number;
}

export interface WorkflowComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: number;
  isInternal: boolean;
  mentions: string[];
  attachments: string[];
}

export interface WorkflowAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: number;
  stepId?: string;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  completedWorkflows: number;
  averageCompletionTime: number;
  bottlenecks: BottleneckAnalysis[];
  departmentPerformance: DepartmentMetrics[];
  escalationRate: number;
  slaCompliance: number;
}

export interface BottleneckAnalysis {
  stepId: string;
  stepName: string;
  averageWaitTime: number;
  instances: number;
  assignee: string;
  department: string;
}

export interface DepartmentMetrics {
  department: string;
  activeWorkflows: number;
  averageProcessingTime: number;
  slaCompliance: number;
  escalationRate: number;
  workload: number;
}

class WorkflowEngine {
  private static instance: WorkflowEngine;
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private instances: Map<string, WorkflowInstance> = new Map();
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();
  private notificationQueue: Map<string, any[]> = new Map();

  private constructor() {
    this.initializeWorkflowEngine();
    this.loadPNGGovernmentWorkflows();
  }

  static getInstance(): WorkflowEngine {
    if (!this.instance) {
      this.instance = new WorkflowEngine();
    }
    return this.instance;
  }

  private initializeWorkflowEngine(): void {
    this.startTimerService();
    this.startNotificationProcessor();

    auditLogger.logEvent({
      eventType: 'WORKFLOW_ENGINE_INITIALIZED',
      category: 'system',
      severity: 'info',
      action: 'initialize',
      outcome: 'success',
      details: { engineVersion: '1.0.0' },
      tags: ['workflow', 'engine', 'initialization']
    });
  }

  private loadPNGGovernmentWorkflows(): void {
    // Birth Certificate Approval Workflow
    const birthCertificateWorkflow: WorkflowDefinition = {
      id: 'birth_certificate_approval',
      name: 'Birth Certificate Application Approval',
      description: 'Multi-step approval process for birth certificate applications',
      version: '2.1.0',
      category: 'document_approval',
      departments: ['civil_registration', 'verification', 'printing'],
      steps: [
        {
          id: 'initial_review',
          name: 'Initial Document Review',
          type: 'review',
          assignee: { type: 'role', identifier: 'document_reviewer' },
          dependencies: [],
          actions: [
            {
              id: 'approve_docs',
              type: 'approve',
              parameters: { nextStep: 'verification' },
              conditions: [],
              nextStep: 'verification'
            },
            {
              id: 'reject_docs',
              type: 'reject',
              parameters: { reason: 'insufficient_documents' },
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 1440, // 24 hours
          autoAdvance: false,
          requiredFields: ['birth_hospital', 'parent_ids', 'witness_signatures'],
          optionalFields: ['additional_notes'],
          position: { x: 100, y: 100 }
        },
        {
          id: 'verification',
          name: 'Identity Verification',
          type: 'system_action',
          assignee: { type: 'system', identifier: 'verification_service' },
          dependencies: ['initial_review'],
          actions: [
            {
              id: 'verify_identity',
              type: 'integrate',
              parameters: {
                service: 'civil_registration_db',
                operation: 'verify_parents'
              },
              conditions: [],
              nextStep: 'manager_approval'
            }
          ],
          conditions: [],
          timeLimit: 60, // 1 hour
          autoAdvance: true,
          requiredFields: [],
          optionalFields: [],
          position: { x: 300, y: 100 }
        },
        {
          id: 'manager_approval',
          name: 'Manager Final Approval',
          type: 'approval',
          assignee: { type: 'role', identifier: 'registration_manager' },
          dependencies: ['verification'],
          actions: [
            {
              id: 'final_approve',
              type: 'approve',
              parameters: { nextStep: 'certificate_generation' },
              conditions: [],
              nextStep: 'certificate_generation'
            },
            {
              id: 'escalate',
              type: 'escalate',
              parameters: { escalateTo: 'department_head' },
              conditions: []
            }
          ],
          conditions: [
            {
              field: 'verification_score',
              operator: 'greater_than',
              value: 0.8
            }
          ],
          timeLimit: 2880, // 48 hours
          autoAdvance: false,
          requiredFields: ['approval_comments'],
          optionalFields: [],
          position: { x: 500, y: 100 }
        },
        {
          id: 'certificate_generation',
          name: 'Generate Certificate',
          type: 'system_action',
          assignee: { type: 'system', identifier: 'certificate_printer' },
          dependencies: ['manager_approval'],
          actions: [
            {
              id: 'generate_cert',
              type: 'integrate',
              parameters: {
                service: 'document_generation',
                template: 'birth_certificate'
              },
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 120, // 2 hours
          autoAdvance: true,
          requiredFields: [],
          optionalFields: [],
          position: { x: 700, y: 100 }
        }
      ],
      triggers: [
        {
          type: 'automatic',
          conditions: [
            {
              field: 'application_type',
              operator: 'equals',
              value: 'birth_certificate'
            }
          ],
          parameters: {}
        }
      ],
      conditions: [],
      escalationRules: [
        {
          id: 'review_timeout',
          stepId: 'initial_review',
          condition: 'timeout',
          timeThreshold: 1440,
          escalateTo: { type: 'role', identifier: 'senior_reviewer' },
          notificationMessage: 'Birth certificate review has exceeded 24-hour deadline',
          priority: 'high'
        }
      ],
      deadlines: [
        {
          stepId: 'manager_approval',
          type: 'hard',
          deadline: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
          action: 'escalate',
          responsible: ['department_head']
        }
      ],
      notifications: [
        {
          trigger: 'step_start',
          recipients: [{ type: 'role', identifier: 'assigned_reviewer' }],
          template: 'step_assignment',
          channels: ['email', 'in_app'],
          timing: 'immediate'
        }
      ],
      metadata: {
        author: 'system_admin',
        created: Date.now() - 86400000,
        lastModified: Date.now(),
        isActive: true,
        usage: 1250,
        successRate: 94.5
      }
    };

    // Passport Application Workflow
    const passportWorkflow: WorkflowDefinition = {
      id: 'passport_application',
      name: 'Passport Application Processing',
      description: 'Complex inter-departmental workflow for passport applications',
      version: '3.0.1',
      category: 'service_request',
      departments: ['immigration', 'security', 'printing', 'delivery'],
      steps: [
        {
          id: 'application_intake',
          name: 'Application Intake & Initial Check',
          type: 'data_entry',
          assignee: { type: 'role', identifier: 'intake_officer' },
          dependencies: [],
          actions: [
            {
              id: 'complete_intake',
              type: 'approve',
              parameters: { nextStep: 'security_check' },
              conditions: [],
              nextStep: 'security_check'
            }
          ],
          conditions: [],
          timeLimit: 480, // 8 hours
          autoAdvance: false,
          requiredFields: ['biometric_data', 'photos', 'supporting_documents'],
          optionalFields: ['emergency_contact'],
          position: { x: 100, y: 150 }
        },
        {
          id: 'security_check',
          name: 'Security Background Check',
          type: 'parallel',
          assignee: { type: 'department', identifier: 'security_department' },
          dependencies: ['application_intake'],
          parallelSteps: ['criminal_check', 'watchlist_check'],
          actions: [],
          conditions: [],
          timeLimit: 2880, // 48 hours
          autoAdvance: false,
          requiredFields: [],
          optionalFields: [],
          position: { x: 300, y: 150 }
        },
        {
          id: 'criminal_check',
          name: 'Criminal Background Verification',
          type: 'system_action',
          assignee: { type: 'system', identifier: 'criminal_database' },
          dependencies: [],
          actions: [
            {
              id: 'run_criminal_check',
              type: 'integrate',
              parameters: { database: 'criminal_records' },
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 1440, // 24 hours
          autoAdvance: true,
          requiredFields: [],
          optionalFields: [],
          position: { x: 250, y: 250 }
        },
        {
          id: 'watchlist_check',
          name: 'Security Watchlist Verification',
          type: 'system_action',
          assignee: { type: 'system', identifier: 'security_watchlist' },
          dependencies: [],
          actions: [
            {
              id: 'run_watchlist_check',
              type: 'integrate',
              parameters: { database: 'security_watchlist' },
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 720, // 12 hours
          autoAdvance: true,
          requiredFields: [],
          optionalFields: [],
          position: { x: 350, y: 250 }
        },
        {
          id: 'final_approval',
          name: 'Immigration Officer Final Approval',
          type: 'approval',
          assignee: { type: 'role', identifier: 'immigration_officer' },
          dependencies: ['security_check'],
          actions: [
            {
              id: 'approve_passport',
              type: 'approve',
              parameters: { nextStep: 'passport_printing' },
              conditions: [],
              nextStep: 'passport_printing'
            },
            {
              id: 'reject_application',
              type: 'reject',
              parameters: { reason: 'security_concern' },
              conditions: []
            }
          ],
          conditions: [
            {
              field: 'criminal_check_status',
              operator: 'equals',
              value: 'clear'
            },
            {
              field: 'watchlist_status',
              operator: 'equals',
              value: 'clear',
              logicalOperator: 'and'
            }
          ],
          timeLimit: 1440, // 24 hours
          autoAdvance: false,
          requiredFields: ['officer_comments', 'approval_code'],
          optionalFields: [],
          position: { x: 500, y: 150 }
        }
      ],
      triggers: [
        {
          type: 'automatic',
          conditions: [
            {
              field: 'service_type',
              operator: 'equals',
              value: 'passport_application'
            }
          ],
          parameters: {}
        }
      ],
      conditions: [],
      escalationRules: [
        {
          id: 'security_delay',
          stepId: 'security_check',
          condition: 'timeout',
          timeThreshold: 2880,
          escalateTo: { type: 'role', identifier: 'security_supervisor' },
          notificationMessage: 'Security check has exceeded 48-hour SLA',
          priority: 'urgent'
        }
      ],
      deadlines: [],
      notifications: [],
      metadata: {
        author: 'immigration_admin',
        created: Date.now() - 172800000,
        lastModified: Date.now() - 3600000,
        isActive: true,
        usage: 890,
        successRate: 91.2
      }
    };

    // Business License Multi-Department Workflow
    const businessLicenseWorkflow: WorkflowDefinition = {
      id: 'business_license_approval',
      name: 'Business License Multi-Department Approval',
      description: 'Complex workflow involving multiple departments for business registration',
      version: '1.5.2',
      category: 'inter_department',
      departments: ['business_registration', 'tax_office', 'environmental', 'zoning', 'health'],
      steps: [
        {
          id: 'business_registration_review',
          name: 'Business Registration Review',
          type: 'review',
          assignee: { type: 'department', identifier: 'business_registration' },
          dependencies: [],
          actions: [
            {
              id: 'approve_registration',
              type: 'approve',
              parameters: { nextStep: 'parallel_approvals' },
              conditions: [],
              nextStep: 'parallel_approvals'
            }
          ],
          conditions: [],
          timeLimit: 1440, // 24 hours
          autoAdvance: false,
          requiredFields: ['business_plan', 'financial_statements'],
          optionalFields: [],
          position: { x: 100, y: 200 }
        },
        {
          id: 'parallel_approvals',
          name: 'Multi-Department Approvals',
          type: 'parallel',
          assignee: { type: 'system', identifier: 'parallel_coordinator' },
          dependencies: ['business_registration_review'],
          parallelSteps: ['tax_clearance', 'environmental_clearance', 'zoning_approval'],
          actions: [],
          conditions: [],
          timeLimit: 4320, // 72 hours
          autoAdvance: false,
          requiredFields: [],
          optionalFields: [],
          position: { x: 300, y: 200 }
        },
        {
          id: 'tax_clearance',
          name: 'Tax Office Clearance',
          type: 'approval',
          assignee: { type: 'department', identifier: 'tax_office' },
          dependencies: [],
          actions: [
            {
              id: 'tax_approved',
              type: 'approve',
              parameters: {},
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 2880, // 48 hours
          autoAdvance: false,
          requiredFields: ['tax_registration'],
          optionalFields: [],
          position: { x: 200, y: 300 }
        },
        {
          id: 'environmental_clearance',
          name: 'Environmental Impact Assessment',
          type: 'approval',
          assignee: { type: 'department', identifier: 'environmental' },
          dependencies: [],
          actions: [
            {
              id: 'environmental_approved',
              type: 'approve',
              parameters: {},
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 4320, // 72 hours
          autoAdvance: false,
          requiredFields: ['environmental_impact_report'],
          optionalFields: [],
          position: { x: 300, y: 300 }
        },
        {
          id: 'zoning_approval',
          name: 'Zoning Compliance Check',
          type: 'approval',
          assignee: { type: 'department', identifier: 'zoning' },
          dependencies: [],
          actions: [
            {
              id: 'zoning_approved',
              type: 'approve',
              parameters: {},
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 1440, // 24 hours
          autoAdvance: false,
          requiredFields: ['location_permit'],
          optionalFields: [],
          position: { x: 400, y: 300 }
        },
        {
          id: 'final_license_issuance',
          name: 'Final License Issuance',
          type: 'system_action',
          assignee: { type: 'system', identifier: 'license_generator' },
          dependencies: ['parallel_approvals'],
          actions: [
            {
              id: 'issue_license',
              type: 'integrate',
              parameters: {
                service: 'license_generation',
                template: 'business_license'
              },
              conditions: []
            }
          ],
          conditions: [],
          timeLimit: 240, // 4 hours
          autoAdvance: true,
          requiredFields: [],
          optionalFields: [],
          position: { x: 500, y: 200 }
        }
      ],
      triggers: [
        {
          type: 'automatic',
          conditions: [
            {
              field: 'application_type',
              operator: 'equals',
              value: 'business_license'
            }
          ],
          parameters: {}
        }
      ],
      conditions: [],
      escalationRules: [
        {
          id: 'parallel_timeout',
          stepId: 'parallel_approvals',
          condition: 'timeout',
          timeThreshold: 4320,
          escalateTo: { type: 'role', identifier: 'department_coordinator' },
          notificationMessage: 'Multi-department approval has exceeded 72-hour deadline',
          priority: 'urgent'
        }
      ],
      deadlines: [],
      notifications: [],
      metadata: {
        author: 'business_admin',
        created: Date.now() - 259200000,
        lastModified: Date.now() - 7200000,
        isActive: true,
        usage: 650,
        successRate: 87.8
      }
    };

    // Store workflows
    this.workflows.set(birthCertificateWorkflow.id, birthCertificateWorkflow);
    this.workflows.set(passportWorkflow.id, passportWorkflow);
    this.workflows.set(businessLicenseWorkflow.id, businessLicenseWorkflow);

    console.log('[Workflow] Loaded PNG Government workflows');
  }

  // Workflow Execution
  async startWorkflow(
    workflowId: string,
    initiator: string,
    data: Record<string, any>,
    metadata?: Partial<WorkflowInstance['metadata']>
  ): Promise<{ success: boolean; instanceId?: string; error?: string }> {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow || !workflow.metadata.isActive) {
        return { success: false, error: 'Workflow not found or inactive' };
      }

      const instanceId = this.generateInstanceId();
      const firstStep = workflow.steps.find(step => step.dependencies.length === 0);

      if (!firstStep) {
        return { success: false, error: 'No starting step found in workflow' };
      }

      const instance: WorkflowInstance = {
        id: instanceId,
        workflowId,
        initiator,
        status: 'in_progress',
        priority: 'medium',
        currentStep: firstStep.id,
        stepHistory: [],
        data,
        metadata: {
          applicationId: metadata?.applicationId,
          citizenId: metadata?.citizenId,
          documentUrls: metadata?.documentUrls || [],
          tags: metadata?.tags || [],
          estimatedCompletion: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
          department: metadata?.department || 'unknown',
          serviceType: metadata?.serviceType || workflow.category,
          ...metadata
        },
        created: Date.now(),
        lastModified: Date.now(),
        comments: [],
        attachments: []
      };

      this.instances.set(instanceId, instance);

      // Start first step
      await this.executeStep(instanceId, firstStep.id);

      // Update workflow usage
      workflow.metadata.usage++;

      auditLogger.logEvent({
        eventType: 'WORKFLOW_STARTED',
        category: 'system',
        severity: 'info',
        userId: initiator,
        action: 'start_workflow',
        outcome: 'success',
        details: {
          workflowId,
          instanceId,
          firstStep: firstStep.id
        },
        tags: ['workflow', 'execution']
      });

      return { success: true, instanceId };

    } catch (error) {
      auditLogger.logEvent({
        eventType: 'WORKFLOW_START_FAILED',
        category: 'system',
        severity: 'error',
        userId: initiator,
        action: 'start_workflow',
        outcome: 'failure',
        details: {
          workflowId,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        tags: ['workflow', 'error']
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start workflow'
      };
    }
  }

  async executeStep(instanceId: string, stepId: string): Promise<boolean> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) return false;

      const workflow = this.workflows.get(instance.workflowId);
      if (!workflow) return false;

      const step = workflow.steps.find(s => s.id === stepId);
      if (!step) return false;

      // Create step execution record
      const stepExecution: WorkflowStepExecution = {
        stepId,
        stepName: step.name,
        assignee: this.resolveAssignee(step.assignee),
        startTime: Date.now(),
        status: 'in_progress',
        action: 'started'
      };

      instance.stepHistory.push(stepExecution);
      instance.currentStep = stepId;
      instance.lastModified = Date.now();

      // Set up timer for step timeout
      if (step.timeLimit > 0) {
        this.setStepTimer(instanceId, stepId, step.timeLimit);
      }

      // Handle different step types
      switch (step.type) {
        case 'system_action':
          await this.executeSystemAction(instance, step);
          break;
        case 'parallel':
          await this.executeParallelSteps(instance, step);
          break;
        case 'timer':
          await this.executeTimerStep(instance, step);
          break;
        default:
          // Manual steps (approval, review, data_entry) wait for user action
          await this.notifyAssignees(instance, step);
          break;
      }

      auditLogger.logEvent({
        eventType: 'WORKFLOW_STEP_STARTED',
        category: 'system',
        severity: 'info',
        action: 'execute_step',
        outcome: 'success',
        details: {
          instanceId,
          stepId,
          stepType: step.type,
          assignee: stepExecution.assignee
        },
        tags: ['workflow', 'step']
      });

      return true;

    } catch (error) {
      auditLogger.logEvent({
        eventType: 'WORKFLOW_STEP_FAILED',
        category: 'system',
        severity: 'error',
        action: 'execute_step',
        outcome: 'failure',
        details: {
          instanceId,
          stepId,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        tags: ['workflow', 'step', 'error']
      });

      return false;
    }
  }

  async completeStep(
    instanceId: string,
    stepId: string,
    userId: string,
    action: string,
    data: Record<string, any> = {},
    comments?: string
  ): Promise<{ success: boolean; nextStep?: string; error?: string }> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) {
        return { success: false, error: 'Workflow instance not found' };
      }

      const workflow = this.workflows.get(instance.workflowId);
      if (!workflow) {
        return { success: false, error: 'Workflow definition not found' };
      }

      const step = workflow.steps.find(s => s.id === stepId);
      if (!step) {
        return { success: false, error: 'Step not found' };
      }

      // Find current step execution
      const stepExecution = instance.stepHistory
        .filter(h => h.stepId === stepId)
        .sort((a, b) => b.startTime - a.startTime)[0];

      if (!stepExecution) {
        return { success: false, error: 'Step execution not found' };
      }

      // Update step execution
      stepExecution.endTime = Date.now();
      stepExecution.status = 'completed';
      stepExecution.action = action;
      stepExecution.comments = comments;
      stepExecution.duration = stepExecution.endTime - stepExecution.startTime;

      // Merge step data
      instance.data = { ...instance.data, ...data };
      instance.lastModified = Date.now();

      // Clear timer if exists
      this.clearStepTimer(instanceId, stepId);

      // Determine next step
      const actionDef = step.actions.find(a => a.type === action);
      let nextStepId: string | undefined;

      if (actionDef?.nextStep) {
        nextStepId = actionDef.nextStep;
      } else if (action === 'approve') {
        // Find next step based on dependencies
        nextStepId = this.findNextStep(workflow, stepId);
      }

      if (nextStepId) {
        stepExecution.nextStep = nextStepId;
        await this.executeStep(instanceId, nextStepId);
      } else {
        // No next step - workflow completed
        instance.status = 'completed';
        instance.metadata.actualCompletion = Date.now();

        await this.completeWorkflow(instanceId);
      }

      auditLogger.logEvent({
        eventType: 'WORKFLOW_STEP_COMPLETED',
        category: 'system',
        severity: 'info',
        userId,
        action: 'complete_step',
        outcome: 'success',
        details: {
          instanceId,
          stepId,
          action,
          nextStep: nextStepId,
          duration: stepExecution.duration
        },
        tags: ['workflow', 'step', 'completion']
      });

      return { success: true, nextStep: nextStepId };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete step'
      };
    }
  }

  // Utility methods
  private async executeSystemAction(instance: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Simulate system action execution
    setTimeout(async () => {
      const stepExecution = instance.stepHistory
        .filter(h => h.stepId === step.id)
        .sort((a, b) => b.startTime - a.startTime)[0];

      if (stepExecution) {
        stepExecution.endTime = Date.now();
        stepExecution.status = 'completed';
        stepExecution.action = 'system_completed';
        stepExecution.duration = stepExecution.endTime - stepExecution.startTime;

        // Find next step
        const workflow = this.workflows.get(instance.workflowId);
        if (workflow) {
          const nextStepId = this.findNextStep(workflow, step.id);
          if (nextStepId) {
            await this.executeStep(instance.id, nextStepId);
          } else {
            instance.status = 'completed';
            await this.completeWorkflow(instance.id);
          }
        }
      }
    }, Math.random() * 5000 + 1000); // 1-6 seconds simulation
  }

  private async executeParallelSteps(instance: WorkflowInstance, step: WorkflowStep): Promise<void> {
    if (!step.parallelSteps) return;

    // Start all parallel steps
    for (const parallelStepId of step.parallelSteps) {
      await this.executeStep(instance.id, parallelStepId);
    }
  }

  private async executeTimerStep(instance: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Timer step waits for specified duration then continues
    setTimeout(async () => {
      await this.completeStep(instance.id, step.id, 'system', 'timer_expired');
    }, step.timeLimit * 60 * 1000);
  }

  private resolveAssignee(assignee: WorkflowAssignee): string {
    switch (assignee.type) {
      case 'user':
        return assignee.identifier;
      case 'role':
        return `role:${assignee.identifier}`;
      case 'department':
        return `dept:${assignee.identifier}`;
      case 'system':
        return 'system';
      case 'round_robin':
        // Implement round-robin logic
        return `rr:${assignee.identifier}`;
      case 'load_balanced':
        // Implement load balancing logic
        return `lb:${assignee.identifier}`;
      default:
        return 'unassigned';
    }
  }

  private findNextStep(workflow: WorkflowDefinition, currentStepId: string): string | undefined {
    return workflow.steps.find(step =>
      step.dependencies.includes(currentStepId)
    )?.id;
  }

  private async notifyAssignees(instance: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Implement notification logic
    console.log(`[Workflow] Notifying ${step.assignee.identifier} for step ${step.id}`);
  }

  private async completeWorkflow(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    const workflow = this.workflows.get(instance.workflowId);
    if (workflow) {
      // Update success rate
      workflow.metadata.successRate = (
        (workflow.metadata.successRate * workflow.metadata.usage + 100) /
        (workflow.metadata.usage + 1)
      );
    }

    auditLogger.logEvent({
      eventType: 'WORKFLOW_COMPLETED',
      category: 'system',
      severity: 'info',
      action: 'complete_workflow',
      outcome: 'success',
      details: {
        instanceId,
        workflowId: instance.workflowId,
        duration: (instance.metadata.actualCompletion || Date.now()) - instance.created,
        stepsCompleted: instance.stepHistory.length
      },
      tags: ['workflow', 'completion']
    });
  }

  private setStepTimer(instanceId: string, stepId: string, timeLimit: number): void {
    const timerId = setTimeout(() => {
      this.handleStepTimeout(instanceId, stepId);
    }, timeLimit * 60 * 1000);

    this.activeTimers.set(`${instanceId}:${stepId}`, timerId);
  }

  private clearStepTimer(instanceId: string, stepId: string): void {
    const timerId = this.activeTimers.get(`${instanceId}:${stepId}`);
    if (timerId) {
      clearTimeout(timerId);
      this.activeTimers.delete(`${instanceId}:${stepId}`);
    }
  }

  private handleStepTimeout(instanceId: string, stepId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return;

    // Find escalation rule
    const escalationRule = workflow.escalationRules.find(
      rule => rule.stepId === stepId && rule.condition === 'timeout'
    );

    if (escalationRule) {
      // Handle escalation
      auditLogger.logEvent({
        eventType: 'WORKFLOW_STEP_ESCALATED',
        category: 'system',
        severity: escalationRule.priority === 'urgent' ? 'error' : 'warning',
        action: 'escalate_step',
        outcome: 'success',
        details: {
          instanceId,
          stepId,
          escalationRule: escalationRule.id,
          escalateTo: escalationRule.escalateTo.identifier
        },
        tags: ['workflow', 'escalation']
      });
    }
  }

  private startTimerService(): void {
    // Monitor deadlines and timers
    setInterval(() => {
      this.checkDeadlines();
    }, 60000); // Check every minute
  }

  private startNotificationProcessor(): void {
    // Process notification queue
    setInterval(() => {
      this.processNotifications();
    }, 30000); // Process every 30 seconds
  }

  private checkDeadlines(): void {
    const now = Date.now();

    for (const instance of this.instances.values()) {
      if (instance.status !== 'in_progress') continue;

      const workflow = this.workflows.get(instance.workflowId);
      if (!workflow) continue;

      for (const deadline of workflow.deadlines) {
        if (deadline.deadline < now) {
          // Handle deadline breach
          console.log(`[Workflow] Deadline breached for ${instance.id}:${deadline.stepId}`);
        }
      }
    }
  }

  private processNotifications(): void {
    // Process pending notifications
    for (const [key, notifications] of this.notificationQueue.entries()) {
      // Send notifications
      console.log(`[Workflow] Processing ${notifications.length} notifications for ${key}`);
      this.notificationQueue.delete(key);
    }
  }

  private generateInstanceId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Public API methods
  getWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  getInstance(instanceId: string): WorkflowInstance | undefined {
    return this.instances.get(instanceId);
  }

  getActiveInstances(userId?: string): WorkflowInstance[] {
    const instances = Array.from(this.instances.values())
      .filter(instance => instance.status === 'in_progress');

    if (userId) {
      return instances.filter(instance =>
        instance.initiator === userId ||
        instance.assignedTo?.includes(userId)
      );
    }

    return instances;
  }

  async addComment(
    instanceId: string,
    authorId: string,
    authorName: string,
    authorRole: string,
    content: string,
    isInternal: boolean = false
  ): Promise<WorkflowComment> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    const comment: WorkflowComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      authorId,
      authorName,
      authorRole,
      content,
      timestamp: Date.now(),
      isInternal,
      mentions: [],
      attachments: []
    };

    instance.comments.push(comment);
    instance.lastModified = Date.now();

    return comment;
  }

  getWorkflowMetrics(): WorkflowMetrics {
    const instances = Array.from(this.instances.values());
    const activeWorkflows = instances.filter(i => i.status === 'in_progress').length;
    const completedWorkflows = instances.filter(i => i.status === 'completed').length;

    const completedInstances = instances.filter(i => i.status === 'completed' && i.metadata.actualCompletion);
    const avgCompletionTime = completedInstances.length > 0
      ? completedInstances.reduce((sum, i) =>
          sum + ((i.metadata.actualCompletion || 0) - i.created), 0
        ) / completedInstances.length
      : 0;

    return {
      totalWorkflows: instances.length,
      activeWorkflows,
      completedWorkflows,
      averageCompletionTime: avgCompletionTime,
      bottlenecks: [], // Would be calculated from step durations
      departmentPerformance: [], // Would be calculated from department metrics
      escalationRate: 5.2, // Simulated
      slaCompliance: 92.8 // Simulated
    };
  }
}

// Export singleton instance
export const workflowEngine = WorkflowEngine.getInstance();

// Utility functions
export function validateWorkflowDefinition(workflow: WorkflowDefinition): string[] {
  const errors: string[] = [];

  // Check for circular dependencies
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(stepId: string): boolean {
    if (recursionStack.has(stepId)) return true;
    if (visited.has(stepId)) return false;

    visited.add(stepId);
    recursionStack.add(stepId);

    const step = workflow.steps.find(s => s.id === stepId);
    if (step) {
      for (const dep of step.dependencies) {
        if (hasCycle(dep)) return true;
      }
    }

    recursionStack.delete(stepId);
    return false;
  }

  for (const step of workflow.steps) {
    if (hasCycle(step.id)) {
      errors.push(`Circular dependency detected in step: ${step.id}`);
    }
  }

  return errors;
}
