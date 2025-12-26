/*
  # Add Fundraising Page Embeds Settings

  1. Changes
    - Adds zeffy_fundraising_donation_embed setting for donation form
    - Adds zeffy_fundraising_leaderboard_embed setting for leaderboard
    - These allow admins to manage fundraising page embeds from the admin panel

  2. Note
    - Uses INSERT with ON CONFLICT to safely add settings if they don't exist
    - Sets initial values from the provided Zeffy embed codes
*/

INSERT INTO site_settings (key, value, description)
VALUES 
  (
    'zeffy_fundraising_donation_embed',
    'https://www.zeffy.com/embed/donation-form/vision-and-valour-challenge',
    'Zeffy donation form embed URL for the fundraising page. Get the embed URL from your Zeffy donation form settings.'
  ),
  (
    'zeffy_fundraising_leaderboard_embed',
    'https://www.zeffy.com/embed/leaderboard/vision-and-valour-challenge',
    'Zeffy leaderboard embed URL for the fundraising page. Get the embed URL from your Zeffy leaderboard settings.'
  )
ON CONFLICT (key) DO NOTHING;
