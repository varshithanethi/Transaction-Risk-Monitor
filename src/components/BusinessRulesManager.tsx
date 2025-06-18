
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessRule } from '../types/businessRules';
import { Settings, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';

interface BusinessRulesManagerProps {
  rules: BusinessRule[];
  onAddRule: (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<BusinessRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const BusinessRulesManager: React.FC<BusinessRulesManagerProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    condition: '',
    action: 'FLAG' as const,
    threshold: 0,
    category: 'AMOUNT' as const,
    priority: 1,
    isActive: true
  });

  const handleAddRule = () => {
    if (newRule.name && newRule.description) {
      onAddRule(newRule);
      setNewRule({
        name: '',
        description: '',
        condition: '',
        action: 'FLAG',
        threshold: 0,
        category: 'AMOUNT',
        priority: 1,
        isActive: true
      });
      setShowAddForm(false);
    }
  };

  const toggleRuleStatus = (rule: BusinessRule) => {
    onUpdateRule(rule.id, { isActive: !rule.isActive });
  };

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

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Business Rules Manager
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {rules.filter(r => r.isActive).length} Active Rules
          </Badge>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
            <h3 className="text-white font-medium mb-4">Add New Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="e.g., High Amount Alert"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({...newRule, category: e.target.value as any})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="AMOUNT">Amount</option>
                  <option value="VELOCITY">Velocity</option>
                  <option value="LOCATION">Location</option>
                  <option value="MERCHANT">Merchant</option>
                  <option value="TIME">Time</option>
                  <option value="DEVICE">Device</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Action</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value as any})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="FLAG">Flag</option>
                  <option value="BLOCK">Block</option>
                  <option value="LIMIT">Limit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Threshold</label>
                <input
                  type="number"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({...newRule, threshold: Number(e.target.value)})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="e.g., 1000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Describe what this rule does..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddRule} className="bg-green-600 hover:bg-green-700">
                Add Rule
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {rules.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No business rules configured</p>
              <p className="text-sm">Add your first rule to get started</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
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
                      onClick={() => toggleRuleStatus(rule)}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
