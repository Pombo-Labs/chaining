'use client';

import { useState } from 'react';
import { Chain } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChainCardProps {
  chain: Chain;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  isDeleting?: boolean;
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
export function ChainCard({ chain, onClick, onEdit, onDelete, className = '', isDeleting = false }: ChainCardProps) {
  const completedSteps = chain.steps.filter(step => step.isCompleted).length;
  const totalSteps = chain.steps.length;
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Card
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 p-6 shadow-sm 
        hover:shadow-md hover:border-gray-300 transition-all duration-200 
        cursor-pointer group h-full flex flex-col relative
        ${className}
      `}
    >
      {/* Three-dot menu */}
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={handleMenuClick}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="8" cy="13" r="1.5"/>
            </svg>
          </Button>
          
          {showMenu && (
            <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex items-center justify-center z-20">
          <div className="text-center p-6">
            <div className="text-red-600 mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Delete Chain?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete "{chain.title}" and all its data.
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={cancelDelete}
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card Header - Fixed height for consistency */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-xl font-medium text-black mb-3 group-hover:text-gray-800 transition-colors line-clamp-2 min-h-[3.5rem] pr-8">
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
