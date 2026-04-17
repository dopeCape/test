import { NextRequest, NextResponse } from "next/server";
import { deleteNote, getNote, upsertNote } from "@/lib/db";
import { Category, CATEGORIES } from "@/lib/types";

export const runtime = "nodejs";

function isCategory(v: unknown): v is Category {
  return typeof v === "string" && CATEGORIES.some((c) => c.id === v);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const existing = await getNote(params.id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const patch = body as Record<string, unknown>;
  const updated = {
    ...existing,
    title:
      typeof patch.title === "string" && patch.title.trim()
        ? patch.title.trim()
        : existing.title,
    body: typeof patch.body === "string" ? patch.body : existing.body,
    category: isCategory(patch.category) ? patch.category : existing.category,
    weight:
      typeof patch.weight === "number" && patch.weight > 0
        ? patch.weight
        : existing.weight,
    updatedAt: new Date().toISOString(),
  };
  await upsertNote(updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await deleteNote(params.id);
  return NextResponse.json({ ok: true });
}
