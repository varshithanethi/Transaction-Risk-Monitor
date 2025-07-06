
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';
import { Transaction, RiskAssessment } from '../../types/transaction';
import { PredictionCards } from './PredictionCards';
import { ThreatIntelligence } from './ThreatIntelligence';

interface PredictiveAnalyticsProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  transactions,
  riskAssessments
}) => {
  // Generate predictive data
  const predictiveData = useMemo(() => {
    const hourlyData = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now);
      hour.setHours(hour.getHours() + i);
      
      const baseRisk = 30 + Math.sin(i * 0.5) * 20 + Math.random() * 15;
      const fraudProbability = Math.max(0, Math.min(100, baseRisk + Math.random() * 20 - 10));
      const expectedVolume = 50 + Math.sin(i * 0.3) * 30 + Math.random() * 20;
      
      hourlyData.push({
        hour: hour.getHours(),
        fraudRisk: Math.round(fraudProbability),
        expectedTransactions: Math.round(expectedVolume),
        confidence: Math.round(85 + Math.random() * 10),
        anomalyScore: Math.round(Math.random() * 30)
      });
    }
    
    return hourlyData;
  }, [transactions]);

  const riskCategories = [
    { name: 'Velocity Fraud', value: 85, fill: '#EF4444' },
    { name: 'Geographic Risk', value: 72, fill: '#F59E0B' },
    { name: 'Device Anomaly', value: 68, fill: '#8B5CF6' },
    { name: 'Behavioral Pattern', value: 45, fill: '#10B981' }
  ];

  const predictions = {
    nextHourRisk: predictiveData[1]?.fraudRisk || 0,
    expectedVolume: predictiveData[1]?.expectedTransactions || 0,
    anomalyScore: predictiveData[0]?.anomalyScore || 0,
    modelAccuracy: 94.2,
    confidence: predictiveData[1]?.confidence || 0
  };

  return (
    <div className="space-y-6">
      <PredictionCards predictions={predictions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              24-Hour Risk Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictiveData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="fraudRisk" 
                    stackId="1"
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expectedTransactions" 
                    stackId="2"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Risk Category Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={riskCategories}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {riskCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.fill }}
                  />
                  <span className="text-sm text-gray-300">{category.name}</span>
                  <span className="text-sm font-bold" style={{ color: category.fill }}>
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ThreatIntelligence />
    </div>
  );
};
