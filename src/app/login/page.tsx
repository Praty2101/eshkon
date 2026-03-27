import { cookies, headers } from "next/headers";
import { getUserRole } from "@/lib/auth";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";

export default async function LoginPage() {
  const currentRole = getUserRole(await headers(), await cookies());

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50 px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
          Role Login
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Choose how you want to experience Page Studio
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-700">
          This demo uses role-based access instead of a full identity provider.
          Pick a role below to switch into viewer, editor, or admin-level
          publishing access.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <RoleSwitcher
            currentRole={currentRole}
            title="Login as"
          />
        </div>
      </div>
    </main>
  );
}
