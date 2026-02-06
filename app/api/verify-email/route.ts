import { NextResponse } from "next/server";
import { db, users, verificationTokens } from "@/lib/db";
import { and, eq, gt } from "drizzle-orm";

const LOGIN_PATH = "/login";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token?.trim()) {
    return NextResponse.redirect(
      new URL(`${LOGIN_PATH}?error=InvalidOrExpiredLink`, request.url)
    );
  }

  try {
    const [record] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(eq(verificationTokens.token, token.trim()), gt(verificationTokens.expiresAt, new Date()))
      );

    if (!record) {
      return NextResponse.redirect(
        new URL(`${LOGIN_PATH}?error=InvalidOrExpiredLink`, request.url)
      );
    }

    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, record.userId));

    await db.delete(verificationTokens).where(eq(verificationTokens.id, record.id));

    return NextResponse.redirect(new URL(`${LOGIN_PATH}?verified=1`, request.url));
  } catch (e) {
    console.error("Verify email error:", e);
    return NextResponse.redirect(
      new URL(`${LOGIN_PATH}?error=InvalidOrExpiredLink`, request.url)
    );
  }
}
