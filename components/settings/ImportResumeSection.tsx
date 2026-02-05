"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { importFromResume } from "@/app/settings/actions";

export function ImportResumeSection() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData();
    formData.set("resumeText", resumeText.trim());
    startTransition(async () => {
      const result = await importFromResume(formData);
      if (result.ok) {
        setMessage({ type: "success", text: "Resume imported. Your details are updated below—review and save any changes." });
        setResumeText("");
        router.refresh();
      } else {
        const errObj = result.error as Record<string, string[] | undefined> | undefined;
        const firstError = errObj ? Object.values(errObj).flat().filter(Boolean)[0] : null;
        setMessage({ type: "error", text: firstError ? String(firstError) : "Import failed." });
      }
    });
  };

  return (
    <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-zinc-900">Import from existing resume</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Paste your resume text below. We&apos;ll use AI to extract your profile, education, experience, skills, projects, and certifications. You can review and edit the result in the form below before saving.
      </p>
      <form onSubmit={handleImport} className="mt-4 space-y-4">
        {message && (
          <p
            className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            role="alert"
          >
            {message.text}
          </p>
        )}
        <div>
          <Label htmlFor="resumeText">Paste resume text</Label>
          <Textarea
            id="resumeText"
            name="resumeText"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume here (plain text or copy-pasted from PDF/Word)..."
            rows={8}
            required
            minLength={50}
            className="mt-1 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">At least 50 characters. Paste from PDF or Word for best results.</p>
        </div>
        <Button type="submit" isLoading={isPending} disabled={resumeText.trim().length < 50}>
          Import and replace my details
        </Button>
      </form>
    </section>
  );
}
