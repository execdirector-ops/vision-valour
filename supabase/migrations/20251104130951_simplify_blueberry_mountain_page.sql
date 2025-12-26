/*
  # Simplify Blueberry Mountain Page

  1. Changes
    - Remove community_hall_info column (not needed)
    - Keep col_stone_memorial_info for memorial information
    - Update default content to be simpler and clearer

  2. Purpose
    - Simplify page to just be about the memorial and walk location
    - Remove rental information that's not needed
*/

-- Remove community hall column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueberry_mountain_page' AND column_name = 'community_hall_info'
  ) THEN
    ALTER TABLE blueberry_mountain_page DROP COLUMN community_hall_info;
  END IF;
END $$;

-- Update default content for col_stone_memorial_info
UPDATE blueberry_mountain_page
SET 
  col_stone_memorial_info = '<h3>Col Stone Memorial</h3><p>Information about the memorial and its location at Blueberry Mountain.</p>',
  content = '<h2>About the Walk</h2><p>The Blueberry Mountain Military History & Community Walk is a meaningful journey through our local military history and heritage.</p>'
WHERE id IS NOT NULL;
