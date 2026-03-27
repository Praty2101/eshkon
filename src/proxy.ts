import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserRole, getRequiredRole, hasPermission } from "@/lib/auth/rbac";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) {
    return NextResponse.next();
  }

  const userRole = getUserRole(request.headers, request.cookies);

  if (!hasPermission(userRole, requiredRole)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden", message: `Role "${requiredRole}" required` },
        { status: 403 }
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = "/forbidden";
    url.searchParams.set("required", requiredRole);
    url.searchParams.set("current", userRole);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("x-user-role", userRole);
  return response;
}

export const config = {
  matcher: ["/studio/:path*", "/preview/:path*", "/api/publish/:path*"],
};
