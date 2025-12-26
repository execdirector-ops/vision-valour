/*
  # Add Location Information to Blueberry Mountain Page

  1. New Columns
    - `col_stone_memorial_info` (text) - Information about Col Stone's Memorial location
    - `community_hall_info` (text) - Information about the Community Hall rental

  2. Purpose
    - Provide details about Col Stone's Memorial location
    - Promote the Community Hall for rent
*/

-- Add new columns for location information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueberry_mountain_page' AND column_name = 'col_stone_memorial_info'
  ) THEN
    ALTER TABLE blueberry_mountain_page 
    ADD COLUMN col_stone_memorial_info text DEFAULT '<h3>Col Stone Memorial</h3><p>Information about the memorial location coming soon.</p>';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueberry_mountain_page' AND column_name = 'community_hall_info'
  ) THEN
    ALTER TABLE blueberry_mountain_page 
    ADD COLUMN community_hall_info text DEFAULT '<h3>Community Hall</h3><p>The Blueberry Mountain Community Hall is available for rent. Contact us for booking information.</p>';
  END IF;
END $$;

-- Update the existing record with better default content
UPDATE blueberry_mountain_page
SET 
  col_stone_memorial_info = '<h3>Col Stone Memorial</h3><p>The Col Stone Memorial is located at Blueberry Mountain and serves as a tribute to military service and sacrifice. Visit this meaningful landmark during the walk to pay your respects and learn about its historical significance.</p>',
  community_hall_info = '<h3>Blueberry Mountain Community Hall</h3><p>The Community Hall is available for rent for events, gatherings, and celebrations. This beautiful facility offers a perfect venue for your special occasions.</p><p><strong>For booking inquiries and rates, please contact:</strong><br/>Email: exec.director@motorcycletourism.ca</p>'
WHERE id IS NOT NULL;
