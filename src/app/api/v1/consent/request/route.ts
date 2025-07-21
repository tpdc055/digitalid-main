import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identityId, requestedAttributes, purpose, requesterInfo } = body;

    if (!identityId || !requestedAttributes || !purpose) {
      return NextResponse.json(
        { error: 'Identity ID, requested attributes, and purpose are required' },
        { status: 400 }
      );
    }

    // Mock consent request
    const consentRequest = {
      consentId: `CONSENT_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      identityId,
      requestedAttributes,
      purpose,
      requesterInfo,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      createdAt: new Date().toISOString(),
      consentUrl: `/consent/review?id=CONSENT_${Date.now()}`
    };

    return NextResponse.json(consentRequest);
  } catch (error) {
    console.error('Consent request error:', error);
    return NextResponse.json(
      { error: 'Failed to create consent request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const consentId = searchParams.get('id');

    if (!consentId) {
      return NextResponse.json(
        { error: 'Consent ID is required' },
        { status: 400 }
      );
    }

    // Mock consent status
    const consentStatus = {
      consentId,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedAttributes: ['name', 'dateOfBirth', 'address'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    return NextResponse.json(consentStatus);
  } catch (error) {
    console.error('Consent status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent status' },
      { status: 500 }
    );
  }
}
