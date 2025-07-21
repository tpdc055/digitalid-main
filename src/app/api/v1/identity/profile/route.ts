import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identityId = searchParams.get('id');

    if (!identityId) {
      return NextResponse.json(
        { error: 'Identity ID is required' },
        { status: 400 }
      );
    }

    // Mock profile data
    const profile = {
      identityId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        placeOfBirth: 'Port Moresby, Papua New Guinea',
        gender: 'Male',
        nationality: 'Papua New Guinean'
      },
      contactInfo: {
        email: 'john.doe@example.pg',
        phone: '+675 123 4567',
        address: {
          street: '123 Main Street',
          suburb: 'Boroko',
          city: 'Port Moresby',
          province: 'National Capital District',
          postalCode: '111'
        }
      },
      documents: [
        {
          type: 'passport',
          number: 'P1234567',
          issueDate: '2020-01-01',
          expiryDate: '2030-01-01',
          status: 'active'
        }
      ],
      verificationStatus: 'verified',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { identityId, updates } = body;

    if (!identityId) {
      return NextResponse.json(
        { error: 'Identity ID is required' },
        { status: 400 }
      );
    }

    // Mock profile update
    const updateResult = {
      success: true,
      identityId,
      updatedFields: Object.keys(updates),
      timestamp: new Date().toISOString(),
      message: 'Profile updated successfully'
    };

    return NextResponse.json(updateResult);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
