import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ResumePDFDocument } from "@/lib/resume-pdf-document";

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

  try {
    const element = React.createElement(ResumePDFDocument, {
      title,
      content,
    });
    // renderToBuffer is typed for Document root; our component renders Document internally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);
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
