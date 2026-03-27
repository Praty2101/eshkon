/**
 * Role-Based Access Control
 *
 * Roles:
 *   viewer    → preview only
 *   editor    → edit draft
 *   publisher → publish (implies editor access)
 *
 * In production this would integrate with a real auth provider (e.g. NextAuth, Clerk).
 * For this sprint the role comes from a cookie/header for demonstration.
 */

export type Role = "viewer" | "editor" | "publisher";

export const ROLE_OPTIONS: Array<{
  role: Role;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    role: "viewer",
    label: "Viewer",
    shortLabel: "Viewer",
    description: "Preview landing pages only.",
  },
  {
    role: "editor",
    label: "Editor",
    shortLabel: "Editor",
    description: "Edit drafts in the studio.",
  },
  {
    role: "publisher",
    label: "Admin (Publisher)",
    shortLabel: "Admin",
    description: "Edit drafts and publish immutable releases.",
  },
];

export const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  editor: 1,
  publisher: 2,
};

/**
 * Returns true if `userRole` is at least as privileged as `requiredRole`.
 */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Route → minimum role mapping.
 */
export const ROUTE_PERMISSIONS: Record<string, Role> = {
  "/preview": "viewer",
  "/studio": "editor",
  "/api/publish": "publisher",
};

/**
 * Determine the required role for a given pathname.
 * Returns null if no RBAC restriction applies.
 */
export function getRequiredRole(pathname: string): Role | null {
  for (const [route, role] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return role;
    }
  }
  return null;
}

/**
 * Extract user role from request.
 * In production, this would verify a JWT or session.
 * For demo purposes, reads from `x-user-role` header or `user-role` cookie.
 */
export function getUserRole(headers: Headers, cookies?: { get: (name: string) => { value: string } | undefined }): Role {
  const headerRole = headers.get("x-user-role");
  if (headerRole && isValidRole(headerRole)) return headerRole;

  const cookieRole = cookies?.get("user-role")?.value;
  if (cookieRole && isValidRole(cookieRole)) return cookieRole;

  // Default to viewer
  return "viewer";
}

export function isValidRole(value: string): value is Role {
  return value === "viewer" || value === "editor" || value === "publisher";
}
