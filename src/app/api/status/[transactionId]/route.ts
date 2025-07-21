import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Mock payment status response
    const mockStatus = {
      transactionId,
      status: Math.random() > 0.7 ? 'completed' : Math.random() > 0.4 ? 'processing' : 'pending',
      amount: 150.00,
      currency: 'PGK',
      fees: 3.00,
      netAmount: 147.00,
      timestamp: new Date().toISOString(),
      completedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}
