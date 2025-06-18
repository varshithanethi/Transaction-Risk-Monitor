
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Trash2, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  isProcessing: boolean;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onClearData: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isProcessing,
  onStartProcessing,
  onStopProcessing,
  onClearData
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Transaction Risk Monitor
          </h1>
          <p className="text-gray-400">Real-time fraud detection and risk assessment</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-gray-300">
            {isProcessing ? 'Processing Active' : 'Processing Stopped'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isProcessing ? (
            <Button
              onClick={onStartProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </Button>
          ) : (
            <Button
              onClick={onStopProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Processing
            </Button>
          )}
          
          <Button
            onClick={onClearData}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>
    </div>
  );
};
