-- DigiCard - Configuration Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(100),
  company VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,

  -- Contact
  phone VARCHAR(50),
  phone_enabled BOOLEAN DEFAULT false,
  email_contact VARCHAR(100),
  email_enabled BOOLEAN DEFAULT false,
  website VARCHAR(255),
  website_enabled BOOLEAN DEFAULT false,

  -- Professional
  linkedin VARCHAR(255),
  linkedin_enabled BOOLEAN DEFAULT false,

  -- Social
  twitter VARCHAR(255),
  twitter_enabled BOOLEAN DEFAULT false,
  instagram VARCHAR(255),
  instagram_enabled BOOLEAN DEFAULT false,
  facebook VARCHAR(255),
  facebook_enabled BOOLEAN DEFAULT false,
  tiktok VARCHAR(255),
  tiktok_enabled BOOLEAN DEFAULT false,
  youtube VARCHAR(255),
  youtube_enabled BOOLEAN DEFAULT false,
  snapchat VARCHAR(100),
  snapchat_enabled BOOLEAN DEFAULT false,

  -- Tech
  github VARCHAR(255),
  github_enabled BOOLEAN DEFAULT false,

  -- Messaging
  whatsapp VARCHAR(50),
  whatsapp_enabled BOOLEAN DEFAULT false,
  telegram VARCHAR(100),
  telegram_enabled BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer un index sur username pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Politique : tout le monde peut lire les profils publics
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- 5. Politique : les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Politique : les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage policies for avatars bucket

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 9. Create analytics table for tracking card interactions
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'contact_saved', 'whatsapp_click', 'linkedin_click', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert analytics (for tracking public card views)
CREATE POLICY "Anyone can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Users can only read their own analytics
CREATE POLICY "Users can read their own analytics" ON analytics
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );
