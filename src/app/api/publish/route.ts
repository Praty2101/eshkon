import { NextRequest, NextResponse } from "next/server";
import { validatePage } from "@/lib/schema";
import { publishPage, getLatestRelease } from "@/lib/publish";
import { getUserRole, hasPermission } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Server-side RBAC enforcement (belt + suspenders with middleware)
  const userRole = getUserRole(request.headers, request.cookies);
  if (!hasPermission(userRole, "publisher")) {
    return NextResponse.json(
      { error: "Forbidden", message: 'Role "publisher" required' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate the page data
    const validation = validatePage(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid page data", issues: validation.errors.issues },
        { status: 400 }
      );
    }

    const page = validation.data;

    // Publish
    const release = await publishPage(page);

    if (!release) {
      // Idempotent: draft identical to latest
      const latest = await getLatestRelease(page.slug);
      return NextResponse.json({
        idempotent: true,
        message: "Draft is identical to the latest release",
        version: latest?.version ?? "1.0.0",
      });
    }

    return NextResponse.json({
      idempotent: false,
      version: release.version,
      changelog: release.changelog,
      publishedAt: release.publishedAt,
    });
  } catch (error) {
    console.error("[Publish API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
