"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FieldSet } from "@/components/ui/FieldSet";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";
import type {
  OnboardingInput,
  EducationEntryInput,
  ExperienceEntryInput,
  SkillsEntryInput,
  ProjectEntryInput,
  CertificationEntryInput,
} from "@/lib/validations/resume";

const defaultEducation = (): EducationEntryInput => ({
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
});

const defaultExperience = (): ExperienceEntryInput => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  bulletPoints: [],
});

const defaultSkill = (): SkillsEntryInput => ({ category: "", items: [] });
const defaultProject = (): ProjectEntryInput => ({ name: "", description: "", url: "", date: "" });
const defaultCertification = (): CertificationEntryInput => ({ name: "", issuer: "", date: "", url: "" });

type SubmitResult = { ok: false; error: Record<string, string[] | undefined> } | { ok: true } | void;

type ResumeFormProps = {
  initialData: OnboardingInput;
  onSubmit: (data: OnboardingInput) => Promise<SubmitResult>;
  submitLabel?: string;
};

export function ResumeForm({ initialData, onSubmit, submitLabel = "Save" }: ResumeFormProps) {
  const [data, setData] = useState<OnboardingInput>(initialData);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = (key: keyof OnboardingInput["profile"], value: string) => {
    setData((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));
  };

  const addEducation = () => setData((d) => ({ ...d, education: [...d.education, defaultEducation()] }));
  const removeEducation = (i: number) => setData((d) => ({ ...d, education: d.education.filter((_, j) => j !== i) }));
  const updateEducation = (i: number, key: keyof EducationEntryInput, value: string | number | undefined) => {
    setData((d) => ({ ...d, education: d.education.map((e, j) => (j === i ? { ...e, [key]: value } : e)) }));
  };

  const addExperience = () => setData((d) => ({ ...d, experience: [...d.experience, defaultExperience()] }));
  const removeExperience = (i: number) => setData((d) => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }));
  const updateExperience = (i: number, key: keyof ExperienceEntryInput, value: string | string[] | number | undefined) => {
    setData((d) => ({ ...d, experience: d.experience.map((e, j) => (j === i ? { ...e, [key]: value } : e)) }));
  };

  const addSkills = () => setData((d) => ({ ...d, skills: [...d.skills, defaultSkill()] }));
  const removeSkills = (i: number) => setData((d) => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }));
  const updateSkills = (i: number, key: keyof SkillsEntryInput, value: string | string[] | number | undefined) => {
    setData((d) => ({ ...d, skills: d.skills.map((s, j) => (j === i ? { ...s, [key]: value } : s)) }));
  };

  const addProject = () => setData((d) => ({ ...d, projects: [...d.projects, defaultProject()] }));
  const removeProject = (i: number) => setData((d) => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }));
  const updateProject = (i: number, key: keyof ProjectEntryInput, value: string | number | undefined) => {
    setData((d) => ({ ...d, projects: d.projects.map((p, j) => (j === i ? { ...p, [key]: value } : p)) }));
  };

  const addCertification = () => setData((d) => ({ ...d, certifications: [...d.certifications, defaultCertification()] }));
  const removeCertification = (i: number) => setData((d) => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) }));
  const updateCertification = (i: number, key: keyof CertificationEntryInput, value: string | number | undefined) => {
    setData((d) => ({ ...d, certifications: d.certifications.map((c, j) => (j === i ? { ...c, [key]: value } : c)) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        const result = await onSubmit(data);
        if (result && !result.ok) {
          const err = result.error as Record<string, string[] | undefined>;
          const first = Object.values(err).flat().filter(Boolean)[0];
          setFormError(first ? String(first) : "Validation failed");
        } else if (result?.ok) {
          setSuccess(true);
        }
      } catch (err) {
        // Next.js redirect() throws; rethrow so the redirect is honored
        if (err && typeof err === "object" && "digest" in err && String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
          throw err;
        }
        setFormError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {formError && <Alert variant="error">{formError}</Alert>}
      {success && <Alert variant="success">Settings saved.</Alert>}

      <Section title="Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={data.profile.fullName ?? ""} onChange={(e) => updateProfile("fullName", e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={data.profile.phone ?? ""} onChange={(e) => updateProfile("phone", e.target.value)} placeholder="+1 234 567 8900" />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={data.profile.location ?? ""} onChange={(e) => updateProfile("location", e.target.value)} placeholder="City, Country" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="summary">Professional summary</Label>
            <Textarea id="summary" value={data.profile.summary ?? ""} onChange={(e) => updateProfile("summary", e.target.value)} placeholder="Brief summary..." rows={4} />
          </div>
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" type="url" value={data.profile.linkedinUrl ?? ""} onChange={(e) => updateProfile("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" type="url" value={data.profile.websiteUrl ?? ""} onChange={(e) => updateProfile("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
        </div>
      </Section>

      <Section title="Education" action={<Button type="button" variant="outline" onClick={addEducation}>Add education</Button>}>
        {data.education.length === 0 && <p className="text-sm text-zinc-500">No entries yet.</p>}
        {data.education.map((entry, i) => (
          <FieldSet key={i}>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-zinc-600">Entry {i + 1}</span>
              <Button type="button" variant="ghost" onClick={() => removeEducation(i)}>Remove</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Institution</Label>
                <Input value={entry.institution ?? ""} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="University name" />
              </div>
              <div>
                <Label>Degree</Label>
                <Input value={entry.degree ?? ""} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="B.S., M.A." />
              </div>
              <div>
                <Label>Field of study</Label>
                <Input value={entry.field ?? ""} onChange={(e) => updateEducation(i, "field", e.target.value)} placeholder="Computer Science" />
              </div>
              <div>
                <Label>Start date</Label>
                <Input value={entry.startDate ?? ""} onChange={(e) => updateEducation(i, "startDate", e.target.value)} placeholder="2018" />
              </div>
              <div>
                <Label>End date</Label>
                <Input value={entry.endDate ?? ""} onChange={(e) => updateEducation(i, "endDate", e.target.value)} placeholder="2022" />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={entry.description ?? ""} onChange={(e) => updateEducation(i, "description", e.target.value)} placeholder="Relevant coursework..." rows={2} />
              </div>
            </div>
          </FieldSet>
        ))}
      </Section>

      <Section title="Experience" action={<Button type="button" variant="outline" onClick={addExperience}>Add experience</Button>}>
        {data.experience.length === 0 && <p className="text-sm text-zinc-500">No entries yet.</p>}
        {data.experience.map((entry, i) => (
          <FieldSet key={i}>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-zinc-600">Entry {i + 1}</span>
              <Button type="button" variant="ghost" onClick={() => removeExperience(i)}>Remove</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Company</Label>
                <Input value={entry.company ?? ""} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company name" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={entry.role ?? ""} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Job title" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={entry.location ?? ""} onChange={(e) => updateExperience(i, "location", e.target.value)} placeholder="City, Country" />
              </div>
              <div>
                <Label>Start date</Label>
                <Input value={entry.startDate ?? ""} onChange={(e) => updateExperience(i, "startDate", e.target.value)} placeholder="Jan 2020" />
              </div>
              <div>
                <Label>End date</Label>
                <Input value={entry.endDate ?? ""} onChange={(e) => updateExperience(i, "endDate", e.target.value)} placeholder="Present" />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={entry.description ?? ""} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Brief role description..." rows={2} />
              </div>
              <div className="sm:col-span-2">
                <Label>Bullet points (one per line)</Label>
                <Textarea
                  value={(entry.bulletPoints ?? []).join("\n")}
                  onChange={(e) => updateExperience(i, "bulletPoints", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                  placeholder="Achieved X by doing Y..."
                  rows={4}
                />
              </div>
            </div>
          </FieldSet>
        ))}
      </Section>

      <Section title="Skills" action={<Button type="button" variant="outline" onClick={addSkills}>Add category</Button>}>
        {data.skills.map((entry, i) => (
          <FieldSet key={i} className="flex flex-wrap items-start gap-3">
            <div className="min-w-[120px] flex-1">
              <Label>Category</Label>
              <Input value={entry.category ?? ""} onChange={(e) => updateSkills(i, "category", e.target.value)} placeholder="e.g. Languages, Tools" />
            </div>
            <div className="min-w-[200px] flex-1">
              <Label>Items (comma-separated)</Label>
              <Input
                value={(entry.items ?? []).join(", ")}
                onChange={(e) => updateSkills(i, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            <Button type="button" variant="ghost" onClick={() => removeSkills(i)} className="mt-6">Remove</Button>
          </FieldSet>
        ))}
      </Section>

      <Section title="Projects" action={<Button type="button" variant="outline" onClick={addProject}>Add project</Button>}>
        {data.projects.map((entry, i) => (
          <FieldSet key={i}>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-zinc-600">Project {i + 1}</span>
              <Button type="button" variant="ghost" onClick={() => removeProject(i)}>Remove</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Name</Label>
                <Input value={entry.name ?? ""} onChange={(e) => updateProject(i, "name", e.target.value)} placeholder="Project name" />
              </div>
              <div>
                <Label>URL</Label>
                <Input type="url" value={entry.url ?? ""} onChange={(e) => updateProject(i, "url", e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={entry.date ?? ""} onChange={(e) => updateProject(i, "date", e.target.value)} placeholder="2023" />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={entry.description ?? ""} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="What you built..." rows={2} />
              </div>
            </div>
          </FieldSet>
        ))}
      </Section>

      <Section title="Certifications" action={<Button type="button" variant="outline" onClick={addCertification}>Add certification</Button>}>
        {data.certifications.map((entry, i) => (
          <FieldSet key={i} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[140px] flex-1">
              <Label>Name</Label>
              <Input value={entry.name ?? ""} onChange={(e) => updateCertification(i, "name", e.target.value)} placeholder="Certification name" />
            </div>
            <div className="min-w-[120px] flex-1">
              <Label>Issuer</Label>
              <Input value={entry.issuer ?? ""} onChange={(e) => updateCertification(i, "issuer", e.target.value)} placeholder="Issuing org" />
            </div>
            <div className="min-w-[100px]">
              <Label>Date</Label>
              <Input value={entry.date ?? ""} onChange={(e) => updateCertification(i, "date", e.target.value)} placeholder="2024" />
            </div>
            <div className="min-w-[180px] flex-1">
              <Label>URL</Label>
              <Input type="url" value={entry.url ?? ""} onChange={(e) => updateCertification(i, "url", e.target.value)} placeholder="https://..." />
            </div>
            <Button type="button" variant="ghost" onClick={() => removeCertification(i)}>Remove</Button>
          </FieldSet>
        ))}
      </Section>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isPending}>{submitLabel}</Button>
      </div>
    </form>
  );
}
