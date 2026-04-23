export type ColumnId = 'draft' | 'plan' | 'building' | 'review' | 'completed';
export type QueueStatus = 'queued' | 'building' | 'retrying' | 'failed';

export interface Ticket {
  id: string;
  project: string;
  targetBranch: string;
  queue?: {
    status: QueueStatus;
    phase?: string;
    position?: number;
    retries?: number;
  };
  selected?: boolean;
}

export interface Column {
  id: ColumnId;
  label: string;
  accent: string;
  tickets: Ticket[];
}

export const COLUMNS: Column[] = [
  {
    id: 'draft',
    label: 'DRAFT',
    accent: 'var(--draft)',
    tickets: [
      { id: 'onboard-flow', project: 'acme-app', targetBranch: 'main' },
      { id: 'csv-import', project: 'acme-app', targetBranch: 'main' },
      { id: 'oauth-refresh', project: 'auth-svc', targetBranch: 'main' },
    ],
  },
  {
    id: 'plan',
    label: 'PLAN',
    accent: 'var(--plan)',
    tickets: [
      { id: 'rate-limit', project: 'acme-app', targetBranch: 'main' },
      { id: 'search-infra', project: 'acme-app', targetBranch: 'main' },
    ],
  },
  {
    id: 'building',
    label: 'BUILDING',
    accent: 'var(--building)',
    tickets: [
      {
        id: 'billing-v2',
        project: 'acme-app',
        targetBranch: 'main',
        queue: { status: 'building', phase: 'Task 3 of 5' },
        selected: true,
      },
      {
        id: 'stripe-webhook',
        project: 'acme-app',
        targetBranch: 'main',
        queue: { status: 'retrying', retries: 2, phase: 'Execution' },
      },
      {
        id: 'payments-refactor',
        project: 'acme-app',
        targetBranch: 'main',
        queue: { status: 'failed', phase: 'Execution' },
      },
      {
        id: 'webhook-retry',
        project: 'acme-app',
        targetBranch: 'main',
        queue: { status: 'queued', position: 1 },
      },
    ],
  },
  {
    id: 'review',
    label: 'REVIEW',
    accent: 'var(--review)',
    tickets: [
      { id: 'safari-focus', project: 'acme-app', targetBranch: 'main' },
      { id: 'dark-mode', project: 'marketing', targetBranch: 'main' },
    ],
  },
  {
    id: 'completed',
    label: 'COMPLETED',
    accent: 'var(--completed)',
    tickets: [
      { id: 'soc2-audit', project: 'acme-app', targetBranch: 'main' },
    ],
  },
];
