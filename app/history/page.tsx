import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles, tailoredDocuments } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { AppLayout, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: `History | ${APP_NAME}`,
};

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
    <AppLayout activePath="history">
      <PageHeader
        title="History"
        description="Your tailored resumes. Click to view or export."
      />
      {docs.length === 0 ? (
        <p className="mt-8 text-zinc-500">No tailored resumes yet. Create one from the Create page.</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link href={`/history/${doc.id}`} className="block transition-colors hover:opacity-95">
                <Card padding="sm" className="text-left">
                  <span className="font-medium text-zinc-900">
                    {doc.title || "Untitled tailored resume"}
                  </span>
                  <span className="ml-2 text-sm text-zinc-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
