/**
 * Builds a plain-text resume from profile and section data for use as context when tailoring.
 */
type Profile = {
  fullName: string | null;
  phone: string | null;
  summary: string | null;
  location: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
};
type EducationEntry = {
  institution: string | null;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};
type ExperienceEntry = {
  company: string | null;
  role: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  bulletPoints: string[] | null;
};
type SkillsEntry = { category: string | null; items: string[] | null };
type ProjectEntry = { name: string | null; description: string | null; url: string | null; date: string | null };
type CertificationEntry = { name: string | null; issuer: string | null; date: string | null; url: string | null };

export type ResumeData = {
  profile: Profile;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillsEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
};

function join(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

function section(title: string, body: string): string {
  if (!body.trim()) return "";
  return `## ${title}\n\n${body.trim()}\n\n`;
}

export function buildResumeText(data: ResumeData): string {
  const { profile, education, experience, skills, projects, certifications } = data;
  const lines: string[] = [];

  // Header / profile
  const name = profile.fullName?.trim();
  const contact = [profile.phone, profile.location, profile.linkedinUrl, profile.websiteUrl].filter(Boolean).join(" | ");
  if (name) lines.push(name);
  if (contact) lines.push(contact);
  if (profile.summary?.trim()) lines.push("\n" + profile.summary.trim());
  if (lines.length) lines.push("");

  // Education
  const eduText = education
    .filter((e) => e.institution || e.degree || e.field)
    .map((e) => {
      const head = join(e.degree, e.field, "—", e.institution);
      const dates = join(e.startDate, e.endDate ? `- ${e.endDate}` : null);
      const block = [head, dates].filter(Boolean).join("\n");
      return block + (e.description?.trim() ? "\n" + e.description.trim() : "");
    })
    .join("\n\n");
  if (eduText) lines.push(section("Education", eduText));

  // Experience
  const expText = experience
    .filter((e) => e.company || e.role)
    .map((e) => {
      const head = join(e.role, "at", e.company);
      const sub = [e.location, join(e.startDate, "-", e.endDate)].filter(Boolean).join(" | ");
      const block = [head, sub].filter(Boolean).join("\n");
      const desc = e.description?.trim();
      const bullets = (e.bulletPoints ?? []).filter(Boolean).map((b) => `• ${b}`).join("\n");
      const rest = [desc, bullets].filter(Boolean).join("\n");
      return block + (rest ? "\n" + rest : "");
    })
    .join("\n\n");
  if (expText) lines.push(section("Experience", expText));

  // Skills
  const skillBlocks = skills
    .filter((s) => s.category || (s.items && s.items.length))
    .map((s) => {
      const cat = s.category?.trim();
      const items = (s.items ?? []).filter(Boolean).join(", ");
      return cat ? `${cat}: ${items}` : items;
    })
    .filter(Boolean);
  if (skillBlocks.length) lines.push(section("Skills", skillBlocks.join("\n")));

  // Projects
  const projText = projects
    .filter((p) => p.name || p.description)
    .map((p) => {
      const head = join(p.name, p.date, p.url ? `(${p.url})` : null);
      return head + (p.description?.trim() ? "\n" + p.description.trim() : "");
    })
    .join("\n\n");
  if (projText) lines.push(section("Projects", projText));

  // Certifications
  const certText = certifications
    .filter((c) => c.name || c.issuer)
    .map((c) => join(c.name, c.issuer, c.date, c.url ? `(${c.url})` : null))
    .join("\n");
  if (certText) lines.push(section("Certifications", certText));

  return lines.join("\n").trim() || "No resume content provided.";
}
