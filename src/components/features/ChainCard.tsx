'use client';

import { Chain } from '@/types';
import { Card } from '@/components/ui/card';

interface ChainCardProps {
  chain: Chain;
  onClick: () => void;
  className?: string;
}

interface ChainCardProgressProps {
  completedSteps: number;
  totalSteps: number;
}

interface ChainCardMetadataProps {
  category: string;
  chainingMethod: string;
}

// Single Responsibility: Handle progress calculation and display
function ChainCardProgress({ completedSteps, totalSteps }: ChainCardProgressProps) {
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
        <span className="font-medium">Progress</span>
        <span className="font-semibold">{completedSteps}/{totalSteps} steps</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {progressPercentage > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {Math.round(progressPercentage)}% complete
        </p>
      )}
    </div>
  );
}

// Single Responsibility: Display chain metadata
function ChainCardMetadata({ category, chainingMethod }: ChainCardMetadataProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          Category
        </span>
        <span className="text-sm text-gray-700 capitalize font-medium">
          {category.replace('_', ' ')}
        </span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          Method
        </span>
        <span className="text-sm text-gray-700 capitalize font-medium">
          {chainingMethod.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}

// Main component following Open/Closed Principle - extensible without modification
export function ChainCard({ chain, onClick, className = '' }: ChainCardProps) {
  const completedSteps = chain.steps.filter(step => step.isCompleted).length;
  const totalSteps = chain.steps.length;

  return (
    <Card
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 p-6 shadow-sm 
        hover:shadow-md hover:border-gray-300 transition-all duration-200 
        cursor-pointer group h-full flex flex-col
        ${className}
      `}
    >
      {/* Card Header - Fixed height for consistency */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-xl font-medium text-black mb-3 group-hover:text-gray-800 transition-colors line-clamp-2 min-h-[3.5rem]">
          {chain.title}
        </h3>
        {chain.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {chain.description}
          </p>
        )}
      </div>

      {/* Progress Section - Flexible content */}
      <div className="flex-grow">
        <ChainCardProgress 
          completedSteps={completedSteps} 
          totalSteps={totalSteps} 
        />
      </div>

      {/* Card Footer - Fixed height for consistency */}
      <div className="flex-shrink-0">
        <ChainCardMetadata 
          category={chain.category} 
          chainingMethod={chain.chainingMethod} 
        />
      </div>
    </Card>
  );
}

export default ChainCard;
