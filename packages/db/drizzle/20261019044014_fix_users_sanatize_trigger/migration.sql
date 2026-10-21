-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION trg_users_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email    := LOWER(TRIM(NEW.email));
  NEW.username := LOWER(TRIM(NEW.username));
  NEW.first_name := LOWER(TRIM(NEW.first_name));
  NEW.last_name := LOWER(TRIM(NEW.last_name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;