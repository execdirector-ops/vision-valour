/*
  # Add Blueberry Mountain Walk Content Page
  
  1. Purpose
    - Add a new page entry for Blueberry Mountain historical walking trail content
    - This content will be displayed in a dedicated section on the About Page
    - Content will be editable through the existing ManagePages admin component
  
  2. Content Overview
    - Historical information about 42 soldiers from Blueberry Mountain
    - Zero killed in action across Boer War, WWI, WWII, and Korea
    - Information about 8 soldiers who served in multiple wars
    - Col James Riley Stone biography and MPFBC founding
    - Walking trail details from Military History Display Building to Presbyterian Church
    - Information about 9 storyboards along the pathway
    - Community Hall location and Blueberry Mountain Goodwill Society stewardship
  
  3. Security
    - Uses existing RLS policies on pages table
    - Public read access for all visitors
    - Authenticated users can edit through admin panel
*/

-- Insert Blueberry Mountain Walk page content
INSERT INTO pages (slug, title, content)
VALUES (
  'blueberry-mountain-walk',
  'Blueberry Mountain: A Legacy of Military Service',
  '<h2>Discover Blueberry Mountain</h2>
<p>In Alberta''s Peace Country lies <strong>Blueberry Mountain</strong>, home to an extraordinary military legacy. This historically significant location combines profound military heritage with the natural beauty of Alberta landscapes.</p>

<h3>A Remarkable Military History</h3>
<p><strong>42 soldiers</strong> who lived in Blueberry Mountain throughout the years served their country with distinction. What makes this community truly remarkable is that <strong>Blueberry Mountain had no killed in action soldiers</strong> in the Boer War, First World War, Second World War, or Korea - an extraordinary testament to fortune and fate.</p>

<h3>Multi-War Veterans</h3>
<p>Eight soldiers from Blueberry Mountain demonstrated extraordinary commitment by serving in multiple wars:</p>
<ul>
  <li><strong>1 soldier</strong> served in the Boer War and World War One</li>
  <li><strong>6 soldiers</strong> served in both World War One and World War Two</li>
  <li><strong>1 soldier</strong> served in World War Two and Korea</li>
</ul>

<h3>Colonel James Riley Stone: A Legacy of Compassion</h3>
<p><strong>Colonel James Riley Stone CM DSO & Two Bars MC CD</strong>, who lived in Blueberry Mountain, was the founder of the <strong>Military Police Fund for Blind Children (MPFBC)</strong>. The Military Police Fund for Blind Children is <strong>unique in Canada, as it is the only military charity in the country</strong>.</p>

<h2>The Blueberry Mountain Military History & Community Walk</h2>
<p>This engaging trail meanders through the historic old town site, bringing the past to life with stories of the buildings that once stood here and the remarkable people who called this place home.</p>

<h3>Your Journey</h3>
<p>The walk begins at the <strong>Military History Display Building</strong>, a tribute to the region''s proud military legacy. Along the outdoor pathway, you''ll find <strong>nine storyboards</strong>, each offering a glimpse into the community''s history, blending tales of resilience, heritage, and remembrance.</p>

<p>Your journey concludes at the <strong>Presbyterian Church</strong>, the ending point of the Blueberry Mountain Military and Community History Walk. The walk typically takes <strong>30 minutes to one hour</strong> for visitors to meander through at a comfortable pace.</p>

<p>Whether you''re a history enthusiast or a curious traveler, this walk offers a meaningful way to connect with the rich legacy of Blueberry Mountain.</p>

<h3>Location & Property Information</h3>
<p>The Blueberry Mountain Military History & Community Walk is located on property owned by the <strong>Blueberry Mountain Goodwill Society</strong>.</p>

<p><strong>The Blueberry Mountain Community Hall</strong> is located at:<br/>
<strong>AB-680, Blueberry Mountain, AB T0H 3G0</strong></p>'
)
ON CONFLICT (slug) 
DO UPDATE SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = now();