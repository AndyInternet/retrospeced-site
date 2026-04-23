export interface Shortcut {
  keys: string;
  desc: string;
  context: string;
}

export const SHORTCUTS: Shortcut[] = [
  { keys: '⌥1', desc: 'Tickets kanban', context: 'global' },
  { keys: '⌥2', desc: 'Projects', context: 'global' },
  { keys: '⌥3', desc: 'Settings', context: 'global' },
  { keys: '⌥/', desc: 'Search tickets', context: 'tickets' },
  { keys: '⌥f', desc: 'Filter by project', context: 'tickets' },
  { keys: '⌥n', desc: 'New ticket', context: 'tickets' },
  { keys: 'Tab', desc: 'Switch editor / chat', context: 'draft · plan' },
  { keys: '⌥m', desc: 'Markdown preview', context: 'draft · plan' },
  { keys: '⌥e', desc: 'Open in external editor', context: 'any view' },
  { keys: '⌥t', desc: 'Open worktree in terminal', context: 'any view' },
  { keys: '⌥r', desc: 'Manage references', context: 'draft · plan' },
  { keys: '⌥p', desc: 'Generate plan', context: 'draft' },
  { keys: '⌥b', desc: 'Start build', context: 'plan' },
  { keys: '⌥u', desc: 'Revert to draft', context: 'plan' },
  { keys: '⌥v', desc: 'Toggle verbose', context: 'building' },
  { keys: '⌥c', desc: 'Cancel build', context: 'building' },
  { keys: '⌥o', desc: 'Open PR', context: 'review' },
  { keys: '⌥l', desc: 'Toggle log viewer', context: 'global' },
  { keys: '⌥q', desc: 'Quit', context: 'global' },
  { keys: '↵', desc: 'Open selection', context: 'lists' },
  { keys: 'Esc', desc: 'Back', context: 'any view' },
];
