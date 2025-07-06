
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';

interface FraudMetricsProps {
  metrics: {
    activeIncidents: number;
    resolvedToday: number;
    falsePositiveRate: number;
    avgResolutionTime: number;
  };
}

export const FraudMetrics: React.FC<FraudMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-200">Active Incidents</p>
              <p className="text-2xl font-bold text-red-100">{metrics.activeIncidents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div className="mt-2">
            <Badge className="bg-red-600">
              Requires Attention
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-200">Resolved Today</p>
              <p className="text-2xl font-bold text-green-100">{metrics.resolvedToday}</p>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2">
            <Badge className="bg-green-600">
              +12% vs Yesterday
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-200">False Positive</p>
              <p className="text-2xl font-bold text-yellow-100">{metrics.falsePositiveRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="mt-2">
            <Badge className="bg-yellow-600">
              Target: &lt;5%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-200">Avg Resolution</p>
              <p className="text-2xl font-bold text-blue-100">{metrics.avgResolutionTime}min</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2">
            <Badge className="bg-blue-600">
              SLA: &lt;30min
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
