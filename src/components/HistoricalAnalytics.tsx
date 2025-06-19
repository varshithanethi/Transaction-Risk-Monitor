
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Shield, 
  Calendar, Download, Filter, RefreshCw
} from 'lucide-react';
import { Transaction, RiskAssessment } from '../types/transaction';

interface HistoricalAnalyticsProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const HistoricalAnalytics: React.FC<HistoricalAnalyticsProps> = ({
  transactions,
  riskAssessments
}) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate time-series data for charts
  const generateTimeSeriesData = () => {
    const now = new Date();
    const intervals = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const data = [];

    for (let i = intervals - 1; i >= 0; i--) {
      const time = new Date(now);
      if (timeRange === '1h') {
        time.setMinutes(time.getMinutes() - (i * 5));
      } else if (timeRange === '24h') {
        time.setHours(time.getHours() - i);
      } else if (timeRange === '7d') {
        time.setDate(time.getDate() - i);
      } else {
        time.setDate(time.getDate() - i);
      }

      const timeStr = timeRange === '1h' ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                     timeRange === '24h' ? time.toLocaleTimeString('en-US', { hour: '2-digit' }) :
                     time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Simulate historical data based on current transactions
      const baseCount = Math.floor(transactions.length / intervals);
      const variance = Math.random() * 0.4 + 0.8; // 80-120% variance
      
      data.push({
        time: timeStr,
        transactions: Math.floor(baseCount * variance),
        approved: Math.floor(baseCount * variance * 0.7),
        declined: Math.floor(baseCount * variance * 0.2),
        flagged: Math.floor(baseCount * variance * 0.1),
        avgRiskScore: Math.floor(Math.random() * 40 + 30),
        fraudDetected: Math.floor(Math.random() * 3),
      });
    }
    return data;
  };

  // Risk distribution data
  const riskDistributionData = [
    { name: 'Low Risk (0-30)', value: Math.floor(transactions.length * 0.6), color: '#10b981' },
    { name: 'Medium Risk (31-70)', value: Math.floor(transactions.length * 0.3), color: '#f59e0b' },
    { name: 'High Risk (71-100)', value: Math.floor(transactions.length * 0.1), color: '#ef4444' }
  ];

  // Country analysis
  const countryData = transactions.reduce((acc, t) => {
    const country = t.location.country;
    if (!acc[country]) {
      acc[country] = { 
        country, 
        transactions: 0, 
        avgRisk: 0, 
        flagged: 0,
        totalRisk: 0
      };
    }
    acc[country].transactions++;
    const assessment = riskAssessments.get(t.transactionId);
    if (assessment) {
      acc[country].totalRisk += assessment.overallRiskScore;
      acc[country].avgRisk = acc[country].totalRisk / acc[country].transactions;
      if (assessment.overallRiskScore > 70) acc[country].flagged++;
    }
    return acc;
  }, {} as Record<string, any>);

  const countryAnalysis = Object.values(countryData).slice(0, 10);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const timeSeriesData = generateTimeSeriesData();

  // Key metrics
  const totalTransactions = transactions.length;
  const approvedCount = Array.from(riskAssessments.values()).filter(a => a.recommendation === 'APPROVE').length;
  const declinedCount = Array.from(riskAssessments.values()).filter(a => a.recommendation === 'DECLINE').length;
  const reviewCount = Array.from(riskAssessments.values()).filter(a => a.recommendation === 'REVIEW').length;
  const avgRiskScore = Array.from(riskAssessments.values()).reduce((sum, a) => sum + a.overallRiskScore, 0) / riskAssessments.size || 0;

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Historical Analytics</h2>
          <p className="text-gray-400">Comprehensive transaction analysis and fraud patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-blue-600" : "border-gray-600"}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-gray-600"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          
          <Button variant="outline" size="sm" className="border-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {totalTransactions > 0 ? ((approvedCount / totalTransactions) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Fraud Detection</p>
                <p className="text-2xl font-bold text-red-400">
                  {totalTransactions > 0 ? ((declinedCount / totalTransactions) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Risk Score</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {avgRiskScore.toFixed(1)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Under Review</p>
                <p className="text-2xl font-bold text-blue-400">
                  {reviewCount}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="trends">Transaction Trends</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="patterns">Fraud Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="transactions" 
                        stackId="1"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Decision Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="declined" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="flagged" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="avgRiskScore" 
                        stroke="#F59E0B" 
                        fill="#F59E0B" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Geographic Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countryAnalysis.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                      <span className="text-white font-medium">{country.country}</span>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {country.transactions} txns
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        country.avgRisk > 70 ? 'text-red-400' : 
                        country.avgRisk > 40 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        Risk: {country.avgRisk.toFixed(1)}
                      </span>
                      {country.flagged > 0 && (
                        <Badge variant="destructive">
                          {country.flagged} flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Fraud Pattern Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="fraudDetected" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
