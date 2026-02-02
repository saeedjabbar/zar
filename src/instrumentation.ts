export async function register() {
  // Only run on server startup, not during build
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { syncNewInterviewsToNexus } = await import("./lib/nexus-sync");

    // Sync new interviews to Nexus on startup
    console.log("Starting Nexus sync...");
    const result = await syncNewInterviewsToNexus();
    console.log(`Nexus sync: ${result.synced.length} new, ${result.skipped.length} existing`);
  }
}
