-- Resume Tailor initial schema
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" text,
  "email_verified" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "full_name" text,
  "phone" text,
  "summary" text,
  "location" text,
  "linkedin_url" text,
  "website_url" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "education" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "institution" text,
  "degree" text,
  "field" text,
  "start_date" text,
  "end_date" text,
  "description" text,
  "order_index" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "experience" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "company" text,
  "role" text,
  "location" text,
  "start_date" text,
  "end_date" text,
  "description" text,
  "bullet_points" jsonb,
  "order_index" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "skills" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "category" text,
  "items" jsonb,
  "order_index" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" text,
  "description" text,
  "url" text,
  "date" text,
  "order_index" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "certifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" text,
  "issuer" text,
  "date" text,
  "url" text,
  "order_index" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "tailored_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" text,
  "job_description_text" text NOT NULL,
  "generated_content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "profiles_user_id_idx" ON "profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "education_user_id_idx" ON "education" ("user_id");
CREATE INDEX IF NOT EXISTS "experience_user_id_idx" ON "experience" ("user_id");
CREATE INDEX IF NOT EXISTS "skills_user_id_idx" ON "skills" ("user_id");
CREATE INDEX IF NOT EXISTS "projects_user_id_idx" ON "projects" ("user_id");
CREATE INDEX IF NOT EXISTS "certifications_user_id_idx" ON "certifications" ("user_id");
CREATE INDEX IF NOT EXISTS "tailored_documents_user_id_idx" ON "tailored_documents" ("user_id");
