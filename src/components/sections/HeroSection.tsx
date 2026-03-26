"use client";

import type { HeroProps } from "@/lib/schema";

export function HeroSection({ heading, subheading, ctaLabel, ctaUrl, backgroundImageUrl }: HeroProps) {
  return (
    <section
      role="banner"
      aria-label={heading}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-24 text-center text-white"
      style={
        backgroundImageUrl
          ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}
      <div className="relative z-10 mx-auto max-w-3xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-6 text-lg text-white/80 sm:text-xl md:text-2xl">
            {subheading}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="mt-10">
            <a
              href={ctaUrl}
              role="button"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 motion-safe:transition-transform"
            >
              {ctaLabel}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
