/*
  # Fix Pages Table RLS Policies

  1. Changes
    - Drop existing policies for pages table
    - Recreate policies with explicit role targeting
    - Ensure anon users can read pages without authentication issues

  2. Security
    - Public read access remains secure
    - Authenticated users maintain full CRUD access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view all pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can insert pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can update pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can delete pages" ON pages;

-- Recreate policies with explicit configurations
CREATE POLICY "Enable read access for all users"
  ON pages
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
  ON pages
  FOR DELETE
  TO authenticated
  USING (true);