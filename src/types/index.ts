// Core data types for the Chain Builder application

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isCompleted: boolean;
  isTarget: boolean; // Current target step in training
  estimatedTime?: number; // in seconds
  actualTime?: number; // in seconds
  hasTimer: boolean; // whether user added a timer to this step
  createdAt: Date;
  updatedAt: Date;
}

export interface Chain {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: ChainCategory;
  steps: Step[];
  chainingMethod: ChainingMethod;
  isTemplate: boolean;
  isActive: boolean;
  totalSessions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingSession {
  id: string;
  chainId: string;
  userId: string;
  date: Date;
  stepResults: StepResult[];
  duration: number; // in minutes
  notes?: string;
  createdAt: Date;
}

export interface StepResult {
  stepId: string;
  status: StepStatus;
  attempts: number;
  timeSpent: number; // in seconds
  notes?: string;
}

export type ChainCategory = 
  | 'daily-living'
  | 'hygiene'
  | 'dressing'
  | 'eating'
  | 'social-skills'
  | 'academic'
  | 'play'
  | 'communication'
  | 'custom';

export type ChainingMethod = 'forward' | 'backward' | 'total-task';

export type StepStatus = 'independent' | 'prompted' | 'not-attempted';

export interface ChainTemplate {
  id: string;
  title: string;
  description: string;
  category: ChainCategory;
  steps: Omit<Step, 'id' | 'isCompleted' | 'isTarget' | 'createdAt' | 'updatedAt'>[];
  ageRange: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
}

export interface ProgressStats {
  chainId: string;
  totalSteps: number;
  completedSteps: number;
  currentTargetStep: number;
  successRate: number; // percentage
  averageSessionTime: number;
  totalSessions: number;
  lastSessionDate?: Date;
}

// UI State types
export interface TrainingState {
  isActive: boolean;
  currentChain?: Chain;
  currentSession?: TrainingSession;
  currentStepIndex: number;
  sessionStartTime: Date;
}

export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  training: TrainingState;
}
