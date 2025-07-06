
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BusinessRule } from '../../types/businessRules';

interface RuleFormProps {
  onAddRule: (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({ onAddRule, onCancel }) => {
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

  const handleSubmit = () => {
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
      onCancel();
    }
  };

  return (
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
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          Add Rule
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
