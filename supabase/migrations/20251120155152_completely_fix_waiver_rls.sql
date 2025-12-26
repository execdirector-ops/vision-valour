/*
  # Completely Fix Waiver Submissions RLS

  1. Changes
    - Drop all existing policies on waiver_submissions
    - Disable and re-enable RLS to reset state
    - Create fresh, permissive policies for all operations
    - Ensure public can insert, authenticated can manage

  2. Security
    - Public (anon) can INSERT waiver submissions
    - Authenticated users can SELECT, UPDATE, DELETE (admin functions)
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit waivers" ON waiver_submissions;
DROP POLICY IF EXISTS "Public can submit waivers" ON waiver_submissions;
DROP POLICY IF EXISTS "Anyone can submit waiver" ON waiver_submissions;
DROP POLICY IF EXISTS "Admins can view all waivers" ON waiver_submissions;
DROP POLICY IF EXISTS "Admins can update waivers" ON waiver_submissions;
DROP POLICY IF EXISTS "Admins can delete waivers" ON waiver_submissions;

-- Disable and re-enable RLS
ALTER TABLE waiver_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE waiver_submissions ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Public insert waivers"
  ON waiver_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins select waivers"
  ON waiver_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins update waivers"
  ON waiver_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins delete waivers"
  ON waiver_submissions
  FOR DELETE
  TO authenticated
  USING (true);
