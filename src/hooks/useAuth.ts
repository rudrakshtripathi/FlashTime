import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, hasFirebaseConfig } from '../config/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  // If Firebase is not configured, return mock state
  if (!hasFirebaseConfig || !auth) {
    return { user: null, loading: false, signIn: async () => ({ user: null, error: 'Firebase not configured' }), signUp: async () => ({ user: null, error: 'Firebase not configured' }), logout: async () => ({ error: 'Firebase not configured' }) };
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false
      });
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signIn,
    signUp,
    logout
  };
};