"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CreditCard,
  QrCode,
  Download,
  Eye,
  RefreshCw,
  Shield,
  Smartphone,
  Key,
  FileText,
  CheckCircle,
  Clock,
  ArrowLeft,
  Camera,
  Share2,
  Lock,
  AlertTriangle,
  Calendar,
  User,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function CredentialsPage() {
  const [userCredentials, setUserCredentials] = useState([]);
  const [digitalIdInfo, setDigitalIdInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  // Mock user data - in real implementation this would come from API
  useEffect(() => {
    const mockData = {
      digitalIdInfo: {
        digitalIdNumber: 'PNG2024123456',
        name: 'John Peter Doe',
        tier: 3,
        level: 'Enhanced',
        status: 'verified',
        issuedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        verificationScore: 98
      },
      credentials: [
        {
          id: 'qr_001',
          type: 'qr_code',
          name: 'QR Code Digital ID',
          description: 'Scannable QR code for mobile verification',
          status: 'active',
          issuedAt: '2024-01-15T10:30:00Z',
          expiresAt: '2025-01-15T10:30:00Z',
          lastUsed: '2024-01-20T14:22:00Z',
          usageCount: 15,
          icon: QrCode,
          color: 'bg-blue-600',
          format: 'Digital',
          qrData: 'PNG2024123456|John Peter Doe|Enhanced|2024-01-15'
        },
        {
          id: 'cert_001',
          type: 'digital_certificate',
          name: 'Digital Certificate',
          description: 'Cryptographic certificate for secure authentication',
          status: 'active',
          issuedAt: '2024-01-15T10:35:00Z',
          expiresAt: '2025-01-15T10:35:00Z',
          lastUsed: '2024-01-19T09:15:00Z',
          usageCount: 8,
          icon: FileText,
          color: 'bg-green-600',
          format: 'Digital',
          certificateData: {
            serialNumber: 'CERT20240115001',
            algorithm: 'RSA-2048',
            fingerprint: 'SHA256:A1B2C3D4E5F6...'
          }
        },
        {
          id: 'wallet_001',
          type: 'mobile_wallet',
          name: 'Mobile Wallet ID',
          description: 'Secure digital wallet integration',
          status: 'active',
          issuedAt: '2024-01-15T10:40:00Z',
          expiresAt: '2025-01-15T10:40:00Z',
          lastUsed: '2024-01-20T16:45:00Z',
          usageCount: 32,
          icon: Smartphone,
          color: 'bg-purple-600',
          format: 'Digital',
          walletData: {
            deepLink: 'pngdigitalid://credential/PNG2024123456',
            appVersion: '1.2.0'
          }
        },
        {
          id: 'nfc_001',
          type: 'nfc_card',
          name: 'NFC Smart Card',
          description: 'Physical contactless card with embedded chip',
          status: 'pending',
          issuedAt: '2024-01-18T11:00:00Z',
          expiresAt: '2025-01-18T11:00:00Z',
          lastUsed: null,
          usageCount: 0,
          icon: CreditCard,
          color: 'bg-orange-600',
          format: 'Physical',
          nfcData: {
            trackingNumber: 'NFC20240118001',
            estimatedDelivery: '2024-01-25'
          }
        }
      ]
    };

    setLoading(true);
    setTimeout(() => {
      setDigitalIdInfo(mockData.digitalIdInfo);
      setUserCredentials(mockData.credentials);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadCredential = (credential) => {
    const dataStr = JSON.stringify({
      ...credential,
      digitalIdNumber: digitalIdInfo.digitalIdNumber,
      holderName: digitalIdInfo.name,
      downloadedAt: new Date().toISOString()
    }, null, 2);

    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `PNG_DigitalID_${credential.type}_${digitalIdInfo.digitalIdNumber}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateQRCode = (credential) => {
    setSelectedCredential(credential);
    setShowQRCode(true);
  };

  const refreshCredential = async (credentialId) => {
    console.log('Refreshing credential:', credentialId);
    // Simulate refresh
    setUserCredentials(prev =>
      prev.map(cred =>
        cred.id === credentialId
          ? { ...cred, lastUsed: new Date().toISOString() }
          : cred
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TopNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading your credentials...</span>
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
              <h1 className="text-3xl font-bold text-slate-900">My Digital ID Credentials</h1>
              <p className="text-slate-600">View and manage your PNG Digital ID credentials</p>
            </div>
          </div>
        </div>

        {/* Digital ID Overview */}
        {digitalIdInfo && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">PNG Digital Identity</CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {digitalIdInfo.name}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(digitalIdInfo.status)}>
                    {digitalIdInfo.status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    Score: {digitalIdInfo.verificationScore}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Digital ID Number</div>
                  <div className="font-mono font-bold text-lg">{digitalIdInfo.digitalIdNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Verification Level</div>
                  <div className="font-medium">Tier {digitalIdInfo.tier} - {digitalIdInfo.level}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Issued Date</div>
                  <div className="font-medium">{new Date(digitalIdInfo.issuedDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expires Date</div>
                  <div className="font-medium">{new Date(digitalIdInfo.expiryDate).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userCredentials.map((credential) => {
            const IconComponent = credential.icon;
            return (
              <Card key={credential.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${credential.color} rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{credential.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{credential.format}</Badge>
                          <Badge className={getStatusColor(credential.status)}>
                            {credential.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{credential.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span>Issued:</span>
                      <span>{new Date(credential.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Expires:</span>
                      <span>{new Date(credential.expiresAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Last Used:</span>
                      <span>
                        {credential.lastUsed
                          ? new Date(credential.lastUsed).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Usage Count:</span>
                      <span>{credential.usageCount} times</span>
                    </div>
                  </div>

                  {credential.status === 'pending' && credential.type === 'nfc_card' && (
                    <Alert className="mb-4">
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Card Production</AlertTitle>
                      <AlertDescription>
                        Your NFC card is being produced. Expected delivery: {credential.nfcData.estimatedDelivery}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {credential.status === 'active' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadCredential(credential)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>

                        {credential.type === 'qr_code' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateQRCode(credential)}
                          >
                            <QrCode className="h-3 w-3 mr-1" />
                            Show QR
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refreshCredential(credential.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refresh
                        </Button>
                      </>
                    )}

                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Credential Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage your Digital ID credentials and security settings
              </p>
              <div className="space-y-2">
                <Link href="/digital-id?module=issuance">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Issue New Credential
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share & Verify
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Share your credentials or verify others' Digital IDs
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Temp QR
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Verify Others
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Credential Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Credentials:</span>
                  <Badge variant="default">
                    {userCredentials.filter(c => c.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending:</span>
                  <Badge variant="outline">
                    {userCredentials.filter(c => c.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Usage:</span>
                  <Badge variant="outline">
                    {userCredentials.reduce((sum, c) => sum + c.usageCount, 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Your Credential Security</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>End-to-end encryption enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Biometric authentication active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Regular security audits performed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PNG Data Protection Act 2020 compliant</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Important Reminders</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Never share your Digital ID credentials with unauthorized persons</div>
                  <div>• Report lost or stolen credentials immediately</div>
                  <div>• Keep your biometric data secure and updated</div>
                  <div>• Regularly check credential expiry dates</div>
                  <div>• Use only official PNG Digital ID applications</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      {showQRCode && selectedCredential && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Digital ID QR Code</h2>
                <Button variant="outline" onClick={() => setShowQRCode(false)}>
                  ✕
                </Button>
              </div>

              <div className="text-center">
                <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">QR Code would be generated here</p>
                    <p className="text-xs text-gray-400 mt-1">Data: {selectedCredential.qrData}</p>
                  </div>
                </div>

                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Notice</AlertTitle>
                  <AlertDescription>
                    This QR code contains your Digital ID information. Only share with authorized personnel.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Save QR Code
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
