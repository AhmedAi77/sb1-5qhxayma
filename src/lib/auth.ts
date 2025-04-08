import { supabase, adminSupabase } from './supabase';
import type { User } from '../types';

export async function signUp(name: string, password: string): Promise<User> {
  const email = `${name.toLowerCase()}@arise.local`;

  // Check if user exists using admin client
  const { data: existingUsers, error: checkError } = await adminSupabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (checkError) throw new Error('Failed to check existing user');
  if (existingUsers) throw new Error('Username already taken');

  // Create auth user
  const { data: auth, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: null // Disable email confirmation
    }
  });

  if (signUpError) throw signUpError;
  if (!auth.user) throw new Error('Failed to create user');

  // Create user profile and stats
  const { data: profile, error: profileError } = await supabase.from('users')
    .insert({
      id: auth.user.id,
      email,
      name,
      level: 1,
      experience: 0,
      completed_missions: 0,
      streak: 0
    })
    .select()
    .single();

  if (profileError) {
    // Cleanup: delete auth user if profile creation fails
    await adminSupabase.auth.admin.deleteUser(auth.user.id);
    throw new Error('Failed to create user profile');
  }

  // Initialize user stats
  const { error: statsError } = await supabase.from('user_stats')
    .insert({
      user_id: auth.user.id,
      total_exercises: 0,
      total_reps: 0,
      total_distance: 0
    });

  if (statsError) {
    // Cleanup: delete auth user and profile if stats creation fails
    await adminSupabase.auth.admin.deleteUser(auth.user.id);
    await supabase.from('users').delete().eq('id', auth.user.id);
    throw new Error('Failed to initialize user stats');
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    level: profile.level,
    experience: profile.experience,
    completedMissions: profile.completed_missions,
    streak: profile.streak,
    stats: {
      totalExercises: 0,
      totalReps: 0,
      totalDistance: 0,
      personalBests: {},
      exerciseHistory: []
    },
    favorites: []
  };
}

export async function signIn(name: string, password: string): Promise<void> {
  const email = `${name.toLowerCase()}@arise.local`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.message === 'Invalid login credentials') {
      throw new Error('Invalid username or password');
    }
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Admin functions - ONLY use in edge functions
export const adminFunctions = {
  async deleteUser(userId: string): Promise<void> {
    const { error } = await adminSupabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  },

  async listUsers(page = 1, perPage = 100): Promise<any> {
    const { data, error } = await adminSupabase.auth.admin.listUsers({
      page,
      perPage
    });
    if (error) throw error;
    return data;
  },

  async getUserById(userId: string): Promise<any> {
    const { data, error } = await adminSupabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return data;
  }
};