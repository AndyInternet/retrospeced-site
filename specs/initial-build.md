---
status: plan
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

Fresh Next.js 16 app at worktree root. Port `design/reference/styles.css` → `app/globals.css` verbatim (tokens + keyframes + section styles) then add two new tokens (`--completed`, `--border-active`) + two utility classes (`.mag`, `.cyn` already in styles.css — verify). TUI-accurate data contracts (kanban, draft, phases, rules, shortcuts) live in plain `.ts` files beside their components; presentation in `.tsx` + CSS Modules.

### File-by-file map
- `package.json` — deps: `next@^16 react@^19 react-dom@^19 lucide-react @vercel/analytics`; dev: `typescript @types/react @types/react-dom @types/node eslint eslint-config-next`.
- `tsconfig.json` — strict, `"moduleResolution": "bundler"`, paths `@/*` → `./*`.
- `next.config.ts` — `{}` (Node runtime, default build).
- `eslint.config.mjs` — flat config extending `next/core-web-vitals` + `next/typescript`.
- `app/layout.tsx` — `<html data-theme="dark" data-accent="orange" data-scanlines="on">`; inline `<script>` with `THEME_INIT_SCRIPT` before `</head>`; load JetBrains Mono via `next/font/google` weights `[400,500,600,700]`, preload; `<Nav/>`, `<main id="main">{children}</main>`, `<Footer/>`, `<Tweaks/>`, `<Analytics/>`; export `metadata` (see SEO block).
- `app/page.tsx` — compose Hero, Pipeline, Features, Shortcuts, Constitution, Install in order.
- `app/globals.css` — lift styles.css; add tokens + `@media (prefers-reduced-motion: reduce)` disabling `caret-blink`/`pulse`/`fadein`/`blink`/`grow`/`slideup`/scanline overlay/spinner animation.
- `lib/theme.ts` — `THEME_INIT_SCRIPT`, storage key constants, `setTheme/setAccent/setScanlines` helpers.
- `lib/braille.ts` — `BRAILLE_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']`; `useBrailleSpinner(ms=80)` hook.
- `lib/token-color.ts` — `tokenColor(n) → 'red'|'yellow'|'dim'` (see interfaces).
- `components/primitives/*` — `TerminalWindow`, `Kbd`, `SectionHead`, `CopyButton`, `FooterShortcuts` (shared `[key] label … ` strip).
- `components/nav.tsx` — server; sticky `<header>` with brand caret + links + theme toggle + GitHub link + `Install` CTA.
- `components/theme-toggle.tsx` — client; reads `data-theme`, flips + persists.
- `components/footer.tsx` — server; 4-col grid + ASCII wordmark + status pill.
- `components/hero/hero.tsx` — client; variant state from `process.env.NEXT_PUBLIC_TWEAKS === '1'` ? all three : just kanban; reads `document.documentElement.dataset.heroVariant` at mount for Tweaks-driven switching.
- `components/hero/kanban.ts` — `COLUMNS` (5-col, per spec data contract).
- `components/hero/kanban.tsx` — renders columns + cards, matches TUI render rules (id/project/→branch/queue status line). Uses `useBrailleSpinner` for building cards.
- `components/hero/draft.tsx` — dual-panel editor + chat; static; info bar + focused left panel.
- `components/hero/pipeline-term.tsx` — renders `PHASES[2]` (execution) as a **static snapshot** (all events shown, no cycling).
- `components/pipeline/phases.tsx` — typed events with JSX render helpers (see contracts) + `PHASES` array.
- `components/pipeline/pipeline.tsx` — client; `active`+`shown` state; `setTimeout` reveal at 750ms, phase advance at 2500ms; hover jumps to step, pauses until mouseleave.
- `components/features/features.tsx` — server; static 8-card grid; card 05 mock uses first 6 items from `RULES`.
- `components/shortcuts/{shortcuts.tsx,data.ts}` — server; `SHORTCUTS` array of 21.
- `components/constitution/{constitution.tsx,rules.ts}` — client; toggle map state; `<pre>` markdown regenerated each render with live `new Date().toISOString()`.
- `components/install/install.tsx` — client; tabs `git|bin`; copy buttons per line.
- `components/tweaks.tsx` — client; returns `null` unless `process.env.NEXT_PUBLIC_TWEAKS === '1'`; mutates `<html>` data-attrs + localStorage.

### Reduced-motion handling
Wrap all `useEffect` timers with `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;`. Braille spinner returns static `⠋`. Pipeline shows full event list immediately (skip cycling).

### Client/server split (exact)
Client: `theme-toggle`, `hero`, `kanban` (spinner), `pipeline`, `constitution`, `install`, `copy-button`, `tweaks`. Everything else server.

### Hero variant gating
- Default (prod): `kanban` only.
- `NEXT_PUBLIC_TWEAKS=1`: Tweaks panel writes `data-hero-variant` on `<html>`; Hero reads on mount via `useEffect` + `MutationObserver` on `documentElement` attribute changes.

## Interfaces

Types that cross task boundaries are in **Shared Contracts** below. Local helpers:

```ts
// lib/theme.ts
export const STORAGE_KEYS = { theme: 'retro:theme', accent: 'retro:accent', scanlines: 'retro:scanlines', heroVariant: 'retro:hero-variant' } as const;
export const THEME_INIT_SCRIPT: string; // see spec §Theme System

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

Pipeline render helpers in `components/pipeline/phases.tsx`:
```tsx
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
export interface Ticket { id: string; project: string; targetBranch: string; queue?: { status: QueueStatus; phase?: string; position?: number; retries?: number }; }
export interface Column { id: ColumnId; label: string; accent: string; tickets: Ticket[]; }
export const COLUMNS: Column[]; // fixture in spec §Data Contracts — ship verbatim
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
- Utilities: `.dim`, `.br`, `.acc`, `.cyn`, `.grn`, `.ylw`, `.mag`, `.red` (add `.red` if missing), `.path` (→ accent).
- Event-log tags replaced by inline color classes above; **no `.tag-phase/.tag-ok/.tag-run/.tag-info/.tag-err` needed** (lift from styles.css but unused — may keep dormant).
- New tokens on `:root` + `[data-theme="light"]`: `--completed: var(--text-dim)`, `--border-active: var(--accent)`.

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
10. Search page source for `macOS` → appears in title, meta description, hero pill, hero meta row, install prereq, install callout.

### LLM eval
N/A — no agent code in this feature.



# Tasks



# Summary



# Retro

- **Start:**
- **Stop:**
- **Continue:**
