"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROLE_OPTIONS, type Role } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RoleSwitcherProps {
  currentRole: Role;
  compact?: boolean;
  redirectTo?: string;
  title?: string;
}

function getDestinationForRole(role: Role, pathname: string, redirectTo?: string) {
  const requestedPath = redirectTo ?? pathname;

  if (!requestedPath || requestedPath === "/login" || requestedPath === "/forbidden") {
    return role === "viewer" ? "/preview/landing" : "/studio/landing";
  }

  if (role === "viewer" && requestedPath.startsWith("/studio")) {
    return "/preview/landing";
  }

  return requestedPath;
}

export function RoleSwitcher({
  currentRole,
  compact = false,
  redirectTo,
  title = "Choose a role",
}: RoleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const activeOption = useMemo(
    () => ROLE_OPTIONS.find((option) => option.role === currentRole),
    [currentRole]
  );

  async function switchRole(nextRole: Role) {
    setError(null);

    const response = await fetch("/api/auth/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: nextRole }),
    });

    if (!response.ok) {
      setError("Unable to switch roles right now.");
      return;
    }

    const destination = getDestinationForRole(nextRole, pathname, redirectTo);
    startTransition(() => {
      router.push(destination);
      router.refresh();
    });
  }

  return (
    <section aria-label="Role switcher" className="w-full">
      <div className={compact ? "space-y-2" : "space-y-4"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </span>
          {activeOption && (
            <Badge variant="outline" className="border-slate-300 text-slate-700">
              Active: {activeOption.label}
            </Badge>
          )}
        </div>

        <div className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-3"}>
          {ROLE_OPTIONS.map((option) => (
            <div
              key={option.role}
              className={
                compact
                  ? "contents"
                  : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              }
            >
              {!compact && (
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {option.label}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {option.description}
                  </p>
                </div>
              )}
              <Button
                type="button"
                variant={option.role === currentRole ? "default" : "outline"}
                className={compact ? "min-w-[7rem]" : "w-full"}
                disabled={pending}
                aria-pressed={option.role === currentRole}
                onClick={() => void switchRole(option.role)}
              >
                {compact ? option.shortLabel : `Continue as ${option.label}`}
              </Button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
