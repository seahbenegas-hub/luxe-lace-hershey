import { NextResponse } from "next/server";
import { createToken, verifyToken } from "@/lib/auth";
import type { User } from "@/types";
import { clientKey, rateLimit } from "@/lib/security";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const tokenFromCookie = request.headers.get("cookie")?.match(/(?:^|;\s*)admin_token=([^;]+)/)?.[1] || null;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  if (!rateLimit(`auth:${clientKey(request)}`, 5)) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Authentication is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const isValidAdmin =
    typeof email === "string" &&
    typeof password === "string" &&
    email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD;

  if (!isValidAdmin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user: User = {
    id: "admin",
    email: ADMIN_EMAIL,
    name: "Administrator",
    role: "admin",
  };
  const token = await createToken(user);
  const response = NextResponse.json({ token, user });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
