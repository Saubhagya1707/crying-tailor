"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Section } from "@/components/ui/Section";
import { Alert } from "@/components/ui/Alert";
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
    <Section
      title="Import from existing resume"
      description="Paste your resume text below. We'll use AI to extract your profile, education, experience, skills, projects, and certifications. You can review and edit the result in the form below before saving."
      className="mb-10"
    >
      <form onSubmit={handleImport} className="space-y-4">
        {message && (
          <Alert variant={message.type}>{message.text}</Alert>
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
    </Section>
  );
}
