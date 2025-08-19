'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/ui/timer';
import type { Step } from '@/types';

interface StepEditorProps {
  step: Step;
  index: number;
  onUpdate: (stepId: string, updates: Partial<Step>) => void;
  onMoveUp: (stepId: string, direction: 'up') => void;
  onMoveDown: (stepId: string, direction: 'down') => void;
  onRemove: (stepId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function StepEditor({
  step,
  index,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: StepEditorProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4">
        {/* Step Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-2">
          <span className="text-gray-600 font-semibold text-sm">{index + 1}</span>
        </div>

        {/* Step Content */}
        <div className="flex-grow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step Title *
            </label>
            <Input
              value={step.title}
              onChange={(e) => onUpdate(step.id, { title: e.target.value })}
              placeholder="e.g., Turn on water"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <Textarea
              value={step.description || ''}
              onChange={(e) => onUpdate(step.id, { description: e.target.value })}
              placeholder="Detailed instructions for this step..."
              rows={2}
              className="w-full resize-none"
            />
          </div>

          {/* Timer Section */}
          <div className="border-t border-gray-100 pt-4">
            {!step.hasTimer ? (
              <Button
                onClick={() => onUpdate(step.id, { hasTimer: true, estimatedTime: 0 })}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                + Add Timer
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Timer enabled</span>
                <Button
                  onClick={() => onUpdate(step.id, { hasTimer: false, estimatedTime: 0, actualTime: 0 })}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Timer
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step Actions */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button
            onClick={() => onMoveUp(step.id, 'up')}
            disabled={!canMoveUp}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
          >
            ↑
          </Button>
          <Button
            onClick={() => onMoveDown(step.id, 'down')}
            disabled={!canMoveDown}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
          >
            ↓
          </Button>
          <Button
            onClick={() => onRemove(step.id)}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StepEditor;
