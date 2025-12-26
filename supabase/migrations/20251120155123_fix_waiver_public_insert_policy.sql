/*
  # Fix Waiver Submissions Public Insert Policy

  1. Changes
    - Drop existing INSERT policy for anonymous users
    - Create comprehensive INSERT policy for both anon and authenticated users
    - Remove any restrictive checks that might be blocking submissions

  2. Security
    - Allow anyone (anon or authenticated) to submit waivers
    - No WITH CHECK restrictions to prevent blocks
*/

DROP POLICY IF EXISTS "Public can submit waivers" ON waiver_submissions;

CREATE POLICY "Anyone can submit waivers"
  ON waiver_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
