-- Create user_profiles table for IP-based tracking
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL UNIQUE,
  total_xmrt_earned NUMERIC DEFAULT 0 NOT NULL,
  total_time_online_seconds INTEGER DEFAULT 0 NOT NULL,
  last_reward_at TIMESTAMPTZ,
  device_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Create index for fast IP lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_ip ON public.user_profiles(ip_address);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view and insert
CREATE POLICY "Anyone can view user profiles" 
ON public.user_profiles FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert user profiles" 
ON public.user_profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update user profiles" 
ON public.user_profiles FOR UPDATE 
USING (true);

-- Create xmrt_transactions table for reward tracking
CREATE TABLE IF NOT EXISTS public.xmrt_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.device_connection_sessions(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL, -- 'time_reward', 'charging_bonus', 'max_mode_bonus'
  reason TEXT,
  multiplier NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_xmrt_transactions_user ON public.xmrt_transactions(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_xmrt_transactions_device ON public.xmrt_transactions(device_id);
CREATE INDEX IF NOT EXISTS idx_xmrt_transactions_created ON public.xmrt_transactions(created_at);

-- Enable RLS
ALTER TABLE public.xmrt_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view transactions
CREATE POLICY "Anyone can view XMRT transactions" 
ON public.xmrt_transactions FOR SELECT 
USING (true);

CREATE POLICY "Service role manages transactions" 
ON public.xmrt_transactions FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at_trigger ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();