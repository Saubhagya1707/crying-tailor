import { describe, expect, it, vi } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";
import { POST as resumePdfPost } from "@/app/api/resume-pdf/route";
import { POST as signupPost } from "@/app/api/signup/route";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() => Promise.resolve(null)),
}));

describe("API endpoint protection", () => {
  describe("protected routes (must return 401 when unauthenticated)", () => {
    it("POST /api/resume-pdf returns 401 without session", async () => {
      const req = new Request("http://localhost/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "some content" }),
      });
      const res = await resumePdfPost(req);
      expect(res.status).toBe(401);
    });
  });

  describe("public routes (must not return 401 when unauthenticated)", () => {
    it("GET /api/health returns 200", async () => {
      const res = await healthGet();
      expect(res.status).toBe(200);
    });

    it("POST /api/signup returns 400 for invalid body (not 401)", async () => {
      const req = new Request("http://localhost/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const res = await signupPost(req);
      expect(res.status).not.toBe(401);
      expect(res.status).toBe(400);
    });
  });
});
