"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  User,
  Camera,
  Fingerprint,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Clock,
  Phone,
  MapPin,
  CreditCard,
  Key,
  QrCode,
  Eye,
  Scan,
  Users,
  Database,
  Wifi,
  WifiOff,
  Save,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function AgentEnrollmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOnline, setIsOnline] = useState(true);
  const [agentInfo, setAgentInfo] = useState({
    agentId: 'AGT-NCD-001',
    name: 'Agent John Smith',
    station: 'Port Moresby Registration Center',
    province: 'National Capital District'
  });

  const [enrollmentData, setEnrollmentData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    citizenship: 'Papua New Guinea',
    email: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    village: '',
    mothersName: '',
    fathersName: '',
    maritalStatus: '',
    occupation: '',
    documents: [],
    biometrics: {
      fingerprints: [],
      facePhoto: null,
      signature: null
    },
    verificationLevel: 'tier3',
    emergencyContact: ''
  });

  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [isCapturingBiometric, setIsCapturingBiometric] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [errors, setErrors] = useState({});

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const provinces = [
    'National Capital District', 'Central', 'Gulf', 'Milne Bay', 'Oro',
    'Western', 'Southern Highlands', 'Western Highlands', 'Enga', 'Hela',
    'Jiwaka', 'Morobe', 'Madang', 'East Sepik', 'West Sepik', 'Manus',
    'New Ireland', 'East New Britain', 'West New Britain', 'AROB'
  ];

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setEnrollmentData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const captureBiometric = async (type) => {
    setIsCapturingBiometric(true);

    // Simulate biometric capture
    setTimeout(() => {
      if (type === 'fingerprint') {
        const newFingerprints = [...enrollmentData.biometrics.fingerprints, {
          finger: enrollmentData.biometrics.fingerprints.length + 1,
          quality: Math.floor(Math.random() * 20) + 80,
          template: `FP_${Date.now()}`
        }];

        setEnrollmentData(prev => ({
          ...prev,
          biometrics: {
            ...prev.biometrics,
            fingerprints: newFingerprints
          }
        }));
      } else if (type === 'face') {
        setEnrollmentData(prev => ({
          ...prev,
          biometrics: {
            ...prev.biometrics,
            facePhoto: {
              quality: Math.floor(Math.random() * 15) + 85,
              template: `FACE_${Date.now()}`
            }
          }
        }));
      } else if (type === 'signature') {
        setEnrollmentData(prev => ({
          ...prev,
          biometrics: {
            ...prev.biometrics,
            signature: {
              quality: Math.floor(Math.random() * 10) + 90,
              template: `SIG_${Date.now()}`
            }
          }
        }));
      }

      setIsCapturingBiometric(false);
    }, 2000);
  };

  const handleDocumentUpload = (file) => {
    const newDocument = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };

    setEnrollmentData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };

  const saveToOfflineQueue = () => {
    const enrollmentRecord = {
      ...enrollmentData,
      agentId: agentInfo.agentId,
      enrolledAt: new Date().toISOString(),
      status: 'offline_pending',
      id: `OFFLINE_${Date.now()}`
    };

    setOfflineQueue(prev => [...prev, enrollmentRecord]);

    // Reset form
    setEnrollmentData({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      citizenship: 'Papua New Guinea',
      email: '',
      phone: '',
      address: '',
      province: '',
      district: '',
      ward: '',
      village: '',
      mothersName: '',
      fathersName: '',
      maritalStatus: '',
      occupation: '',
      documents: [],
      biometrics: {
        fingerprints: [],
        facePhoto: null,
        signature: null
      },
      verificationLevel: 'tier3',
      emergencyContact: ''
    });

    setCurrentStep(1);
    alert('Enrollment saved to offline queue. Will sync when connection is restored.');
  };

  const submitEnrollment = async () => {
    if (!isOnline) {
      saveToOfflineQueue();
      return;
    }

    setEnrollmentProgress(0);

    // Simulate enrollment submission
    for (let i = 0; i <= 100; i += 10) {
      setEnrollmentProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const digitalIdNumber = `PNG${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

    alert(`Enrollment successful! Digital ID: ${digitalIdNumber}`);

    // Reset form for next enrollment
    setEnrollmentData({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      citizenship: 'Papua New Guinea',
      email: '',
      phone: '',
      address: '',
      province: '',
      district: '',
      ward: '',
      village: '',
      mothersName: '',
      fathersName: '',
      maritalStatus: '',
      occupation: '',
      documents: [],
      biometrics: {
        fingerprints: [],
        facePhoto: null,
        signature: null
      },
      verificationLevel: 'tier3',
      emergencyContact: ''
    });

    setCurrentStep(1);
    setEnrollmentProgress(0);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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
              <h1 className="text-3xl font-bold text-slate-900">Government Agent Enrollment</h1>
              <p className="text-slate-600">Population-wide Digital ID registration interface</p>
            </div>
          </div>

          {/* Agent Info & Status */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Agent Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Agent ID:</strong> {agentInfo.agentId}</div>
                  <div><strong>Name:</strong> {agentInfo.name}</div>
                  <div><strong>Station:</strong> {agentInfo.station}</div>
                  <div><strong>Province:</strong> {agentInfo.province}</div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-orange-600" />}
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Badge>
                    <span>{isOnline ? 'Connected to central registry' : 'Offline mode - data will sync later'}</span>
                  </div>
                  {offlineQueue.length > 0 && (
                    <div><strong>Offline Queue:</strong> {offlineQueue.length} enrollments pending</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Enrollment Progress</span>
              <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Personal</span>
              <span>Contact</span>
              <span>Documents</span>
              <span>Biometrics</span>
              <span>Verification</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={enrollmentData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={enrollmentData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        placeholder="Enter middle name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={enrollmentData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={enrollmentData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                      <Input
                        id="placeOfBirth"
                        value={enrollmentData.placeOfBirth}
                        onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                        placeholder="e.g., Port Moresby, NCD"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <select
                        id="gender"
                        value={enrollmentData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="mothersName">Mother's Full Name</Label>
                      <Input
                        id="mothersName"
                        value={enrollmentData.mothersName}
                        onChange={(e) => handleInputChange('mothersName', e.target.value)}
                        placeholder="Enter mother's full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fathersName">Father's Full Name</Label>
                      <Input
                        id="fathersName"
                        value={enrollmentData.fathersName}
                        onChange={(e) => handleInputChange('fathersName', e.target.value)}
                        placeholder="Enter father's full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <select
                        id="maritalStatus"
                        value={enrollmentData.maritalStatus}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={enrollmentData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Fingerprint className="h-5 w-5" />
                      Biometric Data Capture
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Capture biometric data for secure identity verification.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Fingerprints */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fingerprints</CardTitle>
                        <CardDescription>Capture all 10 fingerprints</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Fingerprint className="h-16 w-16 text-gray-400" />
                          </div>
                          <div className="mb-4">
                            <Badge variant="outline">
                              {enrollmentData.biometrics.fingerprints.length}/10 captured
                            </Badge>
                          </div>
                          <Button
                            onClick={() => captureBiometric('fingerprint')}
                            disabled={isCapturingBiometric || enrollmentData.biometrics.fingerprints.length >= 10}
                            className="w-full"
                          >
                            {isCapturingBiometric ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Capturing...
                              </>
                            ) : (
                              <>
                                <Scan className="h-4 w-4 mr-2" />
                                Capture Next
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Face Photo */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Face Photo</CardTitle>
                        <CardDescription>High-resolution facial image</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Camera className="h-16 w-16 text-gray-400" />
                          </div>
                          <div className="mb-4">
                            <Badge variant={enrollmentData.biometrics.facePhoto ? 'default' : 'outline'}>
                              {enrollmentData.biometrics.facePhoto ? 'Captured' : 'Not captured'}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => captureBiometric('face')}
                            disabled={isCapturingBiometric}
                            className="w-full"
                          >
                            {isCapturingBiometric ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Capturing...
                              </>
                            ) : (
                              <>
                                <Camera className="h-4 w-4 mr-2" />
                                Take Photo
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Signature */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Digital Signature</CardTitle>
                        <CardDescription>Signature capture pad</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <FileText className="h-16 w-16 text-gray-400" />
                          </div>
                          <div className="mb-4">
                            <Badge variant={enrollmentData.biometrics.signature ? 'default' : 'outline'}>
                              {enrollmentData.biometrics.signature ? 'Captured' : 'Not captured'}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => captureBiometric('signature')}
                            disabled={isCapturingBiometric}
                            className="w-full"
                          >
                            {isCapturingBiometric ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Capturing...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2" />
                                Capture Signature
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Biometric Quality */}
                  {enrollmentData.biometrics.fingerprints.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quality Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {enrollmentData.biometrics.fingerprints.map((fp, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">Finger {fp.finger}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={fp.quality} className="w-20" />
                                <span className="text-sm font-medium">{fp.quality}%</span>
                                <Badge variant={fp.quality >= 80 ? 'default' : 'secondary'}>
                                  {fp.quality >= 80 ? 'Good' : 'Retry'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-4">
                  {!isOnline && (
                    <Button
                      onClick={saveToOfflineQueue}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Offline
                    </Button>
                  )}

                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitEnrollment}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={enrollmentProgress > 0 && enrollmentProgress < 100}
                    >
                      {enrollmentProgress > 0 && enrollmentProgress < 100 ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing ({enrollmentProgress}%)
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Enrollment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
