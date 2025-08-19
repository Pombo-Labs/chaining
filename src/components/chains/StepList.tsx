'use client';

import type { Step } from '@/types';

interface StepListProps {
  steps: Step[];
  showProgress?: boolean;
  className?: string;
}

export function StepList({ steps, showProgress = true, className = '' }: StepListProps) {
  const sortedSteps = steps.sort((a, b) => a.order - b.order);

  return (
    <div className={`space-y-4 ${className}`}>
      {sortedSteps.map((step, index) => (
        <div
          key={step.id}
          className={`
            flex items-center p-4 rounded-lg border transition-colors
            ${step.isCompleted 
              ? 'bg-green-50 border-green-200' 
              : step.isTarget 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
            }
          `}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mr-4">
            {step.isCompleted ? (
              <span className="text-green-600 font-semibold">✓</span>
            ) : step.isTarget ? (
              <span className="text-blue-600 font-semibold">→</span>
            ) : (
              <span className="text-gray-400 font-semibold">{index + 1}</span>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-black">{step.title}</h3>
            {step.description && (
              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
            )}
          </div>
          {step.isTarget && showProgress && (
            <div className="flex-shrink-0 ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Current Target
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StepList;
