"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  Users,
  Key,
  QrCode,
  CreditCard,
  FileText,
  Settings,
  Eye,
  UserPlus,
  Database,
  Lock,
  CheckCircle,
  Activity,
  BarChart,
  Globe,
  AlertTriangle,
  Clock,
  RefreshCw,
  Smartphone,
  User
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';
import DigitalIDIssuance from '@/components/digitalid/DigitalIDIssuance';
import ServiceAuthenticationGateway from '@/components/digitalid/ServiceAuthenticationGateway';
import UserRegistry from '@/components/digitalid/UserRegistry';

export default function DigitalIDPage() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [userRole] = useState<'admin' | 'operator' | 'viewer'>('admin'); // This would come from auth context

  const [systemStats] = useState({
    totalUsers: 15432,
    activeCredentials: 14287,
    pendingVerifications: 234,
    dailyAuthentications: 8956,
    systemUptime: 99.97,
    securityScore: 98.5
  });

  const serviceModules = [
    {
      id: 'issuance',
      title: 'Digital ID Issuance',
      description: 'Issue digital credentials (QR codes, certificates, NFC cards)',
      icon: Key,
      color: 'bg-blue-600',
      stats: { issued: '14,287', pending: '234' },
      features: ['QR Code Generation', 'Digital Certificates', 'NFC Smart Cards', 'Mobile Wallets']
    },
    {
      id: 'authentication',
      title: 'Service Authentication',
      description: 'Verify Digital ID for service access',
      icon: Shield,
      color: 'bg-green-600',
      stats: { authentications: '8,956', success: '99.2%' },
      features: ['Multi-factor Auth', 'Biometric Verification', 'QR Code Scanning', 'Real-time Validation']
    },
    {
      id: 'registry',
      title: 'User Registry',
      description: 'Manage registered Digital ID users',
      icon: Users,
      color: 'bg-purple-600',
      stats: { users: '15,432', verified: '14,287' },
      features: ['User Management', 'Status Tracking', 'Bulk Operations', 'Export Functions']
    },
    {
      id: 'verification',
      title: 'Credential Verification',
      description: 'Verify authenticity of Digital ID credentials',
      icon: Eye,
      color: 'bg-orange-600',
      stats: { verifications: '23,456', fraudDetected: '12' },
      features: ['Real-time Verification', 'Fraud Detection', 'Compliance Checks', 'Audit Trails']
    }
  ];

  const mockService = {
    id: 'health_records',
    name: 'Healthcare Records Access',
    department: 'Ministry of Health',
    securityLevel: 'enhanced' as const,
    requiredTier: 3
  };

  const handleServiceSelect = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 via-black to-yellow-600 p-8 rounded-lg text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Shield className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">PNG Digital ID System</h1>
              <p className="text-xl opacity-90">
                Secure Digital Identity Platform for Papua New Guinea
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <div className="text-sm opacity-90">Registered Users</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{systemStats.activeCredentials.toLocaleString()}</div>
              <div className="text-sm opacity-90">Active Credentials</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{systemStats.dailyAuthentications.toLocaleString()}</div>
              <div className="text-sm opacity-90">Daily Authentications</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
              <div className="text-sm opacity-90">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setActiveModule('issuance')}
          className="h-24 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Key className="h-8 w-8" />
          <span>Issue Digital ID</span>
        </Button>
        <Button
          onClick={() => setActiveModule('authentication')}
          variant="outline"
          className="h-24 flex-col gap-2"
        >
          <Shield className="h-8 w-8" />
          <span>Verify Identity</span>
        </Button>
        <Button
          onClick={() => setActiveModule('registry')}
          variant="outline"
          className="h-24 flex-col gap-2"
        >
          <Users className="h-8 w-8" />
          <span>User Registry</span>
        </Button>
        <Button
          onClick={() => setActiveModule('verification')}
          variant="outline"
          className="h-24 flex-col gap-2"
        >
          <Eye className="h-8 w-8" />
          <span>Verify Credentials</span>
        </Button>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>API Uptime</span>
                <Badge className="bg-green-100 text-green-800">
                  {systemStats.systemUptime}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Score</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {systemStats.securityScore}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending Tasks</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {systemStats.pendingVerifications}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Daily Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>New Registrations</span>
                <span className="font-bold">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Credentials Issued</span>
                <span className="font-bold">98</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authentications</span>
                <span className="font-bold">{systemStats.dailyAuthentications.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Service Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Government Services</span>
                <Badge className="bg-green-100 text-green-800">12 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Banking Partners</span>
                <Badge className="bg-blue-100 text-blue-800">3 Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Healthcare Providers</span>
                <Badge className="bg-purple-100 text-purple-800">8 Integrated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Digital ID Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {serviceModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={module.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleServiceSelect(module.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${module.color} rounded-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(module.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Key Features:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {module.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent System Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New user registration', user: 'John Doe (PNG2024123456)', time: '2 minutes ago', type: 'success' },
              { action: 'Credential verification', user: 'Healthcare Service Access', time: '5 minutes ago', type: 'info' },
              { action: 'Biometric update', user: 'Mary Smith (PNG2024234567)', time: '12 minutes ago', type: 'warning' },
              { action: 'Admin login', user: 'System Administrator', time: '18 minutes ago', type: 'info' },
              { action: 'Bulk user export', user: 'Registry Manager', time: '25 minutes ago', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.user}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Security */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { framework: 'PNG DGA 2022', status: 'Compliant', score: 98 },
                { framework: 'ISO 27001', status: 'Compliant', score: 96 },
                { framework: 'SOC 2 Type II', status: 'Compliant', score: 94 },
                { framework: 'GDPR', status: 'Compliant', score: 97 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.framework}</div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-600">{item.score}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Low Priority</AlertTitle>
                <AlertDescription>
                  234 pending verification requests require review
                </AlertDescription>
              </Alert>
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Maintenance</AlertTitle>
                <AlertDescription>
                  Scheduled system maintenance in 3 days
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'issuance':
        return (
          <div>
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveModule('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <DigitalIDIssuance
              citizenId="demo_citizen_001"
              onIssuanceComplete={(credentialId, credentials) => {
                console.log('Issuance completed:', credentialId, credentials);
              }}
            />
          </div>
        );

      case 'authentication':
        return (
          <div>
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveModule('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <ServiceAuthenticationGateway
              requestedService={mockService}
              onAuthenticationSuccess={(digitalId, authData) => {
                console.log('Authentication successful:', digitalId, authData);
              }}
              onAuthenticationFailure={(error) => {
                console.log('Authentication failed:', error);
              }}
              onCancel={() => setActiveModule('dashboard')}
            />
          </div>
        );

      case 'registry':
        return (
          <div>
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveModule('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <UserRegistry
              role={userRole}
              onUserSelect={(user) => {
                console.log('User selected:', user);
              }}
            />
          </div>
        );

      case 'verification':
        return (
          <div>
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveModule('dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Credential Verification
                </CardTitle>
                <CardDescription>
                  Verify the authenticity of Digital ID credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4">
                    <Eye className="h-12 w-12 text-blue-600 mx-auto mt-2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Credential Verification Module</h3>
                  <p className="text-gray-600 mb-4">
                    This module allows verification of Digital ID credentials for authenticity and validity.
                  </p>
                  <Button>
                    <QrCode className="h-4 w-4 mr-2" />
                    Start Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopNavigation />

      <div className="container mx-auto px-6 py-8">
        {renderModuleContent()}
      </div>
    </div>
  );
}
