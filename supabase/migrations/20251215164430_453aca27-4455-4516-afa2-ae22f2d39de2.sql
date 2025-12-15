-- Clear all device-related data in dependency order
DELETE FROM device_activity_log;
DELETE FROM device_connection_sessions;
DELETE FROM device_miner_associations;
DELETE FROM battery_readings;
DELETE FROM battery_sessions;
DELETE FROM charging_sessions;
DELETE FROM battery_health_snapshots;
DELETE FROM xmrt_transactions;

-- Reset user profiles (keep profiles but zero out earnings)
UPDATE user_profiles SET 
  total_xmrt_earned = 0,
  total_time_online_seconds = 0,
  last_reward_at = NULL,
  device_ids = ARRAY[]::uuid[];

-- Delete all devices
DELETE FROM devices;