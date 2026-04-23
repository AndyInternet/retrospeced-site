import type { ReactNode } from 'react';

export type PhaseId =
  | 'planning'
  | 'task-generation'
  | 'execution'
  | 'review'
  | 'retro-rollup'
  | 'pr';

export type EventKind =
  | 'phase-start'
  | 'task-start'
  | 'task-complete'
  | 'tool-use'
  | 'text'
  | 'error'
  | 'build-complete';

export interface BuildEvent {
  kind: EventKind;
  node: ReactNode;
}

export interface Phase {
  id: PhaseId;
  name: string;
  sub: string;
  events: BuildEvent[];
}

export const PIPELINE_REVEAL_MS = 750;
export const PIPELINE_ADVANCE_MS = 2500;

// ------------------ Render helpers ------------------

export function phaseStart(label: string): ReactNode {
  return <b className="acc">{`═══ Phase: ${label} ═══`}</b>;
}

export function taskStart(i: number, total: number, text: string): ReactNode {
  return <span className="br">{`▶ Task ${i} of ${total}: ${text}`}</span>;
}

export function taskDone(i: number, text: string): ReactNode {
  return <span className="grn">{`✓ Task ${i}: ${text}`}</span>;
}

export function toolUse(tool: string, summary: string): ReactNode {
  return (
    <>
      <span className="mag">🔧 </span>
      {tool}: <span className="dim">{summary}</span>
    </>
  );
}

export function agentText(text: string): ReactNode {
  return <>{text}</>;
}

export function errorEvent(phase: string, msg: string): ReactNode {
  return <span className="red">{`✗ Error in ${phase}: ${msg}`}</span>;
}

export function buildComplete(): ReactNode {
  return (
    <>
      <span className="grn">✓ Build complete! PR opened.</span>{' '}
      <span className="dim">Press Esc to return.</span>
    </>
  );
}

// ------------------ Phase fixture ------------------

export const PHASES: Phase[] = [
  {
    id: 'planning',
    name: 'Planning',
    sub: 'reads codebase · drafts spec',
    events: [
      { kind: 'phase-start', node: phaseStart('Planning') },
      {
        kind: 'tool-use',
        node: toolUse('Read', 'src/api · src/middleware · src/lib (43 files)'),
      },
      {
        kind: 'tool-use',
        node: toolUse('Grep', 'rate limit|throttle|429 → 11 matches'),
      },
      {
        kind: 'text',
        node: agentText('Drafting feature spec with acceptance criteria.'),
      },
      { kind: 'tool-use', node: toolUse('Write', 'specs/rate-limit.md') },
    ],
  },
  {
    id: 'task-generation',
    name: 'Task Generation',
    sub: 'breaks plan into atomic units',
    events: [
      { kind: 'phase-start', node: phaseStart('Task Generation') },
      { kind: 'text', node: agentText('Decomposing plan into 5 tasks.') },
      {
        kind: 'tool-use',
        node: toolUse('Write', 'specs/rate-limit.md (Tasks section)'),
      },
    ],
  },
  {
    id: 'execution',
    name: 'Execution',
    sub: 'writes code, task by task',
    events: [
      { kind: 'phase-start', node: phaseStart('Execution') },
      {
        kind: 'task-start',
        node: taskStart(1, 5, 'scaffold rate-limit middleware'),
      },
      {
        kind: 'tool-use',
        node: toolUse('Write', 'src/middleware/rate-limit.ts'),
      },
      {
        kind: 'task-complete',
        node: taskDone(1, 'scaffold rate-limit middleware'),
      },
      { kind: 'task-start', node: taskStart(2, 5, 'wire redis store') },
      { kind: 'tool-use', node: toolUse('Write', 'src/lib/rl-store.ts') },
      { kind: 'task-complete', node: taskDone(2, 'wire redis store') },
      {
        kind: 'task-start',
        node: taskStart(3, 5, 'write tests (TDD active)'),
      },
      { kind: 'tool-use', node: toolUse('Write', 'tests/rl.test.ts') },
      {
        kind: 'tool-use',
        node: toolUse('Bash', 'bun test → 12 pass, 0 fail'),
      },
      { kind: 'task-complete', node: taskDone(3, 'write tests') },
    ],
  },
  {
    id: 'review',
    name: 'Review',
    sub: 'self-review of diff',
    events: [
      { kind: 'phase-start', node: phaseStart('Review') },
      { kind: 'tool-use', node: toolUse('Read', 'src/middleware/rate-limit.ts') },
      { kind: 'tool-use', node: toolUse('Read', 'tests/rl.test.ts') },
      {
        kind: 'text',
        node: agentText('Diff looks coherent. 7 files · +512 / -18.'),
      },
    ],
  },
  {
    id: 'retro-rollup',
    name: 'Retro Rollup',
    sub: 'start · stop · continue',
    events: [
      { kind: 'phase-start', node: phaseStart('Retro Rollup') },
      {
        kind: 'tool-use',
        node: toolUse('Write', 'specs/rate-limit.md (Retro section)'),
      },
      {
        kind: 'text',
        node: agentText(
          'start: reuse ioredis singleton. stop: re-scaffolding tests dir. continue: atomic tasks work.',
        ),
      },
    ],
  },
  {
    id: 'pr',
    name: 'Pull Request',
    sub: 'pushes branch · opens PR',
    events: [
      { kind: 'phase-start', node: phaseStart('Pull Request') },
      {
        kind: 'tool-use',
        node: toolUse('Bash', 'git push origin retro/rate-limit'),
      },
      { kind: 'tool-use', node: toolUse('Bash', 'gh pr create') },
      { kind: 'build-complete', node: buildComplete() },
    ],
  },
];
