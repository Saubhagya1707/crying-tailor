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
import { EmptyState } from "@/components/ui/EmptyState";
import { HistoryDeleteButton } from "@/components/history/HistoryDeleteButton";

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
        <div className="mt-8">
          <EmptyState
            title="No tailored resumes yet"
            description="Create a resume from the Create page to see it listed here."
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {docs.map((doc) => (
            <li key={doc.id}>
              <Card padding="sm" className="text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-[200px]">
                    <Link
                      href={`/history/${doc.id}`}
                      className="font-medium text-[var(--text-primary)] hover:underline"
                    >
                      {doc.title || "Untitled tailored resume"}
                    </Link>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <HistoryDeleteButton id={doc.id} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
