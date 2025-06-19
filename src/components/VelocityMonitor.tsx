
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Zap, Activity, Clock, TrendingUp, AlertTriangle, 
  Users, CreditCard, MapPin
} from 'lucide-react';
import { Transaction, RiskAssessment } from '../types/transaction';

interface VelocityMonitorProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const VelocityMonitor: React.FC<VelocityMonitorProps> = ({
  transactions,
  riskAssessments
}) => {
  const [velocityData, setVelocityData] = useState<Array<{
    time: string;
    tps: number;
    users: number;
    countries: number;
    avgAmount: number;
  }>>([]);

  const [currentVelocity, setCurrentVelocity] = useState({
    tps: 0,
    activeUsers: 0,
    uniqueCountries: 0,
    totalVolume: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // Calculate current metrics
      const lastMinute = transactions.filter(t => 
        Date.now() - t.timestamp.getTime() < 60000
      );

      const tps = lastMinute.length / 60;
      const activeUsers = new Set(lastMinute.map(t => t.userId)).size;
      const uniqueCountries = new Set(lastMinute.map(t => t.location.country)).size;
      const totalVolume = lastMinute.reduce((sum, t) => sum + t.amount, 0);

      setCurrentVelocity({
        tps: Math.round(tps * 100) / 100,
        activeUsers,
        uniqueCountries,
        totalVolume
      });

      // Update velocity chart data
      setVelocityData(prev => {
        const newData = {
          time: timeStr,
          tps: Math.round(tps * 100) / 100,
          users: activeUsers,
          countries: uniqueCountries,
          avgAmount: lastMinute.length > 0 ? totalVolume / lastMinute.length : 0
        };

        return [newData, ...prev.slice(0, 19)]; // Keep last 20 data points
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [transactions]);

  // User velocity analysis
  const userVelocityData = React.useMemo(() => {
    const userCounts = transactions.reduce((acc, t) => {
      acc[t.userId] = (acc[t.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, count]) => ({
        userId: userId.slice(0, 8),
        transactions: count,
        risk: Math.min((count / 5) * 100, 100)
      }));
  }, [transactions]);

  // Geographic velocity
  const geoVelocityData = React.useMemo(() => {
    const countryCounts = transactions.reduce((acc, t) => {
      acc[t.location.country] = (acc[t.location.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, count]) => ({
        country,
        transactions: count,
        percentage: Math.round((count / transactions.length) * 100)
      }));
  }, [transactions]);

  const getVelocityStatus = (tps: number) => {
    if (tps > 2) return { status: 'HIGH', color: 'bg-red-600', textColor: 'text-red-400' };
    if (tps > 1) return { status: 'MEDIUM', color: 'bg-yellow-600', textColor: 'text-yellow-400' };
    return { status: 'NORMAL', color: 'bg-green-600', textColor: 'text-green-400' };
  };

  const velocityStatus = getVelocityStatus(currentVelocity.tps);

  return (
    <div className="space-y-6">
      {/* Real-time Velocity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200">Transactions/sec</p>
                <p className="text-2xl font-bold text-cyan-100">
                  {currentVelocity.tps}
                </p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="mt-2">
              <Badge className={velocityStatus.color}>
                {velocityStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Active Users</p>
                <p className="text-2xl font-bold text-blue-100">
                  {currentVelocity.activeUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Last Minute
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Countries</p>
                <p className="text-2xl font-bold text-purple-100">
                  {currentVelocity.uniqueCountries}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                Geographic Spread
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Volume</p>
                <p className="text-2xl font-bold text-green-100">
                  ${(currentVelocity.totalVolume / 1000).toFixed(1)}K
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Last Minute
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Velocity Timeline */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Transaction Velocity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tps" 
                    stroke="#06B6D4" 
                    strokeWidth={2}
                    dot={{ fill: '#06B6D4', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Velocity Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              High-Velocity Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="userId" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="transactions" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Geographic Transaction Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {geoVelocityData.map((country, index) => (
              <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">{country.country}</h4>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {country.percentage}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    {country.transactions}
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
