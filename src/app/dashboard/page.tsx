'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useChains } from '@/lib/hooks/use-chains';
import { deleteChain } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { ChainCard } from '@/components/features';
import { DashboardHeader } from '@/components/layout';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { chains, loading: chainsLoading, error } = useChains();
  const router = useRouter();
  const [deletingChainId, setDeletingChainId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const handleCreateChain = () => {
    router.push('/dashboard/create');
  };

  const handleChainClick = (chainId: string) => {
    router.push(`/chains/${chainId}`);
  };

  const handleEditChain = (chainId: string) => {
    router.push(`/chains/${chainId}/edit`);
  };

  const handleDeleteChain = async (chainId: string) => {
    setDeletingChainId(chainId);
    
    try {
      const { error } = await deleteChain(chainId);
      
      if (error) {
        throw new Error(error);
      }
      
      // Success - the real-time listener will automatically update the UI
    } catch (error: any) {
      console.error('Failed to delete chain:', error);
      alert(`Failed to delete chain: ${error.message || 'Unknown error'}`);
    } finally {
      setDeletingChainId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader user={user} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Chains Grid */}
        {chainsLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading your chains...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading chains</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : chains.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-light text-black mb-4">No chains yet</h3>
              <p className="text-gray-600 mb-8">
                Create your first skill chain to start building independence for your child.
              </p>
              <Button
                onClick={handleCreateChain}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                Create Your First Chain
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Page Title and Create Button - Only show when user has chains */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-light text-black mb-2">Your Chains</h2>
                <p className="text-gray-600">Build and manage skill chains for your child</p>
              </div>
              <Button
                onClick={handleCreateChain}
                className="bg-black text-white hover:bg-gray-800 px-6 py-3"
              >
                Create New Chain
              </Button>
            </div>
            
            {/* Chains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chains.map((chain) => (
                <ChainCard
                  key={chain.id}
                  chain={chain}
                  onClick={() => handleChainClick(chain.id)}
                  onEdit={() => handleEditChain(chain.id)}
                  onDelete={() => handleDeleteChain(chain.id)}
                  isDeleting={deletingChainId === chain.id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
