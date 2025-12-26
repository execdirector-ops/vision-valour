import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'vision-valour-auth',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'vision-valour-admin',
    },
  },
});

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  location: string;
  registration_url: string | null;
  event_type: 'ride_day' | 'legion_event' | 'luncheon' | 'dinner' | 'social' | 'other';
  day_number: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Registration = {
  id: string;
  event_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  motorcycle_info: string;
  emergency_contact: string;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Document = {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  category: string;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
};

export type RegistrationInstructions = {
  id: string;
  title: string;
  instructions: string[];
  note_text: string;
  contact_email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
