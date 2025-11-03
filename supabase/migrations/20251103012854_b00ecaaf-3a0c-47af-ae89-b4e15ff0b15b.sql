-- Add payout wallet fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payout_wallet_address text,
ADD COLUMN IF NOT EXISTS payout_wallet_type text DEFAULT 'ethereum',
ADD COLUMN IF NOT EXISTS wallet_connected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS wallet_last_verified timestamp with time zone;

-- Add index for faster wallet lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(payout_wallet_address);

-- Add comments for clarity
COMMENT ON COLUMN user_profiles.payout_wallet_address IS 'User Web3 wallet address for XMRT/XMR payouts';
COMMENT ON COLUMN user_profiles.payout_wallet_type IS 'Wallet type: ethereum, monero, etc.';
COMMENT ON COLUMN user_profiles.wallet_connected_at IS 'Timestamp when wallet was first connected';
COMMENT ON COLUMN user_profiles.wallet_last_verified IS 'Timestamp of last wallet verification';