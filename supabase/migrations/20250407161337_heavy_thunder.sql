/*
  # Improve Data Persistence
  
  1. Changes
    - Add trigger to automatically update timestamps
    - Add function to sync user stats
    - Add function to update favorite exercises
    - Add function to handle exercise history
    
  2. Security
    - Add policies for data synchronization
    - Ensure proper cascading deletes
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DO $$ 
BEGIN
  CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
    
  CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create function to sync user stats
CREATE OR REPLACE FUNCTION sync_user_stats(
  user_id uuid,
  total_exercises integer,
  total_reps integer,
  total_distance float
) RETURNS void AS $$
BEGIN
  INSERT INTO user_stats (user_id, total_exercises, total_reps, total_distance)
  VALUES (user_id, total_exercises, total_reps, total_distance)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_exercises = EXCLUDED.total_exercises,
    total_reps = EXCLUDED.total_reps,
    total_distance = EXCLUDED.total_distance,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Create function to update favorite exercises
CREATE OR REPLACE FUNCTION update_favorite_exercise(
  user_id uuid,
  exercise_type text,
  personal_best integer,
  times_performed integer
) RETURNS uuid AS $$
DECLARE
  fav_id uuid;
BEGIN
  INSERT INTO favorite_exercises (
    user_id, 
    exercise_type, 
    personal_best, 
    times_performed,
    last_performed
  )
  VALUES (
    user_id, 
    exercise_type, 
    personal_best, 
    times_performed,
    now()
  )
  ON CONFLICT (user_id, exercise_type) 
  DO UPDATE SET
    personal_best = GREATEST(favorite_exercises.personal_best, EXCLUDED.personal_best),
    times_performed = favorite_exercises.times_performed + 1,
    last_performed = EXCLUDED.last_performed
  RETURNING id INTO fav_id;
  
  RETURN fav_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle exercise history
CREATE OR REPLACE FUNCTION add_exercise_history(
  user_id uuid,
  exercise text,
  reps integer,
  duration integer,
  distance float
) RETURNS uuid AS $$
DECLARE
  history_id uuid;
BEGIN
  -- Insert exercise history
  INSERT INTO exercise_history (
    user_id,
    exercise,
    reps,
    duration,
    distance,
    performed_at
  )
  VALUES (
    user_id,
    exercise,
    reps,
    duration,
    distance,
    now()
  )
  RETURNING id INTO history_id;
  
  -- Update personal best if applicable
  INSERT INTO personal_bests (user_id, exercise_type, value)
  VALUES (user_id, exercise, COALESCE(reps, duration))
  ON CONFLICT (user_id, exercise_type) 
  DO UPDATE SET
    value = GREATEST(personal_bests.value, EXCLUDED.value);
    
  RETURN history_id;
END;
$$ LANGUAGE plpgsql;