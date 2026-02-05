import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export const educationEntrySchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  orderIndex: z.number().optional(),
});

export const experienceEntrySchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  bulletPoints: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
});

export const skillsEntrySchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().optional(),
  items: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
});

export const projectEntrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  date: z.string().optional(),
  orderIndex: z.number().optional(),
});

export const certificationEntrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  issuer: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  orderIndex: z.number().optional(),
});

export const onboardingSchema = z.object({
  profile: profileSchema,
  education: z.array(educationEntrySchema),
  experience: z.array(experienceEntrySchema),
  skills: z.array(skillsEntrySchema),
  projects: z.array(projectEntrySchema),
  certifications: z.array(certificationEntrySchema),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
export type SkillsEntryInput = z.infer<typeof skillsEntrySchema>;
export type ProjectEntryInput = z.infer<typeof projectEntrySchema>;
export type CertificationEntryInput = z.infer<typeof certificationEntrySchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
