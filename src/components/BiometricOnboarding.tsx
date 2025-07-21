"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
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
  Activity,
  ArrowRight,
  ArrowLeft,
  Info,
  Zap,
  Clock,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { biometricAuth, BiometricTemplate, BiometricCapability, BiometricVerificationResult } from '@/lib/biometric';

interface BiometricOnboardingProps {
  citizenId: string;
  onComplete: (enrolledBiometrics: BiometricTemplate[]) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isCompleted: boolean;
  isOptional: boolean;
}

const BiometricTypeCard = ({
  type,
  title,
  description,
  icon: Icon,
  isSelected,
  onSelect,
  isRecommended = false
}: {
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isSelected: boolean;
  onSelect: (type: string) => void;
  isRecommended?: boolean;
}) => (
  <Card
    className={`cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
    } ${isRecommended ? 'border-green-500' : ''}`}
    onClick={() => onSelect(type)}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
            <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              {isRecommended && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Recommended
                </Badge>
              )}
            </CardTitle>
          </div>
        </div>
        <Checkbox checked={isSelected} readOnly />
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-green-500" />
          <span className="text-green-600">High Security</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-slate-600">2-3 minutes setup</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CaptureInstructions = ({ type }: { type: string }) => {
  const { t } = useLanguage();

  const instructions = {
    fingerprint: {
      title: 'Fingerprint Capture Instructions',
      steps: [
        'Clean your finger to ensure clear capture',
        'Place your finger flat on the sensor',
        'Hold steady for 3-5 seconds',
        'Lift and repeat 3 times for best results'
      ],
      tips: [
        'Use your dominant hand index finger',
        'Avoid wet or oily fingers',
        'Press gently - don\'t apply too much pressure'
      ]
    },
    face: {
      title: 'Face Recognition Setup',
      steps: [
        'Position your face in the center of the frame',
        'Look directly at the camera',
        'Keep your face well-lit and visible',
        'Follow the on-screen prompts to move your head'
      ],
      tips: [
        'Remove glasses temporarily if possible',
        'Ensure good lighting on your face',
        'Keep a neutral expression'
      ]
    },
    voice: {
      title: 'Voice Recognition Setup',
      steps: [
        'Find a quiet environment',
        'Speak clearly into the microphone',
        'Repeat the given phrases naturally',
        'Complete all 3 voice samples'
      ],
      tips: [
        'Speak at normal volume',
        'Use your natural speaking voice',
        'Avoid background noise'
      ]
    }
  };

  const instruction = instructions[type as keyof typeof instructions];
  if (!instruction) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{instruction.title}</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Steps to Follow
          </h4>
          <ol className="space-y-2">
            {instruction.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-slate-600">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Tips for Success
          </h4>
          <ul className="space-y-2">
            {instruction.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function BiometricOnboarding({
  citizenId,
  onComplete,
  onSkip,
  allowSkip = true
}: BiometricOnboardingProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBiometrics, setSelectedBiometrics] = useState<string[]>([]);
  const [enrolledBiometrics, setEnrolledBiometrics] = useState<BiometricTemplate[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [currentBiometricType, setCurrentBiometricType] = useState<string>('');
  const [capabilities, setCapabilities] = useState<BiometricCapability[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const biometricTypes = [
    {
      type: 'fingerprint',
      title: t('biometric.fingerprint'),
      description: 'Quick and reliable authentication using your fingerprint',
      icon: Fingerprint,
      isRecommended: true
    },
    {
      type: 'face',
      title: t('biometric.face'),
      description: 'Secure face recognition for hands-free access',
      icon: Eye,
      isRecommended: false
    },
    {
      type: 'voice',
      title: t('biometric.voice'),
      description: 'Voice pattern recognition for additional security',
      icon: Mic,
      isRecommended: false
    }
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('biometric.onboard.title'),
      description: t('biometric.onboard.subtitle'),
      component: WelcomeStep,
      isCompleted: false,
      isOptional: false
    },
    {
      id: 'selection',
      title: t('biometric.step1.title'),
      description: 'Choose which biometric methods you want to set up',
      component: SelectionStep,
      isCompleted: false,
      isOptional: false
    },
    {
      id: 'capture',
      title: t('biometric.step2.title'),
      description: 'We\'ll guide you through capturing your biometric data',
      component: CaptureStep,
      isCompleted: false,
      isOptional: false
    },
    {
      id: 'verification',
      title: t('biometric.step3.title'),
      description: 'Test your biometric setup to ensure it works correctly',
      component: VerificationStep,
      isCompleted: false,
      isOptional: false
    },
    {
      id: 'completion',
      title: t('biometric.success'),
      description: 'Your biometric authentication is now active and secure',
      component: CompletionStep,
      isCompleted: false,
      isOptional: false
    }
  ];

  useEffect(() => {
    initializeBiometricSystem();
  }, []);

  const initializeBiometricSystem = async () => {
    try {
      const caps = await biometricAuth.getCapabilities();
      setCapabilities(caps);
    } catch (error) {
      console.error('Failed to initialize biometric system:', error);
      setError('Failed to initialize biometric system. Please check your device capabilities.');
    }
  };

  const handleBiometricSelection = (type: string) => {
    setSelectedBiometrics(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const startCapture = async (biometricType: string) => {
    setCurrentBiometricType(biometricType);
    setIsCapturing(true);
    setCaptureProgress(0);
    setError('');

    try {
      // Simulate progressive capture
      const progressInterval = setInterval(() => {
        setCaptureProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate biometric enrollment
      setTimeout(async () => {
        try {
          const template = await biometricAuth.enroll(citizenId, biometricType as any);
          setEnrolledBiometrics(prev => [...prev, template]);
          setIsCapturing(false);
          setCaptureProgress(100);

          // If all selected biometrics are enrolled, move to verification
          if (enrolledBiometrics.length + 1 >= selectedBiometrics.length) {
            setTimeout(() => setCurrentStep(3), 1000);
          }
        } catch (error) {
          setError(`Failed to enroll ${biometricType}. Please try again.`);
          setIsCapturing(false);
          setCaptureProgress(0);
        }
      }, 3000);

    } catch (error) {
      setError(`Failed to start ${biometricType} capture. Please check your device.`);
      setIsCapturing(false);
    }
  };

  const verifyBiometric = async (biometricType: string) => {
    try {
      const result = await biometricAuth.verify(citizenId, biometricType as any);
      return result.isValid;
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  };

  const handleComplete = () => {
    onComplete(enrolledBiometrics);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step Components
  function WelcomeStep() {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">{t('biometric.onboard.title')}</h2>
          <p className="text-slate-600 text-lg">{t('biometric.onboard.subtitle')}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="font-semibold mb-3">Why Set Up Biometric Authentication?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium">Enhanced Security</div>
                <div className="text-slate-600">Protect your account with unique biological traits</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Quick Access</div>
                <div className="text-slate-600">Login instantly without remembering passwords</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <div className="font-medium">Privacy Protection</div>
                <div className="text-slate-600">Your data stays secure on your device</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={nextStep} size="lg" className="px-8">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          {allowSkip && (
            <Button variant="outline" onClick={handleSkip} size="lg">
              Set Up Later
            </Button>
          )}
        </div>
      </div>
    );
  }

  function SelectionStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">{t('biometric.step1.title')}</h2>
          <p className="text-slate-600">Choose one or more authentication methods to secure your account</p>
        </div>

        <div className="grid gap-4">
          {biometricTypes.map((biometric) => (
            <BiometricTypeCard
              key={biometric.type}
              type={biometric.type}
              title={biometric.title}
              description={biometric.description}
              icon={biometric.icon}
              isSelected={selectedBiometrics.includes(biometric.type)}
              onSelect={handleBiometricSelection}
              isRecommended={biometric.isRecommended}
            />
          ))}
        </div>

        {selectedBiometrics.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Selected Methods</AlertTitle>
            <AlertDescription>
              You've chosen {selectedBiometrics.length} authentication method{selectedBiometrics.length > 1 ? 's' : ''}.
              Setting up multiple methods provides backup options and enhanced security.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={selectedBiometrics.length === 0}
            className="px-8"
          >
            Continue with {selectedBiometrics.length} method{selectedBiometrics.length > 1 ? 's' : ''}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function CaptureStep() {
    const currentBiometric = selectedBiometrics.find(type =>
      !enrolledBiometrics.some(enrolled => enrolled.type === type)
    );

    if (!currentBiometric) {
      return <div>All biometrics captured!</div>;
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">{t('biometric.step2.title')}</h2>
          <p className="text-slate-600">
            Setting up: {biometricTypes.find(t => t.type === currentBiometric)?.title}
          </p>
        </div>

        <CaptureInstructions type={currentBiometric} />

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {!isCapturing ? (
                <div>
                  <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    {currentBiometric === 'fingerprint' && <Fingerprint className="h-12 w-12 text-slate-400" />}
                    {currentBiometric === 'face' && <Eye className="h-12 w-12 text-slate-400" />}
                    {currentBiometric === 'voice' && <Mic className="h-12 w-12 text-slate-400" />}
                  </div>
                  <Button
                    onClick={() => startCapture(currentBiometric)}
                    size="lg"
                    className="px-8"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    {t('biometric.capture')} {biometricTypes.find(t => t.type === currentBiometric)?.title}
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    {currentBiometric === 'fingerprint' && <Fingerprint className="h-12 w-12 text-blue-600" />}
                    {currentBiometric === 'face' && <Eye className="h-12 w-12 text-blue-600" />}
                    {currentBiometric === 'voice' && <Mic className="h-12 w-12 text-blue-600" />}
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-medium">Capturing {currentBiometric}...</p>
                    <Progress value={captureProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-sm text-slate-600">{captureProgress}% complete</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Capture Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={prevStep} disabled={isCapturing}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {enrolledBiometrics.length > 0 && (
            <Button onClick={nextStep}>
              Continue to Verification
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  function VerificationStep() {
    const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});
    const [isVerifying, setIsVerifying] = useState(false);

    const runVerification = async (biometricType: string) => {
      setIsVerifying(true);
      try {
        const result = await verifyBiometric(biometricType);
        setVerificationResults(prev => ({ ...prev, [biometricType]: result }));
      } catch (error) {
        setVerificationResults(prev => ({ ...prev, [biometricType]: false }));
      }
      setIsVerifying(false);
    };

    const allVerified = enrolledBiometrics.every(template =>
      verificationResults[template.type] === true
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">{t('biometric.step3.title')}</h2>
          <p className="text-slate-600">Test each biometric method to ensure they work correctly</p>
        </div>

        <div className="space-y-4">
          {enrolledBiometrics.map((template) => {
            const biometricInfo = biometricTypes.find(t => t.type === template.type);
            const isVerified = verificationResults[template.type];

            return (
              <Card key={template.type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {biometricInfo?.icon && <biometricInfo.icon className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium">{biometricInfo?.title}</div>
                        <div className="text-sm text-slate-600">
                          {isVerified === true && 'Verification successful'}
                          {isVerified === false && 'Verification failed - please try again'}
                          {isVerified === undefined && 'Ready to test'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isVerified === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {isVerified === false && <X className="h-5 w-5 text-red-500" />}
                      <Button
                        size="sm"
                        variant={isVerified === true ? "outline" : "default"}
                        onClick={() => runVerification(template.type)}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          t('biometric.verify')
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {allVerified && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Verifications Successful!</AlertTitle>
            <AlertDescription>
              Your biometric authentication is working correctly and ready to use.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={nextStep} disabled={!allVerified}>
            Complete Setup
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function CompletionStep() {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3 text-green-600">{t('biometric.success')}</h2>
          <p className="text-slate-600 text-lg">Your biometric authentication is now active and protecting your account</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Setup Summary</h3>
          <div className="space-y-3">
            {enrolledBiometrics.map((template) => {
              const biometricInfo = biometricTypes.find(t => t.type === template.type);
              return (
                <div key={template.type} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{biometricInfo?.title} - Successfully enrolled</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleComplete} size="lg" className="px-8">
            {t('common.finish')}
          </Button>
          <p className="text-sm text-slate-600">
            You can manage your biometric settings anytime in your profile
          </p>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Biometric Setup</h1>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>

        <div className="space-y-2">
          <Progress value={(currentStep + 1) / steps.length * 100} className="w-full" />
          <div className="flex justify-between text-sm text-slate-600">
            <span>{currentStepData.title}</span>
            <span>{Math.round((currentStep + 1) / steps.length * 100)}% complete</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[500px]">
        <CardContent className="p-8">
          <CurrentStepComponent />
        </CardContent>
      </Card>
    </div>
  );
}
