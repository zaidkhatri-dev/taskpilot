ALTER TABLE "organizations" DROP CONSTRAINT "organizations_admin_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "owner_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "admin_id";--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_key" UNIQUE("owner_id");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT;