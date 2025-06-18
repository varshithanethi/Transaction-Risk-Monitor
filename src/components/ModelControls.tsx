
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, AlertTriangle } from 'lucide-react';

interface ModelControlsProps {
  averageConfidence: number;
  accuracy: number;
  falsePositiveRate: number;
  isTraining: boolean;
  onRetrainModel: () => void;
  onUpdateModel: () => void;
  getPerformanceColor: (value: number, threshold?: number) => string;
}

export const ModelControls: React.FC<ModelControlsProps> = ({
  averageConfidence,
  accuracy,
  falsePositiveRate,
  isTraining,
  onRetrainModel,
  onUpdateModel,
  getPerformanceColor
}) => {
  return (
    <>
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Average Confidence:</span>
          <span className={`font-medium ${getPerformanceColor(averageConfidence / 100, 0.8)}`}>
            {averageConfidence.toFixed(1)}%
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

      {(accuracy < 0.8 || falsePositiveRate > 0.1) && (
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
    </>
  );
};
