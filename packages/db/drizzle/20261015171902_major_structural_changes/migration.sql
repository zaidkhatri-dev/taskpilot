ALTER TABLE "issues" DROP CONSTRAINT "issues_board_id_boards_id_fkey";--> statement-breakpoint
ALTER TABLE "issues" DROP CONSTRAINT "order_check";--> statement-breakpoint
ALTER TABLE "sections" DROP CONSTRAINT "order_check";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "valid_email_format";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "valid_username_chars";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "username_min_length";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "username_max_length";--> statement-breakpoint
DROP INDEX "email_lower_idx";--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "assigned_to_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "position" text COLLATE "C" NOT NULL;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "position" text COLLATE "C" NOT NULL;--> statement-breakpoint
ALTER TABLE "issues" DROP COLUMN "board_id";--> statement-breakpoint
ALTER TABLE "issues" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "sections" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE("username");--> statement-breakpoint
CREATE INDEX "section_id_position_idx" ON "issues" ("section_id","position");--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigned_to_id_users_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "name_length_check" CHECK (length("title") between 1 and 100);--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "title_length_check" CHECK (length("title") between 1 and 200);--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "name_length_check" CHECK (length("name") between 1 and 100);--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "title_length_check" CHECK (length("title") between 1 and 200);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "email_format_check" CHECK ("email" ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "username_chars_check" CHECK ("username" ~* '^[a-z0-9_.]+$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "username_length_check" CHECK (length("username") between 1 and 30);

-- ─── BEFORE INSERT & UPDATE Triggers ─────────────────────────────────────────

-- 1. users: trim & lowercase email and username
CREATE OR REPLACE FUNCTION trg_users_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email    := LOWER(TRIM(NEW.email));
  NEW.username := LOWER(TRIM(NEW.username));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_before_insert_update
  BEFORE INSERT OR UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION trg_users_sanitize();

-- 2. organizations: trim name
CREATE OR REPLACE FUNCTION trg_organizations_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := TRIM(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER organizations_before_insert_update
  BEFORE INSERT OR UPDATE ON "organizations"
  FOR EACH ROW EXECUTE FUNCTION trg_organizations_sanitize();

-- 3. boards: trim name and description
CREATE OR REPLACE FUNCTION trg_boards_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name        := TRIM(NEW.name);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER boards_before_insert_update
  BEFORE INSERT OR UPDATE ON "boards"
  FOR EACH ROW EXECUTE FUNCTION trg_boards_sanitize();

-- 4. sections: trim title and description
CREATE OR REPLACE FUNCTION trg_sections_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(NEW.title);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sections_before_insert_update
  BEFORE INSERT OR UPDATE ON "sections"
  FOR EACH ROW EXECUTE FUNCTION trg_sections_sanitize();

-- 5. issues: trim title and description
CREATE OR REPLACE FUNCTION trg_issues_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(NEW.title);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER issues_before_insert_update
  BEFORE INSERT OR UPDATE ON "issues"
  FOR EACH ROW EXECUTE FUNCTION trg_issues_sanitize();

-- 6. comments: trim content
CREATE OR REPLACE FUNCTION trg_comments_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content := TRIM(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER comments_before_insert_update
  BEFORE INSERT OR UPDATE ON "comments"
  FOR EACH ROW EXECUTE FUNCTION trg_comments_sanitize();

-- 7. membership: trim & lowercase role
CREATE OR REPLACE FUNCTION trg_membership_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.role := LOWER(TRIM(NEW.role));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER membership_before_insert_update
  BEFORE INSERT OR UPDATE ON "membership"
  FOR EACH ROW EXECUTE FUNCTION trg_membership_sanitize();