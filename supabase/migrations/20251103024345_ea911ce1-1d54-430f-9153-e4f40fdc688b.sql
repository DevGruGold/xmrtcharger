-- Add unique constraint to device_miner_associations table
-- This allows the Edge Function to upsert associations by device_id
ALTER TABLE device_miner_associations 
ADD CONSTRAINT device_miner_associations_device_id_key 
UNIQUE (device_id);