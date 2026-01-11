import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'digicard-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  bio: string;
  avatar_url: string;
  phone: string;
  phone_enabled: boolean;
  email_contact: string;
  email_enabled: boolean;
  website: string;
  website_enabled: boolean;
  linkedin: string;
  linkedin_enabled: boolean;
  twitter: string;
  twitter_enabled: boolean;
  instagram: string;
  instagram_enabled: boolean;
  facebook: string;
  facebook_enabled: boolean;
  tiktok: string;
  tiktok_enabled: boolean;
  youtube: string;
  youtube_enabled: boolean;
  snapchat: string;
  snapchat_enabled: boolean;
  github: string;
  github_enabled: boolean;
  whatsapp: string;
  whatsapp_enabled: boolean;
  telegram: string;
  telegram_enabled: boolean;
  created_at: string;
  updated_at: string;
};
