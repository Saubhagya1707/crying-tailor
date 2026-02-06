import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local so `npm run db:migrate` works when run from project root
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
