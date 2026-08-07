# Cloud Agent — record LabAgent product demo

Copy everything below the line into a **Cloud** agent at [cursor.com/agents](https://cursor.com/agents).

---

Record a real product demo video of LabAgent.ai (the `glyph` app in this monorepo) and open a PR with the video artifact.

## Environment
1. Work in `glyph/` (package `@workspace/glyph`).
2. If the `glyph-dev` terminal is not already running: `pnpm --filter @workspace/glyph run dev` and wait until Vite is ready.
3. Open the app in the desktop browser (usually `http://localhost:5173` or the port Vite prints).

## Demo script (click through like a researcher — do not skip steps)
Film / computer-use the full path. Prefer ~45–90 seconds total. Move the mouse clearly; pause briefly on each beat.

1. **Landing** — scroll hero → Demo section (if present) → Features briefly.
2. **Sign up / enter app** — go to `/signup` (or `/login` / `/app` if already seeded). Complete onboarding quickly if shown (sample CRISPR upload is fine).
3. **Knowledge** — open Knowledge, click the upload drop zone so a file indexes (green success).
4. **Chat** — open Chat / Playground, ask: `How should CRISPR samples be stored?` Wait for cited answer with source.
5. **Widget** — open Widget / Embed builder, show the live preview.
6. **Analytics** — open Analytics, show the charts / KPIs.

## Deliverables
1. Produce a **video artifact** of this walkthrough (computer-use recording).
2. Open a **PR** titled `Add LabAgent product demo recording` with the artifact attached.
3. If you can export the recording file, also save it as `glyph/public/demo.mp4` and make the landing `#demo` section play that file (keep a graceful fallback if the file is missing).
4. Enable/ensure **Allow posting artifacts to GitHub** is usable so the PR description can embed the video.

## Constraints
- Do not rewrite the product UI for the demo unless something blocks the flow.
- Prefer the live app over any animated mock reel.
- No secrets or fake credentials beyond what the prototype already uses (localStorage demo).
