"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/layout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "EmailNotVerified") {
      setError("Please verify your email. Check your inbox for the link.");
    } else if (err === "InvalidOrExpiredLink") {
      setError("Verification link is invalid or has expired. Please request a new one.");
    } else if (err) {
      setError("Invalid email or password.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError(
          res.error === "EmailNotVerified"
            ? "Please verify your email. Check your inbox for the link."
            : "Invalid email or password."
        );
        return;
      }
      if (res?.ok && res?.url) {
        window.location.href = res.url;
        return;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard>
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
        Sign in
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {searchParams.get("verified") === "1" && (
          <Alert variant="success">Email verified. You can sign in.</Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-zinc-700">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}

function LoginFallback() {
  return (
    <AuthCard>
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
        Sign in
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </p>
      <div className="mt-6 flex justify-center py-8 text-sm text-zinc-500">
        Loading…
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
