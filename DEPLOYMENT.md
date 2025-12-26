# Vision & Valour - Deployment Guide

This guide provides complete instructions for deploying the Vision & Valour website to a new hosting environment.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Resend account for email notifications
- Git for version control

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in all required values:

```bash
cp .env.example .env
```

#### Required Environment Variables

**Supabase Configuration**

Get these from your Supabase project dashboard at: `https://app.supabase.com/project/_/settings/api`

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Email Service (Resend)**

Get your API key from: https://resend.com/api-keys

- `RESEND_API_KEY` - Your Resend API key for sending emails

**External Services**

- `VITE_SWAG_SHOP_URL` - URL to your Spreadshop merchandise store
- `VITE_ZEFFY_REGISTRATION_URL` - URL to your Zeffy registration embed

**Photo Gallery URLs**

- `VITE_FLICKR_ALBUM_2025_URL` - Flickr album URL for 2025 photos
- `VITE_FLICKR_ALBUM_2024_URL` - Flickr album URL for 2024 photos

**Email Notification Configuration**

- `VITE_NOTIFICATION_FROM_EMAIL` - Sender email address (use a verified domain, not onboarding@resend.dev)
- `VITE_NOTIFICATION_TO_EMAILS` - Comma-separated list of recipient emails for waiver notifications

### 3. Set Up Supabase Database

#### Database Migrations

All database migrations are located in `supabase/migrations/`. Run them in order:

```bash
# If using Supabase CLI
supabase db push
```

Or apply them manually through the Supabase Dashboard SQL Editor.

#### Storage Buckets

The following storage buckets will be created by migrations:
- `documents` - For documents and PDFs
- `photos` - For photo gallery images
- `media-submissions` - For user-submitted media

#### Row Level Security (RLS)

All tables have RLS enabled by default. The migrations include appropriate policies for:
- Public read access where needed
- Authenticated admin access for CMS operations
- Secure waiver and contact form submissions

### 4. Configure Edge Functions

#### Deploy Edge Functions

The project includes one Edge Function: `send-waiver-notification`

This function is already deployed, but if you need to redeploy:

```bash
# Using Supabase CLI
supabase functions deploy send-waiver-notification
```

#### Set Edge Function Secrets

In your Supabase Dashboard, go to Edge Functions → Settings and add these secrets:

- `RESEND_API_KEY` - Your Resend API key
- `VITE_NOTIFICATION_FROM_EMAIL` - Sender email address
- `VITE_NOTIFICATION_TO_EMAILS` - Comma-separated recipient emails

### 5. Verify Resend Email Configuration

1. Log in to your Resend account
2. Verify a custom domain (strongly recommended over using onboarding@resend.dev)
3. Update `VITE_NOTIFICATION_FROM_EMAIL` to use your verified domain
4. Test email sending by submitting a waiver form

## Building for Production

### Build the Application

```bash
npm run build
```

This will:
- Run TypeScript type checking
- Build the application for production
- Output files to the `dist/` directory

### Preview the Build Locally

```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to link your project
4. Add environment variables in the Vercel dashboard

### Option 2: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify init`
3. Follow the prompts to link your project
4. Add environment variables in the Netlify dashboard

### Option 3: Custom VPS/Server

1. Build the application: `npm run build`
2. Copy the `dist/` directory to your web server
3. Configure your web server (nginx, Apache, etc.) to serve the static files
4. Ensure all routes redirect to `index.html` for client-side routing

#### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/vision-valour/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Post-Deployment Checklist

### 1. Verify Database Connection
- [ ] Test that the site can read from Supabase tables
- [ ] Verify RLS policies are working correctly
- [ ] Check that storage buckets are accessible

### 2. Test Core Features
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Admin login works
- [ ] CMS pages are editable (admin access)
- [ ] Photo gallery displays correctly
- [ ] Document uploads work

### 3. Test Form Submissions
- [ ] Waiver form submits successfully
- [ ] Waiver notification emails are sent
- [ ] Contact form submits successfully
- [ ] Registration page loads correctly

### 4. Test External Integrations
- [ ] Swag shop link redirects correctly
- [ ] Zeffy registration embed works
- [ ] Flickr albums load correctly
- [ ] All external links are functional

### 5. Performance & Security
- [ ] SSL certificate is installed
- [ ] Site loads over HTTPS
- [ ] No console errors in browser
- [ ] Images load correctly
- [ ] Mobile responsiveness works

## Troubleshooting

### Database Connection Issues

If you see "Failed to fetch" errors:
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check that RLS policies allow the required access
3. Verify the Supabase project is not paused

### Email Notifications Not Sending

If waiver notifications aren't being sent:
1. Check that `RESEND_API_KEY` is set in Edge Function secrets
2. Verify the sender email domain is verified in Resend
3. Check Edge Function logs in Supabase Dashboard
4. Test the Edge Function directly via the Supabase dashboard

### Environment Variables Not Working

If environment variables aren't being picked up:
1. Ensure variables are prefixed with `VITE_` for client-side access
2. Rebuild the application after changing .env
3. Clear browser cache and hard refresh
4. Check that the hosting platform has the variables configured

### Build Failures

If the build fails:
1. Run `npm run typecheck` to check for TypeScript errors
2. Run `npm run lint` to check for linting issues
3. Ensure all dependencies are installed: `npm install`
4. Check Node.js version is 18+

## Security Considerations

### Credential Rotation

If credentials were ever committed to version control:
1. **Immediately rotate all credentials:**
   - Generate new Supabase anon key
   - Generate new Resend API key
   - Update all environment variables

### Best Practices

1. Never commit `.env` to version control
2. Use strong, unique passwords for admin accounts
3. Regularly review RLS policies
4. Keep dependencies updated: `npm update`
5. Monitor Edge Function logs for suspicious activity
6. Enable Supabase database backups

## Maintenance

### Regular Tasks

- **Weekly:** Review waiver submissions and contact form entries
- **Monthly:** Check for npm package updates
- **Quarterly:** Review and rotate API keys
- **Annually:** Review and update content, verify all external links

### Updating Content

Most content can be updated through the admin panel at `/admin` without requiring code changes:
- Events
- Pages
- Photos
- Documents
- Sponsors
- Routes

### Adding New Features

When adding new features:
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Create database migrations if needed
4. Update environment variables if required
5. Test thoroughly before deploying
6. Document any new environment variables in `.env.example`

## Support & Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Vite Documentation:** https://vitejs.dev/
- **React Documentation:** https://react.dev/
- **Resend Documentation:** https://resend.com/docs

## Emergency Rollback

If something goes wrong after deployment:

1. Revert to previous version in hosting platform
2. Restore database from Supabase backup if needed
3. Check Edge Function logs for errors
4. Review recent changes in version control

For database rollbacks:
1. Go to Supabase Dashboard → Database → Backups
2. Restore from a point-in-time backup
3. Verify data integrity after restoration
