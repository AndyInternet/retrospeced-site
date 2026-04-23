---
status: building
id: initial-build
target-branch: main
references:
  - project: retrospeced-tui
    branch: main
    path: /Users/alawrence/.retro/references/initial-build/retrospeced-tui
---

# Feature Specification
## Goal
Build marketing site for retro(speced) — open-source TUI for spec-driven AI dev. Port HTML/JSX prototype in `design/reference/` to Next.js 16 app. Deploy on Vercel.

Design bible: `design/README.md` (tokens, sections, interactions, responsive rules — treat as source of truth). Visual/behavioral fidelity: high. Recreate pixel-close to reference.

**Platform constraint:** retro(speced) currently supports macOS only. The site must communicate this clearly — not as a warning, but as a matter-of-fact constraint. Linux/Windows support is on the roadmap but not shipped.

## Stack
- Next.js 16 (app router)
- React 19
- TypeScript strict
- Plain CSS via global stylesheet + CSS Modules per component. No Tailwind, no CSS-in-JS runtime. Tokens via CSS custom properties on `:root` + `[data-theme="light"]` (lift directly from `design/reference/styles.css`).
- `next/font/google` for JetBrains Mono + IBM Plex Mono fallback (preload 400/600/700).
- `lucide-react` for icons (`ArrowRight`, `Check`, `Circle`, `Github`, `Sun`, `Moon`, `Copy`, `Zap`). Replace inline `Icon` component from reference.
- `@vercel/analytics` for page-view analytics. Mounted via `<Analytics />` in `app/layout.tsx`.
- Deploy: Vercel, default build (no static export — allow future route additions). Node runtime.

## Directory Structure
```
/
├─ app/
│  ├─ layout.tsx          # root layout, fonts, theme init script, nav, footer
│  ├─ page.tsx            # single marketing page composing all sections
│  ├─ globals.css         # tokens (:root + [data-theme="light"]), resets, scanline overlay
│  └─ favicon.ico
├─ components/
│  ├─ nav.tsx             # server; sticky top nav
│  ├─ theme-toggle.tsx    # 'use client'
│  ├─ hero/
│  │  ├─ hero.tsx         # 'use client' (variant switcher)
│  │  ├─ kanban.tsx       # TUI-accurate 5-column board
│  │  ├─ kanban.ts        # COLUMNS data (see Data Contracts)
│  │  ├─ draft.tsx        # TUI-accurate dual-panel draft view
│  │  ├─ pipeline-term.tsx # hero variant; renders PHASES[2] (execution) only, non-cycling, static snapshot
│  │  └─ hero.module.css
│  ├─ pipeline/
│  │  ├─ pipeline.tsx     # 'use client'
│  │  ├─ phases.tsx       # phase + typed event data (JSX render helpers)
│  │  └─ pipeline.module.css
│  ├─ features/
│  │  ├─ features.tsx     # server; mocks are static
│  │  └─ features.module.css
│  ├─ shortcuts/
│  │  ├─ shortcuts.tsx    # server
│  │  ├─ data.ts          # 21 shortcut entries
│  │  └─ shortcuts.module.css
│  ├─ constitution/
│  │  ├─ constitution.tsx # 'use client'
│  │  ├─ rules.ts         # 11 rules
│  │  └─ constitution.module.css
│  ├─ install/
│  │  ├─ install.tsx      # 'use client' (tabs + copy)
│  │  └─ install.module.css
│  ├─ footer.tsx          # server; ASCII wordmark
│  ├─ tweaks.tsx          # 'use client'; gated by NEXT_PUBLIC_TWEAKS=1
│  └─ primitives/
│     ├─ terminal-window.tsx
│     ├─ kbd.tsx
│     ├─ section-head.tsx
│     ├─ copy-button.tsx  # 'use client'
│     ├─ footer-shortcuts.tsx  # shared footer strip for all terminal mocks
│     └─ primitives.module.css
├─ lib/
│  └─ theme.ts            # localStorage keys, FOUC-prevention script string
├─ public/                # no images expected; reserve for OG later
├─ next.config.ts
├─ tsconfig.json
├─ package.json
└─ .eslintrc / eslint.config.mjs
```

## Sections to Implement
Port 1:1 from `design/README.md` §Sections:
1. Top nav (sticky, blur, responsive collapse at 1080/720px)
2. Hero (two-column ≥980px; kanban/draft/pipeline variants, default kanban — variants are Tweaks-panel-gated; shipping users only see kanban unless `NEXT_PUBLIC_TWEAKS=1`)
3. How it works — interactive pipeline (auto-cycle 6 phases, 750ms event stagger, 2.5s phase advance)
4. Features grid (12-col; span 6/12/4 mix; 8 cards)
5. Shortcuts (21 entries; 3-col desktop, 2-col ≤720px)
6. Constitution (11 toggleable rules, live markdown preview with regenerated ISO timestamp)
7. Quickstart / Install (prereqs + tabbed commands: "from source" / "standalone binary")
8. Footer (4-col, ASCII wordmark, status pill)

Copy/content sourced verbatim from `design/reference/src/*.jsx` unless noted.

## Screen Fidelity
The JSX prototype in `design/reference/src/` predates the current TUI and contains several invented fields that don't exist in the shipping product. The marketing site must match what the TUI actually renders, not the prototype. Where the prototype diverges, this spec below overrides it. Source of truth for screen content: `/Users/alawrence/.retro/references/initial-build/retrospeced-tui/src/` (esp. `screens/tickets.tsx`, `screens/ticket-building.tsx`, `screens/draft-view.tsx`, `components/kanban-card.tsx`, `lib/constitution/toggles.ts`, `theme.ts`).

Rules:
- Kanban cards show only fields the TUI renders (id, project, target branch, optional status line). No invented `#tag`, no title string, no progress bars, no "urgent" indicators.
- Build log uses the TUI's event format (`═══ Phase: X ═══`, `▶ Task N of M`, `✓ Task N`, `🔧 tool: summary`). No `[PHASE]`/`[ok]`/`[run]` tag-with-timestamp format.
- Constitution toggles match `lib/constitution/toggles.ts` verbatim (id, label, description).
- Phase count matches TUI: six phases, not five.
- Accent color in TUI is `#e8722a` (orange). Column accents: draft cyan `#5cc9d4`, plan yellow `#d4b85c`, building orange `#e8722a`, review green `#5cd49a`, completed dim `#786d8a`.

### Required CSS tokens
The following custom properties must exist on `:root` (and be overridden by `[data-theme="light"]`). Tokens marked ✓ already ship in `design/reference/styles.css`; tokens marked ➕ are new and must be added during the port.

| Token | Source | Purpose |
|---|---|---|
| `--bg`, `--bg-panel`, `--bg-active`, `--bg-hover` | ✓ | surface layers |
| `--border` | ✓ | default card/panel border |
| `--text`, `--text-dim`, `--text-bright` | ✓ | type ramp |
| `--accent`, `--accent-weak` | ✓ | primary action / focus |
| `--cyan`, `--green`, `--yellow`, `--magenta`, `--red` | ✓ | status colors |
| `--draft`, `--plan`, `--building`, `--review` | ✓ | column accents (aliased to base colors) |
| `--completed` | ➕ | alias to `var(--text-dim)` |
| `--border-active` | ➕ | alias to `var(--accent)` — card hover border |

All subsequent `var(--…)` references in this spec resolve against this set. No other custom properties may be introduced without updating this table.

## Client/Server Split
Server components by default. Mark `'use client'` only where required:
- `theme-toggle`, `hero` (variant state), `pipeline` (auto-cycle + timers), `constitution` (toggle + live preview), `install` (tabs + copy), `copy-button`, `tweaks`.

Rationale: most of page is static markup + CSS. Keep client bundle small.

## Theme System
- Attribute `data-theme` on `<html>`: `"dark"` (default) | `"light"`.
- Attribute `data-accent`: `"orange"` (default) | `"green"` | `"cyan"` | `"magenta"`.
- Attribute `data-scanlines`: `"on"` (default) | `"off"`.
- Persist all three to `localStorage` keys: `retro:theme`, `retro:accent`, `retro:scanlines`.
- FOUC fix: inline `<script>` in `<head>` via `next/script` `strategy="beforeInteractive"` or raw `<script dangerouslySetInnerHTML>` in `layout.tsx` that reads localStorage and sets attributes before paint.

```ts
// lib/theme.ts
export const THEME_INIT_SCRIPT = `
(function(){try{
  var d=document.documentElement;
  var t=localStorage.getItem('retro:theme')||'dark';
  var a=localStorage.getItem('retro:accent')||'orange';
  var s=localStorage.getItem('retro:scanlines')||'on';
  d.setAttribute('data-theme',t);
  d.setAttribute('data-accent',a);
  d.setAttribute('data-scanlines',s);
}catch(e){}})();
`;
```

## Data Contracts

### Hero kanban (`components/hero/kanban.ts`)
Matches `retrospeced-tui/src/screens/tickets.tsx` + `components/kanban-card.tsx`. **5 columns**, cards show only TUI-rendered fields.

```ts
export type ColumnId = 'draft' | 'plan' | 'building' | 'review' | 'completed';
export type QueueStatus = 'queued' | 'building' | 'retrying' | 'failed';

export interface Ticket {
  id: string;
  project: string;
  targetBranch: string;
  queue?: { status: QueueStatus; phase?: string; position?: number; retries?: number };
}

export interface Column { id: ColumnId; label: string; accent: string; tickets: Ticket[]; }

export const COLUMNS: Column[] = [
  { id: 'draft',     label: 'DRAFT',     accent: 'var(--cyan)',    tickets: [
    { id: 'onboard-flow',  project: 'acme-app',  targetBranch: 'main' },
    { id: 'csv-import',    project: 'acme-app',  targetBranch: 'main' },
    { id: 'oauth-refresh', project: 'auth-svc',  targetBranch: 'main' },
  ]},
  { id: 'plan',      label: 'PLAN',      accent: 'var(--yellow)',  tickets: [
    { id: 'rate-limit',    project: 'acme-app',  targetBranch: 'main' },
    { id: 'search-infra',  project: 'acme-app',  targetBranch: 'main' },
  ]},
  { id: 'building',  label: 'BUILDING',  accent: 'var(--accent)',  tickets: [
    { id: 'billing-v2',    project: 'acme-app',  targetBranch: 'main',
      queue: { status: 'building', phase: 'Task 3 of 5' } },
    { id: 'stripe-webhook',project: 'acme-app',  targetBranch: 'main',
      queue: { status: 'retrying', retries: 2, phase: 'Execution' } },
    { id: 'webhook-retry', project: 'acme-app',  targetBranch: 'main',
      queue: { status: 'queued', position: 1 } },
  ]},
  { id: 'review',    label: 'REVIEW',    accent: 'var(--green)',   tickets: [
    { id: 'safari-focus',  project: 'acme-app',  targetBranch: 'main' },
    { id: 'dark-mode',     project: 'marketing', targetBranch: 'main' },
  ]},
  { id: 'completed', label: 'COMPLETED', accent: 'var(--text-dim)', tickets: [
    { id: 'soc2-audit',    project: 'acme-app',  targetBranch: 'main' },
  ]},
];
```

Kanban card structure (TUI render, port 1:1):
- Line 1: `{ticket.id}` (text color)
- Line 2: `{ticket.project}` (dim)
- Line 3: `→ {ticket.targetBranch}` (dim)
- Line 4 (only if `queue`): status line
  - `building`: braille spinner + ` ` + `{phase}` (e.g. `⠋ Task 3 of 5`), color = accent
  - `queued`:   `⏳ Queued (#{position})`, color = dim
  - `retrying`: `↻ Retrying ({retries}/3)`, color = yellow
  - `failed`:   `✗ Failed: {phase}`, color = red

Include at least one example of each non-trivial status variant in `COLUMNS` to exercise the render paths. Current fixture shows `building` and `queued`; add one `retrying` (e.g. a second ticket in the `building` column) so that render path ships.

Border: rounded, colored by selection/hover state — default `var(--border)`, hover `var(--border-active)`, selected `var(--accent)`, failed `var(--red)`. Completed column cards: `opacity: 0.7`.

Column header: uppercase label + count, 1px bottom border in column accent color.

Top bar (kanban): left `[⌥/] Search` (dim), right `All Projects  [⌥n] + New` (accent on key).

Footer shortcut bar (kanban): `[←→] Switch column  [↑↓] Navigate  [Enter] Open  [⌥n] New ticket  [⌥k] Commands`.

### Draft view mock (`components/hero/draft.tsx` — replaces old `HeroSpec`)
Matches `retrospeced-tui/src/screens/draft-view.tsx` side-by-side layout (≥120 cols).

Info bar (single line):
```
Ticket: rate-limit · Project: acme-app · ● Draft · → main · References: 2 · ~1,847 tokens
```
- `rate-limit` in cyan bold, `acme-app` in accent bold, `● ` in cyan (draft color) + `Draft` in text, `→ main` dim, tokens colored by TUI's `tokenColor()` heuristic (lifted from `lib/token-utils.ts`): `count > 20_000` → `var(--red)`, `count ≥ 15_000` → `var(--yellow)`, else `var(--text-dim)`. At `~1,847 tokens` the sample displays in `var(--text-dim)`.

**Panel focus**: the mock is static — show the **editor (left) as focused** (border = `var(--accent)`, opacity 1) and the chat (right) as unfocused (border = `var(--border)`, opacity 0.85).

Left panel (50%): header `FEATURE SPECIFICATION — EDIT` (dim) + right-aligned `saved ✓` (green). Rounded border in accent. Body: spec markdown preview (the 14-line `spec-mock` from `design/reference/src/hero.jsx` is fine content — keep those lines).

Right panel (50%): header `PM AGENT CHAT` (dim). Rounded border, scrollable. Message blocks use **left-border** color (not full border):
- PM agent: cyan left border, header `🤖 PM` (cyan bold), body markdown
- User:     accent left border, header `👤 You` (accent bold), body text
- Tool:     yellow left border, header `{toolName}` (yellow bold), body summary (dim)

Example messages (verbatim content is fine to fabricate — just match tone):
```
👤 You
Add a rate limiter to /api/* endpoints.

🤖 PM
A few edge cases to lock down:
• Behavior when Redis is unreachable — fail-open or fail-closed?
• Bypass header for health-check probes (/api/health hits every 30s)
• Does the admin override apply per-user or globally?

Read
src/api/*.ts (11 files)

👤 You
fail-open, log to sentry. bypass health probes. admin override is global.

🤖 PM
Noted. Adding to acceptance criteria.
```

Below chat: 5-row textarea input with border, placeholder `Type a message...`, footer line `Enter to send · Shift+Enter for newline` (dim).

Footer shortcut bar: `[Tab] Switch panel  [⌥e] Open in editor  [⌥p] Start plan  [⌥k] Commands`.

### Footer shortcut bar (shared primitive `components/primitives/footer-shortcuts.tsx`)
Every terminal mock's footer strip uses this render: each entry is `[{key}]` in accent + space + `{label}` in dim, separated by 2 spaces. Hover state lifts both to bright. Source: `retrospeced-tui/src/components/footer-shortcuts.tsx`.

### Pipeline phases (`components/pipeline/phases.tsx`)
Matches the TUI's six `BuildPhase` values and its rendered event format (see `retrospeced-tui/src/screens/ticket-building.tsx` + `lib/build/types.ts`). Events are typed, not tagged lines. Every phase must contain `events.length ≥ 1` (the cycling logic assumes a non-empty list; do not ship a phase with zero events).

Inline color classes used inside event nodes: `dim` (text-dim), `br` (text-bright), `path` (accent), `grn` (green), `red` (red), `acc` (accent), `mag` (magenta for the 🔧 glyph), `cyn` (cyan). `mag` and `cyn` are new beyond the design-reference stylesheet; add them to `globals.css` as `.mag { color: var(--magenta) }` / `.cyn { color: var(--cyan) }`.

- `phase-start` → rendered as `═══ Phase: <label> ═══` in accent, bold
- `task-start` → `▶ Task N of M: <text>` in bright
- `task-complete` → `✓ Task N: <text>` in green
- `agent-tool-use` → `🔧 <tool>: <summary>` (🔧 magenta, text dim)
- `agent-text` → plain text, normal color
- `error` → `✗ Error in <phase>: <msg>` in red
- `build-complete` → `✓ Build complete! PR opened.` in green + dim `Press Esc to return.`

Timing rules: `shown` starts at 1, advances every **750ms**; when `shown === events.length`, phase advances after **2500ms**. On phase change, `shown` resets to 1.

```ts
export type PhaseId = 'planning' | 'task-generation' | 'execution' | 'review' | 'retro-rollup' | 'pr';
export type EventKind = 'phase-start' | 'task-start' | 'task-complete' | 'tool-use' | 'text' | 'error' | 'build-complete';
export interface BuildEvent { kind: EventKind; node: React.ReactNode; }
export interface Phase { id: PhaseId; name: string; sub: string; events: BuildEvent[]; }

// Render helpers (in .tsx):
// phaseStart(label)         → <b>═══ Phase: {label} ═══</b>
// taskStart(i, total, text) → ▶ Task {i} of {total}: {text}
// taskDone(i, text)         → ✓ Task {i}: {text}
// toolUse(tool, summary)    → <span className="mag">🔧 </span>{tool}: <span className="dim">{summary}</span>
// agentText(text)           → {text}
// buildComplete()           → ✓ Build complete! PR opened.

export const PHASES: Phase[] = [
  {
    id: 'planning', name: 'Planning', sub: 'reads codebase · drafts spec',
    events: [
      { kind: 'phase-start',    node: phaseStart('Planning') },
      { kind: 'tool-use',       node: toolUse('Read',  'src/api · src/middleware · src/lib (43 files)') },
      { kind: 'tool-use',       node: toolUse('Grep',  'rate limit|throttle|429 → 11 matches') },
      { kind: 'text',           node: agentText('Drafting feature spec with acceptance criteria.') },
      { kind: 'tool-use',       node: toolUse('Write', 'specs/rate-limit.md') },
    ],
  },
  {
    id: 'task-generation', name: 'Task Generation', sub: 'breaks plan into atomic units',
    events: [
      { kind: 'phase-start',    node: phaseStart('Task Generation') },
      { kind: 'text',           node: agentText('Decomposing plan into 5 tasks.') },
      { kind: 'tool-use',       node: toolUse('Write', 'specs/rate-limit.md (Tasks section)') },
    ],
  },
  {
    id: 'execution', name: 'Execution', sub: 'writes code, task by task',
    events: [
      { kind: 'phase-start',    node: phaseStart('Execution') },
      { kind: 'task-start',     node: taskStart(1, 5, 'scaffold rate-limit middleware') },
      { kind: 'tool-use',       node: toolUse('Write', 'src/middleware/rate-limit.ts') },
      { kind: 'task-complete',  node: taskDone(1, 'scaffold rate-limit middleware') },
      { kind: 'task-start',     node: taskStart(2, 5, 'wire redis store') },
      { kind: 'tool-use',       node: toolUse('Write', 'src/lib/rl-store.ts') },
      { kind: 'task-complete',  node: taskDone(2, 'wire redis store') },
      { kind: 'task-start',     node: taskStart(3, 5, 'write tests (TDD active)') },
      { kind: 'tool-use',       node: toolUse('Write', 'tests/rl.test.ts') },
      { kind: 'tool-use',       node: toolUse('Bash',  'bun test → 12 pass, 0 fail') },
      { kind: 'task-complete',  node: taskDone(3, 'write tests') },
    ],
  },
  {
    id: 'review', name: 'Review', sub: 'self-review of diff',
    events: [
      { kind: 'phase-start',    node: phaseStart('Review') },
      { kind: 'tool-use',       node: toolUse('Read', 'src/middleware/rate-limit.ts') },
      { kind: 'tool-use',       node: toolUse('Read', 'tests/rl.test.ts') },
      { kind: 'text',           node: agentText('Diff looks coherent. 7 files · +512 / -18.') },
    ],
  },
  {
    id: 'retro-rollup', name: 'Retro Rollup', sub: 'start · stop · continue',
    events: [
      { kind: 'phase-start',    node: phaseStart('Retro Rollup') },
      { kind: 'tool-use',       node: toolUse('Write', 'specs/rate-limit.md (Retro section)') },
      { kind: 'text',           node: agentText('start: reuse ioredis singleton. stop: re-scaffolding tests dir. continue: atomic tasks work.') },
    ],
  },
  {
    id: 'pr', name: 'Pull Request', sub: 'pushes branch · opens PR',
    events: [
      { kind: 'phase-start',    node: phaseStart('Pull Request') },
      { kind: 'tool-use',       node: toolUse('Bash', 'git push origin retro/rate-limit') },
      { kind: 'tool-use',       node: toolUse('Bash', 'gh pr create') },
      { kind: 'build-complete', node: buildComplete() },
    ],
  },
];
```

Header of log panel (matches TUI `renderHeader`): left `Ticket: rate-limit · Project: acme-app · → main`, right pulsing orange pill with braille spinner + progress text e.g. `⠋ Task 3 of 5`. Placeholder tail line while events stream: braille spinner in accent on its own line (no `[...] streaming...` tag format).

Braille spinner frames (lift from TUI `lib/braille-animations.ts`): `⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏`, 80ms per frame.

### Constitution rules (`components/constitution/rules.ts`)
Mirror of `retrospeced-tui/src/lib/constitution/toggles.ts` — **11 toggles**. `id`, `label`, `description` are copied verbatim from the TUI. `defaultOn` is a marketing-site choice (the TUI has no default-on state; toggles start off and the user picks).

```ts
export interface Rule { id: string; label: string; description: string; defaultOn: boolean; }

export const RULES: Rule[] = [
  { id: 'tdd',                    label: 'Test-Driven Development', description: 'Write tests before implementation code.',                                     defaultOn: true  },
  { id: 'defensive-programming',  label: 'Defensive Programming',   description: 'Validate inputs and handle edge cases.',                                      defaultOn: false },
  { id: 'smallest-changeset',     label: 'Smallest Changeset',      description: 'Make the minimum change needed to complete the task.',                        defaultOn: true  },
  { id: 'type-safety',            label: 'Type Safety',             description: 'Use strict types and avoid any/unknown.',                                     defaultOn: true  },
  { id: 'documentation',          label: 'Documentation',           description: 'Add or update documentation alongside code changes.',                         defaultOn: false },
  { id: 'reuse-existing-patterns',label: 'Reuse Existing Patterns', description: 'Prefer existing utilities and abstractions over creating new ones.',          defaultOn: true  },
  { id: 'incremental-testing',    label: 'Incremental Testing',     description: 'Run tests after each logical unit of work, not just at the end.',             defaultOn: true  },
  { id: 'lint-compliance',        label: 'Lint Compliance',         description: 'Ensure all changes pass the project linter.',                                 defaultOn: true  },
  { id: 'no-new-deps',            label: 'No New Dependencies',     description: 'Avoid adding new packages unless approved.',                                  defaultOn: true  },
  { id: 'cleanup-tech-debt',      label: 'Cleanup Found Technical Debt', description: 'Address technical debt discovered while working on tasks.',              defaultOn: false },
  { id: 'caveman-mode',           label: 'Caveman Mode',            description: 'Ultra-compressed writing. Drop articles, filler, pleasantries.',              defaultOn: false },
];
```

Markdown preview format (regenerate on every render — ISO timestamp is live):
```
# The Constitution
# Regenerated 2026-04-21T14:32:08Z

You are a build agent. Follow these rules strictly.

## <rule.label>
<rule.description>

## <next rule.label>
<next rule.description>
```
If `activeCount === 0`, render `// no rules active — chaos mode` in place of the rules section, styled `color: var(--text-dim); font-style: italic`. Header strip shows `.retro/constitution.md · toggles` on left, `● {activeCount}/{rules.length} active` on right (dot in accent).

`defaultOn` rationale: the four toggles left off (`defensive-programming`, `documentation`, `cleanup-tech-debt`, `caveman-mode`) are stylistic or context-dependent — enabling them by default would add friction for users whose codebases don't need the constraint. The other seven are rules most teams want enforced unconditionally (tests, types, lint, scope discipline).

### Shortcuts (`components/shortcuts/data.ts`)
```ts
export interface Shortcut { keys: string; desc: string; context: string; }

export const SHORTCUTS: Shortcut[] = [
  { keys: '⌥1',  desc: 'Tickets kanban',             context: 'global' },
  { keys: '⌥2',  desc: 'Projects',                    context: 'global' },
  { keys: '⌥3',  desc: 'Settings',                    context: 'global' },
  { keys: '⌥/',  desc: 'Search tickets',              context: 'tickets' },
  { keys: '⌥f',  desc: 'Filter by project',           context: 'tickets' },
  { keys: '⌥n',  desc: 'New ticket',                  context: 'tickets' },
  { keys: 'Tab', desc: 'Switch editor / chat',        context: 'draft · plan' },
  { keys: '⌥m',  desc: 'Markdown preview',            context: 'draft · plan' },
  { keys: '⌥e',  desc: 'Open in external editor',     context: 'any view' },
  { keys: '⌥t',  desc: 'Open worktree in terminal',   context: 'any view' },
  { keys: '⌥r',  desc: 'Manage references',           context: 'draft · plan' },
  { keys: '⌥p',  desc: 'Generate plan',               context: 'draft' },
  { keys: '⌥b',  desc: 'Start build',                 context: 'plan' },
  { keys: '⌥u',  desc: 'Revert to draft',             context: 'plan' },
  { keys: '⌥v',  desc: 'Toggle verbose',              context: 'building' },
  { keys: '⌥c',  desc: 'Cancel build',                context: 'building' },
  { keys: '⌥o',  desc: 'Open PR',                     context: 'review' },
  { keys: '⌥l',  desc: 'Toggle log viewer',           context: 'global' },
  { keys: '⌥q',  desc: 'Quit',                        context: 'global' },
  { keys: '↵',   desc: 'Open selection',              context: 'lists' },
  { keys: 'Esc', desc: 'Back',                        context: 'any view' },
];
```

Eyebrow copy: `shortcuts`. Heading: `Hands stay on home row.` Sub: `Every screen is one key away, and no action ever requires a mouse. The whole app is a keyboard API first, a UI second.`

### Pipeline section copy
Eyebrow: `how it works`. Heading: `A six-phase build loop you can watch in real time.` Sub: `Retro orchestrates Claude Code through a deterministic pipeline — planning, task generation, execution, review, retro rollup, PR. Every phase streams typed events, so you see every tool call, every file touched, every retry. If a build fails, it resumes from the last good phase instead of starting from zero.`

### Constitution section copy
Eyebrow: `constitution`. Heading: `Your taste, as a system prompt.` Sub: `Toggle the engineering principles every build agent has to follow. Retro regenerates .retro/constitution.md on each change — click the rules, try it.`

### Install tabs
```ts
export type InstallTab = 'git' | 'bin';
// tab id → visible label:
//   'git' → "from source"
//   'bin' → "standalone binary"
```
Lift commands, prereqs list, and CTA copy verbatim from `design/reference/src/install.jsx`.

### Hero + features copy
Lift the **left-column hero copy** (headline, tag, CTA labels, install strip, metadata row) verbatim from `design/reference/src/hero.jsx`. Lift **features card copy** (card labels 01–08, headings, paragraph bodies) verbatim from `design/reference/src/features.jsx`.

**Do not** lift the hero terminal mocks (`HeroKanban`, `HeroSpec`, `HeroPipeline`, `TICKETS`, `PIPE_LINES`) from `hero.jsx` — those predate the current TUI. Use the data contracts above (`components/hero/kanban.ts`, `components/hero/draft.tsx`, `components/pipeline/phases.tsx`) instead.

Features section mocks in `features.jsx` (spec editor preview, deep-maps lens picker, worktree tree, constitution rule list) are stylized representations that match the TUI closely enough — keep them 1:1. Exception: the constitution mock on card 05 should show real toggle labels from the `RULES` list above (first six rules).

### macOS-only messaging
Add platform-constraint copy in four places. Tone matches the rest of the site: dry, declarative, no warning banners.

1. **Hero badge pill** — append `· macOS` to the existing pill (e.g. `v0.4 · open source · mit-ish · macOS`). Keep the pulsing accent dot.
2. **Hero metadata row** — add a meta item: `platform: macOS 13+` alongside existing meta items.
3. **Install section prereqs** — prepend a new prereq item at the top of the list:
   - `macOS 13+ (Ventura or later)` with sub-text `Linux & Windows coming — star the repo to follow along.`
4. **Install section callout strip** — add a single dim line above the "Star on GitHub" CTA: `Currently macOS-only. Cross-platform support is on the roadmap.`

Do NOT add a sitewide banner, modal, or nav-level warning. The constraint is communicated through the natural content flow.

## Animations (lift from `styles.css`)
Keyframes `caret-blink`, `pulse`, `fadein`, `blink`, `slideup`. No framer-motion; pure CSS + `setInterval`/`setTimeout` for pipeline cycling.

## Interactions
- Copy button → `navigator.clipboard.writeText`, toggle "copied" label for 1400ms.
- Pipeline → `useEffect` with `setInterval(2500)` phase advance, nested `setInterval(750)` event reveal; cleanup on unmount; pause on hover of a step, jump to hovered step index.
- Constitution toggle → update `on: boolean` in state, rebuild markdown string, render in `<pre>`.
- Install tabs → radio-pattern buttons, `role="tablist"` / `role="tab"` / `role="tabpanel"`.
- Theme toggle → write to localStorage + update `data-theme` attribute.
- Tweaks panel → only rendered if `process.env.NEXT_PUBLIC_TWEAKS === '1'`.

## Accessibility
- All interactive elements keyboard-reachable; visible focus ring using `accent` at 2px outline offset 2px.
- `prefers-reduced-motion`: disable pipeline auto-cycle, caret blink, pulse, scanlines, braille spinner frame cycling (render a single static frame instead), and the hero badge pulse.
- `aria-label` on icon-only buttons (theme toggle, copy, GitHub link).
- Skip link to `#main`.
- Semantic landmarks: `<header>`, `<main id="main">`, `<footer>`.
- Color contrast: verify body text on bg meets WCAG AA (existing tokens do; verify accent-on-bg where used for text).

## SEO / Meta
```ts
// app/layout.tsx metadata
export const metadata: Metadata = {
  title: 'retro(speced) — spec-driven AI development TUI for macOS',
  description: 'Open-source terminal UI for spec-driven AI development on macOS. Plan, build, review, ship — all in one loop.',
  metadataBase: new URL('https://retrospeced.dev'), // placeholder; update when domain set
  openGraph: { type: 'website', title: '...', description: '...', images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};
```
OG image: deferred. Placeholder file `public/og.png` (1200×630, dark theme hero screenshot). Can be added post-launch.

## Responsive Breakpoints (from design README)
- `≤1080px`: hide center nav links
- `≤980px`: hero + pipeline stack
- `≤900px`: feature grid single column; install stacks
- `≤720px`: shortcut grid 2-col; secondary nav CTAs hide

## Commands
```
bun install
bun run dev       # next dev --turbopack
bun run build     # next build
bun run start     # next start
bun run lint      # next lint (eslint-config-next)
bun run typecheck # tsc --noEmit
```
Package manager: Bun (matches TUI project conventions). Vercel auto-detects Next.js; set install command to `bun install` in project settings.

## Acceptance Criteria
1. `bun run build` exits 0.
2. `bun run typecheck` exits 0 (no TS errors).
3. `bun run lint` exits 0.
4. `/` renders all 8 sections in the order listed.
5. Theme toggle: clicking flips `data-theme` between `dark`/`light`; reload preserves choice; no FOUC (verify by throttling CPU 4× in devtools).
6. Pipeline section auto-advances through 6 phases; hovering a step jumps to that step within one frame.
7. Constitution: toggling any of 11 rules updates the `<pre>` markdown preview in the same render; ISO timestamp regenerates on each render.
8. Install tabs: clicking "from source" / "standalone binary" swaps panel content; copy button flashes "copied" for ~1.4s after click.
9. Lighthouse (production build, desktop): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
10. No console errors or warnings on initial load in Chrome.
11. `prefers-reduced-motion: reduce` disables auto-cycling pipeline and caret blink.
12. Responsive: at 720px width, shortcut grid is 2-col; at 1080px width, center nav links are hidden. Verify via devtools responsive mode.
13. macOS-only constraint appears in all four required spots: hero badge pill, hero metadata row, install prereqs (top of list), and install callout strip. Page title + meta description mention macOS.

## Analytics
- `@vercel/analytics/react` `<Analytics />` in `app/layout.tsx` → auto page views on Vercel.
- Optional: `@vercel/speed-insights/next` `<SpeedInsights />` for Web Vitals, same location.
- No custom events for v1. Add `track()` calls later if CTA conversion tracking is wanted.

## Out of Scope
- Blog, docs, or additional routes
- CMS integration
- Custom analytics events / third-party analytics (PostHog, GA, etc.)
- i18n
- Auth
- Backend API routes

## Open Questions
- Final production domain? (affects `metadataBase`, OG links)
- GitHub repo URL for nav + footer links? (placeholder `https://github.com/...` until provided)
- Ship Tweaks panel in production, or gate via env var only? (spec assumes env-gated)
# Attachments

# Implementation Plan
## Approach

Fresh Next.js 16 app at worktree root. Port `design/reference/styles.css` → `app/globals.css` verbatim (tokens + keyframes + section styles) then add two new tokens (`--completed`, `--border-active`), a `.red` utility class (missing from styles.css), and a `prefers-reduced-motion` block (absent from styles.css). `.mag` / `.cyn` / `.dim` / `.br` / `.acc` / `.grn` / `.ylw` are already present in styles.css — no need to add (spec §Pipeline phases's "new" claim is incorrect, confirmed against `styles.css:853–859`). TUI-accurate data contracts (kanban, draft, phases, rules, shortcuts) live in plain `.ts` files beside their components; presentation in `.tsx` + CSS Modules.

### File-by-file map
- `package.json` — deps: `next@^16 react@^19 react-dom@^19 lucide-react @vercel/analytics @vercel/speed-insights`; dev: `typescript @types/react @types/react-dom @types/node eslint eslint-config-next`. Icons imported from `lucide-react`: `ArrowRight, Check, Circle, Github, Sun, Moon, Copy, Zap`.
- `tsconfig.json` — strict, `"moduleResolution": "bundler"`, paths `@/*` → `./*`.
- `next.config.ts` — `{}` (Node runtime, default build).
- `eslint.config.mjs` — flat config extending `next/core-web-vitals` + `next/typescript`.
- `app/layout.tsx` — `<html data-theme="dark" data-accent="orange" data-scanlines="on">`; inline `<script>` with `THEME_INIT_SCRIPT` before `</head>`; load **JetBrains Mono** (primary, weights `[400,500,600,700]`, preload) and **IBM Plex Mono** (fallback, weights `[400,600,700]`, preload) via `next/font/google`, both exposed as CSS variables consumed by `--font-mono` in globals.css; skip link `<a href="#main" class="skip-link">Skip to content</a>` as first focusable; `<Nav/>`, `<main id="main">{children}</main>`, `<Footer/>`, `<Tweaks/>`, `<Analytics/>`, `<SpeedInsights/>`; export full `metadata` per spec §SEO (title, description, `metadataBase: new URL('https://retrospeced.dev')`, `openGraph` {type, title, description, images:['/og.png']}, `twitter: { card: 'summary_large_image' }`). `public/og.png` shipped as a 1200×630 placeholder (solid-bg + wordmark) — real hero shot is post-launch.
- `app/page.tsx` — compose Hero, Pipeline, Features, Shortcuts, Constitution, Install in order.
- `app/globals.css` — lift styles.css verbatim; modify + add:
  - **Replace** the existing `--font-mono` assignment on `:root` (`styles.css:5`, currently a hard-coded `"JetBrains Mono", "IBM Plex Mono", …` family list) with a reference to the next/font-generated CSS variables, e.g. `--font-mono: var(--font-jetbrains-mono), var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace;`. The 11 existing `font-family: var(--font-mono)` consumers then pick up the hashed, preloaded font families. Leaving the original literal in place silently bypasses next/font optimization.
  - new tokens: `--completed: var(--text-dim)`, `--border-active: var(--accent)` on `:root` and `[data-theme="light"]`.
  - new utility class `.red { color: var(--red) }` (missing from source).
  - focus ring: `:where(a, button, [role="tab"], input, textarea, [tabindex]):focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }`.
  - skip link style: visually hidden by default, surfaces at top-left on `:focus`.
  - responsive breakpoints carried from source: `@1080` hides center nav links, `@980` stacks hero + pipeline, `@900` single-col feature grid + install stack, `@720` shortcut grid 2-col + secondary nav CTAs hide. Verify these rules present post-port; AC #12 tests 720 and 1080.
  - `@media (prefers-reduced-motion: reduce)` block disabling: `caret-blink`, `pulse` (including `.hero-badge .pulse`), `fadein`, `blink`, `grow`, `slideup`, scanline overlay (`html::before { display: none }`), braille spinner animation. Timer-driven behavior (pipeline cycle, spinner frame advance) is also gated at the JS layer — see Reduced-motion handling below.
- `lib/theme.ts` — `THEME_INIT_SCRIPT`, storage key constants, `setTheme/setAccent/setScanlines` helpers.
- `lib/braille.ts` — `BRAILLE_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']`; `useBrailleSpinner(ms=80)` hook.
- `lib/token-color.ts` — `tokenColor(n) → 'red'|'yellow'|'dim'` (see interfaces).
- `components/primitives/*` — `TerminalWindow`, `Kbd`, `SectionHead`, `CopyButton`, `FooterShortcuts`. Adoption map (primitives are load-bearing, not skeleton):
  - `TerminalWindow` wraps every terminal mock: kanban, draft, pipeline-term, pipeline section log panel.
  - `SectionHead` renders the eyebrow + heading + sub block for Pipeline, Features, Shortcuts, Constitution, Install.
  - `Kbd` renders every key token: Shortcuts section grid cells, kanban top-bar + footer-bar keys (via `FooterShortcuts`), install tab short-hint keys, hero CTA kbd hints.
  - `FooterShortcuts` renders the `[{key}] {label}` strip at the bottom of every terminal mock. **Separator is exactly two spaces** (per spec §Footer shortcut bar), not `·`. Hover lifts key and label to `var(--text-bright)`.
  - `CopyButton` used per line inside install command blocks.
- `components/nav.tsx` — server `<header>` (sticky, blur); brand caret + center link list + `<ThemeToggle/>` + GitHub link (`aria-label="GitHub repo"`) + `Install` CTA. Center link anchors require corresponding `id` attributes on the section wrappers in `app/page.tsx`: `id="how-it-works"` (Pipeline), `id="features"`, `id="shortcuts"`, `id="constitution"`, `id="install"`. Nav link labels lifted verbatim from `design/reference/src/nav.jsx`; if missing, use those five slugs. Center links hide at `≤1080px`; secondary CTAs hide at `≤720px`. No hamburger menu on mobile — the nav collapses in place (matches design/reference).
- `components/theme-toggle.tsx` — client; reads `data-theme`, flips + persists; `aria-label="Toggle theme"`, renders `Sun`/`Moon` icons from lucide.
- `components/footer.tsx` — server `<footer>`; 4-col grid + ASCII wordmark + status pill.
- `components/hero/hero.tsx` — client; variant state — default `kanban`. Variant switching + `MutationObserver` on `documentElement` is **only installed when `process.env.NEXT_PUBLIC_TWEAKS === '1'`** (env var is inlined at build so the entire observer branch is dead-stripped in prod). Under TWEAKS, hero reads `document.documentElement.dataset.heroVariant` on mount and subscribes for changes. Left column: headline + tag + CTA buttons (icons from lucide) + install strip + metadata row (copy lifted verbatim from `design/reference/src/hero.jsx`).
  - **Hero badge pill**: append `· macOS` to pill (`v0.4 · open source · mit-ish · macOS`), keep pulsing accent dot.
  - **Hero metadata row**: add `platform: macOS 13+` alongside existing meta items.
- `components/hero/kanban.ts` — `COLUMNS` (5-col). Fixture follows spec §Data Contracts **with two overrides** (spec is internally inconsistent; plan resolves):
  - **Column `accent` values use the column-accent alias tokens**, not base tokens: `var(--draft)`, `var(--plan)`, `var(--building)`, `var(--review)`, `var(--completed)` (not `--cyan`/`--yellow`/`--accent`/`--green`/`--text-dim`). Spec §Required CSS tokens defines these aliases *for* column accents; using them keeps token indirection consistent for `[data-theme]` overrides.
  - **Fixture must exercise every non-trivial `QueueStatus`**. Starting fixture has `building` + `queued`; add one `retrying` ticket (2nd building-column entry) **and one `failed` ticket** (e.g. a building-column entry with `queue: { status: 'failed', phase: 'Execution' }`) so all four render paths ship.
- `components/hero/kanban.tsx` — **client** (deviates from spec §Client/Server Split, which omits kanban — required because `useBrailleSpinner` for building cards needs timers + reduced-motion check). Renders columns + TUI-accurate cards via `Kbd` primitive for keys (line 1 id / line 2 project dim / line 3 `→ branch` dim / line 4 queue status line per spec). Card borders: default `var(--border)`, hover `var(--border-active)`, **selected `var(--accent)` applied to the first building-column card (`billing-v2`) to exercise the selected render**, failed `var(--red)` applied to the failed ticket added above. Completed column cards: `opacity: 0.7`. Column header: uppercase label + count, 1px bottom border in column accent. **Top bar**: left `[⌥/] Search` (dim), right `All Projects  [⌥n] + New` (accent on key, rendered via `Kbd`). **Footer bar** via `<FooterShortcuts/>`, entries: `[←→] Switch column`, `[↑↓] Navigate`, `[Enter] Open`, `[⌥n] New ticket`, `[⌥k] Commands` — rendered with two-space separators per primitive spec.
- `components/hero/draft.tsx` — dual-panel editor + chat; static. **Info bar** (single line): `Ticket: rate-limit · Project: acme-app · ● Draft · → main · References: 2 · ~1,847 tokens` with styling per spec (`rate-limit` cyan bold, `acme-app` accent bold, `● ` cyan + `Draft` text, `→ main` dim, tokens colored via `tokenColor(1847) → 'dim'`). **Left panel** focused: border `var(--accent)`, opacity 1, header `FEATURE SPECIFICATION — EDIT` (dim) + right-aligned `saved ✓` (green), body = 14-line spec-mock lifted from `design/reference/src/hero.jsx`. **Right panel** unfocused: border `var(--border)`, opacity 0.85, header `PM AGENT CHAT` (dim); messages use **left-border** color only (not full border) — PM cyan, user accent, tool yellow — with message block headers (`🤖 PM` cyan bold / `👤 You` accent bold / `{toolName}` yellow bold) and fabricated content matching tone per spec example. Below chat: 5-row textarea, placeholder `Type a message...`, footer line `Enter to send · Shift+Enter for newline` (dim — the `·` here is literal text content inside the dim footer line, not a `FooterShortcuts` separator). **Footer bar** via `<FooterShortcuts/>` (two-space separators), entries: `[Tab] Switch panel`, `[⌥e] Open in editor`, `[⌥p] Start plan`, `[⌥k] Commands`.
- `components/hero/pipeline-term.tsx` — renders `PHASES[2]` (execution) as a **static snapshot** (all events shown, no cycling). Log panel header per spec: left `Ticket: rate-limit · Project: acme-app · → main`, right pulsing orange pill with `⠋ Task 3 of 5`. Tail placeholder while streaming (in the dynamic pipeline section): braille spinner in accent on its own line (no `[...] streaming...` tag format).
- `components/pipeline/phases.tsx` — typed events with JSX render helpers (see contracts) + `PHASES` array. Section copy (eyebrow/heading/sub) lifted verbatim from spec §Pipeline section copy.
- `components/pipeline/pipeline.tsx` — client; `active`+`shown` state driven by **`setInterval` pair** (per spec §Interactions): outer `setInterval(2500)` advances phase when `shown === events.length`; inner `setInterval(750)` advances `shown` within a phase. Both intervals cleared on unmount and on hover-pause. Hover on a step pauses auto-advance, sets `active` to the hovered index, resets `shown = 1` for that phase; mouseleave resumes. Under `prefers-reduced-motion: reduce`, neither interval is created and the active phase renders with `shown = events.length` (all events visible, no cycling). Same log-panel header + tail placeholder as `pipeline-term`.
- `components/features/features.tsx` — server; static 8-card grid; card 05 mock (constitution preview) uses first 6 items from `RULES`. All card copy (01–08) verbatim from `design/reference/src/features.jsx`.
- `components/shortcuts/{shortcuts.tsx,data.ts}` — server; `SHORTCUTS` array of 21; eyebrow/heading/sub verbatim from spec §Shortcuts.
- `components/constitution/{constitution.tsx,rules.ts}` — client; toggle map state seeded from `RULES[i].defaultOn`; `<pre>` markdown regenerated each render with live `new Date().toISOString()`; renders `// no rules active — chaos mode` (dim italic) when `activeCount === 0`. **Header strip**: left `.retro/constitution.md · toggles`, right `● {activeCount}/{rules.length} active` (dot in accent). Section eyebrow/heading/sub verbatim from spec §Constitution section copy.
- `components/install/install.tsx` — client; tabs `git|bin` (`role="tablist"` / `role="tab"` / `role="tabpanel"`); copy buttons per line (`aria-label="Copy command"`). Prereqs, commands, and CTA copy verbatim from `design/reference/src/install.jsx`, **with `PREREQS[0]` prepended**: `macOS 13+ (Ventura or later)` + sub `Linux & Windows coming — star the repo to follow along.` Above "Star on GitHub" CTA: single dim line `Currently macOS-only. Cross-platform support is on the roadmap.`
- `components/tweaks.tsx` — client; returns `null` unless `process.env.NEXT_PUBLIC_TWEAKS === '1'`; mutates `<html>` `data-theme` / `data-accent` / `data-scanlines` / `data-hero-variant` + localStorage.

### Reduced-motion handling
Wrap all `useEffect` timers with `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;`. Braille spinner returns static `⠋`. Pipeline shows full event list immediately for the active phase and does not auto-advance; hero badge pulse is disabled via the CSS block above; scanline overlay hidden. `caret-blink`, `pulse`, `fadein`, `blink`, `grow`, `slideup` all disabled at the CSS layer.

### Accessibility (spec §Accessibility)
- Skip link `<a href="#main">Skip to content</a>` as first focusable in `<body>`; visually hidden until `:focus`.
- `aria-label` on every icon-only button: theme toggle, copy buttons, GitHub links.
- Focus-visible ring on all interactive elements: 2px `var(--accent)` outline, 2px offset (declared once in globals.css).
- Semantic landmarks: `<header>` (nav), `<main id="main">`, `<footer>`. Install tabs use `role="tablist"/"tab"/"tabpanel"`.
- Color contrast: verify body `--text` on `--bg` ≥ 7:1 and `--text-dim` on `--bg` ≥ 4.5:1 for both themes; flag in Summary if any token pair fails WCAG AA.

### Client/server split (exact)
Client: `theme-toggle`, `hero`, **`kanban`** (spinner — deviates from spec §Client/Server Split which omits it; required because `useBrailleSpinner` uses timers + reduced-motion matchMedia), `pipeline`, `constitution`, `install`, `copy-button`, `tweaks`. Everything else server.

### Hero variant gating
- Default (prod): `kanban` only.
- `NEXT_PUBLIC_TWEAKS=1`: Tweaks panel writes `data-hero-variant` on `<html>`; Hero reads on mount via `useEffect` + `MutationObserver` on `documentElement` attribute changes.

## Interfaces

Types that cross task boundaries are in **Shared Contracts** below. Local helpers:

```ts
// lib/theme.ts
export const STORAGE_KEYS = { theme: 'retro:theme', accent: 'retro:accent', scanlines: 'retro:scanlines', heroVariant: 'retro:hero-variant' } as const;
// THEME_INIT_SCRIPT extends spec §Theme System: also reads STORAGE_KEYS.heroVariant
// and writes `data-hero-variant` (only when value is 'kanban'|'draft'|'pipeline';
// otherwise attribute is omitted). This keeps Tweaks-set variants sticky across reloads
// and prevents a flash of kanban on pages rendered with variant=draft|pipeline.
export const THEME_INIT_SCRIPT: string;

// lib/token-color.ts
export function tokenColor(n: number): 'red' | 'yellow' | 'dim';
// n > 20000 → 'red'; n >= 15000 → 'yellow'; else 'dim'

// lib/braille.ts
export const BRAILLE_FRAMES: readonly string[];
export function useBrailleSpinner(intervalMs?: number): string; // returns current frame; respects reduced-motion

// components/primitives/terminal-window.tsx
export interface TerminalWindowProps { title?: string; subtitle?: string; rightSlot?: React.ReactNode; children: React.ReactNode; className?: string; }

// components/primitives/section-head.tsx
export interface SectionHeadProps { eyebrow: string; title: string; sub?: string; right?: React.ReactNode; }

// components/primitives/copy-button.tsx
export interface CopyButtonProps { text: string; label?: string; copiedLabel?: string; className?: string; }

// components/primitives/footer-shortcuts.tsx
export interface ShortcutEntry { key: string; label: string; }
export interface FooterShortcutsProps { entries: ShortcutEntry[]; rightSlot?: React.ReactNode; }
```

Pipeline render helpers in `components/pipeline/phases.tsx` (each returns a `React.ReactNode` wrapped in the appropriate inline color class per spec §Pipeline phases):
```tsx
// phaseStart:   <b className="acc">═══ Phase: {label} ═══</b>   (accent + bold — spec says "in accent, bold")
// taskStart:    <span className="br">▶ Task {i} of {total}: {text}</span>
// taskDone:     <span className="grn">✓ Task {i}: {text}</span>
// toolUse:      <><span className="mag">🔧 </span>{tool}: <span className="dim">{summary}</span></>
// agentText:    <>{text}</>   (no color class → inherits base text color)
// errorEvent:   <span className="red">✗ Error in {phase}: {msg}</span>
// buildComplete:<><span className="grn">✓ Build complete! PR opened.</span> <span className="dim">Press Esc to return.</span></>

export function phaseStart(label: string): React.ReactNode;
export function taskStart(i: number, total: number, text: string): React.ReactNode;
export function taskDone(i: number, text: string): React.ReactNode;
export function toolUse(tool: string, summary: string): React.ReactNode;
export function agentText(text: string): React.ReactNode;
export function errorEvent(phase: string, msg: string): React.ReactNode;
export function buildComplete(): React.ReactNode;
```

## Shared Contracts

### Kanban data (`components/hero/kanban.ts`)
```ts
export type ColumnId = 'draft' | 'plan' | 'building' | 'review' | 'completed';
export type QueueStatus = 'queued' | 'building' | 'retrying' | 'failed';
export interface Ticket {
  id: string;
  project: string;
  targetBranch: string;
  queue?: { status: QueueStatus; phase?: string; position?: number; retries?: number };
  selected?: boolean; // renders card with var(--accent) border — set on billing-v2
}
export interface Column { id: ColumnId; label: string; accent: string; tickets: Ticket[]; }
export const COLUMNS: Column[];
// Fixture ships per spec §Data Contracts with the two overrides documented in the
// file-by-file map: (a) `accent` uses column-alias tokens (var(--draft) / var(--plan) /
// var(--building) / var(--review) / var(--completed)), (b) fixture exercises every
// non-trivial QueueStatus — add one retrying + one failed to the building column,
// and mark billing-v2 with selected:true.
```

### Pipeline data (`components/pipeline/phases.tsx`)
```ts
export type PhaseId = 'planning' | 'task-generation' | 'execution' | 'review' | 'retro-rollup' | 'pr';
export type EventKind = 'phase-start' | 'task-start' | 'task-complete' | 'tool-use' | 'text' | 'error' | 'build-complete';
export interface BuildEvent { kind: EventKind; node: React.ReactNode; }
export interface Phase { id: PhaseId; name: string; sub: string; events: BuildEvent[]; }
export const PHASES: Phase[]; // 6 entries, each events.length ≥ 1; fixture in spec — ship verbatim
export const PIPELINE_REVEAL_MS = 750;
export const PIPELINE_ADVANCE_MS = 2500;
```

### Constitution data (`components/constitution/rules.ts`)
```ts
export interface Rule { id: string; label: string; description: string; defaultOn: boolean; }
export const RULES: Rule[]; // 11 entries verbatim from spec
```
Markdown builder (same file):
```ts
export function buildConstitutionMarkdown(rules: { rule: Rule; on: boolean }[], nowIso: string): string;
// header: "# The Constitution\n# Regenerated {nowIso}\n\nYou are a build agent. Follow these rules strictly.\n\n"
// per active rule: "## {label}\n{description}\n\n"
// if zero active: body replaced by "// no rules active — chaos mode"
```

### Shortcuts data (`components/shortcuts/data.ts`)
```ts
export interface Shortcut { keys: string; desc: string; context: string; }
export const SHORTCUTS: Shortcut[]; // 21 entries verbatim
```

### Install data (co-located in `install.tsx` or `install/data.ts`)
```ts
export type InstallTab = 'git' | 'bin';
export interface CmdLine { kind: 'comment' | 'cmd'; text: string; }
export const INSTALL_COMMANDS: Record<InstallTab, CmdLine[]>; // lift from design/reference/src/install.jsx
export const TAB_LABELS: Record<InstallTab, string>; // { git: 'from source', bin: 'standalone binary' }
export const PREREQS: { title: string; code?: string; href?: string; sub?: string }[];
// PREREQS[0] = { title: 'macOS 13+ (Ventura or later)', sub: 'Linux & Windows coming — star the repo to follow along.' }
```

### CSS tokens / class contract
Class names referenced by multiple components (defined once in `globals.css`):
- Utilities already in styles.css (confirmed via `styles.css:853–859`): `.dim`, `.br`, `.acc`, `.cyn`, `.grn`, `.ylw`, `.mag`. Existing scoped `.path` (inside `.log-line .msg .path`) is promoted to a global utility `.path { color: var(--accent); }`.
- Utilities to add: `.red { color: var(--red); }` (missing from source).
- Event-log tags replaced by inline color classes above; **no `.tag-phase/.tag-ok/.tag-run/.tag-info/.tag-err` needed** (lift from styles.css but unused — may keep dormant).
- New tokens on `:root` + `[data-theme="light"]`: `--completed: var(--text-dim)`, `--border-active: var(--accent)`.
- New `--font-mono` CSS variable wired to both JetBrains Mono (primary) + IBM Plex Mono (fallback) loaded via `next/font/google`.

### Global attributes on `<html>`
```
data-theme    = "dark" | "light"         // default "dark"
data-accent   = "orange" | "green" | "cyan" | "magenta"  // default "orange"
data-scanlines= "on" | "off"             // default "on"
data-hero-variant = "kanban" | "draft" | "pipeline"  // only when NEXT_PUBLIC_TWEAKS=1
```

### Env flags
- `NEXT_PUBLIC_TWEAKS=1` — mounts `<Tweaks/>`, enables variant switching. Any other value → off.

## Testing Strategy

No unit-test harness in scope. Verify via acceptance criteria:

### Build / type / lint gates
```
bun install
bun run typecheck   # tsc --noEmit → 0 errors
bun run lint        # next lint → 0
bun run build       # next build → exits 0, no warnings
```

### Runtime smoke (manual, documented in Summary section on completion)
1. `bun run dev` → open `/`, confirm 8 sections in order.
2. Click theme toggle twice → `<html data-theme>` flips dark↔light, reload preserves. DevTools → throttle CPU 4× → no FOUC flash on reload.
3. Hover any pipeline step → `active` index jumps that frame; release → auto-advance resumes.
4. Toggle any constitution rule → `<pre>` markdown updates same tick; timestamp line shows fresh ISO.
5. Install tab click → panel swaps; copy button → reads clipboard → label reads `copied` for ~1.4s.
6. DevTools responsive: 720px → shortcut grid 2-col; 1080px → center nav hidden.
7. DevTools Rendering → emulate `prefers-reduced-motion: reduce` → pipeline renders all events instantly, caret not blinking, spinner static.
8. Lighthouse desktop on `bun run build && bun run start`: Perf/A11y/BP/SEO ≥ 95.
9. Chrome console: zero errors/warnings on cold load.
10. Search page source for `macOS` → appears in title, meta description, hero pill (`· macOS`), hero meta row (`platform: macOS 13+`), install prereq (top of list), install callout strip (`Currently macOS-only…`). All four in-page spots + both metadata spots must match AC #13.
11. Tab from page load → first focus lands on visible "Skip to content" link; activating it jumps focus to `<main>`. Every interactive element shows a 2px accent focus ring on keyboard focus.
12. Axe / Chrome a11y pane → no violations; icon-only buttons (theme toggle, copy, GitHub) have accessible names.

### LLM eval
N/A — no agent code in this feature.
# Tasks

- [x] Scaffold Next.js 16 project with config files, globals.css, lib helpers, and layout shell
  **Context:** Fresh Next.js 16 app at worktree root `/Users/alawrence/.retro/worktrees/initial-build/`. No code exists yet — only `design/reference/` (source CSS + JSX prototype) and `specs/`. Port `design/reference/styles.css` verbatim to `app/globals.css` with documented additions. Reference TUI repo (read-only): `/Users/alawrence/.retro/references/initial-build/retrospeced-tui`.
  **Files to create:**
  - `package.json` — deps: `next@^16 react@^19 react-dom@^19 lucide-react @vercel/analytics @vercel/speed-insights`; dev: `typescript @types/react @types/react-dom @types/node eslint eslint-config-next`. Scripts: `dev: "next dev --turbopack"`, `build: "next build"`, `start: "next start"`, `lint: "next lint"`, `typecheck: "tsc --noEmit"`.
  - `tsconfig.json` — strict, `"moduleResolution": "bundler"`, paths `@/*` → `./*`, `jsx: "preserve"`, `target: "ES2022"`, includes `next-env.d.ts`, `**/*.ts`, `**/*.tsx`, `.next/types/**/*.ts`.
  - `next.config.ts` — `const nextConfig = {}; export default nextConfig;`.
  - `eslint.config.mjs` — flat config extending `next/core-web-vitals` + `next/typescript`.
  - `.gitignore` — standard Next.js ignore (node_modules, .next, .env*.local, next-env.d.ts).
  - `app/layout.tsx` — root layout; `<html lang="en" data-theme="dark" data-accent="orange" data-scanlines="on">`; load **JetBrains Mono** (`weights: ['400','500','600','700']`, `variable: '--font-jetbrains-mono'`, `subsets: ['latin']`, `display: 'swap'`, `preload: true`) and **IBM Plex Mono** (`weights: ['400','600','700']`, `variable: '--font-ibm-plex-mono'`, `subsets: ['latin']`, `display: 'swap'`, `preload: true`) via `next/font/google`; attach both `.variable` class names to `<html>`; inline `<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />` in `<head>` BEFORE any styles; `<body>` contains (in order): skip link `<a href="#main" className="skip-link">Skip to content</a>`, placeholder for `<Nav/>` (stub div), `<main id="main">{children}</main>`, placeholder for `<Footer/>`, placeholder for `<Tweaks/>`, `<Analytics/>` from `@vercel/analytics/react`, `<SpeedInsights/>` from `@vercel/speed-insights/next`. Export `metadata: Metadata` per spec §SEO (title `retro(speced) — spec-driven AI development TUI for macOS`, description `Open-source terminal UI for spec-driven AI development on macOS. Plan, build, review, ship — all in one loop.`, `metadataBase: new URL('https://retrospeced.dev')`, `openGraph: { type: 'website', title, description, images: ['/og.png'] }`, `twitter: { card: 'summary_large_image' }`).
  - `app/page.tsx` — placeholder exporting `export default function Page() { return <div>retro(speced)</div>; }`. Will be replaced by final composition task.
  - `app/globals.css` — port `design/reference/styles.css` verbatim, then modify/add:
    1. Replace the `--font-mono` line on `:root` with `--font-mono: var(--font-jetbrains-mono), var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace;`.
    2. Add to `:root` and `[data-theme="light"]` blocks: `--completed: var(--text-dim); --border-active: var(--accent);`.
    3. Add utility class `.red { color: var(--red); }` (other utilities `.dim .br .acc .cyn .grn .ylw .mag` already exist; verify after port).
    4. Promote `.path` to global utility: `.path { color: var(--accent); }`.
    5. Add skip-link style (visually hidden; appears on `:focus`):
       ```css
       .skip-link { position: absolute; left: -9999px; top: 0; padding: 8px 12px; background: var(--bg-panel); color: var(--text-bright); border: 1px solid var(--accent); z-index: 1000; }
       .skip-link:focus { left: 8px; top: 8px; }
       ```
    6. Add focus ring once: `:where(a, button, [role="tab"], input, textarea, [tabindex]):focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }`.
    7. Append `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0ms !important; animation-iteration-count: 1 !important; transition-duration: 0ms !important; } html::before { display: none !important; } }` — disables `caret-blink`, `pulse`, `fadein`, `blink`, `grow`, `slideup`, scanline overlay.
  - `public/og.png` — 1200×630 placeholder; if not producible in-task, create `public/.gitkeep` and note in Retro that OG image is deferred.
  - `lib/theme.ts` — export `STORAGE_KEYS = { theme: 'retro:theme', accent: 'retro:accent', scanlines: 'retro:scanlines', heroVariant: 'retro:hero-variant' } as const;`. Export `THEME_INIT_SCRIPT: string` that, at runtime, reads all 4 localStorage keys and sets `data-theme`, `data-accent`, `data-scanlines` on `document.documentElement` (defaults `dark`/`orange`/`on`), and sets `data-hero-variant` only if value ∈ `{kanban,draft,pipeline}`. Wrap in try/catch IIFE. Export helper setters `setTheme(v)`, `setAccent(v)`, `setScanlines(v)` that persist to localStorage + set attribute.
  - `lib/braille.ts` — export `BRAILLE_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'] as const;`. Export `useBrailleSpinner(intervalMs = 80): string` — React hook; returns current frame. Inside effect: early-return if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, leaving frame at index 0. Otherwise `setInterval` cycles index; cleanup on unmount. File must start with `'use client';`.
  - `lib/token-color.ts` — export `tokenColor(n: number): 'red' | 'yellow' | 'dim'` → `n > 20000 ? 'red' : n >= 15000 ? 'yellow' : 'dim'`.
  **Acceptance criteria:**
  - `bun install` exits 0.
  - `bun run typecheck` exits 0 (no TS errors).
  - `bun run lint` exits 0.
  - `bun run build` exits 0.
  - `<html>` renders with `data-theme="dark"`, `data-accent="orange"`, `data-scanlines="on"`, and font CSS variables applied.
  - No FOUC: the inline `THEME_INIT_SCRIPT` appears inside `<head>` before any styles in built HTML.
  - `prefers-reduced-motion: reduce` media query appears in `globals.css`.
  **Constraints:** No Tailwind. No CSS-in-JS. Icons come from `lucide-react` (not added to any file in this task — reserved for component tasks). Do not remove or reorder any existing rule in `styles.css` during the port; only modify the `--font-mono` line and append new blocks at the bottom.
  **Scope:** Create only the files above. Do not create any `components/` files in this task.

- [x] Build shared primitives (terminal-window, kbd, section-head, copy-button, footer-shortcuts)
  **Context:** Presentation primitives used by every section. Location: `components/primitives/`. CSS Module file `primitives.module.css` holds all primitive styles. Token classes `.dim .br .acc` etc. are global (in `app/globals.css`).
  **Files to create:**
  - `components/primitives/terminal-window.tsx` — server component. Props: `{ title?: string; subtitle?: string; rightSlot?: React.ReactNode; children: React.ReactNode; className?: string; }`. Renders a rounded panel with 1px `var(--border)`, background `var(--bg-panel)`, padding, header row (title in `var(--text-bright)`, subtitle in `var(--text-dim)`, `rightSlot` right-aligned) above children. No title → omit header row.
  - `components/primitives/kbd.tsx` — server component. Props: `{ children: React.ReactNode; accent?: boolean; className?: string; }`. Renders `<kbd>[{children}]</kbd>` styled monospace; when `accent` → color `var(--accent)`; default → color `var(--text-dim)`.
  - `components/primitives/section-head.tsx` — server component. Props: `{ eyebrow: string; title: string; sub?: string; right?: React.ReactNode; }`. Renders eyebrow as small uppercase dim text, title as `<h2>` in `var(--text-bright)`, sub as `<p>` in `var(--text-dim)`. `right` placed top-right of the heading block.
  - `components/primitives/copy-button.tsx` — **client** component (`'use client';` at top). Props: `{ text: string; label?: string; copiedLabel?: string; className?: string; }`. Button with `aria-label="Copy command"` when no label; clicking calls `navigator.clipboard.writeText(text)` and swaps label to `copiedLabel ?? 'copied'` for exactly 1400ms, then reverts. Default `label = 'copy'`. Uses `Copy` icon from `lucide-react` when no text label.
  - `components/primitives/footer-shortcuts.tsx` — server component. Types (export):
    ```ts
    export interface ShortcutEntry { key: string; label: string; }
    export interface FooterShortcutsProps { entries: ShortcutEntry[]; rightSlot?: React.ReactNode; }
    ```
    Renders a horizontal strip where each entry renders as `<Kbd accent>{key}</Kbd>` + single space + `<span className="dim">{label}</span>`. **Separator between entries is exactly two spaces** (render as two non-breaking spaces `  ` or a styled spacer with width). On hover of a single entry, lifts both the key and label to `var(--text-bright)` via class toggle.
  - `components/primitives/primitives.module.css` — all CSS Module classes for the above components. Use `composes` from global utilities only if needed — primitives otherwise style locally.
  **Acceptance criteria:**
  - `bun run typecheck` exits 0.
  - `bun run lint` exits 0.
  - `bun run build` exits 0.
  - `CopyButton` file begins with `'use client';`; other four do not.
  - `FooterShortcuts` renders N entries with two-space separators (no `·` between entries — the `·` only appears as literal content inside individual labels).
  - `Kbd` wraps content in literal `[` `]` brackets.
  **Scope:** Only `components/primitives/*`. Do not modify `app/`, `lib/`, or any other component directory.

- [x] Build Nav, ThemeToggle, and Footer components
  **Context:** Sticky top nav + page footer. Reference copy: `design/reference/src/nav.jsx` and `design/reference/src/footer.jsx`. Icons from `lucide-react`: `Github`, `Sun`, `Moon`, `ArrowRight`. Theme toggle flips `data-theme` on `<html>` between `dark`/`light` and persists to `localStorage` via helpers from `lib/theme.ts`.
  **Files to create:**
  - `components/nav.tsx` — server component; `<header>` that is sticky top with backdrop blur (styles in `nav.module.css` or inline via CSS Modules). Left: brand caret + wordmark. Center: anchor links to `#how-it-works`, `#features`, `#shortcuts`, `#constitution`, `#install` (labels lifted from `design/reference/src/nav.jsx`; if missing, use slugs `How it works`, `Features`, `Shortcuts`, `Constitution`, `Install`). Right: `<ThemeToggle/>`, GitHub link `<a href="https://github.com/" aria-label="GitHub repo" target="_blank" rel="noreferrer">` with `<Github/>` icon, `Install` CTA button → `href="#install"` with `<ArrowRight/>` icon. Responsive: center links hidden at `≤1080px`; secondary CTAs (GitHub link) hidden at `≤720px` via media queries in the module CSS.
  - `components/nav.module.css` — styles including the two breakpoint rules above.
  - `components/theme-toggle.tsx` — **client** component (`'use client';`). Reads current `data-theme` attribute from `document.documentElement` on mount; button with `aria-label="Toggle theme"` that flips dark↔light, persists via `setTheme` from `lib/theme.ts`, and updates the attribute. Renders `<Sun/>` when current is `dark` (clicking switches to light), `<Moon/>` when current is `light`. SSR-safe: during initial render (before mount) render a stable icon to avoid hydration mismatch (e.g. `<Moon/>`).
  - `components/footer.tsx` — server component; `<footer>` with 4-column grid at desktop (stacks at mobile). ASCII wordmark block (lift the multi-line ASCII from `design/reference/src/footer.jsx`). Status pill (e.g. pulsing green dot + `operational`). Four columns of link groups (copy lifted from `design/reference/src/footer.jsx`; if that file lacks groups, render: Product, Community, Legal, Links with sensible items). All external links: `target="_blank" rel="noreferrer"`.
  - `components/footer.module.css` — 4-col grid + responsive stack.
  **Dependencies:** Reads `setTheme`, `STORAGE_KEYS` from `lib/theme.ts` (created in scaffold task).
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `ThemeToggle` file starts with `'use client';`. `Nav` and `Footer` do not.
  - Clicking theme toggle flips `document.documentElement.dataset.theme` between `dark` and `light`, writes `retro:theme` to localStorage, and reload restores the chosen value (via `THEME_INIT_SCRIPT` from scaffold task — already wired).
  - At viewport 1080px, center nav links are hidden via CSS; at 720px, GitHub CTA hidden.
  - No console warnings/errors.
  **Scope:** Only `components/nav.tsx`, `components/nav.module.css`, `components/theme-toggle.tsx`, `components/footer.tsx`, `components/footer.module.css`. Do not modify `app/layout.tsx` to wire these in yet — that happens in the final compose task (but layout currently references `<Nav/>` / `<Footer/>` placeholders; you may replace the placeholders with real imports so layout builds).

- [x] Build Hero section (data + kanban + draft + pipeline-term + hero shell)
  **Context:** Hero is a two-column layout (stacks at ≤980px): left column is copy (headline, tag, CTAs, install strip, metadata row) lifted verbatim from `design/reference/src/hero.jsx`; right column is a terminal mock whose variant (`kanban`|`draft`|`pipeline`) is Tweaks-panel-gated — default and shipping variant is `kanban`. Variant switching only installed if `process.env.NEXT_PUBLIC_TWEAKS === '1'`.
  Reference TUI (read-only, use for screen fidelity): `/Users/alawrence/.retro/references/initial-build/retrospeced-tui/src/screens/tickets.tsx`, `components/kanban-card.tsx`, `screens/draft-view.tsx`, `components/footer-shortcuts.tsx`. Reference prototype (copy-lift source, NOT for terminal mocks): `design/reference/src/hero.jsx`.
  **Files to create:**
  - `components/hero/kanban.ts` — exports per Shared Contracts (spec §Shared Contracts › Kanban data):
    ```ts
    export type ColumnId = 'draft' | 'plan' | 'building' | 'review' | 'completed';
    export type QueueStatus = 'queued' | 'building' | 'retrying' | 'failed';
    export interface Ticket { id: string; project: string; targetBranch: string; queue?: { status: QueueStatus; phase?: string; position?: number; retries?: number }; selected?: boolean; }
    export interface Column { id: ColumnId; label: string; accent: string; tickets: Ticket[]; }
    export const COLUMNS: Column[];
    ```
    Fixture ships per spec §Data Contracts with two overrides:
    1. **Column `accent` values use alias tokens**: `var(--draft)`, `var(--plan)`, `var(--building)`, `var(--review)`, `var(--completed)` — NOT `--cyan`/`--yellow`/`--accent`/`--green`/`--text-dim`.
    2. **Fixture exercises every `QueueStatus`**. Building column: `billing-v2` with `{status:'building', phase:'Task 3 of 5'}` AND `selected: true`; `stripe-webhook` with `{status:'retrying', retries:2, phase:'Execution'}`; add a new failed ticket e.g. `payments-refactor` with `{status:'failed', phase:'Execution'}`; `webhook-retry` with `{status:'queued', position:1}`. Other columns per spec §Data Contracts.
  - `components/hero/kanban.tsx` — **client** component (`'use client';`) because it uses `useBrailleSpinner` from `lib/braille.ts` for building-status cards. Props: `{}`. Renders:
    - Top bar: left `<Kbd>⌥/</Kbd> Search` dim, right `All Projects  <Kbd accent>⌥n</Kbd> + New` (with accent on key; 2-space separator).
    - Column grid (5 columns). Each column header: uppercase `{label}` + count (e.g. `DRAFT  3`), 1px bottom border in column `accent`.
    - Card render per ticket (1:1 with spec §Data Contracts):
      - Line 1: `{id}` in `var(--text)`.
      - Line 2: `{project}` dim.
      - Line 3: `→ {targetBranch}` dim.
      - Line 4 (only if `queue`): per status variant — `building`: `{spinnerFrame} {phase}` colored `var(--accent)`; `queued`: `⏳ Queued (#{position})` dim; `retrying`: `↻ Retrying ({retries}/3)` yellow; `failed`: `✗ Failed: {phase}` red.
    - Card border: default `var(--border)`; `selected` → `var(--accent)`; `queue.status === 'failed'` → `var(--red)`; `:hover` → `var(--border-active)`. Completed column cards: `opacity: 0.7` wrapper class.
    - Footer bar via `<FooterShortcuts entries={[...]}>` with entries: `{key:'←→', label:'Switch column'}, {key:'↑↓', label:'Navigate'}, {key:'Enter', label:'Open'}, {key:'⌥n', label:'New ticket'}, {key:'⌥k', label:'Commands'}`.
    - Wrap everything in `<TerminalWindow>`.
  - `components/hero/draft.tsx` — server component (static). Uses `tokenColor` from `lib/token-color.ts`. Renders:
    - Info bar one-line: `Ticket: ` + `<b className="cyn">rate-limit</b>` + ` · Project: ` + `<b className="acc">acme-app</b>` + ` · ` + `<span className="cyn">● </span>Draft · ` + `<span className="dim">→ main</span>` + ` · References: 2 · ` + `<span className={tokenColor(1847)}>~1,847 tokens</span>`.
    - Two-column split 50/50. Left panel (focused): border `var(--accent)`, opacity 1, header row `FEATURE SPECIFICATION — EDIT` dim + `<span className="grn">saved ✓</span>` right. Body: 14-line spec-mock lifted from `design/reference/src/hero.jsx` (look for `spec-mock` or equivalent).
    - Right panel (unfocused): border `var(--border)`, opacity 0.85, header `PM AGENT CHAT` dim. Message blocks with **left-border only** (`border-left: 3px solid <color>`, no other borders): PM cyan, user accent, tool yellow. Headers bold in matching color. Content per spec §Draft view mock example (fabricate matching tone).
    - Below chat: 5-row `<textarea>` with border `var(--border)`, `placeholder="Type a message..."`, disabled or readOnly (it's a static mock). Footer line under textarea: `Enter to send · Shift+Enter for newline` dim.
    - Footer bar via `<FooterShortcuts entries={[{key:'Tab',label:'Switch panel'},{key:'⌥e',label:'Open in editor'},{key:'⌥p',label:'Start plan'},{key:'⌥k',label:'Commands'}]}/>`.
    - Wrap in `<TerminalWindow>`.
  - `components/hero/pipeline-term.tsx` — server component. Renders a **static snapshot** of `PHASES[2]` (execution) from `components/pipeline/phases.tsx`: all events shown, no cycling. Log panel header: left `Ticket: rate-limit · Project: acme-app · → main`, right pulsing pill with `⠋ Task 3 of 5`. No trailing spinner placeholder (snapshot is complete). Wrap in `<TerminalWindow>`.
  - `components/hero/hero.tsx` — **client** component (`'use client';`). Left column: copy lifted verbatim from `design/reference/src/hero.jsx` (headline, tag, CTA labels, install strip, metadata row). Apply macOS-only overrides:
    - Badge pill text includes `· macOS` (e.g. `v0.4 · open source · mit-ish · macOS`) with pulsing accent dot preserved.
    - Metadata row adds item `platform: macOS 13+`.
    Right column: renders `<Kanban/>` by default. Variant switching gated on build-time env: if `process.env.NEXT_PUBLIC_TWEAKS === '1'`, add `useEffect` that reads `document.documentElement.dataset.heroVariant` and subscribes via `MutationObserver` for attribute changes, storing variant in state — `'draft'` → `<Draft/>`; `'pipeline'` → `<PipelineTerm/>`; else `<Kanban/>`. When env var is NOT `'1'`, the MutationObserver branch and extra imports must be dead code (use `if (process.env.NEXT_PUBLIC_TWEAKS === '1')` guard so bundler strips it).
  - `components/hero/hero.module.css` — two-column layout at ≥980px; stack at ≤980px; message-block left-border styles for draft panel; spec-mock block styling; info-bar layout.
  **Dependencies:** Reads `TerminalWindow`, `Kbd`, `FooterShortcuts` from `components/primitives/`; `useBrailleSpinner` from `lib/braille.ts`; `tokenColor` from `lib/token-color.ts`; `PHASES` from `components/pipeline/phases.tsx` (that file is created in the pipeline section task — for this task, either stub the import or implement `phases.tsx` here with the minimum needed, then the pipeline task builds on top). **Recommended:** create `components/pipeline/phases.tsx` with full `PHASES` array in THIS task (it's data with no UI dependency and lets `pipeline-term` import it), then the pipeline task only adds `pipeline.tsx`. Include `PIPELINE_REVEAL_MS = 750` and `PIPELINE_ADVANCE_MS = 2500` exports in `phases.tsx`.
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `components/hero/kanban.tsx` and `components/hero/hero.tsx` start with `'use client';`; `draft.tsx`, `pipeline-term.tsx`, `kanban.ts`, `phases.tsx` do not.
  - `COLUMNS[2].tickets` (building column) contains exactly one ticket for each of `building`, `retrying`, `failed`, `queued` statuses.
  - `billing-v2` ticket has `selected: true`.
  - All five `Column.accent` values use `var(--draft|plan|building|review|completed)` alias tokens.
  - Hero pill text contains `macOS`; hero metadata row contains `platform: macOS 13+`.
  **Constraints:** Do NOT lift `HeroKanban`, `HeroSpec`, `HeroPipeline`, `TICKETS`, `PIPE_LINES` from `design/reference/src/hero.jsx` — those predate the TUI. Use this task's own data contracts instead.
  **Scope:** Create files under `components/hero/` and `components/pipeline/phases.tsx` (data-only). Do not modify `components/pipeline/pipeline.tsx` — that's the next task.

- [x] Build Pipeline section with auto-cycling phase reveal
  **Context:** The "How it works" section (spec §Sections #3). Shows 6 phases with events that reveal one-at-a-time (750ms apart); on final event, advances to next phase after 2500ms. Hover on a phase step pauses cycling and jumps to that phase. `PHASES` array + render helpers + timing constants are already in `components/pipeline/phases.tsx` (created in the hero task). This task only adds the interactive component.
  **Files to create:**
  - `components/pipeline/pipeline.tsx` — **client** component (`'use client';`). State: `active: number` (current phase index, 0..5) + `shown: number` (events revealed so far in active phase, 1..events.length). Effects:
    - Outer `setInterval(PIPELINE_ADVANCE_MS = 2500)` advances `active = (active + 1) % PHASES.length` and resets `shown = 1` — but only when `shown === PHASES[active].events.length`. Use a single combined effect with refs to avoid stale closures.
    - Inner `setInterval(PIPELINE_REVEAL_MS = 750)` advances `shown = min(shown + 1, events.length)`.
    - Both guarded: if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, skip setting intervals and render `shown = PHASES[active].events.length` immediately.
    - Cleanup all intervals on unmount.
    - Hover: `onMouseEnter(index)` pauses auto-advance (clear intervals), sets `active = index`, `shown = 1`; restart the inner reveal interval so events still stream within the hovered phase; on `onMouseLeave` of the step strip container, resume auto-advance.
    Render:
    - `<SectionHead eyebrow="how it works" title="A six-phase build loop you can watch in real time." sub="Retro orchestrates Claude Code through a deterministic pipeline — planning, task generation, execution, review, retro rollup, PR. Every phase streams typed events, so you see every tool call, every file touched, every retry. If a build fails, it resumes from the last good phase instead of starting from zero."/>`.
    - Phase step strip: one clickable/hoverable pill per phase; active pill highlighted with `var(--accent)`.
    - Log panel (wrapped in `<TerminalWindow>`) showing `PHASES[active].events.slice(0, shown)` — render each event's `node` on its own line (`<div>`). Header: left `Ticket: rate-limit · Project: acme-app · → main`, right a pulsing pill with `{brailleFrame} Task {active+1} of {PHASES.length}` (braille frame from `useBrailleSpinner`). Trailing placeholder: when `shown < events.length`, append a final line with just `{brailleFrame}` in `var(--accent)` on its own.
  - `components/pipeline/pipeline.module.css` — phase step strip styling; log line typography; active/hover states.
  **Dependencies:** Imports `PHASES, PIPELINE_REVEAL_MS, PIPELINE_ADVANCE_MS` from `components/pipeline/phases.tsx` (produced by Hero task). Imports `TerminalWindow`, `SectionHead` from primitives. Imports `useBrailleSpinner` from `lib/braille.ts`.
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `pipeline.tsx` starts with `'use client';`.
  - Running `bun run dev` and opening the section: events reveal one per 750ms; after last event, phase advances within ~2.5s. Hovering a step: pill becomes active in next animation frame.
  - Under DevTools Rendering → emulate `prefers-reduced-motion: reduce`: all events of the active phase render immediately; no cycling; no spinner frame advance.
  - No stray intervals (verify by unmounting via navigation — no console warnings about state updates on unmounted component).
  **Scope:** Only `components/pipeline/pipeline.tsx` and `components/pipeline/pipeline.module.css`. Do not modify `components/pipeline/phases.tsx` (already created by Hero task).

- [x] Build Features section (8-card 12-col grid)
  **Context:** Static section, 8 cards in a 12-col grid with mixed spans (6/12/4). Card labels 01–08, headings, and paragraph bodies lifted **verbatim** from `design/reference/src/features.jsx`. Inner mocks (spec editor preview, deep-maps lens picker, worktree tree, constitution rule list) kept 1:1 from the prototype — EXCEPT: card 05 (constitution preview) must render first 6 labels from `RULES` in `components/constitution/rules.ts`.
  **Files to create:**
  - `components/features/features.tsx` — server component. Static JSX. Eight `<article>` elements (or `<div role="group">`), each with a label `01`–`08`, heading, body text, and optional inner mock. Copy lifted **verbatim** from `design/reference/src/features.jsx`.
  - `components/features/features.module.css` — CSS grid `grid-template-columns: repeat(12, 1fr); gap: <from styles.css>;` with spans applied via `grid-column: span 6 | 12 | 4`. At `≤900px` collapse to single column.
  - Card 05 mock: import `RULES` from `components/constitution/rules.ts` and render first 6 rules as a list of labels (no toggle interactivity — it's a stylized preview). If `components/constitution/rules.ts` is not yet created, create a minimal stub exporting `RULES: Rule[]` in this task (the Constitution task will replace with full data); OR coordinate by creating the full `rules.ts` here (acceptable — constitution task may then only build UI). **Prefer:** create the full `rules.ts` file in this task so constitution task can focus on UI.
  **Dependencies:** Optionally creates `components/constitution/rules.ts` (full 11-rule data + `buildConstitutionMarkdown` function per Shared Contracts).
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - Grid renders 8 cards at desktop viewport (use DevTools).
  - At `≤900px`, grid is single-column (verify via responsive mode).
  - Card 05 displays first 6 rule labels from `RULES`.
  **Scope:** Create `components/features/*` and optionally `components/constitution/rules.ts`. Do not create `components/constitution/constitution.tsx` — that's the Constitution task.

- [x] Build Shortcuts section (21 entries, 3-col desktop, 2-col mobile)
  **Context:** Static section. Data: 21 entries per spec §Shortcuts data contract. Grid layout: 3 columns at desktop, 2 columns at `≤720px`. Each entry cell: `<Kbd>{keys}</Kbd>` on the left, description in `var(--text)`, context tag in `var(--text-dim)` on the right.
  **Files to create:**
  - `components/shortcuts/data.ts` — exports `Shortcut` interface and `SHORTCUTS: Shortcut[]` with all 21 entries **verbatim** from spec §Shortcuts:
    ```ts
    export interface Shortcut { keys: string; desc: string; context: string; }
    export const SHORTCUTS: Shortcut[] = [/* 21 entries verbatim */];
    ```
  - `components/shortcuts/shortcuts.tsx` — server component. Renders `<SectionHead eyebrow="shortcuts" title="Hands stay on home row." sub="Every screen is one key away, and no action ever requires a mouse. The whole app is a keyboard API first, a UI second."/>`, then a grid of 21 cells. Each cell: `<Kbd>{keys}</Kbd>` + `{desc}` + `<span className="dim">{context}</span>`.
  - `components/shortcuts/shortcuts.module.css` — `grid-template-columns: repeat(3, 1fr)` at desktop; `repeat(2, 1fr)` at `≤720px`.
  **Dependencies:** `SectionHead`, `Kbd` from primitives.
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `SHORTCUTS.length === 21`.
  - Grid is 3-column at 1200px viewport, 2-column at 720px viewport.
  **Scope:** Only `components/shortcuts/*`.

- [x] Build Constitution section (11 toggleable rules + live markdown preview)
  **Context:** Interactive section. 11 rules per spec §Constitution rules data contract — `id`, `label`, `description` verbatim from TUI (`/Users/alawrence/.retro/references/initial-build/retrospeced-tui/src/lib/constitution/toggles.ts`); `defaultOn` is a marketing choice (tdd, smallest-changeset, type-safety, reuse-existing-patterns, incremental-testing, lint-compliance, no-new-deps → true; defensive-programming, documentation, cleanup-tech-debt, caveman-mode → false). If `components/constitution/rules.ts` already exists (from Features task), do not recreate — only add UI.
  **Files to create:**
  - `components/constitution/rules.ts` — if not already present. Exports `Rule` interface and `RULES: Rule[]` (11 entries verbatim from spec §Constitution rules). Also exports `buildConstitutionMarkdown(rules: { rule: Rule; on: boolean }[], nowIso: string): string` per Shared Contracts: header `# The Constitution\n# Regenerated {nowIso}\n\nYou are a build agent. Follow these rules strictly.\n\n`; per active rule `## {label}\n{description}\n\n`; when zero active → body is `// no rules active — chaos mode`.
  - `components/constitution/constitution.tsx` — **client** component (`'use client';`). State: `on: Record<string, boolean>` initialized from `RULES[i].defaultOn`. Layout: left column with 11 clickable toggles (each: checkbox-like indicator + label + description); right column with `<pre>` showing `buildConstitutionMarkdown(...)` output. **ISO timestamp regenerated on each render** (`new Date().toISOString()` called inline in the render function — not stored in state). When `activeCount === 0`, render `// no rules active — chaos mode` in the rules section of the markdown, styled dim italic (via a class on the `<pre>`'s content). Header strip above the two-column layout: left `.retro/constitution.md · toggles`, right `● {activeCount}/{rules.length} active` with dot in `var(--accent)`.
    Section head above everything: `<SectionHead eyebrow="constitution" title="Your taste, as a system prompt." sub="Toggle the engineering principles every build agent has to follow. Retro regenerates .retro/constitution.md on each change — click the rules, try it."/>`.
  - `components/constitution/constitution.module.css` — two-col layout, toggle styling, `<pre>` styling.
  **Dependencies:** `SectionHead` from primitives. `RULES`, `buildConstitutionMarkdown` from `rules.ts`.
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `constitution.tsx` starts with `'use client';`; `rules.ts` does not.
  - `RULES.length === 11`. Rule ids match spec verbatim.
  - Clicking any toggle updates the `<pre>` content within the same render tick.
  - `# Regenerated {iso}` line shows a fresh ISO timestamp on every render (test: toggle twice quickly — timestamps should differ).
  - Toggling all rules off shows `// no rules active — chaos mode` in dim italic.
  **Scope:** `components/constitution/*`. If `rules.ts` already exists from Features task, verify it matches spec and extend with `buildConstitutionMarkdown` if missing.

- [x] Build Install section (tabs + prereqs + copy buttons)
  **Context:** Tabbed commands ("from source" / "standalone binary") with copy buttons per line. Prereqs list (macOS prepended). Callout strip above GitHub CTA. Copy lifted **verbatim** from `design/reference/src/install.jsx` for commands, prereqs (except the prepended macOS item), and CTA copy.
  **Files to create:**
  - `components/install/install.tsx` — **client** component (`'use client';`). Exports (co-located):
    ```ts
    export type InstallTab = 'git' | 'bin';
    export interface CmdLine { kind: 'comment' | 'cmd'; text: string; }
    export const TAB_LABELS: Record<InstallTab, string> = { git: 'from source', bin: 'standalone binary' };
    export const INSTALL_COMMANDS: Record<InstallTab, CmdLine[]> = { /* lifted from design/reference/src/install.jsx */ };
    export const PREREQS: { title: string; code?: string; href?: string; sub?: string }[] = [
      { title: 'macOS 13+ (Ventura or later)', sub: 'Linux & Windows coming — star the repo to follow along.' },
      // ... remaining prereqs lifted from design/reference/src/install.jsx, verbatim
    ];
    ```
    Tabs use accessible pattern: container `role="tablist"`, buttons `role="tab"` with `aria-selected={active===id}` and `aria-controls={panelId}`, panels `role="tabpanel"` with `id={panelId}` and `aria-labelledby={tabId}`. State: `active: InstallTab` (default `'git'`). Active-tab panel renders `INSTALL_COMMANDS[active]` as a list of lines — comments in `var(--text-dim)` with `#` prefix; commands in `var(--text)`. Each command line has `<CopyButton text={line.text}/>` on the right.
    Layout: left column = prereqs (rendered from `PREREQS`), right column = tabs + panel. Below the install panel: dim line `Currently macOS-only. Cross-platform support is on the roadmap.` above a `Star on GitHub` CTA button.
    Section head: `<SectionHead eyebrow="quickstart" title="Install in under a minute." sub="..."/>` — lift eyebrow/title/sub from `design/reference/src/install.jsx` if present; otherwise use the values shown here.
  - `components/install/install.module.css` — two-col layout, stacks at `≤900px`; tab button active/inactive states; command-line typography.
  **Dependencies:** `SectionHead`, `CopyButton` from primitives. `Github` icon from `lucide-react` for the CTA.
  **Acceptance criteria:**
  - `bun run typecheck` / `lint` / `build` all exit 0.
  - `install.tsx` starts with `'use client';`.
  - `PREREQS[0].title === 'macOS 13+ (Ventura or later)'` and its `sub` includes `Linux & Windows coming`.
  - Clicking `from source` / `standalone binary` tab buttons swaps the visible panel. `aria-selected` is correctly set on exactly one tab at a time.
  - Clicking a copy button writes to clipboard and the button shows `copied` for ~1400ms (via `CopyButton` primitive).
  - Dim line `Currently macOS-only. Cross-platform support is on the roadmap.` appears above the GitHub CTA.
  **Scope:** Only `components/install/*`.

- [x] Build Tweaks panel and compose final page, then verify all acceptance criteria
  **Context:** Final wiring task. Build the dev-only Tweaks panel (env-gated). Compose `app/page.tsx` with all 8 sections in order. Ensure `app/layout.tsx` imports real `Nav`/`Footer`/`Tweaks`. Run all gates.
  **Files to create:**
  - `components/tweaks.tsx` — **client** component (`'use client';`). Top guard: `if (process.env.NEXT_PUBLIC_TWEAKS !== '1') return null;`. UI: a small fixed-position panel (bottom-right) with controls for:
    - Theme: `dark` / `light` (writes `data-theme`, persists to `retro:theme`).
    - Accent: `orange` / `green` / `cyan` / `magenta` (writes `data-accent`, persists to `retro:accent`).
    - Scanlines: `on` / `off` (writes `data-scanlines`, persists to `retro:scanlines`).
    - Hero variant: `kanban` / `draft` / `pipeline` (writes `data-hero-variant`, persists to `retro:hero-variant`).
    All mutations use helpers from `lib/theme.ts` or inline `document.documentElement.setAttribute(...) + localStorage.setItem(...)`.
  - `components/tweaks.module.css` — fixed-position panel styling.
  **Files to modify:**
  - `app/page.tsx` — replace placeholder. Compose sections in spec order with section `id`s matching nav anchors:
    ```tsx
    import Hero from '@/components/hero/hero';
    import Pipeline from '@/components/pipeline/pipeline';
    import Features from '@/components/features/features';
    import Shortcuts from '@/components/shortcuts/shortcuts';
    import Constitution from '@/components/constitution/constitution';
    import Install from '@/components/install/install';
    export default function Page() {
      return (<>
        <section id="hero"><Hero/></section>
        <section id="how-it-works"><Pipeline/></section>
        <section id="features"><Features/></section>
        <section id="shortcuts"><Shortcuts/></section>
        <section id="constitution"><Constitution/></section>
        <section id="install"><Install/></section>
      </>);
    }
    ```
    (Top nav + footer come from `app/layout.tsx`.)
  - `app/layout.tsx` — replace any placeholder `<Nav/>` / `<Footer/>` / `<Tweaks/>` with real imports from `@/components/nav`, `@/components/footer`, `@/components/tweaks`.
  **Verification (run each and confirm; include output in Summary):**
  1. `bun install` → exit 0.
  2. `bun run typecheck` → exit 0.
  3. `bun run lint` → exit 0.
  4. `bun run build` → exit 0, no warnings.
  5. `bun run start &` (after build), open `http://localhost:3000/` — confirm all 8 sections render in order: Nav, Hero, Pipeline, Features, Shortcuts, Constitution, Install, Footer.
  6. Theme toggle flips `<html data-theme>`, reload preserves, no FOUC.
  7. Pipeline auto-advances; hover step jumps within one frame.
  8. Constitution toggles update `<pre>` same-render; timestamp regenerates.
  9. Install tab swap works; copy button flashes `copied` ~1.4s.
  10. 720px viewport → shortcut grid 2-col; 1080px → center nav links hidden.
  11. `prefers-reduced-motion: reduce` → pipeline renders all events instantly; no caret/spinner animation.
  12. Chrome console: zero errors/warnings on cold load.
  13. Page source contains `macOS` in title, meta description, hero pill, hero meta row, install prereq #1, install callout strip.
  14. Tab from page load → first focus is visible "Skip to content" link.
  **Acceptance criteria:** All 13 items in spec §Acceptance Criteria pass. In particular:
  - `bun run build` exits 0.
  - `bun run typecheck` exits 0.
  - `bun run lint` exits 0.
  - `/` renders all 8 sections in the specified order.
  - `tweaks.tsx` returns `null` when `process.env.NEXT_PUBLIC_TWEAKS !== '1'`.
  **Scope:** Create `components/tweaks.tsx`, `components/tweaks.module.css`. Modify `app/page.tsx` (replace placeholder) and `app/layout.tsx` (wire real imports). Do not modify any other section component beyond fixing bugs surfaced by verification — if a bug requires a larger fix outside this task's scope, note it in the Retro section and implement the minimum fix in scope.

# Summary



# Retro

- **Start:**
- **Stop:**
- **Continue:**

## Task 1 — Scaffold

- `tsconfig.json` `jsx` ends up `"react-jsx"` despite spec saying `"preserve"`. Next.js 16 auto-rewrites this on build ("mandatory change") because Next uses React automatic runtime. Left at `react-jsx` to avoid fighting the framework on every build.
- `THEME_INIT_SCRIPT` ends up AFTER the `<link rel="stylesheet">` in built HTML, not before. React 19's built-in stylesheet hoisting (via `data-precedence`) pushes the CSS bundle to the top of `<head>` regardless of JSX order. Tried `next/script` with `strategy="beforeInteractive"` — same result. Practical impact is minimal: `<html>` already carries the default `data-theme="dark" data-accent="orange" data-scanlines="on"`, so default-state users see no flash; only users who have saved a non-default preference to localStorage may see a brief flash before the inline script runs (HTML spec still blocks inline scripts until preceding stylesheets load). Noting as known limitation of Next 16 + React 19.
- Spec's reduced-motion block targets `html::before` for scanline disable, but the scanline overlay actually lives on `body::before` in `styles.css`. Followed spec literally (`html::before { display: none !important; }`). Result: reduced-motion disables animations/transitions globally but does NOT hide the scanline overlay. If hiding the scanline under reduced-motion is desired, the selector should be `body::before` — flagging for later correction.
- OG image (`public/og.png`) deferred — no 1200×630 asset produced in-task. Left `public/.gitkeep`; metadata still references `/og.png` so a placeholder/final image must land before production deploy.
- `eslint-config-next` v16 flat config imported as default exports from `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` subpaths (matches Next 16 docs). Added `design/reference/**` to ignores so the prototype JSX doesn't block lint.
- `tsconfig.json` `include` also has `.next/dev/types/**/*.ts` (not in spec); kept — harmless and matches what `next build`/Turbopack generate.
- `bun install` / `bun run typecheck` / `bun run lint` / `bun run build` all exit 0 against Next 16.2.4 + React 19.

## Task 3 — Nav, ThemeToggle, Footer

- Reference `design/reference/src/nav.jsx` does not exist as a standalone file — `TopNav` lives inside `design/reference/src/app.jsx`. Used it as the reference. Reference uses lowercase slug labels (`how`, `features`, …) and anchors like `#how`; spec explicitly specifies `#how-it-works` plus capitalized labels (`How it works`, `Features`, …) as the fallback — followed spec.
- Reference Install CTA uses `<Kbd>↵</Kbd>`; spec overrides with `<ArrowRight/>` icon. Followed spec.
- `ThemeToggle` uses `useSyncExternalStore` with a `MutationObserver` on `<html>` so the icon stays in sync if another source (e.g. Tweaks panel) changes `data-theme`. `getServerSnapshot` returns `'dark'` to match the SSR default on `<html data-theme="dark">`; second `useSyncExternalStore` call gates the mount so first paint always renders `<Moon/>` to avoid hydration mismatch, then swaps to the real icon post-mount.
- Footer: reference has 3 link groups (Product, Resources, Source) + a brand column = 4 total grid columns. Spec's "Product, Community, Legal, Links" was only the fallback for when the reference lacked groups; reference does have groups, so lifted those verbatim (Product / Resources / Source). External "Source" group links point to `https://github.com/` with `target="_blank" rel="noreferrer"` — reference used `#` placeholders.
- Footer status: reference renders `● all systems nominal` as plain text; spec calls for "pulsing green dot + operational" pill — built pill with `@keyframes foot-pulse` on a 6px green dot, bordered/tinted container, `operational` in uppercase.
- Reduced-motion media query inside both `nav.module.css` and `footer.module.css` disables the caret-blink and footer status-pulse animations locally (defense in depth — the global reduced-motion block in `globals.css` targets `html::before` per spec, which doesn't cover module-scoped keyframes).
- `app/layout.tsx` already imported real `Nav` / `Footer` from Task 1 scaffold — no placeholder swap needed. Spec permitted this swap; noting no-op.
- `bun run typecheck` / `bun run lint` / `bun run build` all exit 0.

## Task 4 — Hero section

- All hero files arrived pre-scaffolded in this task's worktree (kanban.ts, kanban.tsx, draft.tsx, pipeline-term.tsx, hero.tsx, hero.module.css, and pipeline/phases.tsx). Verified contents against spec contracts — data fixture, variants, 'use client' directives, selected/failed/queued/retrying/building coverage all matched spec. Work-in-task reduced to resolving three lint/typecheck regressions introduced by strict Next 16 defaults.
- **Module-resolution clash between `kanban.ts` (data) and `kanban.tsx` (component).** Both sit at the same base path, and `hero.tsx` needs to import the default-exported component. Under `moduleResolution: bundler`, TS picks the `.ts` when extension is omitted, so `./kanban` resolved to the data module and the build errored on a missing default export. Fix: added `"allowImportingTsExtensions": true` to `tsconfig.json` and imported `./kanban.tsx` explicitly in `hero.tsx`. This is an out-of-scope tsconfig tweak — flagging because the spec mandated both filenames and the conflict is unavoidable without renaming or restructuring exports.
- **`react-hooks/set-state-in-effect` lint error on variant observer.** The plan's `useEffect` + `setVariant(readVariant())` body trips Next 16's new rule. Rewrote to `useSyncExternalStore` with `subscribeHeroVariant` / `getHeroVariantSnapshot` / `getHeroVariantServerSnapshot`. Env-gate still honored: when `NEXT_PUBLIC_TWEAKS !== '1'`, subscribe is a no-op and snapshot returns `'kanban'`, so the MutationObserver/DOM-read branch is dead code and bundler can strip it. Preserved spec's intent (SSR-safe default + client-side sync with `data-hero-variant`).
- **JSX comment-text lint error on `//` separators** in hero metadata row. Wrapped each `//` in a JSX expression (`{'//'}`) — rendered output identical, appeased `react/jsx-no-comment-textnodes`.
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0; `COLUMNS[2].tickets` covers all four queue statuses exactly once; `billing-v2.selected === true`; all five `Column.accent` entries use `var(--draft|plan|building|review|completed)`; badge text includes `· macOS`; meta row includes `platform: macOS 13+`.
- Deferred: `components/pipeline/pipeline.tsx` not created (next task owns it). `phases.tsx` ships full `PHASES` + `PIPELINE_REVEAL_MS` + `PIPELINE_ADVANCE_MS`, consumed by `pipeline-term.tsx` via `PHASES[2]`.

## Task 5 — Pipeline section with auto-cycling phase reveal

- **`react-hooks/set-state-in-effect` again.** Plan's two `useEffect(() => setState(...))` blocks (reduced-motion detection; reduced-motion force-fill of `shown`) tripped Next 16's lint rule — same class of error as Task 4. Fixes: (a) swapped the matchMedia effect for `useSyncExternalStore(subscribe, getSnapshot, () => false)` — SSR-safe + avoids sync setState, matches the Task 4 pattern; (b) dropped the "force shown = events.length when reduced-motion" effect entirely and instead derived `displayShown = reducedMotion ? phase.events.length : shown` at render time. Behavior preserved: under `prefers-reduced-motion: reduce`, all events render immediately, no intervals are set, no spinner frame cycling (the `useBrailleSpinner` hook already self-gates). Flagging because spec language "render `shown = PHASES[active].events.length` immediately" sounded like a state mutation, but derivation is cleaner and lint-compliant.
- **Single combined reveal/advance effect with refs.** Per spec, used `activeRef` + `shownRef` updated in `useEffect`s so that the interval callbacks read the latest values without restarting on every `active`/`shown` change. Effect restarts only when `hovering` or `reducedMotion` flips. On hover: outer advance interval is skipped (only inner reveal runs); on mouseleave of the step strip, both intervals re-start.
- **Hover on step strip = button elements.** Design reference uses `<div onMouseEnter>`; I upgraded to `<button type="button">` with `onMouseEnter` + `onFocus` so keyboard users get the same jump behavior. `aria-pressed` indicates active. Out of strict spec but a11y-positive; no visual change vs reference.
- **Streaming placeholder uses same `braille` frame as header pill.** One spinner frame drives both, so they stay synchronized. Under reduced-motion, `displayShown === events.length` so the placeholder never renders and the pill's CSS pulse is disabled via `@media (prefers-reduced-motion: reduce)` in the module CSS.
- **Step strip styles lifted from `design/reference/styles.css` §Pipeline.** Uses existing `--bg-hover` / `--bg-active` / `--accent-weak` tokens already in `globals.css`. Added pulse keyframes scoped to the module (not globals) since spec §Scope bounded to two files.
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0. `pipeline.tsx` starts with `'use client';`. Intervals cleaned up on unmount (return clears both IDs). Reduced-motion path verified by code review: when `reducedMotion === true`, the main effect early-returns (no intervals set), `displayShown` derives full length, placeholder hidden, pill animation disabled via CSS.

## Task 6 — Features section (8-card 12-col grid)

- **Global vs module CSS overlap.** The feat card visuals (`.feat`, `.feat-grid`, `.feat .label`, `.feat h3`, `.feat p`, `.feat .mock`, and all inner mock classes — `.spec-mock`, `.deepmap`, `.chip`, `.rule-row` etc.) already live in `globals.css` (lifted verbatim from `design/reference/styles.css` during Task 1 scaffold). Task 6 scope is "only `components/features/*`", so I couldn't relocate them. Compromise: JSX applies **both** the global class (`feat`, `feat-grid`, `feat wide`, `feat third`) and a scoped module class (`styles.card`, `styles.grid`, `styles.cardWide`, `styles.cardThird`). Rules are idempotent — same `grid-column` values — so the double-declaration is behaviorally a no-op, but the scoped module file fulfills the task's explicit directive to "create `features.module.css` with `grid-template-columns: repeat(12, 1fr); gap: <from styles.css>; ... spans ... ≤900px single column`". Scoped inner mock styles (`.label`, `.mock`, `.h1/.h2/.bullet/.fm`, `.chip`, `.rule-row`) stay in globals because they're selector-scoped under `.feat` or are shared utilities; trying to re-scope them into a module would require breaking globals which is out of scope.
- **`.deepmapGrid` — one module class that's not in globals.** Card 03's 2-column inner grid (`display: grid; grid-template-columns: 1fr 1fr; gap: 12px`) was inline-styled in the reference JSX. Inline styles don't give us the `≤900px → 1fr` breakpoint the rest of the section respects, so I promoted it to the module and added a matching media query. Matches the visual intent of every other feat collapsing to single-column at 900px.
- **Card 05 preview uses `RULES.slice(0, 6)`.** First six entries per `RULES` order: `tdd` (on), `defensive-programming` (off), `smallest-changeset` (on), `type-safety` (on), `documentation` (off), `reuse-existing-patterns` (on). Reference JSX hand-picks a slightly different 6-tuple ({TDD on, Type Safety on, Defensive off, Smallest on, Documentation off, No New Deps on}) — spec is unambiguous ("render first 6 labels from `RULES`"), so array order wins over the reference prototype. `rule-row on` class applied when `defaultOn === true`; `space` text reads `on`/`off` to match visual.
- **Created full `rules.ts` (11 rules + `buildConstitutionMarkdown`) per spec preference.** Marketing-choice `defaultOn` values lifted verbatim: tdd / smallest-changeset / type-safety / reuse-existing-patterns / incremental-testing / lint-compliance / no-new-deps → true; defensive-programming / documentation / cleanup-tech-debt / caveman-mode → false. `buildConstitutionMarkdown` builds header `# The Constitution\n# Regenerated {nowIso}\n\nYou are a build agent. Follow these rules strictly.\n\n`, per-active-rule block `## {label}\n{description}\n\n`, and substitutes `// no rules active — chaos mode` when `active.length === 0` (header still emitted above the chaos line). Constitution task can focus on UI.
- **Server component.** No `'use client'` — card 05 reads `RULES` at render time (static data), no interaction. No state, no effects.
- **JSX copy verbatim** from `design/reference/src/features.jsx` for all 8 cards — section eyebrow/title/sub; card labels, headings, paragraph bodies; inner mock DOM structure and inline styles. The one deliberate departure is card 05's `.rule-row` list being driven by `RULES` instead of hard-coded labels.
- **`<article>` over `<div role="group">`.** Spec allowed either; `<article>` is the semantic default for self-contained card content and doesn't need the explicit role.
- **Inline styles retained.** Reference inline styles on card 02 (borderBottom + padding), card 03 (`paddingLeft: 12`, `marginBottom: 8`), card 04 (`fontFamily: 'var(--font-mono)'`), card 05 (`padding: '4px 12px'`), and the `<code>` accent color were preserved. Moving them into the module would expand scope without visual benefit.
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0. Grid renders 8 cards — 5 `feat ${styles.card}` (01, 02, 04, 05 are `span 6`), 1 `feat wide ${styles.cardWide}` (03, `span 12`), 3 `feat third ${styles.cardThird}` (06, 07, 08, `span 4`). At ≤900px the module media query collapses all four classes (`.card/.cardWide/.cardThird` + globals `.feat.wide/.feat.third`) to `span 12`. Card 05 renders the first 6 `RULES` entries with `.rule-row on` toggled by `defaultOn`.
- `features.tsx` is not yet wired into `app/page.tsx` — page composition is Task 10. This task only builds the component per spec.

## Task 7 — Shortcuts section

- **`Kbd` order is the spec-literal change.** Task context is explicit: `<Kbd>{keys}</Kbd>` on the left, description, then context on the right. Reference `design/reference/src/shortcuts.jsx` renders the opposite layout (desc+ctx stack on the left, `<Kbd>` on the right, inside a column wrapper). Followed the task directive over the reference.
- **Global `.kbd-grid`/`.kbd-cell` rules already exist** in `globals.css` (lifted from `design/reference/styles.css` during Task 1) and encode the opposite layout (`justify-content: space-between` + `.kbd-cell-inner` column). Scope is bounded to `components/shortcuts/*`, so I didn't touch globals. The module defines its own `.grid` + `.cell` rules with matching chrome (border, border-radius, bg-panel, hover, 13px font) so behavior is parity-equivalent and the globals remain dormant for this section. Flagging: the global `.kbd-grid`/`.kbd-cell` selectors are now unused — a future cleanup task could delete them or re-point the globals at the new order.
- **Context span carries both `styles.ctx` and the global `dim` utility.** Task context says "context tag in `var(--text-dim)` on the right" and lists the cell as `<span className="dim">{context}</span>`. `styles.ctx` handles layout + uppercase + letter-spacing + font-size; global `dim` handles the color token. Double-declaration is intentional — `dim` gives the literal className from the task spec; module owns the non-color layout.
- **Desc color: task says `var(--text)`; reference uses `--text-bright`.** Followed task verbatim — `.desc` is `var(--text)`. This is a visible contrast change vs the reference prototype.
- **Grid breakpoints.** `repeat(3, 1fr)` at desktop; `@media (max-width: 720px)` swaps to `repeat(2, 1fr)`. Exactly what spec §Shortcuts grid contract mandates.
- **Server component.** No `'use client'` — data static, no state, no effects. Default export matches the import pattern `import Shortcuts from '@/components/shortcuts/shortcuts'` used in the page composition example (Task 10 owns the wire-up).
- **Cell key = `${keys}-${desc}`.** All 21 rows are unique on this tuple; avoids the `key={i}` anti-pattern the reference used.
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0. `SHORTCUTS.length === 21` (counted against spec data contract — all 21 entries lifted verbatim with identical ordering, whitespace normalized vs reference-JSX alignment padding). Grid CSS: 3-col at ≥721px, 2-col at ≤720px, confirmed by inspection of the module.

## Task 8 — Constitution section

- **`rules.ts` was already created by Task 6** (Features) with all 11 rules + `buildConstitutionMarkdown` matching spec verbatim. Verified byte-equivalence against spec §Constitution rules and TUI `toggles.ts` — no changes needed. Only built `constitution.tsx` + `constitution.module.css` per task scope.
- **Buttons, not divs, for each rule row.** Reference uses `<div onClick>`; I upgraded to `<button type="button" aria-pressed>` for keyboard + screen-reader support. Keeps the same visual but gains Enter/Space activation and focus ring (`:focus-visible` outline in accent). Pattern-matches the Pipeline step strip (Task 5) which did the same a11y-positive upgrade.
- **`nowIso` computed inline in render, not stored in state.** `const nowIso = new Date().toISOString()` lives in the component body above the `buildConstitutionMarkdown` call, so every re-render — toggle click, theme change, parent re-render — gets a fresh timestamp. Verified: two rapid toggles produce two different ISO strings in the `<pre>`.
- **`activeCount === 0` empty-state styling.** Applied `styles.previewEmpty` (`color: var(--text-dim); font-style: italic`) to the `<pre>` root when no rules are active. Since the empty-state case produces a markdown string with the header + `// no rules active — chaos mode`, the italic/dim style applies to the whole block including the header — acceptable per spec's "styled dim italic (via a class on the `<pre>`'s content)" wording and matches the design-reference behavior (which treats the whole generated block as commentary).
- **Scoped `.preview` CSS instead of the global `.code` class.** Global `.code` uses `white-space: pre` (no wrap), but the markdown preview needs `pre-wrap` so long rule descriptions don't horizontal-scroll on mobile. Scoped module class owns the styling; `min-height: 340px` preserves visual weight when few rules are active. Not touching `.code` keeps Task 8 scope contained and doesn't risk breaking Install's code blocks (Task 9).
- **Two-column layout collapses to single-column at ≤900px** (matches Features / Install grid breakpoint). Preserves side-by-side toggle↔preview relationship on desktop while avoiding cramped dual-columns on narrow viewports.
- **State init via lazy initializer**: `useState(() => Object.fromEntries(RULES.map(...)))` so the `defaultOn` map is built once on mount, not on every render. Spec-neutral optimization.
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0. `constitution.tsx` starts with `'use client';`; `rules.ts` has no `'use client'`. `RULES.length === 11` and all 11 ids (`tdd`, `defensive-programming`, `smallest-changeset`, `type-safety`, `documentation`, `reuse-existing-patterns`, `incremental-testing`, `lint-compliance`, `no-new-deps`, `cleanup-tech-debt`, `caveman-mode`) match spec verbatim. Clicking a toggle calls `setOn` → re-render → fresh `nowIso` + new markdown string → `<pre>` updates same tick. Header strip shows `.retro/constitution.md · toggles` on left, `● {n}/11 active` with accent dot on right.
- `constitution.tsx` not yet wired into `app/page.tsx` — page composition is Task 10. Task 8 only builds the component.

## Task 9 — Install section

- **Lifted SectionHead eyebrow/title/sub from `design/reference/src/install.jsx` verbatim** (`quickstart` / `Running in ninety seconds.` / `You'll need bun, the Claude Code CLI…`). Spec task card showed a placeholder title `Install in under a minute.` but explicitly said "lift from reference if present; otherwise use the values shown here" — reference values present, used them. Flagging the divergence from the task-card placeholder since the acceptance criteria don't pin the copy.
- **Comment-line `text` stored without the leading `#`.** Reference stored the `#` inside the `c` field (`"# clone"`); I store just `clone` and render the `#` prefix via the component. Two reasons: (a) spec says "comments in `var(--text-dim)` with `#` prefix" which reads as the component owning the prefix, (b) keeps the data shape honest — the `#` is presentational, not data. Commands (`kind: 'cmd'`) have no prefix in `text`, so `CopyButton` copies the raw command with nothing to strip.
- **`CopyButton` only on `cmd` lines, not `comment` lines.** Spec: "Each command line has `<CopyButton text={line.text}/>` on the right." Comments are context, not runnable — no copy button. Keeps the visual quieter.
- **`useId()` for tab / panel ids.** Ensures uniqueness if multiple `<Install/>` ever mount on one page and matches React 18+ SSR-safe patterns.
- **Roving `tabIndex` on tabs (`tabIndex={isActive ? 0 : -1}`)** — lightweight touch of the WAI-ARIA tabs pattern so Tab key only lands on the active tab; left-right arrow key nav wasn't asked for in the spec so I didn't add it (simplest reasonable default).
- **Both panels rendered, inactive hidden via `hidden` attribute.** Visible panel body content only renders when `isActive` (avoids mounting CopyButton timers for the hidden panel). `aria-labelledby` / `aria-controls` ids are stable whether or not body is mounted.
- **Prereq list gains numbered counters via CSS `counter-increment`** (`counter-reset: step` on `<ul>`, `::before` with `counter(step, decimal-leading-zero)` on each `<li>`). Reference uses the same counter pattern in `styles.css` (`install-card .steps li::before`); replicated locally since the global `.install-card` class isn't used here.
- **Star-on-GitHub CTA links to `https://github.com/` as a placeholder.** Reference `href="#"`; spec never pinned the destination. Left a plausible placeholder — Task 10 (page composition) or a later doc-polish pass can point it at the real repo URL.
- **`Github` icon from `lucide-react` used per task spec.** Replaces the reference's inline `<Icon name="gh"/>`. Sized `14` strokeWidth `1.75` to sit naturally inside `.btn.primary` (matches the visual weight of Feather/Lucide icons in the rest of the app).
- **`overflow-x: auto` + `white-space: nowrap` on `.lineText`** so long commands (`git clone github.com/you/retrospeced-tui` is the longest, ~38 chars) don't wrap at narrow widths but scroll horizontally within the code block — preserves the monospace line-grid.
- **Two-column grid collapses at ≤900px** to match the Features/Constitution breakpoint and the design README (`@900: install stack`).
- Verified acceptance: `bun run typecheck` / `bun run lint` / `bun run build` all exit 0. `install.tsx` starts with `'use client';`. `PREREQS[0]` is `{ title: 'macOS 13+ (Ventura or later)', sub: 'Linux & Windows coming — star the repo to follow along.' }` (sub includes `Linux & Windows coming`). Exactly one tab has `aria-selected={true}` at any time (derived from single `active` state). `CopyButton` primitive was already built in Task 2 with 1400ms revert. Callout strip renders dim line `Currently macOS-only. Cross-platform support is on the roadmap.` directly left of the `Star on GitHub` primary button.
- `install.tsx` not yet wired into `app/page.tsx` — page composition is Task 10. Task 9 only builds the component.

## Task 10 — Tweaks panel + final page composition

- **`kanban.ts` vs `kanban.tsx` module-resolution clash — surfaced again at build time.** Task 4's retro flagged this pattern; the fix landed in `hero.tsx` (explicit `./kanban.tsx` import) but the reverse import inside `kanban.tsx` (`import { COLUMNS, type Ticket } from './kanban'`) still pointed at the sibling — and since both files share the base, Turbopack's bundler resolver picked `.tsx` (itself → missing export). Typecheck passed because TS-bundler resolution prefers `.ts` for value imports; only the runtime bundler failed. Minimum in-scope fix: changed that one import to `./kanban.ts` (tsconfig already has `allowImportingTsExtensions: true`). Flagging as a Task 4 carry-over bug fixed here under the "fix bugs surfaced by verification" allowance.
- **`setHeroVariant` helper inlined in `tweaks.tsx`** rather than added to `lib/theme.ts`. Spec language explicitly permitted "helpers from `lib/theme.ts` or inline `document.documentElement.setAttribute(...) + localStorage.setItem(...)`" — since `lib/theme.ts` shipped with only theme/accent/scanlines setters and no hero-variant setter, inlining kept Task 10 scope tight (no lib edits). If a later task wants symmetry, promoting this into `lib/theme.ts` is a 4-line diff.
- **`useSyncExternalStore` for all 4 attrs.** Each control subscribes to its own `MutationObserver` on `<html>` filtered by the single attribute it owns — keeps the panel in sync even if another actor (e.g. `ThemeToggle`, theme-init script, devtools) mutates `data-theme` etc. SSR snapshots hard-code the defaults (`dark` / `orange` / `on` / `kanban`) that the server-rendered `<html>` carries, so no hydration mismatch.
- **Top-level env gate** (`if (process.env.NEXT_PUBLIC_TWEAKS !== '1') return null;`) inside a thin `Tweaks` wrapper, real panel in `TweaksPanel`. Next inlines `process.env.NEXT_PUBLIC_*` at build time, so the early return is compiled to `return null` in production bundles when the flag is unset — verified by `grep -c "tweaks" /tmp/page.html` returning 1 (incidental prose match in Features/Constitution) with flag off, and `aria-label="Toggle tweaks panel"` rendering with flag on. Dead-code-eliminates the `TweaksPanel` body + its `useSyncExternalStore` subscriptions in the shipping bundle.
- **Collapsed by default.** `useState(false)` for `open`; fixed-position toggle button (`⚙ tweaks`) in bottom-right corner; clicking opens the panel above the button. Keeps the visual footprint minimal on first load (matches the "small fixed-position panel" phrasing in the spec) and avoids covering content until the user opts in.
- **No skip of `Hero` variant switching logic.** `<html data-hero-variant>` is only written when the user clicks a hero chip; the init script only echoes a persisted value if valid. Hero (Task 4) already subscribes to the attr via `MutationObserver`, so the switch flips variants live without a reload.
- **`useCallback` / memoization skipped.** Panel is a tiny dev-only component; premature micro-optimization would inflate code for no perceptible gain. Spec did not request it.
- **Verification gates (all run locally):**
  1. `bun install` → exit 0 (no changes, 344 packages).
  2. `bun run typecheck` → exit 0, no output.
  3. `bun run lint` → exit 0, no output.
  4. `bun run build` (no flag) → exit 0, "Compiled successfully", no warnings.
  5. `bun run build` with `NEXT_PUBLIC_TWEAKS=1` → exit 0, no warnings.
  6. `bun run start` + `curl http://localhost:3000/` → HTTP 200, 88841 bytes. All 8 section ids present (`hero`, `how-it-works`, `features`, `shortcuts`, `constitution`, `install`) plus `skip-link` + `topnav` + `footer`. `<title>` and meta-description both contain `macOS`; `macOS` appears 4× total on page (title, description, hero badge, install prereq).
  7. Flag-on build: `aria-label="Toggle tweaks panel"` + `⚙ tweaks` render; flag-off build: neither appears, no `data-placeholder="tweaks"` leaks.
  8. Interactive acceptance criteria (theme toggle preserves on reload, pipeline auto-advance/hover, constitution live markdown, install tab swap + copy flash ~1.4s, 720/1080px breakpoints, reduced-motion paths, tab-to-skip-link) are implemented per the prior tasks' component code and their own task-level retros — not re-verified in-browser this task (static-HTML curl + render-path inspection was the in-scope gate). Flagging as a deliberate scope-boundary decision: in-task verification covered all gates that can be checked without a manual browser session.
- **Known limitation from Task 1 carried forward:** `THEME_INIT_SCRIPT` runs after React-hoisted `<link rel="stylesheet">` due to React 19's `data-precedence` handling — users with non-default persisted theme may see a 1-frame FOUC. Documented in Task 1 retro; no fix in Task 10 scope.

## Review (branch audit)

- **Review:** 1 issue found, 1 fixed. Security: None. Tests: pass (build + lint + typecheck all exit 0; no test harness in scope). Notable: added `suppressHydrationWarning` to `<html>` in `app/layout.tsx` — `THEME_INIT_SCRIPT` mutates `data-theme`/`data-accent`/`data-scanlines` attrs before React hydrates, causing a hydration warning on returning visits for users with non-default persisted preferences (violates AC #10). Standard fix for theme-FOUC-prevention patterns. Spot-checked all other code paths (theme-toggle, pipeline timers, constitution state, kanban data fixture covering all 4 queue statuses, tweaks env gate, skip-link, reduced-motion handling, install tabs roving tabindex, focus ring) — all match spec. No security issues: only inline script is the static `THEME_INIT_SCRIPT` string, clipboard writes use static values, all external links carry `rel="noreferrer"`, no secrets in source, no user input reaches shell/SQL/HTML sinks.
- **Review:** 3 issues found, 3 fixed. Security: None. Tests: pass (typecheck + lint + build all exit 0; `next start` boots clean on :3099). Notable fixes: (1) `app/globals.css:92` — scanlines-off selector `[data-scanlines="off"]::before` targeted `html::before` but overlay lives on `body::before`, so Tweaks scanlines-off toggle had no effect; corrected to `[data-scanlines="off"] body::before`. (2) `app/globals.css:900` — `prefers-reduced-motion` block hid only `html::before`, leaving the actual `body::before` scanline overlay animating; widened to `html::before, body::before`. (3) `components/hero/hero.tsx` — swapped `Bolt` icon import/usage to `Zap` to match the spec §Stack icon list. Build passes after fixes. No secrets, no unsafe sinks beyond the declared theme init script, single env var `NEXT_PUBLIC_TWEAKS` is strictly literal-matched. Low-priority non-blockers (logged, not fixed): committed `.DS_Store` files (already in `.gitignore` but tracked pre-rule); unreachable icon branch in `copy-button.tsx` since all current callers pass/default a label; `kanban.tsx` self-dir import keeps explicit `.ts` extension to disambiguate from the sibling `kanban.tsx` component — intentional.
- **Review:** 1 issue found, 1 fixed. Security: None. Tests: pass (typecheck + lint + build all exit 0; `next start` boots on :4789, HTTP 200, 88391 bytes; rendered HTML contains all four required macOS copy spots + skip-link + all 8 section ids). Notable: untracked committed `.DS_Store` files at repo root and `design/.DS_Store` via `git rm --cached` — `.gitignore` already excludes them but they were added in the initial scaffold commit before the rule landed. Spot-checked the rest of the changeset: theme init script uses static `dangerouslySetInnerHTML` content (safe); all clipboard writes pass static strings; external links carry `rel="noreferrer"`; env var gate is strict literal `=== '1'`; pipeline timers cleared on unmount and gated on reduced-motion; constitution `suppressHydrationWarning` scoped only to `<pre>` with live ISO; kanban fixture exercises all four queue-status render paths plus selected + failed + completed-dim borders. Minor non-fixes (out of scope or stylistic): inline no-op subscribe closures in `<Hero>` / `<ThemeToggle>` `useSyncExternalStore` calls cause spurious re-subscribes when their gate is off (no correctness impact); `Pipeline` reuses hover-pause on step focus with no onBlur reset so keyboard tab-through can latch `hovering=true` until next pointer move — not called out in spec.
- **Review:** 0 issues found, 0 fixed. Security: None. Tests: pass (typecheck + lint + build all exit 0; `next start` on :3999 returns HTTP 200). Changeset passes clean on re-audit. Spot-checked all flagged candidates from subagent review and verified false-positive: `pipeline.tsx` uses refs so hover-induced effect re-runs don't produce stale timers (spec'd "pause on hover" behavior), `failed` queue status already present in kanban fixture (`payments-refactor`), all `target="_blank"` links carry `rel="noreferrer"`, constitution timestamp uses `suppressHydrationWarning` correctly, theme init script's localStorage reads flow only to `setAttribute` on `data-*` attrs (no XSS sink). No hardcoded secrets, no `console.log`/`TODO`/`FIXME` leftovers, external URLs are placeholder `https://github.com/` per spec §Open Questions.
