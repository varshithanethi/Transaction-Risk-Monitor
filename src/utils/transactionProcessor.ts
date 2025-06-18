
import { Transaction } from '../types/transaction';

export class TransactionProcessor {
  private merchants = [
    { id: 'merchant_001', name: 'Amazon', category: 'E-commerce' },
    { id: 'merchant_002', name: 'Starbucks', category: 'Food & Beverage' },
    { id: 'merchant_003', name: 'Shell Gas Station', category: 'Gas Station' },
    { id: 'merchant_004', name: 'Best Buy', category: 'Electronics' },
    { id: 'merchant_005', name: 'Walmart', category: 'Retail' },
    { id: 'merchant_006', name: 'Netflix', category: 'Entertainment' },
    { id: 'merchant_007', name: 'Uber', category: 'Transportation' },
    { id: 'merchant_008', name: 'Casino Royal', category: 'Gambling' },
    { id: 'merchant_009', name: 'Money Transfer Co', category: 'Financial' },
    { id: 'merchant_010', name: 'Crypto Exchange', category: 'Cryptocurrency' }
  ];

  private locations = [
    { country: 'United States', city: 'New York', coordinates: [40.7128, -74.0060] as [number, number] },
    { country: 'United States', city: 'Los Angeles', coordinates: [34.0522, -118.2437] as [number, number] },
    { country: 'United Kingdom', city: 'London', coordinates: [51.5074, -0.1278] as [number, number] },
    { country: 'Canada', city: 'Toronto', coordinates: [43.6532, -79.3832] as [number, number] },
    { country: 'Germany', city: 'Berlin', coordinates: [52.5200, 13.4050] as [number, number] },
    { country: 'Japan', city: 'Tokyo', coordinates: [35.6762, 139.6503] as [number, number] },
    { country: 'Nigeria', city: 'Lagos', coordinates: [6.5244, 3.3792] as [number, number] },
    { country: 'Russia', city: 'Moscow', coordinates: [55.7558, 37.6173] as [number, number] }
  ];

  private users = [
    'user_001', 'user_002', 'user_003', 'user_004', 'user_005',
    'user_006', 'user_007', 'user_008', 'user_009', 'user_010'
  ];

  generateTransaction(): Transaction {
    const merchant = this.merchants[Math.floor(Math.random() * this.merchants.length)];
    const location = this.locations[Math.floor(Math.random() * this.locations.length)];
    const user = this.users[Math.floor(Math.random() * this.users.length)];
    
    // Generate transaction amount based on merchant category
    let amount = this.generateAmountByCategory(merchant.category);
    
    // Occasionally generate suspicious high amounts
    if (Math.random() < 0.1) {
      amount = Math.random() * 50000 + 10000; // $10k - $60k suspicious amounts
    }

    return {
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user,
      cardId: `card_${user}_${Math.floor(Math.random() * 3) + 1}`,
      amount: Math.round(amount * 100) / 100,
      currency: 'USD',
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantCategory: merchant.category,
      timestamp: new Date(),
      location,
      deviceInfo: {
        deviceId: `device_${Math.random().toString(36).substr(2, 12)}`,
        ipAddress: this.generateIPAddress(),
        userAgent: this.generateUserAgent()
      }
    };
  }

  private generateAmountByCategory(category: string): number {
    const ranges = {
      'E-commerce': [20, 500],
      'Food & Beverage': [5, 150],
      'Gas Station': [25, 100],
      'Electronics': [100, 2000],
      'Retail': [15, 300],
      'Entertainment': [10, 50],
      'Transportation': [8, 75],
      'Gambling': [50, 5000],
      'Financial': [100, 10000],
      'Cryptocurrency': [500, 50000]
    };

    const range = ranges[category] || [10, 100];
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  private generateIPAddress(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  private generateUserAgent(): string {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/14.1.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Mobile/15E148',
      'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }
}
