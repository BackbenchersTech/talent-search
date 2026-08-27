-- IF NOT EXISTS: this index was created directly in Supabase before being
-- declared in the drizzle schema; this migration reconciles the two.
CREATE INDEX IF NOT EXISTS "idx_experiences_profile_dates" ON "experiences" USING btree ("profile_id","is_current" desc,"start_date" desc);