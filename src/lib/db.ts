import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_SETTINGS, Note, Settings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getNotes(): Promise<Note[]> {
  return readJson<Note[]>(NOTES_FILE, []);
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await writeJson(NOTES_FILE, notes);
}

export async function getNote(id: string): Promise<Note | undefined> {
  const notes = await getNotes();
  return notes.find((n) => n.id === id);
}

export async function upsertNote(note: Note): Promise<Note> {
  const notes = await getNotes();
  const idx = notes.findIndex((n) => n.id === note.id);
  if (idx === -1) notes.unshift(note);
  else notes[idx] = note;
  await saveNotes(notes);
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await getNotes();
  await saveNotes(notes.filter((n) => n.id !== id));
}

export async function getSettings(): Promise<Settings> {
  const stored = await readJson<Partial<Settings>>(SETTINGS_FILE, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson(SETTINGS_FILE, settings);
}
