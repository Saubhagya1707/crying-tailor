import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { CreateResumeForm } from "@/components/create/CreateResumeForm";
import { AppLayout, PageHeader } from "@/components/layout";
import { createTailoredResume } from "@/app/create/actions";

export default async function CreatePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (!profile) redirect("/onboarding");

  return (
    <AppLayout activePath="create">
      <PageHeader
        title="Create tailored resume"
        description="Paste a job description below. We'll generate a resume tailored to that role using your profile and experience."
      />
      <div className="mt-8">
        <CreateResumeForm action={createTailoredResume} />
      </div>
    </AppLayout>
  );
}
