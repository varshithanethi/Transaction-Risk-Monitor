
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessRule } from '../../types/businessRules';
import { Settings, Plus } from 'lucide-react';
import { RuleForm } from './RuleForm';
import { RuleCard } from './RuleCard';

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
          <RuleForm 
            onAddRule={onAddRule}
            onCancel={() => setShowAddForm(false)}
          />
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
              <RuleCard
                key={rule.id}
                rule={rule}
                onUpdateRule={onUpdateRule}
                onDeleteRule={onDeleteRule}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
