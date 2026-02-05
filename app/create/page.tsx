import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CreateResumeForm } from "@/components/create/CreateResumeForm";
import { createTailoredResume } from "@/app/create/actions";

export default async function CreatePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

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
            <Link href="/create" className="text-sm font-medium text-zinc-900">
              Create
            </Link>
            <Link href="/history" className="text-sm text-zinc-600 hover:text-zinc-900">
              History
            </Link>
            <Link href="/settings" className="text-sm text-zinc-600 hover:text-zinc-900">
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
        <h1 className="text-2xl font-semibold text-zinc-900">Create tailored resume</h1>
        <p className="mt-1 text-zinc-600">
          Paste a job description below. We&apos;ll generate a resume tailored to that role using your profile and experience.
        </p>
        <div className="mt-8">
          <CreateResumeForm action={createTailoredResume} />
        </div>
      </main>
    </div>
  );
}
