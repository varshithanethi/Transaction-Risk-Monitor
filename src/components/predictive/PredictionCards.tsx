
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Target, Shield } from 'lucide-react';

interface PredictionCardsProps {
  predictions: {
    nextHourRisk: number;
    expectedVolume: number;
    anomalyScore: number;
    modelAccuracy: number;
    confidence: number;
  };
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({ predictions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-200">Next Hour Risk</p>
              <p className="text-2xl font-bold text-blue-100">{predictions.nextHourRisk}%</p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {predictions.confidence}% Confidence
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-200">Expected Volume</p>
              <p className="text-2xl font-bold text-purple-100">{predictions.expectedVolume}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              Next Hour
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-200">Anomaly Score</p>
              <p className="text-2xl font-bold text-yellow-100">{predictions.anomalyScore}</p>
            </div>
            <Target className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              Current
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-200">Model Accuracy</p>
              <p className="text-2xl font-bold text-green-100">{predictions.modelAccuracy}%</p>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="border-green-500 text-green-400">
              Last 7 Days
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
