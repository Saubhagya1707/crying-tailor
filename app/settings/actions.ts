"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  profiles,
  education,
  experience,
  skills,
  projects,
  certifications,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { onboardingSchema } from "@/lib/validations/resume";
import type { OnboardingInput } from "@/lib/validations/resume";
import { extractResumeDetails } from "@/services/gemini";

export async function updateSettings(data: OnboardingInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { profile: profileData, education: edu, experience: exp, skills: sk, projects: proj, certifications: cert } = parsed.data;
  const userId = session.user.id;

  await db
    .update(profiles)
    .set({
      fullName: profileData.fullName ?? null,
      phone: profileData.phone ?? null,
      summary: profileData.summary ?? null,
      location: profileData.location ?? null,
      linkedinUrl: profileData.linkedinUrl || null,
      websiteUrl: profileData.websiteUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId));

  await db.delete(education).where(eq(education.userId, userId));
  for (let i = 0; i < edu.length; i++) {
    const e = edu[i];
    await db.insert(education).values({
      userId,
      institution: e.institution ?? null,
      degree: e.degree ?? null,
      field: e.field ?? null,
      startDate: e.startDate ?? null,
      endDate: e.endDate ?? null,
      description: e.description ?? null,
      orderIndex: e.orderIndex ?? i,
    });
  }

  await db.delete(experience).where(eq(experience.userId, userId));
  for (let i = 0; i < exp.length; i++) {
    const x = exp[i];
    await db.insert(experience).values({
      userId,
      company: x.company ?? null,
      role: x.role ?? null,
      location: x.location ?? null,
      startDate: x.startDate ?? null,
      endDate: x.endDate ?? null,
      description: x.description ?? null,
      bulletPoints: x.bulletPoints ?? null,
      orderIndex: x.orderIndex ?? i,
    });
  }

  await db.delete(skills).where(eq(skills.userId, userId));
  for (let i = 0; i < sk.length; i++) {
    const s = sk[i];
    await db.insert(skills).values({
      userId,
      category: s.category ?? null,
      items: s.items ?? null,
      orderIndex: s.orderIndex ?? i,
    });
  }

  await db.delete(projects).where(eq(projects.userId, userId));
  for (let i = 0; i < proj.length; i++) {
    const p = proj[i];
    await db.insert(projects).values({
      userId,
      name: p.name ?? null,
      description: p.description ?? null,
      url: p.url || null,
      date: p.date ?? null,
      orderIndex: p.orderIndex ?? i,
    });
  }

  await db.delete(certifications).where(eq(certifications.userId, userId));
  for (let i = 0; i < cert.length; i++) {
    const c = cert[i];
    await db.insert(certifications).values({
      userId,
      name: c.name ?? null,
      issuer: c.issuer ?? null,
      date: c.date ?? null,
      url: c.url || null,
      orderIndex: c.orderIndex ?? i,
    });
  }

  return { ok: true as const };
}

export async function importFromResume(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const resumeText = formData.get("resumeText")?.toString()?.trim() ?? "";
  if (resumeText.length < 50) {
    return {
      ok: false as const,
      error: { resumeText: ["Paste at least 50 characters of your resume to import."] },
    };
  }

  let extracted: OnboardingInput;
  try {
    extracted = await extractResumeDetails(resumeText);
  } catch (err) {
    console.error("Resume import extraction error:", err);
    return {
      ok: false as const,
      error: {
        resumeText: [err instanceof Error ? err.message : "Failed to extract details from resume."],
      },
    };
  }

  return updateSettings(extracted);
}
