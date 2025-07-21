"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Smartphone,
  WifiOff,
  Wifi,
  MapPin,
  Users,
  Database,
  Upload,
  Download,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Signal,
  Battery,
  Fingerprint,
  Camera,
  FileText,
  Save,
  Settings,
  Monitor
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function OfflineRegistrationPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    unitId: 'MU-089',
    location: 'Mount Hagen Remote Station',
    province: 'Western Highlands',
    operator: 'Mobile Team Alpha',
    lastSync: '2024-01-19T14:30:00Z',
    batteryLevel: 78,
    storageUsed: 45,
    storageTotal: 128
  });

  const [offlineData, setOfflineData] = useState({
    pendingEnrollments: 156,
    completedToday: 23,
    biometricCaptures: 179,
    documentsScanned: 234,
    syncQueue: 156
  });

  const [recentEnrollments, setRecentEnrollments] = useState([
    {
      id: 'OFF_001',
      name: 'Mary Johnson',
      village: 'Kigata Village',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'pending_sync',
      biometricsComplete: true,
      documentsComplete: true
    },
    {
      id: 'OFF_002',
      name: 'Peter Williams',
      village: 'Baisu Village',
      timestamp: '2024-01-20T10:15:00Z',
      status: 'pending_sync',
      biometricsComplete: true,
      documentsComplete: false
    },
    {
      id: 'OFF_003',
      name: 'Sarah Brown',
      village: 'Kotna Village',
      timestamp: '2024-01-20T09:45:00Z',
      status: 'pending_sync',
      biometricsComplete: true,
      documentsComplete: true
    }
  ]);

  // Monitor connectivity
  useEffect(() => {
    const checkConnection = () => {
      const online = Math.random() > 0.7; // Simulate poor connectivity
      setIsOnline(online);
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  const startSync = async () => {
    if (!isOnline) {
      alert('No internet connection available. Sync will begin automatically when connected.');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    for (let i = 0; i <= 100; i += 5) {
      setSyncProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Update data after sync
    setOfflineData(prev => ({
      ...prev,
      syncQueue: 0,
      pendingEnrollments: 0
    }));

    setRecentEnrollments(prev =>
      prev.map(enrollment => ({
        ...enrollment,
        status: 'synced'
      }))
    );

    setDeviceInfo(prev => ({
      ...prev,
      lastSync: new Date().toISOString()
    }));

    setIsSyncing(false);
    setSyncProgress(0);
    alert('Sync completed successfully! All data uploaded to central registry.');
  };

  const exportOfflineData = () => {
    const exportData = {
      deviceInfo,
      offlineData,
      enrollments: recentEnrollments,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `offline_registrations_${deviceInfo.unitId}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'pending_sync': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
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
              <h1 className="text-3xl font-bold text-slate-900">Offline Registration System</h1>
              <p className="text-slate-600">Mobile Digital ID enrollment for remote areas</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Connectivity Status */}
          <Card className={`border-2 ${isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-orange-600" />}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                  {isOnline ? 'CONNECTED' : 'OFFLINE'}
                </Badge>
                <div className="text-sm text-gray-600">
                  {isOnline ? 'Ready to sync with central registry' : 'Operating in offline mode'}
                </div>
                {offlineData.syncQueue > 0 && (
                  <div className="text-sm font-medium text-orange-600">
                    {offlineData.syncQueue} enrollments waiting to sync
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Unit Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Unit ID:</strong> {deviceInfo.unitId}</div>
                <div><strong>Location:</strong> {deviceInfo.location}</div>
                <div><strong>Operator:</strong> {deviceInfo.operator}</div>
                <div className="flex items-center gap-2">
                  <Battery className={`h-4 w-4 ${getBatteryColor(deviceInfo.batteryLevel)}`} />
                  <span>Battery: {deviceInfo.batteryLevel}%</span>
                </div>
                <div>
                  <span>Storage: {deviceInfo.storageUsed}GB / {deviceInfo.storageTotal}GB</span>
                  <Progress value={(deviceInfo.storageUsed / deviceInfo.storageTotal) * 100} className="h-2 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Sync Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Last Sync:</strong></div>
                <div className="text-gray-600">
                  {new Date(deviceInfo.lastSync).toLocaleString()}
                </div>
                <div className="pt-2">
                  <Button
                    onClick={startSync}
                    disabled={isSyncing || !isOnline}
                    className="w-full"
                    size="sm"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing ({syncProgress}%)
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {isOnline ? 'Sync Now' : 'Waiting for Connection'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Offline Registration Statistics
            </CardTitle>
            <CardDescription>
              Registration activity for mobile unit {deviceInfo.unitId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{offlineData.pendingEnrollments}</div>
                <div className="text-sm text-gray-600">Pending Sync</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{offlineData.completedToday}</div>
                <div className="text-sm text-gray-600">Completed Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{offlineData.biometricCaptures}</div>
                <div className="text-sm text-gray-600">Biometric Captures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{offlineData.documentsScanned}</div>
                <div className="text-sm text-gray-600">Documents Scanned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{offlineData.syncQueue}</div>
                <div className="text-sm text-gray-600">Queue Size</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Progress */}
        {isSyncing && (
          <Alert className="mb-6">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertTitle>Synchronizing Data</AlertTitle>
            <AlertDescription>
              Uploading offline registrations to central registry...
              <Progress value={syncProgress} className="mt-2" />
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/agent-enrollment">
            <Button className="h-16 w-full flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <Users className="h-6 w-6" />
              New Enrollment
            </Button>
          </Link>

          <Button
            onClick={exportOfflineData}
            variant="outline"
            className="h-16 flex-col gap-2"
          >
            <Download className="h-6 w-6" />
            Export Data
          </Button>

          <Button variant="outline" className="h-16 flex-col gap-2">
            <Settings className="h-6 w-6" />
            Device Settings
          </Button>

          <Button variant="outline" className="h-16 flex-col gap-2">
            <Monitor className="h-6 w-6" />
            System Status
          </Button>
        </div>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Recent Offline Enrollments
            </CardTitle>
            <CardDescription>
              Latest registrations captured on this mobile unit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => (
                <Card key={enrollment.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{enrollment.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {enrollment.village}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {new Date(enrollment.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(enrollment.status)}>
                          {enrollment.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Fingerprint className="h-3 w-3" />
                            <span className={enrollment.biometricsComplete ? 'text-green-600' : 'text-orange-600'}>
                              {enrollment.biometricsComplete ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <FileText className="h-3 w-3" />
                            <span className={enrollment.documentsComplete ? 'text-green-600' : 'text-orange-600'}>
                              {enrollment.documentsComplete ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Capabilities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile Registration Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Offline Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Complete enrollment without internet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Biometric capture with portable scanner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Document scanning and storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic data validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Secure local data encryption</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Sync & Connectivity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic sync when connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Manual sync on demand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Data export for backup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Conflict resolution handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Resumable transfers</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
