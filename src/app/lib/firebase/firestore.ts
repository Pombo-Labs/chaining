import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

// Types
export interface ChainStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  imageUrl?: string;
  isCompleted: boolean;
  isIndependent: boolean; // true = ★ (independent), false = 🤝 (prompted)
  completedAt?: Date;
}

export interface Chain {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  chainingMethod: 'forward' | 'backward';
  steps: ChainStep[];
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentTargetStep?: number; // The step currently being taught
}

export interface TrainingSession {
  id: string;
  chainId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  stepsCompleted: {
    stepId: string;
    isIndependent: boolean;
    completedAt: Date;
  }[];
  notes?: string;
}

// Collections
const CHAINS_COLLECTION = 'chains';
const TRAINING_SESSIONS_COLLECTION = 'training_sessions';

// Chain CRUD operations
export async function createChain(chainData: Omit<Chain, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CHAINS_COLLECTION), {
      ...chainData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating chain:', error);
    throw error;
  }
}

export async function getChain(chainId: string): Promise<Chain | null> {
  try {
    const docRef = doc(db, CHAINS_COLLECTION, chainId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Chain;
    }
    return null;
  } catch (error) {
    console.error('Error getting chain:', error);
    throw error;
  }
}

export async function getUserChains(userId: string): Promise<{ chains: Chain[]; error: string | null }> {
  try {
    const q = query(
      collection(db, CHAINS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const chains = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Chain[];
    
    return { chains, error: null };
  } catch (error) {
    console.error('Error getting user chains:', error);
    return { chains: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Real-time subscription for user chains
export function subscribeToUserChains(
  userId: string, 
  callback: (chains: Chain[]) => void
): () => void {
  try {
    const q = query(
      collection(db, CHAINS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    // For now, we'll use a simple polling approach since onSnapshot requires more setup
    // In a production app, you'd use onSnapshot for real-time updates
    const fetchChains = async () => {
      const { chains } = await getUserChains(userId);
      callback(chains);
    };
    
    fetchChains();
    const interval = setInterval(fetchChains, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  } catch (error) {
    console.error('Error subscribing to user chains:', error);
    return () => {};
  }
}

export async function getTemplateChains(): Promise<Chain[]> {
  try {
    const q = query(
      collection(db, CHAINS_COLLECTION),
      where('isTemplate', '==', true),
      orderBy('title', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Chain[];
  } catch (error) {
    console.error('Error getting template chains:', error);
    throw error;
  }
}

export async function updateChain(chainId: string, updates: Partial<Chain>): Promise<void> {
  try {
    const docRef = doc(db, CHAINS_COLLECTION, chainId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating chain:', error);
    throw error;
  }
}

export async function deleteChain(chainId: string): Promise<void> {
  try {
    const docRef = doc(db, CHAINS_COLLECTION, chainId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting chain:', error);
    throw error;
  }
}

// Training Session operations
export async function createTrainingSession(sessionData: Omit<TrainingSession, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TRAINING_SESSIONS_COLLECTION), {
      ...sessionData,
      startedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating training session:', error);
    throw error;
  }
}

export async function updateTrainingSession(sessionId: string, updates: Partial<TrainingSession>): Promise<void> {
  try {
    const docRef = doc(db, TRAINING_SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating training session:', error);
    throw error;
  }
}

export async function getChainTrainingSessions(chainId: string): Promise<TrainingSession[]> {
  try {
    const q = query(
      collection(db, TRAINING_SESSIONS_COLLECTION),
      where('chainId', '==', chainId),
      orderBy('startedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startedAt: doc.data().startedAt.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as TrainingSession[];
  } catch (error) {
    console.error('Error getting training sessions:', error);
    throw error;
  }
}

// Utility functions for chaining logic
export function getTargetStep(chain: Chain): ChainStep | null {
  if (!chain.steps.length) return null;
  
  if (chain.chainingMethod === 'forward') {
    // Forward chaining: find first incomplete step
    return chain.steps.find(step => !step.isCompleted) || null;
  } else {
    // Backward chaining: find last incomplete step
    const incompleteSteps = chain.steps.filter(step => !step.isCompleted);
    return incompleteSteps.length > 0 ? incompleteSteps[incompleteSteps.length - 1] : null;
  }
}

export function calculateChainProgress(chain: Chain): { completed: number; total: number; percentage: number } {
  const total = chain.steps.length;
  const completed = chain.steps.filter(step => step.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}