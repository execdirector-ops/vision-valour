/*
  # Create Blueberry Mountain Walk Page Table

  1. New Tables
    - `blueberry_mountain_page`
      - `id` (uuid, primary key)
      - `title` (text, default 'Blueberry Mountain Military History & Community Walk')
      - `hero_image_url` (text, nullable) - Hero/banner image URL
      - `content` (text) - Rich text content for the page
      - `walk_details` (text) - Additional details about the walk (date, time, meeting point, etc.)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on the table
    - Public read access (anyone can view)
    - Only authenticated users can modify (for admin panel)

  3. Initial Data
    - Insert a default record with placeholder content
*/

-- Create blueberry_mountain_page table
CREATE TABLE IF NOT EXISTS blueberry_mountain_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'Blueberry Mountain Military History & Community Walk',
  hero_image_url text,
  content text NOT NULL DEFAULT '<h2>About the Walk</h2><p>Join us for a meaningful community walk at Blueberry Mountain to honor our military history and heritage.</p>',
  walk_details text NOT NULL DEFAULT '<h3>Walk Details</h3><p>Date, time, and location information will be posted here.</p>',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blueberry_mountain_page ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view blueberry mountain page"
  ON blueberry_mountain_page
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update blueberry mountain page"
  ON blueberry_mountain_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert blueberry mountain page"
  ON blueberry_mountain_page
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default record
INSERT INTO blueberry_mountain_page (title, content, walk_details)
VALUES (
  'Blueberry Mountain Military History & Community Walk',
  '<h2>About the Walk</h2><p>Join us for a meaningful community walk at Blueberry Mountain to honor our military history and heritage. This walk brings together community members to explore the natural beauty of Blueberry Mountain while learning about its significance in our military history.</p><h2>What to Expect</h2><p>This guided walk will take you through scenic trails while sharing stories of courage, sacrifice, and community spirit. It''s a wonderful opportunity to connect with fellow participants and reflect on the values that unite us.</p>',
  '<h3>Walk Details</h3><ul><li><strong>Date:</strong> To be announced</li><li><strong>Time:</strong> To be announced</li><li><strong>Meeting Point:</strong> Blueberry Mountain Trailhead</li><li><strong>Duration:</strong> Approximately 2-3 hours</li><li><strong>Difficulty:</strong> Moderate</li></ul><h3>What to Bring</h3><ul><li>Comfortable walking shoes</li><li>Water and snacks</li><li>Weather-appropriate clothing</li><li>Camera for photos</li></ul>'
)
ON CONFLICT DO NOTHING;