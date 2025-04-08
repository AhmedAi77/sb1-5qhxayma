/*
  # Add login history tracking

  1. New Tables
    - `login_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `logged_in_at` (timestamptz)
      - `level_at_login` (integer)
      - `experience_at_login` (integer)
      - `completed_missions_at_login` (integer)

  2. Security
    - Enable RLS on login_history table
    - Add policies for authenticated users to read their own login history
*/

-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  logged_in_at timestamptz DEFAULT now(),
  level_at_login integer NOT NULL,
  experience_at_login integer NOT NULL,
  completed_missions_at_login integer NOT NULL
);

-- Enable RLS
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can read own login history"
  ON login_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Create trigger to record login on user update
CREATE TRIGGER record_login_on_update
  AFTER UPDATE OF level, experience, completed_missions ON users
  FOR EACH ROW
  EXECUTE FUNCTION record_user_login();