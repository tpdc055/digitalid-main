"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  QrCode,
  Smartphone,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Fingerprint,
  Eye,
  CreditCard,
  User,
  Lock,
  Unlock,
  RefreshCw,
  Timer,
  Building,
  Clock
} from 'lucide-react';

interface ServiceAuthenticationGatewayProps {
  requestedService: {
    id: string;
    name: string;
    department: string;
    securityLevel: 'basic' | 'standard' | 'enhanced' | 'maximum';
    requiredTier: number;
  };
  onAuthenticationSuccess?: (digitalId: string, authData: any) => void;
  onAuthenticationFailure?: (error: string) => void;
  onCancel?: () => void;
}

export default function ServiceAuthenticationGateway({
  requestedService,
  onAuthenticationSuccess,
  onAuthenticationFailure,
  onCancel
}: ServiceAuthenticationGatewayProps) {
  const [authMethod, setAuthMethod] = useState<'qr' | 'id_number' | 'biometric' | 'card'>('qr');
  const [digitalIdNumber, setDigitalIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [authStep, setAuthStep] = useState(1); // 1: method selection, 2: authentication, 3: verification, 4: result
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authResult, setAuthResult] = useState<'success' | 'failure' | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [sessionTimeout, setSessionTimeout] = useState(300); // 5 minutes
  const [biometricCapture, setBiometricCapture] = useState(false);

  const authMethods = [
    {
      id: 'qr',
      name: 'QR Code Scan',
      description: 'Scan your Digital ID QR code',
      icon: QrCode,
      speed: 'Instant',
      security: 'High',
      availability: 'Mobile Required'
    },
    {
      id: 'id_number',
      name: 'Digital ID + PIN',
      description: 'Enter your Digital ID number and PIN',
      icon: Key,
      speed: 'Fast',
      security: 'Standard',
      availability: 'Always Available'
    },
    {
      id: 'biometric',
      name: 'Biometric Verification',
      description: 'Fingerprint or facial recognition',
      icon: Fingerprint,
      speed: 'Fast',
      security: 'Maximum',
      availability: 'Device Dependent'
    },
    {
      id: 'card',
      name: 'NFC Smart Card',
      description: 'Tap your NFC Digital ID card',
      icon: CreditCard,
      speed: 'Instant',
      security: 'High',
      availability: 'Card Required'
    }
  ];

  const securityLevelColors = {
    basic: 'bg-blue-100 text-blue-800 border-blue-300',
    standard: 'bg-green-100 text-green-800 border-green-300',
    enhanced: 'bg-orange-100 text-orange-800 border-orange-300',
    maximum: 'bg-red-100 text-red-800 border-red-300'
  };

  useEffect(() => {
    if (authStep === 2) {
      const timer = setInterval(() => {
        setSessionTimeout(prev => {
          if (prev <= 1) {
            handleAuthenticationFailure('Session timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [authStep]);

  const handleMethodSelection = (method: string) => {
    setAuthMethod(method as any);
    setAuthStep(2);
  };

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    setAuthStep(3);

    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication validation
      const isValid = await validateCredentials();

      if (isValid) {
        setAuthResult('success');
        setUserInfo({
          digitalId: digitalIdNumber || 'PNG2024123456',
          name: 'John Doe',
          tier: 3,
          verificationLevel: 'Enhanced',
          lastAuth: new Date().toISOString(),
          permissions: ['government_services', 'banking', 'healthcare']
        });
        setAuthStep(4);

        if (onAuthenticationSuccess) {
          onAuthenticationSuccess(digitalIdNumber || 'PNG2024123456', {
            method: authMethod,
            timestamp: new Date().toISOString(),
            serviceId: requestedService.id,
            securityLevel: requestedService.securityLevel
          });
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      handleAuthenticationFailure(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const validateCredentials = async (): Promise<boolean> => {
    // Mock validation logic
    switch (authMethod) {
      case 'qr':
        return true; // QR codes are pre-validated
      case 'id_number':
        return digitalIdNumber.length >= 10 && pin.length >= 4;
      case 'biometric':
        return biometricCapture;
      case 'card':
        return true; // NFC cards have embedded validation
      default:
        return false;
    }
  };

  const handleAuthenticationFailure = (error: string) => {
    setAuthResult('failure');
    setAuthStep(4);
    if (onAuthenticationFailure) {
      onAuthenticationFailure(error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mt-2" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Service Authentication Required</h1>
        <p className="text-gray-600">
          Please verify your PNG Digital ID to access the requested service
        </p>
      </div>

      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>{requestedService.name}</CardTitle>
                <p className="text-sm text-gray-600">{requestedService.department}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={securityLevelColors[requestedService.securityLevel]}>
                {requestedService.securityLevel.toUpperCase()}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Tier {requestedService.requiredTier}+ Required</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Authentication Method:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {authMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Card
                key={method.id}
                className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                onClick={() => handleMethodSelection(method.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="font-medium">Speed</div>
                      <div className="text-gray-600">{method.speed}</div>
                    </div>
                    <div>
                      <div className="font-medium">Security</div>
                      <div className="text-gray-600">{method.security}</div>
                    </div>
                    <div>
                      <div className="font-medium">Requires</div>
                      <div className="text-gray-600">{method.availability}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onCancel}>
          Cancel Request
        </Button>
      </div>
    </div>
  );

  const renderAuthentication = () => {
    const selectedMethod = authMethods.find(m => m.id === authMethod);
    const IconComponent = selectedMethod?.icon || Key;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4">
            <IconComponent className="h-12 w-12 text-blue-600 mx-auto mt-2" />
          </div>
          <h1 className="text-xl font-bold mb-2">{selectedMethod?.name}</h1>
          <p className="text-gray-600">{selectedMethod?.description}</p>
        </div>

        <div className="flex justify-center">
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            <Timer className="h-3 w-3 mr-1" />
            Session expires in {formatTime(sessionTimeout)}
          </Badge>
        </div>

        {authMethod === 'qr' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Position your device's camera to scan the QR code on your Digital ID
              </p>
              <Button onClick={handleAuthentication}>
                <QrCode className="h-4 w-4 mr-2" />
                Start QR Scan
              </Button>
            </CardContent>
          </Card>
        )}

        {authMethod === 'id_number' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Digital ID Number</label>
                <Input
                  type="text"
                  placeholder="PNG2024XXXXXX"
                  value={digitalIdNumber}
                  onChange={(e) => setDigitalIdNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">PIN</label>
                <Input
                  type="password"
                  placeholder="Enter 4-6 digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleAuthentication}
                disabled={!digitalIdNumber || !pin}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                Authenticate
              </Button>
            </CardContent>
          </Card>
        )}

        {authMethod === 'biometric' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto">
                  <Fingerprint className="h-12 w-12 text-green-600 mx-auto mt-2" />
                </div>
                <h3 className="text-lg font-semibold">Biometric Verification</h3>
                <p className="text-sm text-gray-600">
                  Place your finger on the scanner or look at the camera for facial recognition
                </p>
                {!biometricCapture ? (
                  <Button
                    onClick={() => {
                      setBiometricCapture(true);
                      setTimeout(handleAuthentication, 1500);
                    }}
                  >
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Start Biometric Scan
                  </Button>
                ) : (
                  <div className="text-green-600">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Biometric data captured successfully</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {authMethod === 'card' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-32 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Tap your NFC Digital ID card on the reader below
              </p>
              <div className="w-24 h-24 border-4 border-dashed border-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <Button onClick={handleAuthentication}>
                <CreditCard className="h-4 w-4 mr-2" />
                Simulate Card Tap
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setAuthStep(1)}>
            ← Change Method
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderVerification = () => (
    <div className="space-y-6 text-center">
      <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto">
        <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mt-2 animate-spin" />
      </div>
      <h1 className="text-2xl font-bold">Verifying Digital ID</h1>
      <p className="text-gray-600">
        Please wait while we verify your credentials...
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Validating Digital ID credentials
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Checking service access permissions
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Verifying security requirements
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="space-y-6 text-center">
      {authResult === 'success' ? (
        <>
          <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mt-2" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Authentication Successful!</h1>
          <p className="text-gray-600">
            You have been successfully authenticated and granted access to the requested service.
          </p>

          {userInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Authenticated User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Name</div>
                    <div className="text-gray-600">{userInfo.name}</div>
                  </div>
                  <div>
                    <div className="font-medium">Digital ID</div>
                    <div className="text-gray-600">{userInfo.digitalId}</div>
                  </div>
                  <div>
                    <div className="font-medium">Verification Tier</div>
                    <div className="text-gray-600">Tier {userInfo.tier}</div>
                  </div>
                  <div>
                    <div className="font-medium">Security Level</div>
                    <div className="text-gray-600">{userInfo.verificationLevel}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <Unlock className="h-4 w-4" />
            <AlertTitle>Access Granted</AlertTitle>
            <AlertDescription>
              You now have access to {requestedService.name}. You will be redirected automatically.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <>
          <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mt-2" />
          </div>
          <h1 className="text-2xl font-bold text-red-800">Authentication Failed</h1>
          <p className="text-gray-600">
            We were unable to verify your Digital ID. Please try again.
          </p>

          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Please check your credentials and try again, or contact support if the problem persists.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => setAuthStep(1)}>
              Try Again
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel Request
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {authStep === 1 && renderMethodSelection()}
            {authStep === 2 && renderAuthentication()}
            {authStep === 3 && renderVerification()}
            {authStep === 4 && renderResult()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
