'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepEditor } from './StepEditor';
import type { Step } from '@/types';

interface StepManagerProps {
  steps: Step[];
  onAddStep: () => void;
  onUpdateStep: (stepId: string, updates: Partial<Step>) => void;
  onMoveStep: (stepId: string, direction: 'up' | 'down') => void;
  onRemoveStep: (stepId: string) => void;
  isEditing?: boolean;
}

export function StepManager({
  steps,
  onAddStep,
  onUpdateStep,
  onMoveStep,
  onRemoveStep,
  isEditing = true,
}: StepManagerProps) {
  if (!isEditing) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-black">Steps</h2>
        <Button
          onClick={onAddStep}
          className="bg-black text-white hover:bg-gray-800"
        >
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No steps added yet</div>
          <p className="text-gray-400 text-sm mb-6">
            Add steps to create your skill chain
          </p>
          <Button
            onClick={onAddStep}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add First Step
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <StepEditor
              key={step.id}
              step={step}
              index={index}
              onUpdate={onUpdateStep}
              onMoveUp={onMoveStep}
              onMoveDown={onMoveStep}
              onRemove={onRemoveStep}
              canMoveUp={index > 0}
              canMoveDown={index < steps.length - 1}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default StepManager;
