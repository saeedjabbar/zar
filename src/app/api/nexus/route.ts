import { NextRequest, NextResponse } from "next/server";
import { getInterviews, getInterviewById } from "@/lib/interviews";
import { sendToNexus, formatInterviewForNexus } from "@/lib/nexus";

/**
 * POST /api/nexus
 * Send interview data to Nexus Universal Webhook Processor.
 *
 * Body options:
 * - { "interview_id": "1" } - Send a specific interview
 * - { "all": true } - Send all interviews (bulk)
 * - { "content": "..." } - Send raw content directly
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Option 1: Send raw content directly
    if (body.content) {
      const result = await sendToNexus({
        content: body.content,
        source: body.source,
        session_id: body.session_id,
        metadata: body.metadata,
      });
      return NextResponse.json(result);
    }

    // Option 2: Send a specific interview by ID
    if (body.interview_id) {
      const interview = getInterviewById(body.interview_id);
      if (!interview) {
        return NextResponse.json(
          { success: false, error: "Interview not found" },
          { status: 404 }
        );
      }

      if (!interview.transcript) {
        return NextResponse.json(
          { success: false, error: "Interview has no transcript" },
          { status: 400 }
        );
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

      return NextResponse.json({
        ...result,
        interview_id: interview.id,
      });
    }

    // Option 3: Bulk send all interviews
    if (body.all) {
      const interviews = getInterviews();
      const results: Array<{
        interview_id: string;
        success: boolean;
        error?: string;
      }> = [];

      for (const interview of interviews) {
        if (!interview.transcript) {
          results.push({
            interview_id: interview.id,
            success: false,
            error: "No transcript",
          });
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

        results.push({
          interview_id: interview.id,
          success: result.success,
          error: result.error,
        });

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return NextResponse.json({
        success: failed === 0,
        total: results.length,
        successful,
        failed,
        results,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request. Provide interview_id, all: true, or content.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Nexus API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nexus
 * Health check and configuration status.
 */
export async function GET() {
  const configured = !!process.env.NEXUS_API_KEY;
  const webhookUrl =
    process.env.NEXUS_WEBHOOK_URL || "https://nexus.zar.app/webhooks/zar_surveys";

  return NextResponse.json({
    configured,
    webhook_url: webhookUrl,
    usage: {
      single: "POST { interview_id: '1' }",
      bulk: "POST { all: true }",
      raw: "POST { content: '...' }",
    },
  });
}
