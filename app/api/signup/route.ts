import { NextResponse } from "next/server";
import { db, users, verificationTokens } from "@/lib/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

const VERIFICATION_EXPIRY_HOURS = 24;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name } = parsed.data;
    const emailNormalized = email.trim().toLowerCase();

    const [existing] = await db.select().from(users).where(sql`lower(${users.email}) = ${emailNormalized}`);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [inserted] = await db
      .insert(users)
      .values({
        email: emailNormalized,
        passwordHash,
        name: name ?? null,
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);
    await db.insert(verificationTokens).values({
      userId: inserted.id,
      token,
      expiresAt,
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;
    const emailResult = await sendVerificationEmail(emailNormalized, verificationUrl);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Account created but we couldn't send the verification email. Please try again later or contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Check your email to verify your account.",
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
