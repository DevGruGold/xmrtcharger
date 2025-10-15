-- Fix security warning: Set search_path for function
-- Drop trigger first
DROP TRIGGER IF EXISTS update_user_profiles_updated_at_trigger ON public.user_profiles;

-- Drop and recreate function with proper search_path
DROP FUNCTION IF EXISTS public.update_user_profiles_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_user_profiles_updated_at_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();