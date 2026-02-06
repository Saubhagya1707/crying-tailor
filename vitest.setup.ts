import "@testing-library/jest-dom/vitest";

// Required for modules that import db (e.g. API route handlers in api-protection tests)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test?sslmode=require";
}
// Required for modules that use Resend (e.g. signup route)
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = "re_test_key_for_vitest";
}
