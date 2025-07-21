import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, biometricData, mfaCode } = body;

    if (!email || (!password && !biometricData)) {
      return NextResponse.json(
        { error: 'Email and password or biometric data are required' },
        { status: 400 }
      );
    }

    // Mock authentication
    const authResult = {
      success: Math.random() > 0.1, // 90% success rate
      userId: `USER_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      email,
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        userId: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      }))}`,
      refreshToken: `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
      expiresIn: 86400, // 24 hours
      tokenType: 'Bearer',
      userProfile: {
        id: email,
        name: 'John Doe',
        email,
        role: 'citizen',
        permissions: ['read:profile', 'update:profile', 'apply:services'],
        lastLogin: new Date().toISOString()
      }
    };

    return NextResponse.json(authResult);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Mock logout
    return NextResponse.json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
