"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateTailoredDocument } from "@/app/history/[id]/actions";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

type DocumentViewEditProps = {
  id: string;
  title: string | null;
  generatedContent: string;
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794; // at 96 dpi
const A4_HEIGHT_PX = 1123;

export function DocumentViewEdit({ id, title, generatedContent }: DocumentViewEditProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title ?? "");
  const [editContent, setEditContent] = useState(generatedContent);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: title || "Tailored Resume",
    pageStyle: `
      @page { size: A4; margin: 16mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  async function handleDownloadPdf() {
    const el = contentRef.current;
    if (!el) return;
    setIsDownloadingPdf(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // html2canvas doesn't support lab()/oklch() from Tailwind v4; remove stylesheets and use hex-only styles
        onclone: (clonedDoc, clonedEl) => {
          clonedDoc.querySelectorAll("link[rel=stylesheet], style").forEach((s) => s.remove());
          const style = clonedDoc.createElement("style");
          style.textContent = `
            * { color: #171717 !important; background-color: transparent !important; }
            body, .pdf-content { background-color: #ffffff !important; }
            h1, h2, h3 { font-weight: 600; margin: 1em 0 0.5em; }
            p, li { margin: 0.25em 0; line-height: 1.5; }
            ul, ol { margin: 0.5em 0; padding-left: 1.5em; }
          `;
          clonedEl.classList.add("pdf-content");
          clonedEl.prepend(style);
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = A4_WIDTH_MM;
      const pageHeight = A4_HEIGHT_MM;
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin;
      const contentHeight = pageHeight - 2 * margin;
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;
      let page = 0;
      doc.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
      while (heightLeft > 0) {
        page++;
        doc.addPage();
        position = margin - (page * contentHeight);
        doc.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }
      const filename = (title || "tailored-resume").replace(/[^a-z0-9-]/gi, "-").toLowerCase() + ".pdf";
      doc.save(filename);
    } catch (err) {
      console.error("PDF download failed:", err);
      setMessage({ type: "error", text: "Failed to generate PDF. Try Print → Save as PDF instead." });
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("title", editTitle.trim());
    formData.set("generatedContent", editContent.trim());
    startTransition(async () => {
      const result = await updateTailoredDocument(formData);
      if (result.ok) {
        setMessage({ type: "success", text: "Saved." });
        setIsEditing(false);
        router.refresh();
      } else {
        const err = result.error?.generatedContent?.[0] ?? result.error?.title?.[0] ?? "Failed to save.";
        setMessage({ type: "error", text: err });
      }
    });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="space-y-4">
        {message && (
          <p
            className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            role="alert"
          >
            {message.text}
          </p>
        )}
        <div>
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            name="title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Optional title"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="edit-content">Content</Label>
          <Textarea
            id="edit-content"
            name="generatedContent"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={20}
            required
            className="mt-1 font-mono text-sm"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" isLoading={isPending}>
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditTitle(title ?? "");
              setEditContent(generatedContent);
              setIsEditing(false);
              setMessage(null);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleDownloadPdf}
          isLoading={isDownloadingPdf}
          disabled={isDownloadingPdf}
        >
          Download PDF
        </Button>
        <Button type="button" variant="outline" onClick={() => handlePrint()}>
          Print
        </Button>
        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>
      {/* Ref wraps visible content so print dialog and PDF capture both get the same content */}
      <div ref={contentRef} className="rounded-xl border border-zinc-200 bg-white p-6">
        {title ? (
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900">
            {title}
          </h2>
        ) : null}
        <MarkdownContent content={generatedContent} />
      </div>
    </div>
  );
}
