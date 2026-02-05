import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles, tailoredDocuments } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

  const docs = await db
    .select({
      id: tailoredDocuments.id,
      title: tailoredDocuments.title,
      createdAt: tailoredDocuments.createdAt,
    })
    .from(tailoredDocuments)
    .where(eq(tailoredDocuments.userId, session.user.id))
    .orderBy(desc(tailoredDocuments.createdAt));

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
            <Link href="/history" className="text-sm font-medium text-zinc-900">
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
        <h1 className="text-2xl font-semibold text-zinc-900">History</h1>
        <p className="mt-1 text-zinc-600">
          Your tailored resumes. Click to view or export.
        </p>
        {docs.length === 0 ? (
          <p className="mt-8 text-zinc-500">No tailored resumes yet. Create one from the Create page.</p>
        ) : (
          <ul className="mt-8 space-y-2">
            {docs.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/history/${doc.id}`}
                  className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">
                    {doc.title || "Untitled tailored resume"}
                  </span>
                  <span className="ml-2 text-sm text-zinc-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
