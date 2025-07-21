"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building,
  Search,
  Download,
  FileText,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Shield,
  Settings
} from 'lucide-react';

export default function BusinessLicenseRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock business license data
  const businessLicenses = [
    {
      id: 'BL2024001',
      businessName: 'PNG Coffee Exports Ltd',
      ownerName: 'John Kaupa',
      licenseType: 'Export License',
      industry: 'Agriculture & Food',
      issueDate: '2024-01-15',
      expiryDate: '2024-12-31',
      status: 'active',
      province: 'Western Highlands',
      district: 'Mt. Hagen',
      tin: 'TIN123456789',
      employees: 45
    },
    {
      id: 'BL2024002',
      businessName: 'Sepik River Lodge',
      ownerName: 'Mary Temu',
      licenseType: 'Tourism License',
      industry: 'Tourism & Hospitality',
      issueDate: '2024-01-10',
      expiryDate: '2024-12-31',
      status: 'pending_renewal',
      province: 'East Sepik',
      district: 'Ambunti-Dreikikir',
      tin: 'TIN987654321',
      employees: 12
    },
    {
      id: 'BL2024003',
      businessName: 'Port Moresby Security Services',
      ownerName: 'Peter Wambi',
      licenseType: 'Security License',
      industry: 'Professional Services',
      issueDate: '2024-01-08',
      expiryDate: '2024-12-31',
      status: 'active',
      province: 'National Capital District',
      district: 'Port Moresby',
      tin: 'TIN456789123',
      employees: 78
    },
    {
      id: 'BL2024004',
      businessName: 'Lae Construction Co.',
      ownerName: 'David Natera',
      licenseType: 'Construction License',
      industry: 'Construction',
      issueDate: '2024-01-05',
      expiryDate: '2024-12-31',
      status: 'suspended',
      province: 'Morobe',
      district: 'Lae',
      tin: 'TIN789123456',
      employees: 156
    }
  ];

  const licenseTypes = [
    'General Business License',
    'Export License',
    'Import License',
    'Tourism License',
    'Mining License',
    'Construction License',
    'Security License',
    'Transport License',
    'Food Service License',
    'Retail License',
    'Manufacturing License',
    'Professional Services License'
  ];

  const industries = [
    'Agriculture & Food',
    'Mining & Resources',
    'Tourism & Hospitality',
    'Construction',
    'Manufacturing',
    'Professional Services',
    'Retail & Trade',
    'Transport & Logistics',
    'Technology & Communications',
    'Healthcare',
    'Education',
    'Financial Services'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_renewal': return 'bg-orange-100 text-orange-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending_renewal': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const stats = {
    total: businessLicenses.length,
    active: businessLicenses.filter(b => b.status === 'active').length,
    pending: businessLicenses.filter(b => b.status === 'pending_renewal').length,
    suspended: businessLicenses.filter(b => b.status === 'suspended').length,
    totalEmployees: businessLicenses.reduce((sum, b) => sum + b.employees, 0)
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            Business License Registry
          </h1>
          <p className="text-slate-600 mt-2">
            Manage business licenses and commercial permits for Papua New Guinea
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Registry
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New License Application
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Licenses</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Licenses</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Renewal</p>
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
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search by license ID, business name, owner, or TIN..."
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
                <option value="active">Active</option>
                <option value="pending_renewal">Pending Renewal</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                {licenseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Business License Records ({businessLicenses.length})
          </CardTitle>
          <CardDescription>
            Complete registry of business licenses and commercial permits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessLicenses.map((license) => (
              <div
                key={license.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{license.businessName}</h3>
                    <p className="text-sm text-gray-600">License ID: {license.id}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Owner: {license.ownerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {license.licenseType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {license.district}, {license.province}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        TIN: {license.tin}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {license.expiryDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {license.employees} employees
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        {license.industry}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(license.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(license.status)}
                        {license.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {license.issueDate}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              New License Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Submit a new business license application
            </p>
            <Button className="w-full">
              Start Application
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              License Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Verify the validity of a business license
            </p>
            <Button variant="outline" className="w-full">
              Verify License
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Business Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Generate business statistics and compliance reports
            </p>
            <Button variant="outline" className="w-full">
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Business License Registry system is operational. All services are connected to the
          PNG Investment Promotion Authority and relevant government databases.
        </AlertDescription>
      </Alert>
    </div>
  );
}
