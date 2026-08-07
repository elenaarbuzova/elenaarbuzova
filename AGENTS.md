# AGENTS.md

## Cursor Cloud specific instructions

- Monorepo managed with **pnpm**. Install: `pnpm install`.
- LabAgent product app lives in **`glyph/`** (`@workspace/glyph`).
- Dev server: `pnpm --filter @workspace/glyph run dev` (also started via `.cursor/environment.json` terminal `glyph-dev`).
- For a **product demo recording**, follow `glyph/CLOUD_DEMO_PROMPT.md`: start the app, click through landing → Knowledge upload → Chat with citation → Widget → Analytics, then open a PR with the video artifact. Prefer saving `glyph/public/demo.mp4` when export is possible.
