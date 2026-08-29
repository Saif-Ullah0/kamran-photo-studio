import { NextRequest, NextResponse } from "next/server";

// Not prefixed with NEXT_PUBLIC_ — this stays server-only and is never
// bundled into client-side JavaScript. Set it in .env.local for local dev
// and in Vercel's Project Settings -> Environment Variables for production.
const MANAGE_PASSWORD = process.env.MANAGE_PASSWORD;

export async function POST(request: NextRequest) {
  if (!MANAGE_PASSWORD) {
    return NextResponse.json(
      { error: "MANAGE_PASSWORD is not set on the server." },
      { status: 500 }
    );
  }

  const { password } = await request.json();

  if (password !== MANAGE_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("manage_auth", MANAGE_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("manage_auth");
  return response;
}