import { NextRequest, NextResponse } from "next/server";
import { isValidRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { role?: string };

    if (!body.role || !isValidRole(body.role)) {
      return NextResponse.json(
        { error: "Invalid role selection" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true, role: body.role });
    response.cookies.set("user-role", body.role, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to switch role" },
      { status: 500 }
    );
  }
}
