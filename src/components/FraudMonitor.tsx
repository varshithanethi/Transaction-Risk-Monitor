
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Shield, TrendingUp, Eye, Clock,
  Activity, Zap, Target, Brain, Radar
} from 'lucide-react';
import { Transaction, RiskAssessment } from '../types/transaction';

interface FraudMonitorProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const FraudMonitor: React.FC<FraudMonitorProps> = ({
  transactions,
  riskAssessments
}) => {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'VELOCITY' | 'PATTERN' | 'ANOMALY' | 'GEOGRAPHIC';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    timestamp: Date;
    transactionId?: string;
  }>>([]);

  const [fraudScore, setFraudScore] = useState(0);
  const [suspiciousPatterns, setSuspiciousPatterns] = useState(0);

  useEffect(() => {
    // Simulate real-time fraud detection
    const interval = setInterval(() => {
      if (transactions.length > 0) {
        const recentTransactions = transactions.slice(0, 5);
        const newAlerts = detectFraudPatterns(recentTransactions);
        
        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]);
        }

        // Update fraud score
        const avgRisk = Array.from(riskAssessments.values())
          .slice(0, 10)
          .reduce((sum, r) => sum + r.overallRiskScore, 0) / 10;
        setFraudScore(avgRisk || 0);

        // Count suspicious patterns
        const patterns = countSuspiciousPatterns(recentTransactions);
        setSuspiciousPatterns(patterns);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transactions, riskAssessments]);

  const detectFraudPatterns = (txns: Transaction[]) => {
    const newAlerts = [];
    
    // Velocity check
    const velocityCount = txns.filter(t => 
      Date.now() - t.timestamp.getTime() < 60000
    ).length;
    
    if (velocityCount > 3) {
      newAlerts.push({
        id: `alert_${Date.now()}_velocity`,
        type: 'VELOCITY' as const,
        severity: 'HIGH' as const,
        message: `High transaction velocity detected: ${velocityCount} transactions in 1 minute`,
        timestamp: new Date()
      });
    }

    // Geographic anomaly
    const countries = new Set(txns.map(t => t.location.country));
    if (countries.size > 3) {
      newAlerts.push({
        id: `alert_${Date.now()}_geo`,
        type: 'GEOGRAPHIC' as const,
        severity: 'MEDIUM' as const,
        message: `Multiple countries detected in recent transactions: ${Array.from(countries).join(', ')}`,
        timestamp: new Date()
      });
    }

    return newAlerts;
  };

  const countSuspiciousPatterns = (txns: Transaction[]) => {
    let patterns = 0;
    
    // Round number amounts (potential testing)
    patterns += txns.filter(t => t.amount % 100 === 0).length;
    
    // High-risk merchant categories
    patterns += txns.filter(t => 
      ['Gambling', 'Cryptocurrency', 'Financial'].includes(t.merchantCategory)
    ).length;
    
    return patterns;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-600 animate-pulse';
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VELOCITY': return <Zap className="w-4 h-4" />;
      case 'PATTERN': return <Target className="w-4 h-4" />;
      case 'ANOMALY': return <Brain className="w-4 h-4" />;
      case 'GEOGRAPHIC': return <Radar className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Fraud Score</p>
                <p className="text-2xl font-bold text-red-100">
                  {fraudScore.toFixed(1)}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-100">
                  {alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Patterns</p>
                <p className="text-2xl font-bold text-purple-100">
                  {suspiciousPatterns}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Protection Rate</p>
                <p className="text-2xl font-bold text-green-100">
                  {((transactions.length - alerts.length) / Math.max(transactions.length, 1) * 100).toFixed(1)}%
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Alerts Feed */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-400" />
            Live Fraud Alerts
            {alerts.length > 0 && (
              <Badge variant="outline" className="border-red-500 text-red-400 animate-pulse">
                {alerts.length} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active fraud alerts</p>
                <p className="text-sm">System monitoring for suspicious activity</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-white text-sm mb-1">{alert.message}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  >
                    ×
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
