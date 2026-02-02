import "server-only";

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getInterviews } from "./interviews";
import { sendToNexus, formatInterviewForNexus } from "./nexus";

const SYNC_STATE_PATH = path.join(process.cwd(), ".nexus-sync-state.json");

interface SyncState {
  lastSyncedIds: string[];
  lastSyncTime: string;
}

function loadSyncState(): SyncState {
  if (!existsSync(SYNC_STATE_PATH)) {
    return { lastSyncedIds: [], lastSyncTime: "" };
  }
  try {
    return JSON.parse(readFileSync(SYNC_STATE_PATH, "utf-8"));
  } catch {
    return { lastSyncedIds: [], lastSyncTime: "" };
  }
}

function saveSyncState(state: SyncState): void {
  writeFileSync(SYNC_STATE_PATH, JSON.stringify(state, null, 2));
}

/**
 * Sync only new interviews to Nexus.
 * Tracks which interviews have been sent to avoid redundant requests.
 */
export async function syncNewInterviewsToNexus(): Promise<{
  synced: string[];
  skipped: string[];
  failed: string[];
}> {
  const state = loadSyncState();
  const interviews = getInterviews();

  const synced: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const interview of interviews) {
    // Skip if already synced
    if (state.lastSyncedIds.includes(interview.id)) {
      skipped.push(interview.id);
      continue;
    }

    // Skip if no transcript
    if (!interview.transcript) {
      skipped.push(interview.id);
      continue;
    }

    const content = formatInterviewForNexus(interview);
    const result = await sendToNexus({
      content,
      session_id: `interview-${interview.id}`,
      metadata: {
        interview_id: interview.id,
        interviewer: interview.interviewer,
        shop_type: interview.shopType,
        location: interview.location,
        date: interview.dateOfInterview,
      },
    });

    if (result.success) {
      synced.push(interview.id);
      state.lastSyncedIds.push(interview.id);
    } else {
      failed.push(interview.id);
      console.error(`Failed to sync interview ${interview.id}:`, result.error);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Save updated state
  state.lastSyncTime = new Date().toISOString();
  saveSyncState(state);

  console.log(`Nexus sync complete: ${synced.length} synced, ${skipped.length} skipped, ${failed.length} failed`);

  return { synced, skipped, failed };
}
