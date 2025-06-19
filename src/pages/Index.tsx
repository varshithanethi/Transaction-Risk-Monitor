import React, { useState, useEffect, useCallback } from 'react';
import { TransactionDashboard } from '../components/TransactionDashboard';
import { TransactionProcessor } from '../utils/transactionProcessor';
import { RiskEngine } from '../utils/riskEngine';
import { BusinessRulesEngine } from '../utils/businessRulesEngine';
import { Transaction, RiskAssessment, SystemMetrics } from '../types/transaction';
import { BusinessRule, RuleEngineConfig } from '../types/businessRules';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<Map<string, RiskAssessment>>(new Map());
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalTransactions: 0,
    approvedTransactions: 0,
    declinedTransactions: 0,
    averageRiskScore: 0,
    transactionsPerSecond: 0,
    averageProcessingTime: 2.3
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const transactionProcessor = new TransactionProcessor();
  const riskEngine = new RiskEngine();
  
  // Initialize business rules engine
  const [businessRulesEngine] = useState(() => {
    const initialConfig: RuleEngineConfig = {
      rules: [
        {
          id: 'rule_001',
          name: 'High Amount Alert',
          description: 'Flag transactions over $5,000',
          condition: 'amount > 5000',
          action: 'FLAG',
          threshold: 5000,
          isActive: true,
          category: 'AMOUNT',
          priority: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'rule_002',
          name: 'High Risk Country Block',
          description: 'Block transactions from high-risk countries',
          condition: 'location.risk > 80',
          action: 'BLOCK',
          threshold: 80,
          isActive: true,
          category: 'LOCATION',
          priority: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      globalSettings: {
        maxTransactionAmount: 50000,
        maxDailyTransactions: 100,
        blockedCountries: ['Nigeria', 'Russia'],
        blockedMerchantCategories: ['Gambling'],
        allowTestMode: true
      }
    };
    return new BusinessRulesEngine(initialConfig);
  });

  // Update business rules state when engine changes
  useEffect(() => {
    setBusinessRules(businessRulesEngine.getRules());
  }, [businessRulesEngine]);

  const processNewTransaction = useCallback(async (transaction: Transaction) => {
    console.log('Processing new transaction:', transaction.transactionId);
    
    const startTime = performance.now();
    
    // Calculate risk assessment
    const riskAssessment = await riskEngine.assessTransaction(transaction, Array.from(transactions));
    
    // Apply business rules
    const rulesResult = businessRulesEngine.evaluateTransaction(transaction, riskAssessment);
    
    const processingTime = performance.now() - startTime;
    
    // Update risk assessment with business rules results
    const finalAssessment = {
      ...riskAssessment,
      processingTime,
      recommendation: rulesResult.finalRecommendation,
      triggeredRules: [...riskAssessment.triggeredRules, ...rulesResult.triggeredRules]
    };
    
    // Update state
    setTransactions(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50 transactions
    setRiskAssessments(prev => new Map(prev.set(transaction.transactionId, finalAssessment)));
    
    // Update system metrics with proper counting
    setSystemMetrics(prev => {
      const newTotal = prev.totalTransactions + 1;
      const newApproved = finalAssessment.recommendation === 'APPROVE' ? prev.approvedTransactions + 1 : prev.approvedTransactions;
      const newDeclined = finalAssessment.recommendation === 'DECLINE' ? prev.declinedTransactions + 1 : prev.declinedTransactions;
      
      // Calculate average risk score properly
      const allAssessments = Array.from(riskAssessments.values());
      allAssessments.push(finalAssessment);
      const avgRisk = allAssessments.reduce((sum, a) => sum + a.overallRiskScore, 0) / allAssessments.length;
      
      return {
        ...prev,
        totalTransactions: newTotal,
        approvedTransactions: newApproved,
        declinedTransactions: newDeclined,
        averageRiskScore: avgRisk,
        averageProcessingTime: (prev.averageProcessingTime * (newTotal - 1) + processingTime) / newTotal
      };
    });

    console.log('Transaction processed with risk score:', finalAssessment.overallRiskScore, 'Recommendation:', finalAssessment.recommendation);
  }, [transactions, businessRulesEngine, riskAssessments]);

  // Simulate real-time transaction generation
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      const newTransaction = transactionProcessor.generateTransaction();
      processNewTransaction(newTransaction);
    }, Math.random() * 3000 + 1000); // Random interval between 1-4 seconds

    return () => clearInterval(interval);
  }, [isProcessing, processNewTransaction]);

  // Calculate transactions per second
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        transactionsPerSecond: Math.random() * 15 + 5 // Simulate 5-20 TPS
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartProcessing = () => {
    setIsProcessing(true);
  };

  const handleStopProcessing = () => {
    setIsProcessing(false);
  };

  const handleClearData = () => {
    setTransactions([]);
    setRiskAssessments(new Map());
    setSystemMetrics({
      totalTransactions: 0,
      approvedTransactions: 0,
      declinedTransactions: 0,
      averageRiskScore: 0,
      transactionsPerSecond: 0,
      averageProcessingTime: 2.3
    });
  };

  const handleAddRule = (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule = businessRulesEngine.addRule(rule);
    setBusinessRules(businessRulesEngine.getRules());
    console.log('Added new rule:', newRule.name);
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<BusinessRule>) => {
    const success = businessRulesEngine.updateRule(ruleId, updates);
    if (success) {
      setBusinessRules(businessRulesEngine.getRules());
      console.log('Updated rule:', ruleId);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    const success = businessRulesEngine.deleteRule(ruleId);
    if (success) {
      setBusinessRules(businessRulesEngine.getRules());
      console.log('Deleted rule:', ruleId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TransactionDashboard
        transactions={transactions}
        riskAssessments={riskAssessments}
        systemMetrics={systemMetrics}
        isProcessing={isProcessing}
        onStartProcessing={handleStartProcessing}
        onStopProcessing={handleStopProcessing}
        onClearData={handleClearData}
        businessRules={businessRules}
        onAddRule={handleAddRule}
        onUpdateRule={handleUpdateRule}
        onDeleteRule={handleDeleteRule}
      />
    </div>
  );
};

export default Index;
