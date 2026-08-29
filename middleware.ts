import { NextRequest, NextResponse } from "next/server";

const MANAGE_PASSWORD = process.env.MANAGE_PASSWORD;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page and the auth API route through unconditionally,
  // or every request would redirect-loop trying to reach them.
  if (pathname === "/manage/login" || pathname.startsWith("/api/manage-auth")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("manage_auth")?.value;

  if (!MANAGE_PASSWORD || cookie !== MANAGE_PASSWORD) {
    const loginUrl = new URL("/manage/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*"],
};
