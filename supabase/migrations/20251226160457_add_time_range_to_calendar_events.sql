/*
  # Add Time Range Fields to Calendar Events

  1. Changes
    - Add `start_time` column (time) to track event start time
    - Add `end_time` column (time) to track event end time
    - Keep the existing `time` column for backwards compatibility
    
  2. Notes
    - Times will support scheduling from 8:00 AM to 8:00 PM
    - Allows precise time slots like "8:00 AM - 9:00 AM" for breakfast
    - Events can be displayed in chronological order within each day
*/

-- Add start_time and end_time columns to ride_calendar_events table
ALTER TABLE ride_calendar_events 
ADD COLUMN IF NOT EXISTS start_time time,
ADD COLUMN IF NOT EXISTS end_time time;
