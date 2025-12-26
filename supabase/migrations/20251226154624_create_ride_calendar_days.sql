/*
  # Create 13-Day Ride Calendar System

  1. New Tables
    - `ride_calendar_days`
      - `id` (uuid, primary key)
      - `day_number` (integer, 1-13)
      - `date` (date)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ride_calendar_events`
      - `id` (uuid, primary key)
      - `day_id` (uuid, foreign key to ride_calendar_days)
      - `title` (text)
      - `description` (text)
      - `time` (text)
      - `location` (text)
      - `category` (text) - 'rest_day', 'luncheon', 'dinner', 'social', 'maintenance', 'other'
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access for all users
    - Admin-only write access
*/

-- Create ride_calendar_days table
CREATE TABLE IF NOT EXISTS ride_calendar_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 13),
  date date,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ride_calendar_events table
CREATE TABLE IF NOT EXISTS ride_calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid NOT NULL REFERENCES ride_calendar_days(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  time text DEFAULT '',
  location text DEFAULT '',
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('rest_day', 'luncheon', 'dinner', 'social', 'maintenance', 'other')),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ride_calendar_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_calendar_events ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view calendar days"
  ON ride_calendar_days FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view calendar events"
  ON ride_calendar_events FOR SELECT
  USING (true);

-- Admin write policies for ride_calendar_days
CREATE POLICY "Authenticated users can insert calendar days"
  ON ride_calendar_days FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update calendar days"
  ON ride_calendar_days FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete calendar days"
  ON ride_calendar_days FOR DELETE
  TO authenticated
  USING (true);

-- Admin write policies for ride_calendar_events
CREATE POLICY "Authenticated users can insert calendar events"
  ON ride_calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update calendar events"
  ON ride_calendar_events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete calendar events"
  ON ride_calendar_events FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_calendar_days_day_number ON ride_calendar_days(day_number);
CREATE INDEX IF NOT EXISTS idx_calendar_events_day_id ON ride_calendar_events(day_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_order ON ride_calendar_events(day_id, order_index);

-- Insert the 13 days
INSERT INTO ride_calendar_days (day_number, title) VALUES
  (1, 'Day 1'),
  (2, 'Day 2'),
  (3, 'Day 3'),
  (4, 'Day 4'),
  (5, 'Day 5'),
  (6, 'Day 6'),
  (7, 'Day 7'),
  (8, 'Day 8'),
  (9, 'Day 9'),
  (10, 'Day 10'),
  (11, 'Day 11'),
  (12, 'Day 12'),
  (13, 'Day 13')
ON CONFLICT (day_number) DO NOTHING;