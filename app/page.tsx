import { APP_NAME } from "@/lib/constants";
import { LinkButton } from "@/components/ui/LinkButton";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <main className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {APP_NAME}
        </h1>
        <p className="mt-2 text-zinc-600">
          Tailor your resume for any job description with AI.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <LinkButton href="/login" variant="primary" className="px-5 py-2.5">
            Sign in
          </LinkButton>
          <LinkButton href="/signup" variant="outline" className="px-5 py-2.5">
            Sign up
          </LinkButton>
        </div>
      </main>
    </div>
  );
}
