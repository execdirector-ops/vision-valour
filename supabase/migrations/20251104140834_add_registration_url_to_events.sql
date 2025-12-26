/*
  # Add Registration URL to Events

  1. Changes
    - Add `registration_url` column to `events` table
      - Stores external registration link (e.g., Zeffy URL)
      - Optional field, defaults to null
    
  2. Notes
    - Allows events to link to external registration platforms
    - When set, "Register Now" button will open this URL instead of internal form
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'registration_url'
  ) THEN
    ALTER TABLE events ADD COLUMN registration_url text;
  END IF;
END $$;