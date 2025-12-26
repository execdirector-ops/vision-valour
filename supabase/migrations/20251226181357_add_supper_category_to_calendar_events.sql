/*
  # Add 'supper' as valid category for calendar events
  
  1. Changes Made
    - Remove existing check constraint on category column
    - Add new check constraint that includes 'supper' as a valid category
    
  2. Valid Categories
    - hotel, breakfast, luncheon, supper, dinner, gas_stop, rest_day, social, maintenance, other
    
  3. Purpose
    - Allow events to be categorized as 'supper' instead of only 'luncheon'
    - Provides more accurate meal time classification
*/

-- Drop the existing constraint
ALTER TABLE ride_calendar_events
DROP CONSTRAINT IF EXISTS ride_calendar_events_category_check;

-- Add new check constraint with 'supper' included
ALTER TABLE ride_calendar_events
ADD CONSTRAINT ride_calendar_events_category_check
CHECK (
  category <@ ARRAY['hotel', 'breakfast', 'luncheon', 'supper', 'dinner', 'gas_stop', 'rest_day', 'social', 'maintenance', 'other']::text[]
  AND array_length(category, 1) > 0
);

-- Update comment to reflect new valid values
COMMENT ON COLUMN ride_calendar_events.category IS 'Array of event categories. Valid values: hotel, breakfast, luncheon, supper, dinner, gas_stop, rest_day, social, maintenance, other';