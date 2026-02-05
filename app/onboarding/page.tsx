import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id));
  if (profile) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-zinc-900">Complete your profile</h1>
        <p className="mt-1 text-zinc-600">
          Add your resume details so we can tailor them for each job. You can edit these later in Settings.
        </p>
        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
