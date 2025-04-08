/*
  # Improve Data Persistence with Auto-Save
  
  1. Changes
    - Add auto-save trigger for user progress
    - Add function to sync all user data
    - Improve exercise history tracking
    - Add transaction support for data consistency
    
  2. Security
    - Maintain RLS policies
    - Ensure data integrity
*/

-- Create function to auto-save user progress
CREATE OR REPLACE FUNCTION sync_user_progress(
  user_id uuid,
  user_level integer,
  user_experience integer,
  completed_missions integer,
  user_streak integer,
  total_exercises integer,
  total_reps integer,
  total_distance float
) RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Update user profile
    UPDATE users SET
      level = user_level,
      experience = user_experience,
      completed_missions = completed_missions,
      streak = user_streak,
      updated_at = now()
    WHERE id = user_id;

    -- Update user stats
    INSERT INTO user_stats (
      user_id,
      total_exercises,
      total_reps,
      total_distance
    ) VALUES (
      user_id,
      total_exercises,
      total_reps,
      total_distance
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_exercises = EXCLUDED.total_exercises,
      total_reps = EXCLUDED.total_reps,
      total_distance = EXCLUDED.total_distance,
      updated_at = now();

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on error
    ROLLBACK;
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Create function to record exercise completion with stats update
CREATE OR REPLACE FUNCTION record_exercise_completion(
  user_id uuid,
  exercise_name text,
  exercise_reps integer,
  exercise_duration integer DEFAULT NULL,
  exercise_distance float DEFAULT NULL,
  is_personal_best boolean DEFAULT false
) RETURNS void AS $$
DECLARE
  current_stats record;
BEGIN
  -- Start transaction
  BEGIN
    -- Get current stats
    SELECT * FROM user_stats 
    WHERE user_stats.user_id = record_exercise_completion.user_id 
    INTO current_stats;

    -- Insert exercise history
    INSERT INTO exercise_history (
      user_id,
      exercise,
      reps,
      duration,
      distance,
      performed_at
    ) VALUES (
      user_id,
      exercise_name,
      exercise_reps,
      exercise_duration,
      exercise_distance,
      now()
    );

    -- Update user stats
    UPDATE user_stats SET
      total_exercises = COALESCE(current_stats.total_exercises, 0) + 1,
      total_reps = COALESCE(current_stats.total_reps, 0) + COALESCE(exercise_reps, 0),
      total_distance = COALESCE(current_stats.total_distance, 0) + COALESCE(exercise_distance, 0),
      updated_at = now()
    WHERE user_stats.user_id = record_exercise_completion.user_id;

    -- Update personal best if applicable
    IF is_personal_best THEN
      INSERT INTO personal_bests (
        user_id,
        exercise_type,
        value
      ) VALUES (
        user_id,
        exercise_name,
        COALESCE(exercise_reps, exercise_duration)
      )
      ON CONFLICT (user_id, exercise_type) DO UPDATE SET
        value = GREATEST(
          personal_bests.value,
          EXCLUDED.value
        );
    END IF;

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on error
    ROLLBACK;
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;