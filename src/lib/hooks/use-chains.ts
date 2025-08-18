import { useState, useEffect } from 'react';
import { getUserChains, subscribeToUserChains } from '@/lib/firebase/firestore';
import { useAuth } from './use-auth';
import type { Chain } from '@/types';

export const useChains = () => {
  const { user } = useAuth();
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setChains([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserChains(user.uid, (updatedChains) => {
      setChains(updatedChains);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [user]);

  const refreshChains = async () => {
    if (!user) return;
    
    setLoading(true);
    const { chains: fetchedChains, error } = await getUserChains(user.uid);
    
    if (error) {
      setError(error);
    } else {
      setChains(fetchedChains);
    }
    setLoading(false);
  };

  return {
    chains,
    loading,
    error,
    refreshChains,
  };
};
