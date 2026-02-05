import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
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
            <Link href="/create" className="text-sm text-zinc-600 hover:text-zinc-900">
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
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Welcome, {session.user?.name ?? session.user?.email}
        </h1>
        <p className="mt-2 text-zinc-600">
          Create tailored resumes for job descriptions, or manage your profile in Settings.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/create"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Create tailored resume
          </Link>
          <Link
            href="/history"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            View history
          </Link>
        </div>
      </main>
    </div>
  );
}
