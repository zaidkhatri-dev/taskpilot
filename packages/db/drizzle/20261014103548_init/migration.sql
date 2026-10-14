CREATE TYPE "member_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "avatar_id" AS ENUM('avatar_01', 'avatar_02', 'avatar_03', 'avatar_04', 'avatar_05', 'avatar_06', 'avatar_07', 'avatar_08', 'avatar_09', 'avatar_10', 'avatar_11', 'avatar_12', 'avatar_13', 'avatar_14', 'avatar_15', 'avatar_16', 'avatar_17', 'avatar_18', 'avatar_19', 'avatar_20', 'avatar_21', 'avatar_22', 'avatar_23', 'avatar_24');--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" text NOT NULL,
	"description" text,
	"organization_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
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
	"board_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_check" CHECK ("order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'member'::"member_role" NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" text NOT NULL,
	"board_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_check" CHECK ("order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"email" text NOT NULL,
	"username" text,
	"avatar_id" "avatar_id",
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "valid_email_format" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	CONSTRAINT "valid_username_chars" CHECK ("username" ~* '^[A-Za-z0-9_]+$'),
	CONSTRAINT "username_min_length" CHECK (length("username") >= 3),
	CONSTRAINT "username_max_length" CHECK (length("username") <= 20)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_org_idx" ON "membership" ("user_id","organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_lower_idx" ON "users" (lower("email"));--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_by_id_users_id_fkey" FOREIGN KEY ("commented_by_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_board_id_boards_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE;