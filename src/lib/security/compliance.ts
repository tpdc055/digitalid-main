import { z } from 'zod';

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  lastAssessment?: number;
  nextAssessment?: number;
  overallScore: number;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  category: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-implemented';
  evidence: string[];
  lastChecked: number;
  autoCheck: boolean;
  checkFunction?: string;
  remediation?: string;
  score: number;
}

export interface ComplianceReport {
  id: string;
  frameworkId: string;
  generated: number;
  overallScore: number;
  status: string;
  findings: ComplianceFinding[];
  recommendations: string[];
  nextAssessment: number;
}

export interface ComplianceFinding {
  requirementId: string;
  status: string;
  score: number;
  evidence: string[];
  issues: string[];
  recommendations: string[];
}

export interface ComplianceMetrics {
  totalFrameworks: number;
  compliantFrameworks: number;
  criticalIssues: number;
  overallScore: number;
  lastAssessment: number;
  trendsLast30Days: {
    date: string;
    score: number;
  }[];
}

export class ComplianceMonitor {
  private static instance: ComplianceMonitor;
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private reports: Map<string, ComplianceReport> = new Map();
  private assessmentInterval: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  private constructor() {
    this.initializeFrameworks();
    this.startContinuousMonitoring();
  }

  static getInstance(): ComplianceMonitor {
    if (!this.instance) {
      this.instance = new ComplianceMonitor();
    }
    return this.instance;
  }

  private initializeFrameworks(): void {
    // Digital Government Act 2022 Framework
    const dgaFramework: ComplianceFramework = {
      id: 'dga-2022',
      name: 'Digital Government Act 2022',
      version: '1.0',
      description: 'Papua New Guinea Digital Government Act 2022 compliance framework',
      requirements: this.createDGARequirements(),
      overallScore: 0,
      status: 'not-assessed'
    };

    // ISO 27001 Framework
    const iso27001Framework: ComplianceFramework = {
      id: 'iso-27001',
      name: 'ISO 27001',
      version: '2013',
      description: 'Information Security Management System standard',
      requirements: this.createISO27001Requirements(),
      overallScore: 0,
      status: 'not-assessed'
    };

    // SOC 2 Framework
    const soc2Framework: ComplianceFramework = {
      id: 'soc-2',
      name: 'SOC 2 Type II',
      version: '2017',
      description: 'Service Organization Control 2 framework',
      requirements: this.createSOC2Requirements(),
      overallScore: 0,
      status: 'not-assessed'
    };

    // GDPR Framework
    const gdprFramework: ComplianceFramework = {
      id: 'gdpr',
      name: 'GDPR',
      version: '2018',
      description: 'General Data Protection Regulation',
      requirements: this.createGDPRRequirements(),
      overallScore: 0,
      status: 'not-assessed'
    };

    this.frameworks.set(dgaFramework.id, dgaFramework);
    this.frameworks.set(iso27001Framework.id, iso27001Framework);
    this.frameworks.set(soc2Framework.id, soc2Framework);
    this.frameworks.set(gdprFramework.id, gdprFramework);

    this.logComplianceEvent('FRAMEWORKS_INITIALIZED', '', 'Compliance frameworks initialized');
  }

  private createDGARequirements(): ComplianceRequirement[] {
    return [
      {
        id: 'dga-ds-001',
        frameworkId: 'dga-2022',
        category: 'Data Sovereignty',
        title: 'Data Localization',
        description: 'All government data must be stored within Papua New Guinea or approved jurisdictions',
        priority: 'critical',
        status: 'compliant',
        evidence: ['Data residency policy', 'Server location documentation'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkDataLocalization',
        score: 100
      },
      {
        id: 'dga-sec-001',
        frameworkId: 'dga-2022',
        category: 'Security',
        title: 'End-to-End Encryption',
        description: 'All sensitive data must be encrypted in transit and at rest',
        priority: 'critical',
        status: 'compliant',
        evidence: ['Encryption implementation', 'Security audit'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkEncryption',
        score: 98
      },
      {
        id: 'dga-acc-001',
        frameworkId: 'dga-2022',
        category: 'Access Control',
        title: 'Multi-Factor Authentication',
        description: 'All administrative access must use multi-factor authentication',
        priority: 'high',
        status: 'compliant',
        evidence: ['MFA configuration', 'User access logs'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkMFA',
        score: 95
      },
      {
        id: 'dga-aud-001',
        frameworkId: 'dga-2022',
        category: 'Audit & Monitoring',
        title: 'Comprehensive Audit Logging',
        description: 'All system activities must be logged and monitored',
        priority: 'high',
        status: 'compliant',
        evidence: ['Audit log configuration', 'Monitoring setup'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkAuditLogging',
        score: 92
      },
      {
        id: 'dga-pri-001',
        frameworkId: 'dga-2022',
        category: 'Privacy',
        title: 'Data Minimization',
        description: 'Only necessary personal data should be collected and processed',
        priority: 'medium',
        status: 'partial',
        evidence: ['Data collection policy'],
        lastChecked: Date.now(),
        autoCheck: false,
        remediation: 'Implement automated data classification and retention policies',
        score: 78
      },
      {
        id: 'dga-inc-001',
        frameworkId: 'dga-2022',
        category: 'Incident Response',
        title: 'Incident Response Plan',
        description: 'Documented incident response procedures must be in place',
        priority: 'high',
        status: 'partial',
        evidence: ['Incident response documentation'],
        lastChecked: Date.now(),
        autoCheck: false,
        remediation: 'Complete incident response testing and tabletop exercises',
        score: 85
      }
    ];
  }

  private createISO27001Requirements(): ComplianceRequirement[] {
    return [
      {
        id: 'iso-isms-001',
        frameworkId: 'iso-27001',
        category: 'Information Security Management',
        title: 'ISMS Documentation',
        description: 'Documented Information Security Management System',
        priority: 'critical',
        status: 'compliant',
        evidence: ['ISMS policy', 'Security procedures'],
        lastChecked: Date.now(),
        autoCheck: false,
        score: 90
      },
      {
        id: 'iso-ra-001',
        frameworkId: 'iso-27001',
        category: 'Risk Assessment',
        title: 'Risk Assessment Process',
        description: 'Regular risk assessments and treatment plans',
        priority: 'critical',
        status: 'compliant',
        evidence: ['Risk register', 'Risk assessment reports'],
        lastChecked: Date.now(),
        autoCheck: false,
        score: 88
      },
      {
        id: 'iso-ac-001',
        frameworkId: 'iso-27001',
        category: 'Access Control',
        title: 'Access Control Policy',
        description: 'Comprehensive access control management',
        priority: 'high',
        status: 'compliant',
        evidence: ['Access control policy', 'User access reviews'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkAccessControl',
        score: 93
      }
    ];
  }

  private createSOC2Requirements(): ComplianceRequirement[] {
    return [
      {
        id: 'soc2-sec-001',
        frameworkId: 'soc-2',
        category: 'Security',
        title: 'Logical Access Controls',
        description: 'Controls to prevent unauthorized access',
        priority: 'critical',
        status: 'compliant',
        evidence: ['Access control implementation', 'User provisioning logs'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkLogicalAccess',
        score: 91
      },
      {
        id: 'soc2-av-001',
        frameworkId: 'soc-2',
        category: 'Availability',
        title: 'System Monitoring',
        description: 'Continuous monitoring of system availability',
        priority: 'high',
        status: 'partial',
        evidence: ['Monitoring configuration'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkSystemMonitoring',
        remediation: 'Implement 24/7 monitoring alerts',
        score: 82
      }
    ];
  }

  private createGDPRRequirements(): ComplianceRequirement[] {
    return [
      {
        id: 'gdpr-dp-001',
        frameworkId: 'gdpr',
        category: 'Data Protection',
        title: 'Privacy by Design',
        description: 'Privacy considerations built into system design',
        priority: 'critical',
        status: 'compliant',
        evidence: ['Privacy impact assessments', 'System design documentation'],
        lastChecked: Date.now(),
        autoCheck: false,
        score: 94
      },
      {
        id: 'gdpr-con-001',
        frameworkId: 'gdpr',
        category: 'Consent',
        title: 'Consent Management',
        description: 'Clear consent mechanisms for data processing',
        priority: 'high',
        status: 'compliant',
        evidence: ['Consent forms', 'Consent tracking system'],
        lastChecked: Date.now(),
        autoCheck: false,
        score: 89
      },
      {
        id: 'gdpr-rt-001',
        frameworkId: 'gdpr',
        category: 'Data Subject Rights',
        title: 'Right to be Forgotten',
        description: 'Ability to delete personal data upon request',
        priority: 'high',
        status: 'compliant',
        evidence: ['Data deletion procedures', 'Request handling logs'],
        lastChecked: Date.now(),
        autoCheck: true,
        checkFunction: 'checkDataDeletion',
        score: 96
      }
    ];
  }

  // Run compliance assessment
  async runAssessment(frameworkId?: string): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = [];
    const frameworksToAssess = frameworkId
      ? [this.frameworks.get(frameworkId)].filter(Boolean)
      : Array.from(this.frameworks.values());

    for (const framework of frameworksToAssess) {
      const report = await this.assessFramework(framework!);
      reports.push(report);
      this.reports.set(report.id, report);
    }

    this.logComplianceEvent('ASSESSMENT_COMPLETED', frameworkId || 'all', `Assessment completed for ${reports.length} frameworks`);
    return reports;
  }

  private async assessFramework(framework: ComplianceFramework): Promise<ComplianceReport> {
    const findings: ComplianceFinding[] = [];
    let totalScore = 0;
    let criticalIssues = 0;

    for (const requirement of framework.requirements) {
      // Run automated checks if available
      if (requirement.autoCheck && requirement.checkFunction) {
        const result = await this.runAutomatedCheck(requirement.checkFunction);
        requirement.status = result.status as 'compliant' | 'non-compliant' | 'partial' | 'not-implemented';
        requirement.score = result.score;
        requirement.lastChecked = Date.now();
      }

      const finding: ComplianceFinding = {
        requirementId: requirement.id,
        status: requirement.status,
        score: requirement.score,
        evidence: requirement.evidence,
        issues: requirement.status === 'non-compliant' ? [requirement.description] : [],
        recommendations: requirement.remediation ? [requirement.remediation] : []
      };

      findings.push(finding);
      totalScore += requirement.score;

      if (requirement.priority === 'critical' && requirement.status !== 'compliant') {
        criticalIssues++;
      }
    }

    const overallScore = Math.round(totalScore / framework.requirements.length);
    const status = this.determineComplianceStatus(overallScore, criticalIssues);

    // Update framework
    framework.overallScore = overallScore;
    framework.status = status;
    framework.lastAssessment = Date.now();
    framework.nextAssessment = Date.now() + this.assessmentInterval;

    const report: ComplianceReport = {
      id: `report_${framework.id}_${Date.now()}`,
      frameworkId: framework.id,
      generated: Date.now(),
      overallScore,
      status,
      findings,
      recommendations: this.generateRecommendations(findings),
      nextAssessment: framework.nextAssessment
    };

    return report;
  }

  private async runAutomatedCheck(checkFunction: string): Promise<{ status: string; score: number }> {
    // Simulate automated compliance checks
    const checks: Record<string, () => { status: string; score: number }> = {
      checkDataLocalization: () => ({ status: 'compliant', score: 100 }),
      checkEncryption: () => ({ status: 'compliant', score: 98 }),
      checkMFA: () => ({ status: 'compliant', score: 95 }),
      checkAuditLogging: () => ({ status: 'compliant', score: 92 }),
      checkAccessControl: () => ({ status: 'compliant', score: 93 }),
      checkLogicalAccess: () => ({ status: 'compliant', score: 91 }),
      checkSystemMonitoring: () => ({ status: 'partial', score: 82 }),
      checkDataDeletion: () => ({ status: 'compliant', score: 96 })
    };

    return checks[checkFunction] ? checks[checkFunction]() : { status: 'not-assessed', score: 0 };
  }

  private determineComplianceStatus(score: number, criticalIssues: number): 'compliant' | 'non-compliant' | 'partial' {
    if (criticalIssues > 0) return 'non-compliant';
    if (score >= 90) return 'compliant';
    if (score >= 70) return 'partial';
    return 'non-compliant';
  }

  private generateRecommendations(findings: ComplianceFinding[]): string[] {
    const recommendations: string[] = [];

    findings.forEach(finding => {
      if (finding.status !== 'compliant') {
        recommendations.push(...finding.recommendations);
      }
    });

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push('Continue regular monitoring and assessment');
      recommendations.push('Review and update security policies annually');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  // Get compliance metrics
  getComplianceMetrics(): ComplianceMetrics {
    const frameworks = Array.from(this.frameworks.values());
    const totalFrameworks = frameworks.length;
    const compliantFrameworks = frameworks.filter(f => f.status === 'compliant').length;

    const criticalIssues = frameworks.reduce((total, framework) => {
      return total + framework.requirements.filter(
        req => req.priority === 'critical' && req.status !== 'compliant'
      ).length;
    }, 0);

    const overallScore = frameworks.length > 0
      ? Math.round(frameworks.reduce((sum, f) => sum + f.overallScore, 0) / frameworks.length)
      : 0;

    const lastAssessment = Math.max(...frameworks.map(f => f.lastAssessment || 0));

    return {
      totalFrameworks,
      compliantFrameworks,
      criticalIssues,
      overallScore,
      lastAssessment,
      trendsLast30Days: this.generateTrendData()
    };
  }

  private generateTrendData(): { date: string; score: number }[] {
    const trends = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const score = 85 + Math.random() * 10; // Simulated trend data
      trends.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(score)
      });
    }

    return trends;
  }

  // Get specific framework status
  getFrameworkStatus(frameworkId: string): ComplianceFramework | null {
    return this.frameworks.get(frameworkId) || null;
  }

  // Get all frameworks
  getAllFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values());
  }

  // Get latest report for framework
  getLatestReport(frameworkId: string): ComplianceReport | null {
    const reports = Array.from(this.reports.values())
      .filter(r => r.frameworkId === frameworkId)
      .sort((a, b) => b.generated - a.generated);

    return reports[0] || null;
  }

  // Generate compliance report
  generateComplianceReport(frameworkId: string): ComplianceReport | null {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) return null;

    return this.getLatestReport(frameworkId);
  }

  // Update requirement status manually
  updateRequirement(frameworkId: string, requirementId: string, updates: Partial<ComplianceRequirement>): boolean {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) return false;

    const requirement = framework.requirements.find(r => r.id === requirementId);
    if (!requirement) return false;

    Object.assign(requirement, updates);
    requirement.lastChecked = Date.now();

    // Recalculate framework score
    const totalScore = framework.requirements.reduce((sum, req) => sum + req.score, 0);
    framework.overallScore = Math.round(totalScore / framework.requirements.length);

    this.logComplianceEvent('REQUIREMENT_UPDATED', frameworkId, `Requirement ${requirementId} updated`);
    return true;
  }

  private startContinuousMonitoring(): void {
    // Run assessments periodically
    setInterval(async () => {
      const frameworks = Array.from(this.frameworks.values());
      const frameworksToAssess = frameworks.filter(
        f => !f.nextAssessment || f.nextAssessment <= Date.now()
      );

      if (frameworksToAssess.length > 0) {
        this.logComplianceEvent('AUTO_ASSESSMENT', '', `Running automated assessment for ${frameworksToAssess.length} frameworks`);
        for (const framework of frameworksToAssess) {
          await this.runAssessment(framework.id);
        }
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  private logComplianceEvent(event: string, frameworkId: string, message: string): void {
    console.log(`[COMPLIANCE] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      frameworkId,
      message
    });
  }
}

// Export singleton instance
export const compliance = ComplianceMonitor.getInstance();
