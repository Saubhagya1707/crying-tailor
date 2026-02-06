import { describe, expect, it } from "vitest";
import { GET as verifyEmailGet } from "@/app/api/verify-email/route";

describe("Verify email endpoint", () => {
  it("redirects to login with error when token is missing", async () => {
    const req = new Request("http://localhost/api/verify-email");
    const res = await verifyEmailGet(req);
    expect([302, 307]).toContain(res.status);
    const url = res.headers.get("location") ?? "";
    expect(url).toContain("/login");
    expect(url).toContain("error=InvalidOrExpiredLink");
  });

  it("redirects to login with error when token is empty string", async () => {
    const req = new Request("http://localhost/api/verify-email?token=");
    const res = await verifyEmailGet(req);
    expect([302, 307]).toContain(res.status);
    const url = res.headers.get("location") ?? "";
    expect(url).toContain("error=InvalidOrExpiredLink");
  });
});
