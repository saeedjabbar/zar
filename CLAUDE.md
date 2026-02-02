# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 app (React 19, Tailwind CSS v4) displaying retail payment survey interview data from Pakistan.

### Data Flow

- **Source of truth**: `src/data/data.md` - markdown table with interview data
- **Parser**: `src/lib/interviews.ts` - server-only module that parses the markdown table into typed `Interview` objects using React's `cache()` for memoization
- Functions: `getInterviews()` returns all interviews, `getInterviewById(id)` returns one

### Pages

- `/` - Dashboard with stats, charts, and key findings
- `/interviews` - Searchable/filterable interview directory
- `/interviews/[id]` - Individual interview detail view
- `/analysis` - Analysis report with findings and recommendations

### Component Organization

Components are grouped by feature with barrel exports:
- `src/components/dashboard/` - StatCard, charts, KeyFindingsCard
- `src/components/interviews/` - Interview detail components (header, cards, transcript)
- `src/components/interviews/ui/` - Reusable UI primitives (Badge, SectionCard, FlagIndicator)

### Design System

Uses a "Field Notes" editorial aesthetic with CSS custom properties defined in `src/app/globals.css`:

**Colors** (use CSS variables, not Tailwind classes):
- `--paper`, `--paper-warm` - backgrounds
- `--ink`, `--ink-light`, `--ink-muted` - text
- `--accent-rust`, `--accent-terra`, `--accent-ochre`, `--accent-sage`, `--accent-slate` - accents
- `--border-light`, `--border-medium` - borders
- `--shadow-paper`, `--shadow-card` - shadows

**Typography** (loaded via next/font in layout.tsx):
- `font-serif` class - Crimson Text for headings
- `font-sans` - DM Sans for body
- `font-mono` - JetBrains Mono for code

### Types

Defined in `src/types/` with barrel export from `index.ts`:
- `Interview` - main data type from survey.ts
- `AnalysisSection`, `AnalysisFinding` - analysis types

## Conventions

- Server Components by default; add `"use client"` only when needed for interactivity
- Style with CSS variables via inline `style` props rather than Tailwind color utilities
- Charts use Recharts with the earthy color palette
