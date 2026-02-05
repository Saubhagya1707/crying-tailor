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
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { ImportResumeSection } from "@/components/settings/ImportResumeSection";
import type { OnboardingInput } from "@/lib/validations/resume";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

  const [edu, exp, sk, proj, cert] = await Promise.all([
    db.select().from(education).where(eq(education.userId, session.user.id)).orderBy(asc(education.orderIndex)),
    db.select().from(experience).where(eq(experience.userId, session.user.id)).orderBy(asc(experience.orderIndex)),
    db.select().from(skills).where(eq(skills.userId, session.user.id)).orderBy(asc(skills.orderIndex)),
    db.select().from(projects).where(eq(projects.userId, session.user.id)).orderBy(asc(projects.orderIndex)),
    db.select().from(certifications).where(eq(certifications.userId, session.user.id)).orderBy(asc(certifications.orderIndex)),
  ]);

  const initialData: OnboardingInput = {
    profile: {
      fullName: profile.fullName ?? "",
      phone: profile.phone ?? "",
      summary: profile.summary ?? "",
      location: profile.location ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      websiteUrl: profile.websiteUrl ?? "",
    },
    education: edu.map((e) => ({
      institution: e.institution ?? "",
      degree: e.degree ?? "",
      field: e.field ?? "",
      startDate: e.startDate ?? "",
      endDate: e.endDate ?? "",
      description: e.description ?? "",
      orderIndex: e.orderIndex ?? 0,
    })),
    experience: exp.map((x) => ({
      company: x.company ?? "",
      role: x.role ?? "",
      location: x.location ?? "",
      startDate: x.startDate ?? "",
      endDate: x.endDate ?? "",
      description: x.description ?? "",
      bulletPoints: x.bulletPoints ?? [],
      orderIndex: x.orderIndex ?? 0,
    })),
    skills: sk.map((s) => ({
      category: s.category ?? "",
      items: s.items ?? [],
      orderIndex: s.orderIndex ?? 0,
    })),
    projects: proj.map((p) => ({
      name: p.name ?? "",
      description: p.description ?? "",
      url: p.url ?? "",
      date: p.date ?? "",
      orderIndex: p.orderIndex ?? 0,
    })),
    certifications: cert.map((c) => ({
      name: c.name ?? "",
      issuer: c.issuer ?? "",
      date: c.date ?? "",
      url: c.url ?? "",
      orderIndex: c.orderIndex ?? 0,
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-zinc-900">
            ResumeTailor
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
              Dashboard
            </Link>
            <Link href="/create" className="text-sm text-zinc-600 hover:text-zinc-900">
              Create
            </Link>
            <Link href="/history" className="text-sm text-zinc-600 hover:text-zinc-900">
              History
            </Link>
            <Link href="/settings" className="text-sm font-medium text-zinc-900">
              Settings
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm text-zinc-600 hover:text-zinc-900">
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-zinc-600">
          Edit your resume details. These are used to generate tailored resumes.
        </p>
        <div className="mt-8 space-y-10">
          <ImportResumeSection />
          <SettingsForm initialData={initialData} />
        </div>
      </main>
    </div>
  );
}
