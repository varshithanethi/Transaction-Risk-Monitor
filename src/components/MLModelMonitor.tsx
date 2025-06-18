
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw } from 'lucide-react';
import { ModelMetrics } from './ModelMetrics';
import { ModelInfo } from './ModelInfo';
import { ModelControls } from './ModelControls';

interface MLModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  modelVersion: string;
  trainingDate: Date;
  predictionsToday: number;
  averageConfidence: number;
}

interface MLModelMonitorProps {
  metrics: MLModelMetrics;
  isTraining: boolean;
  onRetrainModel: () => void;
  onUpdateModel: () => void;
}

export const MLModelMonitor: React.FC<MLModelMonitorProps> = ({
  metrics,
  isTraining,
  onRetrainModel,
  onUpdateModel
}) => {
  const getPerformanceColor = (value: number, threshold: number = 0.8) => {
    if (value >= threshold) return 'text-green-400';
    if (value >= threshold - 0.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceStatus = (accuracy: number) => {
    if (accuracy >= 0.9) return { status: 'Excellent', color: 'bg-green-600' };
    if (accuracy >= 0.8) return { status: 'Good', color: 'bg-blue-600' };
    if (accuracy >= 0.7) return { status: 'Fair', color: 'bg-yellow-600' };
    return { status: 'Poor', color: 'bg-red-600' };
  };

  const performanceStatus = getPerformanceStatus(metrics.accuracy);

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          ML Model Performance
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={performanceStatus.color}>
            {performanceStatus.status}
          </Badge>
          {isTraining && (
            <Badge variant="outline" className="border-blue-500 text-blue-400 animate-pulse">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Training
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ModelMetrics
          accuracy={metrics.accuracy}
          precision={metrics.precision}
          recall={metrics.recall}
          f1Score={metrics.f1Score}
          getPerformanceColor={getPerformanceColor}
        />

        <ModelInfo
          metrics={metrics}
          getPerformanceColor={getPerformanceColor}
        />

        <ModelControls
          averageConfidence={metrics.averageConfidence}
          accuracy={metrics.accuracy}
          falsePositiveRate={metrics.falsePositiveRate}
          isTraining={isTraining}
          onRetrainModel={onRetrainModel}
          onUpdateModel={onUpdateModel}
          getPerformanceColor={getPerformanceColor}
        />
      </CardContent>
    </Card>
  );
};
