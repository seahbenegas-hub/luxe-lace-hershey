import { NextResponse } from "next/server";
import { users } from "@/lib/db";
import { createToken } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rentaldress.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find((u) => u.email === email);

  const isValidAdmin =
    typeof email === "string" &&
    typeof password === "string" &&
    email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD;

  if (!isValidAdmin || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken(user);
  return NextResponse.json({ token, user });
}
