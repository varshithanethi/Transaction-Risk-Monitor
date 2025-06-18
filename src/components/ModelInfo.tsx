
import React from 'react';

interface MLModelMetrics {
  falsePositiveRate: number;
  falseNegativeRate: number;
  modelVersion: string;
  trainingDate: Date;
  predictionsToday: number;
  averageConfidence: number;
}

interface ModelInfoProps {
  metrics: MLModelMetrics;
  getPerformanceColor: (value: number, threshold?: number) => string;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({
  metrics,
  getPerformanceColor
}) => {
  return (
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
  );
};
