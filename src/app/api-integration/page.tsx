"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Key,
  Shield,
  Code,
  Settings,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Activity,
  Database,
  Lock,
  Unlock,
  FileText,
  Download,
  Upload,
  Link as LinkIcon,
  Server,
  Users,
  Zap,
  Building,
  CreditCard,
  Hospital,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function APIIntegrationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    description: '',
    type: 'web_application',
    redirectUris: '',
    scopes: []
  });

  const [apiClients, setApiClients] = useState([
    {
      id: 'client_001',
      name: 'BSP PNG Banking API',
      description: 'Bank of South Pacific digital identity verification',
      type: 'web_application',
      clientId: 'bsp_png_api_client',
      clientSecret: '••••••••••••••••',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-20T14:22:00Z',
      requestsToday: 1456,
      requestsTotal: 89234,
      scopes: ['identity:read', 'verification:create', 'biometric:verify'],
      redirectUris: ['https://api.bsp.com.pg/callback', 'https://portal.bsp.com.pg/auth/callback'],
      webhooks: ['https://api.bsp.com.pg/webhooks/identity']
    },
    {
      id: 'client_002',
      name: 'PNG Health Department',
      description: 'Ministry of Health patient identity verification',
      type: 'server_to_server',
      clientId: 'health_dept_api',
      clientSecret: '••••••••••••••••',
      status: 'active',
      createdAt: '2024-01-10T09:15:00Z',
      lastUsed: '2024-01-20T11:45:00Z',
      requestsToday: 892,
      requestsTotal: 45678,
      scopes: ['identity:read', 'health:verify'],
      redirectUris: ['https://health.gov.pg/auth/callback'],
      webhooks: ['https://health.gov.pg/webhooks/verify']
    },
    {
      id: 'client_003',
      name: 'UPNG Student Portal',
      description: 'University of Papua New Guinea student verification',
      type: 'single_page_app',
      clientId: 'upng_student_portal',
      clientSecret: null,
      status: 'active',
      createdAt: '2024-01-08T14:20:00Z',
      lastUsed: '2024-01-20T16:30:00Z',
      requestsToday: 234,
      requestsTotal: 12345,
      scopes: ['identity:read', 'education:verify'],
      redirectUris: ['https://portal.upng.ac.pg/auth/callback'],
      webhooks: []
    },
    {
      id: 'client_004',
      name: 'ANZ PNG Digital Banking',
      description: 'ANZ Papua New Guinea digital banking services',
      type: 'web_application',
      clientId: 'anz_png_banking',
      clientSecret: '••••••••••••••••',
      status: 'pending',
      createdAt: '2024-01-18T11:00:00Z',
      lastUsed: null,
      requestsToday: 0,
      requestsTotal: 0,
      scopes: ['identity:read', 'verification:create'],
      redirectUris: ['https://digital.anz.com.pg/callback'],
      webhooks: []
    }
  ]);

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/identity/verify',
      description: 'Verify citizen identity using Digital ID',
      rateLimit: '1000/hour',
      authRequired: true,
      scopes: ['identity:read', 'verification:create']
    },
    {
      method: 'GET',
      path: '/api/v1/identity/profile',
      description: 'Get basic identity profile information',
      rateLimit: '5000/hour',
      authRequired: true,
      scopes: ['identity:read']
    },
    {
      method: 'POST',
      path: '/api/v1/biometric/verify',
      description: 'Verify biometric data against Digital ID',
      rateLimit: '500/hour',
      authRequired: true,
      scopes: ['biometric:verify']
    },
    {
      method: 'POST',
      path: '/api/v1/consent/request',
      description: 'Request user consent for data sharing',
      rateLimit: '2000/hour',
      authRequired: true,
      scopes: ['consent:manage']
    },
    {
      method: 'GET',
      path: '/api/v1/attributes',
      description: 'Get specific user attributes with consent',
      rateLimit: '3000/hour',
      authRequired: true,
      scopes: ['attributes:read']
    }
  ];

  const apiStats = {
    totalRequests: 147892,
    requestsToday: 2582,
    activeClients: 3,
    pendingClients: 1,
    averageResponseTime: 145,
    successRate: 99.7,
    errorRate: 0.3,
    dailyQuota: 10000,
    usedQuota: 2582
  };

  const availableScopes = [
    { name: 'identity:read', description: 'Read basic identity information' },
    { name: 'verification:create', description: 'Create identity verification requests' },
    { name: 'biometric:verify', description: 'Verify biometric data' },
    { name: 'attributes:read', description: 'Read specific user attributes' },
    { name: 'consent:manage', description: 'Manage user consent preferences' },
    { name: 'health:verify', description: 'Healthcare identity verification' },
    { name: 'education:verify', description: 'Education identity verification' },
    { name: 'banking:verify', description: 'Banking identity verification' }
  ];

  const recentActivity = [
    {
      timestamp: '2024-01-20T14:22:00Z',
      client: 'BSP PNG Banking API',
      action: 'Identity Verification',
      result: 'Success',
      responseTime: 142
    },
    {
      timestamp: '2024-01-20T14:20:00Z',
      client: 'PNG Health Department',
      action: 'Biometric Verification',
      result: 'Success',
      responseTime: 98
    },
    {
      timestamp: '2024-01-20T14:18:00Z',
      client: 'UPNG Student Portal',
      action: 'Profile Access',
      result: 'Success',
      responseTime: 156
    },
    {
      timestamp: '2024-01-20T14:15:00Z',
      client: 'BSP PNG Banking API',
      action: 'Consent Request',
      result: 'Failed',
      responseTime: 302
    }
  ];

  const handleNewClientSubmit = () => {
    const clientId = `${newClient.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    const clientSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const client = {
      id: `client_${Date.now()}`,
      ...newClient,
      clientId,
      clientSecret: newClient.type === 'single_page_app' ? null : clientSecret,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requestsToday: 0,
      requestsTotal: 0,
      redirectUris: newClient.redirectUris.split('\n').filter(uri => uri.trim()),
      webhooks: []
    };

    setApiClients(prev => [...prev, client]);
    setNewClient({
      name: '',
      description: '',
      type: 'web_application',
      redirectUris: '',
      scopes: []
    });
    setShowNewClientForm(false);
    alert('API client created successfully!');
  };

  const generateApiKey = (clientId) => {
    const newSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, clientSecret: newSecret }
          : client
      )
    );
    alert('New API key generated successfully!');
  };

  const toggleClientStatus = (clientId) => {
    setApiClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, status: client.status === 'active' ? 'suspended' : 'active' }
          : client
      )
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTypeIcon = (type) => {
    switch (type) {
      case 'web_application': return Globe;
      case 'single_page_app': return Code;
      case 'server_to_server': return Server;
      default: return Globe;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
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
              <h1 className="text-3xl font-bold text-slate-900">API Integration Platform</h1>
              <p className="text-slate-600">Third-party service integration with OAuth 2.0 and OpenID Connect</p>
            </div>
          </div>

          {/* API Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">API Requests Today</p>
                    <p className="text-2xl font-bold text-blue-600">{apiStats.requestsToday.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Quota: {apiStats.usedQuota}/{apiStats.dailyQuota}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold text-green-600">{apiStats.activeClients}</p>
                  </div>
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {apiStats.pendingClients} pending approval
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-emerald-600">{apiStats.successRate}%</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Avg response: {apiStats.averageResponseTime}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-purple-600">{apiStats.totalRequests.toLocaleString()}</p>
                  </div>
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  All time
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">API Clients</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Start Integration
                </CardTitle>
                <CardDescription>
                  Get started with PNG Digital ID API in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3">
                      <Key className="h-6 w-6 text-blue-600 mx-auto mt-1.5" />
                    </div>
                    <h3 className="font-medium mb-2">1. Register Your App</h3>
                    <p className="text-sm text-gray-600">Create an API client and get your credentials</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3">
                      <Shield className="h-6 w-6 text-green-600 mx-auto mt-1.5" />
                    </div>
                    <h3 className="font-medium mb-2">2. Implement OAuth</h3>
                    <p className="text-sm text-gray-600">Set up OAuth 2.0 authentication flow</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3">
                      <Database className="h-6 w-6 text-purple-600 mx-auto mt-1.5" />
                    </div>
                    <h3 className="font-medium mb-2">3. Call APIs</h3>
                    <p className="text-sm text-gray-600">Start verifying identities and accessing data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partner Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Integrated Partner Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Banking Services</h4>
                      <p className="text-sm text-gray-600">BSP PNG, ANZ PNG</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Hospital className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Healthcare</h4>
                      <p className="text-sm text-gray-600">Ministry of Health</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Education</h4>
                      <p className="text-sm text-gray-600">UPNG, Schools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent API Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${activity.result === 'Success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="font-medium text-sm">{activity.action}</div>
                          <div className="text-xs text-gray-600">{activity.client}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{new Date(activity.timestamp).toLocaleTimeString()}</div>
                        <div>{activity.responseTime}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">API Clients</h2>
              <Button onClick={() => setShowNewClientForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New API Client
              </Button>
            </div>

            {/* New Client Form */}
            {showNewClientForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Register New API Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Application Name</Label>
                      <Input
                        id="clientName"
                        value={newClient.name}
                        onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., My Banking App"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientType">Application Type</Label>
                      <select
                        id="clientType"
                        value={newClient.type}
                        onChange={(e) => setNewClient(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="web_application">Web Application</option>
                        <option value="single_page_app">Single Page App</option>
                        <option value="server_to_server">Server to Server</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="clientDescription">Description</Label>
                      <Input
                        id="clientDescription"
                        value={newClient.description}
                        onChange={(e) => setNewClient(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of your application"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="redirectUris">Redirect URIs (one per line)</Label>
                      <textarea
                        id="redirectUris"
                        value={newClient.redirectUris}
                        onChange={(e) => setNewClient(prev => ({ ...prev, redirectUris: e.target.value }))}
                        placeholder="https://yourapp.com/callback"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleNewClientSubmit}>Create Client</Button>
                    <Button variant="outline" onClick={() => setShowNewClientForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client List */}
            <div className="grid gap-4">
              {apiClients.map((client) => {
                const IconComponent = getClientTypeIcon(client.type);
                return (
                  <Card key={client.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(client.status)}>
                            {client.status.toUpperCase()}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleClientStatus(client.id)}
                          >
                            {client.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Client ID</div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 p-1 rounded">{client.clientId}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(client.clientId)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {client.clientSecret && (
                          <div>
                            <div className="text-sm font-medium mb-1">Client Secret</div>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 p-1 rounded">{client.clientSecret}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => generateApiKey(client.id)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Requests Today</div>
                          <div className="text-blue-600 font-bold">{client.requestsToday.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Total Requests</div>
                          <div className="text-gray-600">{client.requestsTotal.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Last Used</div>
                          <div className="text-gray-600">
                            {client.lastUsed ? new Date(client.lastUsed).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Scopes</div>
                        <div className="flex flex-wrap gap-1">
                          {client.scopes.map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* API Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Available API Endpoints
                </CardTitle>
                <CardDescription>
                  RESTful API endpoints for Digital ID integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }>
                          {endpoint.method}
                        </Badge>
                        <code className="font-mono text-sm">{endpoint.path}</code>
                        {endpoint.authRequired && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Rate limit: {endpoint.rateLimit}</span>
                        <span>Scopes: {endpoint.scopes.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  API Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Getting Started</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-blue-600" />
                        <a href="#" className="text-blue-600 hover:underline">API Quick Start Guide</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-blue-600" />
                        <a href="#" className="text-blue-600 hover:underline">OAuth 2.0 Implementation Guide</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-blue-600" />
                        <a href="#" className="text-blue-600 hover:underline">OpenAPI Specification</a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">SDKs & Libraries</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <a href="#" className="text-green-600 hover:underline">JavaScript SDK</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <a href="#" className="text-green-600 hover:underline">Python SDK</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <a href="#" className="text-green-600 hover:underline">PHP SDK</a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
