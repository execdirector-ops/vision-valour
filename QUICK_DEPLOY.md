# Quick Deployment Guide

## Deploy to Vercel (Recommended)

### Option 1: Via Vercel Dashboard (Easiest)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com and sign in with GitHub
   - Click "Add New" → "Project"
   - Select your repository
   - Vercel auto-detects Vite configuration
   - Click "Environment Variables" and add all variables from `.env`:
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
     - RESEND_API_KEY
     - VITE_SWAG_SHOP_URL
     - VITE_ZEFFY_REGISTRATION_URL
     - VITE_FLICKR_ALBUM_2025_URL
     - VITE_FLICKR_ALBUM_2024_URL
     - VITE_NOTIFICATION_FROM_EMAIL
     - VITE_NOTIFICATION_TO_EMAILS
   - Click "Deploy"

3. **Done!** Your site will be live in 1-2 minutes

### Option 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow prompts to link project
   - Choose default settings for Vite

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add RESEND_API_KEY
   vercel env add VITE_SWAG_SHOP_URL
   vercel env add VITE_ZEFFY_REGISTRATION_URL
   vercel env add VITE_FLICKR_ALBUM_2025_URL
   vercel env add VITE_FLICKR_ALBUM_2024_URL
   vercel env add VITE_NOTIFICATION_FROM_EMAIL
   vercel env add VITE_NOTIFICATION_TO_EMAILS
   ```
   - Select "Production" for each
   - Paste the values from your `.env` file

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Deploy to Netlify

### Option 1: Via Netlify Dashboard (Easiest)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to https://app.netlify.com and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider and select your repository
   - Build settings (Netlify should auto-detect):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Add environment variables":
     - Add all variables from your `.env` file
   - Click "Deploy site"

3. **Done!** Your site will be live in 2-3 minutes

### Option 2: Via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or use auto-generated)
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Go to https://app.netlify.com
   - Select your site
   - Go to "Site settings" → "Environment variables"
   - Add all variables from your `.env` file

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## Important: Configure Supabase Edge Function Secrets

After deploying to either platform, you must configure the Edge Function secrets in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to "Edge Functions" → "Configuration"
3. Add these secrets:
   - `RESEND_API_KEY` (your Resend API key)
   - `VITE_NOTIFICATION_FROM_EMAIL` (e.g., noreply@visionandvalour.ca)
   - `VITE_NOTIFICATION_TO_EMAILS` (comma-separated list)

---

## Post-Deployment Checklist

After deploying:

- [ ] Visit your deployed site
- [ ] Test navigation across all pages
- [ ] Try logging in as admin
- [ ] Submit a test waiver form to verify email notifications
- [ ] Check browser console for any errors
- [ ] Test on mobile devices

---

## Updating Your Site

### For Vercel
Just push to your main branch:
```bash
git add .
git commit -m "Update content"
git push
```
Vercel auto-deploys on push.

### For Netlify
Just push to your main branch:
```bash
git add .
git commit -m "Update content"
git push
```
Netlify auto-deploys on push.

---

## Custom Domain Setup

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as shown

### Netlify
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

---

## Troubleshooting

**Build Fails:**
- Check that all environment variables are set
- Verify Node.js version is 18+ in platform settings

**Site Loads but Features Don't Work:**
- Verify all environment variables are set correctly
- Check browser console for errors
- Verify Supabase project is active

**Email Notifications Not Working:**
- Check Edge Function secrets in Supabase Dashboard
- Verify RESEND_API_KEY is valid
- Check Edge Function logs in Supabase

**Images Not Loading:**
- Verify image files are committed to Git
- Check browser console for 404 errors
- Ensure public folder is being deployed
