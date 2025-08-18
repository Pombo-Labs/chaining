import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, FirestoreError } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '@/types';
import { getAuthErrorMessage, getFirestoreErrorMessage } from './errors';

// Create user profile in Firestore
export const createUserProfile = async (
  user: User,
  additionalData?: Partial<UserProfile>
): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || additionalData?.displayName || '',
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      ...additionalData,
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
  } catch (error: any) {
    const errorMessage = error.code ? getFirestoreErrorMessage(error.code) : error.message;
    console.error('Error creating user profile:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    await createUserProfile(user, { displayName });
    
    return { user, error: null };
  } catch (error: any) {
    const errorMessage = error.code ? getAuthErrorMessage(error.code) : error.message;
    return { user: null, error: errorMessage };
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error: any) {
    const errorMessage = error.code ? getAuthErrorMessage(error.code) : error.message;
    return { user: null, error: errorMessage };
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{
  user: User | null;
  error: string | null;
}> => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserProfile(user);
    }
    
    return { user, error: null };
  } catch (error: any) {
    const errorMessage = error.code ? getAuthErrorMessage(error.code) : error.message;
    return { user: null, error: errorMessage };
  }
};

// Sign out
export const signOutUser = async (): Promise<{ error: string | null }> => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    const errorMessage = error.code ? getFirestoreErrorMessage(error.code) : error.message;
    console.error('Error updating user profile:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
