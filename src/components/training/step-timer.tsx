'use client';

import { SimpleTimer } from '@/components/ui/simple-timer';

interface StepTimerProps {
  stepId: string;
  initialTime?: number;
  onTimeUpdate: (stepId: string, time: number) => void;
}

export function StepTimer({ stepId, initialTime = 0, onTimeUpdate }: StepTimerProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border">
      <div className="text-xs text-gray-600 mb-2">Step Timer</div>
      <SimpleTimer
        initialTime={initialTime}
        onTimeChange={(time) => onTimeUpdate(stepId, time)}
      />
    </div>
  );
}
