-- Clean up duplicate active sessions - keep only the most recent per device
WITH ranked_sessions AS (
  SELECT id, device_id,
    ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY connected_at DESC) as rn
  FROM device_connection_sessions
  WHERE is_active = true
)
UPDATE device_connection_sessions 
SET is_active = false, 
    disconnected_at = NOW(),
    metadata = jsonb_build_object('disconnect_reason', 'cleanup_duplicate_sessions')
WHERE id IN (
  SELECT id FROM ranked_sessions WHERE rn > 1
);