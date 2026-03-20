-- ══════════════════════════════════════════════════════════════════════════════
-- Online Clothes Store – Supabase Database Migration
-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Enable UUID extension ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- Extended user information linked to auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  address     TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function for admin checks used in RLS policies.
-- SECURITY DEFINER avoids recursive policy evaluation when checking `profiles`.
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Users can read/update their own profile
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins full access on profiles"
  ON profiles FOR ALL
  USING (public.is_admin_user(auth.uid()));

-- ─── projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  file_url    TEXT,
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own projects
CREATE POLICY "Owners manage own projects"
  ON projects FOR ALL
  USING (auth.uid() = owner_id);

-- Admins can manage all projects
CREATE POLICY "Admins full access on projects"
  ON projects FOR ALL
  USING (public.is_admin_user(auth.uid()));

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── Supabase Storage: project-files bucket ───────────────────────────────────
-- Run this separately OR via Supabase Dashboard → Storage
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('project-files', 'project-files', true)
-- ON CONFLICT (id) DO NOTHING;
