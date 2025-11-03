-- Add unique constraint to wallet_address for upsert operations
ALTER TABLE xmr_workers 
ADD CONSTRAINT xmr_workers_wallet_address_key 
UNIQUE (wallet_address);