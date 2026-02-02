'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface TranscriptViewerProps {
  transcript: string;
  maxHeight?: string;
}

interface ParsedLine {
  lineNumber: number;
  speaker: 'Interviewer' | 'Shopkeeper' | null;
  text: string;
}

function parseTranscript(transcript: string): ParsedLine[] {
  const lines = transcript.split('\n');
  const parsed: ParsedLine[] = [];
  let currentSpeaker: 'Interviewer' | 'Shopkeeper' | null = null;
  let lineNumber = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    // Check if this line is a speaker label
    if (trimmedLine === 'Interviewer:' || trimmedLine.startsWith('Interviewer:')) {
      currentSpeaker = 'Interviewer';
      // If there's text after the colon on the same line, add it
      const textAfterLabel = trimmedLine.replace('Interviewer:', '').trim();
      if (textAfterLabel) {
        parsed.push({
          lineNumber: lineNumber++,
          speaker: currentSpeaker,
          text: textAfterLabel,
        });
      }
    } else if (trimmedLine === 'Shopkeeper:' || trimmedLine.startsWith('Shopkeeper:')) {
      currentSpeaker = 'Shopkeeper';
      // If there's text after the colon on the same line, add it
      const textAfterLabel = trimmedLine.replace('Shopkeeper:', '').trim();
      if (textAfterLabel) {
        parsed.push({
          lineNumber: lineNumber++,
          speaker: currentSpeaker,
          text: textAfterLabel,
        });
      }
    } else {
      // Regular text line
      parsed.push({
        lineNumber: lineNumber++,
        speaker: currentSpeaker,
        text: trimmedLine,
      });
    }
  }

  return parsed;
}

function highlightText(text: string, searchQuery: string): React.ReactNode {
  if (!searchQuery.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchQuery.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-yellow-300 dark:bg-yellow-500/50 text-inherit rounded px-0.5"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export default function TranscriptViewer({
  transcript,
  maxHeight = '500px',
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedLines = useMemo(() => parseTranscript(transcript), [transcript]);

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) {
      return parsedLines;
    }
    return parsedLines.filter((line) =>
      line.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [parsedLines, searchQuery]);

  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return parsedLines.filter((line) =>
      line.text.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
  }, [parsedLines, searchQuery]);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy transcript:', err);
    }
  }, [transcript]);

  const scrollToFirstMatch = useCallback(() => {
    if (containerRef.current && searchQuery.trim()) {
      const firstMark = containerRef.current.querySelector('mark');
      if (firstMark) {
        firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(scrollToFirstMatch, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, scrollToFirstMatch]);

  const getSpeakerStyles = (speaker: 'Interviewer' | 'Shopkeeper' | null) => {
    if (speaker === 'Interviewer') {
      return {
        container: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
        label: 'text-blue-700 dark:text-blue-400 font-semibold',
        text: 'text-blue-900 dark:text-blue-100',
      };
    }
    if (speaker === 'Shopkeeper') {
      return {
        container: 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500',
        label: 'text-emerald-700 dark:text-emerald-400 font-semibold',
        text: 'text-emerald-900 dark:text-emerald-100',
      };
    }
    return {
      container: 'bg-gray-50 dark:bg-gray-800/50',
      label: 'text-gray-500 dark:text-gray-400',
      text: 'text-gray-700 dark:text-gray-300',
    };
  };

  // Group consecutive lines by speaker for better visual grouping
  const groupedLines = useMemo(() => {
    const groups: { speaker: 'Interviewer' | 'Shopkeeper' | null; lines: ParsedLine[] }[] = [];

    for (const line of filteredLines) {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.speaker === line.speaker) {
        lastGroup.lines.push(line);
      } else {
        groups.push({ speaker: line.speaker, lines: [line] });
      }
    }

    return groups;
  }, [filteredLines]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Match count */}
        {searchQuery && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {matchCount} {matchCount === 1 ? 'match' : 'matches'} found
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              showLineNumbers
                ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            }`}
            title={showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-colors"
          >
            {copySuccess ? (
              <>
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript container */}
      <div
        ref={containerRef}
        className="overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        style={{ maxHeight, scrollBehavior: 'smooth' }}
      >
        {groupedLines.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No matches found' : 'No transcript available'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {groupedLines.map((group, groupIndex) => {
              const styles = getSpeakerStyles(group.speaker);
              return (
                <div
                  key={groupIndex}
                  className={`p-4 ${styles.container} ${
                    groupIndex % 2 === 0 ? '' : 'bg-opacity-70 dark:bg-opacity-70'
                  }`}
                >
                  {/* Speaker label */}
                  {group.speaker && (
                    <div className={`text-xs uppercase tracking-wide mb-2 ${styles.label}`}>
                      {group.speaker}
                    </div>
                  )}

                  {/* Lines */}
                  <div className="space-y-1">
                    {group.lines.map((line) => (
                      <div key={line.lineNumber} className="flex gap-3">
                        {showLineNumbers && (
                          <span className="flex-shrink-0 w-8 text-right text-xs text-gray-400 dark:text-gray-500 font-mono select-none">
                            {line.lineNumber}
                          </span>
                        )}
                        <p className={`flex-1 text-sm leading-relaxed ${styles.text}`}>
                          {highlightText(line.text, searchQuery)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Interviewer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Shopkeeper</span>
        </div>
      </div>
    </div>
  );
}
