/*
  # Initial Schema Setup for Arise Training System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Links to auth.users
      - `email` (text, unique)
      - `name` (text)
      - `level` (integer, default: 1)
      - `experience` (integer, default: 0)
      - `completed_missions` (integer, default: 0)
      - `streak` (integer, default: 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_stats`
      - `user_id` (uuid, primary key) - References users.id
      - `total_exercises` (integer, default: 0)
      - `total_reps` (integer, default: 0)
      - `total_distance` (double precision, default: 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `exercise_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `exercise` (text)
      - `reps` (integer)
      - `duration` (integer)
      - `distance` (double precision)
      - `performed_at` (timestamptz)

    - `personal_bests`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `exercise_type` (text)
      - `value` (integer)
      - `created_at` (timestamptz)

    - `favorite_exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `exercise_type` (text)
      - `personal_best` (integer, default: 0)
      - `times_performed` (integer, default: 1)
      - `last_performed` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Update their own data
      - Insert their own data
      - Delete their own data (where applicable)

  3. Triggers
    - Update user stats automatically when exercise history is added
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read own data" ON users;
    DROP POLICY IF EXISTS "Users can update own data" ON users;
    DROP POLICY IF EXISTS "Users can read own stats" ON user_stats;
    DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
    DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
    DROP POLICY IF EXISTS "Users can read own exercise history" ON exercise_history;
    DROP POLICY IF EXISTS "Users can insert own exercise history" ON exercise_history;
    DROP POLICY IF EXISTS "Users can read own personal bests" ON personal_bests;
    DROP POLICY IF EXISTS "Users can update own personal bests" ON personal_bests;
    DROP POLICY IF EXISTS "Users can insert own personal bests" ON personal_bests;
    DROP POLICY IF EXISTS "Users can read own favorites" ON favorite_exercises;
    DROP POLICY IF EXISTS "Users can update own favorites" ON favorite_exercises;
    DROP POLICY IF EXISTS "Users can insert own favorites" ON favorite_exercises;
    DROP POLICY IF EXISTS "Users can delete own favorites" ON favorite_exercises;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  completed_missions integer DEFAULT 0,
  streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_exercises integer DEFAULT 0,
  total_reps integer DEFAULT 0,
  total_distance double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create exercise_history table
CREATE TABLE IF NOT EXISTS exercise_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise text NOT NULL,
  reps integer,
  duration integer,
  distance double precision,
  performed_at timestamptz DEFAULT now()
);

ALTER TABLE exercise_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercise history"
  ON exercise_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise history"
  ON exercise_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create personal_bests table
CREATE TABLE IF NOT EXISTS personal_bests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  value integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_type)
);

ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own personal bests"
  ON personal_bests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personal bests"
  ON personal_bests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal bests"
  ON personal_bests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create favorite_exercises table
CREATE TABLE IF NOT EXISTS favorite_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  personal_best integer DEFAULT 0,
  times_performed integer DEFAULT 1,
  last_performed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_type)
);

ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON favorite_exercises
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
  ON favorite_exercises
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorite_exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorite_exercises
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS update_stats_on_exercise ON exercise_history;
DROP FUNCTION IF EXISTS update_user_stats();

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_stats
  SET 
    total_exercises = total_exercises + 1,
    total_reps = total_reps + COALESCE(NEW.reps, 0),
    total_distance = total_distance + COALESCE(NEW.distance, 0),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats on exercise completion
CREATE TRIGGER update_stats_on_exercise
  AFTER INSERT ON exercise_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();