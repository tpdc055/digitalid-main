"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Eye,
  Phone,
  Mail,
  User,
  Shield,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Star,
  Flag,
  Headphones,
  Calendar,
  Search
} from 'lucide-react';
import Link from 'next/link';
import TopNavigation from '@/components/TopNavigation';

export default function GrievancePage() {
  const [activeTab, setActiveTab] = useState('submit');
  const [grievanceForm, setGrievanceForm] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    attachments: [],
    contactMethod: 'email'
  });
  const [myGrievances, setMyGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const grievanceCategories = [
    { value: 'identity_verification', label: 'Identity Verification Issues', description: 'Problems with identity verification process' },
    { value: 'credential_access', label: 'Credential Access Problems', description: 'Unable to access or use digital credentials' },
    { value: 'privacy_concerns', label: 'Privacy & Data Protection', description: 'Concerns about data privacy and protection' },
    { value: 'technical_issues', label: 'Technical Problems', description: 'System errors, bugs, or technical difficulties' },
    { value: 'service_quality', label: 'Service Quality', description: 'Poor service experience or delays' },
    { value: 'billing_payment', label: 'Billing & Payment', description: 'Issues with fees, payments, or billing' },
    { value: 'unauthorized_access', label: 'Security Concerns', description: 'Unauthorized access or security breaches' },
    { value: 'feature_request', label: 'Feature Request', description: 'Suggestions for new features or improvements' },
    { value: 'other', label: 'Other Issues', description: 'Issues not covered by other categories' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', description: 'General inquiry or minor issue', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Priority', description: 'Service disruption or moderate issue', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', description: 'Significant service problem', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', description: 'Critical security or access issue', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    // Mock data for user's grievances
    const mockGrievances = [
      {
        id: 'GRV20240001',
        category: 'technical_issues',
        subject: 'Unable to download QR code',
        description: 'The QR code download button is not working when I try to save my Digital ID QR code.',
        priority: 'medium',
        status: 'in_progress',
        submittedAt: '2024-01-18T10:30:00Z',
        updatedAt: '2024-01-19T14:22:00Z',
        expectedResolution: '2024-01-22T17:00:00Z',
        assignedTo: 'Technical Support Team',
        responses: [
          {
            from: 'Technical Support',
            message: 'Thank you for reporting this issue. We have identified the problem and are working on a fix.',
            timestamp: '2024-01-19T14:22:00Z'
          }
        ]
      },
      {
        id: 'GRV20240002',
        category: 'service_quality',
        subject: 'Long verification wait time',
        description: 'My Tier 3 verification has been pending for over 2 weeks, which is longer than the promised timeframe.',
        priority: 'high',
        status: 'resolved',
        submittedAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-15T16:45:00Z',
        resolvedAt: '2024-01-15T16:45:00Z',
        assignedTo: 'Verification Team',
        resolution: 'Your verification has been completed. The delay was due to additional security checks required for your application.',
        satisfaction: 4
      }
    ];

    setMyGrievances(mockGrievances);
  }, []);

  const handleFormChange = (field, value) => {
    setGrievanceForm(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!grievanceForm.category) newErrors.category = 'Please select a category';
    if (!grievanceForm.subject.trim()) newErrors.subject = 'Subject is required';
    if (!grievanceForm.description.trim()) newErrors.description = 'Description is required';
    if (grievanceForm.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitGrievance = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      const newGrievanceId = `GRV${new Date().getFullYear()}${String(Date.now()).slice(-4)}`;
      const newGrievance = {
        id: newGrievanceId,
        ...grievanceForm,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        expectedResolution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days
      };

      setMyGrievances(prev => [newGrievance, ...prev]);
      setSubmitSuccess(true);
      setGrievanceForm({
        category: '',
        subject: '',
        description: '',
        priority: 'medium',
        attachments: [],
        contactMethod: 'email'
      });
      setLoading(false);

      // Auto switch to tracking tab
      setTimeout(() => {
        setActiveTab('track');
        setSubmitSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.color : 'bg-gray-100 text-gray-800';
  };

  const renderSubmitForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit New Grievance
          </CardTitle>
          <CardDescription>
            Report issues, request support, or provide feedback about PNG Digital ID services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitSuccess && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Grievance Submitted Successfully!</AlertTitle>
              <AlertDescription>
                Your grievance has been submitted and assigned a tracking ID. You will receive email updates on the progress.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <Label htmlFor="category">Issue Category *</Label>
              <select
                id="category"
                value={grievanceForm.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Select a category</option>
                {grievanceCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {grievanceForm.category && (
                <p className="text-sm text-gray-600 mt-1">
                  {grievanceCategories.find(c => c.value === grievanceForm.category)?.description}
                </p>
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Priority Level */}
            <div>
              <Label>Priority Level</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {priorityLevels.map((priority) => (
                  <div
                    key={priority.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      grievanceForm.priority === priority.value
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFormChange('priority', priority.value)}
                  >
                    <div className="font-medium text-sm">{priority.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{priority.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={grievanceForm.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                className="mt-1"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={grievanceForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Please provide a detailed description of your issue, including what happened, when it occurred, and any error messages you received."
                rows={5}
                className="mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                {grievanceForm.description.length}/1000 characters
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Preferred Contact Method */}
            <div>
              <Label>Preferred Contact Method</Label>
              <div className="flex gap-4 mt-2">
                {[
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'sms', label: 'SMS', icon: MessageSquare },
                  { value: 'phone', label: 'Phone Call', icon: Phone }
                ].map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={method.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                        grievanceForm.contactMethod === method.value
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleFormChange('contactMethod', method.value)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm">{method.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG, DOC (max 5MB each)
                </p>
                <Button variant="outline" className="mt-2">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={submitGrievance}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Grievance
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrackGrievances = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            My Grievances
          </CardTitle>
          <CardDescription>
            Track the status and progress of your submitted grievances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myGrievances.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Grievances Submitted</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any grievances yet.</p>
              <Button onClick={() => setActiveTab('submit')}>
                Submit Your First Grievance
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myGrievances.map((grievance) => (
                <Card key={grievance.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{grievance.subject}</h3>
                          <Badge className={getStatusColor(grievance.status)}>
                            {grievance.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><strong>ID:</strong> {grievance.id}</div>
                          <div><strong>Category:</strong> {grievanceCategories.find(c => c.value === grievance.category)?.label}</div>
                          <div><strong>Submitted:</strong> {new Date(grievance.submittedAt).toLocaleDateString()}</div>
                          {grievance.expectedResolution && (
                            <div><strong>Expected Resolution:</strong> {new Date(grievance.expectedResolution).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(grievance.priority)}>
                          {priorityLevels.find(p => p.value === grievance.priority)?.label}
                        </Badge>
                        {grievance.assignedTo && (
                          <div className="text-xs text-gray-500 mt-1">
                            Assigned to: {grievance.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700">{grievance.description}</p>
                    </div>

                    {grievance.responses && grievance.responses.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Latest Response:</h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">{grievance.responses[0].from}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(grievance.responses[0].timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{grievance.responses[0].message}</p>
                        </div>
                      </div>
                    )}

                    {grievance.status === 'resolved' && grievance.resolution && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Resolution:</h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{grievance.resolution}</p>
                        </div>

                        {grievance.satisfaction && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Satisfaction Rating: </span>
                            <div className="inline-flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= grievance.satisfaction
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      {grievance.status === 'resolved' && !grievance.satisfaction && (
                        <Button variant="outline" size="sm">
                          <Star className="h-3 w-3 mr-1" />
                          Rate Service
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Support & Help Center
          </CardTitle>
          <CardDescription>
            Get help and support for PNG Digital ID services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Support */}
            <div>
              <h3 className="font-medium mb-4">Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-gray-600">+675 123 4567</div>
                    <div className="text-xs text-gray-500">Mon-Fri 8:00 AM - 5:00 PM</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-gray-600">support@digitalid.gov.pg</div>
                    <div className="text-xs text-gray-500">Response within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-600">Real-time assistance</div>
                    <div className="text-xs text-gray-500">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div>
              <h3 className="font-medium mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">How long does verification take?</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Tier 1: 1-2 days, Tier 2: 3-5 days, Tier 3: 7-14 days, Tier 4: 14-21 days
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">What if I lose my Digital ID?</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Report it immediately through this grievance system or call our support line.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">How do I update my information?</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Use the Digital ID dashboard to update most information, or submit a grievance for verification level changes.
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Search className="h-4 w-4 mr-2" />
                View All FAQs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Level Agreement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Service Level Agreement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">2 hrs</div>
              <div className="text-sm text-gray-600">Initial Response</div>
              <div className="text-xs text-gray-500">For urgent issues</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24 hrs</div>
              <div className="text-sm text-gray-600">Standard Response</div>
              <div className="text-xs text-gray-500">For general issues</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">5 days</div>
              <div className="text-sm text-gray-600">Resolution Time</div>
              <div className="text-xs text-gray-500">Average resolution</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.5%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
              <div className="text-xs text-gray-500">Customer satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <h1 className="text-3xl font-bold text-slate-900">Grievance & Support System</h1>
              <p className="text-slate-600">Report issues, track complaints, and get support for PNG Digital ID services</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'submit' ? 'default' : 'outline'}
            onClick={() => setActiveTab('submit')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Submit Grievance
          </Button>
          <Button
            variant={activeTab === 'track' ? 'default' : 'outline'}
            onClick={() => setActiveTab('track')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Track My Issues
          </Button>
          <Button
            variant={activeTab === 'support' ? 'default' : 'outline'}
            onClick={() => setActiveTab('support')}
            className="flex items-center gap-2"
          >
            <Headphones className="h-4 w-4" />
            Support & Help
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'submit' && renderSubmitForm()}
        {activeTab === 'track' && renderTrackGrievances()}
        {activeTab === 'support' && renderSupport()}
      </div>
    </div>
  );
}
