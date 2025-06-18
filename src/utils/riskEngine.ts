
import { Transaction, RiskAssessment, RiskFactors } from '../types/transaction';

export class RiskEngine {
  private highRiskCountries = ['Nigeria', 'Russia', 'China', 'Iran'];
  private highRiskMerchants = ['Gambling', 'Cryptocurrency', 'Financial'];
  private riskRules = [
    { name: 'High Amount Transaction', threshold: 5000, weight: 25 },
    { name: 'High Risk Country', threshold: 1, weight: 30 },
    { name: 'High Risk Merchant', threshold: 1, weight: 20 },
    { name: 'Unusual Time', threshold: 1, weight: 15 },
    { name: 'High Velocity', threshold: 3, weight: 35 },
    { name: 'New Device', threshold: 1, weight: 10 }
  ];

  async assessTransaction(transaction: Transaction, recentTransactions: Transaction[]): Promise<RiskAssessment> {
    console.log('Starting risk assessment for transaction:', transaction.transactionId);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

    const riskFactors = this.calculateRiskFactors(transaction, recentTransactions);
    const triggeredRules = this.evaluateBusinessRules(transaction, riskFactors);
    const overallRiskScore = this.calculateOverallRiskScore(riskFactors, triggeredRules);
    const recommendation = this.makeRecommendation(overallRiskScore, triggeredRules);
    const confidence = this.calculateConfidence(riskFactors, triggeredRules);

    return {
      transactionId: transaction.transactionId,
      overallRiskScore,
      riskFactors,
      triggeredRules,
      recommendation,
      confidence,
      processingTime: 0 // Will be calculated in the main component
    };
  }

  private calculateRiskFactors(transaction: Transaction, recentTransactions: Transaction[]): RiskFactors {
    // Velocity Risk: Check how many transactions from same user in last hour
    const userTransactions = recentTransactions.filter(t => 
      t.userId === transaction.userId && 
      (new Date().getTime() - t.timestamp.getTime()) < 3600000 // 1 hour
    );
    const velocityRisk = Math.min(userTransactions.length * 20, 100);

    // Amount Risk: Based on transaction amount
    const amountRisk = transaction.amount > 5000 ? 80 : 
                     transaction.amount > 1000 ? 40 : 
                     transaction.amount > 500 ? 20 : 10;

    // Location Risk: High risk countries
    const locationRisk = this.highRiskCountries.includes(transaction.location.country) ? 90 : 
                        transaction.location.country !== 'United States' ? 30 : 10;

    // Device Risk: Simulate device fingerprinting
    const deviceRisk = Math.random() > 0.8 ? 70 : Math.random() * 30; // 20% chance of high device risk

    // Time Risk: Unusual transaction times (late night/early morning)
    const hour = transaction.timestamp.getHours();
    const timeRisk = (hour >= 0 && hour <= 6) || hour >= 23 ? 60 : 15;

    // Merchant Risk: Based on merchant category
    const merchantRisk = this.highRiskMerchants.includes(transaction.merchantCategory) ? 75 : 
                         transaction.merchantCategory === 'Financial' ? 50 : 20;

    return {
      velocityRisk,
      amountRisk,
      locationRisk,
      deviceRisk,
      timeRisk,
      merchantRisk
    };
  }

  private evaluateBusinessRules(transaction: Transaction, riskFactors: RiskFactors): string[] {
    const triggeredRules: string[] = [];

    if (transaction.amount > 5000) triggeredRules.push('High Amount Transaction');
    if (this.highRiskCountries.includes(transaction.location.country)) triggeredRules.push('High Risk Country');
    if (this.highRiskMerchants.includes(transaction.merchantCategory)) triggeredRules.push('High Risk Merchant');
    if (riskFactors.timeRisk > 50) triggeredRules.push('Unusual Time');
    if (riskFactors.velocityRisk > 60) triggeredRules.push('High Velocity');
    if (riskFactors.deviceRisk > 60) triggeredRules.push('New Device');

    return triggeredRules;
  }

  private calculateOverallRiskScore(riskFactors: RiskFactors, triggeredRules: string[]): number {
    // Weighted average of risk factors
    const weights = {
      velocityRisk: 0.25,
      amountRisk: 0.20,
      locationRisk: 0.20,
      deviceRisk: 0.15,
      timeRisk: 0.10,
      merchantRisk: 0.10
    };

    let baseScore = 0;
    baseScore += riskFactors.velocityRisk * weights.velocityRisk;
    baseScore += riskFactors.amountRisk * weights.amountRisk;
    baseScore += riskFactors.locationRisk * weights.locationRisk;
    baseScore += riskFactors.deviceRisk * weights.deviceRisk;
    baseScore += riskFactors.timeRisk * weights.timeRisk;
    baseScore += riskFactors.merchantRisk * weights.merchantRisk;

    // Add bonus for triggered rules
    const ruleBonus = triggeredRules.length * 5;
    
    return Math.min(Math.round(baseScore + ruleBonus), 100);
  }

  private makeRecommendation(riskScore: number, triggeredRules: string[]): 'APPROVE' | 'REVIEW' | 'DECLINE' {
    if (riskScore >= 80 || triggeredRules.length >= 3) return 'DECLINE';
    if (riskScore >= 50 || triggeredRules.length >= 2) return 'REVIEW';
    return 'APPROVE';
  }

  private calculateConfidence(riskFactors: RiskFactors, triggeredRules: string[]): number {
    // Higher confidence when more factors align
    const factorVariance = this.calculateVariance(Object.values(riskFactors));
    const baseConfidence = 100 - factorVariance;
    const ruleConfidence = Math.min(triggeredRules.length * 10, 30);
    
    return Math.min(Math.round(baseConfidence + ruleConfidence), 100);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}
