import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Interview } from "@/types";

type TableRow = Record<string, string>;

const DATA_MD_PATH = path.join(process.cwd(), "src", "data", "data.md");

function splitMarkdownRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return [];

  // Markdown table rows typically start and end with a pipe.
  // We intentionally keep empty cells as empty strings.
  const parts = trimmed.split("|");
  return parts.slice(1, -1).map((cell) => cell.trim());
}

function parseMarkdownTable(md: string): { headers: string[]; rows: TableRow[] } {
  const lines = md
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length < 3) {
    return { headers: [], rows: [] };
  }

  const headers = splitMarkdownRow(lines[0]);
  const rows: TableRow[] = [];

  for (const line of lines.slice(2)) {
    const cells = splitMarkdownRow(line);
    if (cells.length === 0) continue;

    const row: TableRow = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx] ?? "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

function parseYesNo(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true" || v === "1";
}

function toNullIfEmpty(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function parseList(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  return trimmed
    .split(/\s*(?:,|;|\bor\b|\band\b)\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPublicFilePath(prefix: "/audio/" | "/photos/", value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/")) return trimmed;
  return `${prefix}${trimmed}`;
}

function parseOwnerAge(value: string): number {
  const n = Number.parseInt(value.trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export const getInterviews = cache((): Interview[] => {
  const md = readFileSync(DATA_MD_PATH, "utf-8");
  const { rows } = parseMarkdownTable(md);

  return rows.map((row, index) => {
    const timestamp = row["Timestamp"]?.trim() ?? "";
    const interviewer = row["Interviewer Name"]?.trim() ?? "";
    const dateOfInterview = row["Date of Interview"]?.trim() ?? "";
    const timeOfInterview = row["Time of Interview"]?.trim() ?? "";
    const shopType = row["Shop Type"]?.trim() ?? "";
    const location = row["Location / Area"]?.trim() ?? "";
    const ownerAge = parseOwnerAge(row["Estimated Owner Age"] ?? "");
    const customersPerDay = row["Estimated Customers Per Day"]?.trim() ?? "";
    const busiestTime = row["Busiest Time of Day"]?.trim() ?? "";
    const paymentMethods = parseList(row["Payment Methods Accepted"] ?? "");
    const mobilePaymentTimeline =
      row["When did they start using mobile payments?"]?.trim() ?? "";
    const concernsBeforeStarting =
      row["Concerns mentioned before starting mobile payments"]?.trim() ?? "";
    const currentProblems =
      row["Current problems with mobile payments (if any)"]?.trim() ?? "";

    const customerAskedForHelp = parseYesNo(
      row["Has a customer ever asked for help sending or receiving money?"] ?? ""
    );
    const helpRequestDetails = toNullIfEmpty(
      row["If yes, what exactly did the customer ask?"] ?? ""
    );

    const dollarInquiry = parseYesNo(
      row["Has a customer ever asked about dollars or foreign money?"] ?? ""
    );
    const dollarResponse = toNullIfEmpty(
      row["What did the shopkeeper do the last time this happened?"] ?? ""
    );

    const currencyExchangeReferral = parseList(
      row["Where do they send customers for currency exchange today?"] ?? ""
    );
    const whyReferElsewhere =
      row[
        "Why do they send customers there instead of handling it themselves?"
      ]?.trim() ?? "";

    const fraudStory = parseYesNo(row["Did they mention a real fraud story?"] ?? "");
    const fraudDetails = toNullIfEmpty(row["If yes, describe what happened"] ?? "");
    const moneyLost = toNullIfEmpty(
      row["Approximate money lost (if mentioned)"] ?? ""
    );
    const avoidanceBehaviors = toNullIfEmpty(
      row["What do they actively avoid now because of fraud?"] ?? ""
    );

    const lastNewService = row["Last new service or item they added"]?.trim() ?? "";
    const serviceInfluencer = row["Who influenced that decision?"]?.trim() ?? "";
    const trustFactors =
      row["What makes a new service feel safe to them?"]?.trim() ?? "";

    const exactPhrases = toNullIfEmpty(
      row["Exact phrases they used about money, trust, or fraud"] ?? ""
    );
    const surprisingObservations = toNullIfEmpty(
      row["Anything surprising or strongly emotional?"] ?? ""
    );

    const audioFile = toPublicFilePath(
      "/audio/",
      row["Upload Audio Recording"] ?? ""
    );
    const transcript = row["Upload English Transcript"]?.trim() ?? "";
    const photoFile = toPublicFilePath(
      "/photos/",
      row["Photo of shop for Proof"] ?? ""
    );

    return {
      id: String(index + 1),
      timestamp,
      interviewer,
      dateOfInterview,
      timeOfInterview,
      shopType,
      location,
      ownerAge,
      customersPerDay,
      busiestTime,
      paymentMethods,
      mobilePaymentTimeline,
      concernsBeforeStarting,
      currentProblems,
      customerAskedForHelp,
      helpRequestDetails,
      dollarInquiry,
      dollarResponse,
      currencyExchangeReferral,
      whyReferElsewhere,
      fraudStory,
      fraudDetails,
      moneyLost,
      avoidanceBehaviors,
      lastNewService,
      serviceInfluencer,
      trustFactors,
      exactPhrases,
      surprisingObservations,
      audioFile,
      photoFile,
      transcript,
    };
  });
});

export const getInterviewById = cache((id: string): Interview | undefined => {
  const interviews = getInterviews();
  return interviews.find((i) => i.id === id);
});

