import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const applicationId = searchParams.get('applicationId');

    // Mock payments data
    const payments = [
      {
        id: 'PAY_001',
        applicationId: 'APP_001',
        amount: 150.00,
        currency: 'PGK',
        status: 'completed',
        method: 'bsp_png',
        methodName: 'Bank South Pacific',
        transactionId: 'TXN_123456789',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:32:15Z',
        description: 'Passport Application Fee',
        fees: 3.00,
        netAmount: 147.00
      },
      {
        id: 'PAY_002',
        applicationId: 'APP_002',
        amount: 75.00,
        currency: 'PGK',
        status: 'pending',
        method: 'tmoney',
        methodName: 'T-Money',
        transactionId: 'TXN_987654321',
        createdAt: '2024-01-20T14:45:00Z',
        description: 'Driver License Renewal Fee',
        fees: 1.50,
        netAmount: 73.50
      }
    ];

    // Filter payments based on query parameters
    let filteredPayments = payments;

    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }

    if (applicationId) {
      filteredPayments = filteredPayments.filter(payment => payment.applicationId === applicationId);
    }

    return NextResponse.json({
      payments: filteredPayments,
      total: filteredPayments.length,
      summary: {
        totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
        totalFees: filteredPayments.reduce((sum, payment) => sum + payment.fees, 0),
        completed: filteredPayments.filter(payment => payment.status === 'completed').length,
        pending: filteredPayments.filter(payment => payment.status === 'pending').length,
        failed: filteredPayments.filter(payment => payment.status === 'failed').length
      }
    });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, amount, currency, method, description, metadata } = body;

    if (!applicationId || !amount || !method) {
      return NextResponse.json(
        { error: 'Application ID, amount, and payment method are required' },
        { status: 400 }
      );
    }

    // Mock payment initiation
    const newPayment = {
      id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      applicationId,
      amount,
      currency: currency || 'PGK',
      status: 'initiated',
      method,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      createdAt: new Date().toISOString(),
      description: description || 'Government Service Fee',
      fees: Math.round((amount * 0.02) * 100) / 100, // 2% fees
      netAmount: Math.round((amount * 0.98) * 100) / 100,
      paymentUrl: `/payment/process?id=PAY_${Date.now()}`,
      metadata: metadata || {}
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
