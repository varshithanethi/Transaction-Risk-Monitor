import React, { useState, useMemo } from 'react';
import { Transaction, RiskAssessment } from '../types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, MapPin, Building, Clock, Search, Filter,
  ArrowUpDown, Eye, AlertTriangle, Shield, TrendingUp
} from 'lucide-react';

interface TransactionFeedProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ 
  transactions, 
  riskAssessments 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'risk'>('timestamp');
  const [filterBy, setFilterBy] = useState<'all' | 'high-risk' | 'flagged' | 'approved' | 'declined'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

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

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const assessment = riskAssessments.get(transaction.transactionId);
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !transaction.transactionId.toLowerCase().includes(searchLower) &&
          !transaction.merchantName.toLowerCase().includes(searchLower) &&
          !transaction.location.country.toLowerCase().includes(searchLower) &&
          !transaction.userId.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      switch (filterBy) {
        case 'high-risk':
          return assessment && assessment.overallRiskScore >= 70;
        case 'flagged':
          return assessment && assessment.triggeredRules.length > 0;
        case 'approved':
          return assessment && assessment.recommendation === 'APPROVE';
        case 'declined':
          return assessment && assessment.recommendation === 'DECLINE';
        default:
          return true;
      }
    });

    // Sort transactions
    return filtered.sort((a, b) => {
      const assessmentA = riskAssessments.get(a.transactionId);
      const assessmentB = riskAssessments.get(b.transactionId);

      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'risk':
          return (assessmentB?.overallRiskScore || 0) - (assessmentA?.overallRiskScore || 0);
        case 'timestamp':
        default:
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });
  }, [transactions, riskAssessments, searchTerm, sortBy, filterBy]);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Live Transaction Feed
            {transactions.length > 0 && (
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {filteredTransactions.length} filtered / {transactions.length} total
              </Badge>
            )}
          </CardTitle>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-600 text-white w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white text-sm"
              >
                <option value="timestamp">Latest First</option>
                <option value="amount">Highest Amount</option>
                <option value="risk">Highest Risk</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white text-sm"
              >
                <option value="all">All Transactions</option>
                <option value="high-risk">High Risk</option>
                <option value="flagged">Flagged</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}</p>
              <p className="text-sm">
                {transactions.length === 0 ? 'Start processing to see live transactions' : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            filteredTransactions.slice(0, 25).map((transaction) => {
              const assessment = riskAssessments.get(transaction.transactionId);
              const isSelected = selectedTransaction === transaction.transactionId;
              
              return (
                <div
                  key={transaction.transactionId}
                  className={`p-4 bg-gray-900/50 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTransaction(isSelected ? null : transaction.transactionId)}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
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
                      <span className="text-white truncate">{transaction.merchantName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Location:</span>
                      <span className="text-white">{transaction.location.city}, {transaction.location.country}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-gray-700 gap-2">
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

                  {/* Expanded details */}
                  {isSelected && assessment && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <h4 className="text-sm font-medium text-white">Risk Factor Breakdown</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(assessment.riskFactors).map(([factor, score]) => (
                          <div key={factor} className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 capitalize">
                              {factor.replace('Risk', '')}:
                            </span>
                            <span className={`text-xs font-medium ${getRiskScoreColor(score)}`}>
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-400">Confidence Level:</span>
                        <span className="text-xs font-medium text-blue-400">{assessment.confidence.toFixed(1)}%</span>
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
