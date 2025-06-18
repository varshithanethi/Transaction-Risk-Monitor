
import React from 'react';
import { Transaction, RiskAssessment } from '../types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MapPin, Building, Clock } from 'lucide-react';

interface TransactionFeedProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ 
  transactions, 
  riskAssessments 
}) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'bg-green-600 hover:bg-green-700';
      case 'REVIEW': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'DECLINE': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskScoreBg = (score: number) => {
    if (score >= 80) return 'bg-red-500/20 border-red-500';
    if (score >= 50) return 'bg-yellow-500/20 border-yellow-500';
    return 'bg-green-500/20 border-green-500';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Live Transaction Feed
          {transactions.length > 0 && (
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {transactions.length} transactions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start processing to see live transactions</p>
            </div>
          ) : (
            transactions.slice(0, 10).map((transaction) => {
              const assessment = riskAssessments.get(transaction.transactionId);
              
              return (
                <div
                  key={transaction.transactionId}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-gray-300">
                          {transaction.transactionId}
                        </p>
                        <p className="text-xs text-gray-500">
                          User: {transaction.userId} • Card: {transaction.cardId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {assessment && (
                        <>
                          <div className={`px-3 py-1 rounded-full border ${getRiskScoreBg(assessment.overallRiskScore)}`}>
                            <span className={`text-sm font-bold ${getRiskScoreColor(assessment.overallRiskScore)}`}>
                              {assessment.overallRiskScore}
                            </span>
                          </div>
                          <Badge className={getRecommendationColor(assessment.recommendation)}>
                            {assessment.recommendation}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Amount:</span>
                      <span className="text-white font-semibold">
                        ${transaction.amount.toLocaleString()} {transaction.currency}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Merchant:</span>
                      <span className="text-white">{transaction.merchantName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Location:</span>
                      <span className="text-white">{transaction.location.city}, {transaction.location.country}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {transaction.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Category: {transaction.merchantCategory}</span>
                      {assessment && (
                        <span>• Processing: {assessment.processingTime.toFixed(1)}ms</span>
                      )}
                    </div>
                  </div>

                  {assessment && assessment.triggeredRules.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Triggered Rules:</p>
                      <div className="flex flex-wrap gap-1">
                        {assessment.triggeredRules.map((rule) => (
                          <Badge 
                            key={rule} 
                            variant="outline" 
                            className="text-xs border-orange-600 text-orange-400"
                          >
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
