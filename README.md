This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## CI/CD (GitHub Actions)

The repo includes a workflow at `.github/workflows/ci.yml` that runs on every push and pull request to `main` or `master`:

- **Lint** – `next lint`
- **Typecheck** – `tsc --noEmit`
- **Tests** – `vitest run`
- **Build** – `next build` (with placeholder env so CI does not need secrets)

### What you need to do

1. **Push to GitHub**  
   Push the repo to GitHub so Actions can run. No extra setup is required for CI; the workflow uses placeholder env vars for the build step.

2. **Default branch**  
   If your default branch is not `main` or `master`, edit `.github/workflows/ci.yml` and set `branches` under `on.push` and `on.pull_request` to your branch name(s).

3. **Deployment (e.g. Vercel)**  
   For real deployment, configure these in your hosting dashboard (e.g. Vercel → Project → Settings → Environment Variables):

   | Variable           | Description                          |
   |--------------------|--------------------------------------|
   | `DATABASE_URL`     | Neon (or other) PostgreSQL URL       |
   | `NEXTAUTH_SECRET`  | Random secret for NextAuth (e.g. `openssl rand -base64 32`) |
   | `NEXTAUTH_URL`     | App URL (e.g. `https://your-app.vercel.app`). Must be correct for email verification links. |
   | `GEMINI_API_KEY`   | Google AI Studio API key for tailoring |
   | `RESEND_API_KEY`   | Resend API key for sending verification emails |
   | `RESEND_FROM`      | (Optional) From address for emails (e.g. `Resume Tailor <cryingtailor@resend.dev>`). Defaults to `cryingtailor@resend.dev`. |

   Do **not** put these in the repo or in the workflow file; use the host’s secret/env UI.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
