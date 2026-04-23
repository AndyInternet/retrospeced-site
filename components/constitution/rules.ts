export interface Rule {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

export const RULES: Rule[] = [
  {
    id: 'tdd',
    label: 'Test-Driven Development',
    description: 'Write tests before implementation code.',
    defaultOn: true,
  },
  {
    id: 'defensive-programming',
    label: 'Defensive Programming',
    description: 'Validate inputs and handle edge cases.',
    defaultOn: false,
  },
  {
    id: 'smallest-changeset',
    label: 'Smallest Changeset',
    description: 'Make the minimum change needed to complete the task.',
    defaultOn: true,
  },
  {
    id: 'type-safety',
    label: 'Type Safety',
    description: 'Use strict types and avoid any/unknown.',
    defaultOn: true,
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Add or update documentation alongside code changes.',
    defaultOn: false,
  },
  {
    id: 'reuse-existing-patterns',
    label: 'Reuse Existing Patterns',
    description:
      'Prefer existing utilities and abstractions over creating new ones.',
    defaultOn: true,
  },
  {
    id: 'incremental-testing',
    label: 'Incremental Testing',
    description:
      'Run tests after each logical unit of work, not just at the end.',
    defaultOn: true,
  },
  {
    id: 'lint-compliance',
    label: 'Lint Compliance',
    description: 'Ensure all changes pass the project linter.',
    defaultOn: true,
  },
  {
    id: 'no-new-deps',
    label: 'No New Dependencies',
    description: 'Avoid adding new packages unless approved.',
    defaultOn: true,
  },
  {
    id: 'cleanup-tech-debt',
    label: 'Cleanup Found Technical Debt',
    description:
      'Address technical debt discovered while working on tasks.',
    defaultOn: false,
  },
  {
    id: 'caveman-mode',
    label: 'Caveman Mode',
    description:
      'Ultra-compressed writing. Drop articles, filler, pleasantries.',
    defaultOn: false,
  },
];

export function buildConstitutionMarkdown(
  rules: { rule: Rule; on: boolean }[],
  nowIso: string,
): string {
  const header =
    `# The Constitution\n` +
    `# Regenerated ${nowIso}\n` +
    `\n` +
    `You are a build agent. Follow these rules strictly.\n` +
    `\n`;

  const active = rules.filter((r) => r.on);
  if (active.length === 0) {
    return header + `// no rules active — chaos mode`;
  }

  const body = active
    .map(({ rule }) => `## ${rule.label}\n${rule.description}\n\n`)
    .join('');

  return header + body;
}
