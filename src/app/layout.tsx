import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { getUserRole } from "@/lib/auth";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Studio — Schema-Driven Page Builder",
  description:
    "Build, edit, preview, and publish landing pages with a WYSIWYG-lite studio. Contentful-powered, version-controlled, WCAG 2.2 AAA-oriented.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentRole = getUserRole(await headers(), await cookies());

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/"
                    className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    Page Studio
                  </Link>
                  <Badge variant="outline" className="border-slate-300 text-slate-700">
                    Current role: {currentRole === "publisher" ? "Admin (Publisher)" : currentRole}
                  </Badge>
                </div>
                <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <Link
                    href="/preview/landing"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    Preview
                  </Link>
                  <Link
                    href="/get-started"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    Login Options
                  </Link>
                </nav>
              </div>

              <div className="w-full lg:max-w-md">
                <RoleSwitcher
                  currentRole={currentRole}
                  compact
                  title="Switch access"
                />
              </div>
            </div>
          </div>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
