-- =====================================================
-- XMRT Battery Charger + Mining + DAO Integration Schema
-- =====================================================

-- =====================================================
-- 1. CREATE NEW TABLES
-- =====================================================

-- 1.1 DEVICES - Central Device Registry
CREATE TABLE IF NOT EXISTS public.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint text UNIQUE NOT NULL,
  device_type text CHECK (device_type IN ('pc', 'tablet', 'phone', 'unknown')) DEFAULT 'unknown',
  browser text,
  os text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  ip_addresses jsonb DEFAULT '[]'::jsonb,
  session_keys text[] DEFAULT ARRAY[]::text[],
  worker_id text,
  wallet_address text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.2 BATTERY_SESSIONS - Real-time Battery Monitoring Sessions
CREATE TABLE IF NOT EXISTS public.battery_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  session_key text NOT NULL,
  ip_address inet,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  battery_level_start integer CHECK (battery_level_start >= 0 AND battery_level_start <= 100),
  battery_level_end integer CHECK (battery_level_end >= 0 AND battery_level_end <= 100),
  was_charging boolean DEFAULT false,
  device_type text,
  browser text,
  os text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.3 BATTERY_READINGS - Granular Battery Snapshots (Time-Series)
CREATE TABLE IF NOT EXISTS public.battery_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.battery_sessions(id) ON DELETE CASCADE NOT NULL,
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  battery_level integer NOT NULL CHECK (battery_level >= 0 AND battery_level <= 100),
  is_charging boolean NOT NULL DEFAULT false,
  charging_time_remaining integer,
  discharging_time_remaining integer,
  charging_speed text CHECK (charging_speed IN ('slow', 'normal', 'fast', 'supercharge')),
  temperature_impact text CHECK (temperature_impact IN ('optimal', 'warm', 'hot')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.4 CHARGING_SESSIONS - Historical Charging Events
CREATE TABLE IF NOT EXISTS public.charging_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES public.battery_sessions(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  start_level integer NOT NULL CHECK (start_level >= 0 AND start_level <= 100),
  end_level integer CHECK (end_level >= 0 AND end_level <= 100),
  duration_seconds integer,
  charging_speed text CHECK (charging_speed IN ('slow', 'normal', 'fast', 'supercharge')),
  efficiency_score integer CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  port_quality text CHECK (port_quality IN ('excellent', 'good', 'needs-cleaning')),
  optimization_mode text CHECK (optimization_mode IN ('turbo', 'health', 'emergency', 'calibration', 'standard')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.5 BATTERY_HEALTH_SNAPSHOTS - Periodic Health Assessments
CREATE TABLE IF NOT EXISTS public.battery_health_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  assessed_at timestamptz NOT NULL DEFAULT now(),
  health_score integer NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
  degradation_level text CHECK (degradation_level IN ('excellent', 'good', 'fair', 'poor')),
  average_charging_speed text,
  charging_efficiency integer CHECK (charging_efficiency >= 0 AND charging_efficiency <= 100),
  temperature_impact text CHECK (temperature_impact IN ('optimal', 'warm', 'hot')),
  port_quality text CHECK (port_quality IN ('excellent', 'good', 'needs-cleaning')),
  total_charging_sessions integer DEFAULT 0,
  charging_streak_days integer DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.6 DEVICE_MINER_ASSOCIATIONS - Link Devices to Mining Workers
CREATE TABLE IF NOT EXISTS public.device_miner_associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  worker_id text NOT NULL,
  wallet_address text,
  associated_at timestamptz NOT NULL DEFAULT now(),
  association_method text CHECK (association_method IN ('manual', 'ip_match', 'qr_code', 'auto')),
  is_primary_device boolean DEFAULT false,
  mining_while_charging boolean DEFAULT false,
  total_sessions_while_mining integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.7 IP_ADDRESS_LOG - Comprehensive IP Tracking
CREATE TABLE IF NOT EXISTS public.ip_address_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  device_id uuid REFERENCES public.devices(id) ON DELETE SET NULL,
  worker_id text,
  wallet_address text,
  session_key text,
  activity_type text CHECK (activity_type IN ('battery_scan', 'mining', 'faucet_claim', 'dao_vote', 'assistant_query', 'other')),
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  total_requests integer DEFAULT 1,
  user_agent text,
  geolocation jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.8 XMRT_ASSISTANT_INTERACTIONS - Assistant Activity Log
CREATE TABLE IF NOT EXISTS public.xmrt_assistant_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.battery_sessions(id) ON DELETE SET NULL,
  interaction_type text CHECK (interaction_type IN ('battery_advice', 'mining_optimization', 'health_alert', 'general_query', 'proactive_alert')),
  prompt text,
  response text,
  recommendations_given jsonb DEFAULT '[]'::jsonb,
  user_action_taken text CHECK (user_action_taken IN ('accepted', 'dismissed', 'applied', 'ignored')),
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 1.9 DAO_MEMBERS - XMRT DAO Membership Registry
CREATE TABLE IF NOT EXISTS public.dao_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  member_since timestamptz NOT NULL DEFAULT now(),
  reputation_score integer DEFAULT 0,
  devices uuid[] DEFAULT ARRAY[]::uuid[],
  worker_ids text[] DEFAULT ARRAY[]::text[],
  ip_addresses jsonb DEFAULT '[]'::jsonb,
  voting_power numeric DEFAULT 0,
  total_contributions numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- 2. UPDATE EXISTING TABLES
-- =====================================================

-- 2.1 Add columns to worker_registrations
ALTER TABLE public.worker_registrations 
  ADD COLUMN IF NOT EXISTS device_id uuid REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS battery_optimized boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS charging_status text CHECK (charging_status IN ('charging', 'discharging', 'full', 'unknown')),
  ADD COLUMN IF NOT EXISTS last_battery_level integer CHECK (last_battery_level >= 0 AND last_battery_level <= 100);

-- 2.2 Add columns to user_worker_mappings
ALTER TABLE public.user_worker_mappings 
  ADD COLUMN IF NOT EXISTS device_id uuid REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS ip_addresses jsonb DEFAULT '[]'::jsonb;

-- 2.3 Add columns to faucet_claims
ALTER TABLE public.faucet_claims 
  ADD COLUMN IF NOT EXISTS device_id uuid REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS session_key text;

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Devices indexes
CREATE INDEX IF NOT EXISTS idx_devices_fingerprint ON public.devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_devices_worker_id ON public.devices(worker_id);
CREATE INDEX IF NOT EXISTS idx_devices_wallet_address ON public.devices(wallet_address);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON public.devices(last_seen_at DESC);

-- Battery sessions indexes
CREATE INDEX IF NOT EXISTS idx_battery_sessions_device ON public.battery_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_battery_sessions_session_key ON public.battery_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_battery_sessions_started_at ON public.battery_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_battery_sessions_active ON public.battery_sessions(is_active) WHERE is_active = true;

-- Battery readings indexes (time-series optimization)
CREATE INDEX IF NOT EXISTS idx_battery_readings_session ON public.battery_readings(session_id);
CREATE INDEX IF NOT EXISTS idx_battery_readings_device ON public.battery_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_battery_readings_timestamp ON public.battery_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_battery_readings_device_timestamp ON public.battery_readings(device_id, timestamp DESC);

-- Charging sessions indexes
CREATE INDEX IF NOT EXISTS idx_charging_sessions_device ON public.charging_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_charging_sessions_started_at ON public.charging_sessions(started_at DESC);

-- Battery health snapshots indexes
CREATE INDEX IF NOT EXISTS idx_battery_health_device ON public.battery_health_snapshots(device_id);
CREATE INDEX IF NOT EXISTS idx_battery_health_assessed_at ON public.battery_health_snapshots(assessed_at DESC);

-- Device miner associations indexes
CREATE INDEX IF NOT EXISTS idx_device_miner_device ON public.device_miner_associations(device_id);
CREATE INDEX IF NOT EXISTS idx_device_miner_worker ON public.device_miner_associations(worker_id);
CREATE INDEX IF NOT EXISTS idx_device_miner_wallet ON public.device_miner_associations(wallet_address);

-- IP address log indexes
CREATE INDEX IF NOT EXISTS idx_ip_log_ip ON public.ip_address_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_log_device ON public.ip_address_log(device_id);
CREATE INDEX IF NOT EXISTS idx_ip_log_worker ON public.ip_address_log(worker_id);
CREATE INDEX IF NOT EXISTS idx_ip_log_wallet ON public.ip_address_log(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ip_log_activity ON public.ip_address_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_ip_log_last_seen ON public.ip_address_log(last_seen DESC);

-- XMRT assistant interactions indexes
CREATE INDEX IF NOT EXISTS idx_assistant_device ON public.xmrt_assistant_interactions(device_id);
CREATE INDEX IF NOT EXISTS idx_assistant_session ON public.xmrt_assistant_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_assistant_created_at ON public.xmrt_assistant_interactions(created_at DESC);

-- DAO members indexes
CREATE INDEX IF NOT EXISTS idx_dao_members_wallet ON public.dao_members(wallet_address);
CREATE INDEX IF NOT EXISTS idx_dao_members_active ON public.dao_members(is_active) WHERE is_active = true;

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_health_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_miner_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_address_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xmrt_assistant_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dao_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES (Testing Phase - Public Access)
-- =====================================================

-- DEVICES: Public read/write for testing
CREATE POLICY "Anyone can view devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Anyone can insert devices" ON public.devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update devices" ON public.devices FOR UPDATE USING (true);
CREATE POLICY "Service role can delete devices" ON public.devices FOR DELETE USING (auth.role() = 'service_role');

-- BATTERY_SESSIONS: Public read/write for testing
CREATE POLICY "Anyone can view battery sessions" ON public.battery_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert battery sessions" ON public.battery_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update battery sessions" ON public.battery_sessions FOR UPDATE USING (true);
CREATE POLICY "Service role can delete battery sessions" ON public.battery_sessions FOR DELETE USING (auth.role() = 'service_role');

-- BATTERY_READINGS: Public read/write for testing
CREATE POLICY "Anyone can view battery readings" ON public.battery_readings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert battery readings" ON public.battery_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can delete battery readings" ON public.battery_readings FOR DELETE USING (auth.role() = 'service_role');

-- CHARGING_SESSIONS: Public read/write for testing
CREATE POLICY "Anyone can view charging sessions" ON public.charging_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert charging sessions" ON public.charging_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can delete charging sessions" ON public.charging_sessions FOR DELETE USING (auth.role() = 'service_role');

-- BATTERY_HEALTH_SNAPSHOTS: Public read, service role write
CREATE POLICY "Anyone can view battery health" ON public.battery_health_snapshots FOR SELECT USING (true);
CREATE POLICY "Service role manages battery health" ON public.battery_health_snapshots FOR ALL USING (auth.role() = 'service_role');

-- DEVICE_MINER_ASSOCIATIONS: Public read/write for testing
CREATE POLICY "Anyone can view device-miner associations" ON public.device_miner_associations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert device-miner associations" ON public.device_miner_associations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update device-miner associations" ON public.device_miner_associations FOR UPDATE USING (true);
CREATE POLICY "Service role can delete associations" ON public.device_miner_associations FOR DELETE USING (auth.role() = 'service_role');

-- IP_ADDRESS_LOG: Public read, service role write
CREATE POLICY "Anyone can view IP logs" ON public.ip_address_log FOR SELECT USING (true);
CREATE POLICY "Service role manages IP logs" ON public.ip_address_log FOR ALL USING (auth.role() = 'service_role');

-- XMRT_ASSISTANT_INTERACTIONS: Public read, service role write
CREATE POLICY "Anyone can view assistant interactions" ON public.xmrt_assistant_interactions FOR SELECT USING (true);
CREATE POLICY "Service role manages assistant interactions" ON public.xmrt_assistant_interactions FOR ALL USING (auth.role() = 'service_role');

-- DAO_MEMBERS: Public read/write for testing
CREATE POLICY "Anyone can view DAO members" ON public.dao_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert DAO members" ON public.dao_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update DAO members" ON public.dao_members FOR UPDATE USING (true);
CREATE POLICY "Service role can delete DAO members" ON public.dao_members FOR DELETE USING (auth.role() = 'service_role');

-- =====================================================
-- 6. CREATE TRIGGERS FOR UPDATED_AT COLUMNS
-- =====================================================

-- Trigger function already exists, just apply to new tables
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_battery_sessions_updated_at BEFORE UPDATE ON public.battery_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_device_miner_assoc_updated_at BEFORE UPDATE ON public.device_miner_associations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dao_members_updated_at BEFORE UPDATE ON public.dao_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================