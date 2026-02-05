import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", undefined, "b", false)).toBe("a b");
  });

  it("returns empty string when all falsy", () => {
    expect(cn(undefined, false)).toBe("");
  });
});
