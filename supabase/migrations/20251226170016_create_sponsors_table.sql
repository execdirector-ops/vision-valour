/*
  # Create sponsors table

  1. New Tables
    - `sponsors`
      - `id` (uuid, primary key)
      - `name` (text) - Sponsor name
      - `logo_url` (text) - URL to sponsor logo image
      - `website_url` (text) - Sponsor website URL
      - `description` (text) - Rich text description with contact info
      - `category` (text) - Sponsor category type
      - `display_order` (integer) - Order for display within category
      - `is_active` (boolean) - Whether sponsor is visible on site
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `sponsors` table
    - Add policy for public read access to active sponsors
    - Add policy for authenticated admin users to manage sponsors
*/

CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  website_url text DEFAULT '',
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'operations',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sponsors"
  ON sponsors
  FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sponsors"
  ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sponsors"
  ON sponsors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sponsors"
  ON sponsors
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_sponsors_category ON sponsors(category);
CREATE INDEX IF NOT EXISTS idx_sponsors_display_order ON sponsors(display_order);
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON sponsors(is_active);
