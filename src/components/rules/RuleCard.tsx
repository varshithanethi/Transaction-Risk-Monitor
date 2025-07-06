
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Power, PowerOff, Trash2 } from 'lucide-react';
import { BusinessRule } from '../../types/businessRules';

interface RuleCardProps {
  rule: BusinessRule;
  onUpdateRule: (ruleId: string, updates: Partial<BusinessRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({ 
  rule, 
  onUpdateRule, 
  onDeleteRule 
}) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'BLOCK': return 'bg-red-600';
      case 'FLAG': return 'bg-yellow-600';
      case 'LIMIT': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'VELOCITY': 'bg-blue-500/20 text-blue-400 border-blue-500',
      'AMOUNT': 'bg-green-500/20 text-green-400 border-green-500',
      'LOCATION': 'bg-purple-500/20 text-purple-400 border-purple-500',
      'MERCHANT': 'bg-orange-500/20 text-orange-400 border-orange-500',
      'TIME': 'bg-pink-500/20 text-pink-400 border-pink-500',
      'DEVICE': 'bg-cyan-500/20 text-cyan-400 border-cyan-500'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500';
  };

  const toggleRuleStatus = () => {
    onUpdateRule(rule.id, { isActive: !rule.isActive });
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        rule.isActive 
          ? 'bg-gray-900/50 border-gray-600' 
          : 'bg-gray-800/30 border-gray-700 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium">{rule.name}</h4>
            <Badge className={getCategoryColor(rule.category)} variant="outline">
              {rule.category}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getActionColor(rule.action)}>
            {rule.action}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleRuleStatus}
            className="p-1"
          >
            {rule.isActive ? (
              <Power className="w-4 h-4 text-green-400" />
            ) : (
              <PowerOff className="w-4 h-4 text-gray-400" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteRule(rule.id)}
            className="p-1 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-2">{rule.description}</p>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">
          Threshold: <span className="text-white">{rule.threshold}</span>
        </span>
        <span className="text-gray-400">
          Priority: <span className="text-white">{rule.priority}</span>
        </span>
        <span className="text-gray-400">
          Status: <span className={rule.isActive ? 'text-green-400' : 'text-red-400'}>
            {rule.isActive ? 'Active' : 'Inactive'}
          </span>
        </span>
      </div>
    </div>
  );
};
