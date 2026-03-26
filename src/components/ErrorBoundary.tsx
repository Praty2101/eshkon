"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex min-h-[50vh] items-center justify-center bg-red-50 px-6 dark:bg-red-950/20"
        >
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">🚨</div>
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-300">
              Something went wrong
            </h2>
            <p className="mt-3 text-red-700 dark:text-red-400">
              The page could not be rendered. This may be due to invalid data.
            </p>
            {this.state.error && (
              <pre className="mt-4 overflow-auto rounded-lg bg-red-100 p-4 text-left text-xs text-red-900 dark:bg-red-900/30 dark:text-red-200">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
