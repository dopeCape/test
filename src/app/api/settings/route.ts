import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { CATEGORIES, Category, Settings } from "@/lib/types";

export const runtime = "nodejs";

function sanitize(body: unknown, current: Settings): Settings {
  if (!body || typeof body !== "object") return current;
  const b = body as Record<string, unknown>;
  const validIds = new Set(CATEGORIES.map((c) => c.id));
  const categories = Array.isArray(b.enabledCategories)
    ? (b.enabledCategories.filter(
        (c): c is Category => typeof c === "string" && validIds.has(c as Category),
      ) as Category[])
    : current.enabledCategories;
  const seed =
    typeof b.shuffleSeed === "number" && Number.isFinite(b.shuffleSeed)
      ? b.shuffleSeed
      : current.shuffleSeed;
  return {
    enabledCategories: categories.length ? categories : current.enabledCategories,
    shuffleSeed: seed,
  };
}

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const current = await getSettings();
  const next = sanitize(body, current);
  await saveSettings(next);
  return NextResponse.json(next);
}
