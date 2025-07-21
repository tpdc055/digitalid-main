"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  Eye,
  Database,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Lock,
  Users,
  FileText,
  Clock,
  Download,
  Trash2,
  Key,
  Globe,
  Building,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: {
      government: true,
      banking: false,
      healthcare: true,
      education: false,
      telecommunications: false,
      privateServices: false
    },
    biometricData: {
      fingerprint: true,
      facial: true,
      iris: false,
      voice: false
    },
    notifications: {
      email: true,
      sms: true,
      pushNotifications: true,
      securityAlerts: true
    },
    accessControl: {
      locationTracking: false,
      usageAnalytics: true,
      thirdPartyIntegration: false,
      dataRetention: 'standard'
    }
  });

  const [accessHistory, setAccessHistory] = useState([]);
  const [dataRequests, setDataRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for access history and data requests
    const mockAccessHistory = [
      {
        id: 1,
        service: 'Healthcare Portal',
        department: 'Ministry of Health',
        accessTime: '2024-01-20T14:30:00Z',
        dataAccessed: ['Personal Info', 'Medical Records'],
        purpose: 'Appointment booking',
        status: 'completed'
      },
      {
        id: 2,
        service: 'BSP PNG Banking',
        department: 'Banking Partner',
        accessTime: '2024-01-20T09:15:00Z',
        dataAccessed: ['Identity Verification', 'Contact Info'],
        purpose: 'Account verification',
        status: 'completed'
      },
      {
        id: 3,
        service: 'UPNG Student Portal',
        department: 'Education',
        accessTime: '2024-01-19T16:45:00Z',
        dataAccessed: ['Personal Info', 'Academic Records'],
        purpose: 'Enrollment verification',
        status: 'completed'
      },
      {
        id: 4,
        service: 'Transport Licensing',
        department: 'Ministry of Transport',
        accessTime: '2024-01-18T11:20:00Z',
        dataAccessed: ['Identity Verification', 'Address Proof'],
        purpose: 'Driver license renewal',
        status: 'pending'
      }
    ];

    const mockDataRequests = [
      {
        id: 1,
        requester: 'PNG Electoral Commission',
        purpose: 'Voter registration verification',
        dataRequested: ['Personal Info', 'Address', 'Citizenship Status'],
        requestDate: '2024-01-19T10:00:00Z',
        status: 'pending',
        expiryDate: '2024-01-26T10:00:00Z'
      },
      {
        id: 2,
        requester: 'PNG Internal Revenue Commission',
        purpose: 'Tax compliance verification',
        dataRequested: ['Personal Info', 'Employment Status', 'Income Verification'],
        requestDate: '2024-01-18T14:30:00Z',
        status: 'approved',
        approvedDate: '2024-01-19T09:15:00Z'
      }
    ];

    setLoading(true);
    setTimeout(() => {
      setAccessHistory(mockAccessHistory);
      setDataRequests(mockDataRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const updatePrivacySetting = (category, setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleDataRequest = (requestId, action) => {
    setDataRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: action, [action + 'Date']: new Date().toISOString() }
          : request
      )
    );
  };

  const exportPrivacyData = () => {
    const privacyData = {
      settings: privacySettings,
      accessHistory,
      dataRequests,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(privacyData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `PNG_DigitalID_Privacy_Data_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const deletePersonalData = () => {
    if (window.confirm('Are you sure you want to request deletion of your personal data? This action cannot be undone and will deactivate your Digital ID.')) {
      console.log('Data deletion requested');
      alert('Data deletion request submitted. You will receive confirmation within 48 hours.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TopNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading privacy settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/digital-id">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Digital ID
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Settings</h1>
              <p className="text-slate-600">Manage your data sharing preferences and privacy controls</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Privacy Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Sharing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sharing Permissions
                </CardTitle>
                <CardDescription>
                  Control which services can access your Digital ID data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'government', label: 'Government Services', description: 'PNG government departments and agencies', icon: Building },
                    { key: 'banking', label: 'Banking & Financial', description: 'Banks and financial service providers', icon: Building },
                    { key: 'healthcare', label: 'Healthcare Services', description: 'Hospitals and medical providers', icon: Building },
                    { key: 'education', label: 'Education Institutions', description: 'Schools and universities', icon: Building },
                    { key: 'telecommunications', label: 'Telecommunications', description: 'Mobile and internet providers', icon: Globe },
                    { key: 'privateServices', label: 'Private Services', description: 'Third-party service providers', icon: Users }
                  ].map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <div key={service.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <div>
                            <div className="font-medium">{service.label}</div>
                            <div className="text-sm text-gray-600">{service.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={privacySettings.dataSharing[service.key]}
                          onCheckedChange={(checked) => updatePrivacySetting('dataSharing', service.key, checked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Biometric Data Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Biometric Data Controls
                </CardTitle>
                <CardDescription>
                  Manage which biometric data can be used for authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'fingerprint', label: 'Fingerprint', description: 'Use fingerprint for authentication' },
                    { key: 'facial', label: 'Facial Recognition', description: 'Use facial recognition for verification' },
                    { key: 'iris', label: 'Iris Scanning', description: 'Use iris patterns for identification' },
                    { key: 'voice', label: 'Voice Recognition', description: 'Use voice patterns for verification' }
                  ].map((biometric) => (
                    <div key={biometric.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{biometric.label}</div>
                        <div className="text-xs text-gray-600">{biometric.description}</div>
                      </div>
                      <Switch
                        checked={privacySettings.biometricData[biometric.key]}
                        onCheckedChange={(checked) => updatePrivacySetting('biometricData', biometric.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive privacy and security notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications in the app' },
                    { key: 'securityAlerts', label: 'Security Alerts', description: 'Immediate alerts for security events' }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{notification.label}</div>
                        <div className="text-sm text-gray-600">{notification.description}</div>
                      </div>
                      <Switch
                        checked={privacySettings.notifications[notification.key]}
                        onCheckedChange={(checked) => updatePrivacySetting('notifications', notification.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Advanced Access Controls
                </CardTitle>
                <CardDescription>
                  Additional privacy and security controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Location Tracking</div>
                      <div className="text-sm text-gray-600">Allow location-based security features</div>
                    </div>
                    <Switch
                      checked={privacySettings.accessControl.locationTracking}
                      onCheckedChange={(checked) => updatePrivacySetting('accessControl', 'locationTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Usage Analytics</div>
                      <div className="text-sm text-gray-600">Help improve services with anonymous usage data</div>
                    </div>
                    <Switch
                      checked={privacySettings.accessControl.usageAnalytics}
                      onCheckedChange={(checked) => updatePrivacySetting('accessControl', 'usageAnalytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Third-party Integration</div>
                      <div className="text-sm text-gray-600">Allow verified third-party services to request data</div>
                    </div>
                    <Switch
                      checked={privacySettings.accessControl.thirdPartyIntegration}
                      onCheckedChange={(checked) => updatePrivacySetting('accessControl', 'thirdPartyIntegration', checked)}
                    />
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Data Retention Period</div>
                    <select
                      value={privacySettings.accessControl.dataRetention}
                      onChange={(e) => updatePrivacySetting('accessControl', 'dataRetention', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="minimal">Minimal (1 year)</option>
                      <option value="standard">Standard (5 years)</option>
                      <option value="extended">Extended (10 years)</option>
                    </select>
                    <div className="text-sm text-gray-600 mt-1">
                      How long your data is retained after account closure
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button onClick={exportPrivacyData} variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View Access Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Manage Consents
                  </Button>
                  <Button
                    onClick={deletePersonalData}
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                  <div className="text-sm text-gray-600 mb-4">Your privacy settings are well configured</div>
                  <div className="space-y-2 text-xs text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Strong access controls enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Biometric data protected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Regular privacy audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-600" />
                      <span>Consider disabling third-party access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Data Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accessHistory.slice(0, 3).map((access) => (
                    <div key={access.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{access.service}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(access.accessTime).toLocaleDateString()}
                      </div>
                      <Badge className={getStatusColor(access.status)} size="sm">
                        {access.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Access History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            {dataRequests.filter(r => r.status === 'pending').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Pending Data Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dataRequests.filter(r => r.status === 'pending').map((request) => (
                      <div key={request.id} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{request.requester}</div>
                        <div className="text-xs text-gray-600 mb-2">{request.purpose}</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDataRequest(request.id, 'approved')}
                            className="flex-1"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDataRequest(request.id, 'denied')}
                            className="flex-1"
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Legal Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Privacy Rights & Legal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Your Rights Under PNG Data Protection Act 2020</h4>
                <div className="space-y-2 text-sm">
                  <div>• Right to know what data is collected and why</div>
                  <div>• Right to access your personal data</div>
                  <div>• Right to correct inaccurate information</div>
                  <div>• Right to delete your data (with limitations)</div>
                  <div>• Right to restrict data processing</div>
                  <div>• Right to data portability</div>
                  <div>• Right to object to data processing</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Data Protection Compliance</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• All data is encrypted at rest and in transit</div>
                  <div>• Regular security audits and penetration testing</div>
                  <div>• Compliance with international data protection standards</div>
                  <div>• Data processing activities are logged and monitored</div>
                  <div>• Regular staff training on data protection</div>
                  <div>• Incident response procedures in place</div>
                </div>
              </div>
            </div>
            <Alert className="mt-4">
              <FileText className="h-4 w-4" />
              <AlertTitle>Questions or Concerns?</AlertTitle>
              <AlertDescription>
                If you have any questions about your privacy rights or data protection, contact our Data Protection Officer at privacy@digitalid.gov.pg or visit our Privacy Help Center.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
