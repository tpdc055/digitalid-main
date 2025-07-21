"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  User,
  FileText,
  Shield,
  CreditCard,
  MessageSquare,
  Settings,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Eye,
  Download,
  QrCode,
  Smartphone,
  Lock,
  Key,
  Fingerprint,
  Camera,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Share2,
  History,
  Database,
  Zap,
  Monitor,
  Users,
  Target,
  Headphones,
  Heart,
  GraduationCap,
  Car,
  Home,
  Briefcase,
  Globe,
  Wifi,
  Battery,
  Signal,
  Wallet,
  Building,
  Hospital,
  School,
  PersonStanding,
  Brain,
  Lightbulb,
  Sparkles,
  BarChart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import AIAssistant from '@/components/AI/AIAssistant';

export default function CitizenPortal() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCircles, setActiveCircles] = useState<string[]>([]);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [realTimeStatus, setRealTimeStatus] = useState('connected');
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [connectionStrength, setConnectionStrength] = useState(4);
  const [aiInsights, setAiInsights] = useState({
    fraudRisk: 'low',
    nextRecommendation: 'Complete healthcare checkup',
    systemOptimization: 98,
    personalizedTips: [
      'Your security score is excellent! Consider enabling location services for enhanced protection.',
      'Vaccination reminder: You have an appointment tomorrow at 10:00 AM.',
      'BSP PNG has new digital payment features available for your account.',
      'Tax season is approaching - ensure your employment records are up to date.'
    ]
  });

  // Enhanced Banking Integration
  const bankingServices = [
    {
      id: 'bsp',
      name: 'BSP PNG',
      logo: '🏛️',
      status: 'connected',
      accounts: 2,
      balance: 'K 2,450.75',
      services: ['Savings Account', 'Digital Payments', 'Loans']
    },
    {
      id: 'anz',
      name: 'ANZ PNG',
      logo: '🏦',
      status: 'pending',
      accounts: 0,
      balance: 'K 0.00',
      services: ['Account Opening', 'Credit Cards', 'Business Banking']
    },
    {
      id: 'westpac',
      name: 'Westpac PNG',
      logo: '🏪',
      status: 'available',
      accounts: 0,
      balance: 'K 0.00',
      services: ['Personal Banking', 'Mortgages', 'Investment']
    }
  ];

  // Real-time notifications with priority system
  const [liveNotifications, setLiveNotifications] = useState([
    {
      id: 1,
      title: 'BSP PNG Payment Received',
      message: 'Salary deposit of K 1,200.00 has been credited to your account',
      time: 'Just now',
      type: 'success',
      priority: 'high',
      category: 'banking',
      action: 'View Transaction'
    },
    {
      id: 2,
      title: 'Healthcare Appointment Reminder',
      message: 'Vaccination appointment tomorrow at 10:00 AM',
      time: '2 minutes ago',
      type: 'info',
      priority: 'high',
      category: 'healthcare',
      action: 'View Details'
    },
    {
      id: 3,
      title: 'Security Alert',
      message: 'Login from new device detected',
      time: '5 minutes ago',
      type: 'warning',
      priority: 'critical',
      category: 'security',
      action: 'Review Activity'
    },
    {
      id: 4,
      title: 'Document Ready',
      message: 'Your driver license renewal is ready for pickup',
      time: '15 minutes ago',
      type: 'success',
      priority: 'medium',
      category: 'transport',
      action: 'Download'
    }
  ]);

  // Real-time system monitoring
  useEffect(() => {
    const statusInterval = setInterval(() => {
      // Simulate real-time updates
      setBatteryLevel(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      setConnectionStrength(Math.floor(Math.random() * 5));

      // Simulate new notifications
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newNotification = {
          id: Date.now(),
          title: 'System Update',
          message: 'Your profile data has been synchronized',
          time: 'Just now',
          type: 'info',
          priority: 'low',
          category: 'system',
          action: 'Dismiss'
        };
        setLiveNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  // Dashboard Circles - PNG Government Services
  const dashboardCircles = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Biometric authentication & digital ID',
      icon: User,
      status: 'verified',
      completion: 100,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      metrics: { verificationLevel: 'Tier 3', securityScore: 98, lastVerified: '2 hours ago' }
    },
    {
      id: 'banking',
      title: 'Banking Services',
      description: 'BSP PNG, ANZ PNG, Westpac integration',
      icon: Wallet,
      status: 'connected',
      completion: 85,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      metrics: { accounts: 2, balance: 'K 2,450.75', recentTransaction: '+K 1,200.00' }
    },
    {
      id: 'healthcare',
      title: 'Healthcare Services',
      description: 'Medical records & appointments',
      icon: Heart,
      status: 'active',
      completion: 92,
      color: 'bg-gradient-to-br from-red-500 to-red-700',
      metrics: { appointments: 1, nextCheckup: 'Tomorrow 10:00 AM', vaccinations: 'Up to date' }
    },
    {
      id: 'education',
      title: 'Education Services',
      description: 'UPNG & academic records',
      icon: GraduationCap,
      status: 'enrolled',
      completion: 78,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      metrics: { institution: 'UPNG', degree: 'Bachelor of Science', gpa: '3.8' }
    },
    {
      id: 'transport',
      title: 'Transport & Licensing',
      description: 'Driver license & vehicle registration',
      icon: Car,
      status: 'licensed',
      completion: 95,
      color: 'bg-gradient-to-br from-orange-500 to-orange-700',
      metrics: { license: 'Class B', expiry: '2025-12-15', violations: 'None' }
    },
    {
      id: 'property',
      title: 'Property & Land',
      description: 'Land titles & property registration',
      icon: Home,
      status: 'registered',
      completion: 67,
      color: 'bg-gradient-to-br from-teal-500 to-teal-700',
      metrics: { properties: 1, title: 'Verified', value: 'K 450,000' }
    },
    {
      id: 'employment',
      title: 'Employment & Tax',
      description: 'IRC registration & employment records',
      icon: Briefcase,
      status: 'employed',
      completion: 88,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      metrics: { employer: 'Government of PNG', taxStatus: 'Compliant', salary: 'K 1,200/month' }
    },
    {
      id: 'social',
      title: 'Social Services',
      description: 'Welfare & community programs',
      icon: Users,
      status: 'active',
      completion: 72,
      color: 'bg-gradient-to-br from-pink-500 to-pink-700',
      metrics: { programs: 2, benefits: 'K 150/month', community: 'Port Moresby District' }
    }
  ];

  // Auto-activate circles with animation delay
  useEffect(() => {
    const activateWithDelay = async () => {
      for (let i = 0; i < dashboardCircles.length; i++) {
        setTimeout(() => {
          setActiveCircles(prev => [...prev, dashboardCircles[i].id]);
        }, i * 300); // Staggered activation
      }
    };

    const timer = setTimeout(activateWithDelay, 1000);
    return () => clearTimeout(timer);
  }, []);

  const activateCircle = (circleId: string) => {
    if (!activeCircles.includes(circleId)) {
      setActiveCircles([...activeCircles, circleId]);
    }
  };

  const deactivateCircle = (circleId: string) => {
    setActiveCircles(activeCircles.filter(id => id !== circleId));
  };

  const getCircleStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'secure': return 'text-purple-600';
      case 'connected': return 'text-emerald-600';
      case 'enrolled': return 'text-indigo-600';
      case 'licensed': return 'text-orange-600';
      case 'registered': return 'text-teal-600';
      case 'employed': return 'text-cyan-600';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Real-time Status */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PNG Digital ID Dashboard</h1>
              <p className="text-gray-600">Citizen Portal - Comprehensive Government Services</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Real-time status indicators */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">System Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <Battery className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">{batteryLevel}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full">
                <Signal className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-700">{connectionStrength}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Main Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* AI Insights Banner */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">AI Insights & Recommendations</h3>
                      <p className="text-blue-100">{aiInsights.nextRecommendation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{aiInsights.systemOptimization}%</div>
                    <p className="text-sm text-blue-100">System Optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Live Notifications
                  <Badge className="bg-red-500">
                    {liveNotifications.filter(n => n.priority === 'critical').length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {liveNotifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {notification.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Dashboard Circles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCircles.map((circle, index) => {
                const IconComponent = circle.icon;
                const isActive = activeCircles.includes(circle.id);

                return (
                  <Card
                    key={circle.id}
                    className={`relative overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-xl ${
                      isActive ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => isActive ? deactivateCircle(circle.id) : activateCircle(circle.id)}
                  >
                    <div className={`absolute inset-0 ${circle.color} opacity-10`}></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${circle.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={getCircleStatusColor(circle.status)}>
                          {circle.status}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{circle.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{circle.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span className="font-medium">{circle.completion}%</span>
                        </div>
                        <Progress value={circle.completion} className="h-2" />
                      </div>

                      {isActive && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="space-y-2">
                            {Object.entries(circle.metrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="capitalize text-gray-600">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                          <Button size="sm" className="w-full mt-3">
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Access Service
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {bankingServices.map((bank) => (
                <Card key={bank.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{bank.logo}</span>
                      {bank.name}
                      <Badge className={
                        bank.status === 'connected' ? 'bg-green-500' :
                        bank.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'
                      }>
                        {bank.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Accounts:</span>
                        <span className="font-medium">{bank.accounts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-medium text-green-600">{bank.balance}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Available Services:</p>
                        <div className="space-y-1">
                          {bank.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 mb-1">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        variant={bank.status === 'connected' ? 'default' : 'outline'}
                      >
                        {bank.status === 'connected' ? 'Manage Account' : 'Connect Bank'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Vaccination Appointment</h4>
                          <p className="text-sm text-gray-600">Port Moresby General Hospital</p>
                          <p className="text-sm text-blue-600">Tomorrow, 10:00 AM</p>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Blood Test Results</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Vaccination Records</span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Biometric Authentication</h4>
                      <p className="text-sm text-gray-600">Use fingerprint/face ID for login</p>
                    </div>
                    <Switch
                      checked={biometricEnabled}
                      onCheckedChange={setBiometricEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">SMS verification for sensitive actions</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Location Services</h4>
                      <p className="text-sm text-gray-600">Enable location-based security</p>
                    </div>
                    <Switch
                      checked={locationEnabled}
                      onCheckedChange={setLocationEnabled}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-gray-900">John Doe</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Digital ID</label>
                    <p className="text-gray-900">PNG-2024-123456</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-900">john.doe@gov.pg</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-gray-900">+675 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Services</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <BarChart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Connections</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Security Score</p>
                      <p className="text-2xl font-bold">98%</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant Component */}
      <AIAssistant />
    </div>
  );
}
