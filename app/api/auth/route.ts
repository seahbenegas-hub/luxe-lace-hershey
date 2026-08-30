import { NextResponse } from "next/server";
import { users } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find((u) => u.email === email);

  if (!user || password !== "admin123") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken(user);
  return NextResponse.json({ token, user });
}
