"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, ExternalLink, Code2, FileCode } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ProblemData } from "./ProblemList";
import { getCodeforcesLink } from "@/lib/constants";

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: ProblemData | null;
  folderName: string;
  contestId: string;
}

export default function CodeViewerModal({
  isOpen,
  onClose,
  problem,
  folderName,
  contestId,
}: CodeViewerModalProps) {
  const [code, setCode] = useState<string>("");
  const [codeStatus, setCodeStatus] = useState<"loading" | "success" | "not_found" | "error">("loading");
  const [copied, setCopied] = useState(false);

  // Fetch Code
  useEffect(() => {
    if (!isOpen || !problem) return;

    if (problem.status === "pending" || !problem.file) {
      setCodeStatus("not_found");
      return;
    }

    const fetchCode = async () => {
      setCodeStatus("loading");
      try {
        const encodedPath = problem.file!.path
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/");
        const res = await fetch(
          `https://raw.githubusercontent.com/see-yaam/ICPC-assiut-university-solutions/main/${encodedPath}`
        );

        if (res.status === 404) {
          setCodeStatus("not_found");
        } else if (res.ok) {
          const text = await res.text();
          if (text.trim() === "") {
            setCodeStatus("not_found");
          } else {
            setCode(text);
            setCodeStatus("success");
          }
        } else {
          setCodeStatus("error");
        }
      } catch {
        setCodeStatus("error");
      }
    };

    fetchCode();
  }, [isOpen, problem]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !problem) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cfLink = getCodeforcesLink(contestId, problem.letter);
  const fileName = problem.file?.name || `${problem.letter}_${problem.name.replace(/\s+/g, "_")}.cpp`;

  // Determine language from file extension
  const ext = fileName.split(".").pop()?.toLowerCase() || "cpp";
  const langMap: Record<string, string> = { cpp: "cpp", c: "c", py: "python", java: "java" };
  const language = langMap[ext] || "cpp";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-[var(--border-subtle)] overflow-hidden animate-slide-up"
        style={{ background: "var(--bg-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`
              w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0
              bg-[var(--emerald-glow)] text-[var(--emerald)] border border-[rgba(16,185,129,0.2)]
            `}>
              {problem.letter}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">
                {problem.name}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">{folderName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <a
              href={cfLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-3.5"
            >
              Open on Codeforces
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(51,65,85,0.3)] rounded-lg transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Tab */}
          <div className="code-block-header shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-[var(--emerald)]" />
              <span className="font-mono text-xs text-[var(--text-secondary)]">{fileName}</span>
            </div>
            {codeStatus === "success" && (
              <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                  ${copied
                    ? "bg-[var(--emerald-glow)] text-[var(--emerald)] border border-[rgba(16,185,129,0.3)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[rgba(51,65,85,0.3)] hover:bg-[rgba(51,65,85,0.5)] border border-[var(--border-subtle)]"
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            )}
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto" style={{ background: "#282c34" }}>
            {codeStatus === "loading" && (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-7 h-7 border-3 border-[var(--emerald)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-[var(--text-muted)]">Fetching solution...</span>
                </div>
              </div>
            )}

            {codeStatus === "not_found" && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Code2 className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Solution not uploaded yet
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Check back later or solve it yourself!
                  </p>
                </div>
              </div>
            )}

            {codeStatus === "error" && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <X className="w-10 h-10 text-red-400/60 mx-auto mb-3" />
                  <p className="text-sm text-red-400">Failed to fetch code from GitHub.</p>
                </div>
              </div>
            )}

            {codeStatus === "success" && (
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                  lineHeight: "1.7",
                  fontFamily: "var(--font-code)",
                }}
                showLineNumbers
                lineNumberStyle={{
                  minWidth: "2.5em",
                  paddingRight: "1em",
                  color: "rgba(148, 163, 184, 0.3)",
                  fontSize: "0.75rem",
                }}
              >
                {code}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
