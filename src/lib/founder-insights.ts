import "server-only";

import { cache } from "react";

import type {
  Actionability,
  BarDatum,
  ConfidenceLevel,
  EnhancedPilotCandidate,
  EvidenceQuote,
  FounderDashboardData,
  FounderTheme,
  FunnelStage,
  ReadinessSegment,
  SegmentSummary,
  TrustConcernLevel,
  ValidationDimension,
  ValidationScorecard,
  ValidationSignal,
  ValidationVerdict,
  WillingnessFactor,
} from "@/types";
import { getInterviews } from "@/lib/interviews";
import { getTranscriptDocuments, type TranscriptDocument } from "@/lib/transcripts";

const STOPWORDS = new Set(
  [
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "it",
    "this",
    "that",
    "we",
    "i",
    "you",
    "they",
    "he",
    "she",
    "our",
    "their",
    "your",
    "my",
    "yes",
    "no",
    "okay",
    "alhamdulillah",
    "mashallah",
  ].map((w) => w.toLowerCase())
);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function tokenizeForMatch(text: string): string[] {
  const raw = normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");

  const tokens = raw
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 3)
    .filter((t) => !STOPWORDS.has(t))
    .filter((t) => !/^\d+$/.test(t));

  return tokens;
}

function jaccardSimilarity(aTokens: string[], bTokens: string[]): number {
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  let intersection = 0;
  for (const t of aSet) {
    if (bSet.has(t)) intersection += 1;
  }
  const union = aSet.size + bSet.size - intersection;
  return union <= 0 ? 0 : intersection / union;
}

function buildSourceLabel(interview: {
  id: string;
  shopType: string;
  location: string;
}): string {
  const shopType = interview.shopType.trim() || "Unknown shop";
  const location = interview.location.trim() || "Unknown location";
  return `Interview #${interview.id} • ${shopType} • ${location}`;
}

function normalizePaymentMethod(method: string): string {
  const v = method.trim().toLowerCase();
  if (!v) return "Unknown";
  if (v.includes("cash")) return "Cash";
  if (v.includes("easypaisa")) return "EasyPaisa";
  if (v.includes("jazzcash")) return "JazzCash";
  if (v.includes("bank")) return "Bank transfer";
  if (v.includes("raast")) return "Raast";
  if (v.includes("sadapay")) return "SadaPay";
  if (v.includes("nayapay")) return "NayaPay";
  if (v.includes("dpay")) return "DPay";
  if (v.includes("card")) return "Card";
  if (v.includes("other")) return "Other";
  return normalizeWhitespace(method);
}

function normalizeShopType(shopType: string): string {
  const v = normalizeWhitespace(shopType).toLowerCase();
  if (!v) return "Unknown";
  if (v === "general sore") return "General store";
  if (v === "boutique shop") return "Boutique";
  return shopType.trim();
}

function normalizeReferralDestination(value: string): string {
  const v = value.trim().toLowerCase();
  if (!v) return "";
  if (v.includes("western union")) return "Western Union";
  if (v.includes("money changer")) return "Money changer";
  if (v.includes("exchange")) return "Money changer";
  if (v.includes("bank")) return "Bank";
  if (v.includes("friend")) return "Friend";
  if (v.includes("agent")) return "Agent";
  if (v.includes("do not know") || v.includes("don't know")) return "Don't know";
  if (v === "other") return "Other";
  return normalizeWhitespace(value);
}

function extractRespondentLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) =>
      /^(shopkeeper|shop owner|pharmacist|owner)\s*:/i.test(l)
    );
}

function respondentOnlyText(text: string): string {
  const lines = extractRespondentLines(text);
  return lines.length > 0 ? lines.join("\n") : text;
}

function extractReferralDestinationsFromTranscript(text: string): string[] {
  const t = respondentOnlyText(text).toLowerCase();
  const destinations = new Set<string>();

  const addIf = (cond: boolean, label: string) => {
    if (cond) destinations.add(label);
  };

  addIf(/western\s+union/.test(t), "Western Union");
  addIf(/money\s+changer/.test(t), "Money changer");
  addIf(/currency\s+exchange|exchange\s+money|exchange\s+shop|local\s+exchange/.test(t), "Money changer");
  addIf(/\bbank(s)?\b/.test(t), "Bank");
  addIf(/\bfriend\b/.test(t), "Friend");
  addIf(/\bagent\b/.test(t), "Agent");
  addIf(/do not know|don't know/.test(t), "Don't know");

  return [...destinations];
}

function bucketWhyNotHandleFx(text: string): string {
  const t = text.toLowerCase();
  if (!t.trim()) return "Unknown";
  if (/lack of knowledge|no idea|don't have any idea|do not know|not aware|guidelines/.test(t)) {
    return "Knowledge gap";
  }
  if (/fraud|scam|fear|trust|risk|security/.test(t)) {
    return "Fraud & trust";
  }
  if (/legal|government|police|approval|license|allowed/.test(t)) {
    return "Legal & compliance";
  }
  if (/cash|balance|capital|liquidity|float/.test(t)) {
    return "Liquidity & float";
  }
  if (/busy|time|manage|process/.test(t)) {
    return "Operational overhead";
  }
  return "Other";
}

function fraudPatternBucketsFromText(text: string): string[] {
  const t = text.toLowerCase();
  const buckets = new Set<string>();
  if (/revers|disappear|vanish|time limit/.test(t)) buckets.add("Reversal / clawback");
  if (/screenshot|show(ed)? .*payment|proof/.test(t)) buckets.add("Fake proof / screenshots");
  if (/message.*late|sms.*late|delayed/.test(t)) buckets.add("Delayed confirmation");
  if (/network|service.*not work/.test(t)) buckets.add("Network reliability");
  if (/biometric/.test(t)) buckets.add("Biometric / KYC friction");
  if (/raast/.test(t)) buckets.add("Raast issues");
  if (/fraud|scam/.test(t)) buckets.add("General fraud fear");
  return [...buckets];
}

function extractThemeLines(text: string, theme: FounderTheme): string[] {
  const lines = respondentOnlyText(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => l.length >= 12);

  const matchers: Record<FounderTheme, RegExp> = {
    fx_demand: /\b(dollar|usd|foreign money|foreign currency|currency exchange|exchange)\b/i,
    fx_referral: /\b(western union|money changer|exchange shop|bank)\b/i,
    customer_support: /\b(help|transfer|send|receive)\b/i,
    fraud: /\b(fraud|scam|cheat|revers|screenshot|message)\b/i,
    trust: /\b(trust|safe|secure|sure|fear)\b/i,
    compliance: /\b(legal|government|approval|license|allowed|police)\b/i,
    payments: /\b(easypaisa|jazzcash|bank transfer|raast|sadapay|nayapay|card)\b/i,
  };

  const re = matchers[theme];
  const hits = lines.filter((l) => re.test(l));

  // Keep the UI scannable: cap per theme.
  return hits.slice(0, 3).map((l) => (l.length > 260 ? `${l.slice(0, 257)}…` : l));
}

function matchTranscriptsToInterviews(
  transcripts: TranscriptDocument[],
  interviews: ReturnType<typeof getInterviews>
): Map<string, TranscriptDocument> {
  const pairs: { interviewId: string; transcript: TranscriptDocument; score: number }[] =
    [];

  const interviewTokens = new Map<string, string[]>();
  for (const i of interviews) {
    interviewTokens.set(i.id, tokenizeForMatch(i.transcript));
  }

  const transcriptTokens = transcripts.map((t) => tokenizeForMatch(t.text));

  transcripts.forEach((t, idx) => {
    for (const i of interviews) {
      const score = jaccardSimilarity(interviewTokens.get(i.id) ?? [], transcriptTokens[idx]);
      pairs.push({ interviewId: i.id, transcript: t, score });
    }
  });

  pairs.sort((a, b) => b.score - a.score);

  const assignedInterviews = new Set<string>();
  const assignedTranscripts = new Set<string>();
  const result = new Map<string, TranscriptDocument>();

  for (const pair of pairs) {
    if (assignedInterviews.has(pair.interviewId)) continue;
    if (assignedTranscripts.has(pair.transcript.id)) continue;
    // A tiny guard: avoid very weak matches.
    if (pair.score < 0.02) continue;
    assignedInterviews.add(pair.interviewId);
    assignedTranscripts.add(pair.transcript.id);
    result.set(pair.interviewId, pair.transcript);
  }

  return result;
}

function toBarData(counts: Map<string, number>, color?: string): BarDatum[] {
  return [...counts.entries()]
    .map(([name, value]) => ({ name, value, color }))
    .sort((a, b) => b.value - a.value);
}

// ============================================================================
// Currency Utilities (USD ↔ PKR)
// ============================================================================

const PKR_TO_USD_RATE = 280; // Approximate exchange rate

export function formatDualCurrency(pkr: number): string {
  if (pkr === 0 || pkr === undefined || pkr === null) return "0 PKR";
  const usd = Math.round(pkr / PKR_TO_USD_RATE);
  const formattedPkr = pkr.toLocaleString();
  return `~$${usd} USD (${formattedPkr} PKR)`;
}

export function formatPkr(pkr: number): string {
  return `${pkr.toLocaleString()} PKR`;
}

export function formatUsd(pkr: number): string {
  const usd = Math.round(pkr / PKR_TO_USD_RATE);
  return `~$${usd} USD`;
}

// ============================================================================
// Validation Scorecard Computation
// ============================================================================

function scoreToSignal(score: number): ValidationSignal {
  if (score >= 70) return "strong";
  if (score >= 45) return "moderate";
  if (score >= 20) return "weak";
  return "absent";
}

function computeVerdict(avgScore: number, problemScore: number): ValidationVerdict {
  if (avgScore >= 65 && problemScore >= 60) return "persevere";
  if (avgScore >= 45) return "investigate";
  if (problemScore < 30) return "kill";
  return "pivot";
}

function computeConfidence(sampleSize: number): ConfidenceLevel {
  if (sampleSize >= 15) return "high";
  if (sampleSize >= 10) return "medium";
  return "low";
}

export function computeValidationScorecard(
  total: number,
  fxInquiryCount: number,
  segments: SegmentSummary[],
  whyNotHandleFxBuckets: BarDatum[],
  fraudStoryCount: number,
  pilotCandidateCount: number
): ValidationScorecard {
  // 1. Problem Score: Do customers ask for FX?
  const problemScore = total > 0 ? Math.round((fxInquiryCount / total) * 100) : 0;

  // 2. Willingness Score: Ready + Promising segments
  const readyCount = segments
    .filter(s => s.segment === "ready_now" || s.segment === "promising_but_cautious")
    .reduce((sum, s) => sum + s.count, 0);
  const willingnessScore = total > 0 ? Math.round((readyCount / total) * 100) : 0;

  // 3. Friction Solvability: Knowledge gap (solvable) vs Legal (hard)
  const knowledgeGap = whyNotHandleFxBuckets.find(b => b.name === "Knowledge gap")?.value ?? 0;
  const legalBlock = whyNotHandleFxBuckets.find(b => b.name === "Legal & compliance")?.value ?? 0;
  const frictionScore = total > 0
    ? Math.round(Math.max(0, Math.min(100, ((knowledgeGap - legalBlock) / total + 0.5) * 100)))
    : 50;

  // 4. Trust Buildable: Inverse of fraud story rate
  const trustScore = total > 0 ? Math.round(((total - fraudStoryCount) / total) * 100) : 50;

  // 5. Pilot Availability: Target is 3+ candidates
  const pilotScore = Math.min(100, Math.round((pilotCandidateCount / 3) * 100));

  const avgScore = (problemScore + willingnessScore + frictionScore + trustScore + pilotScore) / 5;
  const verdict = computeVerdict(avgScore, problemScore);

  const verdictRationales: Record<ValidationVerdict, string> = {
    persevere: "Strong demand signal with actionable path to pilots. Proceed with experiments.",
    investigate: "Mixed signals. Run targeted experiments to validate specific hypotheses.",
    pivot: "Demand exists but execution barriers are significant. Explore alternative models.",
    kill: "Insufficient demand signal. Consider adjacent opportunities.",
  };

  const dimensions: ValidationDimension[] = [
    {
      id: "problem",
      name: "Problem Exists",
      score: problemScore,
      signal: scoreToSignal(problemScore),
      summary: `${fxInquiryCount}/${total} (${problemScore}%) interviews show FX demand`,
      evidenceIds: [],
    },
    {
      id: "willingness",
      name: "Willingness to Act",
      score: willingnessScore,
      signal: scoreToSignal(willingnessScore),
      summary: `${readyCount}/${total} (${willingnessScore}%) in ready/promising segments`,
      evidenceIds: [],
    },
    {
      id: "friction",
      name: "Friction Solvability",
      score: frictionScore,
      signal: scoreToSignal(frictionScore),
      summary: `Primary blocker is "${knowledgeGap > legalBlock ? "knowledge gap" : "legal concerns"}" (addressable)`,
      evidenceIds: [],
    },
    {
      id: "trust",
      name: "Trust Buildable",
      score: trustScore,
      signal: scoreToSignal(trustScore),
      summary: `${total - fraudStoryCount}/${total} (${trustScore}%) have no fraud stories`,
      evidenceIds: [],
    },
    {
      id: "pilots",
      name: "Pilot Availability",
      score: pilotScore,
      signal: scoreToSignal(pilotScore),
      summary: `${pilotCandidateCount} candidates identified (target: 3+)`,
      evidenceIds: [],
    },
  ];

  return {
    overallVerdict: verdict,
    verdictRationale: verdictRationales[verdict],
    confidenceLevel: computeConfidence(total),
    dimensions,
    lastUpdated: new Date().toISOString(),
  };
}

function segmentColor(segment: ReadinessSegment): string {
  switch (segment) {
    case "ready_now":
      return "var(--status-success)";
    case "promising_but_cautious":
      return "var(--status-warning)";
    case "digital_no_fx_yet":
      return "var(--accent-terra)";
    case "cash_first":
      return "var(--accent-slate)";
  }
}

function segmentLabel(segment: ReadinessSegment): string {
  switch (segment) {
    case "ready_now":
      return "Ready now";
    case "promising_but_cautious":
      return "Promising, but cautious";
    case "digital_no_fx_yet":
      return "Digital, no FX yet";
    case "cash_first":
      return "Cash-first";
  }
}

function segmentDescription(segment: ReadinessSegment): string {
  switch (segment) {
    case "ready_now":
      return "Already helps customers and shows FX demand; best for first pilots.";
    case "promising_but_cautious":
      return "Shows demand, but trust/fraud concerns likely block activation.";
    case "digital_no_fx_yet":
      return "Accepts digital payments, but hasn’t seen FX demand (or didn’t mention it).";
    case "cash_first":
      return "Prefers cash or avoids digital due to trust or reliability concerns.";
  }
}

function determineSegment(params: {
  demand: boolean;
  helps: boolean;
  digitalCount: number;
  fraudConcern: boolean;
}): ReadinessSegment {
  const { demand, helps, digitalCount, fraudConcern } = params;

  if (demand && helps && digitalCount >= 2) return "ready_now";
  if (demand && (helps || digitalCount >= 1)) return "promising_but_cautious";
  if (!demand && digitalCount >= 2) return "digital_no_fx_yet";
  if (fraudConcern && digitalCount <= 1) return "cash_first";
  return "cash_first";
}

export const getFounderDashboardData = cache((): FounderDashboardData => {
  const interviews = getInterviews();
  const transcripts = getTranscriptDocuments();
  const transcriptByInterviewId = matchTranscriptsToInterviews(transcripts, interviews);

  const total = interviews.length;

  const fxInquiryCount = interviews.filter((i) => i.dollarInquiry).length;
  const helpRequestCount = interviews.filter((i) => i.customerAskedForHelp).length;
  const fraudStoryCount = interviews.filter((i) => i.fraudStory).length;

  const busiestCounts = new Map<string, number>();
  const paymentCounts = new Map<string, number>();
  const referralCounts = new Map<string, number>();
  const whyBuckets = new Map<string, number>();
  const fraudBuckets = new Map<string, number>();
  const segmentCounts = new Map<ReadinessSegment, number>();

  const evidenceQuotes: EvidenceQuote[] = [];
  const pilotCandidates: { interviewId: string; label: string; reason: string }[] =
    [];
  const dataQualityNotes: string[] = [];
  const shopTypeVariants = new Map<string, Set<string>>();

  for (const interview of interviews) {
    const transcript = transcriptByInterviewId.get(interview.id);
    const respondentTranscriptText = transcript ? respondentOnlyText(transcript.text) : "";

    // Busiest time
    const busyKey = interview.busiestTime.trim() || "Unknown";
    busiestCounts.set(busyKey, (busiestCounts.get(busyKey) ?? 0) + 1);

    // Payment methods
    for (const m of interview.paymentMethods) {
      const normalized = normalizePaymentMethod(m);
      paymentCounts.set(normalized, (paymentCounts.get(normalized) ?? 0) + 1);
    }

    // Shop type normalization quality
    const normalizedShopType = normalizeShopType(interview.shopType);
    const rawShopType = interview.shopType.trim() || "Unknown";
    if (!shopTypeVariants.has(normalizedShopType)) {
      shopTypeVariants.set(normalizedShopType, new Set());
    }
    shopTypeVariants.get(normalizedShopType)?.add(rawShopType);

    // FX referral destinations: structured + transcript extraction
    const structuredRefs = interview.currencyExchangeReferral
      .map(normalizeReferralDestination)
      .filter(Boolean);
    const transcriptRefs = transcript
      ? extractReferralDestinationsFromTranscript(transcript.text)
      : [];
    for (const dest of [...structuredRefs, ...transcriptRefs]) {
      referralCounts.set(dest, (referralCounts.get(dest) ?? 0) + 1);
    }

    // Why not handle FX
    const whyRaw =
      interview.whyReferElsewhere?.trim() ||
      (transcript?.text ?? "");
    const whyBucket = bucketWhyNotHandleFx(whyRaw);
    whyBuckets.set(whyBucket, (whyBuckets.get(whyBucket) ?? 0) + 1);

    // Fraud patterns
    const fraudText = [
      interview.concernsBeforeStarting,
      interview.currentProblems,
      interview.fraudDetails ?? "",
      respondentTranscriptText,
    ]
      .filter(Boolean)
      .join("\n");

    for (const bucket of fraudPatternBucketsFromText(fraudText)) {
      fraudBuckets.set(bucket, (fraudBuckets.get(bucket) ?? 0) + 1);
    }

    // Segment
    const digitalCount =
      interview.paymentMethods
        .map(normalizePaymentMethod)
        .filter((m) => m !== "Cash" && m !== "Unknown").length ?? 0;
    const fraudConcern = /fraud|scam|fear|trust|risk|security/i.test(
      `${interview.concernsBeforeStarting}\n${interview.currentProblems}\n${respondentTranscriptText}`
    );
    const demand =
      interview.dollarInquiry ||
      /\b(dollar|usd|foreign money|foreign currency|currency exchange)\b/i.test(
        respondentTranscriptText
      );
    const helps =
      interview.customerAskedForHelp ||
      /\b(help|transfer|send|receive)\b/i.test(respondentTranscriptText);

    const segment = determineSegment({
      demand,
      helps,
      digitalCount,
      fraudConcern,
    });
    segmentCounts.set(segment, (segmentCounts.get(segment) ?? 0) + 1);

    if (segment === "ready_now" || segment === "promising_but_cautious") {
      const labelParts = [
        interview.shopType?.trim() || "Unknown shop",
        interview.location?.trim() || "Unknown location",
      ];

      const reasons: string[] = [];
      if (demand) reasons.push("FX demand signal");
      if (helps) reasons.push("already helps customers");
      if (digitalCount >= 2) reasons.push("multiple digital rails");
      if (fraudConcern) reasons.push("needs trust controls");
      if (interview.currencyExchangeReferral.length > 0) reasons.push("actively refers today");

      pilotCandidates.push({
        interviewId: interview.id,
        label: labelParts.join(" • "),
        reason: reasons.slice(0, 3).join(", "),
      });
    }

    // Evidence quotes (theme lines)
    const sourceLabel = buildSourceLabel(interview);
    const transcriptFileName = transcript?.fileName;
    const transcriptText = transcript ? respondentOnlyText(transcript.text) : interview.transcript;

    const themes: FounderTheme[] = [
      "fx_demand",
      "fx_referral",
      "fraud",
      "trust",
      "customer_support",
      "compliance",
      "payments",
    ];
    for (const theme of themes) {
      for (const line of extractThemeLines(transcriptText, theme)) {
        evidenceQuotes.push({
          theme,
          quote: line,
          sourceLabel,
          interviewId: interview.id,
          transcriptFileName,
        });
      }
    }

    if (/cash only/i.test(interview.paymentMethods.join(", ")) && interview.paymentMethods.length > 1) {
      dataQualityNotes.push(
        `Interview #${interview.id}: “Cash only” appears alongside other payment methods; consider normalizing this field.`
      );
    }
  }

  for (const [normalized, variants] of shopTypeVariants.entries()) {
    if (variants.size >= 2) {
      dataQualityNotes.push(
        `Shop type normalization: multiple variants map to “${normalized}” (${[
          ...variants,
        ].join(", ")}).`
      );
    }
  }

  const segments: SegmentSummary[] = ([
    "ready_now",
    "promising_but_cautious",
    "digital_no_fx_yet",
    "cash_first",
  ] as ReadinessSegment[]).map((segment) => {
    const count = segmentCounts.get(segment) ?? 0;
    const share = total > 0 ? count / total : 0;
    return {
      segment,
      label: segmentLabel(segment),
      count,
      share,
      description: segmentDescription(segment),
      color: segmentColor(segment),
    };
  });

  const fxTop = [...referralCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const whyTop = [...whyBuckets.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const fraudTop = [...fraudBuckets.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  const topOpportunities = [
    `FX questions show up in ${fxInquiryCount}/${total} interviews; merchants currently route customers to ${fxTop ?? "existing money changers"}.`,
    `${whyTop ?? "Knowledge gaps"} is the most common reason merchants don’t handle FX today.`,
    `High overlap between “helping customers transfer” and FX demand suggests a merchant-assisted flow could work.`,
  ];

  const keyRisks = [
    `Fraud is a recurring narrative (${fraudStoryCount}/${total} reported a real incident; top pattern: ${fraudTop ?? "general fraud fear"}).`,
    `Operational reliability issues (network delays, confirmations) can create loss events and distrust.`,
    `Compliance ambiguity (“government/legal”) appears as a blocker; pilots need a clear policy + merchant script.`,
  ];

  const recommendedExperiments = [
    {
      title: "Pilot: merchant-assisted FX handoff (referral → conversion)",
      successMetric: "Referral-to-completion rate for FX requests; time-to-complete; merchant NPS.",
      whyNow: "Merchants already refer customers; product can capture this demand and reduce leakage.",
    },
    {
      title: "Anti-fraud kit: proof-of-payment + reversal protection",
      successMetric: "Reduction in “fake proof / delayed confirmation” complaints; measured trust lift in follow-ups.",
      whyNow: "Trust is the primary barrier; solving it unlocks both payments and FX flows.",
    },
    {
      title: "Enable ‘help customers’ as a feature (guided steps + receipts)",
      successMetric: "Share of merchants willing to assist; completion time; error rate; support contact rate.",
      whyNow: "Help requests are already happening informally; formalizing reduces friction and risk.",
    },
  ];

  // De-dup evidence quotes for UI.
  const seenQuote = new Set<string>();
  const dedupedQuotes = evidenceQuotes.filter((q) => {
    const key = `${q.theme}::${q.sourceLabel}::${q.quote}`;
    if (seenQuote.has(key)) return false;
    seenQuote.add(key);
    return true;
  });

  return {
    totalInterviews: total,
    fxInquiryCount,
    helpRequestCount,
    fraudStoryCount,
    busyTimeDistribution: toBarData(busiestCounts),
    paymentMethodMentions: toBarData(paymentCounts),
    fxReferralDestinations: toBarData(referralCounts),
    whyNotHandleFxBuckets: toBarData(whyBuckets),
    fraudPatternBuckets: toBarData(fraudBuckets),
    segments,
    topOpportunities,
    keyRisks,
    recommendedExperiments,
    pilotCandidates: pilotCandidates.slice(0, 8),
    evidenceQuotes: dedupedQuotes,
    dataQualityNotes,
  };
});

// ============================================================================
// Conversion Funnel Computation
// ============================================================================

export function computeConversionFunnel(
  interviews: Array<{
    id: string;
    dollarInquiry: boolean;
    customerAskedForHelp: boolean;
    fraudStory: boolean;
    paymentMethods: string[];
  }>
): FunnelStage[] {
  const total = interviews.length;

  // Stage 1: All interviews
  const allIds = interviews.map(i => i.id);

  // Stage 2: Has digital payments (not just cash)
  const digitalActive = interviews.filter(i => {
    const methods = i.paymentMethods.map(m => m.toLowerCase());
    return methods.some(m =>
      m.includes("easypaisa") ||
      m.includes("jazzcash") ||
      m.includes("bank") ||
      m.includes("sadapay") ||
      m.includes("nayapay") ||
      m.includes("raast")
    );
  });
  const digitalIds = digitalActive.map(i => i.id);

  // Stage 3: Has FX demand signal
  const fxDemand = digitalActive.filter(i => i.dollarInquiry);
  const fxDemandIds = fxDemand.map(i => i.id);

  // Stage 4: Willing to help (helps customers today)
  const willing = fxDemand.filter(i => i.customerAskedForHelp);
  const willingIds = willing.map(i => i.id);

  // Stage 5: Pilot ready (no fraud concerns blocking)
  const pilotReady = willing.filter(i => !i.fraudStory);
  const pilotReadyIds = pilotReady.map(i => i.id);

  return [
    {
      name: "All Interviews",
      count: total,
      percentage: 100,
      interviewIds: allIds,
    },
    {
      name: "Digital Active",
      count: digitalActive.length,
      percentage: total > 0 ? Math.round((digitalActive.length / total) * 100) : 0,
      interviewIds: digitalIds,
      dropOffReason: "Cash-only or no digital payments",
    },
    {
      name: "FX Demand",
      count: fxDemand.length,
      percentage: total > 0 ? Math.round((fxDemand.length / total) * 100) : 0,
      interviewIds: fxDemandIds,
      dropOffReason: "No customer inquiries about foreign currency",
    },
    {
      name: "Willing to Help",
      count: willing.length,
      percentage: total > 0 ? Math.round((willing.length / total) * 100) : 0,
      interviewIds: willingIds,
      dropOffReason: "Not actively helping customers with transfers",
    },
    {
      name: "Pilot Ready",
      count: pilotReady.length,
      percentage: total > 0 ? Math.round((pilotReady.length / total) * 100) : 0,
      interviewIds: pilotReadyIds,
      dropOffReason: "Fraud concerns or trust barriers",
    },
  ];
}

// ============================================================================
// Willingness Factors Extraction
// ============================================================================

interface InterviewForWillingness {
  id: string;
  trustFactors: string;
  transcript: string;
}

export function extractWillingnessFactors(
  interviews: InterviewForWillingness[]
): WillingnessFactor[] {
  const factorPatterns: Array<{
    factor: string;
    patterns: RegExp[];
    actionability: Actionability;
    suggestedAction: string;
  }> = [
    {
      factor: "Government approval",
      patterns: [/government/i, /approval/i, /legal/i, /authorized/i, /official/i],
      actionability: "high",
      suggestedAction: "Create official-looking documentation, certificates, or partnership announcements",
    },
    {
      factor: "Social proof",
      patterns: [/seeing others/i, /other shops/i, /everyone/i, /many people/i, /popular/i],
      actionability: "high",
      suggestedAction: "Showcase early adopters, create referral program, share success stories",
    },
    {
      factor: "Established reputation",
      patterns: [/long time/i, /established/i, /reputation/i, /trusted brand/i, /years in/i],
      actionability: "medium",
      suggestedAction: "Highlight company background, team credentials, investor backing",
    },
    {
      factor: "Clear process",
      patterns: [/clear rules/i, /process/i, /simple/i, /easy to use/i, /straightforward/i],
      actionability: "high",
      suggestedAction: "Create step-by-step guides, training materials, visual workflows",
    },
    {
      factor: "Personal recommendation",
      patterns: [/recommendation/i, /friend/i, /trusted person/i, /someone i know/i, /referred/i],
      actionability: "medium",
      suggestedAction: "Build referral incentives, partner with community leaders",
    },
  ];

  const factorResults = new Map<string, { count: number; ids: Set<string> }>();

  for (const pattern of factorPatterns) {
    factorResults.set(pattern.factor, { count: 0, ids: new Set() });
  }

  for (const interview of interviews) {
    const searchText = `${interview.trustFactors} ${interview.transcript}`.toLowerCase();

    for (const pattern of factorPatterns) {
      const matchesAny = pattern.patterns.some(p => p.test(searchText));
      if (matchesAny) {
        const result = factorResults.get(pattern.factor)!;
        result.count++;
        result.ids.add(interview.id);
      }
    }
  }

  return factorPatterns
    .map(pattern => {
      const result = factorResults.get(pattern.factor)!;
      return {
        factor: pattern.factor,
        mentionCount: result.count,
        interviewIds: [...result.ids],
        actionability: pattern.actionability,
        suggestedAction: pattern.suggestedAction,
      };
    })
    .filter(f => f.mentionCount > 0)
    .sort((a, b) => b.mentionCount - a.mentionCount);
}

// ============================================================================
// Enhanced Pilot Candidate Scoring
// ============================================================================

function determineTrustConcernLevel(
  fraudStory: boolean,
  concernsText: string
): TrustConcernLevel {
  if (fraudStory) return "high";
  if (/fraud|scam|fear|trust|risk|security/i.test(concernsText)) return "medium";
  return "low";
}

function generateApproachScript(candidate: {
  hasFxDemand: boolean;
  helpsCustomers: boolean;
  trustConcernLevel: TrustConcernLevel;
  currentlyRefers: boolean;
}): string {
  const scripts: string[] = [];

  if (candidate.hasFxDemand) {
    scripts.push("Lead with: 'We noticed your customers ask about foreign currency...'");
  }

  if (candidate.helpsCustomers) {
    scripts.push("Acknowledge: 'You already help customers with transfers - this builds on that.'");
  }

  if (candidate.trustConcernLevel === "high") {
    scripts.push("Address trust: 'We provide proof-of-payment receipts and reversal protection.'");
  }

  if (candidate.currentlyRefers) {
    scripts.push("Opportunity: 'Instead of referring to Western Union, you could earn commission.'");
  }

  return scripts.length > 0 ? scripts.join(" ") : "Standard pitch: introduce ZAR and its benefits.";
}

function generateRiskMitigation(
  trustConcernLevel: TrustConcernLevel,
  fraudStory: boolean
): string {
  const mitigations: string[] = [];

  if (fraudStory) {
    mitigations.push("Show anti-fraud features: receipt generation, transaction limits, customer verification.");
  }

  if (trustConcernLevel === "high") {
    mitigations.push("Offer pilot protection: guarantee against losses during trial period.");
  } else if (trustConcernLevel === "medium") {
    mitigations.push("Provide training on recognizing fraud patterns and using safety features.");
  }

  if (mitigations.length === 0) {
    mitigations.push("Low risk profile - standard onboarding should suffice.");
  }

  return mitigations.join(" ");
}

export function computeEnhancedPilotCandidates(
  interviews: Array<{
    id: string;
    shopType: string;
    location: string;
    ownerAge: number;
    customersPerDay: string;
    dollarInquiry: boolean;
    customerAskedForHelp: boolean;
    paymentMethods: string[];
    fraudStory: boolean;
    concernsBeforeStarting: string;
    currentProblems: string;
    currencyExchangeReferral: string[];
  }>
): EnhancedPilotCandidate[] {
  return interviews
    .map(interview => {
      const digitalRailCount = interview.paymentMethods.filter(m => {
        const lower = m.toLowerCase();
        return (
          lower.includes("easypaisa") ||
          lower.includes("jazzcash") ||
          lower.includes("bank") ||
          lower.includes("sadapay") ||
          lower.includes("nayapay") ||
          lower.includes("raast")
        );
      }).length;

      const concernsText = `${interview.concernsBeforeStarting} ${interview.currentProblems}`;
      const trustConcernLevel = determineTrustConcernLevel(interview.fraudStory, concernsText);
      const currentlyRefers = interview.currencyExchangeReferral.length > 0;

      // Calculate readiness score (0-100)
      let score = 0;
      if (interview.dollarInquiry) score += 30;  // FX demand is key
      if (interview.customerAskedForHelp) score += 20;  // Already helps
      if (digitalRailCount >= 2) score += 20;  // Multiple digital rails
      if (digitalRailCount >= 1 && digitalRailCount < 2) score += 10;
      if (!interview.fraudStory) score += 15;  // No fraud history
      if (currentlyRefers) score += 15;  // Active referrer

      const factors = {
        hasFxDemand: interview.dollarInquiry,
        helpsCustomers: interview.customerAskedForHelp,
        digitalRailCount,
        trustConcernLevel,
        currentlyRefers,
      };

      return {
        interviewId: interview.id,
        shopType: interview.shopType || "Unknown",
        location: interview.location || "Unknown",
        ownerAge: interview.ownerAge,
        dailyCustomers: interview.customersPerDay || "Unknown",
        readinessScore: score,
        factors,
        approachScript: generateApproachScript(factors),
        riskMitigation: generateRiskMitigation(trustConcernLevel, interview.fraudStory),
      };
    })
    .filter(c => c.readinessScore >= 30)  // Only candidates with minimum score
    .sort((a, b) => b.readinessScore - a.readinessScore);
}
