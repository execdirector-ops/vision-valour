/*
  # Add Multiple Categories Support to Calendar Events

  ## Changes Made
  
  1. Schema Changes
    - Convert `category` column from `text` to `text[]` (array of text)
    - Update existing data to use array format (e.g., 'social' becomes ['social'])
    - Remove old check constraint
    - Add new check constraint to validate array values
    
  2. Benefits
    - Events can now have multiple categories (e.g., both 'luncheon' and 'social')
    - Better classification for public events
    - Improved flexibility for event management
    
  3. Data Migration
    - All existing single category values are preserved and converted to single-item arrays
    - No data loss during migration
*/

-- First, create a temporary column to hold the array values
ALTER TABLE ride_calendar_events 
ADD COLUMN categories_temp text[];

-- Copy existing category data into array format
UPDATE ride_calendar_events 
SET categories_temp = ARRAY[category];

-- Drop the old constraint
ALTER TABLE ride_calendar_events 
DROP CONSTRAINT IF EXISTS ride_calendar_events_category_check;

-- Drop the old column
ALTER TABLE ride_calendar_events 
DROP COLUMN category;

-- Rename the temp column to category
ALTER TABLE ride_calendar_events 
RENAME COLUMN categories_temp TO category;

-- Add NOT NULL constraint
ALTER TABLE ride_calendar_events 
ALTER COLUMN category SET NOT NULL;

-- Add check constraint to validate array contents
ALTER TABLE ride_calendar_events
ADD CONSTRAINT ride_calendar_events_category_check
CHECK (
  category <@ ARRAY['hotel', 'breakfast', 'luncheon', 'dinner', 'gas_stop', 'rest_day', 'social', 'maintenance', 'other']::text[]
  AND array_length(category, 1) > 0
);

-- Add comment to column
COMMENT ON COLUMN ride_calendar_events.category IS 'Array of event categories. Valid values: hotel, breakfast, luncheon, dinner, gas_stop, rest_day, social, maintenance, other';
