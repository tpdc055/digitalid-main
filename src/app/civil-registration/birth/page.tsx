"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  UserPlus,
  Search,
  Download,
  FileText,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Baby,
  Heart,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';

export default function BirthCertificateRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock birth registration data
  const birthRegistrations = [
    {
      id: 'BC2024001',
      childName: 'John Kaupa Jr.',
      parentNames: 'John Kaupa & Mary Temu',
      birthDate: '2024-01-15',
      birthPlace: 'Port Moresby General Hospital',
      registrationDate: '2024-01-20',
      status: 'approved',
      province: 'National Capital District',
      district: 'Port Moresby'
    },
    {
      id: 'BC2024002',
      childName: 'Sarah Wambi',
      parentNames: 'Peter Wambi & Grace Kila',
      birthDate: '2024-01-10',
      birthPlace: 'Lae General Hospital',
      registrationDate: '2024-01-18',
      status: 'pending',
      province: 'Morobe',
      district: 'Lae'
    },
    {
      id: 'BC2024003',
      childName: 'Michael Temu',
      parentNames: 'David Temu & Helen Natera',
      birthDate: '2024-01-08',
      birthPlace: 'Mt. Hagen Hospital',
      registrationDate: '2024-01-16',
      status: 'approved',
      province: 'Western Highlands',
      district: 'Mt. Hagen'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const stats = {
    total: birthRegistrations.length,
    approved: birthRegistrations.filter(b => b.status === 'approved').length,
    pending: birthRegistrations.filter(b => b.status === 'pending').length,
    thisMonth: birthRegistrations.length
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Baby className="h-8 w-8 text-blue-600" />
            Birth Certificate Registry
          </h1>
          <p className="text-slate-600 mt-2">
            Manage birth registrations and certificate issuance for Papua New Guinea
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Birth Registration
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates Issued</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
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
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search by certificate ID, child name, or parent names..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Birth Registration Records ({birthRegistrations.length})
          </CardTitle>
          <CardDescription>
            Complete list of birth certificate registrations and applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {birthRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{registration.childName}</h3>
                    <p className="text-sm text-gray-600">Certificate ID: {registration.id}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Parents: {registration.parentNames}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Born: {registration.birthDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {registration.birthPlace}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(registration.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(registration.status)}
                        {registration.status.toUpperCase()}
                      </span>
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Registered: {registration.registrationDate}
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
              <UserPlus className="h-5 w-5 text-blue-600" />
              New Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Register a new birth and initiate certificate processing
            </p>
            <Button className="w-full">
              Start Birth Registration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Verify the authenticity of an existing birth certificate
            </p>
            <Button variant="outline" className="w-full">
              Verify Certificate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Generate statistical reports and analytics
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
          Birth Certificate Registry system is operational. All services are available and
          connected to the PNG Civil Registration database.
        </AlertDescription>
      </Alert>
    </div>
  );
}
