/*
  # Update Ride Calendar Event Categories
  
  1. Changes
    - Drop existing category check constraint
    - Add new constraint with expanded categories to match admin UI
    - Includes: hotel, breakfast, luncheon, dinner, gas_stop, rest_day, social, maintenance, other
*/

-- Drop the old constraint
ALTER TABLE ride_calendar_events DROP CONSTRAINT IF EXISTS ride_calendar_events_category_check;

-- Add new constraint with all the categories used in the admin UI
ALTER TABLE ride_calendar_events 
ADD CONSTRAINT ride_calendar_events_category_check 
CHECK (category IN ('hotel', 'breakfast', 'luncheon', 'dinner', 'gas_stop', 'rest_day', 'social', 'maintenance', 'other'));
