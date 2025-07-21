"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  User,
  MapPin,
  Fingerprint,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  AlertTriangle,
  Shield,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      emailAddress: ''
    },
    // Step 2: Address Information
    addressInfo: {
      province: '',
      district: '',
      ward: '',
      streetAddress: ''
    },
    // Step 3: Biometric Data
    biometricData: {
      fingerprintCaptured: false,
      fingerprintQuality: 0,
      photoCaptured: false,
      photoQuality: 0,
      fingerprintData: null,
      photoData: null
    },
    // Step 4: Document Upload
    documents: {
      nationalId: null,
      birthCertificate: null,
      proofOfAddress: null,
      otherDocument: null
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // PNG Provinces
  const provinces = [
    'National Capital District',
    'Central',
    'Gulf',
    'Milne Bay',
    'Oro (Northern)',
    'Western',
    'Southern Highlands',
    'Western Highlands',
    'Enga',
    'Hela',
    'Jiwaka',
    'Morobe',
    'Madang',
    'East Sepik',
    'West Sepik (Sandaun)',
    'Manus',
    'New Ireland',
    'East New Britain',
    'West New Britain',
    'Autonomous Region of Bougainville'
  ];

  // Districts by Province (sample data)
  const districtsByProvince = {
    'National Capital District': ['Port Moresby', 'Moresby Northeast', 'Moresby Northwest', 'Moresby South'],
    'Central': ['Abau', 'Goilala', 'Kairuku-Hiri', 'Rigo'],
    'Western': ['Middle Fly', 'North Fly', 'South Fly'],
    'Morobe': ['Bulolo', 'Finschhafen', 'Huon', 'Kabwum', 'Lae', 'Markham', 'Menyamya', 'Nawaeb', 'Tewae-Siassi'],
    'Western Highlands': ['Dei', 'Hagen', 'Mul-Baiyer', 'Tambul-Nebilyer', 'Anglimp-South Wahgi'],
    'Enga': ['Kandep', 'Kompiam-Ambum', 'Lagaip-Porgera', 'Wabag', 'Wapenamanda'],
    'Morobe': ['Bulolo', 'Finschhafen', 'Huon', 'Kabwum', 'Lae', 'Markham', 'Menyamya', 'Nawaeb', 'Tewae-Siassi']
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: undefined
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName.trim()) {
          newErrors['personalInfo.firstName'] = 'First name is required';
        }
        if (!formData.personalInfo.lastName.trim()) {
          newErrors['personalInfo.lastName'] = 'Last name is required';
        }
        if (!formData.personalInfo.dateOfBirth) {
          newErrors['personalInfo.dateOfBirth'] = 'Date of birth is required';
        }
        if (!formData.personalInfo.gender) {
          newErrors['personalInfo.gender'] = 'Gender is required';
        }
        if (!formData.personalInfo.phoneNumber.trim()) {
          newErrors['personalInfo.phoneNumber'] = 'Phone number is required';
        } else if (!/^\+?675\s?\d{4}\s?\d{4}$/.test(formData.personalInfo.phoneNumber.replace(/\s/g, ''))) {
          newErrors['personalInfo.phoneNumber'] = 'Please enter a valid PNG phone number (+675 XXXX XXXX)';
        }
        if (formData.personalInfo.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.emailAddress)) {
          newErrors['personalInfo.emailAddress'] = 'Please enter a valid email address';
        }
        break;

      case 2:
        if (!formData.addressInfo.province) {
          newErrors['addressInfo.province'] = 'Province is required';
        }
        if (!formData.addressInfo.district) {
          newErrors['addressInfo.district'] = 'District is required';
        }
        if (!formData.addressInfo.ward.trim()) {
          newErrors['addressInfo.ward'] = 'Ward is required';
        }
        break;

      case 3:
        if (!formData.biometricData.fingerprintCaptured) {
          newErrors['biometricData.fingerprint'] = 'Fingerprint capture is required';
        }
        if (!formData.biometricData.photoCaptured) {
          newErrors['biometricData.photo'] = 'Photo capture is required';
        }
        break;

      case 4:
        if (!formData.documents.nationalId) {
          newErrors['documents.nationalId'] = 'National ID or passport is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const captureFingerprint = async () => {
    setIsCapturingFingerprint(true);

    // Simulate fingerprint capture
    await new Promise(resolve => setTimeout(resolve, 3000));

    const quality = Math.floor(Math.random() * 20) + 80; // 80-100% quality

    setFormData(prev => ({
      ...prev,
      biometricData: {
        ...prev.biometricData,
        fingerprintCaptured: true,
        fingerprintQuality: quality,
        fingerprintData: `fingerprint_${Date.now()}`
      }
    }));

    setIsCapturingFingerprint(false);
  };

  const capturePhoto = async () => {
    setIsCapturingPhoto(true);

    // Simulate photo capture
    await new Promise(resolve => setTimeout(resolve, 2000));

    const quality = Math.floor(Math.random() * 15) + 85; // 85-100% quality

    setFormData(prev => ({
      ...prev,
      biometricData: {
        ...prev.biometricData,
        photoCaptured: true,
        photoQuality: quality,
        photoData: `photo_${Date.now()}`
      }
    }));

    setIsCapturingPhoto(false);
  };

  const handleFileUpload = (documentType, file) => {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [`documents.${documentType}`]: 'File size must be less than 10MB'
      }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [`documents.${documentType}`]: 'Please upload PDF, JPG, or PNG files only'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }
      }
    }));

    // Clear error
    setErrors(prev => ({
      ...prev,
      [`documents.${documentType}`]: undefined
    }));
  };

  const submitRegistration = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Generate Digital ID
    const digitalId = `PNG${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

    setIsSubmitting(false);

    // Show success message
    alert(`🎉 Registration Successful!\n\nYour PNG Digital ID: ${digitalId}\n\nYou will receive an SMS confirmation shortly.\nYour Digital ID card will be ready for collection in 3-5 business days.`);

    // Reset form
    setFormData({
      personalInfo: { firstName: '', lastName: '', dateOfBirth: '', gender: '', phoneNumber: '', emailAddress: '' },
      addressInfo: { province: '', district: '', ward: '', streetAddress: '' },
      biometricData: { fingerprintCaptured: false, fingerprintQuality: 0, photoCaptured: false, photoQuality: 0, fingerprintData: null, photoData: null },
      documents: { nationalId: null, birthCertificate: null, proofOfAddress: null, otherDocument: null }
    });
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600 mx-auto mt-1" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
              <p className="text-gray-600">Enter your basic personal details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className={errors['personalInfo.firstName'] ? 'border-red-500' : ''}
                />
                {errors['personalInfo.firstName'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.firstName']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className={errors['personalInfo.lastName'] ? 'border-red-500' : ''}
                />
                {errors['personalInfo.lastName'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.lastName']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className={errors['personalInfo.dateOfBirth'] ? 'border-red-500' : ''}
                />
                {errors['personalInfo.dateOfBirth'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.dateOfBirth']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors['personalInfo.gender'] ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors['personalInfo.gender'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.gender']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.personalInfo.phoneNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)}
                  placeholder="+675 7123 4567"
                  className={errors['personalInfo.phoneNumber'] ? 'border-red-500' : ''}
                />
                {errors['personalInfo.phoneNumber'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phoneNumber']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emailAddress">Email Address (Optional)</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.personalInfo.emailAddress}
                  onChange={(e) => handleInputChange('personalInfo', 'emailAddress', e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors['personalInfo.emailAddress'] ? 'border-red-500' : ''}
                />
                {errors['personalInfo.emailAddress'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.emailAddress']}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4">
                <MapPin className="h-10 w-10 text-green-600 mx-auto mt-1" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Address Information</h2>
              <p className="text-gray-600">Enter your current residential address</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  value={formData.addressInfo.province}
                  onChange={(e) => {
                    handleInputChange('addressInfo', 'province', e.target.value);
                    handleInputChange('addressInfo', 'district', ''); // Reset district when province changes
                  }}
                  className={`w-full p-2 border rounded-md ${errors['addressInfo.province'] ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select your province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors['addressInfo.province'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['addressInfo.province']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="district">District *</Label>
                <select
                  id="district"
                  value={formData.addressInfo.district}
                  onChange={(e) => handleInputChange('addressInfo', 'district', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors['addressInfo.district'] ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={!formData.addressInfo.province}
                >
                  <option value="">Select your district</option>
                  {formData.addressInfo.province && districtsByProvince[formData.addressInfo.province]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors['addressInfo.district'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['addressInfo.district']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ward">Ward *</Label>
                <Input
                  id="ward"
                  value={formData.addressInfo.ward}
                  onChange={(e) => handleInputChange('addressInfo', 'ward', e.target.value)}
                  placeholder="Enter your ward"
                  className={errors['addressInfo.ward'] ? 'border-red-500' : ''}
                />
                {errors['addressInfo.ward'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['addressInfo.ward']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="streetAddress">Street Address (Optional)</Label>
                <Input
                  id="streetAddress"
                  value={formData.addressInfo.streetAddress}
                  onChange={(e) => handleInputChange('addressInfo', 'streetAddress', e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Address Verification</span>
              </div>
              <p className="text-sm text-blue-700">
                This address will be used for delivering your Digital ID card and future government communications.
                Please ensure all details are accurate.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4">
                <Fingerprint className="h-10 w-10 text-purple-600 mx-auto mt-1" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Biometric Data Capture</h2>
              <p className="text-gray-600">Capture your biometric data for identity verification</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Fingerprint Capture */}
              <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      formData.biometricData.fingerprintCaptured ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Fingerprint className={`h-10 w-10 ${
                        formData.biometricData.fingerprintCaptured ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Fingerprint Capture</h3>
                    {formData.biometricData.fingerprintCaptured ? (
                      <div className="space-y-2">
                        <p className="text-green-600 font-medium">✓ Fingerprint Captured</p>
                        <p className="text-sm text-gray-600">Quality: {formData.biometricData.fingerprintQuality}%</p>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-4">Place your finger on the scanner</p>
                    )}
                  </div>

                  <Button
                    onClick={captureFingerprint}
                    disabled={isCapturingFingerprint || formData.biometricData.fingerprintCaptured}
                    className="w-full"
                  >
                    {isCapturingFingerprint ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Capturing...
                      </>
                    ) : formData.biometricData.fingerprintCaptured ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Captured
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Capture Fingerprint
                      </>
                    )}
                  </Button>

                  {formData.biometricData.fingerprintCaptured && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          biometricData: {
                            ...prev.biometricData,
                            fingerprintCaptured: false,
                            fingerprintQuality: 0,
                            fingerprintData: null
                          }
                        }));
                      }}
                      className="w-full mt-2"
                    >
                      Recapture
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Photo Capture */}
              <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      formData.biometricData.photoCaptured ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Camera className={`h-10 w-10 ${
                        formData.biometricData.photoCaptured ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Face Photo Capture</h3>
                    {formData.biometricData.photoCaptured ? (
                      <div className="space-y-2">
                        <p className="text-green-600 font-medium">✓ Photo Captured</p>
                        <p className="text-sm text-gray-600">Quality: {formData.biometricData.photoQuality}%</p>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-4">Position your face in front of the camera</p>
                    )}
                  </div>

                  <Button
                    onClick={capturePhoto}
                    disabled={isCapturingPhoto || formData.biometricData.photoCaptured}
                    className="w-full"
                  >
                    {isCapturingPhoto ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Capturing...
                      </>
                    ) : formData.biometricData.photoCaptured ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Captured
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </>
                    )}
                  </Button>

                  {formData.biometricData.photoCaptured && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          biometricData: {
                            ...prev.biometricData,
                            photoCaptured: false,
                            photoQuality: 0,
                            photoData: null
                          }
                        }));
                      }}
                      className="w-full mt-2"
                    >
                      Retake Photo
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Error Messages */}
            {(errors['biometricData.fingerprint'] || errors['biometricData.photo']) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Biometric Data Required</AlertTitle>
                <AlertDescription className="text-red-700">
                  {errors['biometricData.fingerprint'] && <div>{errors['biometricData.fingerprint']}</div>}
                  {errors['biometricData.photo'] && <div>{errors['biometricData.photo']}</div>}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Security Notice</span>
              </div>
              <p className="text-sm text-purple-700">
                Your biometric data is encrypted and stored securely. It will only be used for identity verification purposes.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4">
                <FileText className="h-10 w-10 text-orange-600 mx-auto mt-1" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Document Upload</h2>
              <p className="text-gray-600">Upload supporting documents for verification</p>
            </div>

            <div className="space-y-6">
              {/* National ID/Passport */}
              <div>
                <Label htmlFor="nationalId">National ID/Passport/Other ID *</Label>
                <div className="mt-2">
                  {formData.documents.nationalId ? (
                    <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{formData.documents.nationalId.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.documents.nationalId.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('documents', 'nationalId', null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-orange-400 ${
                        errors['documents.nationalId'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      onClick={() => document.getElementById('nationalId').click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="nationalId"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('nationalId', e.target.files[0])}
                    className="hidden"
                  />
                  {errors['documents.nationalId'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['documents.nationalId']}</p>
                  )}
                </div>
              </div>

              {/* Birth Certificate */}
              <div>
                <Label htmlFor="birthCertificate">Birth Certificate (Optional but recommended)</Label>
                <div className="mt-2">
                  {formData.documents.birthCertificate ? (
                    <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{formData.documents.birthCertificate.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.documents.birthCertificate.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('documents', 'birthCertificate', null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-orange-400"
                      onClick={() => document.getElementById('birthCertificate').click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="birthCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('birthCertificate', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Proof of Address */}
              <div>
                <Label htmlFor="proofOfAddress">Proof of Address (Optional)</Label>
                <div className="mt-2">
                  {formData.documents.proofOfAddress ? (
                    <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{formData.documents.proofOfAddress.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.documents.proofOfAddress.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('documents', 'proofOfAddress', null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-orange-400"
                      onClick={() => document.getElementById('proofOfAddress').click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Utility bill, bank statement, etc.</p>
                    </div>
                  )}
                  <input
                    id="proofOfAddress"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('proofOfAddress', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Other Document */}
              <div>
                <Label htmlFor="otherDocument">Any Other Supporting Document (Optional)</Label>
                <div className="mt-2">
                  {formData.documents.otherDocument ? (
                    <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{formData.documents.otherDocument.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.documents.otherDocument.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('documents', 'otherDocument', null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-orange-400"
                      onClick={() => document.getElementById('otherDocument').click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Employment letter, education certificates, etc.</p>
                    </div>
                  )}
                  <input
                    id="otherDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('otherDocument', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Document Requirements</span>
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Accepted formats: PDF, JPG, PNG</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Ensure documents are clear and readable</li>
                <li>• All uploaded documents will be verified by our team</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto mt-1" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Review & Submit</h2>
              <p className="text-gray-600">Review all entered details before submission</p>
            </div>

            <div className="space-y-6">
              {/* Personal Information Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</div>
                    <div><strong>Date of Birth:</strong> {new Date(formData.personalInfo.dateOfBirth).toLocaleDateString()}</div>
                    <div><strong>Gender:</strong> {formData.personalInfo.gender}</div>
                    <div><strong>Phone:</strong> {formData.personalInfo.phoneNumber}</div>
                    {formData.personalInfo.emailAddress && (
                      <div><strong>Email:</strong> {formData.personalInfo.emailAddress}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Address Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div><strong>Province:</strong> {formData.addressInfo.province}</div>
                    <div><strong>District:</strong> {formData.addressInfo.district}</div>
                    <div><strong>Ward:</strong> {formData.addressInfo.ward}</div>
                    {formData.addressInfo.streetAddress && (
                      <div><strong>Street Address:</strong> {formData.addressInfo.streetAddress}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Biometric Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" />
                    Biometric Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Fingerprint Captured ({formData.biometricData.fingerprintQuality}% quality)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Photo Captured ({formData.biometricData.photoQuality}% quality)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>National ID/Passport: {formData.documents.nationalId?.name}</span>
                    </div>
                    {formData.documents.birthCertificate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Birth Certificate: {formData.documents.birthCertificate.name}</span>
                      </div>
                    )}
                    {formData.documents.proofOfAddress && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Proof of Address: {formData.documents.proofOfAddress.name}</span>
                      </div>
                    )}
                    {formData.documents.otherDocument && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Other Document: {formData.documents.otherDocument.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded"
                    required
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and
                    <a href="#" className="text-blue-600 underline ml-1">Privacy Policy</a>
                  </label>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  After submitting your application:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>You will receive an SMS confirmation with your application reference number</li>
                    <li>Your application will be reviewed within 2-3 business days</li>
                    <li>Your Digital ID card will be ready for collection in 3-5 business days</li>
                    <li>You will be notified when your card is ready for pickup</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Digital ID Registration</h1>
          <p className="text-xl text-slate-600">Get your official PNG Digital ID in 5 simple steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-3 text-xs text-slate-500">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Personal</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Address</span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Biometrics</span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Documents</span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-medium' : ''}>Review</span>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep} className="flex items-center gap-2">
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitRegistration}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Submit Registration
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
