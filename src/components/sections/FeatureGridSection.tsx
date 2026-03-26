"use client";

import type { FeatureGridProps } from "@/lib/schema";

const defaultIcons: Record<string, string> = {
  performance: "⚡",
  security: "🔒",
  scale: "📈",
  design: "🎨",
  code: "💻",
  cloud: "☁️",
};

export function FeatureGridSection({ heading, subheading, features }: FeatureGridProps) {
  return (
    <section
      aria-labelledby="feature-grid-heading"
      className="bg-white px-6 py-20 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2
            id="feature-grid-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              {subheading}
            </p>
          )}
        </div>
        <div
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              role="listitem"
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all hover:border-purple-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-700 dark:hover:bg-slate-800 motion-safe:transition-all motion-safe:duration-300"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl dark:bg-purple-900/30"
                aria-hidden="true"
              >
                {feature.icon ? (defaultIcons[feature.icon] || feature.icon) : "✦"}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
