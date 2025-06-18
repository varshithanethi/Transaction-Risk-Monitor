
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, AlertTriangle, RefreshCw, Activity } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Accuracy</span>
              <Target className="w-4 h-4 text-green-400" />
            </div>
            <div className={`text-xl font-bold ${getPerformanceColor(metrics.accuracy, 0.85)}`}>
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Precision</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className={`text-xl font-bold ${getPerformanceColor(metrics.precision, 0.8)}`}>
              {(metrics.precision * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Recall</span>
              <Activity className="w-4 h-4 text-yellow-400" />
            </div>
            <div className={`text-xl font-bold ${getPerformanceColor(metrics.recall, 0.8)}`}>
              {(metrics.recall * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">F1 Score</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div className={`text-xl font-bold ${getPerformanceColor(metrics.f1Score, 0.8)}`}>
              {(metrics.f1Score * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <h4 className="text-white font-medium">Error Rates</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">False Positive Rate</span>
                <span className={`font-medium ${metrics.falsePositiveRate > 0.1 ? 'text-red-400' : 'text-green-400'}`}>
                  {(metrics.falsePositiveRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">False Negative Rate</span>
                <span className={`font-medium ${metrics.falseNegativeRate > 0.1 ? 'text-red-400' : 'text-green-400'}`}>
                  {(metrics.falseNegativeRate * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-medium">Model Info</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Version</span>
                <span className="text-white font-medium">{metrics.modelVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Last Trained</span>
                <span className="text-white font-medium">
                  {metrics.trainingDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Predictions Today</span>
                <span className="text-white font-medium">{metrics.predictionsToday.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Average Confidence:</span>
            <span className={`font-medium ${getPerformanceColor(metrics.averageConfidence / 100, 0.8)}`}>
              {metrics.averageConfidence.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onUpdateModel}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Update Model
            </Button>
            <Button
              onClick={onRetrainModel}
              disabled={isTraining}
              className="bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Retrain Model
                </>
              )}
            </Button>
          </div>
        </div>

        {(metrics.accuracy < 0.8 || metrics.falsePositiveRate > 0.1) && (
          <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Performance Alert</span>
            </div>
            <p className="text-yellow-200 text-sm mt-1">
              Model performance is below optimal thresholds. Consider retraining with recent data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
