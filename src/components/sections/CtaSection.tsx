"use client";

import type { CtaProps } from "@/lib/schema";

export function CtaSection({ heading, subheading, buttonLabel, buttonUrl, variant = "primary" }: CtaProps) {
  const variantClasses: Record<string, string> = {
    primary:
      "bg-white text-purple-700 hover:bg-purple-50 focus-visible:ring-white focus-visible:ring-offset-purple-700",
    secondary:
      "bg-purple-800 text-white border-2 border-white hover:bg-purple-900 focus-visible:ring-white",
    outline:
      "bg-transparent text-white border-2 border-white hover:bg-white/10 focus-visible:ring-white",
  };

  return (
    <section
      aria-label="Call to action"
      className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 px-6 py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-4 text-lg text-purple-100 sm:text-xl">
            {subheading}
          </p>
        )}
        <div className="mt-10">
          <a
            href={buttonUrl}
            role="button"
            className={`inline-flex items-center rounded-full px-8 py-4 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:transition-transform ${variantClasses[variant || "primary"]}`}
          >
            {buttonLabel}
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
