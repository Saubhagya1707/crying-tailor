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
  tailoredDocuments,
} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { buildResumeText, type ResumeData } from "@/lib/resume-text";
import { generateTailoredResume } from "@/services/gemini";
import { z } from "zod";

const createInputSchema = z.object({
  title: z.string().max(200).optional(),
  jobDescriptionText: z.string().min(1, "Paste the job description.").max(50000),
});

export async function createTailoredResume(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const title = formData.get("title")?.toString()?.trim() ?? "";
  const jobDescriptionText = formData.get("jobDescriptionText")?.toString()?.trim() ?? "";

  const parsed = createInputSchema.safeParse({ title: title || undefined, jobDescriptionText });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const userId = session.user.id;

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
  if (!profile) redirect("/onboarding");

  const [edu, exp, sk, proj, cert] = await Promise.all([
    db.select().from(education).where(eq(education.userId, userId)).orderBy(asc(education.orderIndex)),
    db.select().from(experience).where(eq(experience.userId, userId)).orderBy(asc(experience.orderIndex)),
    db.select().from(skills).where(eq(skills.userId, userId)).orderBy(asc(skills.orderIndex)),
    db.select().from(projects).where(eq(projects.userId, userId)).orderBy(asc(projects.orderIndex)),
    db.select().from(certifications).where(eq(certifications.userId, userId)).orderBy(asc(certifications.orderIndex)),
  ]);

  const resumeData: ResumeData = {
    profile: {
      fullName: profile.fullName,
      phone: profile.phone,
      summary: profile.summary,
      location: profile.location,
      linkedinUrl: profile.linkedinUrl,
      websiteUrl: profile.websiteUrl,
    },
    education: edu,
    experience: exp,
    skills: sk,
    projects: proj,
    certifications: cert,
  };

  const currentResumeText = buildResumeText(resumeData);

  let generatedContent: string;
  try {
    generatedContent = await generateTailoredResume(currentResumeText, parsed.data.jobDescriptionText);
  } catch (err) {
    console.error("Gemini error:", err);
    return {
      ok: false as const,
      error: { jobDescriptionText: [err instanceof Error ? err.message : "Failed to generate tailored resume."] },
    };
  }

  const [inserted] = await db
    .insert(tailoredDocuments)
    .values({
      userId,
      title: parsed.data.title || null,
      jobDescriptionText: parsed.data.jobDescriptionText,
      generatedContent,
    })
    .returning({ id: tailoredDocuments.id });

  redirect(`/history/${inserted.id}`);
}
