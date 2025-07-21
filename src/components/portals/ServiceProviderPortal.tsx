"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building,
  Database,
  Code,
  Activity,
  Key,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Server,
  Zap,
  Globe,
  Link,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Eye,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ServiceProviderPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const apiUsageData = [
    { time: '00:00', requests: 120, success: 118, errors: 2 },
    { time: '04:00', requests: 85, success: 83, errors: 2 },
    { time: '08:00', requests: 340, success: 335, errors: 5 },
    { time: '12:00', requests: 450, success: 442, errors: 8 },
    { time: '16:00', requests: 380, success: 375, errors: 5 },
    { time: '20:00', requests: 220, success: 218, errors: 2 }
  ];

  const integrationData = [
    { month: 'Jan', volume: 12000, latency: 145 },
    { month: 'Feb', volume: 15600, latency: 135 },
    { month: 'Mar', volume: 18900, latency: 128 },
    { month: 'Apr', volume: 22300, latency: 120 },
    { month: 'May', volume: 25800, latency: 115 },
    { month: 'Jun', volume: 28500, latency: 110 }
  ];

  const apiEndpoints = [
    {
      name: 'Citizen Verification API',
      endpoint: '/api/v1/citizens/verify',
      method: 'POST',
      status: 'active',
      uptime: 99.8,
      requestsToday: 1250,
      avgLatency: 120
    },
    {
      name: 'Document Validation API',
      endpoint: '/api/v1/documents/validate',
      method: 'POST',
      status: 'active',
      uptime: 99.5,
      requestsToday: 890,
      avgLatency: 95
    },
    {
      name: 'Service Application API',
      endpoint: '/api/v1/applications',
      method: 'POST',
      status: 'active',
      uptime: 99.9,
      requestsToday: 340,
      avgLatency: 200
    },
    {
      name: 'Payment Processing API',
      endpoint: '/api/v1/payments',
      method: 'POST',
      status: 'maintenance',
      uptime: 0,
      requestsToday: 0,
      avgLatency: 0
    },
    {
      name: 'Status Inquiry API',
      endpoint: '/api/v1/status/{id}',
      method: 'GET',
      status: 'active',
      uptime: 99.7,
      requestsToday: 2100,
      avgLatency: 85
    }
  ];

  const webhooks = [
    {
      id: 'WH001',
      name: 'Application Status Update',
      url: 'https://partner.example.com/webhooks/status',
      events: ['application.approved', 'application.rejected', 'application.processing'],
      status: 'active',
      lastTriggered: '2024-01-20 10:30:00'
    },
    {
      id: 'WH002',
      name: 'Payment Confirmation',
      url: 'https://partner.example.com/webhooks/payment',
      events: ['payment.completed', 'payment.failed'],
      status: 'active',
      lastTriggered: '2024-01-20 09:15:00'
    },
    {
      id: 'WH003',
      name: 'Document Ready',
      url: 'https://partner.example.com/webhooks/documents',
      events: ['document.ready', 'document.expired'],
      status: 'failed',
      lastTriggered: '2024-01-19 14:22:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Service Provider Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Service Provider Dashboard
              </CardTitle>
              <CardDescription>
                Monitor your integration performance and API usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4,580</div>
                  <div className="text-sm text-slate-600">API Requests Today</div>
                  <div className="text-xs text-green-600">+15% from yesterday</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-slate-600">API Uptime</div>
                  <div className="text-xs text-green-600">Above SLA</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">115ms</div>
                  <div className="text-sm text-slate-600">Avg Response Time</div>
                  <div className="text-xs text-green-600">-5ms this week</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">28.5K</div>
                  <div className="text-sm text-slate-600">Monthly Volume</div>
                  <div className="text-xs text-green-600">+22% growth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Usage Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Usage (24 Hours)</CardTitle>
                <CardDescription>Request volume and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" name="Total Requests" />
                    <Line type="monotone" dataKey="success" stroke="#10b981" name="Successful" />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" name="Errors" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly volume and latency trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={integrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#3b82f6" name="Volume" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints Status */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Monitor the status and performance of all API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{endpoint.name}</div>
                          <div className="text-sm text-slate-600 font-mono">
                            {endpoint.method} {endpoint.endpoint}
                          </div>
                        </div>
                        {getStatusBadge(endpoint.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Uptime</div>
                        <div className="font-medium">{endpoint.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Requests Today</div>
                        <div className="font-medium">{endpoint.requestsToday.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Avg Latency</div>
                        <div className="font-medium">{endpoint.avgLatency}ms</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Performance</div>
                        <Progress value={endpoint.uptime} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest integration events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">API Health Check Passed</div>
                    <div className="text-sm text-slate-600">All endpoints responding normally</div>
                  </div>
                  <div className="text-xs text-slate-600">2 min ago</div>
                </div>
                <div className="flex items-center gap-3 p-3 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">High Traffic Alert</div>
                    <div className="text-sm text-slate-600">Requests increased by 25% in last hour</div>
                  </div>
                  <div className="text-xs text-slate-600">15 min ago</div>
                </div>
                <div className="flex items-center gap-3 p-3 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <div className="flex-1">
                    <div className="font-medium">Webhook Failure</div>
                    <div className="text-sm text-slate-600">Document Ready webhook failed - retrying</div>
                  </div>
                  <div className="text-xs text-slate-600">1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Integration
              </CardTitle>
              <CardDescription>
                Manage your API keys, endpoints, and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">API Base URL</label>
                  <div className="flex gap-2">
                    <Input value="https://api.gov.pg/v1" readOnly />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("https://api.gov.pg/v1")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Environment</label>
                  <Input value="Production" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </span>
                <Button className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Generate New Key
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your API authentication keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Production API Key</div>
                      <div className="text-sm text-slate-600">Created: Jan 15, 2024</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input value="sk_prod_••••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("sk_prod_1234567890abcdef")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Last used: Today at 10:30 AM • Rate limit: 1000 req/min
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Development API Key</div>
                      <div className="text-sm text-slate-600">Created: Jan 10, 2024</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Development</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input value="sk_dev_••••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("sk_dev_abcdef1234567890")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Last used: Yesterday at 3:45 PM • Rate limit: 100 req/min
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Webhooks
                </span>
                <Button className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Add Webhook
                </Button>
              </CardTitle>
              <CardDescription>
                Configure webhook endpoints for real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{webhook.name}</div>
                        <div className="text-sm text-slate-600 font-mono">{webhook.url}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(webhook.status)}
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium mb-1">Events:</div>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      Last triggered: {webhook.lastTriggered}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Integration Examples
              </CardTitle>
              <CardDescription>
                Sample code and implementation guides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Citizen Verification Example</div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(`curl -X POST https://api.gov.pg/v1/citizens/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "citizen_id": "CID-123456789",
    "verification_type": "identity"
  }'`)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-slate-600 overflow-x-auto">
{`curl -X POST https://api.gov.pg/v1/citizens/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "citizen_id": "CID-123456789",
    "verification_type": "identity"
  }'`}
                </pre>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Document Validation Example</div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(`curl -X POST https://api.gov.pg/v1/documents/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_id": "DOC-987654321",
    "document_type": "birth_certificate"
  }'`)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-slate-600 overflow-x-auto">
{`curl -X POST https://api.gov.pg/v1/documents/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_id": "DOC-987654321",
    "document_type": "birth_certificate"
  }'`}
                </pre>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Full Documentation
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download SDK
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
