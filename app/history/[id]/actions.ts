"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, tailoredDocuments } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).optional(),
  generatedContent: z.string().min(1, "Content cannot be empty.").max(500000),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export async function updateTailoredDocument(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const id = formData.get("id")?.toString() ?? "";
  const title = formData.get("title")?.toString()?.trim() ?? "";
  const generatedContent = formData.get("generatedContent")?.toString()?.trim() ?? "";

  const parsed = updateSchema.safeParse({
    id,
    title: title || undefined,
    generatedContent,
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const [existing] = await db
    .select({ userId: tailoredDocuments.userId })
    .from(tailoredDocuments)
    .where(eq(tailoredDocuments.id, parsed.data.id));

  if (!existing || existing.userId !== session.user.id) {
    return { ok: false as const, error: { id: ["Document not found."] } };
  }

  await db
    .update(tailoredDocuments)
    .set({
      title: parsed.data.title || null,
      generatedContent: parsed.data.generatedContent,
      updatedAt: new Date(),
    })
    .where(eq(tailoredDocuments.id, parsed.data.id));

  return { ok: true as const };
}

export async function deleteTailoredDocument(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const id = formData.get("id")?.toString() ?? "";
  const parsed = deleteSchema.safeParse({ id });
  if (!parsed.success) {
    return { ok: false as const, error: { id: ["Invalid document id."] } };
  }

  const [existing] = await db
    .select({ userId: tailoredDocuments.userId })
    .from(tailoredDocuments)
    .where(eq(tailoredDocuments.id, parsed.data.id));

  if (!existing || existing.userId !== session.user.id) {
    return { ok: false as const, error: { id: ["Document not found."] } };
  }

  await db.delete(tailoredDocuments).where(eq(tailoredDocuments.id, parsed.data.id));

  return { ok: true as const };
}
