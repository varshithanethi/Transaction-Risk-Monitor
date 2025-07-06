
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield } from 'lucide-react';
import { Transaction, RiskAssessment } from '../../types/transaction';
import { FraudMetrics } from './FraudMetrics';
import { IncidentCard } from './IncidentCard';

interface FraudMonitorProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

export const FraudMonitor: React.FC<FraudMonitorProps> = ({
  transactions,
  riskAssessments
}) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeIncidents: 0,
    resolvedToday: 23,
    falsePositiveRate: 3.2,
    avgResolutionTime: 18
  });

  useEffect(() => {
    // Generate mock incidents based on high-risk transactions
    const highRiskTransactions = transactions.filter(t => {
      const assessment = riskAssessments.get(t.transactionId);
      return assessment && assessment.overallRiskScore >= 80;
    });

    const mockIncidents = highRiskTransactions.slice(0, 8).map((transaction, index) => ({
      id: `incident_${transaction.transactionId}`,
      type: ['Card Testing Attack', 'Velocity Fraud', 'Geo-Location Anomaly', 'Device Fingerprint Mismatch'][index % 4],
      severity: ['CRITICAL', 'HIGH', 'MEDIUM'][Math.floor(Math.random() * 3)],
      description: `Suspicious activity detected on transaction ${transaction.transactionId.slice(-8)}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      affectedUsers: Math.floor(Math.random() * 20) + 1,
      riskScore: riskAssessments.get(transaction.transactionId)?.overallRiskScore || 85,
      status: 'ACTIVE'
    }));

    setIncidents(mockIncidents);
    setMetrics(prev => ({ ...prev, activeIncidents: mockIncidents.length }));
  }, [transactions, riskAssessments]);

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
    setMetrics(prev => ({ 
      ...prev, 
      activeIncidents: prev.activeIncidents - 1,
      resolvedToday: prev.resolvedToday + 1
    }));
  };

  const handleInvestigateIncident = (incidentId: string) => {
    console.log('Investigating incident:', incidentId);
  };

  return (
    <div className="space-y-6">
      <FraudMetrics metrics={metrics} />

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Active Fraud Incidents
            <Badge className="bg-red-600">{incidents.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active incidents</p>
              <p className="text-sm">All systems operating normally</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onResolve={handleResolveIncident}
                  onInvestigate={handleInvestigateIncident}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
