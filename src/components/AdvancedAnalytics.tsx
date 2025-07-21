"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Brain,
  Target,
  Zap,
  Database,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalyticsMetrics {
  realTime: {
    activeUsers: number;
    currentSessions: number;
    requestsPerMinute: number;
    responseTime: number;
    errorRate: number;
  };
  usage: {
    totalApplications: number;
    completedApplications: number;
    averageProcessingTime: number;
    userSatisfactionScore: number;
    topServices: ServiceMetric[];
  };
  security: {
    threatsBlocked: number;
    securityScore: number;
    vulnerabilitiesFound: number;
    complianceScore: number;
    encryptionCoverage: number;
  };
  predictions: {
    nextMonthApplications: number;
    expectedGrowthRate: number;
    capacityUtilization: number;
    maintenanceNeeded: string[];
    riskAreas: RiskPrediction[];
  };
}

interface ServiceMetric {
  name: string;
  requests: number;
  growth: number;
  satisfaction: number;
}

interface RiskPrediction {
  area: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  mitigation: string;
}

interface TimeSeriesData {
  time: string;
  applications: number;
  users: number;
  security: number;
  performance: number;
}

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const { t } = useLanguage();

  // Sample data - in production this would come from real analytics APIs
  const timeSeriesData: TimeSeriesData[] = [
    { time: '00:00', applications: 45, users: 120, security: 98, performance: 95 },
    { time: '04:00', applications: 32, users: 85, security: 97, performance: 92 },
    { time: '08:00', applications: 125, users: 340, security: 99, performance: 88 },
    { time: '12:00', applications: 180, users: 450, security: 98, performance: 90 },
    { time: '16:00', applications: 165, users: 380, security: 96, performance: 87 },
    { time: '20:00', applications: 89, users: 220, security: 98, performance: 93 }
  ];

  const serviceDistribution = [
    { name: 'Birth Certificate', value: 35, color: '#3b82f6' },
    { name: 'Passport', value: 25, color: '#10b981' },
    { name: 'Business License', value: 20, color: '#f59e0b' },
    { name: 'Vehicle Registration', value: 12, color: '#ef4444' },
    { name: 'Other Services', value: 8, color: '#8b5cf6' }
  ];

  const complianceFrameworks = [
    { framework: 'DGA 2022', current: 94, target: 95, trend: 2.1 },
    { framework: 'ISO 27001', current: 91, target: 93, trend: 1.8 },
    { framework: 'SOC 2', current: 88, target: 90, trend: 3.2 },
    { framework: 'GDPR', current: 96, target: 98, trend: 1.2 }
  ];

  const predictiveModels = [
    {
      name: 'Application Volume Prediction',
      accuracy: 87.3,
      lastTrained: '2024-01-15',
      nextPrediction: 'Peak expected in Q2 2024'
    },
    {
      name: 'Security Threat Detection',
      accuracy: 94.1,
      lastTrained: '2024-01-18',
      nextPrediction: 'No significant threats predicted'
    },
    {
      name: 'Compliance Risk Assessment',
      accuracy: 89.7,
      lastTrained: '2024-01-10',
      nextPrediction: 'Minor updates needed for ISO compliance'
    }
  ];

  const performanceMetrics = [
    { category: 'Response Time', value: 125, target: 200, unit: 'ms', status: 'good' },
    { category: 'Uptime', value: 99.8, target: 99.5, unit: '%', status: 'excellent' },
    { category: 'Throughput', value: 1250, target: 1000, unit: 'req/min', status: 'excellent' },
    { category: 'Error Rate', value: 0.2, target: 0.5, unit: '%', status: 'good' },
    { category: 'User Satisfaction', value: 4.7, target: 4.5, unit: '/5', status: 'excellent' }
  ];

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockMetrics: AnalyticsMetrics = {
        realTime: {
          activeUsers: 1247,
          currentSessions: 3456,
          requestsPerMinute: 1250,
          responseTime: 125,
          errorRate: 0.2
        },
        usage: {
          totalApplications: 28500,
          completedApplications: 26340,
          averageProcessingTime: 3.2,
          userSatisfactionScore: 4.7,
          topServices: [
            { name: 'Birth Certificate', requests: 9975, growth: 12.3, satisfaction: 4.8 },
            { name: 'Passport Application', requests: 7125, growth: 8.7, satisfaction: 4.6 },
            { name: 'Business License', requests: 5700, growth: 15.2, satisfaction: 4.5 },
            { name: 'Vehicle Registration', requests: 3420, growth: -2.1, satisfaction: 4.3 },
            { name: 'Education Verification', requests: 2280, growth: 22.8, satisfaction: 4.9 }
          ]
        },
        security: {
          threatsBlocked: 156,
          securityScore: 94,
          vulnerabilitiesFound: 3,
          complianceScore: 92,
          encryptionCoverage: 98
        },
        predictions: {
          nextMonthApplications: 32400,
          expectedGrowthRate: 13.7,
          capacityUtilization: 78,
          maintenanceNeeded: ['Database optimization', 'SSL certificate renewal'],
          riskAreas: [
            {
              area: 'Peak Traffic Handling',
              risk: 'medium',
              probability: 65,
              impact: 3,
              mitigation: 'Scale infrastructure during peak hours'
            },
            {
              area: 'Data Backup Recovery',
              risk: 'low',
              probability: 15,
              impact: 4,
              mitigation: 'Regular backup testing scheduled'
            }
          ]
        }
      };

      setMetrics(mockMetrics);
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    loadAnalytics();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Advanced Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Predictive insights and real-time monitoring for PNG Government Portal
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.realTime.activeUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Sessions</p>
                <p className="text-2xl font-bold text-green-600">{metrics.realTime.currentSessions.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Requests/Min</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.realTime.requestsPerMinute}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.realTime.responseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">{metrics.realTime.errorRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time System Metrics</CardTitle>
                <CardDescription>Live performance and usage data</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Applications" />
                    <Line type="monotone" dataKey="users" stroke="#10b981" name="Users" />
                    <Line type="monotone" dataKey="security" stroke="#ef4444" name="Security Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Service Usage Distribution</CardTitle>
                <CardDescription>Popular government services</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }: { name: string; percent?: number }) =>
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Critical system metrics and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium text-slate-600">{metric.category}</p>
                    <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}{metric.unit}
                    </p>
                    <p className="text-xs text-slate-500">Target: {metric.target}{metric.unit}</p>
                    <div className="mt-2">
                      <Progress
                        value={(metric.value / metric.target) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle>Service Performance Analytics</CardTitle>
              <CardDescription>Detailed metrics for each government service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.usage.topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-slate-600">{service.requests.toLocaleString()} requests</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Growth</p>
                        <div className="flex items-center gap-1">
                          {service.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={service.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(service.growth)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Rating</p>
                        <p className="font-medium">{service.satisfaction}/5.0</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns & Trends</CardTitle>
              <CardDescription>User behavior and service utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Line type="monotone" dataKey="users" stroke="#10b981" name="Active Users" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance Overview</CardTitle>
              <CardDescription>Multi-dimensional performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Current"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
                <CardDescription>API response times by endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { endpoint: '/api/applications', time: 125, requests: 450 },
                    { endpoint: '/api/auth/login', time: 89, requests: 320 },
                    { endpoint: '/api/documents', time: 156, requests: 280 },
                    { endpoint: '/api/payments', time: 203, requests: 190 },
                    { endpoint: '/api/status', time: 67, requests: 520 }
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm">{api.endpoint}</p>
                        <p className="text-xs text-slate-500">{api.requests} requests</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{api.time}ms</p>
                        <div className="w-20">
                          <Progress value={(200 - api.time) / 2} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>System resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { resource: 'CPU Usage', value: 68, limit: 80, unit: '%' },
                    { resource: 'Memory Usage', value: 52, limit: 70, unit: '%' },
                    { resource: 'Disk I/O', value: 34, limit: 60, unit: '%' },
                    { resource: 'Network Bandwidth', value: 45, limit: 80, unit: '%' },
                    { resource: 'Database Connections', value: 156, limit: 200, unit: '' }
                  ].map((resource, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm">
                        <span>{resource.resource}</span>
                        <span>{resource.value}{resource.unit} / {resource.limit}{resource.unit}</span>
                      </div>
                      <Progress value={(resource.value / resource.limit) * 100} className="mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{metrics.security.securityScore}%</p>
                <p className="text-sm text-slate-600">Security Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-orange-600">{metrics.security.threatsBlocked}</p>
                <p className="text-sm text-slate-600">Threats Blocked</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">{metrics.security.encryptionCoverage}%</p>
                <p className="text-sm text-slate-600">Encryption Coverage</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-600">{metrics.security.complianceScore}%</p>
                <p className="text-sm text-slate-600">Compliance Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Framework Status */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Framework Monitoring</CardTitle>
              <CardDescription>Real-time compliance tracking for regulatory frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceFrameworks.map((framework, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{framework.framework}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={framework.current >= framework.target ? 'default' : 'secondary'}>
                          {framework.current >= framework.target ? 'Compliant' : 'Action Needed'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 text-sm">+{framework.trend}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={framework.current} className="mb-1" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Current: {framework.current}%</span>
                          <span>Target: {framework.target}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* AI Predictions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-600">{metrics.predictions.nextMonthApplications.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Predicted Applications Next Month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{metrics.predictions.expectedGrowthRate}%</p>
                <p className="text-sm text-slate-600">Expected Growth Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">{metrics.predictions.capacityUtilization}%</p>
                <p className="text-sm text-slate-600">Capacity Utilization</p>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Models */}
          <Card>
            <CardHeader>
              <CardTitle>AI Predictive Models</CardTitle>
              <CardDescription>Machine learning models for system optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveModels.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{model.name}</h4>
                      <Badge variant="outline">{model.accuracy}% accuracy</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{model.nextPrediction}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Last trained: {model.lastTrained}</span>
                      <span>•</span>
                      <span>Accuracy: {model.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Predictive Risk Assessment</CardTitle>
              <CardDescription>AI-powered risk identification and mitigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.predictions.riskAreas.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.area}</h4>
                      <Badge className={getRiskColor(risk.risk)}>
                        {risk.risk.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-slate-600">Probability</p>
                        <div className="flex items-center gap-2">
                          <Progress value={risk.probability} className="flex-1" />
                          <span className="text-sm">{risk.probability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Impact Level</p>
                        <div className="flex items-center gap-2">
                          <Progress value={risk.impact * 20} className="flex-1" />
                          <span className="text-sm">{risk.impact}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Recommended Mitigation:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-200">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
