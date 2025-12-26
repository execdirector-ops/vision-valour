/*
  # Create Photos Gallery Table

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `title` (text) - Photo title
      - `description` (text) - Photo description with rich text support
      - `image_url` (text) - URL to the photo
      - `photographer_name` (text) - Name of photographer
      - `event_date` (date) - Date photo was taken
      - `category` (text) - Photo category (ride, ceremony, social, etc.)
      - `is_featured` (boolean) - Whether to feature on homepage
      - `display_order` (integer) - Sort order
      - `is_published` (boolean) - Whether photo is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `photos` table
    - Add policy for public read access to published photos
    - Add policy for authenticated users to manage all photos
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  photographer_name text DEFAULT '',
  event_date date,
  category text DEFAULT 'general',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published photos"
  ON photos
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (true);