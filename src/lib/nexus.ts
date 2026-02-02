import "server-only";

const NEXUS_WEBHOOK_URL =
  process.env.NEXUS_WEBHOOK_URL || "https://nexus.zar.app/webhooks/zar_surveys";
const NEXUS_API_KEY = process.env.NEXUS_API_KEY;

export interface NexusPayload {
  content: string;
  source?: string;
  session_id?: string;
  project?: string;
  metadata?: Record<string, unknown>;
}

export interface NexusResponse {
  success: boolean;
  session_id?: string;
  error?: string;
}

/**
 * Send data to Nexus Universal Webhook Processor for knowledge distillation.
 * The webhook accepts any JSON payload and uses AI to extract meaningful content.
 */
export async function sendToNexus(payload: NexusPayload): Promise<NexusResponse> {
  if (!NEXUS_API_KEY) {
    console.warn("NEXUS_API_KEY not configured - skipping Nexus integration");
    return { success: false, error: "NEXUS_API_KEY not configured" };
  }

  try {
    const response = await fetch(NEXUS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NEXUS_API_KEY}`,
      },
      body: JSON.stringify({
        content: payload.content,
        source: payload.source || "zar_surveys",
        session_id: payload.session_id,
        project: payload.project || "zar-retail-survey",
        metadata: payload.metadata,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nexus webhook error:", response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, session_id: data.session_id };
  } catch (error) {
    console.error("Failed to send to Nexus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format an interview transcript for Nexus ingestion.
 * Structures the content to help the LLM extract decisions, learnings, and insights.
 */
export function formatInterviewForNexus(interview: {
  id: string;
  interviewer: string;
  dateOfInterview: string;
  shopType: string;
  location: string;
  transcript: string;
  paymentMethods: string[];
  fraudStory: boolean;
  fraudDetails: string | null;
  dollarInquiry: boolean;
  exactPhrases: string | null;
  surprisingObservations: string | null;
}): string {
  const sections = [
    `# ZAR Retail Payment Survey Interview #${interview.id}`,
    "",
    `**Interviewer:** ${interview.interviewer}`,
    `**Date:** ${interview.dateOfInterview}`,
    `**Shop Type:** ${interview.shopType}`,
    `**Location:** ${interview.location}`,
    `**Payment Methods:** ${interview.paymentMethods.join(", ") || "Cash only"}`,
    "",
  ];

  if (interview.fraudStory && interview.fraudDetails) {
    sections.push("## Fraud Incident Reported");
    sections.push(interview.fraudDetails);
    sections.push("");
  }

  if (interview.dollarInquiry) {
    sections.push("## Dollar/Foreign Currency Interest");
    sections.push("Customer has inquired about dollar exchange.");
    sections.push("");
  }

  if (interview.exactPhrases) {
    sections.push("## Key Phrases About Money, Trust, or Fraud");
    sections.push(interview.exactPhrases);
    sections.push("");
  }

  if (interview.surprisingObservations) {
    sections.push("## Notable Observations");
    sections.push(interview.surprisingObservations);
    sections.push("");
  }

  sections.push("## Full Transcript");
  sections.push(interview.transcript);

  return sections.join("\n");
}
