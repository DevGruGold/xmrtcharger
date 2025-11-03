-- Add XMRig HTTP API endpoint support to xmr_workers table
ALTER TABLE public.xmr_workers
ADD COLUMN IF NOT EXISTS xmrig_api_url TEXT,
ADD COLUMN IF NOT EXISTS connection_type TEXT DEFAULT 'supportxmr' CHECK (connection_type IN ('supportxmr', 'xmrig_direct', 'hybrid'));

-- Add index for faster lookups by API URL
CREATE INDEX IF NOT EXISTS idx_xmr_workers_xmrig_api_url ON public.xmr_workers(xmrig_api_url) WHERE xmrig_api_url IS NOT NULL;

-- Update metadata column to store last XMRig API response
COMMENT ON COLUMN public.xmr_workers.xmrig_api_url IS 'XMRig HTTP API endpoint URL (e.g., http://192.168.1.100:8080)';
COMMENT ON COLUMN public.xmr_workers.connection_type IS 'Mining stats source: supportxmr (pool API), xmrig_direct (local miner), or hybrid (both)';