
import React, { useState } from 'react';
import { Transaction, RiskAssessment, SystemMetrics } from '../types/transaction';
import { BusinessRule } from '../types/businessRules';
import { DashboardHeader } from './DashboardHeader';
import { SystemMetricsPanel } from './SystemMetricsPanel';
import { TransactionFeed } from './TransactionFeed';
import { RiskChart } from './RiskChart';
import { AlertPanel } from './AlertPanel';
import { BusinessRulesManager } from './BusinessRulesManager';
import { MLModelMonitor } from './MLModelMonitor';
import { HistoricalAnalytics } from './HistoricalAnalytics';
import { FraudMonitor } from './FraudMonitor';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { VelocityMonitor } from './VelocityMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransactionDashboardProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
  systemMetrics: SystemMetrics;
  isProcessing: boolean;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onClearData: () => void;
  businessRules: BusinessRule[];
  onAddRule: (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<BusinessRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const TransactionDashboard: React.FC<TransactionDashboardProps> = ({
  transactions,
  riskAssessments,
  systemMetrics,
  isProcessing,
  onStartProcessing,
  onStopProcessing,
  onClearData,
  businessRules,
  onAddRule,
  onUpdateRule,
  onDeleteRule
}) => {
  const [isTraining, setIsTraining] = useState(false);

  const highRiskTransactions = transactions.filter(t => {
    const assessment = riskAssessments.get(t.transactionId);
    return assessment && assessment.overallRiskScore >= 70;
  });

  // Calculate pending/review transactions
  const pendingCount = Array.from(riskAssessments.values()).filter(
    assessment => assessment.recommendation === 'REVIEW'
  ).length;

  // Mock ML model metrics
  const mlMetrics = {
    accuracy: 0.87,
    precision: 0.85,
    recall: 0.82,
    f1Score: 0.84,
    falsePositiveRate: 0.08,
    falseNegativeRate: 0.12,
    modelVersion: 'v2.1.3',
    trainingDate: new Date('2024-01-15'),
    predictionsToday: 2847,
    averageConfidence: 87.3
  };

  const handleRetrainModel = () => {
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
    }, 10000);
  };

  const handleUpdateModel = () => {
    console.log('Updating ML model...');
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 text-white">
      <DashboardHeader
        isProcessing={isProcessing}
        onStartProcessing={onStartProcessing}
        onStopProcessing={onStopProcessing}
        onClearData={onClearData}
      />
      
      <Tabs defaultValue="dashboard" className="mt-4 lg:mt-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-gray-800/50 border-gray-700">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="fraud-monitor" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Fraud Monitor
          </TabsTrigger>
          <TabsTrigger value="velocity" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Velocity
          </TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Predictive
          </TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Rules
          </TabsTrigger>
          <TabsTrigger value="ml" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            ML Models
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
          {/* System Metrics - Top Row */}
          <SystemMetricsPanel metrics={systemMetrics} pendingCount={pendingCount} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            {/* Risk Chart - Left Side */}
            <div className="xl:col-span-2">
              <RiskChart transactions={transactions} riskAssessments={riskAssessments} />
            </div>

            {/* Alert Panel - Right Side */}
            <div className="xl:col-span-2">
              <AlertPanel highRiskTransactions={highRiskTransactions} riskAssessments={riskAssessments} />
            </div>

            {/* Transaction Feed - Full Width */}
            <div className="xl:col-span-4">
              <TransactionFeed transactions={transactions} riskAssessments={riskAssessments} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fraud-monitor">
          <FraudMonitor 
            transactions={transactions}
            riskAssessments={riskAssessments}
          />
        </TabsContent>

        <TabsContent value="velocity">
          <VelocityMonitor 
            transactions={transactions}
            riskAssessments={riskAssessments}
          />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveAnalytics 
            transactions={transactions}
            riskAssessments={riskAssessments}
          />
        </TabsContent>

        <TabsContent value="rules">
          <BusinessRulesManager
            rules={businessRules}
            onAddRule={onAddRule}
            onUpdateRule={onUpdateRule}
            onDeleteRule={onDeleteRule}
          />
        </TabsContent>

        <TabsContent value="ml">
          <MLModelMonitor
            metrics={mlMetrics}
            isTraining={isTraining}
            onRetrainModel={handleRetrainModel}
            onUpdateModel={handleUpdateModel}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
          <HistoricalAnalytics 
            transactions={transactions}
            riskAssessments={riskAssessments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
