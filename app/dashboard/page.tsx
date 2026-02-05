import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { APP_NAME } from "@/lib/constants";
import { AppLayout, PageHeader } from "@/components/layout";
import { LinkButton } from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

  return (
    <AppLayout activePath="dashboard" maxWidth="wide">
      <PageHeader
        title={`Welcome, ${session.user?.name ?? session.user?.email}`}
        description="Create tailored resumes for job descriptions, or manage your profile in Settings."
      />
      <div className="flex gap-4">
        <LinkButton href="/create" variant="primary">
          Create tailored resume
        </LinkButton>
        <LinkButton href="/history" variant="outline">
          View history
        </LinkButton>
      </div>
    </AppLayout>
  );
}
