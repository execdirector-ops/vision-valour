/*
  # Ride for Vision & Valour CMS Database Schema

  ## 1. New Tables
  
  ### `pages`
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique) - URL slug (home, mission, etc.)
  - `title` (text) - Page title
  - `content` (text) - Page content in markdown/html
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `events`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `start_date` (timestamptz) - Event start date/time
  - `end_date` (timestamptz) - Event end date/time
  - `location` (text) - Event location
  - `is_published` (boolean) - Publish status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `registrations`
  - `id` (uuid, primary key) - Unique identifier
  - `event_id` (uuid, foreign key) - Reference to events table
  - `first_name` (text) - Registrant first name
  - `last_name` (text) - Registrant last name
  - `email` (text) - Registrant email
  - `phone` (text) - Registrant phone number
  - `motorcycle_info` (text) - Motorcycle information
  - `emergency_contact` (text) - Emergency contact details
  - `created_at` (timestamptz) - Registration timestamp
  
  ### `contact_submissions`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Submission timestamp
  
  ### `documents`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Document title
  - `description` (text) - Document description
  - `file_name` (text) - Original file name
  - `file_url` (text) - Storage URL
  - `file_size` (bigint) - File size in bytes
  - `mime_type` (text) - MIME type
  - `category` (text) - Document category
  - `is_public` (boolean) - Public access flag
  - `uploaded_by` (uuid, foreign key) - Reference to auth.users
  - `created_at` (timestamptz) - Upload timestamp

  ## 2. Security
  
  - Enable RLS on all tables
  - Public read access for published content
  - Authenticated users can manage content
  - Secure registration and contact submissions
*/

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text DEFAULT '',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  motorcycle_info text DEFAULT '',
  emergency_contact text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint DEFAULT 0,
  mime_type text DEFAULT '',
  category text DEFAULT 'general',
  is_public boolean DEFAULT true,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Pages policies
CREATE POLICY "Public can view all pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pages"
  ON pages FOR DELETE
  TO authenticated
  USING (true);

-- Events policies
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Registrations policies
CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registrations"
  ON registrations FOR DELETE
  TO authenticated
  USING (true);

-- Contact submissions policies
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Documents policies
CREATE POLICY "Public can view public documents"
  ON documents FOR SELECT
  TO anon, authenticated
  USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- Insert default pages
INSERT INTO pages (slug, title, content) VALUES
  ('home', 'Welcome to Ride for Vision & Valour', 'Join us in our mission to ride with heart and inspire valour. Our annual motorcycle ride brings together riders from across the region to support veterans and vision-related causes.'),
  ('mission', 'Our Mission', 'To honor and support our veterans through community engagement and fundraising activities while promoting awareness of vision-related causes that affect our servicemen and women.'),
  ('vision', 'Our Vision', 'A community where veterans receive the support and recognition they deserve, and where vision-related challenges are addressed with compassion and action.'),
  ('values', 'Our Values', '**Honour**: We honour the service and sacrifice of our veterans.\n\n**Community**: We build strong, supportive communities through shared experiences.\n\n**Compassion**: We approach every interaction with empathy and understanding.\n\n**Action**: We take meaningful action to create positive change.')
ON CONFLICT (slug) DO NOTHING;