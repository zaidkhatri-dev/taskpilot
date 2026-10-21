CREATE TABLE "team_memberships" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'member'::"member_role" NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "name_length_check" CHECK (length("name") between 1 and 100)
);
--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "boards_organization_id_organizations_id_fkey";--> statement-breakpoint
DROP TABLE "memberships";--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "team_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "admin_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "assigned_to_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_team_idx" ON "team_memberships" ("user_id","team_id");--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_admin_id_users_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issues" DROP CONSTRAINT "issues_section_id_sections_id_fkey", ADD CONSTRAINT "issues_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE;

-- ─── Drop existing per-table triggers for boards, sections, issues, organizations & teams ──

DROP TRIGGER IF EXISTS boards_before_insert_update ON "boards";
DROP TRIGGER IF EXISTS sections_before_insert_update ON "sections";
DROP TRIGGER IF EXISTS issues_before_insert_update ON "issues";
DROP TRIGGER IF EXISTS organizations_before_insert_update ON "organizations";
DROP TRIGGER IF EXISTS teams_before_insert_update ON "teams";

-- ─── Drop existing per-table sanitize functions ────────────────────────────────

DROP FUNCTION IF EXISTS trg_organizations_sanitize();
DROP FUNCTION IF EXISTS trg_boards_sanitize();
DROP FUNCTION IF EXISTS trg_sections_sanitize();
DROP FUNCTION IF EXISTS trg_issues_sanitize();
DROP FUNCTION IF EXISTS trg_organization_teams_sanitize();

-- ─── Generic Sanitize Functions ────────────────────────────────────────────────

-- Sanitizes `name` and `description` columns (used by: organizations, teams, boards)
CREATE OR REPLACE FUNCTION trg_name_description_sanatize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name        := TRIM(NEW.name);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` column only (used by: sections)
CREATE OR REPLACE FUNCTION trg_title_sanatize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title := TRIM(NEW.title);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` and `description` columns (used by: issues)
CREATE OR REPLACE FUNCTION trg_title_description_sanatize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(NEW.title);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION trg_content_sanatize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content       := TRIM(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- ─── Attach Triggers to Tables ─────────────────────────────────────────────────

-- organizations: name + description
CREATE OR REPLACE TRIGGER organizations_before_insert_update
  BEFORE INSERT OR UPDATE ON "organizations"
  FOR EACH ROW EXECUTE FUNCTION trg_name_description_sanatize();

-- teams: name + description
CREATE OR REPLACE TRIGGER teams_before_insert_update
  BEFORE INSERT OR UPDATE ON "teams"
  FOR EACH ROW EXECUTE FUNCTION trg_name_description_sanatize();

-- boards: name + description
CREATE OR REPLACE TRIGGER boards_before_insert_update
  BEFORE INSERT OR UPDATE ON "boards"
  FOR EACH ROW EXECUTE FUNCTION trg_name_description_sanatize();

-- sections: title only
CREATE OR REPLACE TRIGGER sections_before_insert_update
  BEFORE INSERT OR UPDATE ON "sections"
  FOR EACH ROW EXECUTE FUNCTION trg_title_sanatize();

-- issues: title + description
CREATE OR REPLACE TRIGGER issues_before_insert_update
  BEFORE INSERT OR UPDATE ON "issues"
  FOR EACH ROW EXECUTE FUNCTION trg_title_description_sanatize();

-- comments: content only
CREATE OR REPLACE TRIGGER comments_before_insert_update
  BEFORE INSERT OR UPDATE ON "comments"
  FOR EACH ROW EXECUTE FUNCTION trg_content_sanatize();
