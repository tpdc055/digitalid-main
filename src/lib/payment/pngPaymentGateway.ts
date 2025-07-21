export interface PaymentProvider {
  id: string;
  name: string;
  type: 'bank' | 'mobile_money' | 'credit_card';
  logo: string;
  fees: number; // percentage
  processingTime: string;
  currencies: string[];
  isActive: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  serviceType: string;
  applicationId: string;
  citizenId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  reference?: string;
  error?: string;
  estimatedCompletion?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  fees: number;
  netAmount: number;
  timestamp: string;
  completedAt?: string;
  failureReason?: string;
}

// Major PNG Payment Providers
export const PNG_PAYMENT_PROVIDERS: PaymentProvider[] = [
  // Banks
  {
    id: 'bsp_png',
    name: 'Bank South Pacific (BSP)',
    type: 'bank',
    logo: '/images/banks/bsp-logo.png',
    fees: 1.5,
    processingTime: '1-2 business days',
    currencies: ['PGK', 'USD', 'AUD'],
    isActive: true
  },
  {
    id: 'anz_png',
    name: 'ANZ Papua New Guinea',
    type: 'bank',
    logo: '/images/banks/anz-logo.png',
    fees: 1.8,
    processingTime: '1-3 business days',
    currencies: ['PGK', 'USD', 'AUD'],
    isActive: true
  },
  {
    id: 'westpac_png',
    name: 'Westpac Bank PNG',
    type: 'bank',
    logo: '/images/banks/westpac-logo.png',
    fees: 1.7,
    processingTime: '1-2 business days',
    currencies: ['PGK', 'USD'],
    isActive: true
  },
  {
    id: 'kina_bank',
    name: 'Kina Bank',
    type: 'bank',
    logo: '/images/banks/kina-logo.png',
    fees: 1.6,
    processingTime: 'Same day',
    currencies: ['PGK'],
    isActive: true
  },
  {
    id: 'maybank_png',
    name: 'Maybank Papua New Guinea',
    type: 'bank',
    logo: '/images/banks/maybank-logo.png',
    fees: 1.9,
    processingTime: '1-2 business days',
    currencies: ['PGK', 'USD'],
    isActive: true
  },

  // Mobile Money
  {
    id: 'tmoney',
    name: 'T-Money (Digicel)',
    type: 'mobile_money',
    logo: '/images/mobile/tmoney-logo.png',
    fees: 2.0,
    processingTime: 'Instant',
    currencies: ['PGK'],
    isActive: true
  },
  {
    id: 'mipela_money',
    name: 'Mipela Money',
    type: 'mobile_money',
    logo: '/images/mobile/mipela-logo.png',
    fees: 2.2,
    processingTime: 'Instant',
    currencies: ['PGK'],
    isActive: true
  },
  {
    id: 'bsp_kundu',
    name: 'BSP Kundu',
    type: 'mobile_money',
    logo: '/images/mobile/kundu-logo.png',
    fees: 1.8,
    processingTime: 'Instant',
    currencies: ['PGK'],
    isActive: true
  },
  {
    id: 'emobilmoni',
    name: 'eMobilMoni (bmobile)',
    type: 'mobile_money',
    logo: '/images/mobile/emobilmoni-logo.png',
    fees: 2.1,
    processingTime: 'Instant',
    currencies: ['PGK'],
    isActive: true
  },

  // Credit Cards
  {
    id: 'visa_png',
    name: 'Visa',
    type: 'credit_card',
    logo: '/images/cards/visa-logo.png',
    fees: 2.5,
    processingTime: 'Instant',
    currencies: ['PGK', 'USD', 'AUD'],
    isActive: true
  },
  {
    id: 'mastercard_png',
    name: 'Mastercard',
    type: 'credit_card',
    logo: '/images/cards/mastercard-logo.png',
    fees: 2.5,
    processingTime: 'Instant',
    currencies: ['PGK', 'USD', 'AUD'],
    isActive: true
  }
];

export class PNGPaymentGateway {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_PAYMENT_API || 'https://api.png-gov-payments.pg';
  private static readonly API_KEY = process.env.PAYMENT_API_KEY || '';

  static getAvailableProviders(currency: string = 'PGK'): PaymentProvider[] {
    return PNG_PAYMENT_PROVIDERS.filter(provider =>
      provider.isActive && provider.currencies.includes(currency)
    );
  }

  static getProviderById(id: string): PaymentProvider | null {
    return PNG_PAYMENT_PROVIDERS.find(provider => provider.id === id) || null;
  }

  static calculateFees(amount: number, providerId: string): number {
    const provider = this.getProviderById(providerId);
    if (!provider) return 0;
    return Math.round((amount * provider.fees / 100) * 100) / 100;
  }

  static async initiatePayment(request: PaymentRequest, providerId: string): Promise<PaymentResponse> {
    try {
      const provider = this.getProviderById(providerId);
      if (!provider) {
        return {
          success: false,
          error: 'Invalid payment provider'
        };
      }

      // Calculate fees and total amount
      const fees = this.calculateFees(request.amount, providerId);
      const totalAmount = request.amount + fees;

      // Simulate payment initiation based on provider type
      switch (provider.type) {
        case 'bank':
          return this.initiateBankPayment(request, provider, totalAmount);
        case 'mobile_money':
          return this.initiateMobileMoneyPayment(request, provider, totalAmount);
        case 'credit_card':
          return this.initiateCreditCardPayment(request, provider, totalAmount);
        default:
          return {
            success: false,
            error: 'Unsupported payment method'
          };
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  }

  private static async initiateBankPayment(
    request: PaymentRequest,
    provider: PaymentProvider,
    totalAmount: number
  ): Promise<PaymentResponse> {
    // Simulate bank payment initiation
    const transactionId = `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate payment reference
    const reference = `PNG-GOV-${request.applicationId}-${transactionId.slice(-8)}`;

    return {
      success: true,
      transactionId,
      reference,
      paymentUrl: `${this.API_BASE}/bank-redirect/${provider.id}/${transactionId}`,
      estimatedCompletion: provider.processingTime
    };
  }

  private static async initiateMobileMoneyPayment(
    request: PaymentRequest,
    provider: PaymentProvider,
    totalAmount: number
  ): Promise<PaymentResponse> {
    // Simulate mobile money payment initiation
    const transactionId = `MOBILE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate USSD code or payment instructions
    const ussdCode = this.generateUSSDCode(provider.id, totalAmount, transactionId);

    return {
      success: true,
      transactionId,
      reference: `*${ussdCode}#`,
      qrCode: `data:image/png;base64,${this.generateQRCode(ussdCode)}`,
      estimatedCompletion: 'Instant'
    };
  }

  private static async initiateCreditCardPayment(
    request: PaymentRequest,
    provider: PaymentProvider,
    totalAmount: number
  ): Promise<PaymentResponse> {
    // Simulate credit card payment initiation
    const transactionId = `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      paymentUrl: `${this.API_BASE}/card-payment/${provider.id}/${transactionId}`,
      estimatedCompletion: 'Instant'
    };
  }

  static async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // Simulate API call to check payment status
      const response = await fetch(`${this.API_BASE}/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      // For simulation, return mock status
      return this.generateMockStatus(transactionId);
    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  static async processWebhook(payload: any): Promise<PaymentStatus> {
    // Process webhook notifications from payment providers
    // This would typically verify the webhook signature and update payment status

    return {
      transactionId: payload.transactionId,
      status: payload.status,
      amount: payload.amount,
      currency: payload.currency,
      fees: payload.fees,
      netAmount: payload.netAmount,
      timestamp: new Date().toISOString(),
      completedAt: payload.status === 'completed' ? new Date().toISOString() : undefined
    };
  }

  private static generateUSSDCode(providerId: string, amount: number, transactionId: string): string {
    const codes: Record<string, string> = {
      'tmoney': '123*1*',
      'mipela_money': '456*2*',
      'bsp_kundu': '789*3*',
      'emobilmoni': '147*4*'
    };

    const baseCode = codes[providerId] || '999*9*';
    return `${baseCode}${amount}*${transactionId.slice(-6)}`;
  }

  private static generateQRCode(data: string): string {
    // This would typically generate a real QR code
    // For simulation, return a base64 placeholder
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private static generateMockStatus(transactionId: string): PaymentStatus {
    const statuses: PaymentStatus['status'][] = ['pending', 'processing', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      transactionId,
      status: randomStatus,
      amount: 150.00,
      currency: 'PGK',
      fees: 3.00,
      netAmount: 147.00,
      timestamp: new Date().toISOString(),
      completedAt: randomStatus === 'completed' ? new Date().toISOString() : undefined
    };
  }

  // Exchange rate utilities for multi-currency support
  static async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return 1;

    // Mock exchange rates (in production, would fetch from Bank of PNG or financial API)
    const rates: Record<string, Record<string, number>> = {
      'PGK': { 'USD': 0.28, 'AUD': 0.42 },
      'USD': { 'PGK': 3.57, 'AUD': 1.50 },
      'AUD': { 'PGK': 2.38, 'USD': 0.67 }
    };

    return rates[fromCurrency]?.[toCurrency] || 1;
  }

  static formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      'PGK': 'K',
      'USD': '$',
      'AUD': 'A$'
    };

    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  }
}
