import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/validations/auth";

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

    return NextResponse.json({
      user: {
        id: inserted.id,
        email: inserted.email,
        name: inserted.name,
      },
    });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
