"use client";

import type { TestimonialProps } from "@/lib/schema";

export function TestimonialSection({ quote, author, role, avatarUrl }: TestimonialProps) {
  return (
    <section
      aria-label={`Testimonial from ${author}`}
      className="bg-gradient-to-b from-slate-50 to-white px-6 py-20 dark:from-slate-900 dark:to-slate-950"
    >
      <div className="mx-auto max-w-3xl text-center">
        <svg
          className="mx-auto mb-8 h-10 w-10 text-purple-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
        </svg>
        <blockquote>
          <p className="text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-200 sm:text-2xl md:text-3xl">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-8 flex items-center justify-center gap-4">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt={`Portrait of ${author}`}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700 ring-2 ring-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:ring-purple-700"
              aria-hidden="true"
            >
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <cite className="text-base font-semibold not-italic text-slate-900 dark:text-white">
              {author}
            </cite>
            {role && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
            )}
          </div>
        </figcaption>
      </div>
    </section>
  );
}
