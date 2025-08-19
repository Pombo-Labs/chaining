import { useState } from 'react';
import type { Step } from '@/types';

export const useSteps = (initialSteps: Step[] = []) => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const addStep = () => {
    const newStep: Step = {
      id: `step_${Date.now()}`,
      title: '',
      description: '',
      order: steps.length + 1,
      isCompleted: false,
      isTarget: steps.length === 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSteps(prev => [...prev, newStep]);
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, ...updates, updatedAt: new Date() }
        : step
    ));
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index + 1,
      isTarget: index === 0 && !step.isCompleted,
    }));
    setSteps(reorderedSteps);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];
    [newSteps[stepIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[stepIndex]];
    
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    
    setSteps(reorderedSteps);
  };

  const reorderSteps = (newSteps: Step[]) => {
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    setSteps(reorderedSteps);
  };

  return {
    steps,
    setSteps,
    addStep,
    updateStep,
    removeStep,
    moveStep,
    reorderSteps,
  };
};
