import "server-only";

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface TranscriptDocument {
  id: string;
  fileName: string;
  text: string;
}

const TRANSCRIPTS_DIR = path.join(process.cwd(), "transcripts");

function safeReadUtf8(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function stableIdFromFileName(fileName: string): string {
  const base = fileName.replace(/\.txt$/i, "");
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const getTranscriptDocuments = cache((): TranscriptDocument[] => {
  const files = readdirSync(TRANSCRIPTS_DIR, { withFileTypes: true })
    .filter((ent) => ent.isFile())
    .map((ent) => ent.name)
    .filter((name) => name.toLowerCase().endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b));

  return files
    .map((fileName) => {
      const text = safeReadUtf8(path.join(TRANSCRIPTS_DIR, fileName)).trim();
      return {
        id: stableIdFromFileName(fileName),
        fileName,
        text,
      };
    })
    .filter((doc) => doc.text.length > 0);
});

