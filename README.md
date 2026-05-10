# WhoToVoteFor

A clean, privacy-first web app that helps UK voters discover which party best matches their views, grounded in the 2024 General Election manifestos.

See [DESIGN.md](DESIGN.md) for the full design (runtime app + build-time pipeline).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # vitest unit tests (scoring + fixture)
npm run typecheck
npm run build
```

## What's in v1

- Full survey UX: importance picker → 33 statements across 11 topics → ranked results.
- Per-party scoring with topic-importance weights and an honest `unstated` fallback.
- Static, fully client-side runtime. No backend, no cookies, no analytics.
- A hand-curated 2024 manifesto dataset (`src/data/manifestos/2024.ts`) covering Labour, Conservative, Lib Dem, Green, Reform UK and SNP. Stance summaries are editorial paraphrases of each party's published manifesto.

## What's not in v1 (see DESIGN.md)

- The build-time pipeline that ingests manifesto PDFs and emits verbatim, mechanically-verified citations. The runtime is designed to consume its output unchanged.
- Plaid Cymru and Northern Ireland parties.
- CSP middleware, Lighthouse CI, Playwright e2e — scaffolded by the design but not implemented in this slice.

## Project structure

```
src/
  app/                 Next.js routes (landing, survey, results, parties, about)
  components/          UI primitives, layout, survey, results
  data/                Manifesto schema (Zod) + active dataset
  lib/                 Pure scoring, Zustand store, safeStorage
  styles/              Tailwind v4 globals + theme
```

## Updating the dataset

Edit `src/data/manifestos/2024.ts`. The schema in `src/data/schema.ts` is enforced by Vitest (`npm run test`); CI should fail any PR that drifts.

For the next election, copy `2024.ts` to `2029.ts`, update `src/data/index.ts`'s import path, and the entire app picks up the new dataset.
