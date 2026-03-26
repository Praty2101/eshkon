import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserRole, getRequiredRole, hasPermission } from "@/lib/auth/rbac";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine if this route needs protection
  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) {
    return NextResponse.next();
  }

  // Extract user role
  const userRole = getUserRole(request.headers, request.cookies);

  // Check permission
  if (!hasPermission(userRole, requiredRole)) {
    // For API routes, return 403
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden", message: `Role "${requiredRole}" required` },
        { status: 403 }
      );
    }

    // For page routes, redirect to preview or show forbidden
    const url = request.nextUrl.clone();
    url.pathname = "/forbidden";
    url.searchParams.set("required", requiredRole);
    url.searchParams.set("current", userRole);
    return NextResponse.redirect(url);
  }

  // Attach role to headers for downstream use
  const response = NextResponse.next();
  response.headers.set("x-user-role", userRole);
  return response;
}

export const config = {
  matcher: ["/studio/:path*", "/preview/:path*", "/api/publish/:path*"],
};
