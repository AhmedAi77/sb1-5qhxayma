import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { signUp, signIn, signOut } from '../lib/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, password: string) => Promise<void>;
  signIn: (name: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      toast.error('Failed to restore session');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthChange = async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await loadUserProfile(session.user.id);
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_stats (*),
          personal_bests (exercise_type, value),
          exercise_history (*),
          favorite_exercises (*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        level: data.level,
        experience: data.experience,
        completedMissions: data.completed_missions,
        streak: data.streak,
        stats: {
          totalExercises: data.user_stats?.total_exercises || 0,
          totalReps: data.user_stats?.total_reps || 0,
          totalDistance: data.user_stats?.total_distance || 0,
          personalBests: data.personal_bests?.reduce((acc: Record<string, number>, curr: any) => {
            acc[curr.exercise_type] = curr.value;
            return acc;
          }, {}),
          exerciseHistory: data.exercise_history?.map((entry: any) => ({
            date: new Date(entry.performed_at),
            exercise: entry.exercise,
            reps: entry.reps,
            duration: entry.duration,
            distance: entry.distance
          })) || []
        },
        favorites: data.favorite_exercises?.map((fav: any) => ({
          id: fav.id,
          type: fav.exercise_type,
          personalBest: fav.personal_best,
          timesPerformed: fav.times_performed,
          lastPerformed: fav.last_performed ? new Date(fav.last_performed) : undefined
        })) || []
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const handleSignUp = async (name: string, password: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('name', name)
        .single();

      if (existingUser) {
        throw new Error('Username already taken');
      }

      await signUp(name, password);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const handleSignIn = async (name: string, password: string) => {
    try {
      await signIn(name, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signUp: handleSignUp, 
        signIn: handleSignIn, 
        signOut: handleSignOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};