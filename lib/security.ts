import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;

export function rateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function isAdmin(request: Request): Promise<boolean> {
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)admin_token=([^;]+)/)?.[1] || "";
  const user = await verifyToken(bearer || cookie);
  return user?.role === "admin";
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
