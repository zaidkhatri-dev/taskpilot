ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;

CREATE OR REPLACE FUNCTION trg_users_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email    := LOWER(TRIM(NEW.email));
  NEW.username := LOWER(TRIM(NEW.username));
  NEW.first_name := TRIM(NEW.first_name);
  NEW.last_name := TRIM(NEW.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;