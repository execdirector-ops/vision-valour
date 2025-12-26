/*
  # Create Event Page Table

  1. New Tables
    - `event_page`
      - `id` (uuid, primary key)
      - `title` (text) - Event title
      - `content` (text) - Main event information content (HTML)
      - `key_dates` (text) - Key dates section (HTML)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `event_page` table
    - Add policy for public read access
    - Add policy for authenticated users to update

  3. Initial Data
    - Insert default event page content
*/

CREATE TABLE IF NOT EXISTS event_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'Ride for Vision & Valour Event',
  content text DEFAULT '<p>Join us for an unforgettable motorcycle ride supporting vision health and honouring our veterans.</p>',
  key_dates text DEFAULT '<ul><li>Registration Opens: TBA</li><li>Event Date: TBA</li><li>Registration Closes: TBA</li></ul>',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE event_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event page"
  ON event_page
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update event page"
  ON event_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO event_page (id, title, content, key_dates)
VALUES (
  gen_random_uuid(),
  'Ride for Vision & Valour Event',
  '<p>Join us for an unforgettable motorcycle ride supporting vision health and honouring our veterans.</p>',
  '<ul><li>Registration Opens: TBA</li><li>Event Date: TBA</li><li>Registration Closes: TBA</li></ul>'
)
ON CONFLICT (id) DO NOTHING;
