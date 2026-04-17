import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_MAX_AGE_SECONDS,
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const password = form?.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.redirect(new URL("/login?error=missing", req.url), 303);
  }

  let ok = false;
  try {
    ok = verifyPassword(password);
  } catch (e) {
    return NextResponse.redirect(new URL("/login?error=server", req.url), 303);
  }
  if (!ok) {
    return NextResponse.redirect(new URL("/login?error=bad", req.url), 303);
  }

  const next = new URL(req.url).searchParams.get("next") || "/feed";
  const token = createSessionToken();
  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
