
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, Clock, CheckCircle } from 'lucide-react';

interface IncidentCardProps {
  incident: any;
  onResolve: (id: string) => void;
  onInvestigate: (id: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onResolve,
  onInvestigate
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'LOW': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">{incident.type}</h4>
              <p className="text-sm text-gray-400">
                {incident.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
          <Badge className={getSeverityColor(incident.severity)}>
            {incident.severity}
          </Badge>
        </div>

        <p className="text-gray-300 text-sm mb-3">{incident.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-gray-400">Affected Users:</span>
            <span className="text-white ml-1">{incident.affectedUsers}</span>
          </div>
          <div>
            <span className="text-gray-400">Risk Score:</span>
            <span className="text-red-400 ml-1 font-bold">{incident.riskScore}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onInvestigate(incident.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-3 h-3 mr-1" />
            Investigate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onResolve(incident.id)}
            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
