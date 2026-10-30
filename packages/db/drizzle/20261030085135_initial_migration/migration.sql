CREATE TYPE "workspace_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "avatar_id" AS ENUM('avatar_01', 'avatar_02', 'avatar_03', 'avatar_04', 'avatar_05', 'avatar_06', 'avatar_07', 'avatar_08', 'avatar_09', 'avatar_10', 'avatar_11', 'avatar_12', 'avatar_13', 'avatar_14', 'avatar_15', 'avatar_16', 'avatar_17', 'avatar_18', 'avatar_19', 'avatar_20', 'avatar_21', 'avatar_22', 'avatar_23', 'avatar_24');--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"description" text,
	"workspace_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "name_length_check" CHECK (length("name") between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"content" text NOT NULL,
	"commented_by_id" uuid NOT NULL,
	"issue_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_not_empty" CHECK (TRIM("content") <> '')
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" text NOT NULL,
	"description" text,
	"section_id" uuid NOT NULL,
	"assigned_to_id" uuid,
	"position" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "title_length_check" CHECK (length("title") between 1 and 200)
);
--> statement-breakpoint
CREATE TABLE "workspace_memberships" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"role" "workspace_role" DEFAULT 'member'::"workspace_role" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" text NOT NULL,
	"board_id" uuid NOT NULL,
	"position" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "title_length_check" CHECK (length("title") between 1 and 200)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"email" text NOT NULL UNIQUE,
	"username" text UNIQUE,
	"avatar_id" "avatar_id",
	"first_name" text,
	"last_name" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_format_check" CHECK ("email" ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'),
	CONSTRAINT "username_chars_check" CHECK ("username" ~* '^[a-z0-9_.]+$'),
	CONSTRAINT "username_length_check" CHECK (length("username") between 1 and 30),
	CONSTRAINT "first_name_length_check" CHECK (length("first_name") between 1 and 50),
	CONSTRAINT "last_name_length_check" CHECK (length("last_name") between 1 and 50)
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "name_length_check" CHECK (length("name") between 1 and 100)
);
--> statement-breakpoint
CREATE INDEX "section_id_position_idx" ON "issues" ("section_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "user_workspace_idx" ON "workspace_memberships" ("user_id","workspace_id");--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_by_id_users_id_fkey" FOREIGN KEY ("commented_by_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigned_to_id_users_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;
--> statement-breakpoint

-- ─── Sanitization Trigger Functions ────────────────────────────────────────────

-- Sanitizes `name` column only (used by: workspaces)
CREATE OR REPLACE FUNCTION trg_name_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := TRIM(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` and `description` columns (used by: issues)
CREATE OR REPLACE FUNCTION trg_title_description_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(NEW.title);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `name` and `description` columns (used by: boards)
CREATE OR REPLACE FUNCTION trg_name_description_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title       := TRIM(NEW.name);
  NEW.description := TRIM(NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanitizes `title` column only (used by: sections)
CREATE OR REPLACE FUNCTION trg_title_sanitize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title := TRIM(NEW.title);
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
  NEW.email      := TRIM(NEW.email);
  IF NEW.username   IS NOT NULL THEN NEW.username   := TRIM(NEW.username);   END IF;
  IF NEW.first_name IS NOT NULL THEN NEW.first_name := TRIM(NEW.first_name); END IF;
  IF NEW.last_name  IS NOT NULL THEN NEW.last_name  := TRIM(NEW.last_name);  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

-- ─── Attach Triggers to Tables ─────────────────────────────────────────────────

-- workspaces: name only
CREATE OR REPLACE TRIGGER workspaces_before_insert_update
  BEFORE INSERT OR UPDATE ON "workspaces"
  FOR EACH ROW EXECUTE FUNCTION trg_name_sanitize();

-- boards: name + description
CREATE OR REPLACE TRIGGER boards_before_insert_update
  BEFORE INSERT OR UPDATE ON "boards"
  FOR EACH ROW EXECUTE FUNCTION trg_name_description_sanitize();

-- sections: title only
CREATE OR REPLACE TRIGGER sections_before_insert_update
  BEFORE INSERT OR UPDATE ON "sections"
  FOR EACH ROW EXECUTE FUNCTION trg_title_sanitize();

-- issues: title + description
CREATE OR REPLACE TRIGGER issues_before_insert_update
  BEFORE INSERT OR UPDATE ON "issues"
  FOR EACH ROW EXECUTE FUNCTION trg_title_description_sanitize();

-- comments: content only
CREATE OR REPLACE TRIGGER comments_before_insert_update
  BEFORE INSERT OR UPDATE ON "comments"
  FOR EACH ROW EXECUTE FUNCTION trg_content_sanitize();

-- users: email, username, first_name, last_name
CREATE OR REPLACE TRIGGER users_before_insert_update
  BEFORE INSERT OR UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION trg_users_sanitize();