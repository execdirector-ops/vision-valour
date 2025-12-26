/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing indexes for foreign keys on documents and registrations tables
    - Optimize RLS policies to use (select auth.uid()) pattern
    - Remove unused indexes
    
  2. Security Improvements
    - Remove duplicate permissive policies that create security vulnerabilities
    - Consolidate policies to have single, clear access rules per action
    
  3. Changes Made
    - Added index on documents(uploaded_by)
    - Added index on registrations(event_id)
    - Optimized RLS policies on events and documents tables
    - Dropped unused indexes on sponsors, route_stops, and waiver_submissions
    - Removed duplicate policies on multiple tables
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);

-- Drop the old RLS policies that use auth.uid() directly and recreate with select pattern
-- Events table
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events"
  ON events
  FOR SELECT
  USING (is_published = true);

-- Documents table
DROP POLICY IF EXISTS "Public can view public documents" ON documents;
CREATE POLICY "Public can view public documents"
  ON documents
  FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated users can manage documents" ON documents;
CREATE POLICY "Authenticated users can manage documents"
  ON documents
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Remove unused indexes
DROP INDEX IF EXISTS idx_sponsors_category;
DROP INDEX IF EXISTS idx_sponsors_active;
DROP INDEX IF EXISTS idx_route_stops_day_order;
DROP INDEX IF EXISTS idx_waiver_submissions_email;
DROP INDEX IF EXISTS idx_waiver_submissions_created_at;
DROP INDEX IF EXISTS idx_waiver_submissions_payment_status;

-- Fix duplicate permissive policies on contact_submissions
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view all contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update read status" ON contact_submissions;
CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Fix duplicate permissive policies on route_map_content
DROP POLICY IF EXISTS "Anyone can view route map content" ON route_map_content;
DROP POLICY IF EXISTS "Authenticated users can manage route map content" ON route_map_content;
CREATE POLICY "Public can view route map content"
  ON route_map_content
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage route map content"
  ON route_map_content
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Fix duplicate permissive policies on routes
DROP POLICY IF EXISTS "Authenticated users can view all routes" ON routes;
DROP POLICY IF EXISTS "Public can view active routes" ON routes;
CREATE POLICY "Public can view active routes"
  ON routes
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage routes"
  ON routes
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Fix duplicate permissive policies on sponsors
DROP POLICY IF EXISTS "Anyone can read active sponsors" ON sponsors;
DROP POLICY IF EXISTS "Anyone can view active sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can delete sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can manage sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can insert sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can read all sponsors" ON sponsors;
DROP POLICY IF EXISTS "Authenticated users can update sponsors" ON sponsors;

CREATE POLICY "Public can view active sponsors"
  ON sponsors
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage sponsors"
  ON sponsors
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);