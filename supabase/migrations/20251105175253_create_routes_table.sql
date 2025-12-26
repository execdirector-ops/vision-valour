/*
  # Create Routes Table

  ## Summary
  Creates a new routes table to replace the single route_page table, allowing multiple route options
  (BC + AB 13-day route and Alberta 6-day route).

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `name` (text) - Route name (e.g., "BC + Alberta Route", "Alberta Only Route")
      - `description` (text) - Brief description
      - `duration_days` (integer) - Number of days (13 or 6)
      - `provinces` (text) - Provinces covered (e.g., "BC + AB", "AB")
      - `map_embed_url` (text) - Embedded map URL/code
      - `itinerary_content` (text) - Full itinerary HTML content
      - `is_active` (boolean) - Whether route is currently available
      - `display_order` (integer) - Order to display routes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `routes` table
    - Add policy for public read access
    - Add policies for authenticated admin write access

  3. Data Migration
    - Insert two default routes (BC + AB 13-day and Alberta 6-day)
*/

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  duration_days integer NOT NULL,
  provinces text NOT NULL,
  map_embed_url text DEFAULT '',
  itinerary_content text DEFAULT '',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Public can read active routes
CREATE POLICY "Public can view active routes"
  ON routes
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all routes
CREATE POLICY "Authenticated users can view all routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert routes
CREATE POLICY "Authenticated users can insert routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update routes
CREATE POLICY "Authenticated users can update routes"
  ON routes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete routes
CREATE POLICY "Authenticated users can delete routes"
  ON routes
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default routes
INSERT INTO routes (name, description, duration_days, provinces, display_order, is_active)
VALUES 
  (
    'BC + Alberta Route',
    'The full 13-day cross-country journey from British Columbia through Alberta, experiencing the complete Ride for Vision & Valour adventure.',
    13,
    'BC + AB',
    1,
    true
  ),
  (
    'Alberta Only Route',
    'A shorter 6-day route focusing on Alberta''s scenic landscapes and military heritage sites, perfect for those with limited time.',
    6,
    'AB',
    2,
    true
  )
ON CONFLICT DO NOTHING;
