import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles, tailoredDocuments } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { DocumentViewEdit } from "@/components/history/DocumentViewEdit";
import { AppLayout, PageHeader } from "@/components/layout";

export default async function HistoryDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

  const { id } = await params;
  const [doc] = await db
    .select()
    .from(tailoredDocuments)
    .where(eq(tailoredDocuments.id, id));

  if (!doc || doc.userId !== session.user.id) notFound();

  return (
    <AppLayout activePath="history">
      <PageHeader
        title={doc.title || "Tailored resume"}
        description={
          <span className="text-sm text-zinc-500">
            Created {new Date(doc.createdAt).toLocaleString()}
          </span>
        }
        actions={
          <Link
            href="/history"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 rounded"
          >
            ← Back to history
          </Link>
        }
      />
      <DocumentViewEdit
        id={doc.id}
        title={doc.title}
        generatedContent={doc.generatedContent}
      />
    </AppLayout>
  );
}
