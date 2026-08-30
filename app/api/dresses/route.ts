import { NextResponse } from "next/server";
import { dresses } from "@/lib/db";

export async function GET() {
  return NextResponse.json(dresses);
}
