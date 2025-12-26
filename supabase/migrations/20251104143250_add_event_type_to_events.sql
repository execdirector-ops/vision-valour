/*
  # Add event type field to events table

  1. Changes
    - Add `event_type` column to events table
      - Values: 'ride_day', 'legion_event', 'luncheon', 'dinner', 'social', 'other'
    - Add `day_number` column for ride days (1-13)
    - Update existing events to have default type

  2. Notes
    - This allows categorizing events so riders and public know what type of event they can join
    - Day number helps organize the 13-day ride chronologically
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE events ADD COLUMN event_type text DEFAULT 'other' CHECK (event_type IN ('ride_day', 'legion_event', 'luncheon', 'dinner', 'social', 'other'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'day_number'
  ) THEN
    ALTER TABLE events ADD COLUMN day_number integer;
  END IF;
END $$;