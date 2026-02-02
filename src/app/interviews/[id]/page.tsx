import Link from "next/link";
import { notFound } from "next/navigation";

import InterviewHeader from "@/components/interviews/InterviewHeader";
import QuickFactsCard from "@/components/interviews/QuickFactsCard";
import PaymentMethodsCard from "@/components/interviews/PaymentMethodsCard";
import KeyNotesCard from "@/components/interviews/KeyNotesCard";
import EvidenceCard from "@/components/interviews/EvidenceCard";
import TranscriptSection from "@/components/interviews/TranscriptSection";
import RawDataSection from "@/components/interviews/RawDataSection";
import { getInterviewById, getInterviews } from "@/lib/interviews";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const interview = getInterviewById(id);

  if (!interview) {
    notFound();
  }

  const interviews = getInterviews();
  const currentIndex = interviews.findIndex((i) => i.id === interview.id);
  const prev = currentIndex > 0 ? interviews[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < interviews.length - 1
      ? interviews[currentIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Decorative header band */}
      <div
        className="h-2"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-rust) 0%, var(--accent-terra) 25%, var(--accent-ochre) 50%, var(--accent-sage) 75%, var(--accent-slate) 100%)",
        }}
      />

      {/* Navigation */}
      <nav
        className="border-b"
        style={{
          background: "var(--paper)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/interviews"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink-light)" }}
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="group-hover:underline">All Interviews</span>
            </Link>
            <Link
              href="/analysis"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink-light)" }}
            >
              <span className="group-hover:underline">Analysis Report</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Interview Header */}
      <InterviewHeader
        interview={{
          id: interview.id,
          shopType: interview.shopType,
          location: interview.location,
          dateOfInterview: interview.dateOfInterview,
          timeOfInterview: interview.timeOfInterview,
          interviewer: interview.interviewer,
          fraudStory: interview.fraudStory,
          customerAskedForHelp: interview.customerAskedForHelp,
          dollarInquiry: interview.dollarInquiry,
        }}
        prevId={prev?.id}
        nextId={next?.id}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Overview Section */}
          <section id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <QuickFactsCard
                shopType={interview.shopType}
                location={interview.location}
                ownerAge={interview.ownerAge}
                customersPerDay={interview.customersPerDay}
                busiestTime={interview.busiestTime}
                mobilePaymentTimeline={interview.mobilePaymentTimeline}
              />

              <PaymentMethodsCard paymentMethods={interview.paymentMethods} />

              <KeyNotesCard
                concernsBeforeStarting={interview.concernsBeforeStarting}
                currentProblems={interview.currentProblems}
                whyReferElsewhere={interview.whyReferElsewhere}
              />
            </div>

            {/* Right Column - Sidebar */}
            <aside className="space-y-6">
              <EvidenceCard
                photoFile={interview.photoFile}
                audioFile={interview.audioFile}
                interviewId={interview.id}
              />
            </aside>
          </section>

          {/* Transcript Section */}
          <TranscriptSection transcript={interview.transcript} />

          {/* Raw Data Section */}
          <RawDataSection interview={interview} />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{
          borderColor: "var(--border-light)",
          background: "var(--paper-warm)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            <p>
              Interview #{interview.id} •{" "}
              <span style={{ color: "var(--ink-light)" }}>
                {interview.shopType}
              </span>{" "}
              • {interview.dateOfInterview}
            </p>
            <p className="font-serif italic">ZAR Retail Payment Survey</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
