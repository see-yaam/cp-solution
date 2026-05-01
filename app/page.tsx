import Link from "next/link";
import { CONTESTS } from "@/lib/constants";
import { ArrowRight, Code2, Trophy, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />
      <div
        className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Nav Bar */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg tracking-tight">
              CP Solution
            </span>
          </div>
          <a
            href="https://github.com/see-yaam/ICPC-assiut-university-solutions"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-xs"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            GitHub
          </a>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-secondary)] mb-8">
              <Zap className="w-3.5 h-3.5 text-[var(--emerald)]" />
              Competitive Programming Solutions
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="gradient-text">CP Solution</span>
              <br />
              <span className="text-[var(--text-secondary)] text-3xl sm:text-4xl font-semibold">
                Hub
              </span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-14 leading-relaxed">
              Browse curated competitive programming solutions. Study clean implementations,
              track your progress, and level up your problem-solving skills.
            </p>
          </div>

          {/* Contests Section */}
          <section className="w-full max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2.5 mb-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <Trophy className="w-5 h-5 text-[var(--emerald)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contests</h2>
            </div>

            <div className="space-y-4 stagger-children">
              {CONTESTS.map((contest) => (
                <Link
                  key={contest.slug}
                  href={`/contest/${contest.slug}`}
                  id={`contest-card-${contest.slug}`}
                  className="glass-card block p-6 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                        {contest.emoji}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--emerald)] transition-colors mb-1 truncate">
                          {contest.name}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                          {contest.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs font-medium text-[var(--text-secondary)] bg-[rgba(51,65,85,0.3)] px-2.5 py-1 rounded-md">
                            {contest.sheetCount} Sheets
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--emerald)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Built for competitive programmers • Solutions from{" "}
            <a
              href="https://github.com/see-yaam/ICPC-assiut-university-solutions"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--emerald)] hover:underline"
            >
              see-yaam/ICPC-assiut-university-solutions
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
