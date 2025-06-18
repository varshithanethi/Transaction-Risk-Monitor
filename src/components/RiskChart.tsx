
import React, { useMemo } from 'react';
import { Transaction, RiskAssessment } from '../types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RiskChartProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const RiskChart: React.FC<RiskChartProps> = ({ transactions, riskAssessments }) => {
  const chartData = useMemo(() => {
    return transactions.slice(0, 20).reverse().map((transaction, index) => {
      const assessment = riskAssessments.get(transaction.transactionId);
      return {
        index: index + 1,
        riskScore: assessment?.overallRiskScore || 0,
        amount: transaction.amount,
        timestamp: transaction.timestamp.toLocaleTimeString(),
        recommendation: assessment?.recommendation || 'APPROVE'
      };
    });
  }, [transactions, riskAssessments]);

  const riskDistribution = useMemo(() => {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    Array.from(riskAssessments.values()).forEach(assessment => {
      if (assessment.overallRiskScore < 40) distribution.low++;
      else if (assessment.overallRiskScore < 70) distribution.medium++;
      else distribution.high++;
    });

    return [
      { name: 'Low Risk', value: distribution.low, color: '#22c55e' },
      { name: 'Medium Risk', value: distribution.medium, color: '#eab308' },
      { name: 'High Risk', value: distribution.high, color: '#ef4444' }
    ];
  }, [riskAssessments]);

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Risk Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="index" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any, name: string) => [
                  `${value}${name === 'riskScore' ? ' points' : name === 'amount' ? ' USD' : ''}`,
                  name === 'riskScore' ? 'Risk Score' : name === 'amount' ? 'Amount' : name
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="riskScore" 
                stroke="#8b5cf6" 
                fill="url(#riskGradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
