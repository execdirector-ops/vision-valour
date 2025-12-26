/*
  # Create Waiver Submissions Table

  ## Overview
  This migration creates a comprehensive table for storing online waiver submissions
  for the Ride for Vision & Valour 2026 event, including rider and passenger information.

  ## New Tables
  
  ### `waiver_submissions`
  Stores all waiver form submissions with complete participant information
  
  #### Rider Information
  - `id` (uuid, primary key) - Unique identifier for each submission
  - `full_name` (text) - Rider's full legal name
  - `date_of_birth` (date) - Rider's date of birth
  - `age` (integer) - Rider's age
  - `address` (text) - Street address
  - `city_province_postal` (text) - City, province, and postal code
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email address
  - `emergency_contact_name` (text) - Emergency contact full name
  - `emergency_contact_phone` (text) - Emergency contact phone
  - `motorcycle_make_model` (text) - Motorcycle details
  - `license_plate` (text) - License plate number
  - `license_province` (text) - Province/state of registration
  - `has_passenger` (boolean) - Whether carrying a passenger
  
  #### Passenger Information (Optional)
  - `passenger_full_name` (text, nullable) - Passenger's full legal name
  - `passenger_date_of_birth` (date, nullable) - Passenger's date of birth
  - `passenger_age` (integer, nullable) - Passenger's age
  - `passenger_address` (text, nullable) - Passenger's street address
  - `passenger_city_province_postal` (text, nullable) - Passenger's city/province/postal
  - `passenger_phone` (text, nullable) - Passenger's contact phone
  - `passenger_email` (text, nullable) - Passenger's contact email
  - `passenger_emergency_contact_name` (text, nullable) - Passenger's emergency contact
  - `passenger_emergency_contact_phone` (text, nullable) - Passenger's emergency phone
  
  #### Minor Information (Optional)
  - `is_minor` (boolean, default false) - Whether rider is under 18
  - `parent_guardian_name` (text, nullable) - Parent/guardian name for minors
  - `passenger_is_minor` (boolean, default false) - Whether passenger is under 18
  - `passenger_parent_guardian_name` (text, nullable) - Passenger's parent/guardian
  
  #### Signatures and Consent
  - `rider_signature` (text) - Digital signature/name confirmation
  - `rider_signature_date` (timestamptz) - When rider signed
  - `passenger_signature` (text, nullable) - Passenger's digital signature
  - `passenger_signature_date` (timestamptz, nullable) - When passenger signed
  - `parent_guardian_signature` (text, nullable) - Parent/guardian signature
  - `parent_guardian_signature_date` (timestamptz, nullable) - When parent signed
  - `passenger_parent_guardian_signature` (text, nullable) - Passenger parent signature
  - `passenger_parent_guardian_signature_date` (timestamptz, nullable) - Passenger parent sign date
  
  #### Administrative Fields
  - `submission_ip` (text, nullable) - IP address of submission
  - `created_at` (timestamptz) - When waiver was submitted
  - `updated_at` (timestamptz) - Last update timestamp
  - `payment_status` (text, default 'pending') - Payment status tracking
  - `registration_fee_amount` (decimal, nullable) - Registration fee paid
  - `passenger_fee_amount` (decimal, nullable) - Passenger fee paid
  - `admin_notes` (text, nullable) - Internal notes
  - `packet_issued` (boolean, default false) - Whether participant packet issued

  ## Security
  - Enable RLS on `waiver_submissions` table
  - Public users can INSERT their own waiver submissions
  - Only authenticated admins can SELECT, UPDATE, DELETE waiver submissions
*/

CREATE TABLE IF NOT EXISTS waiver_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Rider Information
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  age integer NOT NULL,
  address text NOT NULL,
  city_province_postal text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  motorcycle_make_model text NOT NULL,
  license_plate text NOT NULL,
  license_province text NOT NULL,
  has_passenger boolean DEFAULT false,
  
  -- Passenger Information (optional)
  passenger_full_name text,
  passenger_date_of_birth date,
  passenger_age integer,
  passenger_address text,
  passenger_city_province_postal text,
  passenger_phone text,
  passenger_email text,
  passenger_emergency_contact_name text,
  passenger_emergency_contact_phone text,
  
  -- Minor Information
  is_minor boolean DEFAULT false,
  parent_guardian_name text,
  passenger_is_minor boolean DEFAULT false,
  passenger_parent_guardian_name text,
  
  -- Signatures and Consent
  rider_signature text NOT NULL,
  rider_signature_date timestamptz DEFAULT now(),
  passenger_signature text,
  passenger_signature_date timestamptz,
  parent_guardian_signature text,
  parent_guardian_signature_date timestamptz,
  passenger_parent_guardian_signature text,
  passenger_parent_guardian_signature_date timestamptz,
  
  -- Administrative
  submission_ip text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending',
  registration_fee_amount decimal(10,2),
  passenger_fee_amount decimal(10,2),
  admin_notes text,
  packet_issued boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE waiver_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a waiver (public form)
CREATE POLICY "Anyone can submit waiver"
  ON waiver_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admins) can view waivers
CREATE POLICY "Admins can view all waivers"
  ON waiver_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users (admins) can update waivers
CREATE POLICY "Admins can update waivers"
  ON waiver_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admins) can delete waivers
CREATE POLICY "Admins can delete waivers"
  ON waiver_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_waiver_submissions_email ON waiver_submissions(email);
CREATE INDEX IF NOT EXISTS idx_waiver_submissions_created_at ON waiver_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waiver_submissions_payment_status ON waiver_submissions(payment_status);