-- XMRT-Charger Real-Time Monitoring & Engagement System
-- Device Connection Tracking, Activity Logging, Engagement Commands, and PoP Ledger

-- =====================================================
-- 1. DEVICE CONNECTION SESSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.device_connection_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  session_key TEXT NOT NULL,
  
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  disconnected_at TIMESTAMP WITH TIME ZONE,
  last_heartbeat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  ip_address INET,
  user_agent TEXT,
  app_version TEXT,
  
  total_duration_seconds INTEGER,
  battery_level_start INTEGER,
  battery_level_end INTEGER,
  charging_sessions_count INTEGER DEFAULT 0,
  
  commands_received INTEGER DEFAULT 0,
  commands_executed INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_duration CHECK (total_duration_seconds >= 0)
);

CREATE INDEX idx_device_conn_sessions_device_id ON public.device_connection_sessions(device_id);
CREATE INDEX idx_device_conn_sessions_active ON public.device_connection_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_device_conn_sessions_heartbeat ON public.device_connection_sessions(last_heartbeat);

ALTER TABLE public.device_connection_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert connection sessions"
  ON public.device_connection_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update connection sessions"
  ON public.device_connection_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can view connection sessions"
  ON public.device_connection_sessions FOR SELECT
  USING (true);

-- =====================================================
-- 2. ACTIVITY LOGGING
-- =====================================================

CREATE TYPE public.activity_severity AS ENUM ('info', 'warning', 'error', 'critical');
CREATE TYPE public.activity_category AS ENUM (
  'connection', 'charging', 'calibration', 'battery_health', 
  'system_event', 'user_action', 'anomaly'
);

CREATE TABLE IF NOT EXISTS public.device_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.device_connection_sessions(id) ON DELETE SET NULL,
  
  category public.activity_category NOT NULL,
  activity_type TEXT NOT NULL,
  severity public.activity_severity DEFAULT 'info',
  
  description TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  
  user_id TEXT,
  wallet_address TEXT,
  
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  is_anomaly BOOLEAN DEFAULT false,
  is_pop_eligible BOOLEAN DEFAULT false,
  pop_points NUMERIC DEFAULT 0,
  
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_device_activity_device_id ON public.device_activity_log(device_id);
CREATE INDEX idx_device_activity_session_id ON public.device_activity_log(session_id);
CREATE INDEX idx_device_activity_category ON public.device_activity_log(category);
CREATE INDEX idx_device_activity_occurred_at ON public.device_activity_log(occurred_at DESC);
CREATE INDEX idx_device_activity_pop_eligible ON public.device_activity_log(is_pop_eligible) WHERE is_pop_eligible = true;
CREATE INDEX idx_device_activity_anomaly ON public.device_activity_log(is_anomaly) WHERE is_anomaly = true;

ALTER TABLE public.device_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert activity logs"
  ON public.device_activity_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view activity logs"
  ON public.device_activity_log FOR SELECT
  USING (true);

CREATE POLICY "Service role can update activity logs"
  ON public.device_activity_log FOR UPDATE
  USING (auth.role() = 'service_role');

-- =====================================================
-- 3. ENGAGEMENT COMMANDS
-- =====================================================

CREATE TYPE public.command_status AS ENUM ('pending', 'sent', 'acknowledged', 'executed', 'failed', 'expired');
CREATE TYPE public.command_type AS ENUM (
  'adjust_charging_mode', 'collect_thermal_data', 'adjust_calibration_frequency',
  'enable_battery_health_mode', 'send_notification', 'request_diagnostic_report', 'update_configuration'
);

CREATE TABLE IF NOT EXISTS public.engagement_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.device_connection_sessions(id) ON DELETE CASCADE,
  target_all BOOLEAN DEFAULT false,
  
  command_type public.command_type NOT NULL,
  command_payload JSONB NOT NULL,
  priority INTEGER DEFAULT 5,
  
  status public.command_status DEFAULT 'pending',
  issued_by TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  execution_result JSONB,
  error_message TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT command_target_check CHECK (
    (device_id IS NOT NULL AND target_all = false) OR
    (device_id IS NULL AND target_all = true)
  )
);

CREATE INDEX idx_engagement_commands_device_id ON public.engagement_commands(device_id);
CREATE INDEX idx_engagement_commands_status ON public.engagement_commands(status);
CREATE INDEX idx_engagement_commands_pending ON public.engagement_commands(issued_at DESC) WHERE status = 'pending';

ALTER TABLE public.engagement_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view commands"
  ON public.engagement_commands FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage commands"
  ON public.engagement_commands FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 4. PROOF-OF-PARTICIPATION LEDGER
-- =====================================================

CREATE TYPE public.pop_event_type AS ENUM (
  'charging_session_completed', 'calibration_performed', 'battery_health_contribution',
  'thermal_data_collection', 'sustained_connection', 'diagnostic_report_submitted',
  'optimization_applied', 'community_contribution'
);

CREATE TABLE IF NOT EXISTS public.pop_events_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  wallet_address TEXT NOT NULL,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  
  event_type public.pop_event_type NOT NULL,
  event_description TEXT NOT NULL,
  
  pop_points NUMERIC NOT NULL,
  confidence_score NUMERIC DEFAULT 1.0,
  validation_method TEXT,
  
  session_id UUID REFERENCES public.device_connection_sessions(id) ON DELETE SET NULL,
  activity_log_ids UUID[],
  
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  validated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  is_validated BOOLEAN DEFAULT true,
  is_paid_out BOOLEAN DEFAULT false,
  paid_out_at TIMESTAMP WITH TIME ZONE,
  transaction_hash TEXT,
  
  event_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT pop_points_positive CHECK (pop_points >= 0),
  CONSTRAINT confidence_range CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE INDEX idx_pop_events_wallet ON public.pop_events_ledger(wallet_address);
CREATE INDEX idx_pop_events_device_id ON public.pop_events_ledger(device_id);
CREATE INDEX idx_pop_events_type ON public.pop_events_ledger(event_type);
CREATE INDEX idx_pop_events_timestamp ON public.pop_events_ledger(event_timestamp DESC);
CREATE INDEX idx_pop_events_unpaid ON public.pop_events_ledger(is_paid_out) WHERE is_paid_out = false;

ALTER TABLE public.pop_events_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view PoP events"
  ON public.pop_events_ledger FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage PoP events"
  ON public.pop_events_ledger FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 5. METRICS SUMMARY
-- =====================================================

CREATE TABLE IF NOT EXISTS public.device_metrics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary_hour INTEGER,
  
  active_devices_count INTEGER DEFAULT 0,
  total_connections INTEGER DEFAULT 0,
  total_charging_sessions INTEGER DEFAULT 0,
  total_pop_points_earned NUMERIC DEFAULT 0,
  
  avg_session_duration_seconds NUMERIC,
  avg_charging_efficiency NUMERIC,
  total_anomalies_detected INTEGER DEFAULT 0,
  total_commands_issued INTEGER DEFAULT 0,
  total_commands_executed INTEGER DEFAULT 0,
  
  top_device_ids UUID[],
  top_event_types TEXT[],
  
  detailed_metrics JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT unique_summary_period UNIQUE (summary_date, summary_hour)
);

CREATE INDEX idx_metrics_summary_date ON public.device_metrics_summary(summary_date DESC);

ALTER TABLE public.device_metrics_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view metrics summary"
  ON public.device_metrics_summary FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage metrics"
  ON public.device_metrics_summary FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.disconnect_device_session(p_session_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.device_connection_sessions
  SET 
    is_active = false,
    disconnected_at = now(),
    total_duration_seconds = EXTRACT(EPOCH FROM (now() - connected_at))::INTEGER,
    updated_at = now()
  WHERE id = p_session_id AND is_active = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_session_heartbeat(p_session_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.device_connection_sessions
  SET 
    last_heartbeat = now(),
    updated_at = now()
  WHERE id = p_session_id AND is_active = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_charging_pop_points(
  p_duration_minutes INTEGER,
  p_efficiency NUMERIC,
  p_battery_contribution NUMERIC DEFAULT 0
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base_points NUMERIC;
  efficiency_multiplier NUMERIC;
  duration_multiplier NUMERIC;
BEGIN
  base_points := p_duration_minutes / 10.0;
  efficiency_multiplier := LEAST(1.2, GREATEST(0.8, p_efficiency / 100.0));
  duration_multiplier := LEAST(1.5, 1.0 + (p_duration_minutes - 30.0) / 120.0);
  
  RETURN ROUND(
    (base_points * efficiency_multiplier * duration_multiplier) + p_battery_contribution,
    2
  );
END;
$$;

-- =====================================================
-- 7. VIEWS
-- =====================================================

CREATE OR REPLACE VIEW public.active_devices_view AS
SELECT 
  d.id as device_id,
  d.device_fingerprint,
  d.device_type,
  d.worker_id,
  d.wallet_address,
  dcs.id as session_id,
  dcs.connected_at,
  dcs.last_heartbeat,
  dcs.battery_level_start,
  dcs.charging_sessions_count,
  EXTRACT(EPOCH FROM (now() - dcs.connected_at))::INTEGER as connection_duration_seconds
FROM public.devices d
INNER JOIN public.device_connection_sessions dcs ON d.id = dcs.device_id
WHERE dcs.is_active = true
ORDER BY dcs.connected_at DESC;

CREATE OR REPLACE VIEW public.pop_leaderboard_view AS
SELECT 
  wallet_address,
  COUNT(DISTINCT device_id) as devices_count,
  COUNT(*) as total_events,
  SUM(pop_points) as total_pop_points,
  AVG(confidence_score) as avg_confidence,
  MAX(event_timestamp) as last_activity
FROM public.pop_events_ledger
WHERE is_validated = true
GROUP BY wallet_address
ORDER BY total_pop_points DESC;

-- Initial data
INSERT INTO public.device_metrics_summary (summary_date)
VALUES (CURRENT_DATE)
ON CONFLICT (summary_date, summary_hour) DO NOTHING;