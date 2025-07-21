"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Users,
  FileText,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Server,
  Lock,
  UserCheck,
  UserX,
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const systemStats = [
    { name: 'Jan', users: 1200, applications: 450, services: 12 },
    { name: 'Feb', users: 1350, applications: 520, services: 13 },
    { name: 'Mar', users: 1480, applications: 680, services: 14 },
    { name: 'Apr', users: 1620, applications: 750, services: 15 },
    { name: 'May', users: 1750, applications: 890, services: 16 },
    { name: 'Jun', users: 1890, applications: 920, services: 17 }
  ];

  const recentUsers = [
    { id: 'USR001', name: 'John Doe', email: 'john.doe@email.com', status: 'active', registered: '2024-01-20' },
    { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@email.com', status: 'pending', registered: '2024-01-19' },
    { id: 'USR003', name: 'Mike Johnson', email: 'mike.j@email.com', status: 'active', registered: '2024-01-18' },
    { id: 'USR004', name: 'Sarah Wilson', email: 'sarah.w@email.com', status: 'suspended', registered: '2024-01-17' },
    { id: 'USR005', name: 'David Brown', email: 'david.b@email.com', status: 'active', registered: '2024-01-16' }
  ];

  const services = [
    {
      id: 'SRV001',
      name: 'Birth Certificate',
      status: 'active',
      applications: 245,
      avgProcessingTime: '5.2 days',
      successRate: 98
    },
    {
      id: 'SRV002',
      name: 'Passport Application',
      status: 'active',
      applications: 156,
      avgProcessingTime: '18.5 days',
      successRate: 95
    },
    {
      id: 'SRV003',
      name: 'Business License',
      status: 'active',
      applications: 89,
      avgProcessingTime: '12.1 days',
      successRate: 97
    },
    {
      id: 'SRV004',
      name: 'Vehicle Registration',
      status: 'maintenance',
      applications: 0,
      avgProcessingTime: 'N/A',
      successRate: 0
    },
    {
      id: 'SRV005',
      name: 'Education Verification',
      status: 'active',
      applications: 67,
      avgProcessingTime: '2.8 days',
      successRate: 99
    }
  ];

  const pendingApplications = [
    { id: 'APP001', user: 'John Doe', service: 'Passport Application', submitted: '2024-01-20', priority: 'high' },
    { id: 'APP002', user: 'Jane Smith', service: 'Birth Certificate', submitted: '2024-01-19', priority: 'medium' },
    { id: 'APP003', user: 'Mike Johnson', service: 'Business License', submitted: '2024-01-18', priority: 'low' },
    { id: 'APP004', user: 'Sarah Wilson', service: 'Education Verification', submitted: '2024-01-17', priority: 'medium' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Admin Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administrator Dashboard
              </CardTitle>
              <CardDescription>
                System overview and management console
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,890</div>
                  <div className="text-sm text-slate-600">Total Users</div>
                  <div className="text-xs text-green-600">+12% this month</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">920</div>
                  <div className="text-sm text-slate-600">Applications</div>
                  <div className="text-xs text-green-600">+8% this month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">17</div>
                  <div className="text-sm text-slate-600">Active Services</div>
                  <div className="text-xs text-green-600">+1 new service</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">97%</div>
                  <div className="text-sm text-slate-600">System Uptime</div>
                  <div className="text-xs text-green-600">99.8% SLA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={systemStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Volume</CardTitle>
                <CardDescription>Monthly application submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={systemStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users and Pending Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Users</span>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.slice(0, 4).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Applications</span>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>Applications requiring review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{app.service}</div>
                        <div className="text-sm text-slate-600">{app.user}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(app.priority)}
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {/* Admin Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administrator Profile
              </CardTitle>
              <CardDescription>
                Manage your administrative account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input value="Admin User" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Employee ID</label>
                  <Input value="ADM-001" readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input value="admin@gov.pg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Input value="Digital Government Services" />
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Admin Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>Your administrative privileges and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">User Management</div>
                    <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                  </div>
                  <div className="text-sm text-slate-600">Create, read, update, delete users</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Service Management</div>
                    <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                  </div>
                  <div className="text-sm text-slate-600">Manage all government services</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Application Review</div>
                    <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                  </div>
                  <div className="text-sm text-slate-600">Review and approve applications</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">System Settings</div>
                    <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                  </div>
                  <div className="text-sm text-slate-600">Configure system parameters</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Enhanced security for administrative access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Multi-Factor Authentication</div>
                  <div className="text-sm text-slate-600">Hardware token + SMS backup</div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">IP Restriction</div>
                  <div className="text-sm text-slate-600">Access limited to office network</div>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-sm text-slate-600">Automatic logout after 30 minutes</div>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <Button variant="outline">Configure Security</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* Service Management Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Service Management</span>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Service
                </Button>
              </CardTitle>
              <CardDescription>
                Manage government services and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search services..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
              <CardDescription>Monitor and manage all government services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-slate-600">Service ID: {service.id}</div>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Applications</div>
                        <div className="font-medium">{service.applications}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Avg Processing</div>
                        <div className="font-medium">{service.avgProcessingTime}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Success Rate</div>
                        <div className="font-medium">{service.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Performance</div>
                        <Progress value={service.successRate} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>Performance metrics and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={systemStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="services" fill="#10b981" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
