"use client";

interface UnsupportedSectionProps {
  type: string;
  id: string;
}

export function UnsupportedSection({ type, id }: UnsupportedSectionProps) {
  return (
    <section
      role="alert"
      aria-label={`Unsupported section: ${type}`}
      className="border-2 border-dashed border-amber-400 bg-amber-50 px-6 py-12 text-center dark:border-amber-600 dark:bg-amber-950/30"
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-4 text-4xl" aria-hidden="true">⚠️</div>
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
          Unsupported Section Type
        </h3>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
          Section type <code className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-800">{type}</code> is not registered.
        </p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
          Section ID: {id}
        </p>
      </div>
    </section>
  );
}
