
import React from 'react';
import { Transaction, RiskAssessment } from '../types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AlertPanelProps {
  highRiskTransactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ 
  highRiskTransactions, 
  riskAssessments 
}) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'bg-green-600';
      case 'REVIEW': return 'bg-yellow-600';
      case 'DECLINE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          High Risk Alerts
        </CardTitle>
        <Badge variant="destructive" className="bg-red-600">
          {highRiskTransactions.length} Active
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-3 h-full overflow-y-auto">
          {highRiskTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Shield className="w-12 h-12 mb-2" />
              <p>No high-risk transactions detected</p>
              <p className="text-sm">System is monitoring actively</p>
            </div>
          ) : (
            highRiskTransactions.map((transaction) => {
              const assessment = riskAssessments.get(transaction.transactionId);
              if (!assessment) return null;

              return (
                <div
                  key={transaction.transactionId}
                  className="p-3 bg-gray-900/50 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-300">
                        {transaction.transactionId.slice(-8)}
                      </span>
                      <Badge className={getRecommendationColor(assessment.recommendation)}>
                        {assessment.recommendation}
                      </Badge>
                    </div>
                    <span className={`text-lg font-bold ${getRiskScoreColor(assessment.overallRiskScore)}`}>
                      {assessment.overallRiskScore}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white ml-1">${transaction.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Merchant:</span>
                      <span className="text-white ml-1">{transaction.merchantName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white ml-1">{transaction.location.country}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-1">
                        {transaction.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {assessment.triggeredRules.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-400">Triggered Rules:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {assessment.triggeredRules.map((rule) => (
                          <Badge key={rule} variant="outline" className="text-xs border-yellow-600 text-yellow-400">
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
