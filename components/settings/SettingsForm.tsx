"use client";

import { ResumeForm } from "@/components/resume/ResumeForm";
import { updateSettings } from "@/app/settings/actions";
import type { OnboardingInput } from "@/lib/validations/resume";

type SettingsFormProps = {
  initialData: OnboardingInput;
};

export function SettingsForm({ initialData }: SettingsFormProps) {
  return (
    <ResumeForm
      initialData={initialData}
      onSubmit={updateSettings}
      submitLabel="Save changes"
    />
  );
}
