-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS validate_battery_reading_session_trigger ON battery_readings;

-- Create a new permissive version that allows NULL session_id
CREATE OR REPLACE FUNCTION validate_battery_reading_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow NULL session_id (no validation needed)
  IF NEW.session_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- If session_id provided, validate it exists
  IF NOT EXISTS (SELECT 1 FROM battery_sessions WHERE id = NEW.session_id) THEN
    RAISE EXCEPTION 'Invalid session_id: no matching battery_sessions row'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER validate_battery_reading_session_trigger
  BEFORE INSERT ON battery_readings
  FOR EACH ROW
  EXECUTE FUNCTION validate_battery_reading_session();

-- Also make sure session_id column allows NULL
ALTER TABLE battery_readings ALTER COLUMN session_id DROP NOT NULL;