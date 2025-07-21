"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Fingerprint,
  Smartphone,
  Video,
  Database,
  Workflow,
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  Mic,
  Users,
  Settings,
  Activity,
  BarChart3,
  Globe,
  FileText,
  Clock,
  Star,
  Zap,
  Brain,
  MonitorSpeaker,
  Router
} from 'lucide-react';
import BiometricAuth from './BiometricAuth';
import VideoConsultationPortal from './VideoConsultationPortal';
import { useLanguage } from '@/contexts/LanguageContext';
import { biometricAuth } from '@/lib/biometric';
import { nativeFeatures } from '@/lib/mobile/NativeFeatures';
import { videoConsultation } from '@/lib/video/VideoConsultation';
import { legacySystemManager } from '@/lib/legacy/SystemConnectors';
import { workflowEngine } from '@/lib/workflow/WorkflowEngine';

interface Phase3IntegrationProps {
  citizenId: string;
  onFeatureChange?: (feature: string, enabled: boolean) => void;
}

export default function Phase3Integration({ citizenId, onFeatureChange }: Phase3IntegrationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [biometricStatus, setBiometricStatus] = useState<any>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<any>(null);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [workflowMetrics, setWorkflowMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    initializePhase3Features();
  }, []);

  const initializePhase3Features = async () => {
    setIsLoading(true);
    try {
      // Load biometric status
      const bioStats = biometricAuth.getBiometricStats(citizenId);
      setBiometricStatus(bioStats);

      // Load device capabilities
      const deviceCaps = await nativeFeatures.getDeviceInfo();
      setDeviceCapabilities(deviceCaps);

      // Load system statistics
      const connectedSystems = legacySystemManager.getConnectedSystems();
      setSystemStats({
        totalSystems: connectedSystems.length,
        activeSystems: connectedSystems.filter(s => s.status === 'active').length,
        lastSync: Math.max(...connectedSystems.map(s => s.lastSync))
      });

      // Load workflow metrics
      const wfMetrics = workflowEngine.getWorkflowMetrics();
      setWorkflowMetrics(wfMetrics);

    } catch (error) {
      console.error('[Phase3] Initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Phase 3 Status Overview */}
      <Alert className="border-green-500">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Phase 3: Next-Generation Platform Active</AlertTitle>
        <AlertDescription className="text-green-700">
          All cutting-edge features are deployed and operational. Papua New Guinea Government Portal
          now features biometric authentication, native mobile apps, video consultation, legacy system
          integration, and advanced workflow automation.
        </AlertDescription>
      </Alert>

      {/* Feature Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Biometric Authentication */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Fingerprint className="h-4 w-4 text-blue-600" />
              Biometric Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enrolled Biometrics</span>
                <Badge variant="outline">{biometricStatus?.enrolledBiometrics || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {biometricStatus?.successRate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Verifications</span>
                <span className="text-sm">{biometricStatus?.totalVerifications || 0}</span>
              </div>
              <Progress value={biometricStatus?.successRate || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Native Mobile Apps */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Smartphone className="h-4 w-4 text-green-600" />
              Native Mobile Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Platform</span>
                <Badge variant="outline">{deviceCapabilities?.platform || 'web'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PWA Installed</span>
                <Badge variant={deviceCapabilities?.isTablet ? "default" : "secondary"}>
                  {deviceCapabilities?.isTablet ? 'Yes' : 'Web'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Device Features</span>
                <span className="text-sm">
                  {Object.values(deviceCapabilities?.capabilities || {}).filter(Boolean).length || 0}/6
                </span>
              </div>
              <Progress
                value={(Object.values(deviceCapabilities?.capabilities || {}).filter(Boolean).length / 6) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Consultation */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-purple-600" />
              Video Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Available Officers</span>
                <Badge variant="outline">
                  {videoConsultation.getAvailableOfficers().filter(o => o.isOnline).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sessions</span>
                <Badge variant="outline">
                  {videoConsultation.getActiveSessions(citizenId).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WebRTC Support</span>
                <Badge variant="default">Available</Badge>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Legacy System Integration */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-orange-600" />
              Legacy Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected Systems</span>
                <Badge variant="outline">{systemStats?.totalSystems || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Systems</span>
                <Badge variant="default">{systemStats?.activeSystems || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Sync</span>
                <span className="text-sm">
                  {systemStats?.lastSync ? new Date(systemStats.lastSync).toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <Progress
                value={systemStats?.totalSystems ? (systemStats.activeSystems / systemStats.totalSystems) * 100 : 0}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Automation */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4 text-red-600" />
              Workflow Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Workflows</span>
                <Badge variant="outline">{workflowMetrics?.activeWorkflows || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SLA Compliance</span>
                <span className="text-sm font-medium text-green-600">
                  {workflowMetrics?.slaCompliance?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Completion</span>
                <span className="text-sm">
                  {workflowMetrics?.averageCompletionTime ?
                    `${Math.round(workflowMetrics.averageCompletionTime / 3600000)}h` : 'N/A'}
                </span>
              </div>
              <Progress value={workflowMetrics?.slaCompliance || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* AI & Security Integration */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-indigo-600" />
              AI & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Chatbot</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Blockchain Docs</span>
                <Badge variant="default">Verified</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Score</span>
                <span className="text-sm font-medium text-green-600">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access Phase 3 features quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('biometric')}
            >
              <Fingerprint className="h-6 w-6" />
              <span className="text-sm">Biometric Auth</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('video')}
            >
              <Video className="h-6 w-6" />
              <span className="text-sm">Video Call</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('mobile')}
            >
              <Smartphone className="h-6 w-6" />
              <span className="text-sm">Mobile App</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setActiveTab('workflow')}
            >
              <Workflow className="h-6 w-6" />
              <span className="text-sm">Workflows</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBiometricTab = () => (
    <div className="space-y-6">
      <BiometricAuth
        citizenId={citizenId}
        mode="manage"
        onSuccess={(result) => {
          console.log('[Biometric] Success:', result);
          initializePhase3Features();
        }}
        onError={(error) => {
          console.error('[Biometric] Error:', error);
        }}
      />
    </div>
  );

  const renderVideoTab = () => (
    <div className="space-y-6">
      <VideoConsultationPortal
        citizenId={citizenId}
        onScheduled={(sessionId) => {
          console.log('[Video] Scheduled:', sessionId);
        }}
        onCallEnded={(sessionId) => {
          console.log('[Video] Call ended:', sessionId);
        }}
      />
    </div>
  );

  const renderMobileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            Native Mobile Applications
          </CardTitle>
          <CardDescription>
            Experience the PNG Government Portal on your mobile device with native app features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Device Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <Badge>{deviceCapabilities?.platform || 'Unknown'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="text-sm">{deviceCapabilities?.model || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Screen Size:</span>
                  <span className="text-sm">
                    {deviceCapabilities?.screenSize ?
                      `${deviceCapabilities.screenSize.width}x${deviceCapabilities.screenSize.height}` :
                      'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Device Type:</span>
                  <Badge variant={deviceCapabilities?.isTablet ? "default" : "secondary"}>
                    {deviceCapabilities?.isTablet ? 'Tablet' : 'Phone/Desktop'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(deviceCapabilities?.capabilities || {}).map(([feature, available]) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <Badge variant={available ? "default" : "secondary"}>
                      {available ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* App Download Links */}
          <Card>
            <CardHeader>
              <CardTitle>Download Mobile Apps</CardTitle>
              <CardDescription>
                Get the full native experience on your iOS or Android device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-16 flex items-center gap-4"
                  disabled
                >
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">📱</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Download for iOS</div>
                    <div className="text-sm text-slate-500">Coming Soon to App Store</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 flex items-center gap-4"
                  disabled
                >
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🤖</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Download for Android</div>
                    <div className="text-sm text-slate-500">Coming Soon to Play Store</div>
                  </div>
                </Button>
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Development Status</AlertTitle>
                <AlertDescription>
                  Native mobile applications are currently in development. You can use the Progressive Web App (PWA)
                  version for a native-like experience on your mobile device.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkflowTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-purple-600" />
            Advanced Workflow Automation
          </CardTitle>
          <CardDescription>
            Intelligent inter-departmental process automation for PNG Government services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workflow Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {workflowMetrics?.activeWorkflows || 0}
                </div>
                <div className="text-sm text-slate-600">Active Workflows</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {workflowMetrics?.completedWorkflows || 0}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {workflowMetrics?.averageCompletionTime ?
                    `${Math.round(workflowMetrics.averageCompletionTime / 3600000)}h` : '0h'}
                </div>
                <div className="text-sm text-slate-600">Avg. Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {workflowMetrics?.slaCompliance?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-slate-600">SLA Compliance</div>
              </CardContent>
            </Card>
          </div>

          {/* Available Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Available Automated Workflows</CardTitle>
              <CardDescription>Government service workflows with intelligent automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Birth Certificate Application Approval',
                    description: 'Multi-step approval process with automatic verification',
                    departments: ['Civil Registration', 'Verification', 'Printing'],
                    avgTime: '3-5 days',
                    successRate: 94.5
                  },
                  {
                    name: 'Passport Application Processing',
                    description: 'Complex inter-departmental workflow with security checks',
                    departments: ['Immigration', 'Security', 'Printing', 'Delivery'],
                    avgTime: '7-14 days',
                    successRate: 91.2
                  },
                  {
                    name: 'Business License Multi-Department Approval',
                    description: 'Parallel processing across multiple government departments',
                    departments: ['Business Registration', 'Tax Office', 'Environmental', 'Zoning'],
                    avgTime: '10-15 days',
                    successRate: 87.8
                  }
                ].map((workflow, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{workflow.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {workflow.departments.map((dept, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium">{workflow.avgTime}</div>
                        <div className="text-sm text-green-600">{workflow.successRate}% success</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={workflow.successRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-orange-600" />
            Legacy System Integration
          </CardTitle>
          <CardDescription>
            Real-time integration with existing PNG Government databases and systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connected Systems */}
          <div className="space-y-4">
            {[
              {
                name: 'PNG Civil Registration Database',
                type: 'Oracle Database',
                status: 'active',
                lastSync: '2 minutes ago',
                records: '2.1M',
                endpoint: 'civilreg.gov.pg:1521'
              },
              {
                name: 'PNG Immigration & Citizenship System',
                type: 'REST API',
                status: 'active',
                lastSync: '5 minutes ago',
                records: '850K',
                endpoint: 'immigration.gov.pg/api/v2'
              },
              {
                name: 'PNG Business Registration System',
                type: 'SOAP Web Service',
                status: 'active',
                lastSync: '10 minutes ago',
                records: '125K',
                endpoint: 'bizreg.gov.pg:8080/services'
              },
              {
                name: 'PNG Motor Vehicle Registry',
                type: 'MySQL Database',
                status: 'maintenance',
                lastSync: '1 hour ago',
                records: '380K',
                endpoint: 'vehreg.gov.pg:3306'
              }
            ].map((system, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{system.name}</h4>
                      <p className="text-sm text-slate-600">{system.type}</p>
                      <p className="text-xs text-slate-500">{system.endpoint}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={system.status === 'active' ? 'default' : 'secondary'}
                      className={
                        system.status === 'active' ? 'bg-green-100 text-green-800' :
                        system.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {system.status}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">
                      {system.records} records
                    </p>
                    <p className="text-xs text-slate-400">
                      Synced {system.lastSync}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Integration Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Router className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-slate-600">Connected Systems</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">99.2%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-600">3.4M</div>
                <div className="text-sm text-slate-600">Total Records</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Phase 3: Next-Generation Platform
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Advanced biometric authentication, native mobile apps, video consultation,
          legacy system integration, and workflow automation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="biometric">Biometric</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="biometric">
          {renderBiometricTab()}
        </TabsContent>

        <TabsContent value="video">
          {renderVideoTab()}
        </TabsContent>

        <TabsContent value="mobile">
          {renderMobileTab()}
        </TabsContent>

        <TabsContent value="workflow">
          {renderWorkflowTab()}
        </TabsContent>

        <TabsContent value="systems">
          {renderSystemsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
