"use client";

import React, { useState, useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import CitizenPortal from '@/components/portals/CitizenPortal';
import AdminPortal from '@/components/portals/AdminPortal';
import ServiceProviderPortal from '@/components/portals/ServiceProviderPortal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import AIChatbot from '@/components/AIChatbot';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import Phase3Integration from '@/components/Phase3Integration';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  Lock,
  Key,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Users,
  Settings,
  Eye,
  Download,
  ExternalLink,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const securityMetrics = [
  { name: 'Encryption', status: 'Active', score: 98, color: '#10b981' },
  { name: 'Authentication', status: 'Active', score: 95, color: '#3b82f6' },
  { name: 'Data Protection', status: 'Active', score: 92, color: '#6366f1' },
  { name: 'Audit Logging', status: 'Active', score: 89, color: '#8b5cf6' },
  { name: 'Compliance', status: 'Monitoring', score: 87, color: '#f59e0b' },
];

const complianceData = [
  { framework: 'Digital Gov Act 2022', compliance: 94, status: 'Compliant' },
  { framework: 'ISO 27001', compliance: 91, status: 'Compliant' },
  { framework: 'SOC 2', compliance: 88, status: 'In Progress' },
  { framework: 'GDPR', compliance: 96, status: 'Compliant' },
];

const threatData = [
  { time: '00:00', threats: 2, blocked: 2 },
  { time: '04:00', threats: 5, blocked: 5 },
  { time: '08:00', threats: 12, blocked: 11 },
  { time: '12:00', threats: 8, blocked: 8 },
  { time: '16:00', threats: 15, blocked: 14 },
  { time: '20:00', threats: 6, blocked: 6 },
];

const encryptionStatus = [
  { name: 'Encrypted', value: 94, color: '#10b981' },
  { name: 'Unencrypted', value: 6, color: '#ef4444' },
];

function SecurityDashboardInner() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activeThreats, setActiveThreats] = useState(0);
  const [currentPortal, setCurrentPortal] = useState<'citizen' | 'admin' | 'service-provider'>('citizen');
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showPhase3Integration, setShowPhase3Integration] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Set initial time on client
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderPortal = () => {
    switch (currentPortal) {
      case 'citizen':
        return <CitizenPortal />;
      case 'admin':
        return <AdminPortal />;
      case 'service-provider':
        return <ServiceProviderPortal />;
      default:
        return <CitizenPortal />;
    }
  };

  if (showAdvancedAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto p-6">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedAnalytics(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Button>
          </div>
          <AdvancedAnalytics />
        </div>
      </div>
    );
  }

  if (showPhase3Integration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto p-6">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowPhase3Integration(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Button>
          </div>
          <Phase3Integration
            citizenId="citizen_12345"
            onFeatureChange={(feature, enabled) => {
              console.log(`[Phase3] ${feature} ${enabled ? 'enabled' : 'disabled'}`);
            }}
          />
        </div>
      </div>
    );
  }

  if (showSecurityDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Enhanced Security Framework
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              End-to-End Encryption & Digital Government Act 2022 Compliance Dashboard
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/demo">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Interactive Demo
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setShowSecurityDashboard(false)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Back to Portals
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Secure
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Clock className="h-3 w-3 mr-1" />
                {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Activity className="h-3 w-3 mr-1" />
                {activeThreats} Active Threats
              </Badge>
            </div>
          </div>

          {/* Security Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Encryption Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">98%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">All critical data encrypted</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">94%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">DGA 2022 compliant</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">1,247</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Authenticated sessions</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Threats Blocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">156</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="encryption">Encryption</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Security Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Metrics</CardTitle>
                    <CardDescription>Real-time security framework status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: metric.color }}
                            />
                            <span className="font-medium">{metric.name}</span>
                            <Badge variant={metric.status === 'Active' ? 'default' : 'secondary'}>
                              {metric.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={metric.score} className="w-20" />
                            <span className="text-sm font-medium">{metric.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle>Threat Monitoring</CardTitle>
                    <CardDescription>24-hour threat detection and blocking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={threatData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="threats" stroke="#ef4444" name="Threats Detected" />
                        <Line type="monotone" dataKey="blocked" stroke="#10b981" name="Threats Blocked" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Framework Status</CardTitle>
                  <CardDescription>Digital Government Act 2022 and related standards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {complianceData.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{item.framework}</h4>
                          <Badge variant={item.status === 'Compliant' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                        <Progress value={item.compliance} className="mb-2" />
                        <span className="text-sm text-slate-600">{item.compliance}% compliant</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="encryption" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Encryption Overview</CardTitle>
                    <CardDescription>End-to-end encryption status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={encryptionStatus}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {encryptionStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      {encryptionStatus.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Management</CardTitle>
                    <CardDescription>Cryptographic key status and rotation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Master Encryption Key</p>
                            <p className="text-sm text-slate-600">AES-256-GCM</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Data Encryption Keys</p>
                            <p className="text-sm text-slate-600">ChaCha20-Poly1305</p>
                          </div>
                        </div>
                        <Badge variant="default">Rotating</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Authentication Keys</p>
                            <p className="text-sm text-slate-600">Ed25519</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Digital Government Act 2022 Compliance</AlertTitle>
                <AlertDescription>
                  This framework ensures full compliance with digital government standards including data sovereignty,
                  privacy protection, and secure digital service delivery requirements.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Checklist</CardTitle>
                    <CardDescription>Digital Government Act 2022 requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Data encryption at rest and in transit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Multi-factor authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Audit logging and monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Data sovereignty compliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Incident response procedures (in progress)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>Current security risk levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Breach Risk</span>
                        <div className="flex items-center gap-2">
                          <Progress value={15} className="w-20" />
                          <Badge variant="default">Low</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Unauthorized Access</span>
                        <div className="flex items-center gap-2">
                          <Progress value={22} className="w-20" />
                          <Badge variant="default">Low</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Vulnerability</span>
                        <div className="flex items-center gap-2">
                          <Progress value={8} className="w-20" />
                          <Badge variant="default">Very Low</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Monitoring</CardTitle>
                    <CardDescription>System activity and security events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">User authentication successful</span>
                        </div>
                        <span className="text-xs text-slate-600">{currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Data encryption key rotated</span>
                        </div>
                        <span className="text-xs text-slate-600">2 min ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">Suspicious activity detected and blocked</span>
                        </div>
                        <span className="text-xs text-slate-600">5 min ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Infrastructure and service status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption Service</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Authentication Service</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audit Logging</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance Monitor</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Reports</CardTitle>
                  <CardDescription>Generate and download compliance and security reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      DGA 2022 Compliance Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Security Assessment Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Encryption Status Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Audit Trail Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Risk Assessment Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Incident Response Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <TopNavigation
        currentPortal={currentPortal}
        onPortalChange={setCurrentPortal}
      />

      <div className="container mx-auto p-6">
        {/* Portal Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t('portal.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('portal.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSecurityDashboard(true)}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                {t('nav.security_dashboard')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedAnalytics(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Advanced Analytics
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPhase3Integration(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
              >
                <Shield className="h-4 w-4 text-purple-600" />
                Phase 3: Next-Gen Platform
              </Button>
              <Link href="/digital-id">
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Key className="h-4 w-4" />
                  Digital ID System
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Portal Content */}
        {renderPortal()}
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

export default function SecurityDashboard() {
  return <SecurityDashboardInner />;
}
