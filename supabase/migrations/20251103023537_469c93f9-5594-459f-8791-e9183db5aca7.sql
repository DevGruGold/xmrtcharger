-- Add missing columns for mining connection flow

-- Add is_active column to device_miner_associations if it doesn't exist
ALTER TABLE device_miner_associations 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add update_source column to mining_updates if it doesn't exist
ALTER TABLE mining_updates 
ADD COLUMN IF NOT EXISTS update_source TEXT DEFAULT 'supportxmr_api';

-- Add index for better query performance on device_miner_associations
CREATE INDEX IF NOT EXISTS idx_device_miner_associations_device_id 
ON device_miner_associations(device_id) WHERE is_active = true;

-- Add index for better query performance on mining_updates
CREATE INDEX IF NOT EXISTS idx_mining_updates_miner_id 
ON mining_updates(miner_id, created_at DESC);