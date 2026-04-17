import { NextResponse } from "next/server";
import { refreshAll } from "@/lib/sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const counts = await refreshAll();
  return NextResponse.json({ ok: true, counts });
}
