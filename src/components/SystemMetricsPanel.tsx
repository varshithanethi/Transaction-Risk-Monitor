
import React from 'react';
import { SystemMetrics } from '../types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface SystemMetricsPanelProps {
  metrics: SystemMetrics;
}

export const SystemMetricsPanel: React.FC<SystemMetricsPanelProps> = ({ metrics }) => {
  const approvalRate = metrics.totalTransactions > 0 
    ? Math.round((metrics.approvedTransactions / metrics.totalTransactions) * 100) 
    : 0;

  const declineRate = metrics.totalTransactions > 0 
    ? Math.round((metrics.declinedTransactions / metrics.totalTransactions) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{metrics.totalTransactions.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-1">
            Processing in real-time
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{metrics.approvedTransactions.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-1">
            {approvalRate}% approval rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Declined</CardTitle>
          <XCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{metrics.declinedTransactions.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-1">
            {declineRate}% decline rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Avg Risk Score</CardTitle>
          <Clock className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {metrics.averageRiskScore.toFixed(1)}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Out of 100 points
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Throughput</CardTitle>
          <Zap className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">
            {metrics.transactionsPerSecond.toFixed(1)}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Transactions/sec
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
