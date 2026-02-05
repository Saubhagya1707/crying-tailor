"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { createTailoredResume } from "@/app/create/actions";

type Action = typeof createTailoredResume;

type CreateResumeFormProps = {
  action: Action;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      Generate tailored resume
    </Button>
  );
}

export function CreateResumeForm({ action }: CreateResumeFormProps) {
  const [state, formAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await action(formData);
      return result;
    },
    null
  );

  const error = state && !state.ok ? (state.error?.jobDescriptionText?.[0] ?? state.error?.title?.[0] ?? "Something went wrong.") : null;

  return (
    <form action={formAction} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Senior Engineer at Acme Corp"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="jobDescriptionText">Job description (required)</Label>
        <Textarea
          id="jobDescriptionText"
          name="jobDescriptionText"
          placeholder="Paste the full job description here..."
          rows={12}
          required
          className="mt-1 font-mono text-sm"
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
