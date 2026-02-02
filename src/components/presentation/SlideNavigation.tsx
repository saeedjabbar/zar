'use client';

import { useEffect, useCallback } from 'react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onFullscreen: () => void;
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onFullscreen,
}: SlideNavigationProps) {
  const progress = totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0;
  const canGoPrevious = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          if (canGoPrevious) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          if (canGoNext) {
            event.preventDefault();
            onNext();
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          onFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    },
    [canGoPrevious, canGoNext, onPrevious, onNext, onFullscreen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur-sm dark:bg-zinc-900/90 md:px-8">
        {/* Previous button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-zinc-100 dark:enabled:hover:bg-zinc-800"
          aria-label="Previous slide"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Slide counter */}
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            <span className="text-blue-600 dark:text-blue-400">{currentSlide + 1}</span>
            <span className="mx-2 text-zinc-400">/</span>
            <span>{totalSlides}</span>
          </span>

          {/* Fullscreen button */}
          <button
            onClick={onFullscreen}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle fullscreen"
            title="Press F for fullscreen"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-zinc-100 dark:enabled:hover:bg-zinc-800"
          aria-label="Next slide"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-t-lg bg-zinc-800/80 px-3 py-1 text-xs text-zinc-300 backdrop-blur-sm lg:block">
        Use arrow keys or space to navigate | F for fullscreen | ESC to exit
      </div>
    </div>
  );
}
