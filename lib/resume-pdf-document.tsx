import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Parse Gemini-style markdown (## sections, paragraphs, bullet lines) into blocks for PDF
function parseResumeContent(content: string): { type: "header" | "section"; title?: string; body: string }[] {
  const blocks: { type: "header" | "section"; title?: string; body: string }[] = [];
  const parts = content.split(/\n(?=##\s)/);
  const header = parts[0]?.trim() ?? "";
  if (header) {
    blocks.push({ type: "header", body: header });
  }
  for (let i = 1; i < parts.length; i++) {
    const section = parts[i]!.trim();
    const firstNewline = section.indexOf("\n");
    const title = firstNewline >= 0 ? section.slice(0, firstNewline).replace(/^##\s*/, "").trim() : section.replace(/^##\s*/, "").trim();
    const body = firstNewline >= 0 ? section.slice(firstNewline).trim() : "";
    blocks.push({ type: "section", title, body });
  }
  return blocks;
}

// Split body into paragraphs and list items
function renderBody(body: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const paragraphs = body.split(/\n\n+/);
  for (const p of paragraphs) {
    const lines = p.split("\n").map((l) => l.trim()).filter(Boolean);
    const bulletLines = lines.filter((l) => /^[-*•]\s/.test(l));
    const nonBullet = lines.filter((l) => !/^[-*•]\s/.test(l));
    if (bulletLines.length > 0) {
      nodes.push(
        <View key={nodes.length} style={styles.ul}>
          {bulletLines.map((line, i) => (
            <View key={i} style={styles.li}>
              <Text style={styles.liText}>{line.replace(/^[-*•]\s*/, "")}</Text>
            </View>
          ))}
        </View>
      );
    }
    if (nonBullet.length > 0) {
      const text = nonBullet.join(" ");
      if (text) {
        nodes.push(
          <Text key={nodes.length} style={styles.paragraph}>
            {text}
          </Text>
        );
      }
    }
  }
  return nodes;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 16,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
    color: "#171717",
  },
  headerContact: {
    fontSize: 10,
    color: "#525252",
    marginBottom: 8,
  },
  headerSummary: {
    fontSize: 10,
    color: "#404040",
    lineHeight: 1.45,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#737373",
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  sectionBody: {
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.45,
    color: "#404040",
  },
  ul: {
    marginBottom: 6,
    paddingLeft: 12,
  },
  li: {
    flexDirection: "row",
    marginBottom: 2,
  },
  liText: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#404040",
  },
});

export type ResumePDFDocumentProps = {
  title?: string | null;
  content: string;
};

export function ResumePDFDocument({ title, content }: ResumePDFDocumentProps) {
  const blocks = parseResumeContent(content);
  const headerBlock = blocks.find((b) => b.type === "header");
  const sectionBlocks = blocks.filter((b) => b.type === "section");

  // Header: first line as name, second as contact, rest as summary
  const headerLines = headerBlock ? headerBlock.body.split("\n").map((l) => l.trim()).filter(Boolean) : [];
  const headerName = headerLines[0] ?? "";
  const headerContact = headerLines[1] ?? "";
  const headerSummary = headerLines.slice(2).join(" ").trim();

  return (
    <Document title={title || "Resume"}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {headerName ? <Text style={styles.headerName}>{headerName}</Text> : null}
          {headerContact ? <Text style={styles.headerContact}>{headerContact}</Text> : null}
          {headerSummary ? <Text style={styles.headerSummary}>{headerSummary}</Text> : null}
        </View>
        {sectionBlocks.map((block, i) => (
          <View key={i} style={styles.sectionBody}>
            {block.title ? <Text style={styles.sectionTitle}>{block.title}</Text> : null}
            {block.body ? renderBody(block.body) : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}

