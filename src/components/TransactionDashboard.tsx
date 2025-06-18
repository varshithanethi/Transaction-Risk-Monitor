
import React from 'react';
import { Transaction, RiskAssessment, SystemMetrics } from '../types/transaction';
import { DashboardHeader } from './DashboardHeader';
import { SystemMetricsPanel } from './SystemMetricsPanel';
import { TransactionFeed } from './TransactionFeed';
import { RiskChart } from './RiskChart';
import { AlertPanel } from './AlertPanel';

interface TransactionDashboardProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
  systemMetrics: SystemMetrics;
  isProcessing: boolean;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onClearData: () => void;
}

export const TransactionDashboard: React.FC<TransactionDashboardProps> = ({
  transactions,
  riskAssessments,
  systemMetrics,
  isProcessing,
  onStartProcessing,
  onStopProcessing,
  onClearData
}) => {
  const highRiskTransactions = transactions.filter(t => {
    const assessment = riskAssessments.get(t.transactionId);
    return assessment && assessment.overallRiskScore >= 70;
  });

  return (
    <div className="min-h-screen p-6 text-white">
      <DashboardHeader
        isProcessing={isProcessing}
        onStartProcessing={onStartProcessing}
        onStopProcessing={onStopProcessing}
        onClearData={onClearData}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* System Metrics - Top Row */}
        <div className="lg:col-span-4">
          <SystemMetricsPanel metrics={systemMetrics} />
        </div>

        {/* Risk Chart - Left Side */}
        <div className="lg:col-span-2">
          <RiskChart transactions={transactions} riskAssessments={riskAssessments} />
        </div>

        {/* Alert Panel - Right Side */}
        <div className="lg:col-span-2">
          <AlertPanel highRiskTransactions={highRiskTransactions} riskAssessments={riskAssessments} />
        </div>

        {/* Transaction Feed - Full Width */}
        <div className="lg:col-span-4">
          <TransactionFeed transactions={transactions} riskAssessments={riskAssessments} />
        </div>
      </div>
    </div>
  );
};
