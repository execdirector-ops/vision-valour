/*
  # Add brochure URL field to Blueberry Mountain page

  1. Changes
    - Add `brochure_url` column to `blueberry_mountain_page` table
    - This allows linking to documents like "The Blueberry Mountain Community.pdf"
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueberry_mountain_page' AND column_name = 'brochure_url'
  ) THEN
    ALTER TABLE blueberry_mountain_page ADD COLUMN brochure_url text DEFAULT '';
  END IF;
END $$;