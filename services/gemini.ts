import { GoogleGenerativeAI } from "@google/generative-ai";
import type { OnboardingInput } from "@/lib/validations/resume";

const modelName = "gemini-2.0-flash";

/**
 * Calls Gemini to generate a tailored resume based on the user's current resume text and the job description.
 * Returns the generated tailored content as plain text.
 */
export async function generateTailoredResume(
  currentResumeText: string,
  jobDescription: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env.local.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `You are a professional resume writer. Given the candidate's current resume and a job description, produce a tailored resume that:
  - Keeps the same structure (sections: header, Education, Experience, Skills, Projects, Certifications as applicable)
  - Emphasizes and rephrases experience, skills, and achievements that match the job description
  - Uses keywords from the job description where appropriate without copying the job description
  - Keeps the content factual and based only on the candidate's resume; do not invent experience or skills
  - Output plain text only, with clear section headers (e.g. ## Experience). No markdown beyond ## for headers.
  - Try to improve the resume text if it is not clear or has typos. i.e. spacing between words if not present.
  - i.e. SoftwareEngineer -> Software Engineer
  - You must fix all the typos and spacing between words if not present.

  CANDIDATE'S CURRENT RESUME:
  ---
  ${currentResumeText}
  ---

  JOB DESCRIPTION:
  ---
  ${jobDescription}
  ---

  Tailored resume (Markdown text):`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text || !text.trim()) {
    throw new Error("Gemini returned no content.");
  }
  return text.trim();
}

const RESUME_EXTRACT_JSON_SCHEMA = `
Return a single JSON object with this exact structure (use empty strings "" or empty arrays [] when not found):
{
  "profile": {
    "fullName": "string",
    "phone": "string",
    "summary": "string (professional summary / objective)",
    "location": "string",
    "linkedinUrl": "string (full URL or empty)",
    "websiteUrl": "string (full URL or empty)"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string",
      "bulletPoints": ["string"]
    }
  ],
  "skills": [
    { "category": "string (e.g. Languages, Tools)", "items": ["string"] }
  ],
  "projects": [
    { "name": "string", "description": "string", "url": "string", "date": "string" }
  ],
  "certifications": [
    { "name": "string", "issuer": "string", "date": "string", "url": "string" }
  ]
}
`;

/**
 * Extracts structured resume data from raw resume text using Gemini.
 * Returns data in OnboardingInput shape for validation and DB save.
 */
export async function extractResumeDetails(resumeText: string): Promise<OnboardingInput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env.local.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const prompt = `You are a resume parser.
  Extract all information from the following resume text into the exact JSON structure below. Preserve dates, bullet points, and wording; use empty string or empty array when a section or field is not present. 
  Do not invent or add information not in the resume.
  Try to improve the resume text if it is not clear or has typos. i.e. spacing between words if not present.
  i.e. SoftwareEngineer -> Software Engineer

  ${RESUME_EXTRACT_JSON_SCHEMA}

  RESUME TEXT:
  ---
  ${resumeText}
  ---

  Return only the JSON object, no other text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text || !text.trim()) {
    throw new Error("Gemini returned no content.");
  }

  let raw: unknown;
  try {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    raw = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse extracted resume as JSON.");
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Extracted data is not a valid object.");
  }

  const obj = raw as Record<string, unknown>;
  return {
    profile: normalizeProfile(obj.profile),
    education: normalizeArray(obj.education, normalizeEducation),
    experience: normalizeArray(obj.experience, normalizeExperience),
    skills: normalizeArray(obj.skills, normalizeSkill),
    projects: normalizeArray(obj.projects, normalizeProject),
    certifications: normalizeArray(obj.certifications, normalizeCertification),
  };
}

function normalizeProfile(v: unknown): OnboardingInput["profile"] {
  if (!v || typeof v !== "object") return { fullName: "", phone: "", summary: "", location: "", linkedinUrl: "", websiteUrl: "" };
  const o = v as Record<string, unknown>;
  return {
    fullName: str(o.fullName),
    phone: str(o.phone),
    summary: str(o.summary),
    location: str(o.location),
    linkedinUrl: ensureUrl(str(o.linkedinUrl)),
    websiteUrl: ensureUrl(str(o.websiteUrl)),
  };
}

function normalizeEducation(v: unknown): OnboardingInput["education"][number] {
  if (!v || typeof v !== "object") return { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" };
  const o = v as Record<string, unknown>;
  return {
    institution: str(o.institution),
    degree: str(o.degree),
    field: str(o.field),
    startDate: str(o.startDate),
    endDate: str(o.endDate),
    description: str(o.description),
  };
}

function normalizeExperience(v: unknown): OnboardingInput["experience"][number] {
  if (!v || typeof v !== "object") return { company: "", role: "", location: "", startDate: "", endDate: "", description: "", bulletPoints: [] };
  const o = v as Record<string, unknown>;
  return {
    company: str(o.company),
    role: str(o.role),
    location: str(o.location),
    startDate: str(o.startDate),
    endDate: str(o.endDate),
    description: str(o.description),
    bulletPoints: Array.isArray(o.bulletPoints) ? o.bulletPoints.map((x) => String(x ?? "")) : [],
  };
}

function normalizeSkill(v: unknown): OnboardingInput["skills"][number] {
  if (!v || typeof v !== "object") return { category: "", items: [] };
  const o = v as Record<string, unknown>;
  return {
    category: str(o.category),
    items: Array.isArray(o.items) ? o.items.map((x) => String(x ?? "")) : [],
  };
}

function normalizeProject(v: unknown): OnboardingInput["projects"][number] {
  if (!v || typeof v !== "object") return { name: "", description: "", url: "", date: "" };
  const o = v as Record<string, unknown>;
  return { name: str(o.name), description: str(o.description), url: ensureUrl(str(o.url)), date: str(o.date) };
}

function normalizeCertification(v: unknown): OnboardingInput["certifications"][number] {
  if (!v || typeof v !== "object") return { name: "", issuer: "", date: "", url: "" };
  const o = v as Record<string, unknown>;
  return { name: str(o.name), issuer: str(o.issuer), date: str(o.date), url: ensureUrl(str(o.url)) };
}

function str(x: unknown): string {
  if (x == null) return "";
  return String(x).trim();
}

/** Ensure URL passes Zod .url(): add https:// if it looks like a URL but has no protocol. */
function ensureUrl(s: string): string {
  if (!s) return "";
  const t = s.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/.*)?$/i.test(t) || t.startsWith("linkedin.com") || t.startsWith("github.com")) {
    return `https://${t.replace(/^\/*/, "")}`;
  }
  return t;
}

function normalizeArray<T>(val: unknown, fn: (v: unknown) => T): T[] {
  if (!Array.isArray(val)) return [];
  return val.map(fn);
}
