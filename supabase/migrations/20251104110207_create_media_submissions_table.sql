/*
  # Create Media Submissions Table

  1. New Tables
    - `media_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Submitter name
      - `email` (text) - Submitter email
      - `media_type` (text) - Type: photo or video
      - `description` (text) - Description of the media
      - `url` (text) - URL to the photo or video
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `media_submissions` table
    - Add policy for public to insert submissions
    - Add policy for authenticated users to view all submissions
*/

CREATE TABLE IF NOT EXISTS media_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  media_type text NOT NULL,
  description text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit media"
  ON media_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all media submissions"
  ON media_submissions
  FOR SELECT
  TO authenticated
  USING (true);
