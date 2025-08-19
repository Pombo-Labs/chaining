'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useSteps } from '@/lib/hooks/use-steps';
import { getChain, updateChain } from '@/lib/firebase/firestore';
import { DashboardHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { StepManager } from '@/components/chains';
import type { Chain } from '@/types';

export default function EditChainPage() {
  const { chainId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    steps,
    setSteps,
    addStep,
    updateStep,
    removeStep,
    moveStep,
  } = useSteps();

  useEffect(() => {
    if (!user || !chainId) return;

    const fetchChain = async () => {
      setLoading(true);
      const { chain: fetchedChain, error } = await getChain(chainId as string);
      
      if (error) {
        setError(error);
      } else if (fetchedChain && fetchedChain.userId === user.uid) {
        setChain(fetchedChain);
        setSteps(fetchedChain.steps.sort((a, b) => a.order - b.order));
      } else {
        setError('Chain not found or access denied');
      }
      setLoading(false);
    };

    fetchChain();
  }, [user, chainId, setSteps]);

  const saveChain = async () => {
    if (!chain || !user) return;

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await updateChain(chain.id, {
        steps: steps,
        updatedAt: new Date(),
      });

      if (updateError) {
        throw new Error(updateError);
      }

      router.push(`/chains/${chainId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save chain');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/chains/${chainId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader user={user!} />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-12">
            <div className="text-gray-600">Loading chain...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !chain) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader user={user!} />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading chain</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader user={user!} />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-black transition-colors mb-4"
          >
            ← Back to Chain
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-black mb-2">Edit Chain</h1>
              <p className="text-gray-600">{chain.title}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={saveChain}
                disabled={saving || steps.some(step => !step.title.trim())}
                className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Steps Manager - DRY Component */}
        <StepManager
          steps={steps}
          onAddStep={addStep}
          onUpdateStep={updateStep}
          onMoveStep={moveStep}
          onRemoveStep={removeStep}
        />

      </main>
    </div>
  );
}
