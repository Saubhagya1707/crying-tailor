import "@testing-library/jest-dom/vitest";

// Required for modules that import db (e.g. API route handlers in api-protection tests)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test?sslmode=require";
}
