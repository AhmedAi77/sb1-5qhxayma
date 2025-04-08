/*
  # Add insert policy for users table

  1. Security Changes
    - Add RLS policy to allow new users to be inserted during sign-up
    - Policy ensures that the user can only insert a row where their auth.uid matches the id column

  Note: This policy is critical for the sign-up flow to work correctly
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);