import { supabase } from './supabase';
import type { User } from '../types';

export async function saveUserToDatabase(user: User) {
  try {
    // Save all user progress in a single call
    const { error: progressError } = await supabase
      .rpc('sync_user_progress', {
        user_id: user.id,
        user_level: user.level,
        user_experience: user.experience,
        completed_missions: user.completedMissions,
        user_streak: user.streak,
        total_exercises: user.stats.totalExercises,
        total_reps: user.stats.totalReps,
        total_distance: user.stats.totalDistance
      });

    if (progressError) throw progressError;

    // Update favorite exercises
    for (const fav of user.favorites) {
      const { error: favError } = await supabase
        .rpc('update_favorite_exercise', {
          user_id: user.id,
          exercise_type: fav.type,
          personal_best: fav.personalBest,
          times_performed: fav.timesPerformed
        });

      if (favError) throw favError;
    }

    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

export async function loadUserFromDatabase(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_stats (
          total_exercises,
          total_reps,
          total_distance
        ),
        personal_bests (
          exercise_type,
          value
        ),
        exercise_history (
          exercise,
          reps,
          duration,
          distance,
          performed_at
        ),
        favorite_exercises (
          id,
          exercise_type,
          personal_best,
          times_performed,
          last_performed
        ),
        login_history (
          id,
          logged_in_at,
          level_at_login,
          experience_at_login,
          completed_missions_at_login
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
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
      })) || [],
      loginHistory: data.login_history?.map((entry: any) => ({
        id: entry.id,
        loggedInAt: new Date(entry.logged_in_at),
        levelAtLogin: entry.level_at_login,
        experienceAtLogin: entry.experience_at_login,
        completedMissionsAtLogin: entry.completed_missions_at_login
      })) || []
    };
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
}

export async function addExerciseHistory(
  userId: string,
  exercise: string,
  reps: number,
  duration?: number,
  distance?: number,
  isPersonalBest = false
) {
  try {
    const { error } = await supabase
      .rpc('record_exercise_completion', {
        user_id: userId,
        exercise_name: exercise,
        exercise_reps: reps,
        exercise_duration: duration,
        exercise_distance: distance,
        is_personal_best: isPersonalBest
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error recording exercise:', error);
    throw error;
  }
}

export async function updateUserProgress(
  userId: string,
  level: number,
  experience: number,
  completedMissions: number,
  streak: number
) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        level,
        experience,
        completed_missions: completedMissions,
        streak,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}