import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import {
  CATEGORIES,
  Category,
  Settings,
  SOURCES,
  SourceId,
} from "@/lib/types";

export const runtime = "nodejs";

function sanitize(body: unknown, current: Settings): Settings {
  if (!body || typeof body !== "object") return current;
  const b = body as Record<string, unknown>;

  const validCats = new Set(CATEGORIES.map((c) => c.id));
  const categories = Array.isArray(b.enabledCategories)
    ? (b.enabledCategories.filter(
        (c): c is Category =>
          typeof c === "string" && validCats.has(c as Category),
      ) as Category[])
    : current.enabledCategories;

  const validSrcs = new Set(SOURCES.map((s) => s.id));
  const sources = Array.isArray(b.enabledSources)
    ? (b.enabledSources.filter(
        (s): s is SourceId =>
          typeof s === "string" && validSrcs.has(s as SourceId),
      ) as SourceId[])
    : current.enabledSources;

  const seed =
    typeof b.shuffleSeed === "number" && Number.isFinite(b.shuffleSeed)
      ? b.shuffleSeed
      : current.shuffleSeed;

  const curatedWeight =
    typeof b.curatedWeight === "number" &&
    Number.isFinite(b.curatedWeight) &&
    b.curatedWeight > 0
      ? b.curatedWeight
      : current.curatedWeight;

  return {
    enabledCategories: categories.length ? categories : current.enabledCategories,
    enabledSources: sources,
    shuffleSeed: seed,
    curatedWeight,
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
