
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Shield, TrendingUp, Eye, Clock,
  Activity, Zap, Target, Brain, Radar, Ban, CheckCircle,
  Users, CreditCard, MapPin, Calendar
} from 'lucide-react';
import { Transaction, RiskAssessment } from '../types/transaction';

interface FraudMonitorProps {
  transactions: Transaction[];
  riskAssessments: Map<string, RiskAssessment>;
}

interface FraudIncident {
  id: string;
  type: 'SUSPICIOUS_PATTERN' | 'HIGH_VELOCITY' | 'GEO_ANOMALY' | 'DEVICE_FRAUD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: Date;
  transactionIds: string[];
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
}

export const FraudMonitor: React.FC<FraudMonitorProps> = ({
  transactions,
  riskAssessments
}) => {
  const [incidents, setIncidents] = useState<FraudIncident[]>([]);
  const [blockedTransactions, setBlockedTransactions] = useState<string[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<FraudIncident | null>(null);

  useEffect(() => {
    // Real-time fraud incident detection
    const interval = setInterval(() => {
      if (transactions.length > 0) {
        const recentTransactions = transactions.slice(0, 10);
        const newIncidents = detectFraudIncidents(recentTransactions);
        
        if (newIncidents.length > 0) {
          setIncidents(prev => [...newIncidents, ...prev.slice(0, 15)]);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [transactions, riskAssessments]);

  const detectFraudIncidents = (txns: Transaction[]): FraudIncident[] => {
    const incidents: FraudIncident[] = [];
    
    // Detect card testing patterns
    const cardTestingPattern = txns.filter(t => t.amount < 10 && t.amount > 0);
    if (cardTestingPattern.length >= 3) {
      incidents.push({
        id: `incident_${Date.now()}_card_testing`,
        type: 'SUSPICIOUS_PATTERN',
        severity: 'HIGH',
        title: 'Card Testing Attack Detected',
        description: `${cardTestingPattern.length} small amount transactions detected, possible card validation attempt`,
        timestamp: new Date(),
        transactionIds: cardTestingPattern.map(t => t.transactionId),
        status: 'OPEN'
      });
    }

    // Detect geographic anomalies
    const countries = new Set(txns.map(t => t.location.country));
    if (countries.size > 2) {
      incidents.push({
        id: `incident_${Date.now()}_geo`,
        type: 'GEO_ANOMALY',
        severity: 'MEDIUM',
        title: 'Multi-Country Transaction Pattern',
        description: `Transactions from ${countries.size} different countries: ${Array.from(countries).join(', ')}`,
        timestamp: new Date(),
        transactionIds: txns.map(t => t.transactionId),
        status: 'OPEN'
      });
    }

    // Detect high-risk merchant concentration
    const merchantRisk = txns.filter(t => ['Gambling', 'Cryptocurrency'].includes(t.merchantCategory));
    if (merchantRisk.length >= 2) {
      incidents.push({
        id: `incident_${Date.now()}_merchant`,
        type: 'SUSPICIOUS_PATTERN',
        severity: 'MEDIUM',
        title: 'High-Risk Merchant Activity',
        description: `Multiple transactions with high-risk merchants detected`,
        timestamp: new Date(),
        transactionIds: merchantRisk.map(t => t.transactionId),
        status: 'OPEN'
      });
    }

    return incidents;
  };

  const updateIncidentStatus = (incidentId: string, status: FraudIncident['status']) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, status } : incident
    ));
  };

  const blockTransaction = (transactionId: string) => {
    setBlockedTransactions(prev => [...prev, transactionId]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-red-400';
      case 'INVESTIGATING': return 'text-yellow-400';
      case 'RESOLVED': return 'text-green-400';
      case 'FALSE_POSITIVE': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const activeIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'FALSE_POSITIVE');

  return (
    <div className="space-y-6">
      {/* Incident Response Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Active Incidents</p>
                <p className="text-2xl font-bold text-red-100">{activeIncidents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">Investigating</p>
                <p className="text-2xl font-bold text-yellow-100">
                  {incidents.filter(i => i.status === 'INVESTIGATING').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Blocked TXNs</p>
                <p className="text-2xl font-bold text-blue-100">{blockedTransactions.length}</p>
              </div>
              <Ban className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Resolved Today</p>
                <p className="text-2xl font-bold text-green-100">{resolvedIncidents.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Incidents */}
        <Card className="xl:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              Active Fraud Incidents
              {activeIncidents.length > 0 && (
                <Badge variant="outline" className="border-red-500 text-red-400 animate-pulse">
                  {activeIncidents.length} Active
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeIncidents.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active fraud incidents</p>
                  <p className="text-sm">System monitoring for suspicious patterns</p>
                </div>
              ) : (
                activeIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {incident.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className={`text-sm ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1">{incident.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{incident.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {incident.transactionIds.length} transactions involved
                      </span>
                      <span className="text-xs text-gray-500">
                        {incident.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Incident Details Panel */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedIncident ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">{selectedIncident.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{selectedIncident.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Severity:</span>
                      <Badge className={getSeverityColor(selectedIncident.severity)}>
                        {selectedIncident.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transactions:</span>
                      <span className="text-white">{selectedIncident.transactionIds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Detected:</span>
                      <span className="text-white">{selectedIncident.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => updateIncidentStatus(selectedIncident.id, 'INVESTIGATING')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                  >
                    Start Investigation
                  </Button>
                  <Button
                    onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    onClick={() => updateIncidentStatus(selectedIncident.id, 'FALSE_POSITIVE')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300"
                    size="sm"
                  >
                    False Positive
                  </Button>
                </div>

                {/* Transaction Actions */}
                <div className="border-t border-gray-700 pt-4">
                  <h5 className="text-white font-medium mb-2">Quick Actions</h5>
                  <div className="space-y-2">
                    {selectedIncident.transactionIds.slice(0, 3).map(txnId => (
                      <div key={txnId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-mono">{txnId.slice(-8)}</span>
                        <Button
                          onClick={() => blockTransaction(txnId)}
                          disabled={blockedTransactions.includes(txnId)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-red-600 text-red-400"
                        >
                          {blockedTransactions.includes(txnId) ? 'Blocked' : 'Block'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select an incident to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
