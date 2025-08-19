'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getChain } from '@/lib/firebase/firestore';
import { DashboardHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Chain } from '@/types';

export default function ChainDetailPage() {
  const { chainId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !chainId) return;

    const fetchChain = async () => {
      setLoading(true);
      const { chain: fetchedChain, error } = await getChain(chainId as string);
      
      if (error) {
        setError(error);
      } else if (fetchedChain && fetchedChain.userId === user.uid) {
        setChain(fetchedChain);
        // Initialize all steps as selected by default
        const allStepIds = new Set(fetchedChain.steps.map(step => step.id));
        setSelectedSteps(allStepIds);
      } else {
        setError('Chain not found or access denied');
      }
      setLoading(false);
    };

    fetchChain();
  }, [user, chainId]);

  const handleEditChain = () => {
    router.push(`/chains/${chainId}/edit`);
  };

  const handleStartTraining = () => {
    const selectedStepIds = Array.from(selectedSteps);
    const queryParams = new URLSearchParams({
      selectedSteps: selectedStepIds.join(',')
    });
    router.push(`/chains/${chainId}/train?${queryParams}`);
  };

  const toggleStepSelection = (stepId: string) => {
    setSelectedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const selectAllSteps = () => {
    if (chain) {
      const allStepIds = new Set(chain.steps.map(step => step.id));
      setSelectedSteps(allStepIds);
    }
  };

  const deselectAllSteps = () => {
    setSelectedSteps(new Set());
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !chain) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader user={user} />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading chain</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleBackToDashboard} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const completedSteps = chain.steps.filter(step => step.isCompleted).length;
  const totalSteps = chain.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader user={user!} />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="text-gray-600 hover:text-black transition-colors mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-black mb-2">{chain.title}</h1>
              {chain.description && (
                <p className="text-gray-600">{chain.description}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleEditChain}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Edit Chain
              </Button>
              <Button
                onClick={handleStartTraining}
                disabled={totalSteps === 0 || selectedSteps.size === 0}
                className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Start Training ({selectedSteps.size} steps)
              </Button>
            </div>
          </div>
        </div>

        {/* Chain Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Progress
            </h3>
            <div className="text-2xl font-semibold text-black mb-2">
              {completedSteps}/{totalSteps} steps
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Category
            </h3>
            <div className="text-2xl font-semibold text-black capitalize">
              {chain.category.replace('_', ' ')}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Method
            </h3>
            <div className="text-2xl font-semibold text-black capitalize">
              {chain.chainingMethod.replace('_', ' ')}
            </div>
          </Card>
        </div>

        {/* Steps List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-black">Steps</h2>
            <div className="flex items-center gap-3">
              {totalSteps > 0 && (
                <>
                  <Button
                    onClick={selectAllSteps}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={deselectAllSteps}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Deselect All
                  </Button>
                </>
              )}
              {totalSteps === 0 && (
                <Button
                  onClick={handleEditChain}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Add Steps
                </Button>
              )}
            </div>
          </div>


          {totalSteps === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No steps added yet</div>
              <p className="text-gray-400 text-sm">
                Add steps to this chain to start training
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chain.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStepSelection(step.id)}
                    className={`
                      flex items-center p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
                      ${selectedSteps.has(step.id)
                        ? step.isCompleted 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-gray-50 border-gray-300'
                        : 'bg-gray-100 border-gray-200 opacity-60'
                      }
                    `}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mr-4 relative">
                      {selectedSteps.has(step.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {step.isCompleted ? (
                        <span className="text-green-600 font-semibold">✓</span>
                      ) : (
                        <span className="text-gray-400 font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-grow min-h-[2.5rem] flex flex-col justify-center">
                      <h3 className="font-medium text-black">{step.title}</h3>
                      {step.description && (
                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
