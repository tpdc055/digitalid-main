import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Mock applications data
    const applications = [
      {
        id: 'APP_001',
        type: 'passport',
        title: 'Passport Application',
        status: 'in_progress',
        submittedDate: '2024-01-15T10:00:00Z',
        expectedCompletion: '2024-02-15T17:00:00Z',
        progress: 65,
        documents: ['birth_certificate', 'photo', 'application_form'],
        fees: { total: 150.00, paid: 50.00, currency: 'PGK' }
      },
      {
        id: 'APP_002',
        type: 'driver_license',
        title: 'Driver License Renewal',
        status: 'completed',
        submittedDate: '2024-01-10T14:30:00Z',
        completedDate: '2024-01-20T16:45:00Z',
        progress: 100,
        documents: ['old_license', 'medical_certificate', 'payment_receipt'],
        fees: { total: 75.00, paid: 75.00, currency: 'PGK' }
      },
      {
        id: 'APP_003',
        type: 'business_license',
        title: 'Business Registration',
        status: 'pending_documents',
        submittedDate: '2024-01-20T09:15:00Z',
        expectedCompletion: '2024-03-01T17:00:00Z',
        progress: 25,
        documents: ['business_plan', 'incorporation_docs'],
        fees: { total: 200.00, paid: 0.00, currency: 'PGK' }
      }
    ];

    // Filter applications based on query parameters
    let filteredApplications = applications;

    if (status) {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }

    if (type) {
      filteredApplications = filteredApplications.filter(app => app.type === type);
    }

    return NextResponse.json({
      applications: filteredApplications,
      total: filteredApplications.length,
      summary: {
        pending: applications.filter(app => app.status === 'pending_documents').length,
        in_progress: applications.filter(app => app.status === 'in_progress').length,
        completed: applications.filter(app => app.status === 'completed').length
      }
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, applicantInfo, documents, metadata } = body;

    if (!type || !title || !applicantInfo) {
      return NextResponse.json(
        { error: 'Application type, title, and applicant info are required' },
        { status: 400 }
      );
    }

    // Mock application creation
    const newApplication = {
      id: `APP_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      title,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      expectedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      progress: 10,
      applicantInfo,
      documents: documents || [],
      metadata: metadata || {},
      fees: {
        total: Math.floor(Math.random() * 200) + 50,
        paid: 0,
        currency: 'PGK'
      }
    };

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Application creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
