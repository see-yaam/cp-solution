import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CP Solution Explorer",
  description: "Browse CP solutions from GitHub",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto border-l border-slate-200 dark:border-slate-800">
          {children}
        </main>
      </body>
    </html>
  );
}
