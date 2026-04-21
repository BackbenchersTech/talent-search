CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"profile_image_url" text,
	"title" text,
	"city" text,
	"state" text,
	"country" text,
	"availability" text,
	"status" text DEFAULT 'INACTIVE' NOT NULL,
	"email" text,
	"phone" text,
	"pay_rate_min" integer,
	"pay_rate_max" integer,
	"pay_currency" text DEFAULT 'USD',
	"education" text,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_status_check" CHECK ("candidates"."status" = ANY (($1, $2)))
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_org_id" text NOT NULL,
	"name" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_clerk_org_id_unique" UNIQUE("clerk_org_id"),
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"title" text NOT NULL,
	"industry" text,
	"seniority" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"visibility" text DEFAULT 'PRIVATE' NOT NULL,
	"bill_rate_min" integer,
	"bill_rate_max" integer,
	"open_for_relocation" boolean DEFAULT false NOT NULL,
	"headline" text,
	"bio" text,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"organization_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_status_check" CHECK ("profiles"."status" = ANY (($1, $2, $3))),
	CONSTRAINT "profiles_visibility_check" CHECK ("profiles"."visibility" = ANY (($1, $2)))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"school" text,
	"degree" text NOT NULL,
	"field_of_study" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_candidates_organization_id" ON "candidates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_candidates_org_id_id" ON "candidates" USING btree ("organization_id","id");--> statement-breakpoint
CREATE INDEX "profiles_candidate_id_idx" ON "profiles" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_organization_id" ON "profiles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_org_id_id" ON "profiles" USING btree ("organization_id","id");