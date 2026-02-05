"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

const proseClasses = {
  h1: "mt-6 mb-3 text-xl font-semibold text-zinc-900 border-b border-zinc-200 pb-1",
  h2: "mt-6 mb-2 text-lg font-semibold text-zinc-900",
  h3: "mt-4 mb-1 text-base font-semibold text-zinc-800",
  p: "mb-2 text-sm text-zinc-700 leading-relaxed",
  ul: "mb-3 list-disc pl-6 space-y-1 text-sm text-zinc-700",
  ol: "mb-3 list-decimal pl-6 space-y-1 text-sm text-zinc-700",
  li: "leading-relaxed",
  strong: "font-semibold text-zinc-900",
  br: "block",
};

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`resume-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          h1: ({ children }) => <h1 className={proseClasses.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={proseClasses.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={proseClasses.h3}>{children}</h3>,
          p: ({ children }) => <p className={proseClasses.p}>{children}</p>,
          ul: ({ children }) => <ul className={proseClasses.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={proseClasses.ol}>{children}</ol>,
          li: ({ children }) => <li className={proseClasses.li}>{children}</li>,
          strong: ({ children }) => <strong className={proseClasses.strong}>{children}</strong>,
          br: () => <br className={proseClasses.br} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
