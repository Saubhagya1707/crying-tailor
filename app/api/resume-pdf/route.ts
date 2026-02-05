import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { marked } from "marked";
import puppeteer from "puppeteer-core";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireApiAuth();
  if ("response" in auth) return auth.response;

  let body: { title?: string | null; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (!content.trim()) {
    return NextResponse.json(
      { error: "Missing or empty content" },
      { status: 400 }
    );
  }

  const title = typeof body.title === "string" ? body.title : undefined;

  marked.setOptions({
    breaks: true,
  });

  const htmlBody = marked.parse(content);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${(title || "Resume").replace(/</g, "&lt;")}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: "Helvetica", "Arial", sans-serif;
        color: #1f2937;
        line-height: 1.5;
        font-size: 11pt;
        margin: 0;
        padding: 0;
      }
      .resume {
        padding: 24px 8px;
      }
      h1, h2, h3 {
        color: #111827;
        margin: 16px 0 8px;
        line-height: 1.2;
      }
      h1 { font-size: 18pt; }
      h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: 0.04em; }
      h3 { font-size: 11pt; }
      p { margin: 6px 0; }
      ul, ol { margin: 6px 0 6px 18px; padding: 0; }
      li { margin: 2px 0; }
      a { color: #1d4ed8; text-decoration: none; }
      strong { font-weight: 700; }
      em { font-style: italic; }
      hr { border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0; }
      pre, code { font-family: "Courier New", monospace; }
      blockquote {
        border-left: 3px solid #e5e7eb;
        padding-left: 10px;
        color: #4b5563;
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    <article class="resume">
      ${htmlBody}
    </article>
  </body>
</html>`;

  const findChromePath = () => {
    const envPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
    if (envPath && fs.existsSync(envPath)) return envPath;
    const candidates = [
      "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
      "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
      "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
      "C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ];
    return candidates.find((candidate) => fs.existsSync(candidate));
  };

  try {
    const executablePath = findChromePath();
    if (!executablePath) {
      return NextResponse.json(
        { error: "Chrome/Edge not found. Set PUPPETEER_EXECUTABLE_PATH." },
        { status: 500 }
      );
    }

    const browser = await puppeteer.launch({
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "16mm",
        bottom: "16mm",
        left: "16mm",
        right: "16mm",
      },
    });
    await page.close();
    await browser.close();

    const filename = (title || "tailored-resume")
      .replace(/[^a-z0-9-]/gi, "-")
      .toLowerCase() + ".pdf";
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("Resume PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
