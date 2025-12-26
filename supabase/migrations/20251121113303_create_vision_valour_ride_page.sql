/*
  # Create Vision & Valour Ride Page

  1. New Tables
    - `vision_valour_ride_page`
      - `id` (uuid, primary key)
      - `title` (text) - Page title
      - `hero_image_url` (text, nullable) - Hero image URL
      - `content` (text) - HTML content for the page
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `vision_valour_ride_page` table
    - Add policy for public read access
    - Add policy for authenticated users to insert/update content

  3. Initial Data
    - Insert default content for the Vision & Valour Ride page
*/

CREATE TABLE IF NOT EXISTS vision_valour_ride_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Vision & Valour Ride',
  hero_image_url text,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vision_valour_ride_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view Vision & Valour Ride page"
  ON vision_valour_ride_page
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert Vision & Valour Ride page"
  ON vision_valour_ride_page
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Vision & Valour Ride page"
  ON vision_valour_ride_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO vision_valour_ride_page (title, hero_image_url, content)
VALUES (
  'Vision & Valour Ride',
  '/Ride for Vision & Valour.png',
  '<p>The Vision & Valour Ride is our signature annual motorcycle event that brings together riders from across the region to support blind and visually impaired children.</p><p>This memorable ride combines scenic routes, camaraderie, and a shared mission to make a difference in the lives of children who need our support.</p>'
)
ON CONFLICT DO NOTHING;