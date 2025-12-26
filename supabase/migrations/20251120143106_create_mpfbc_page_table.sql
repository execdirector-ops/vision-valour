/*
  # Create MPFBC Page Table

  1. New Tables
    - `mpfbc_page`
      - `id` (uuid, primary key)
      - `title` (text) - Page title
      - `hero_image_url` (text, nullable) - Hero/banner image
      - `content` (text) - Main content in HTML format
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `mpfbc_page` table
    - Add policy for public read access
    - Add policy for authenticated users to update

  3. Initial Data
    - Insert default MPFBC page content
*/

CREATE TABLE IF NOT EXISTS mpfbc_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Military Police Fund for Blind Children',
  hero_image_url text,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mpfbc_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view MPFBC page"
  ON mpfbc_page
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update MPFBC page"
  ON mpfbc_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default content
INSERT INTO mpfbc_page (title, content)
VALUES (
  'Military Police Fund for Blind Children',
  '<h2>About MPFBC</h2>
<p>The Military Police Fund for Blind Children (MPFBC) is unique in Canada, as it is the only military charity in the country dedicated to supporting blind and visually impaired children.</p>

<h2>Our Mission</h2>
<p>Founded by Colonel James Riley Stone CM DSO & Two Bars MC CD, the MPFBC provides crucial support and resources to children with visual impairments across Canada.</p>

<h2>How We Support</h2>
<p>The fund helps families with blind and visually impaired children access the resources, equipment, and support they need to thrive.</p>'
)
ON CONFLICT DO NOTHING;