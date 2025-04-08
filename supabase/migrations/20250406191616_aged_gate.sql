/*
  # Create users and related tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `level` (integer)
      - `experience` (integer)
      - `completed_missions` (integer)
      - `streak` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_stats`
      - `user_id` (uuid, foreign key)
      - `total_exercises` (integer)
      - `total_reps` (integer)
      - `total_distance` (float)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `personal_bests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `exercise_type` (text)
      - `value` (integer)
      - `created_at` (timestamp)
    
    - `exercise_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `exercise` (text)
      - `reps` (integer)
      - `duration` (integer)
      - `distance` (float)
      - `performed_at` (timestamp)
    
    - `favorite_exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `exercise_type` (text)
      - `personal_best` (integer)
      - `times_performed` (integer)
      - `last_performed` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  completed_missions integer DEFAULT 0,
  streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_auth_user FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_exercises integer DEFAULT 0,
  total_reps integer DEFAULT 0,
  total_distance float DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create personal_bests table
CREATE TABLE IF NOT EXISTS personal_bests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  value integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_type)
);

-- Create exercise_history table
CREATE TABLE IF NOT EXISTS exercise_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise text NOT NULL,
  reps integer,
  duration integer,
  distance float,
  performed_at timestamptz DEFAULT now()
);

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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own personal bests" ON personal_bests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal bests" ON personal_bests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal bests" ON personal_bests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own exercise history" ON exercise_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise history" ON exercise_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own favorites" ON favorite_exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorite_exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON favorite_exercises
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorite_exercises
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update user_stats
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

-- Create trigger for updating stats
CREATE TRIGGER update_stats_on_exercise
  AFTER INSERT ON exercise_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();