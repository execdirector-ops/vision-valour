/*
  # Fix Waiver Submissions RLS Policy

  1. Changes
    - Drop existing restrictive INSERT policy for anonymous users
    - Create new permissive INSERT policy allowing anyone to submit waivers
    - This allows public waiver submissions without authentication

  2. Security
    - Public can INSERT waiver submissions (required for form submission)
    - Authenticated users (admins) retain full access via existing policies
*/

DROP POLICY IF EXISTS "Anyone can submit waiver" ON waiver_submissions;

CREATE POLICY "Public can submit waivers"
  ON waiver_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);
