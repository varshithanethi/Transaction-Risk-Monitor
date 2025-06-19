
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, Brain, Target, Zap, AlertTriangle, 
  Activity, Shield, Eye, Clock
} from 'lucide-react';
import { Transaction, RiskAssessment } from '../types/transaction';

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
      
      // Simulate predictions based on current patterns
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

  // Risk categories for radial chart
  const riskCategories = [
    { name: 'Velocity Fraud', value: 85, fill: '#EF4444' },
    { name: 'Geographic Risk', value: 72, fill: '#F59E0B' },
    { name: 'Device Anomaly', value: 68, fill: '#8B5CF6' },
    { name: 'Behavioral Pattern', value: 45, fill: '#10B981' }
  ];

  // Threat intelligence data
  const threatData = [
    { category: 'Card Testing', risk: 92, trend: '+15%', color: 'text-red-400' },
    { category: 'Account Takeover', risk: 78, trend: '+8%', color: 'text-orange-400' },
    { category: 'Synthetic Identity', risk: 65, trend: '-3%', color: 'text-yellow-400' },
    { category: 'Friendly Fraud', risk: 43, trend: '-12%', color: 'text-green-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Prediction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Next Hour Risk</p>
                <p className="text-2xl font-bold text-blue-100">
                  {predictiveData[1]?.fraudRisk || 0}%
                </p>
              </div>
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {predictiveData[1]?.confidence || 0}% Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Expected Volume</p>
                <p className="text-2xl font-bold text-purple-100">
                  {predictiveData[1]?.expectedTransactions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                Next Hour
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">Anomaly Score</p>
                <p className="text-2xl font-bold text-yellow-100">
                  {predictiveData[0]?.anomalyScore || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                Current
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Model Accuracy</p>
                <p className="text-2xl font-bold text-green-100">94.2%</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Last 7 Days
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Predictive Risk Timeline */}
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
                    formatter={(value) => `${value}:00`}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any, name: string) => [
                      `${value}${name === 'fraudRisk' ? '%' : ''}`,
                      name === 'fraudRisk' ? 'Fraud Risk' : 'Expected Volume'
                    ]}
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

        {/* Risk Category Analysis */}
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
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="#8884d8"
                  />
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

      {/* Threat Intelligence */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-400" />
            Threat Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {threatData.map((threat, index) => (
              <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">{threat.category}</h4>
                  <Badge 
                    variant="outline"
                    className={`border-current ${threat.color}`}
                  >
                    {threat.trend}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full`}
                      style={{ 
                        width: `${threat.risk}%`,
                        backgroundColor: threat.risk > 80 ? '#EF4444' : threat.risk > 60 ? '#F59E0B' : '#10B981'
                      }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${threat.color}`}>
                    {threat.risk}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
