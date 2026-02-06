"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/layout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Sign up failed.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Check your email
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          We&apos;ve sent a verification link to your email. Click it to activate your account, then sign in.
        </p>
        <p className="mt-4">
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Go to sign in
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
        Create account
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-zinc-700">
            Name (optional)
          </label>
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-zinc-700">
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign up
        </Button>
      </form>
    </AuthCard>
  );
}
