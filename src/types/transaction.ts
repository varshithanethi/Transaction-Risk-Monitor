
export interface Transaction {
  transactionId: string;
  userId: string;
  cardId: string;
  amount: number;
  currency: string;
  merchantId: string;
  merchantName: string;
  merchantCategory: string;
  timestamp: Date;
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  deviceInfo: {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
  };
}

export interface RiskFactors {
  velocityRisk: number;
  amountRisk: number;
  locationRisk: number;
  deviceRisk: number;
  timeRisk: number;
  merchantRisk: number;
}

export interface RiskAssessment {
  transactionId: string;
  overallRiskScore: number;
  riskFactors: RiskFactors;
  triggeredRules: string[];
  recommendation: 'APPROVE' | 'REVIEW' | 'DECLINE';
  confidence: number;
  processingTime: number;
}

export interface SystemMetrics {
  totalTransactions: number;
  approvedTransactions: number;
  declinedTransactions: number;
  averageRiskScore: number;
  transactionsPerSecond: number;
  averageProcessingTime: number;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'BLOCK' | 'FLAG' | 'LIMIT';
  threshold: number;
  isActive: boolean;
}
