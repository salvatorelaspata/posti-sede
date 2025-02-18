ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "employees" DROP CONSTRAINT "employees_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "department" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "clerk_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "role" varchar(50) DEFAULT 'employee';--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "email" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "first_name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "last_name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "name";