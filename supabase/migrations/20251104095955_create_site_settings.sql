/*
  # Create site settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting identifier
      - `value` (text) - Setting value
      - `description` (text) - What this setting does
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for authenticated users to read settings
    - Add policy for authenticated users to update settings
  
  3. Initial Data
    - Add zeffy_newsletter_embed setting
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO site_settings (key, value, description)
VALUES ('zeffy_newsletter_embed', '', 'Zeffy form embed code for newsletter signup')
ON CONFLICT (key) DO NOTHING;