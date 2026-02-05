import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { AppLayout, PageHeader } from "@/components/layout";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (profile) redirect("/dashboard");

  return (
    <AppLayout activePath="dashboard">
      <PageHeader
        title="Complete your profile"
        description="Add your resume details so we can tailor them for each job. You can edit these later in Settings."
      />
      <div className="mt-8">
        <OnboardingForm />
      </div>
    </AppLayout>
  );
}
