import { NextRequest, NextResponse } from "next/server";
import { getNotes, upsertNote } from "@/lib/db";
import { Category, CATEGORIES, Note } from "@/lib/types";

export const runtime = "nodejs";

function isCategory(v: unknown): v is Category {
  return typeof v === "string" && CATEGORIES.some((c) => c.id === v);
}

export async function GET() {
  const notes = await getNotes();
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { title, body: text, category, weight } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  if (typeof text !== "string") {
    return NextResponse.json({ error: "body required" }, { status: 400 });
  }
  if (!isCategory(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const note: Note = {
    id: crypto.randomUUID(),
    title: title.trim(),
    body: text,
    category,
    weight: typeof weight === "number" && weight > 0 ? weight : 1,
    createdAt: now,
    updatedAt: now,
  };
  await upsertNote(note);
  return NextResponse.json(note, { status: 201 });
}
