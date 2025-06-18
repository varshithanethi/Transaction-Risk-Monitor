
import React, { useState, useEffect, useCallback } from 'react';
import { TransactionDashboard } from '../components/TransactionDashboard';
import { TransactionProcessor } from '../utils/transactionProcessor';
import { RiskEngine } from '../utils/riskEngine';
import { Transaction, RiskAssessment, SystemMetrics } from '../types/transaction';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<Map<string, RiskAssessment>>(new Map());
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

  const processNewTransaction = useCallback(async (transaction: Transaction) => {
    console.log('Processing new transaction:', transaction.transactionId);
    
    const startTime = performance.now();
    
    // Calculate risk assessment
    const riskAssessment = await riskEngine.assessTransaction(transaction, Array.from(transactions));
    const processingTime = performance.now() - startTime;
    
    // Update risk assessment with actual processing time
    const finalAssessment = {
      ...riskAssessment,
      processingTime
    };
    
    // Update state
    setTransactions(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50 transactions
    setRiskAssessments(prev => new Map(prev.set(transaction.transactionId, finalAssessment)));
    
    // Update system metrics
    setSystemMetrics(prev => {
      const newTotal = prev.totalTransactions + 1;
      const newApproved = finalAssessment.recommendation === 'APPROVE' ? prev.approvedTransactions + 1 : prev.approvedTransactions;
      const newDeclined = finalAssessment.recommendation === 'DECLINE' ? prev.declinedTransactions + 1 : prev.declinedTransactions;
      
      return {
        ...prev,
        totalTransactions: newTotal,
        approvedTransactions: newApproved,
        declinedTransactions: newDeclined,
        averageRiskScore: (prev.averageRiskScore * (newTotal - 1) + finalAssessment.overallRiskScore) / newTotal,
        averageProcessingTime: (prev.averageProcessingTime * (newTotal - 1) + processingTime) / newTotal
      };
    });

    console.log('Transaction processed with risk score:', finalAssessment.overallRiskScore);
  }, [transactions]);

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
      />
    </div>
  );
};

export default Index;
