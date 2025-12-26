/*
  # Create registration instructions table

  1. New Tables
    - `registration_instructions`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Section title (e.g., "How to Register")
      - `instructions` (jsonb) - Array of instruction steps
      - `note_text` (text) - Additional note/disclaimer text
      - `contact_email` (text) - Contact email for assistance
      - `is_active` (boolean) - Whether this instruction set is active
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `registration_instructions` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage instructions
*/

CREATE TABLE IF NOT EXISTS registration_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'How to Register',
  instructions jsonb NOT NULL DEFAULT '[]'::jsonb,
  note_text text DEFAULT 'All fields marked with an asterisk (*) are required. If you have any questions or need assistance with registration, please contact us.',
  contact_email text DEFAULT 'info@rideforvisionandvalour.com',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE registration_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active registration instructions"
  ON registration_instructions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert registration instructions"
  ON registration_instructions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update registration instructions"
  ON registration_instructions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete registration instructions"
  ON registration_instructions
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO registration_instructions (title, instructions, note_text, contact_email, is_active)
VALUES (
  'How to Register',
  '[
    "Complete the registration form below with your personal information",
    "Select your ticket type and any additional options",
    "Review your registration details carefully before submitting",
    "You will receive a confirmation email with your registration details and next steps"
  ]'::jsonb,
  'All fields marked with an asterisk (*) are required. If you have any questions or need assistance with registration, please contact us.',
  'info@rideforvisionandvalour.com',
  true
);