"use client";

import { ResumeForm } from "@/components/resume/ResumeForm";
import { saveOnboarding } from "@/app/onboarding/actions";
import type { OnboardingInput } from "@/lib/validations/resume";

const emptyInitialData: OnboardingInput = {
  profile: {
    fullName: "",
    phone: "",
    summary: "",
    location: "",
    linkedinUrl: "",
    websiteUrl: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

export function OnboardingForm() {
  return (
    <ResumeForm
      initialData={emptyInitialData}
      onSubmit={saveOnboarding}
      submitLabel="Save and continue"
    />
  );
}
