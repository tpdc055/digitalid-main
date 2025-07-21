import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'PNG Digital ID API is operational',
      version: '1.0.0',
      endpoints: {
        issue: '/api/digital-id/issue',
        verify: '/api/digital-id/verify',
        update: '/api/digital-id/update'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      status: 'success',
      message: 'Digital ID request received',
      requestId: `PNG_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request' },
      { status: 400 }
    );
  }
}
