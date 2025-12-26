/*
  # Create Waiver and Swag Shop Page Tables

  1. New Tables
    - `waiver_page`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text) - HTML/markdown content for the waiver
      - `updated_at` (timestamptz)
    
    - `swag_shop_page`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text)
      - `zeffy_embed_code` (text) - Zeffy store embed code
      - `coin_image_front_url` (text)
      - `coin_image_back_url` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Public read access for both tables

  3. Initial Data
    - Insert default records for both pages
*/

-- Create waiver_page table
CREATE TABLE IF NOT EXISTS waiver_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Ride Waiver',
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create swag_shop_page table
CREATE TABLE IF NOT EXISTS swag_shop_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Swag Shop',
  subtitle text NOT NULL DEFAULT 'Official Ride for Vision & Valour merchandise',
  zeffy_embed_code text NOT NULL DEFAULT '',
  coin_image_front_url text DEFAULT '',
  coin_image_back_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waiver_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE swag_shop_page ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view waiver page"
  ON waiver_page
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view swag shop page"
  ON swag_shop_page
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can update policies
CREATE POLICY "Authenticated users can update waiver page"
  ON waiver_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update swag shop page"
  ON swag_shop_page
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial records if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM waiver_page) THEN
    INSERT INTO waiver_page (title, content)
    VALUES ('Ride Waiver', '<h2>Liability Waiver and Release</h2><p>Please read carefully before signing.</p>');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM swag_shop_page) THEN
    INSERT INTO swag_shop_page (
      title, 
      subtitle, 
      zeffy_embed_code,
      coin_image_front_url,
      coin_image_back_url
    )
    VALUES (
      'Swag Shop',
      'Official Ride for Vision & Valour merchandise',
      '',
      '/Ride forVision & Valour 2026 Coin.png',
      '/Ride forVision & Valour 2026 Coin Back.png'
    );
  END IF;
END $$;