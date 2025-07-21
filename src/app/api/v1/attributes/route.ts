import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identityId = searchParams.get('identityId');
    const category = searchParams.get('category');

    if (!identityId) {
      return NextResponse.json(
        { error: 'Identity ID is required' },
        { status: 400 }
      );
    }

    // Mock attributes data
    const attributes = {
      identityId,
      personalAttributes: {
        name: 'John Doe',
        dateOfBirth: '1990-01-15',
        placeOfBirth: 'Port Moresby',
        gender: 'Male',
        nationality: 'Papua New Guinean'
      },
      contactAttributes: {
        email: 'john.doe@example.pg',
        phone: '+675 123 4567',
        address: '123 Main Street, Boroko, Port Moresby'
      },
      documentAttributes: {
        passportNumber: 'P1234567',
        driverLicense: 'DL789012',
        socialSecurityNumber: 'SSN345678'
      },
      verificationStatus: {
        identity: 'verified',
        address: 'verified',
        documents: 'verified',
        biometric: 'verified'
      },
      lastUpdated: new Date().toISOString()
    };

    // Filter by category if specified
    if (category && attributes[category as keyof typeof attributes]) {
      return NextResponse.json({
        identityId,
        category,
        attributes: attributes[category as keyof typeof attributes],
        lastUpdated: attributes.lastUpdated
      });
    }

    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Attributes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attributes' },
      { status: 500 }
    );
  }
}
