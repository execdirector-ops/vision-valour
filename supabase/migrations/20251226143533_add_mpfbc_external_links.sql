/*
  # Add External Links to MPFBC Page
  
  1. Changes
    - Add `website_url` column to mpfbc_page table
    - Add `facebook_url` column to mpfbc_page table
    - Add `subtitle` column for hero section description
    
  2. Notes
    - These fields are nullable to allow flexibility
    - Will store links to MPFBC's official website and social media
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mpfbc_page' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE mpfbc_page ADD COLUMN website_url text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mpfbc_page' AND column_name = 'facebook_url'
  ) THEN
    ALTER TABLE mpfbc_page ADD COLUMN facebook_url text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mpfbc_page' AND column_name = 'subtitle'
  ) THEN
    ALTER TABLE mpfbc_page ADD COLUMN subtitle text DEFAULT 'Canada''s only military charity dedicated to supporting blind and visually impaired children';
  END IF;
END $$;