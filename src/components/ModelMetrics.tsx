
import React from 'react';
import { Target, TrendingUp, Activity } from 'lucide-react';

interface ModelMetricsProps {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  getPerformanceColor: (value: number, threshold?: number) => string;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({
  accuracy,
  precision,
  recall,
  f1Score,
  getPerformanceColor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Accuracy</span>
          <Target className="w-4 h-4 text-green-400" />
        </div>
        <div className={`text-xl font-bold ${getPerformanceColor(accuracy, 0.85)}`}>
          {(accuracy * 100).toFixed(1)}%
        </div>
      </div>

      <div className="p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Precision</span>
          <TrendingUp className="w-4 h-4 text-blue-400" />
        </div>
        <div className={`text-xl font-bold ${getPerformanceColor(precision, 0.8)}`}>
          {(precision * 100).toFixed(1)}%
        </div>
      </div>

      <div className="p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Recall</span>
          <Activity className="w-4 h-4 text-yellow-400" />
        </div>
        <div className={`text-xl font-bold ${getPerformanceColor(recall, 0.8)}`}>
          {(recall * 100).toFixed(1)}%
        </div>
      </div>

      <div className="p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">F1 Score</span>
          <Target className="w-4 h-4 text-purple-400" />
        </div>
        <div className={`text-xl font-bold ${getPerformanceColor(f1Score, 0.8)}`}>
          {(f1Score * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
