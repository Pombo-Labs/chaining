import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Chain, Step, TrainingSession, ChainTemplate } from '@/types';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  CHAINS: 'chains',
  SESSIONS: 'training_sessions',
  TEMPLATES: 'chain_templates',
} as const;

// Chain operations
export const createChain = async (userId: string, chainData: Omit<Chain, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CHAINS), {
      ...chainData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateChain = async (chainId: string, updates: Partial<Chain>) => {
  try {
    const chainRef = doc(db, COLLECTIONS.CHAINS, chainId);
    await updateDoc(chainRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteChain = async (chainId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CHAINS, chainId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getChain = async (chainId: string) => {
  try {
    const chainDoc = await getDoc(doc(db, COLLECTIONS.CHAINS, chainId));
    if (chainDoc.exists()) {
      return { 
        chain: { id: chainDoc.id, ...chainDoc.data() } as Chain, 
        error: null 
      };
    }
    return { chain: null, error: 'Chain not found' };
  } catch (error: any) {
    return { chain: null, error: error.message };
  }
};

export const getUserChains = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CHAINS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const chains = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Chain[];
    return { chains, error: null };
  } catch (error: any) {
    return { chains: [], error: error.message };
  }
};

// Training session operations
export const createTrainingSession = async (sessionData: Omit<TrainingSession, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), {
      ...sessionData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const getChainSessions = async (chainId: string, limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('chainId', '==', chainId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TrainingSession[];
    return { sessions, error: null };
  } catch (error: any) {
    return { sessions: [], error: error.message };
  }
};

// Template operations
export const getChainTemplates = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.TEMPLATES), orderBy('category'));
    const querySnapshot = await getDocs(q);
    const templates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChainTemplate[];
    return { templates, error: null };
  } catch (error: any) {
    return { templates: [], error: error.message };
  }
};

export const createChainFromTemplate = async (
  userId: string, 
  templateId: string, 
  customizations?: Partial<Chain>
) => {
  try {
    const templateDoc = await getDoc(doc(db, COLLECTIONS.TEMPLATES, templateId));
    if (!templateDoc.exists()) {
      return { id: null, error: 'Template not found' };
    }

    const template = templateDoc.data() as ChainTemplate;
    const chainData: Omit<Chain, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      title: template.title,
      description: template.description,
      category: template.category,
      steps: template.steps.map((step, index) => ({
        ...step,
        id: `step_${index + 1}`,
        isCompleted: false,
        isTarget: index === 0, // First step is target for forward chaining
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      chainingMethod: 'forward',
      isTemplate: false,
      isActive: true,
      totalSessions: 0,
      ...customizations,
    };

    return await createChain(userId, chainData);
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Real-time listeners
export const subscribeToUserChains = (
  userId: string, 
  callback: (chains: Chain[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.CHAINS),
    where('userId', '==', userId)
    // orderBy('updatedAt', 'desc') // Temporarily removed to avoid index requirement
  );

  return onSnapshot(q, (querySnapshot) => {
    const chains = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Chain[];
    callback(chains);
  });
};

export const subscribeToChain = (
  chainId: string,
  callback: (chain: Chain | null) => void
) => {
  return onSnapshot(doc(db, COLLECTIONS.CHAINS, chainId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Chain);
    } else {
      callback(null);
    }
  });
};
