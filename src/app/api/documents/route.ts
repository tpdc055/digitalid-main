import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const applicationId = searchParams.get('applicationId');

    // Mock documents data
    const documents = [
      {
        id: 'DOC_001',
        name: 'Birth Certificate',
        type: 'birth_certificate',
        applicationId: 'APP_001',
        status: 'verified',
        uploadedAt: '2024-01-15T09:30:00Z',
        verifiedAt: '2024-01-15T15:45:00Z',
        size: 2048576, // 2MB
        format: 'PDF',
        hash: 'sha256:a1b2c3d4e5f6...',
        downloadUrl: '/api/documents/DOC_001/download',
        metadata: {
          issuer: 'National Statistical Office',
          issueDate: '1990-01-15',
          documentNumber: 'BC-123456789'
        }
      },
      {
        id: 'DOC_002',
        name: 'Passport Photo',
        type: 'passport_photo',
        applicationId: 'APP_001',
        status: 'pending_review',
        uploadedAt: '2024-01-15T10:15:00Z',
        size: 512000, // 512KB
        format: 'JPEG',
        hash: 'sha256:f6e5d4c3b2a1...',
        downloadUrl: '/api/documents/DOC_002/download',
        metadata: {
          dimensions: '35x45mm',
          resolution: '300dpi',
          biometricQuality: 'high'
        }
      },
      {
        id: 'DOC_003',
        name: 'Medical Certificate',
        type: 'medical_certificate',
        applicationId: 'APP_002',
        status: 'approved',
        uploadedAt: '2024-01-10T13:20:00Z',
        verifiedAt: '2024-01-12T11:30:00Z',
        approvedAt: '2024-01-15T16:00:00Z',
        size: 1536000, // 1.5MB
        format: 'PDF',
        hash: 'sha256:9z8y7x6w5v4u...',
        downloadUrl: '/api/documents/DOC_003/download',
        metadata: {
          issuer: 'Port Moresby General Hospital',
          doctorName: 'Dr. Mary Smith',
          issueDate: '2024-01-08',
          validUntil: '2025-01-08'
        }
      }
    ];

    // Filter documents based on query parameters
    let filteredDocuments = documents;

    if (type) {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
    }

    if (applicationId) {
      filteredDocuments = filteredDocuments.filter(doc => doc.applicationId === applicationId);
    }

    return NextResponse.json({
      documents: filteredDocuments,
      total: filteredDocuments.length,
      summary: {
        verified: filteredDocuments.filter(doc => doc.status === 'verified').length,
        pending: filteredDocuments.filter(doc => doc.status === 'pending_review').length,
        approved: filteredDocuments.filter(doc => doc.status === 'approved').length,
        rejected: filteredDocuments.filter(doc => doc.status === 'rejected').length,
        totalSize: filteredDocuments.reduce((sum, doc) => sum + doc.size, 0)
      }
    });
  } catch (error) {
    console.error('Documents fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, applicationId, file, metadata } = body;

    if (!name || !type || !applicationId) {
      return NextResponse.json(
        { error: 'Document name, type, and application ID are required' },
        { status: 400 }
      );
    }

    // Mock document upload
    const newDocument = {
      id: `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      type,
      applicationId,
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      size: Math.floor(Math.random() * 5000000) + 100000, // 100KB - 5MB
      format: type.includes('photo') ? 'JPEG' : 'PDF',
      hash: `sha256:${Math.random().toString(36).substr(2, 16)}...`,
      downloadUrl: `/api/documents/DOC_${Date.now()}/download`,
      metadata: metadata || {}
    };

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
