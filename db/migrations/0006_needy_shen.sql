ALTER TABLE "locations" ADD COLUMN "image_floorplan" varchar(512);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "image" varchar(512);--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "reserved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "available";