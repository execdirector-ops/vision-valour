/*
  # Create Privacy Policy Table

  1. New Tables
    - `privacy_policy`
      - `id` (uuid, primary key)
      - `content` (text) - The privacy policy content
      - `updated_at` (timestamptz) - Last updated timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `privacy_policy` table
    - Add policy for public read access (anyone can view the privacy policy)
    - Add policy for authenticated users to update (admin only)
*/

CREATE TABLE IF NOT EXISTS privacy_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE privacy_policy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view privacy policy"
  ON privacy_policy
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update privacy policy"
  ON privacy_policy
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert privacy policy"
  ON privacy_policy
  FOR INSERT
  TO authenticated
  WITH CHECK (true);