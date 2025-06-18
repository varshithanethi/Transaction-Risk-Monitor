
import { BusinessRule, RuleEngineConfig } from '../types/businessRules';
import { Transaction, RiskAssessment } from '../types/transaction';

export class BusinessRulesEngine {
  private config: RuleEngineConfig;

  constructor(config: RuleEngineConfig) {
    this.config = config;
  }

  updateConfig(newConfig: RuleEngineConfig) {
    this.config = newConfig;
  }

  evaluateTransaction(transaction: Transaction, riskAssessment: RiskAssessment): {
    blocked: boolean;
    triggeredRules: string[];
    finalRecommendation: 'APPROVE' | 'REVIEW' | 'DECLINE';
  } {
    const triggeredRules: string[] = [];
    let blocked = false;

    // Check each active rule
    for (const rule of this.config.rules.filter(r => r.isActive)) {
      if (this.evaluateRule(rule, transaction, riskAssessment)) {
        triggeredRules.push(rule.name);
        
        if (rule.action === 'BLOCK') {
          blocked = true;
        }
      }
    }

    // Check global settings
    if (transaction.amount > this.config.globalSettings.maxTransactionAmount) {
      triggeredRules.push('Global Max Amount Exceeded');
      blocked = true;
    }

    if (this.config.globalSettings.blockedCountries.includes(transaction.location.country)) {
      triggeredRules.push('Blocked Country');
      blocked = true;
    }

    if (this.config.globalSettings.blockedMerchantCategories.includes(transaction.merchantCategory)) {
      triggeredRules.push('Blocked Merchant Category');
      blocked = true;
    }

    // Determine final recommendation
    let finalRecommendation: 'APPROVE' | 'REVIEW' | 'DECLINE' = riskAssessment.recommendation;
    
    if (blocked) {
      finalRecommendation = 'DECLINE';
    } else if (triggeredRules.length > 0) {
      // If any rules triggered but not blocked, escalate to review
      if (finalRecommendation === 'APPROVE') {
        finalRecommendation = 'REVIEW';
      }
    }

    return {
      blocked,
      triggeredRules,
      finalRecommendation
    };
  }

  private evaluateRule(rule: BusinessRule, transaction: Transaction, riskAssessment: RiskAssessment): boolean {
    try {
      switch (rule.category) {
        case 'AMOUNT':
          return transaction.amount >= rule.threshold;
        
        case 'VELOCITY':
          return riskAssessment.riskFactors.velocityRisk >= rule.threshold;
        
        case 'LOCATION':
          return riskAssessment.riskFactors.locationRisk >= rule.threshold;
        
        case 'MERCHANT':
          return riskAssessment.riskFactors.merchantRisk >= rule.threshold;
        
        case 'TIME':
          return riskAssessment.riskFactors.timeRisk >= rule.threshold;
        
        case 'DEVICE':
          return riskAssessment.riskFactors.deviceRisk >= rule.threshold;
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error evaluating rule:', rule.name, error);
      return false;
    }
  }

  addRule(rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>): BusinessRule {
    const newRule: BusinessRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.config.rules.push(newRule);
    return newRule;
  }

  updateRule(ruleId: string, updates: Partial<BusinessRule>): boolean {
    const ruleIndex = this.config.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return false;

    this.config.rules[ruleIndex] = {
      ...this.config.rules[ruleIndex],
      ...updates,
      updatedAt: new Date()
    };
    return true;
  }

  deleteRule(ruleId: string): boolean {
    const ruleIndex = this.config.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return false;

    this.config.rules.splice(ruleIndex, 1);
    return true;
  }

  getRules(): BusinessRule[] {
    return this.config.rules;
  }
}
