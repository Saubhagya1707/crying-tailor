"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { deleteTailoredDocument, updateTailoredDocument } from "@/app/history/[id]/actions";

type DocumentViewEditProps = {
  id: string;
  title: string | null;
  generatedContent: string;
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export function DocumentViewEdit({ id, title, generatedContent }: DocumentViewEditProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title ?? "");
  const [editContent, setEditContent] = useState(generatedContent);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: title || "Tailored Resume",
    pageStyle: `
      @page { size: A4; margin: 16mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  async function handleDownloadPdf() {
    setIsDownloadingPdf(true);
    setMessage(null);
    try {
      // Prefer text-based PDF (selectable text) via API
      const res = await fetch("/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title ?? undefined,
          content: generatedContent,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const filename = (res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1])
          ?? (title || "tailored-resume").replace(/[^a-z0-9-]/gi, "-").toLowerCase() + ".pdf";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setIsDownloadingPdf(false);
        return;
      }
      throw new Error("PDF API failed");
    } catch {
      // Fall through to image-based fallback
    }

    // Fallback: image-based PDF (text not selectable)
    const el = contentRef.current;
    if (!el) {
      setIsDownloadingPdf(false);
      return;
    }
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
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

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteTailoredDocument(formData);
      if (result.ok) {
        router.push("/history");
        router.refresh();
      } else {
        const err = result.error?.id?.[0] ?? "Failed to delete.";
        setMessage({ type: "error", text: err });
        setIsDeleting(false);
        setIsConfirmOpen(false);
      }
    });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="space-y-4">
        {message && <Alert variant={message.type}>{message.text}</Alert>}
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
      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
      <div className="mb-4 flex flex-wrap justify-end gap-2">
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
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
          className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete this tailored resume?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
      <Card
        ref={contentRef}
        padding="none"
        shadow
        className="resume-document mx-auto max-w-[210mm] py-8 px-10 print:max-w-none print:border-0 print:shadow-none"
      >
        {title ? (
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900">
            {title}
          </h2>
        ) : null}
        <MarkdownContent content={generatedContent} />
      </Card>
    </div>
  );
}
