import type { ReactNode } from 'react';
import { Kbd } from './kbd';
import styles from './primitives.module.css';

export interface ShortcutEntry {
  key: string;
  label: string;
}

export interface FooterShortcutsProps {
  entries: ShortcutEntry[];
  rightSlot?: ReactNode;
}

// Separator between entries is exactly two non-breaking spaces
// (per spec §Footer shortcut bar — two spaces, not the `·` glyph).
const SEPARATOR = '  ';

export function FooterShortcuts({ entries, rightSlot }: FooterShortcutsProps) {
  return (
    <div className={styles.footerShortcuts}>
      {entries.map((entry, i) => (
        <span key={`${entry.key}-${i}`} className={styles.entry}>
          {i > 0 && (
            <span className={styles.entrySpacer} aria-hidden="true">
              {SEPARATOR}
            </span>
          )}
          <span className={styles.key}>
            <Kbd accent>{entry.key}</Kbd>
          </span>
          <span>{' '}</span>
          <span className={styles.label}>{entry.label}</span>
        </span>
      ))}
      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
    </div>
  );
}
