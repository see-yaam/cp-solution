"use client";

import { useEffect, useState, useRef } from "react";
import { X, Copy, Check, ExternalLink, Code2, LayoutTemplate, AlertCircle, RefreshCw } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ProblemData } from "./ProblemList";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";

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
  const [loadingCode, setLoadingCode] = useState(false);
  const [codeStatus, setCodeStatus] = useState<"loading" | "success" | "not_found" | "error" | "pending">("loading");
  const [copied, setCopied] = useState(false);

  const [problemDetails, setProblemDetails] = useState<any>(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [apiError, setApiError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch Code
  useEffect(() => {
    if (!isOpen || !problem) return;

    if (problem.status === "pending" || !problem.file) {
      setCodeStatus("pending");
      return;
    }

    const fetchCode = async () => {
      setLoadingCode(true);
      setCodeStatus("loading");
      try {
        const encodedPath = problem.file!.path.split('/').map(segment => encodeURIComponent(segment)).join('/');
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
      } catch (err) {
        setCodeStatus("error");
      } finally {
        setLoadingCode(false);
      }
    };

    fetchCode();
  }, [isOpen, problem]);

  // Fetch Problem Statement via AllOrigins Proxy
  useEffect(() => {
    if (!isOpen || !problem) return;

    setProblemDetails(null);
    setApiError(false);
    
    const fetchProblemStatement = async () => {
      setLoadingProblem(true);
      try {
        const cfUrl = `https://codeforces.com/problemset/problem/${contestId}/${problem.letter}`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(cfUrl)}`);
        
        if (res.ok) {
          const data = await res.json();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, "text/html");
          const problemStatement = doc.querySelector(".problem-statement");
          
          if (problemStatement) {
            // Clean up the HTML: remove any relative links if necessary, or just keep as is
            // Codeforces uses $$$ for math, we handle that in processMath
            
            setProblemDetails({
              html: problemStatement.innerHTML,
              // We can still extract these if we want to use them elsewhere, 
              // but rendering innerHTML directly handles most of it.
            });
          } else {
            setApiError(true);
          }
        } else {
          setApiError(true);
        }
      } catch (err) {
        setApiError(true);
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchProblemStatement();
  }, [isOpen, problem, contestId]);

  useEffect(() => {
    if (contentRef.current && problemDetails) {
      renderMathInElement(contentRef.current, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
      });
    }
  }, [problemDetails]);

  const processMath = (text: string) => {
    if (!text) return '';
    return text.replace(/\$\$\$/g, '$');
  };

  if (!isOpen || !problem) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cfLink = `https://codeforces.com/group/MWSDmqGsZm/contest/${contestId}/problem/${problem.letter}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-7xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg shrink-0 shadow-sm ${
              problem.status === "uploaded" 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}>
              {problem.letter}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 truncate pr-4">
                {problem.name}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {folderName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <a
              href={cfLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              View on Codeforces <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body - Split View */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100 dark:bg-slate-950">
          
          {/* Left Panel: Problem Statement (Proxy) */}
          <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1117] relative">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold z-20 shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <LayoutTemplate className="w-4 h-4 text-indigo-500" /> Problem Statement
              </div>
              <a
                href={cfLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
              >
                Open Original <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="flex-1 overflow-auto relative">
              {/* CSS Scoping for Codeforces HTML */}
              <style>{`
                .cf-content {
                  font-family: 'Inter', sans-serif;
                  font-size: 0.95rem;
                  line-height: 1.6;
                  color: inherit;
                }
                .cf-content .header {
                  text-align: center;
                  margin-bottom: 2.5rem;
                  padding: 2rem 1.5rem;
                  background: var(--cf-header-bg);
                  border-radius: 1rem;
                  border: 1px solid var(--cf-border);
                }
                .cf-content .title {
                  font-size: 1.75rem;
                  font-weight: 800;
                  margin-bottom: 0.75rem;
                  color: var(--cf-title-color);
                }
                .cf-content .time-limit,
                .cf-content .memory-limit,
                .cf-content .input-file,
                .cf-content .output-file {
                  font-size: 0.9rem;
                  color: var(--cf-muted);
                  margin-bottom: 0.25rem;
                }
                .cf-content .property-title {
                  font-weight: 700;
                  color: var(--cf-text);
                }
                .cf-content .section-title {
                  font-size: 1.4rem;
                  font-weight: 700;
                  margin-top: 2.5rem;
                  margin-bottom: 1.25rem;
                  padding-bottom: 0.5rem;
                  border-bottom: 2px solid var(--cf-border);
                  color: var(--cf-title-color);
                }
                .cf-content p {
                  margin-bottom: 1.25rem;
                }
                .cf-content pre {
                  background-color: var(--cf-pre-bg);
                  padding: 1.25rem;
                  border-radius: 0.75rem;
                  overflow-x: auto;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                  font-size: 0.9rem;
                  border: 1px solid var(--cf-border);
                  margin-top: 0.5rem;
                  color: var(--cf-pre-text);
                }
                .cf-content .sample-tests {
                  margin-top: 2rem;
                }
                .cf-content .sample-test {
                  display: flex;
                  flex-direction: column;
                  gap: 1.5rem;
                  margin-bottom: 2rem;
                }
                .cf-content .sample-test .input,
                .cf-content .sample-test .output {
                  flex: 1;
                }
                .cf-content .sample-test .title {
                  font-size: 0.9rem;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-bottom: 0.5rem;
                  color: var(--cf-muted);
                }
                .cf-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 1.5rem;
                  margin-bottom: 2rem;
                  border-radius: 0.5rem;
                  overflow: hidden;
                }
                .cf-content th, .cf-content td {
                  border: 1px solid var(--cf-border);
                  padding: 1rem;
                  text-align: left;
                }
                .cf-content th {
                  background-color: var(--cf-header-bg);
                  font-weight: 700;
                }
                .cf-content ul {
                  list-style-type: disc;
                  padding-left: 2rem;
                  margin-bottom: 1.25rem;
                }
                /* Variables for light/dark mode */
                .theme-wrapper {
                  --cf-border: #e2e8f0;
                  --cf-muted: #64748b;
                  --cf-pre-bg: #f8fafc;
                  --cf-pre-text: #1e293b;
                  --cf-header-bg: #f1f5f9;
                  --cf-title-color: #0f172a;
                  --cf-text: #334155;
                }
                .dark .theme-wrapper {
                  --cf-border: #1e293b;
                  --cf-muted: #94a3b8;
                  --cf-pre-bg: #0f172a;
                  --cf-pre-text: #e2e8f0;
                  --cf-header-bg: #1e293b;
                  --cf-title-color: #f8fafc;
                  --cf-text: #cbd5e1;
                }
              `}</style>
              
              <div className="p-6 md:p-8 theme-wrapper">
                {loadingProblem && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0d1117]/80 z-10 backdrop-blur-sm">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                      Fetching Problem Statement...
                    </p>
                  </div>
                )}
                
                {apiError && !loadingProblem && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-8">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4 opacity-80" />
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Failed to Fetch Statement
                    </h3>
                    <p className="max-w-xs mb-6 text-sm">
                      Could not retrieve the problem data from the API.
                    </p>
                    <a
                      href={cfLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                    >
                      View on Codeforces <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
                
                {problemDetails && !loadingProblem && (
                  <div className="cf-content text-slate-800 dark:text-slate-200" ref={contentRef}>
                    <div 
                      dangerouslySetInnerHTML={{ __html: processMath(problemDetails.html) }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Code Viewer */}
          <div className="w-full lg:w-1/2 flex flex-col h-full bg-[#1E1E1E]">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between text-slate-300 font-semibold shadow-sm z-20 shrink-0">
              <div className="flex items-center gap-2.5">
                <Code2 className={`w-4 h-4 ${problem.status === "uploaded" ? "text-emerald-400" : "text-slate-500"}`} /> Solution Code
              </div>
              {codeStatus === "success" && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                </button>
              )}
            </div>
            
            <div className="flex-1 relative overflow-auto bg-[#1E1E1E]">
              {codeStatus === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-[#1E1E1E] z-10">
                  <div className="flex flex-col items-center gap-4 bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium tracking-wide">Fetching solution...</span>
                  </div>
                </div>
              )}

              {(codeStatus === "not_found" || codeStatus === "pending") && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E1E] z-10">
                  <div className="text-center p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl max-w-sm mx-4 shadow-xl">
                    <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-700 shadow-inner">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 mb-3 tracking-tight">Solution Not Uploaded Yet</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      The solution for <span className="text-slate-300 font-semibold">{problem.name}</span> hasn't been added to the GitHub repository yet.
                      <br/>Check back later or solve it yourself!
                    </p>
                  </div>
                </div>
              )}

              {codeStatus === "error" && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 bg-[#1E1E1E] z-10">
                  <div className="text-center p-8 bg-red-900/10 border border-red-900/30 rounded-2xl max-w-sm mx-4">
                    <X className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <p className="font-medium">Failed to fetch the code from GitHub.</p>
                  </div>
                </div>
              )}

              {codeStatus === "success" && (
                <SyntaxHighlighter
                  language="cpp"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    background: "transparent",
                    fontSize: "0.95rem",
                    minHeight: "100%",
                    lineHeight: "1.6",
                  }}
                  showLineNumbers
                >
                  {code}
                </SyntaxHighlighter>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
