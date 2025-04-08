import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
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

      if (userError) throw userError;

      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          level: userData.level,
          experience: userData.experience,
          completedMissions: userData.completed_missions,
          streak: userData.streak,
          stats: {
            totalExercises: userData.user_stats?.total_exercises || 0,
            totalReps: userData.user_stats?.total_reps || 0,
            totalDistance: userData.user_stats?.total_distance || 0,
            personalBests: userData.personal_bests.reduce((acc: Record<string, number>, curr: any) => {
              acc[curr.exercise_type] = curr.value;
              return acc;
            }, {}),
            exerciseHistory: userData.exercise_history.map((entry: any) => ({
              date: new Date(entry.performed_at),
              exercise: entry.exercise,
              reps: entry.reps,
              duration: entry.duration,
              distance: entry.distance
            }))
          },
          favorites: userData.favorite_exercises.map((fav: any) => ({
            id: fav.id,
            type: fav.exercise_type,
            personalBest: fav.personal_best,
            timesPerformed: fav.times_performed,
            lastPerformed: fav.last_performed ? new Date(fav.last_performed) : undefined
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              name
            }
          ]);

        if (profileError) throw profileError;

        // Create initial user stats
        const { error: statsError } = await supabase
          .from('user_stats')
          .insert([{ user_id: data.user.id }]);

        if (statsError) throw statsError;
      }

      toast.success('Welcome to the system!');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account');
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user data');
      throw error;
    }
  };

  return {
    user,
    loading,
    signUp,
    updateUser
  };
}