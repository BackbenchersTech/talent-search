CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"location_text" text,
	"city" text,
	"state" text,
	"country" text,
	"location_type" text,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experiences_location_type_check" CHECK ("experiences"."location_type" = ANY (ARRAY['REMOTE', 'HYBRID', 'ONSITE'])),
	CONSTRAINT "experiences_source_check" CHECK ("experiences"."source" = ANY (ARRAY['SDR', 'RESUME'])),
	CONSTRAINT "experiences_date_check" CHECK ("experiences"."is_current" = true OR "experiences"."end_date" IS NOT NULL),
	CONSTRAINT "experiences_current_end_date_check" CHECK ("experiences"."is_current" = false OR "experiences"."end_date" IS NULL),
	CONSTRAINT "experiences_date_order_check" CHECK ("experiences"."end_date" IS NULL OR "experiences"."end_date" >= "experiences"."start_date")
);
--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;