"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  QrCode,
  CreditCard,
  Smartphone,
  Download,
  Shield,
  CheckCircle,
  Clock,
  User,
  FileText,
  Key,
  NfcIcon as Nfc,
  Printer,
  Camera,
  RefreshCw
} from 'lucide-react';

interface DigitalIDIssuanceProps {
  citizenId: string;
  registrationData?: any;
  onIssuanceComplete?: (credentialId: string, credentials: any) => void;
}

export default function DigitalIDIssuance({
  citizenId,
  registrationData,
  onIssuanceComplete
}: DigitalIDIssuanceProps) {
  const [issuanceStep, setIssuanceStep] = useState(1);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [issuanceProgress, setIssuanceProgress] = useState(0);
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  const [digitalIdNumber, setDigitalIdNumber] = useState('');

  const credentialTypes = [
    {
      id: 'qr_code',
      name: 'QR Code Digital ID',
      description: 'Scannable QR code for mobile verification',
      icon: QrCode,
      features: ['Mobile friendly', 'Instant verification', 'Offline capable'],
      issuanceTime: '30 seconds',
      format: 'Digital',
      cost: 'Free'
    },
    {
      id: 'digital_certificate',
      name: 'Digital Certificate',
      description: 'Cryptographic certificate for secure authentication',
      icon: FileText,
      features: ['High security', 'API integration', 'PKI compliant'],
      issuanceTime: '2 minutes',
      format: 'Digital',
      cost: 'Free'
    },
    {
      id: 'nfc_card',
      name: 'NFC Smart Card',
      description: 'Physical contactless card with embedded chip',
      icon: CreditCard,
      features: ['Tap to verify', 'Physical backup', 'Durable'],
      issuanceTime: '5-7 days',
      format: 'Physical',
      cost: 'K 15.00'
    },
    {
      id: 'mobile_wallet',
      name: 'Mobile Wallet ID',
      description: 'Secure digital wallet integration',
      icon: Smartphone,
      features: ['Biometric unlock', 'Push notifications', 'Multi-device'],
      issuanceTime: '1 minute',
      format: 'Digital',
      cost: 'Free'
    }
  ];

  useEffect(() => {
    // Generate Digital ID Number
    const generateIdNumber = () => {
      const prefix = 'PNG';
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      return `${prefix}${year}${random}`;
    };

    if (!digitalIdNumber) {
      setDigitalIdNumber(generateIdNumber());
    }
  }, []);

  const handleCredentialSelection = (credentialId: string) => {
    setSelectedCredentials(prev =>
      prev.includes(credentialId)
        ? prev.filter(id => id !== credentialId)
        : [...prev, credentialId]
    );
  };

  const startIssuance = async () => {
    if (selectedCredentials.length === 0) return;

    setIssuanceStep(2);
    setIssuanceProgress(0);

    // Simulate credential issuance process
    const totalSteps = selectedCredentials.length * 100;
    let currentProgress = 0;

    for (const credentialId of selectedCredentials) {
      const credential = credentialTypes.find(ct => ct.id === credentialId);
      if (!credential) continue;

      // Simulate issuance process
      for (let i = 0; i <= 100; i += 10) {
        currentProgress = ((selectedCredentials.indexOf(credentialId) * 100) + i);
        setIssuanceProgress((currentProgress / totalSteps) * 100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Generate credential data
      const issuedCredential = {
        id: `${credentialId}_${Date.now()}`,
        type: credentialId,
        name: credential.name,
        digitalIdNumber,
        citizenId,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(), // 1 year
        status: 'active',
        verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        qrData: credential.id === 'qr_code' ? generateQRData() : null,
        certificateData: credential.id === 'digital_certificate' ? generateCertificate() : null,
        nfcData: credential.id === 'nfc_card' ? generateNFCData() : null,
        walletData: credential.id === 'mobile_wallet' ? generateWalletData() : null
      };

      setIssuedCredentials(prev => [...prev, issuedCredential]);
    }

    setIssuanceStep(3);
    setIssuanceProgress(100);

    // Notify completion
    if (onIssuanceComplete) {
      onIssuanceComplete(digitalIdNumber, issuedCredentials);
    }
  };

  const generateQRData = () => ({
    format: 'QR_CODE',
    data: JSON.stringify({
      digitalId: digitalIdNumber,
      citizenId,
      issuer: 'PNG_DIGITAL_ID',
      issuedAt: new Date().toISOString(),
      publicKey: 'mock_public_key_data'
    }),
    level: 'H'
  });

  const generateCertificate = () => ({
    format: 'X509',
    algorithm: 'RSA-2048',
    serialNumber: `CERT${Date.now()}`,
    publicKey: 'mock_certificate_public_key',
    signature: 'mock_certificate_signature',
    issuer: 'CN=PNG Digital ID Authority,O=Government of PNG,C=PG'
  });

  const generateNFCData = () => ({
    chipType: 'MIFARE_DESFire_EV3',
    capacity: '8KB',
    appId: 'PNG_DID',
    securityLevel: 'AES-128',
    trackingNumber: `NFC${Date.now()}`
  });

  const generateWalletData = () => ({
    walletFormat: 'W3C_VC',
    schema: 'PNG_DIGITAL_ID_V1',
    deepLink: `pngdigitalid://credential/${digitalIdNumber}`,
    backupCodes: Array.from({length: 5}, () =>
      Math.random().toString(36).substring(2, 8).toUpperCase()
    )
  });

  const downloadCredential = (credential: any) => {
    const dataStr = JSON.stringify(credential, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `PNG_DigitalID_${credential.type}_${digitalIdNumber}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (issuanceStep === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4">
            <Key className="h-12 w-12 text-blue-600 mx-auto mt-2" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Digital ID Credential Issuance</h1>
          <p className="text-gray-600">
            Choose the digital credentials you want to issue for Digital ID: <strong>{digitalIdNumber}</strong>
          </p>
        </div>

        <Alert>
          <User className="h-4 w-4" />
          <AlertTitle>Citizen Information</AlertTitle>
          <AlertDescription>
            Issuing credentials for Citizen ID: {citizenId} | Digital ID: {digitalIdNumber}
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          {credentialTypes.map((credential) => {
            const IconComponent = credential.icon;
            const isSelected = selectedCredentials.includes(credential.id);

            return (
              <Card
                key={credential.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleCredentialSelection(credential.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{credential.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{credential.format}</Badge>
                          <Badge variant={credential.cost === 'Free' ? 'default' : 'secondary'}>
                            {credential.cost}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="h-6 w-6 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{credential.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Issuance Time:
                      </span>
                      <span className="font-medium">{credential.issuanceTime}</span>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium mb-1">Features:</div>
                      <div className="space-y-1">
                        {credential.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
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

        <div className="text-center">
          <Button
            onClick={startIssuance}
            disabled={selectedCredentials.length === 0}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <Key className="h-5 w-5 mr-2" />
            Issue Selected Credentials ({selectedCredentials.length})
          </Button>
        </div>
      </div>
    );
  }

  if (issuanceStep === 2) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto">
          <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mt-2 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold">Issuing Digital Credentials</h1>
        <p className="text-gray-600">
          Processing your credential issuance request...
        </p>

        <div className="max-w-md mx-auto">
          <Progress value={issuanceProgress} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">
            {Math.round(issuanceProgress)}% Complete
          </p>
        </div>

        <div className="grid gap-3 max-w-md mx-auto">
          {selectedCredentials.map((credId, index) => {
            const credential = credentialTypes.find(ct => ct.id === credId);
            const stepProgress = ((index + 1) / selectedCredentials.length) * 100;
            const isCompleted = issuanceProgress >= stepProgress;

            return (
              <div
                key={credId}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isCompleted ? 'bg-green-50 text-green-800' : 'bg-gray-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                )}
                <span className="text-sm font-medium">{credential?.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mt-2" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Credentials Issued Successfully!</h1>
        <p className="text-gray-600">
          Your PNG Digital ID credentials have been generated and are ready for use.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Digital ID Number: {digitalIdNumber}</AlertTitle>
        <AlertDescription>
          This is your unique PNG Digital ID number. Keep it secure and use it for all government services.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {issuedCredentials.map((credential) => {
          const credentialType = credentialTypes.find(ct => ct.id === credential.type);
          const IconComponent = credentialType?.icon || FileText;

          return (
            <Card key={credential.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{credential.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="default">Active</Badge>
                        <Badge variant="outline">ID: {credential.verificationCode}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Issued: {new Date(credential.issuedAt).toLocaleDateString()}</div>
                    <div>Expires: {new Date(credential.expiresAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCredential(credential)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  {credential.qrData && (
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      View QR
                    </Button>
                  )}
                  {credential.nfcData && (
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-1" />
                      Print Card
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={() => window.location.href = '/'}
          size="lg"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
