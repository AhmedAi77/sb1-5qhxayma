/*
  # Clean Database Setup for ARISE Training System

  1. New Tables
    - `users`: Core user profile and progress
    - `user_stats`: Training statistics
    - `exercise_history`: Exercise completion log
    - `personal_bests`: Best performance records
    - `favorite_exercises`: User's favorite exercises
    - `login_history`: User login tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up proper cascading deletes

  3. Functions & Triggers
    - Auto-update timestamps
    - Update stats on exercise completion
    - Record login history
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS favorite_exercises CASCADE;
DROP TABLE IF EXISTS personal_bests CASCADE;
DROP TABLE IF EXISTS exercise_history CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_exercises integer DEFAULT 0,
  total_reps integer DEFAULT 0,
  total_distance float DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exercise_history table
CREATE TABLE exercise_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise text NOT NULL,
  reps integer,
  duration integer,
  distance float,
  performed_at timestamptz DEFAULT now()
);

-- Create personal_bests table
CREATE TABLE personal_bests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  value integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_type)
);

-- Create favorite_exercises table
CREATE TABLE favorite_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  exercise_type text NOT NULL,
  personal_best integer DEFAULT 0,
  times_performed integer DEFAULT 1,
  last_performed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_type)
);

-- Create login_history table
CREATE TABLE login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  logged_in_at timestamptz DEFAULT now(),
  level_at_login integer NOT NULL,
  experience_at_login integer NOT NULL,
  completed_missions_at_login integer NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own exercise history" ON exercise_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise history" ON exercise_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own personal bests" ON personal_bests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personal bests" ON personal_bests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal bests" ON personal_bests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own favorites" ON favorite_exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON favorite_exercises
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorite_exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorite_exercises
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own login history" ON login_history
  FOR SELECT USING (auth.uid() = user_id);

-- Create helper functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create function to record login
CREATE OR REPLACE FUNCTION record_user_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO login_history (
    user_id,
    level_at_login,
    experience_at_login,
    completed_missions_at_login
  )
  VALUES (
    NEW.id,
    NEW.level,
    NEW.experience,
    NEW.completed_missions
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stats_on_exercise
  AFTER INSERT ON exercise_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER record_login_on_update
  AFTER UPDATE OF level, experience, completed_missions ON users
  FOR EACH ROW
  EXECUTE FUNCTION record_user_login();