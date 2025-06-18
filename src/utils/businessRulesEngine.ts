
import { BusinessRule, RuleEngineConfig } from '../types/businessRules';
import { Transaction, RiskAssessment } from '../types/transaction';

export class BusinessRulesEngine {
  private rules: Map<string, BusinessRule> = new Map();
  private config: RuleEngineConfig['globalSettings'];

  constructor(config: RuleEngineConfig) {
    this.loadRules(config.rules);
    this.config = config.globalSettings;
  }

  loadRules(rules: BusinessRule[]) {
    this.rules.clear();
    rules.filter(rule => rule.isActive).forEach(rule => {
      this.rules.set(rule.id, rule);
    });
    console.log(`Loaded ${this.rules.size} active business rules`);
  }

  evaluateTransaction(transaction: Transaction, userHistory: Transaction[], riskAssessment: RiskAssessment): {
    decision: 'APPROVE' | 'DECLINE' | 'REVIEW';
    triggeredRules: string[];
    confidence: number;
  } {
    const triggeredRules: string[] = [];
    let maxAction: 'APPROVE' | 'REVIEW' | 'BLOCK' = 'APPROVE';

    // Evaluate global settings first
    if (this.config.blockedCountries.includes(transaction.location.country)) {
      triggeredRules.push('Blocked Country');
      maxAction = 'BLOCK';
    }

    if (this.config.blockedMerchantCategories.includes(transaction.merchantCategory)) {
      triggeredRules.push('Blocked Merchant Category');
      maxAction = 'BLOCK';
    }

    if (transaction.amount > this.config.maxTransactionAmount) {
      triggeredRules.push('Exceeds Maximum Amount');
      maxAction = 'BLOCK';
    }

    // Evaluate custom rules
    Array.from(this.rules.values())
      .sort((a, b) => b.priority - a.priority)
      .forEach(rule => {
        if (this.evaluateRule(rule, transaction, userHistory, riskAssessment)) {
          triggeredRules.push(rule.name);
          if (rule.action === 'BLOCK' && maxAction !== 'BLOCK') {
            maxAction = 'BLOCK';
          } else if (rule.action === 'FLAG' && maxAction === 'APPROVE') {
            maxAction = 'REVIEW';
          }
        }
      });

    const decision = maxAction === 'BLOCK' ? 'DECLINE' : 
                    maxAction === 'REVIEW' ? 'REVIEW' : 'APPROVE';
    
    const confidence = this.calculateConfidence(triggeredRules.length, riskAssessment.confidence);

    return { decision, triggeredRules, confidence };
  }

  private evaluateRule(rule: BusinessRule, transaction: Transaction, userHistory: Transaction[], riskAssessment: RiskAssessment): boolean {
    switch (rule.category) {
      case 'VELOCITY':
        return this.evaluateVelocityRule(rule, transaction, userHistory);
      case 'AMOUNT':
        return transaction.amount > rule.threshold;
      case 'LOCATION':
        return this.evaluateLocationRule(rule, transaction);
      case 'MERCHANT':
        return this.evaluateMerchantRule(rule, transaction);
      case 'TIME':
        return this.evaluateTimeRule(rule, transaction);
      case 'DEVICE':
        return riskAssessment.riskFactors.deviceRisk > rule.threshold;
      default:
        return false;
    }
  }

  private evaluateVelocityRule(rule: BusinessRule, transaction: Transaction, userHistory: Transaction[]): boolean {
    if (!rule.timeWindow) return false;
    
    const timeWindowMs = this.parseTimeWindow(rule.timeWindow);
    const cutoffTime = new Date(Date.now() - timeWindowMs);
    
    const recentTransactions = userHistory.filter(t => 
      t.userId === transaction.userId && t.timestamp >= cutoffTime
    );
    
    return recentTransactions.length >= rule.threshold;
  }

  private evaluateLocationRule(rule: BusinessRule, transaction: Transaction): boolean {
    // Custom location-based rules can be implemented here
    return false;
  }

  private evaluateMerchantRule(rule: BusinessRule, transaction: Transaction): boolean {
    // Custom merchant-based rules can be implemented here
    return false;
  }

  private evaluateTimeRule(rule: BusinessRule, transaction: Transaction): boolean {
    const hour = transaction.timestamp.getHours();
    return hour >= 0 && hour <= 6; // Night time transactions
  }

  private parseTimeWindow(timeWindow: string): number {
    const unit = timeWindow.slice(-1);
    const value = parseInt(timeWindow.slice(0, -1));
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }

  private calculateConfidence(triggeredRulesCount: number, baseConfidence: number): number {
    const ruleConfidence = Math.min(triggeredRulesCount * 15, 40);
    return Math.min(baseConfidence + ruleConfidence, 100);
  }

  // Admin methods for rule management
  addRule(rule: BusinessRule): void {
    this.rules.set(rule.id, rule);
    console.log(`Added business rule: ${rule.name}`);
  }

  updateRule(ruleId: string, updates: Partial<BusinessRule>): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;
    
    const updatedRule = { ...rule, ...updates, updatedAt: new Date() };
    this.rules.set(ruleId, updatedRule);
    console.log(`Updated business rule: ${rule.name}`);
    return true;
  }

  deleteRule(ruleId: string): boolean {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      console.log(`Deleted business rule: ${ruleId}`);
    }
    return deleted;
  }

  getAllRules(): BusinessRule[] {
    return Array.from(this.rules.values());
  }
}
