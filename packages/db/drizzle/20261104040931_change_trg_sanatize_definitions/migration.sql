-- Custom SQL migration file, put your code below! --
-- ─── Sanitization Trigger Functions ────────────────────────────────────────────

-- Sanitizes `name` column only (used by: workspaces)
CREATE OR REPLACE FUNCTION trg_name_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := TRIM(LOWER(NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` and `description` columns (used by: issues)
CREATE OR REPLACE FUNCTION trg_title_description_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(LOWER(NEW.title));
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `name` and `description` columns (used by: boards)
CREATE OR REPLACE FUNCTION trg_name_description_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name       := TRIM(LOWER(NEW.name));
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` column only (used by: sections)
CREATE OR REPLACE FUNCTION trg_title_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title := TRIM(LOWER(NEW.title));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `content` column only (used by: comments)
CREATE OR REPLACE FUNCTION trg_content_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content := TRIM(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes text identity columns on users
-- Trims email, username, first_name, and last_name when non-NULL
CREATE OR REPLACE FUNCTION trg_users_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email      := TRIM(LOWER(NEW.email));
  IF NEW.username   IS NOT NULL THEN NEW.username   := TRIM(NEW.username);   END IF;
  IF NEW.first_name IS NOT NULL THEN NEW.first_name := TRIM(LOWER(NEW.first_name)); END IF;
  IF NEW.last_name  IS NOT NULL THEN NEW.last_name  := TRIM(LOWER(NEW.last_name));  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint