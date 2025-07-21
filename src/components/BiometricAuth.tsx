"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Fingerprint,
  Eye,
  Mic,
  Shield,
  CheckCircle,
  AlertTriangle,
  Camera,
  Scan,
  Lock,
  Unlock,
  RefreshCw,
  User,
  Settings,
  Trash2,
  Plus,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { biometricAuth, BiometricTemplate, BiometricCapability, BiometricVerificationResult } from '@/lib/biometric';

interface BiometricAuthProps {
  citizenId: string;
  mode: 'enroll' | 'verify' | 'manage';
  onSuccess?: (result: BiometricVerificationResult) => void;
  onError?: (error: string) => void;
  requiredBiometrics?: Array<'fingerprint' | 'face' | 'voice'>;
}

export default function BiometricAuth({
  citizenId,
  mode,
  onSuccess,
  onError,
  requiredBiometrics = ['fingerprint']
}: BiometricAuthProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capabilities, setCapabilities] = useState<BiometricCapability[]>([]);
  const [enrolledBiometrics, setEnrolledBiometrics] = useState<BiometricTemplate[]>([]);
  const [verificationResult, setVerificationResult] = useState<BiometricVerificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [livenessInstructions, setLivenessInstructions] = useState<string>('');
  const [captureProgress, setCaptureProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { t } = useLanguage();

  const biometricTypes = [
    {
      type: 'fingerprint' as const,
      name: 'Fingerprint',
      icon: Fingerprint,
      description: 'Place your finger on the sensor',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'face' as const,
      name: 'Face Recognition',
      icon: Eye,
      description: 'Look directly at the camera',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'voice' as const,
      name: 'Voice Recognition',
      icon: Mic,
      description: 'Speak the provided phrase clearly',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  useEffect(() => {
    initializeBiometricSystem();
    return () => {
      stopMediaStream();
    };
  }, []);

  const initializeBiometricSystem = async () => {
    try {
      const detectedCapabilities = await biometricAuth.detectBiometricCapabilities();
      setCapabilities(detectedCapabilities);

      if (mode === 'manage') {
        // Load enrolled biometrics (would come from backend in real implementation)
        const stats = biometricAuth.getBiometricStats(citizenId);
        // setEnrolledBiometrics(stats.biometricTypes);
      }
    } catch (error) {
      setError('Failed to initialize biometric system');
    }
  };

  const startBiometricCapture = async (biometricType: 'fingerprint' | 'face' | 'voice') => {
    setIsCapturing(true);
    setError('');
    setCaptureProgress(0);

    try {
      switch (biometricType) {
        case 'fingerprint':
          await captureFingerprint();
          break;
        case 'face':
          await captureFace();
          break;
        case 'voice':
          await captureVoice();
          break;
      }
    } catch (error) {
      setError(`Failed to capture ${biometricType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCapturing(false);
    }
  };

  const captureFingerprint = async () => {
    setLivenessInstructions('Place your finger firmly on the sensor and hold still...');

    // Simulate fingerprint capture with Web Authentication API
    if (navigator.credentials && 'create' in navigator.credentials) {
      try {
        // Simulate progressive capture
        for (let i = 0; i <= 100; i += 10) {
          setCaptureProgress(i);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "PNG Government Portal" },
            user: {
              id: new TextEncoder().encode(citizenId),
              name: citizenId,
              displayName: "PNG Citizen"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        });

        if (credential) {
          await processBiometricData('fingerprint', JSON.stringify(credential));
        }
      } catch (error) {
        throw new Error('Fingerprint capture failed');
      }
    } else {
      // Fallback simulation
      await simulateBiometricCapture('fingerprint');
    }
  };

  const captureFace = async () => {
    setLivenessInstructions('Position your face in the center of the camera...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate liveness detection steps
      const livenessSteps = [
        'Look directly at the camera',
        'Blink your eyes twice',
        'Turn your head slightly left',
        'Turn your head slightly right',
        'Smile naturally'
      ];

      for (let i = 0; i < livenessSteps.length; i++) {
        setLivenessInstructions(livenessSteps[i]);
        setCaptureProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Capture frame from video
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg');
          await processBiometricData('face', imageData);
        }
      }

      stopMediaStream();
    } catch (error) {
      throw new Error('Camera access denied or not available');
    }
  };

  const captureVoice = async () => {
    const phrase = "Papua New Guinea Government Portal - Enhanced Security";
    setLivenessInstructions(`Please say clearly: "${phrase}"`);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Simulate voice recording
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (reader.result) {
            await processBiometricData('voice', reader.result as string);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();

      // Simulate recording progress
      for (let i = 0; i <= 100; i += 5) {
        setCaptureProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      mediaRecorder.stop();
      stopMediaStream();
    } catch (error) {
      throw new Error('Microphone access denied or not available');
    }
  };

  const simulateBiometricCapture = async (type: string) => {
    setLivenessInstructions(`Capturing ${type}...`);

    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Generate mock biometric data
    const mockData = `mock_${type}_data_${Date.now()}`;
    await processBiometricData(type as any, mockData);
  };

  const processBiometricData = async (
    type: 'fingerprint' | 'face' | 'voice',
    data: string
  ) => {
    try {
      if (mode === 'enroll') {
        const result = await biometricAuth.enrollBiometric(
          citizenId,
          type,
          data,
          {
            manufacturer: navigator.userAgent.includes('Chrome') ? 'Google' : 'Mozilla',
            model: 'Web Browser',
            os: navigator.platform,
            sensor: `${type}_sensor`
          },
          {
            location: 'Web Portal',
            officer: 'Self-Enrollment'
          }
        );

        if (result.success) {
          setCurrentStep(currentStep + 1);
          if (currentStep + 1 >= requiredBiometrics.length) {
            onSuccess?.({
              verified: true,
              confidence: 95,
              riskScore: 5,
              fraudIndicators: [],
              verificationTime: 2000,
              sessionId: 'enrollment_session'
            });
          }
        } else {
          throw new Error(result.error);
        }
      } else if (mode === 'verify') {
        const result = await biometricAuth.verifyBiometric({
          citizenId,
          biometricType: type,
          capturedData: data,
          challengeNonce: `nonce_${Date.now()}`,
          deviceFingerprint: navigator.userAgent
        });

        setVerificationResult(result);

        if (result.verified) {
          onSuccess?.(result);
        } else {
          onError?.(`Verification failed: ${result.fraudIndicators.join(', ')}`);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      onError?.(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsCapturing(false);
      setCaptureProgress(0);
      setLivenessInstructions('');
    }
  };

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const getBiometricIcon = (type: string) => {
    const biometric = biometricTypes.find(b => b.type === type);
    return biometric ? biometric.icon : Shield;
  };

  const renderEnrollmentMode = () => {
    const currentBiometric = biometricTypes.find(b => b.type === requiredBiometrics[currentStep]);
    if (!currentBiometric) return null;

    const IconComponent = currentBiometric.icon;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-full ${currentBiometric.bgColor} mb-4`}>
            <IconComponent className={`h-12 w-12 ${currentBiometric.color}`} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Enroll {currentBiometric.name}</h3>
          <p className="text-slate-600">{currentBiometric.description}</p>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {requiredBiometrics.length}</span>
            <span>{Math.round((currentStep / requiredBiometrics.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / requiredBiometrics.length) * 100} />
        </div>

        {/* Capture interface */}
        {currentBiometric.type === 'face' && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-md mx-auto rounded-lg border"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-center">
                  <Scan className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">{livenessInstructions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {isCapturing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">{livenessInstructions}</span>
            </div>
            <Progress value={captureProgress} />
          </div>
        )}

        <Button
          onClick={() => startBiometricCapture(currentBiometric.type)}
          disabled={isCapturing}
          className="w-full"
          size="lg"
        >
          {isCapturing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Capturing...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4 mr-2" />
              Start Capture
            </>
          )}
        </Button>
      </div>
    );
  };

  const renderVerificationMode = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Biometric Verification</h3>
          <p className="text-slate-600">Verify your identity using biometric authentication</p>
        </div>

        {verificationResult && (
          <Alert className={verificationResult.verified ? "border-green-500" : "border-red-500"}>
            {verificationResult.verified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>
              {verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}
            </AlertTitle>
            <AlertDescription>
              Confidence: {verificationResult.confidence.toFixed(1)}% |
              Risk Score: {verificationResult.riskScore} |
              Time: {verificationResult.verificationTime}ms
              {verificationResult.fraudIndicators.length > 0 && (
                <div className="mt-2">
                  <strong>Issues:</strong> {verificationResult.fraudIndicators.join(', ')}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4">
          {requiredBiometrics.map((type) => {
            const biometric = biometricTypes.find(b => b.type === type);
            if (!biometric) return null;

            const IconComponent = biometric.icon;
            const capability = capabilities.find(c => c.type === type);

            return (
              <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${biometric.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${biometric.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{biometric.name}</h4>
                        <p className="text-sm text-slate-600">{biometric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {capability ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Unavailable
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => startBiometricCapture(type)}
                        disabled={!capability || isCapturing}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderManagementMode = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Biometric Management</h3>
            <p className="text-slate-600">Manage your enrolled biometric templates</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Biometric
          </Button>
        </div>

        {/* Enrolled biometrics */}
        <div className="space-y-4">
          {biometricTypes.map((biometric) => {
            const IconComponent = biometric.icon;
            const isEnrolled = Math.random() > 0.5; // Simulate enrollment status

            return (
              <Card key={biometric.type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${biometric.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${biometric.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{biometric.name}</h4>
                        <p className="text-sm text-slate-600">
                          {isEnrolled ? 'Enrolled' : 'Not enrolled'} •
                          Last used: {isEnrolled ? '2 hours ago' : 'Never'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isEnrolled ? "default" : "secondary"}
                        className={isEnrolled ? "bg-green-100 text-green-800" : ""}
                      >
                        {isEnrolled ? 'Active' : 'Inactive'}
                      </Badge>
                      {isEnrolled && (
                        <>
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Security Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-slate-600">Verifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-slate-600">Enrolled Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-slate-600">Security Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Secure your account with advanced biometric verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-500">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode === 'enroll' && renderEnrollmentMode()}
        {mode === 'verify' && renderVerificationMode()}
        {mode === 'manage' && renderManagementMode()}
      </CardContent>
    </Card>
  );
}
