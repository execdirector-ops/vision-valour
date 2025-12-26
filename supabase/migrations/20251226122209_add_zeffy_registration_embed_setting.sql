/*
  # Add Zeffy Registration Embed Setting

  1. Changes
    - Adds a new site_settings entry for zeffy_registration_embed
    - This allows admins to manage the registration form embed code from the admin panel
    - The embed code will be used on the /register page

  2. Note
    - Uses INSERT with ON CONFLICT to safely add the setting if it doesn't exist
    - Default value is the current hardcoded Zeffy registration form URL
*/

INSERT INTO site_settings (key, value, description)
VALUES (
  'zeffy_registration_embed',
  'https://www.zeffy.com/embed/ticketing/ride-for-vision-and-valour-2',
  'Zeffy registration form embed URL. This form appears on the /register page. Get the embed URL from your Zeffy form settings.'
)
ON CONFLICT (key) DO NOTHING;
