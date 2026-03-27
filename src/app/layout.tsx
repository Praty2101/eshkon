import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Studio — Schema-Driven Page Builder",
  description:
    "Build, edit, preview, and publish landing pages with a WYSIWYG-lite studio. Contentful-powered, version-controlled, WCAG 2.2 AAA-oriented.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
