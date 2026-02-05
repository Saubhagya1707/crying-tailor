import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <main className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          ResumeTailor
        </h1>
        <p className="mt-2 text-zinc-600">
          Tailor your resume for any job description with AI.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100"
          >
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
