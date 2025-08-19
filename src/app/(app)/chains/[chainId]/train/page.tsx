'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getChain, createTrainingSession } from '@/lib/firebase/firestore';
import { DashboardHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Chain } from '@/types';

type StepStatus = 'skipped' | 'prompted' | 'independent' | 'not_attempted';

interface StepResult {
  stepId: string;
  status: StepStatus;
  notes: string;
}

export default function TrainChainPage() {
  const { chainId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStepIds, setSelectedStepIds] = useState<Set<string>>(new Set());
  
  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [stepResults, setStepResults] = useState<Record<string, StepResult>>({});
  const [sessionNotes, setSessionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !chainId) return;

    const fetchChain = async () => {
      setLoading(true);
      const { chain: fetchedChain, error } = await getChain(chainId as string);
      
      if (error) {
        setError(error);
      } else if (fetchedChain) {
        setChain(fetchedChain);
        
        // Get selected steps from URL params
        const selectedStepsParam = searchParams.get('selectedSteps');
        const selectedIds = selectedStepsParam 
          ? new Set(selectedStepsParam.split(','))
          : new Set(fetchedChain.steps.map(step => step.id)); // Default to all steps if no selection
        setSelectedStepIds(selectedIds);
        
        // Initialize step results
        const initialResults: Record<string, StepResult> = {};
        fetchedChain.steps.forEach(step => {
          initialResults[step.id] = {
            stepId: step.id,
            status: 'not_attempted',
            notes: ''
          };
        });
        setStepResults(initialResults);
      }
      setLoading(false);
    };

    fetchChain();
  }, [user, chainId, searchParams]);

  const handleBackToChain = () => {
    router.push(`/chains/${chainId}`);
  };

  const startTraining = () => {
    setIsTraining(true);
    setSessionStartTime(new Date());
    setPausedTime(0);
  };

  // Auto-start training when component loads
  useEffect(() => {
    if (chain && selectedStepIds.size > 0 && !isTraining) {
      startTraining();
    }
  }, [chain, selectedStepIds, isTraining]);

  const pauseTraining = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setSessionStartTime(new Date());
      setPausedTime(0);
    } else {
      // Pause
      setIsPaused(true);
      if (sessionStartTime) {
        const currentPausedTime = Date.now() - sessionStartTime.getTime();
        setPausedTime(prev => prev + currentPausedTime);
      }
    }
  };

  const saveSession = async () => {
    if (!chain || !sessionStartTime || !user) return;

    setSaving(true);
    try {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - sessionStartTime.getTime() - pausedTime) / (1000 * 60)); // in minutes
      
      const sessionData = {
        chainId: chain.id,
        userId: user.uid,
        date: sessionStartTime,
        stepResults: Object.values(stepResults).map(result => ({
          stepId: result.stepId,
          status: result.status as 'independent' | 'prompted' | 'not-attempted',
          attempts: result.status === 'not_attempted' ? 0 : 1,
          timeSpent: Math.round(duration / Object.values(stepResults).length * 60), // rough estimate in seconds
          notes: result.notes
        })),
        duration,
        notes: sessionNotes
      };

      const { id, error } = await createTrainingSession(sessionData);
      
      if (error) {
        console.error('Error saving training session:', error);
      } else {
        console.log('Training session saved:', id);
        router.push(`/chains/${chainId}`);
      }
    } catch (error) {
      console.error('Error saving training:', error);
    } finally {
      setSaving(false);
    }
  };

  const submitSession = async () => {
    if (!chain || !sessionStartTime || !user) return;

    setSaving(true);
    try {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - sessionStartTime.getTime() - pausedTime) / (1000 * 60)); // in minutes
      
      const sessionData = {
        chainId: chain.id,
        userId: user.uid,
        date: sessionStartTime,
        stepResults: Object.values(stepResults).map(result => ({
          stepId: result.stepId,
          status: result.status as 'independent' | 'prompted' | 'not-attempted',
          attempts: result.status === 'not_attempted' ? 0 : 1,
          timeSpent: Math.round(duration / Object.values(stepResults).length * 60), // rough estimate in seconds
          notes: result.notes
        })),
        duration,
        notes: sessionNotes
      };

      const { id, error } = await createTrainingSession(sessionData);
      
      if (error) {
        console.error('Error submitting training session:', error);
      } else {
        console.log('Training session submitted:', id);
        router.push(`/chains/${chainId}`);
      }
    } catch (error) {
      console.error('Error submitting training:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStepStatusChange = (stepId: string, status: StepStatus) => {
    setStepResults(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        status
      }
    }));
  };

  const handleStepNotesChange = (stepId: string, notes: string) => {
    setStepResults(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        notes
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !chain) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            {error || 'Chain not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToChain}
            className="text-gray-600 hover:text-black transition-colors mb-4"
          >
            ← Back to Chain
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Training: {chain.title}
          </h1>
          <p className="text-gray-600">
            {chain.chainingMethod} • {chain.category}
          </p>
        </div>

        {/* Training view */}
          <div className="space-y-6">
            {/* Session Controls */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={pauseTraining}
                    variant={isPaused ? "default" : "outline"}
                    disabled={saving}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {isPaused ? 'Session Paused' : 'Session Active'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={saveSession} 
                    variant="outline"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save & Continue Later'}
                  </Button>
                  <Button 
                    onClick={submitSession} 
                    variant="default"
                    disabled={saving}
                  >
                    {saving ? 'Submitting...' : 'Submit Session'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Step List */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Training Steps</h3>
              <div className="space-y-4">
                {chain.steps.map((step, index) => {
                  const result = stepResults[step.id];
                  const status = result?.status || 'not_attempted';
                  const isSelected = selectedStepIds.has(step.id);
                  
                  return (
                    <div key={step.id} className={`border rounded-lg p-4 transition-all ${
                      isSelected 
                        ? 'bg-white border-gray-300' 
                        : 'bg-gray-100 border-gray-200 opacity-50'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1 ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className={`font-medium mb-1 ${
                              isSelected ? 'text-gray-900' : 'text-gray-500'
                            }`}>{step.title}</h4>
                            {step.description && (
                              <p className={`text-sm mb-3 ${
                                isSelected ? 'text-gray-600' : 'text-gray-400'
                              }`}>{step.description}</p>
                            )}
                            {!isSelected && (
                              <p className="text-xs text-gray-400 italic">
                                Not selected for this training session
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Buttons */}
                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleStepStatusChange(step.id, 'skipped')}
                            variant={status === 'skipped' ? 'default' : 'outline'}
                            size="sm"
                            className="flex items-center space-x-1"
                            disabled={!isSelected}
                          >
                            <span>−</span>
                            <span>Skip</span>
                          </Button>
                          <Button
                            onClick={() => handleStepStatusChange(step.id, 'prompted')}
                            variant={status === 'prompted' ? 'default' : 'outline'}
                            size="sm"
                            className="flex items-center space-x-1"
                            disabled={!isSelected}
                          >
                            <span>0</span>
                            <span>Prompt</span>
                          </Button>
                          <Button
                            onClick={() => handleStepStatusChange(step.id, 'independent')}
                            variant={status === 'independent' ? 'default' : 'outline'}
                            size="sm"
                            className="flex items-center space-x-1"
                            disabled={!isSelected}
                          >
                            <span>+</span>
                            <span>Independent</span>
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Textarea
                          value={result?.notes || ''}
                          onChange={(e) => handleStepNotesChange(step.id, e.target.value)}
                          placeholder={isSelected ? "Add notes about this step (optional)..." : "Step not selected for training"}
                          rows={2}
                          className="text-sm"
                          disabled={!isSelected}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Session Notes */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Overall Session Notes</h3>
              <Textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add overall notes about this training session..."
                rows={4}
              />
            </Card>
          </div>
      </div>
    </div>
  );
}
