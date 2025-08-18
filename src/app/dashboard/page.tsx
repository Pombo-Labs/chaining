'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useChains } from '@/lib/hooks/use-chains';
import { signOutUser } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import type { Chain } from '@/types';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { chains, loading: chainsLoading, error } = useChains();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOutUser();
    if (!error) {
      router.push('/');
    }
    setSigningOut(false);
  };

  const handleCreateChain = () => {
    router.push('/dashboard/create');
  };

  const handleChainClick = (chainId: string) => {
    router.push(`/dashboard/chains/${chainId}`);
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
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black">Chain Builder</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {user.displayName || user.email?.split('@')[0]}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={signingOut}
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </header>

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
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}



// Enhanced Chain Card Component
interface ChainCardProps {
  chain: Chain;
  onClick: () => void;
}

function ChainCard({ chain, onClick }: ChainCardProps) {
  const completedSteps = chain.steps.filter(step => step.isCompleted).length;
  const totalSteps = chain.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-black mb-3 group-hover:text-gray-800 transition-colors">
          {chain.title}
        </h3>
        {chain.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {chain.description}
          </p>
        )}
      </div>

      {/* Progress Section */}
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

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Category
          </span>
          <span className="text-sm text-gray-700 capitalize font-medium">
            {chain.category.replace('_', ' ')}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Method
          </span>
          <span className="text-sm text-gray-700 capitalize font-medium">
            {chain.chainingMethod.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
