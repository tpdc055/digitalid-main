"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Car,
  Search,
  Download,
  FileText,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Plus,
  Eye,
  Edit,
  Filter,
  Shield,
  Settings,
  CreditCard,
  DollarSign,
  Fuel
} from 'lucide-react';

export default function MotorVehicleRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock vehicle registration data
  const vehicleRegistrations = [
    {
      id: 'LAE123',
      registrationNumber: 'LAE 123',
      ownerName: 'John Kaupa',
      make: 'Toyota',
      model: 'Hilux',
      year: 2023,
      vehicleType: 'Light Commercial Vehicle',
      color: 'White',
      engineNumber: 'EN2023001',
      chassisNumber: 'CH2023001',
      registrationDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'current',
      province: 'Morobe',
      district: 'Lae',
      roadworthyExpiry: '2024-12-15',
      insuranceExpiry: '2024-10-15',
      fuelType: 'Petrol'
    },
    {
      id: 'POM456',
      registrationNumber: 'POM 456',
      ownerName: 'Mary Temu',
      make: 'Mitsubishi',
      model: 'Pajero',
      year: 2022,
      vehicleType: 'Passenger Vehicle',
      color: 'Silver',
      engineNumber: 'EN2022002',
      chassisNumber: 'CH2022002',
      registrationDate: '2023-12-10',
      expiryDate: '2024-12-10',
      status: 'expired',
      province: 'National Capital District',
      district: 'Port Moresby',
      roadworthyExpiry: '2024-06-10',
      insuranceExpiry: '2024-08-10',
      fuelType: 'Diesel'
    },
    {
      id: 'MAD789',
      registrationNumber: 'MAD 789',
      ownerName: 'Peter Wambi',
      make: 'Isuzu',
      model: 'NPR',
      year: 2021,
      vehicleType: 'Heavy Commercial Vehicle',
      color: 'Blue',
      engineNumber: 'EN2021003',
      chassisNumber: 'CH2021003',
      registrationDate: '2024-01-08',
      expiryDate: '2025-01-08',
      status: 'current',
      province: 'Madang',
      district: 'Madang',
      roadworthyExpiry: '2024-11-08',
      insuranceExpiry: '2024-09-08',
      fuelType: 'Diesel'
    },
    {
      id: 'MOR321',
      registrationNumber: 'MOR 321',
      ownerName: 'David Natera',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      vehicleType: 'Passenger Vehicle',
      color: 'Red',
      engineNumber: 'EN2020004',
      chassisNumber: 'CH2020004',
      registrationDate: '2023-11-20',
      expiryDate: '2024-11-20',
      status: 'suspended',
      province: 'Morobe',
      district: 'Lae',
      roadworthyExpiry: '2024-05-20',
      insuranceExpiry: '2024-07-20',
      fuelType: 'Petrol'
    }
  ];

  const vehicleTypes = [
    'Passenger Vehicle',
    'Light Commercial Vehicle',
    'Heavy Commercial Vehicle',
    'Motorcycle',
    'Bus',
    'Truck',
    'Trailer',
    'Special Purpose Vehicle',
    'Agricultural Vehicle',
    'Construction Vehicle'
  ];

  const vehicleMakes = [
    'Toyota', 'Mitsubishi', 'Nissan', 'Isuzu', 'Honda', 'Mazda', 'Ford',
    'Hyundai', 'Kia', 'Suzuki', 'Daihatsu', 'Volkswagen', 'BMW', 'Mercedes-Benz'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'suspended': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getVehicleIcon = (type: string) => {
    if (type.includes('Commercial') || type.includes('Truck')) {
      return <Truck className="h-6 w-6 text-blue-600" />;
    }
    return <Car className="h-6 w-6 text-blue-600" />;
  };

  const stats = {
    total: vehicleRegistrations.length,
    current: vehicleRegistrations.filter(v => v.status === 'current').length,
    expired: vehicleRegistrations.filter(v => v.status === 'expired').length,
    suspended: vehicleRegistrations.filter(v => v.status === 'suspended').length
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Car className="h-8 w-8 text-blue-600" />
            Motor Vehicle Registry
          </h1>
          <p className="text-slate-600 mt-2">
            Manage vehicle registrations and transport permits for Papua New Guinea
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Registry
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Vehicle Registration
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Registration</p>
                <p className="text-3xl font-bold text-green-600">{stats.current}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-orange-600">{stats.suspended}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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
                  placeholder="Search by registration number, owner name, or chassis number..."
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
                <option value="current">Current</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                {vehicleTypes.map(type => (
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

      {/* Vehicle Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle Registration Records ({vehicleRegistrations.length})
          </CardTitle>
          <CardDescription>
            Complete registry of motor vehicle registrations and permits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicleRegistrations.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getVehicleIcon(vehicle.vehicleType)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {vehicle.registrationNumber} - {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">Owner: {vehicle.ownerName}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {vehicle.vehicleType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        Engine: {vehicle.engineNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Chassis: {vehicle.chassisNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        {vehicle.fuelType}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.district}, {vehicle.province}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Registration Expires: {vehicle.expiryDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Roadworthy: {vehicle.roadworthyExpiry}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(vehicle.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(vehicle.status)}
                        {vehicle.status.toUpperCase()}
                      </span>
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Color: {vehicle.color}
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
              New Vehicle Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Register a new vehicle or transfer ownership
            </p>
            <Button className="w-full">
              Start Registration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Vehicle Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Verify vehicle registration and ownership
            </p>
            <Button variant="outline" className="w-full">
              Verify Vehicle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Vehicle Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Generate vehicle statistics and compliance reports
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
          Motor Vehicle Registry system is operational. All services are connected to the
          PNG Motor Vehicle Insurance Board and relevant transport authorities.
        </AlertDescription>
      </Alert>
    </div>
  );
}
