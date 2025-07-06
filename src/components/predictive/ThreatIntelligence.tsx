
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export const ThreatIntelligence: React.FC = () => {
  const threatData = [
    { category: 'Card Testing', risk: 92, trend: '+15%', color: 'text-red-400' },
    { category: 'Account Takeover', risk: 78, trend: '+8%', color: 'text-orange-400' },
    { category: 'Synthetic Identity', risk: 65, trend: '-3%', color: 'text-yellow-400' },
    { category: 'Friendly Fraud', risk: 43, trend: '-12%', color: 'text-green-400' }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-red-400" />
          Threat Intelligence Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {threatData.map((threat, index) => (
            <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{threat.category}</h4>
                <Badge 
                  variant="outline"
                  className={`border-current ${threat.color}`}
                >
                  {threat.trend}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full`}
                    style={{ 
                      width: `${threat.risk}%`,
                      backgroundColor: threat.risk > 80 ? '#EF4444' : threat.risk > 60 ? '#F59E0B' : '#10B981'
                    }}
                  />
                </div>
                <span className={`text-sm font-bold ${threat.color}`}>
                  {threat.risk}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
