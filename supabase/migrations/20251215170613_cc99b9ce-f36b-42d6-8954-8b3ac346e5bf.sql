DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop any user-defined trigger on public.battery_readings that calls public.validate_battery_reading_session()
  FOR r IN (
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_proc p ON p.oid = t.tgfoid
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE NOT t.tgisinternal
      AND n.nspname = 'public'
      AND c.relname = 'battery_readings'
      AND p.proname = 'validate_battery_reading_session'
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.battery_readings;', r.tgname);
  END LOOP;
END $$;