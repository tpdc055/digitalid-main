"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Camera,
  Fingerprint,
  Shield,
  Home,
  GraduationCap,
  Briefcase,
  Heart,
  Globe,
  Baby,
  UserPlus,
  Calendar,
  IdCard,
  Building,
  Languages,
  Activity,
  DollarSign,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Save,
  RefreshCw
} from 'lucide-react';

interface UserRegistryProps {
  role: 'admin' | 'operator' | 'viewer';
  onUserSelect: (user: any) => void;
}

export default function UserRegistry({ role, onUserSelect }: UserRegistryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      digitalId: 'PNG2024001234',
      name: 'John Kaupa',
      email: 'john.kaupa@email.pg',
      phone: '+675 7123 4567',
      status: 'verified',
      tier: 'tier3',
      province: 'National Capital District',
      registeredAt: '2024-01-15T10:30:00Z',
      lastActive: '2024-01-20T14:22:00Z'
    },
    {
      id: 2,
      digitalId: 'PNG2024005678',
      name: 'Mary Temu',
      email: 'mary.temu@email.pg',
      phone: '+675 7234 5678',
      status: 'verified',
      tier: 'tier2',
      province: 'Western Highlands',
      registeredAt: '2024-01-12T09:15:00Z',
      lastActive: '2024-01-19T16:45:00Z'
    },
    {
      id: 3,
      digitalId: 'PNG2024009012',
      name: 'Peter Wambi',
      email: 'peter.wambi@email.pg',
      phone: '+675 7345 6789',
      status: 'pending',
      tier: 'tier1',
      province: 'Morobe',
      registeredAt: '2024-01-18T11:20:00Z',
      lastActive: '2024-01-18T11:20:00Z'
    }
  ]);

  // Census Registration State
  const [censusStep, setCensusStep] = useState(1);
  const [censusData, setCensusData] = useState({
    // Personal Information
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: 'Papua New Guinea',
      dualCitizenship: '',
      passportNumber: '',
      birthCertificateNumber: '',
      customaryName: '',
      tribalAffiliation: '',
      clanGroup: '',
      totemicAffiliation: ''
    },

    // Location & Address
    location: {
      currentProvince: '',
      currentDistrict: '',
      currentLLG: '',
      currentWard: '',
      currentVillage: '',
      currentAddress: '',
      currentPostalCode: '',
      permanentProvince: '',
      permanentDistrict: '',
      permanentLLG: '',
      permanentWard: '',
      permanentVillage: '',
      permanentAddress: '',
      permanentPostalCode: '',
      yearsAtCurrentAddress: '',
      previousProvince: '',
      gpsCoordinates: '',
      landOwnership: '',
      housingType: '',
      accessToElectricity: '',
      accessToWater: '',
      accessToSanitation: '',
      internetAccess: ''
    },

    // Family & Household
    family: {
      fatherName: '',
      fatherAlive: '',
      fatherOccupation: '',
      motherName: '',
      motherMaidenName: '',
      motherAlive: '',
      motherOccupation: '',
      spouseName: '',
      spouseOccupation: '',
      numberOfChildren: '',
      childrenNames: [],
      householdSize: '',
      householdHead: '',
      relationToHead: '',
      dependents: '',
      guardianName: '',
      guardianRelation: '',
      emergencyContact: '',
      emergencyRelation: '',
      emergencyPhone: ''
    },

    // Education
    education: {
      highestLevel: '',
      currentlyEnrolled: '',
      schoolName: '',
      graduationYear: '',
      fieldOfStudy: '',
      professionalQualifications: '',
      vocationalTraining: '',
      literacyLevel: '',
      languagesSpoken: [],
      primaryLanguage: '',
      englishProficiency: '',
      tokPisinProficiency: '',
      hiriMotuProficiency: '',
      educationCertificates: []
    },

    // Employment & Economic
    employment: {
      employmentStatus: '',
      occupation: '',
      employer: '',
      workLocation: '',
      monthlyIncome: '',
      incomeSource: '',
      businessOwnership: '',
      businessType: '',
      businessLocation: '',
      unemploymentDuration: '',
      previousOccupation: '',
      skillsTraining: '',
      seekingWork: '',
      retirementStatus: '',
      pensionReceiver: '',
      socialBenefits: '',
      bankAccount: '',
      financialInstitution: '',
      mobileMoneyAccount: ''
    },

    // Health Information
    health: {
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      disabilities: '',
      medicationList: '',
      lastMedicalCheckup: '',
      healthInsurance: '',
      medicalProvider: '',
      emergencyMedicalContact: '',
      vaccinationRecord: '',
      mentalHealthSupport: '',
      substanceUse: '',
      healthCardNumber: '',
      organDonor: '',
      medicalDirectives: ''
    },

    // Government Services
    government: {
      voterRegistration: '',
      voterID: '',
      taxFileNumber: '',
      socialSecurityNumber: '',
      driverLicense: '',
      licenseNumber: '',
      vehicleOwnership: '',
      businessLicense: '',
      professionalLicense: '',
      governmentEmployee: '',
      militaryService: '',
      policeRecord: '',
      courtCases: '',
      socialServices: '',
      beneficiaryPrograms: ''
    },

    // Contact Information
    contact: {
      primaryPhone: '',
      secondaryPhone: '',
      emailAddress: '',
      socialMediaAccounts: '',
      preferredContactMethod: '',
      communicationLanguage: '',
      hearingImpairment: '',
      visualImpairment: '',
      speechImpairment: ''
    },

    // Cultural & Social
    cultural: {
      religion: '',
      church: '',
      customaryMarriage: '',
      traditionalRoles: '',
      communityLeadership: '',
      culturalPractices: '',
      festivals: '',
      artisanSkills: '',
      storytellingRole: '',
      traditionalKnowledge: ''
    },

    // Additional Information
    additional: {
      specialNeeds: '',
      accessibilityRequirements: '',
      transportationNeeds: '',
      internetUsage: '',
      technologySkills: '',
      volunteerWork: '',
      communityInvolvement: '',
      politicalAffiliation: '',
      preferences: '',
      notes: ''
    }
  });

  const totalSteps = 10;
  const currentProgress = (censusStep / totalSteps) * 100;

  const provinces = [
    'National Capital District', 'Central', 'Gulf', 'Milne Bay', 'Oro (Northern)',
    'Western', 'Southern Highlands', 'Western Highlands', 'Enga', 'Hela',
    'Jiwaka', 'Morobe', 'Madang', 'East Sepik', 'West Sepik (Sandaun)', 'Manus',
    'New Ireland', 'East New Britain', 'West New Britain', 'Autonomous Region of Bougainville'
  ];

  const languages = [
    'English', 'Tok Pisin', 'Hiri Motu', 'Enga', 'Melpa', 'Huli', 'Kuanua', 'Dobu',
    'Kaugel', 'Daga', 'Suau', 'Binandere', 'Managalasi', 'Orokaiva', 'Yabem',
    'Kâte', 'Gedaged', 'Tami', 'Numbami', 'Motu', 'Koiari', 'Toaripi', 'Roro'
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTier = tierFilter === 'all' || user.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleCensusInputChange = (section: string, field: string, value: string) => {
    setCensusData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setCensusData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        languagesSpoken: prev.education.languagesSpoken.includes(language)
          ? prev.education.languagesSpoken.filter(l => l !== language)
          : [...prev.education.languagesSpoken, language]
      }
    }));
  };

  const nextStep = () => {
    if (censusStep < totalSteps) {
      setCensusStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (censusStep > 1) {
      setCensusStep(prev => prev - 1);
    }
  };

  const submitCensusRegistration = async () => {
    setIsSubmitting(true);

    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate Digital ID number
    const digitalId = `PNG${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;

    // Add to users list
    const newUser = {
      id: Date.now(),
      digitalId,
      name: `${censusData.personalInfo.firstName} ${censusData.personalInfo.lastName}`,
      email: censusData.contact.emailAddress || 'Not provided',
      phone: censusData.contact.primaryPhone || 'Not provided',
      status: 'verified',
      tier: 'tier3',
      province: censusData.location.currentProvince,
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      censusData: censusData
    };

    setUsers(prev => [...prev, newUser]);

    // Reset form and close modal
    setCensusData({
      personalInfo: {
        firstName: '', middleName: '', lastName: '', preferredName: '', dateOfBirth: '',
        placeOfBirth: '', gender: '', maritalStatus: '', nationality: 'Papua New Guinea',
        dualCitizenship: '', passportNumber: '', birthCertificateNumber: '', customaryName: '',
        tribalAffiliation: '', clanGroup: '', totemicAffiliation: ''
      },
      location: {
        currentProvince: '', currentDistrict: '', currentLLG: '', currentWard: '',
        currentVillage: '', currentAddress: '', currentPostalCode: '', permanentProvince: '',
        permanentDistrict: '', permanentLLG: '', permanentWard: '', permanentVillage: '',
        permanentAddress: '', permanentPostalCode: '', yearsAtCurrentAddress: '',
        previousProvince: '', gpsCoordinates: '', landOwnership: '', housingType: '',
        accessToElectricity: '', accessToWater: '', accessToSanitation: '', internetAccess: ''
      },
      family: {
        fatherName: '', fatherAlive: '', fatherOccupation: '', motherName: '',
        motherMaidenName: '', motherAlive: '', motherOccupation: '', spouseName: '',
        spouseOccupation: '', numberOfChildren: '', childrenNames: [], householdSize: '',
        householdHead: '', relationToHead: '', dependents: '', guardianName: '',
        guardianRelation: '', emergencyContact: '', emergencyRelation: '', emergencyPhone: ''
      },
      education: {
        highestLevel: '', currentlyEnrolled: '', schoolName: '', graduationYear: '',
        fieldOfStudy: '', professionalQualifications: '', vocationalTraining: '',
        literacyLevel: '', languagesSpoken: [], primaryLanguage: '', englishProficiency: '',
        tokPisinProficiency: '', hiriMotuProficiency: '', educationCertificates: []
      },
      employment: {
        employmentStatus: '', occupation: '', employer: '', workLocation: '',
        monthlyIncome: '', incomeSource: '', businessOwnership: '', businessType: '',
        businessLocation: '', unemploymentDuration: '', previousOccupation: '',
        skillsTraining: '', seekingWork: '', retirementStatus: '', pensionReceiver: '',
        socialBenefits: '', bankAccount: '', financialInstitution: '', mobileMoneyAccount: ''
      },
      health: {
        bloodType: '', allergies: '', chronicConditions: '', disabilities: '',
        medicationList: '', lastMedicalCheckup: '', healthInsurance: '', medicalProvider: '',
        emergencyMedicalContact: '', vaccinationRecord: '', mentalHealthSupport: '',
        substanceUse: '', healthCardNumber: '', organDonor: '', medicalDirectives: ''
      },
      government: {
        voterRegistration: '', voterID: '', taxFileNumber: '', socialSecurityNumber: '',
        driverLicense: '', licenseNumber: '', vehicleOwnership: '', businessLicense: '',
        professionalLicense: '', governmentEmployee: '', militaryService: '', policeRecord: '',
        courtCases: '', socialServices: '', beneficiaryPrograms: ''
      },
      contact: {
        primaryPhone: '', secondaryPhone: '', emailAddress: '', socialMediaAccounts: '',
        preferredContactMethod: '', communicationLanguage: '', hearingImpairment: '',
        visualImpairment: '', speechImpairment: ''
      },
      cultural: {
        religion: '', church: '', customaryMarriage: '', traditionalRoles: '',
        communityLeadership: '', culturalPractices: '', festivals: '', artisanSkills: '',
        storytellingRole: '', traditionalKnowledge: ''
      },
      additional: {
        specialNeeds: '', accessibilityRequirements: '', transportationNeeds: '',
        internetUsage: '', technologySkills: '', volunteerWork: '', communityInvolvement: '',
        politicalAffiliation: '', preferences: '', notes: ''
      }
    });

    setCensusStep(1);
    setIsSubmitting(false);
    setShowAddUserModal(false);

    alert(`Census registration successful!\nDigital ID: ${digitalId}\nUser registered in the national database.`);
  };

  const renderCensusStep = () => {
    switch (censusStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600">Basic personal and identity details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={censusData.personalInfo.firstName}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={censusData.personalInfo.middleName}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'middleName', e.target.value)}
                  placeholder="Enter middle name"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={censusData.personalInfo.lastName}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <Label htmlFor="preferredName">Preferred Name</Label>
                <Input
                  id="preferredName"
                  value={censusData.personalInfo.preferredName}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'preferredName', e.target.value)}
                  placeholder="Name you prefer to be called"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={censusData.personalInfo.dateOfBirth}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  value={censusData.personalInfo.placeOfBirth}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'placeOfBirth', e.target.value)}
                  placeholder="Village, District, Province"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={censusData.personalInfo.gender}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'gender', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <select
                  id="maritalStatus"
                  value={censusData.personalInfo.maritalStatus}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'maritalStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="customary_marriage">Customary Marriage</option>
                  <option value="divorced">Divorced</option>
                  <option value="separated">Separated</option>
                  <option value="widowed">Widowed</option>
                  <option value="de_facto">De Facto</option>
                </select>
              </div>

              <div>
                <Label htmlFor="birthCertificateNumber">Birth Certificate Number</Label>
                <Input
                  id="birthCertificateNumber"
                  value={censusData.personalInfo.birthCertificateNumber}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'birthCertificateNumber', e.target.value)}
                  placeholder="Enter birth certificate number"
                />
              </div>

              <div>
                <Label htmlFor="customaryName">Customary/Traditional Name</Label>
                <Input
                  id="customaryName"
                  value={censusData.personalInfo.customaryName}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'customaryName', e.target.value)}
                  placeholder="Traditional or customary name"
                />
              </div>

              <div>
                <Label htmlFor="tribalAffiliation">Tribal Affiliation</Label>
                <Input
                  id="tribalAffiliation"
                  value={censusData.personalInfo.tribalAffiliation}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'tribalAffiliation', e.target.value)}
                  placeholder="Tribal or ethnic group"
                />
              </div>

              <div>
                <Label htmlFor="clanGroup">Clan Group</Label>
                <Input
                  id="clanGroup"
                  value={censusData.personalInfo.clanGroup}
                  onChange={(e) => handleCensusInputChange('personalInfo', 'clanGroup', e.target.value)}
                  placeholder="Clan or family group"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Location & Address</h3>
              <p className="text-gray-600">Current and permanent address information</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-lg mb-4">Current Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentProvince">Province *</Label>
                    <select
                      id="currentProvince"
                      value={censusData.location.currentProvince}
                      onChange={(e) => handleCensusInputChange('location', 'currentProvince', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="currentDistrict">District *</Label>
                    <Input
                      id="currentDistrict"
                      value={censusData.location.currentDistrict}
                      onChange={(e) => handleCensusInputChange('location', 'currentDistrict', e.target.value)}
                      placeholder="Enter district"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentVillage">Village/Suburb *</Label>
                    <Input
                      id="currentVillage"
                      value={censusData.location.currentVillage}
                      onChange={(e) => handleCensusInputChange('location', 'currentVillage', e.target.value)}
                      placeholder="Enter village or suburb"
                    />
                  </div>

                  <div>
                    <Label htmlFor="housingType">Housing Type</Label>
                    <select
                      id="housingType"
                      value={censusData.location.housingType}
                      onChange={(e) => handleCensusInputChange('location', 'housingType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select housing type</option>
                      <option value="traditional_house">Traditional House</option>
                      <option value="modern_house">Modern House</option>
                      <option value="apartment">Apartment</option>
                      <option value="settlement">Settlement</option>
                      <option value="government_housing">Government Housing</option>
                      <option value="company_housing">Company Housing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="accessToElectricity">Access to Electricity</Label>
                    <select
                      id="accessToElectricity"
                      value={censusData.location.accessToElectricity}
                      onChange={(e) => handleCensusInputChange('location', 'accessToElectricity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select access</option>
                      <option value="grid_electricity">Grid Electricity</option>
                      <option value="solar_power">Solar Power</option>
                      <option value="generator">Generator</option>
                      <option value="no_electricity">No Electricity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="accessToWater">Access to Water</Label>
                    <select
                      id="accessToWater"
                      value={censusData.location.accessToWater}
                      onChange={(e) => handleCensusInputChange('location', 'accessToWater', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select water source</option>
                      <option value="piped_water">Piped Water</option>
                      <option value="bore_hole">Bore Hole</option>
                      <option value="well">Well</option>
                      <option value="spring">Spring</option>
                      <option value="river_stream">River/Stream</option>
                      <option value="rainwater">Rainwater Collection</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="currentAddress">Full Street Address</Label>
                  <Textarea
                    id="currentAddress"
                    value={censusData.location.currentAddress}
                    onChange={(e) => handleCensusInputChange('location', 'currentAddress', e.target.value)}
                    placeholder="Enter complete street address"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Family & Household Information</h3>
              <p className="text-gray-600">Family relationships and household composition</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherName">Father's Full Name</Label>
                <Input
                  id="fatherName"
                  value={censusData.family.fatherName}
                  onChange={(e) => handleCensusInputChange('family', 'fatherName', e.target.value)}
                  placeholder="Enter father's full name"
                />
              </div>

              <div>
                <Label htmlFor="motherName">Mother's Full Name</Label>
                <Input
                  id="motherName"
                  value={censusData.family.motherName}
                  onChange={(e) => handleCensusInputChange('family', 'motherName', e.target.value)}
                  placeholder="Enter mother's full name"
                />
              </div>

              <div>
                <Label htmlFor="spouseName">Spouse/Partner Name</Label>
                <Input
                  id="spouseName"
                  value={censusData.family.spouseName}
                  onChange={(e) => handleCensusInputChange('family', 'spouseName', e.target.value)}
                  placeholder="Enter spouse or partner name"
                />
              </div>

              <div>
                <Label htmlFor="numberOfChildren">Number of Children</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  value={censusData.family.numberOfChildren}
                  onChange={(e) => handleCensusInputChange('family', 'numberOfChildren', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="householdSize">Total Household Size</Label>
                <Input
                  id="householdSize"
                  type="number"
                  value={censusData.family.householdSize}
                  onChange={(e) => handleCensusInputChange('family', 'householdSize', e.target.value)}
                  placeholder="Number of people in household"
                />
              </div>

              <div>
                <Label htmlFor="relationToHead">Relationship to Household Head</Label>
                <select
                  id="relationToHead"
                  value={censusData.family.relationToHead}
                  onChange={(e) => handleCensusInputChange('family', 'relationToHead', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select relationship</option>
                  <option value="head">Head of Household</option>
                  <option value="spouse">Spouse/Partner</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other_relative">Other Relative</option>
                  <option value="non_relative">Non-relative</option>
                </select>
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={censusData.family.emergencyContact}
                  onChange={(e) => handleCensusInputChange('family', 'emergencyContact', e.target.value)}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={censusData.family.emergencyPhone}
                  onChange={(e) => handleCensusInputChange('family', 'emergencyPhone', e.target.value)}
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Education Information</h3>
              <p className="text-gray-600">Educational background and language skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="highestLevel">Highest Education Level</Label>
                <select
                  id="highestLevel"
                  value={censusData.education.highestLevel}
                  onChange={(e) => handleCensusInputChange('education', 'highestLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select level</option>
                  <option value="no_formal_education">No Formal Education</option>
                  <option value="elementary">Elementary</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="grade_10">Grade 10</option>
                  <option value="grade_12">Grade 12</option>
                  <option value="technical_college">Technical College</option>
                  <option value="university">University</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <Label htmlFor="primaryLanguage">Primary Language</Label>
                <select
                  id="primaryLanguage"
                  value={censusData.education.primaryLanguage}
                  onChange={(e) => handleCensusInputChange('education', 'primaryLanguage', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select primary language</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="literacyLevel">Reading & Writing Ability</Label>
                <select
                  id="literacyLevel"
                  value={censusData.education.literacyLevel}
                  onChange={(e) => handleCensusInputChange('education', 'literacyLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select ability</option>
                  <option value="fluent">Read and Write Fluently</option>
                  <option value="basic">Basic Reading and Writing</option>
                  <option value="read_only">Can Read Only</option>
                  <option value="minimal">Minimal Literacy</option>
                  <option value="none">Cannot Read or Write</option>
                </select>
              </div>

              <div>
                <Label htmlFor="schoolName">School/Institution Name</Label>
                <Input
                  id="schoolName"
                  value={censusData.education.schoolName}
                  onChange={(e) => handleCensusInputChange('education', 'schoolName', e.target.value)}
                  placeholder="Enter school or institution name"
                />
              </div>
            </div>

            <div>
              <Label>Languages Spoken (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {languages.map(language => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={censusData.education.languagesSpoken.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                      className="rounded"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Employment & Economic Information</h3>
              <p className="text-gray-600">Work status and financial information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <select
                  id="employmentStatus"
                  value={censusData.employment.employmentStatus}
                  onChange={(e) => handleCensusInputChange('employment', 'employmentStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="employed_full_time">Employed Full Time</option>
                  <option value="employed_part_time">Employed Part Time</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="unable_to_work">Unable to Work</option>
                </select>
              </div>

              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={censusData.employment.occupation}
                  onChange={(e) => handleCensusInputChange('employment', 'occupation', e.target.value)}
                  placeholder="Enter your occupation"
                />
              </div>

              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={censusData.employment.employer}
                  onChange={(e) => handleCensusInputChange('employment', 'employer', e.target.value)}
                  placeholder="Enter employer name"
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (PGK)</Label>
                <select
                  id="monthlyIncome"
                  value={censusData.employment.monthlyIncome}
                  onChange={(e) => handleCensusInputChange('employment', 'monthlyIncome', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select income range</option>
                  <option value="under_500">Under K500</option>
                  <option value="500_1000">K500 - K1,000</option>
                  <option value="1000_2000">K1,000 - K2,000</option>
                  <option value="2000_5000">K2,000 - K5,000</option>
                  <option value="5000_10000">K5,000 - K10,000</option>
                  <option value="over_10000">Over K10,000</option>
                  <option value="no_income">No Regular Income</option>
                </select>
              </div>

              <div>
                <Label htmlFor="bankAccount">Bank Account</Label>
                <select
                  id="bankAccount"
                  value={censusData.employment.bankAccount}
                  onChange={(e) => handleCensusInputChange('employment', 'bankAccount', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <Label htmlFor="financialInstitution">Financial Institution</Label>
                <select
                  id="financialInstitution"
                  value={censusData.employment.financialInstitution}
                  onChange={(e) => handleCensusInputChange('employment', 'financialInstitution', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select bank</option>
                  <option value="bsp">Bank South Pacific (BSP)</option>
                  <option value="anz">ANZ PNG</option>
                  <option value="westpac">Westpac PNG</option>
                  <option value="maybank">Maybank</option>
                  <option value="postbank">Post PNG</option>
                  <option value="teachers_savings">Teachers Savings & Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Health Information</h3>
              <p className="text-gray-600">Health status and medical information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <select
                  id="bloodType"
                  value={censusData.health.bloodType}
                  onChange={(e) => handleCensusInputChange('health', 'bloodType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <Label htmlFor="disabilities">Disabilities/Impairments</Label>
                <select
                  id="disabilities"
                  value={censusData.health.disabilities}
                  onChange={(e) => handleCensusInputChange('health', 'disabilities', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="none">None</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="mobility">Mobility Impairment</option>
                  <option value="intellectual">Intellectual Disability</option>
                  <option value="mental_health">Mental Health Condition</option>
                  <option value="multiple">Multiple Disabilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="healthInsurance">Health Insurance</Label>
                <select
                  id="healthInsurance"
                  value={censusData.health.healthInsurance}
                  onChange={(e) => handleCensusInputChange('health', 'healthInsurance', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="government_scheme">Government Health Scheme</option>
                  <option value="employer_provided">Employer Provided</option>
                </select>
              </div>

              <div>
                <Label htmlFor="lastMedicalCheckup">Last Medical Checkup</Label>
                <select
                  id="lastMedicalCheckup"
                  value={censusData.health.lastMedicalCheckup}
                  onChange={(e) => handleCensusInputChange('health', 'lastMedicalCheckup', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select timeframe</option>
                  <option value="within_6_months">Within 6 months</option>
                  <option value="6_12_months">6-12 months ago</option>
                  <option value="1_2_years">1-2 years ago</option>
                  <option value="over_2_years">Over 2 years ago</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  value={censusData.health.allergies}
                  onChange={(e) => handleCensusInputChange('health', 'allergies', e.target.value)}
                  placeholder="List any known allergies"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="chronicConditions">Chronic Medical Conditions</Label>
                <Textarea
                  id="chronicConditions"
                  value={censusData.health.chronicConditions}
                  onChange={(e) => handleCensusInputChange('health', 'chronicConditions', e.target.value)}
                  placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">Phone, email and communication preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryPhone">Primary Phone Number *</Label>
                <Input
                  id="primaryPhone"
                  value={censusData.contact.primaryPhone}
                  onChange={(e) => handleCensusInputChange('contact', 'primaryPhone', e.target.value)}
                  placeholder="e.g., +675 7123 4567"
                />
              </div>

              <div>
                <Label htmlFor="secondaryPhone">Secondary Phone Number</Label>
                <Input
                  id="secondaryPhone"
                  value={censusData.contact.secondaryPhone}
                  onChange={(e) => handleCensusInputChange('contact', 'secondaryPhone', e.target.value)}
                  placeholder="Alternative phone number"
                />
              </div>

              <div>
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={censusData.contact.emailAddress}
                  onChange={(e) => handleCensusInputChange('contact', 'emailAddress', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <select
                  id="preferredContactMethod"
                  value={censusData.contact.preferredContactMethod}
                  onChange={(e) => handleCensusInputChange('contact', 'preferredContactMethod', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select method</option>
                  <option value="phone_call">Phone Call</option>
                  <option value="sms">SMS/Text Message</option>
                  <option value="email">Email</option>
                  <option value="in_person">In Person</option>
                  <option value="letter">Letter/Mail</option>
                </select>
              </div>

              <div>
                <Label htmlFor="communicationLanguage">Preferred Communication Language</Label>
                <select
                  id="communicationLanguage"
                  value={censusData.contact.communicationLanguage}
                  onChange={(e) => handleCensusInputChange('contact', 'communicationLanguage', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select language</option>
                  <option value="english">English</option>
                  <option value="tok_pisin">Tok Pisin</option>
                  <option value="hiri_motu">Hiri Motu</option>
                  <option value="local_language">Local Language</option>
                </select>
              </div>

              <div>
                <Label htmlFor="hearingImpairment">Hearing Impairment</Label>
                <select
                  id="hearingImpairment"
                  value={censusData.contact.hearingImpairment}
                  onChange={(e) => handleCensusInputChange('contact', 'hearingImpairment', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="none">No Impairment</option>
                  <option value="mild">Mild Hearing Loss</option>
                  <option value="moderate">Moderate Hearing Loss</option>
                  <option value="severe">Severe Hearing Loss</option>
                  <option value="deaf">Deaf</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Government Services</h3>
              <p className="text-gray-600">Existing government registrations and services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voterRegistration">Voter Registration</Label>
                <select
                  id="voterRegistration"
                  value={censusData.government.voterRegistration}
                  onChange={(e) => handleCensusInputChange('government', 'voterRegistration', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="yes">Yes, Registered</option>
                  <option value="no">Not Registered</option>
                  <option value="pending">Registration Pending</option>
                  <option value="ineligible">Not Eligible</option>
                </select>
              </div>

              <div>
                <Label htmlFor="driverLicense">Driver's License</Label>
                <select
                  id="driverLicense"
                  value={censusData.government.driverLicense}
                  onChange={(e) => handleCensusInputChange('government', 'driverLicense', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="yes">Yes, Current License</option>
                  <option value="expired">Expired License</option>
                  <option value="no">No License</option>
                  <option value="pending">Application Pending</option>
                </select>
              </div>

              <div>
                <Label htmlFor="taxFileNumber">Tax File Number (TIN)</Label>
                <Input
                  id="taxFileNumber"
                  value={censusData.government.taxFileNumber}
                  onChange={(e) => handleCensusInputChange('government', 'taxFileNumber', e.target.value)}
                  placeholder="Enter TIN if available"
                />
              </div>

              <div>
                <Label htmlFor="governmentEmployee">Government Employee</Label>
                <select
                  id="governmentEmployee"
                  value={censusData.government.governmentEmployee}
                  onChange={(e) => handleCensusInputChange('government', 'governmentEmployee', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="yes_national">Yes - National Government</option>
                  <option value="yes_provincial">Yes - Provincial Government</option>
                  <option value="yes_local">Yes - Local Government</option>
                  <option value="no">No</option>
                  <option value="retired">Retired Government Employee</option>
                </select>
              </div>

              <div>
                <Label htmlFor="socialServices">Receiving Social Services</Label>
                <select
                  id="socialServices"
                  value={censusData.government.socialServices}
                  onChange={(e) => handleCensusInputChange('government', 'socialServices', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="none">No Social Services</option>
                  <option value="disability_allowance">Disability Allowance</option>
                  <option value="elderly_allowance">Elderly Care Allowance</option>
                  <option value="welfare_assistance">Welfare Assistance</option>
                  <option value="food_assistance">Food Assistance</option>
                  <option value="multiple">Multiple Programs</option>
                </select>
              </div>

              <div>
                <Label htmlFor="militaryService">Military Service</Label>
                <select
                  id="militaryService"
                  value={censusData.government.militaryService}
                  onChange={(e) => handleCensusInputChange('government', 'militaryService', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select option</option>
                  <option value="none">No Military Service</option>
                  <option value="current_pngdf">Current PNGDF Member</option>
                  <option value="veteran_pngdf">PNGDF Veteran</option>
                  <option value="police">Police Force</option>
                  <option value="correctional">Correctional Service</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Cultural & Social Information</h3>
              <p className="text-gray-600">Cultural background and community involvement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="religion">Religion</Label>
                <select
                  id="religion"
                  value={censusData.cultural.religion}
                  onChange={(e) => handleCensusInputChange('cultural', 'religion', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select religion</option>
                  <option value="christianity_catholic">Christianity - Catholic</option>
                  <option value="christianity_protestant">Christianity - Protestant</option>
                  <option value="christianity_adventist">Christianity - Adventist</option>
                  <option value="christianity_pentecostal">Christianity - Pentecostal</option>
                  <option value="christianity_other">Christianity - Other</option>
                  <option value="traditional_beliefs">Traditional Beliefs</option>
                  <option value="other_religion">Other Religion</option>
                  <option value="no_religion">No Religion</option>
                  <option value="prefer_not_to_say">Prefer Not to Say</option>
                </select>
              </div>

              <div>
                <Label htmlFor="traditionalRoles">Traditional/Cultural Roles</Label>
                <Input
                  id="traditionalRoles"
                  value={censusData.cultural.traditionalRoles}
                  onChange={(e) => handleCensusInputChange('cultural', 'traditionalRoles', e.target.value)}
                  placeholder="e.g., Village Elder, Traditional Healer"
                />
              </div>

              <div>
                <Label htmlFor="communityLeadership">Community Leadership Roles</Label>
                <Input
                  id="communityLeadership"
                  value={censusData.cultural.communityLeadership}
                  onChange={(e) => handleCensusInputChange('cultural', 'communityLeadership', e.target.value)}
                  placeholder="e.g., Committee Member, Church Leader"
                />
              </div>

              <div>
                <Label htmlFor="artisanSkills">Traditional Artisan Skills</Label>
                <Input
                  id="artisanSkills"
                  value={censusData.cultural.artisanSkills}
                  onChange={(e) => handleCensusInputChange('cultural', 'artisanSkills', e.target.value)}
                  placeholder="e.g., Carving, Weaving, Pottery"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="culturalPractices">Important Cultural Practices</Label>
                <Textarea
                  id="culturalPractices"
                  value={censusData.cultural.culturalPractices}
                  onChange={(e) => handleCensusInputChange('cultural', 'culturalPractices', e.target.value)}
                  placeholder="Describe important cultural practices, ceremonies, or traditions"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="traditionalKnowledge">Traditional Knowledge</Label>
                <Textarea
                  id="traditionalKnowledge"
                  value={censusData.cultural.traditionalKnowledge}
                  onChange={(e) => handleCensusInputChange('cultural', 'traditionalKnowledge', e.target.value)}
                  placeholder="Traditional knowledge areas (medicine, agriculture, navigation, etc.)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
              <p className="text-gray-600">Review your information before submitting</p>
            </div>

            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all information carefully. Once submitted, your Digital ID will be processed
                  and you will receive your unique PNG Digital ID number.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Registration Summary</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {censusData.personalInfo.firstName} {censusData.personalInfo.lastName}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong> {censusData.personalInfo.dateOfBirth}
                  </div>
                  <div>
                    <strong>Province:</strong> {censusData.location.currentProvince}
                  </div>
                  <div>
                    <strong>Village:</strong> {censusData.location.currentVillage}
                  </div>
                  <div>
                    <strong>Primary Language:</strong> {censusData.education.primaryLanguage}
                  </div>
                  <div>
                    <strong>Employment:</strong> {censusData.employment.employmentStatus}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="rounded"
                  required
                />
                <label htmlFor="consent" className="text-sm">
                  I consent to the collection and processing of my personal information for
                  PNG Digital ID registration and government services purposes.
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dataSharing"
                  className="rounded"
                />
                <label htmlFor="dataSharing" className="text-sm">
                  I consent to sharing my census data with other government departments
                  for planning and service delivery purposes.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step {censusStep}</div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier1': return 'bg-blue-100 text-blue-800';
      case 'tier2': return 'bg-purple-100 text-purple-800';
      case 'tier3': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: users.length,
    verified: users.filter(u => u.status === 'verified').length,
    pending: users.filter(u => u.status === 'pending').length,
    activeToday: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            PNG Digital ID User Registry
          </h2>
          <p className="text-slate-600 mt-1">Manage and monitor all registered Digital ID users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  PNG National Census Registration
                </DialogTitle>
                <DialogDescription>
                  Complete census data collection for PNG Digital ID registration
                </DialogDescription>
              </DialogHeader>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Registration Progress</span>
                  <span className="text-sm text-gray-600">Step {censusStep} of {totalSteps}</span>
                </div>
                <Progress value={currentProgress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Personal</span>
                  <span>Location</span>
                  <span>Family</span>
                  <span>Education</span>
                  <span>Employment</span>
                  <span>Health</span>
                  <span>Contact</span>
                  <span>Government</span>
                  <span>Cultural</span>
                  <span>Review</span>
                </div>
              </div>

              {/* Step Content */}
              {renderCensusStep()}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={censusStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setCensusStep(1);
                    }}
                  >
                    Cancel
                  </Button>

                  {censusStep < totalSteps ? (
                    <Button onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitCensusRegistration}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Today</p>
                <p className="text-3xl font-bold text-purple-600">{stats.activeToday}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by ID, name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Tiers</option>
                <option value="tier1">Tier 1</option>
                <option value="tier2">Tier 2</option>
                <option value="tier3">Tier 3</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Complete list of PNG Digital ID users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">ID: {user.digitalId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{user.phone}</span>
                      <MapPin className="h-3 w-3 text-gray-400 ml-2" />
                      <span className="text-xs text-gray-500">{user.province}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status.toUpperCase()}
                  </Badge>
                  <Badge className={getTierColor(user.tier)}>
                    {user.tier.toUpperCase()}
                  </Badge>
                  {role === 'admin' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
