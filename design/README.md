# Handoff: Retrospeced Marketing Website

## Overview
Marketing website for **Retro(speced)** — an open-source terminal UI for spec-driven AI development. The site introduces the tool, showcases its five-phase build pipeline, lists features and keyboard shortcuts, and provides quickstart install instructions. Target audience: AI-forward software engineers.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look and behavior, not production code to copy directly. Your task is to recreate these designs in the codebase you choose for the marketing site (Next.js, Astro, SvelteKit, plain static HTML — anything appropriate for a small open-source marketing site). If the project already has a website framework, follow its patterns.

The HTML prototype uses React + Babel in the browser for simplicity. In production you almost certainly want SSR/SSG and a proper build pipeline.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final. Recreate the layouts pixel-close to the reference. The palette and state colors are lifted directly from the TUI's `src/theme.ts` so the website feels of-a-piece with the application.

## Design Tokens

### Colors — Dark (TUI-native, default)
| Token | Hex | Usage |
| --- | --- | --- |
| `bg` | `#1a1520` | page background |
| `bg-panel` | `#231e2a` | cards, terminal bodies |
| `bg-active` | `#2d2636` | active list rows |
| `bg-hover` | `#352f3e` | hover states |
| `border` | `#3d3548` | all 1px borders |
| `text` | `#d4cee0` | body text |
| `text-dim` | `#786d8a` | muted / secondary |
| `text-bright` | `#f0ecf5` | headlines, emphasis |
| `accent` | `#e8722a` | primary (orange) |
| `cyan` | `#5cc9d4` | draft state |
| `green` | `#5cd49a` | review / ok logs |
| `yellow` | `#d4b85c` | plan state / run logs |
| `magenta` | `#c45cd4` | phase logs |
| `red` | `#d45c6e` | errors / urgent |

### Colors — Light (warm paper)
| Token | Hex |
| --- | --- |
| `bg` | `#f4efe6` |
| `bg-panel` | `#ebe4d6` |
| `bg-active` | `#e1d8c6` |
| `bg-hover` | `#ddd2bc` |
| `border` | `#c7bba1` |
| `text` | `#2b2419` |
| `text-dim` | `#7a6b52` |
| `text-bright` | `#18130a` |
| `accent` | `#c65a17` |
| `cyan` | `#1f7a86` |
| `green` | `#2a8a5a` |
| `yellow` | `#8a6a14` |
| `magenta` | `#8a3b9e` |
| `red` | `#a83b4c` |

### Typography
- **Single family:** JetBrains Mono (fallback: IBM Plex Mono, ui-monospace). Weights used: 400, 500, 600, 700.
- **Font feature settings:** `"ss01", "cv01", "cv11"` for disambiguated glyphs.
- **Headings:**
  - h1 hero — `clamp(40px, 5.4vw, 68px)` / line 1.02 / tracking `-0.02em` / weight 700
  - h2 section — `clamp(28px, 3.4vw, 40px)` / line 1.1 / tracking `-0.015em` / weight 700
  - h3 feature card — `20px` / weight 600
- **Body:** `14px` / line 1.55
- **Small / meta:** `11–13px`
- **Eyebrows:** `11px`, uppercase, letter-spacing `0.18em`, colored with `accent`, prefixed `§` in dim

### Spacing & Shape
- Base grid: `4px`
- Border radius: `2px` (most elements), `3–4px` (cards/panels), `6px` (hero terminal), `999px` (pill badges)
- Shadows are light — prefer `1px` borders and `box-shadow` only on the hero terminal
- Section padding: `96px 0`
- Page max-width: `1240px`, horizontal padding `32px`

### Ambient
- Subtle scanline overlay on `body::before` — repeating 2px linear-gradient of `text-bright` at 3% alpha, blended `overlay`. Toggleable. Keep subtle.
- Hero has a faint grid background with a radial mask on the top-left corner.

## Sections

### 1. Top Nav (sticky, backdrop-blur)
- Height 56px, backdrop-blur 12px, background `color-mix(in oklab, bg 82%, transparent)`, bottom border
- Left: orange blinking block caret `▊` + wordmark `retro(speced)` + dim version tag
- Center: nav links (`how / features / shortcuts / constitution / install`) with `//` prefix in border color
- Right: theme toggle (sun/moon icon), GitHub ghost button, primary "Install" CTA with Enter key hint
- **Responsive:** hide center links below 1080px, hide secondary CTAs below 720px. Brand must not shrink.

### 2. Hero
- Two-column grid at ≥980px, stacked below
- Left: badge pill ("v0.4 · open source · mit-ish") with pulsing accent dot, H1 with accent-colored last line, muted tag, CTAs, copyable install strip (prompt `$` in accent, command in text-bright, "copy" button), metadata row
- Right: terminal window (mac dots + `~/retro` title + time on right) showing one of three variants:
  - **kanban** (default) — 4-column mini kanban with Draft/Plan/Building/Review, colored headers matching state tokens, card hover that highlights border + lifts
  - **spec** — monospace markdown editor with line numbers, frontmatter highlighted cyan, H1 accent, H2 yellow, blinking block caret at end, plus PM agent inset
  - **pipeline** — live-streaming phase log, timestamps dim, tag chips color-coded (PHASE=magenta, ok=green, run=yellow, info=cyan)

### 3. How it works — Interactive Pipeline
- Two-column: left = 5-step list (numbered, hover/click selects), right = streaming log panel
- Steps cycle automatically; hovering a step jumps to it. Log lines fade in at ~750ms intervals, phase auto-advances after 2.5s idle
- Phases: Planning, Execution, Summary, Retro Rollup, Pull Request — each with its own line set
- Active step: 2px left border in accent + bg-active background + accent arrow icon

### 4. Features Grid
- 12-col grid, gap 16px. Card sizes: span 6 (default), span 12 (wide deep-maps card), span 4 (three at the bottom)
- Each card: uppercase label with `01`–`08` in accent, h3, description, and a terminal-style mock panel
- Mocks include: spec editor, pm/engineer chat exchange, deep-map lens chips, worktree tree, constitution toggle rows
- Bottom row (span 4 each): persistent queue, no-database, bun-native one-binary

### 5. Shortcuts
- Single-column stat grid of 21 shortcuts: 3 columns on desktop, 2 on ≤720px
- Each cell: description + context on left, `kbd` pill on right. 1px hairline borders, `bg-hover` on row hover.

### 6. Constitution — Interactive
- Two columns. Left = list of 9 toggleable rules (click to flip). Right = live-generated `constitution.md` preview that reflects active rules.
- Active rule: filled accent checkbox with `x` glyph in bg color.
- Includes ISO timestamp that regenerates on render.

### 7. Quickstart / Install
- Two-column: prerequisites list (Bun, Claude Code CLI, GitHub CLI, Anthropic API key) + tabbed install panel ("from source" / "standalone binary")
- Below: callout strip with first-run instructions and a primary "Star on GitHub" CTA

### 8. Footer
- 4-column grid: brand + ASCII wordmark | Product | Resources | Source
- Status line at bottom with green "all systems nominal" pill

## Interactions & Behavior

- **Theme toggle** — swap `data-theme` on `<html>` between `dark` and `light`. Persist to localStorage.
- **Tweaks panel** — floating bottom-right panel exposing: theme, accent color (orange/green/cyan/magenta), hero variant (kanban/spec/pipeline), scanlines on/off. Toggles `data-theme`, `data-accent`, `data-scanlines` attrs on `<html>`. Hidden in production unless you want to keep it as an easter egg.
- **Hero terminal** — animated per variant. Kanban: cards highlight on hover. Pipeline: auto-advancing log with 900ms line stagger, resets every ~10 lines.
- **Pipeline section** — auto-cycles through 5 phases; hovering a step jumps instantly. Log lines fade-in (280ms ease-out).
- **Copy buttons** — `navigator.clipboard.writeText`, flash "copied" for 1.4s.
- **Constitution toggles** — immediate state update, regenerates the markdown preview on the right.
- **Install tabs** — simple tab switcher between source and binary instructions.

## Animations
- `caret-blink` — 1.1s steps(2) infinite, used on brand caret + spec editor caret
- `pulse` — 1.8s box-shadow expand on the hero badge dot
- `fadein` — 280ms ease-out for new log lines
- `blink` — 0.9s infinite for the "streaming..." placeholder
- `slideup` — 180ms ease-out for Tweaks panel

## State Management
Minimal: React `useState` per section. No global store needed. Keys:
- `theme`, `accent`, `heroVariant`, `scanlines` (Tweaks) — persisted
- `active` phase index + `shown` line count (Pipeline section)
- `rules` array of {id, name, desc, on} (Constitution section)
- `hovered` ticket id (Hero kanban)
- `tab` (Install section — "git" | "bin")
- `copied` boolean (CTA copy button)

## Assets
No external images. All iconography is inline SVG in `src/primitives.jsx` (`Icon` component): `arrow`, `check`, `circle`, `dot`, `gh` (GitHub), `sun`, `moon`, `copy`, `cmd`, `spec`, `pr`, `bolt`. ASCII art wordmark is hard-coded in the footer.

Fonts loaded from Google Fonts (JetBrains Mono + IBM Plex Mono). In production, self-host them or use `fontsource` to avoid the FOUT.

## Responsive Notes
- Below 1080px: hide centered nav links
- Below 980px: hero stacks, pipeline stacks
- Below 900px: feature grid becomes single column, install grid stacks
- Below 720px: shortcut grid drops to 2 columns; secondary nav CTAs hide
- The terminal mocks have horizontal overflow scroll for the kanban — ensure `min-width: 0` on grid children to prevent blow-out.

## Copy Notes
- Tone: dry, confident, technical. No marketing fluff. Short declarative statements.
- Brand style: `retro(speced)` with parentheses rendered in dim color; `retro` as shorthand throughout body copy.
- `⌥` glyph used for the Alt key in all shortcuts.

## Files in this bundle
- `index.html` — page shell with font links and script tags
- `styles.css` — full stylesheet, all tokens + component styles
- `src/primitives.jsx` — shared `TerminalWindow`, `Kbd`, `SectionHead`, `Icon`
- `src/hero.jsx` — hero section + 3 terminal variants
- `src/pipeline.jsx` — 5-phase auto-cycling pipeline
- `src/features.jsx` — 8-card feature grid with inline mocks
- `src/shortcuts.jsx` — keyboard shortcut grid
- `src/constitution.jsx` — interactive rule toggles + live markdown preview
- `src/install.jsx` — prereqs + tabbed install commands
- `src/footer.jsx` — footer with ASCII wordmark
- `src/tweaks.jsx` — floating tweaks panel (optional for production)
- `src/app.jsx` — app shell, theme state, Tweaks integration

## Implementation Suggestions
- Use **Astro** or **Next.js (app router, static export)** for a small marketing site. The page is mostly static; only the pipeline/hero animations and constitution toggles need client JS — mark those components `'use client'` (Next) or `client:load` (Astro).
- Move design tokens into CSS custom properties at `:root` and `[data-theme="light"]` — already structured this way in `styles.css`, lift as-is.
- Replace the inline `Icon` component with `lucide-react` if the codebase already uses it; the reference set is small and has direct equivalents (`ArrowRight`, `Check`, `Circle`, `Github`, `Sun`, `Moon`, `Copy`, `Zap`).
- Typography: add a preload link tag for JetBrains Mono 400/700 to avoid layout shift.
- Keep the scanline overlay opt-in via a user toggle; some visitors find it distracting.
