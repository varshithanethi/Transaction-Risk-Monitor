
export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'BLOCK' | 'FLAG' | 'LIMIT';
  threshold: number;
  isActive: boolean;
  category: 'VELOCITY' | 'AMOUNT' | 'LOCATION' | 'MERCHANT' | 'TIME' | 'DEVICE';
  priority: number;
  timeWindow?: string; // '1m', '5m', '1h', '24h'
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleEngineConfig {
  rules: BusinessRule[];
  globalSettings: {
    maxTransactionAmount: number;
    maxDailyTransactions: number;
    blockedCountries: string[];
    blockedMerchantCategories: string[];
    allowTestMode: boolean;
  };
}
