-- ============================================================================
-- TRANZO - Auth Integration & Triggers
-- ============================================================================
-- This migration creates triggers to automatically sync auth.users with public.users
-- Run this migration after all previous migrations
-- ============================================================================

-- ============================================================================
-- FUNCTION: Create user profile on signup
-- ============================================================================
-- This function automatically creates a profile in public.users when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: On auth.users insert
-- ============================================================================
-- Automatically create a profile when a new user signs up

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTION: Sync user profile updates
-- ============================================================================
-- This function syncs updates from auth.users to public.users

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: On auth.users update
-- ============================================================================
-- Automatically sync profile updates

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email 
    OR OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_update();

-- ============================================================================
-- FUNCTION: Clean up user profile on delete
-- ============================================================================
-- This function is handled by CASCADE delete in the transactions table

-- Note: The ON DELETE CASCADE on transactions.user_id foreign key
-- will automatically delete all user transactions when a user is deleted

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Automatically creates a user profile in public.users when a new user signs up via Supabase Auth';

COMMENT ON FUNCTION public.handle_user_update() IS 
  'Automatically syncs user profile updates from auth.users to public.users';
