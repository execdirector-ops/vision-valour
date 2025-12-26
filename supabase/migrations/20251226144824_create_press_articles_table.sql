/*
  # Create press articles table

  1. New Tables
    - `press_articles`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Article title
      - `description` (text, nullable) - Brief description of the article
      - `url` (text) - Link to the article
      - `publication` (text) - Name of the publication/source
      - `published_date` (date, nullable) - Date article was published
      - `image_url` (text, nullable) - Optional thumbnail/image
      - `display_order` (integer) - Order for displaying articles
      - `is_published` (boolean) - Whether to show on public site
      - `created_at` (timestamptz) - When record was created
      - `updated_at` (timestamptz) - When record was last updated
  
  2. Security
    - Enable RLS on `press_articles` table
    - Add policy for public users to read published articles
    - Add policy for authenticated users to manage articles
*/

CREATE TABLE IF NOT EXISTS press_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  publication text NOT NULL,
  published_date date,
  image_url text,
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE press_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published press articles"
  ON press_articles
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all press articles"
  ON press_articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert press articles"
  ON press_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update press articles"
  ON press_articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete press articles"
  ON press_articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_press_articles_published ON press_articles(is_published, display_order, published_date DESC);