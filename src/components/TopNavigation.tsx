"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  User,
  Settings,
  ChevronDown,
  Home,
  UserCircle,
  Building,
  LogOut,
  Bell,
  Globe,
  Database,
  Users,
  FileText,
  Search,
  BarChart3,
  Lock,
  Eye,
  UserPlus,
  Fingerprint,
  CreditCard,
  Activity,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  MapPin,
  Calendar,
  Settings2,
  Archive,
  Clipboard,
  UserCheck,
  Heart,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Scale,
  Car,
  Anchor,
  Plane,
  DollarSign,
  Calculator
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface TopNavProps {
  currentPortal?: 'citizen' | 'admin' | 'service-provider';
  onPortalChange?: (portal: 'citizen' | 'admin' | 'service-provider') => void;
}

export default function TopNavigation({
  currentPortal = 'citizen',
  onPortalChange = () => {}
}: TopNavProps) {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showRegistryDropdown, setShowRegistryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const portalConfigs = {
    citizen: {
      name: "Citizen Portal",
      icon: User,
      color: "bg-blue-600",
      description: "Digital identity and government services for PNG citizens"
    },
    admin: {
      name: "Admin Portal",
      icon: Shield,
      color: "bg-red-600",
      description: "Administrative oversight and system management"
    },
    "service-provider": {
      name: "Service Provider Portal",
      icon: Building,
      color: "bg-green-600",
      description: "Integration platform for government service providers"
    }
  };

  const languageConfig = {
    en: { name: 'English', flag: '🇬🇧' },
    tpi: { name: 'Tok Pisin', flag: '🇵🇬' },
    ho: { name: 'Hiri Motu', flag: '🇵🇬' }
  };

  // Registry System Submodules - Complete Classification
  const registryModules = [
    // CORE REGISTRY SYSTEMS
    {
      id: 'user-registry',
      name: 'Digital ID Registry',
      description: 'Manage registered Digital ID users',
      icon: Users,
      path: '/digital-id',
      category: 'Core Registry'
    },
    {
      id: 'census-management',
      name: 'National Census Registry',
      description: 'Population and demographic data management',
      icon: BarChart3,
      path: '/census-management',
      category: 'Core Registry'
    },
    {
      id: 'biometric-registry',
      name: 'Biometric Registry',
      description: 'Biometric data and verification systems',
      icon: Fingerprint,
      path: '/biometric-registry',
      category: 'Core Registry'
    },

    // CIVIL REGISTRATION SYSTEM
    {
      id: 'birth-registry',
      name: 'Birth Certificate Registry',
      description: 'Birth registration and certificate management',
      icon: UserPlus,
      path: '/civil-registration/birth',
      category: 'Civil Registration'
    },
    {
      id: 'death-registry',
      name: 'Death Certificate Registry',
      description: 'Death registration and certificate management',
      icon: UserCheck,
      path: '/civil-registration/death',
      category: 'Civil Registration'
    },
    {
      id: 'marriage-registry',
      name: 'Marriage Certificate Registry',
      description: 'Marriage registration and certificate management',
      icon: Heart,
      path: '/civil-registration/marriage',
      category: 'Civil Registration'
    },
    {
      id: 'divorce-registry',
      name: 'Divorce Registry',
      description: 'Divorce registration and legal documentation',
      icon: FileText,
      path: '/civil-registration/divorce',
      category: 'Civil Registration'
    },

    // IDENTITY MANAGEMENT REGISTRY
    {
      id: 'national-id-registry',
      name: 'National ID Registry',
      description: 'PNG National Identity Card management',
      icon: CreditCard,
      path: '/identity/national-id',
      category: 'Identity Management'
    },
    {
      id: 'passport-registry',
      name: 'Passport Registry',
      description: 'PNG Passport issuance and management',
      icon: Globe,
      path: '/identity/passport',
      category: 'Identity Management'
    },
    {
      id: 'voter-registry',
      name: 'Voter Registration',
      description: 'Electoral roll and voter registration',
      icon: CheckCircle,
      path: '/identity/voter',
      category: 'Identity Management'
    },
    {
      id: 'foreign-resident-registry',
      name: 'Foreign Resident Registry',
      description: 'Foreign nationals and resident permits',
      icon: Users,
      path: '/identity/foreign-residents',
      category: 'Identity Management'
    },

    // BUSINESS & COMMERCE REGISTRY
    {
      id: 'business-license-registry',
      name: 'Business License Registry',
      description: 'Business licensing and permits',
      icon: Building,
      path: '/business/licenses',
      category: 'Business & Commerce'
    },
    {
      id: 'company-registry',
      name: 'Company Registration',
      description: 'Corporate entities and company registration',
      icon: Briefcase,
      path: '/business/companies',
      category: 'Business & Commerce'
    },
    {
      id: 'trademark-registry',
      name: 'Trade Mark Registry',
      description: 'Intellectual property and trademark protection',
      icon: Shield,
      path: '/business/trademarks',
      category: 'Business & Commerce'
    },
    {
      id: 'patent-registry',
      name: 'Patent Registry',
      description: 'Patent applications and intellectual property',
      icon: Settings,
      path: '/business/patents',
      category: 'Business & Commerce'
    },

    // PROPERTY & LAND REGISTRY
    {
      id: 'land-title-registry',
      name: 'Land Title Registry',
      description: 'Land ownership and title management',
      icon: MapPin,
      path: '/property/land-titles',
      category: 'Property & Land'
    },
    {
      id: 'property-transfer-registry',
      name: 'Property Transfer Registry',
      description: 'Property sales and ownership transfers',
      icon: RefreshCw,
      path: '/property/transfers',
      category: 'Property & Land'
    },
    {
      id: 'mining-claims-registry',
      name: 'Mining Claims Registry',
      description: 'Mining permits and exploration rights',
      icon: Archive,
      path: '/property/mining',
      category: 'Property & Land'
    },
    {
      id: 'forestry-permits-registry',
      name: 'Forestry Permits Registry',
      description: 'Logging permits and forest management',
      icon: Settings2,
      path: '/property/forestry',
      category: 'Property & Land'
    },

    // PROFESSIONAL & LICENSING REGISTRY
    {
      id: 'healthcare-professional-registry',
      name: 'Healthcare Professional Registry',
      description: 'Medical practitioner licensing and certification',
      icon: Stethoscope,
      path: '/professional/healthcare',
      category: 'Professional Licensing'
    },
    {
      id: 'legal-professional-registry',
      name: 'Legal Professional Registry',
      description: 'Lawyer and legal practitioner registration',
      icon: Scale,
      path: '/professional/legal',
      category: 'Professional Licensing'
    },
    {
      id: 'education-professional-registry',
      name: 'Education Professional Registry',
      description: 'Teacher registration and certification',
      icon: GraduationCap,
      path: '/professional/education',
      category: 'Professional Licensing'
    },
    {
      id: 'trade-license-registry',
      name: 'Trade License Registry',
      description: 'Skilled trades and occupational licensing',
      icon: Settings,
      path: '/professional/trades',
      category: 'Professional Licensing'
    },

    // VEHICLE & TRANSPORT REGISTRY
    {
      id: 'motor-vehicle-registry',
      name: 'Motor Vehicle Registry',
      description: 'Vehicle registration and ownership records',
      icon: Car,
      path: '/transport/vehicles',
      category: 'Vehicle & Transport'
    },
    {
      id: 'driver-license-registry',
      name: 'Driver License Registry',
      description: 'Driver licensing and traffic violations',
      icon: CreditCard,
      path: '/transport/drivers',
      category: 'Vehicle & Transport'
    },
    {
      id: 'maritime-vessel-registry',
      name: 'Maritime Vessel Registry',
      description: 'Ship and boat registration',
      icon: Anchor,
      path: '/transport/maritime',
      category: 'Vehicle & Transport'
    },
    {
      id: 'aircraft-registry',
      name: 'Aircraft Registry',
      description: 'Aircraft registration and aviation permits',
      icon: Plane,
      path: '/transport/aircraft',
      category: 'Vehicle & Transport'
    },

    // GOVERNMENT SERVICES REGISTRY
    {
      id: 'public-servant-registry',
      name: 'Public Servant Registry',
      description: 'Government employee records and management',
      icon: Users,
      path: '/government/public-servants',
      category: 'Government Services'
    },
    {
      id: 'government-contract-registry',
      name: 'Government Contract Registry',
      description: 'Public contracts and procurement records',
      icon: FileText,
      path: '/government/contracts',
      category: 'Government Services'
    },
    {
      id: 'grant-aid-registry',
      name: 'Grant & Aid Registry',
      description: 'Government grants and financial assistance',
      icon: DollarSign,
      path: '/government/grants',
      category: 'Government Services'
    },
    {
      id: 'tax-registry',
      name: 'Tax Registry',
      description: 'Tax identification and revenue records',
      icon: Calculator,
      path: '/government/tax',
      category: 'Government Services'
    },

    // SYSTEM MANAGEMENT
    {
      id: 'agent-enrollment',
      name: 'Agent Enrollment',
      description: 'Government agent registration interface',
      icon: UserPlus,
      path: '/agent-enrollment',
      category: 'System Management'
    },
    {
      id: 'offline-registration',
      name: 'Offline Registration',
      description: 'Mobile unit and offline registration',
      icon: RefreshCw,
      path: '/offline-registration',
      category: 'System Management'
    },
    {
      id: 'document-verification',
      name: 'Document Verification',
      description: 'Document authentication and validation',
      icon: FileText,
      path: '/document-verification',
      category: 'System Management'
    },
    {
      id: 'search-lookup',
      name: 'Search & Lookup',
      description: 'Advanced citizen and record search',
      icon: Search,
      path: '/search-lookup',
      category: 'System Management'
    },

    // ANALYTICS & REPORTING
    {
      id: 'registration-analytics',
      name: 'Registration Analytics',
      description: 'Registration statistics and insights',
      icon: Activity,
      path: '/registration-analytics',
      category: 'Analytics & Reporting'
    },
    {
      id: 'data-export',
      name: 'Data Export & Reports',
      description: 'Generate reports and export data',
      icon: Download,
      path: '/data-export',
      category: 'Analytics & Reporting'
    },
    {
      id: 'audit-compliance',
      name: 'Audit & Compliance',
      description: 'System audits and compliance monitoring',
      icon: CheckCircle,
      path: '/admin-oversight',
      category: 'Analytics & Reporting'
    },

    // INTEGRATION & SYSTEM
    {
      id: 'api-integration',
      name: 'API Integration',
      description: 'Third-party service integration platform',
      icon: Settings2,
      path: '/api-integration',
      category: 'Integration & System'
    },
    {
      id: 'system-monitoring',
      name: 'System Monitoring',
      description: 'Real-time system health and performance',
      icon: Eye,
      path: '/system-monitoring',
      category: 'Integration & System'
    },
    {
      id: 'backup-recovery',
      name: 'Backup & Recovery',
      description: 'Data backup and disaster recovery',
      icon: Archive,
      path: '/backup-recovery',
      category: 'Integration & System'
    }
  ];

  // Group modules by category
  const groupedModules = registryModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof registryModules>);

  const currentConfig = portalConfigs[currentPortal];
  const CurrentIcon = currentConfig.icon;

  return (
    <nav className="bg-gradient-to-r from-red-600 via-black to-yellow-500 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-white">
                Enhanced Security Framework
              </span>
            </Link>

            {/* Registry System - Primary Menu */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowRegistryDropdown(!showRegistryDropdown)}
                className="flex items-center gap-2 bg-red-500 border-red-400 text-white hover:bg-red-600 font-medium px-4 py-2">
                <Database className="h-4 w-4" />
                Registry System
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showRegistryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">PNG National Registry System</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Comprehensive citizen and data management</p>
                  </div>

                  {Object.entries(groupedModules).map(([category, modules]) => (
                    <div key={category} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          {category}
                        </span>
                      </div>
                      {modules.map((module) => {
                        const ModuleIcon = module.icon;
                        return (
                          <Link
                            key={module.id}
                            href={module.path}
                            onClick={() => setShowRegistryDropdown(false)}
                            className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                              <ModuleIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {module.name}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {module.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}

                  <div className="p-3 bg-slate-50 dark:bg-slate-700">
                    <Link
                      href="/digital-id"
                      onClick={() => setShowRegistryDropdown(false)}
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <UserCheck className="h-4 w-4" />
                      Open Registry Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentConfig.color}`} />
                <CurrentIcon className="h-4 w-4" />
                {currentConfig.name}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showPortalDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                  {Object.entries(portalConfigs).map(([key, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onPortalChange(key as any);
                          setShowPortalDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                          currentPortal === key ? 'bg-slate-50 dark:bg-slate-700' : ''
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${config.color}`} />
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{config.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Language, Notifications and User */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{languageConfig[language].flag}</span>
                <span className="hidden md:inline">{languageConfig[language].name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                  {Object.entries(languageConfig).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code as Language);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg ${
                        language === code ? 'bg-slate-50 dark:bg-slate-700' : ''
                      }`}
                    >
                      <span className="text-lg">{config.flag}</span>
                      <span className="font-medium">{config.name}</span>
                      {code === 'tpi' && <span className="text-xs text-slate-500">(Tok Pisin)</span>}
                      {code === 'ho' && <span className="text-xs text-slate-500">(Hiri Motu)</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span>John Doe</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">john.doe@gov.pg</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <hr className="my-1 border-slate-200 dark:border-slate-700" />
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-red-600">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
