-- Fix: infinite recursion in RLS policy for `profiles`
-- Run this once in Supabase SQL Editor for existing databases.

BEGIN;

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

DROP POLICY IF EXISTS "Admins full access on profiles" ON public.profiles;
CREATE POLICY "Admins full access on profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins full access on projects" ON public.projects;
CREATE POLICY "Admins full access on projects"
  ON public.projects
  FOR ALL
  USING (public.is_admin_user(auth.uid()));

COMMIT;
