import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { biometricType, biometricData, identityId } = body;

    if (!biometricType || !biometricData) {
      return NextResponse.json(
        { error: 'Biometric type and data are required' },
        { status: 400 }
      );
    }

    // Mock biometric verification
    const verificationResult = {
      success: Math.random() > 0.15, // 85% success rate
      biometricType,
      identityId,
      verificationId: `BIO_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      timestamp: new Date().toISOString(),
      matchScore: Math.random() * 0.25 + 0.75, // 75-100% match score
      threshold: 0.8,
      status: 'matched',
      quality: {
        imageQuality: Math.random() * 0.3 + 0.7,
        templateQuality: Math.random() * 0.3 + 0.7,
        overallQuality: 'high'
      }
    };

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error('Biometric verification error:', error);
    return NextResponse.json(
      { error: 'Biometric verification failed' },
      { status: 500 }
    );
  }
}
