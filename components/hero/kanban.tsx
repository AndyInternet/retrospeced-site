'use client';

import { TerminalWindow } from '@/components/primitives/terminal-window';
import { Kbd } from '@/components/primitives/kbd';
import { FooterShortcuts } from '@/components/primitives/footer-shortcuts';
import { useBrailleSpinner } from '@/lib/braille';
import { COLUMNS, type Ticket } from './kanban.ts';
import styles from './hero.module.css';

export default function Kanban() {
  const spinnerFrame = useBrailleSpinner();

  return (
    <TerminalWindow title="retro" subtitle="tickets">
      {/* Top bar */}
      <div className={styles.kanbanTopBar}>
        <div className={styles.kanbanTopLeft}>
          <Kbd>⌥/</Kbd>
          <span className="dim"> Search</span>
        </div>
        <div className={styles.kanbanTopRight}>
          <span className="dim">All Projects</span>
          <span className={styles.kanbanTopSpacer} aria-hidden="true">
            {'  '}
          </span>
          <Kbd accent>⌥n</Kbd>
          <span className="acc"> + New</span>
        </div>
      </div>

      {/* Column grid */}
      <div className={styles.kanbanGrid}>
        {COLUMNS.map((col) => (
          <div key={col.id} className={styles.kanbanColumn}>
            <div
              className={styles.kanbanColHeader}
              style={{
                color: col.accent,
                borderBottomColor: col.accent,
              }}
            >
              <span className={styles.kanbanColLabel}>{col.label}</span>
              <span className={styles.kanbanColCount}>
                {'  '}
                {col.tickets.length}
              </span>
            </div>
            <div
              className={
                col.id === 'completed'
                  ? `${styles.kanbanCardList} ${styles.kanbanCardListDim}`
                  : styles.kanbanCardList
              }
            >
              {col.tickets.map((ticket) => (
                <KanbanCard
                  key={ticket.id}
                  ticket={ticket}
                  spinnerFrame={spinnerFrame}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer shortcut bar */}
      <div className={styles.kanbanFooter}>
        <FooterShortcuts
          entries={[
            { key: '←→', label: 'Switch column' },
            { key: '↑↓', label: 'Navigate' },
            { key: 'Enter', label: 'Open' },
            { key: '⌥n', label: 'New ticket' },
            { key: '⌥k', label: 'Commands' },
          ]}
        />
      </div>
    </TerminalWindow>
  );
}

interface KanbanCardProps {
  ticket: Ticket;
  spinnerFrame: string;
}

function KanbanCard({ ticket, spinnerFrame }: KanbanCardProps) {
  const queue = ticket.queue;
  const isFailed = queue?.status === 'failed';

  const classes = [styles.card];
  if (ticket.selected) classes.push(styles.cardSelected);
  if (isFailed) classes.push(styles.cardFailed);

  return (
    <div className={classes.join(' ')}>
      <div className={styles.cardId}>{ticket.id}</div>
      <div className={`${styles.cardLine} dim`}>{ticket.project}</div>
      <div className={`${styles.cardLine} dim`}>→ {ticket.targetBranch}</div>
      {queue ? <QueueLine queue={queue} spinnerFrame={spinnerFrame} /> : null}
    </div>
  );
}

function QueueLine({
  queue,
  spinnerFrame,
}: {
  queue: NonNullable<Ticket['queue']>;
  spinnerFrame: string;
}) {
  if (queue.status === 'building') {
    return (
      <div className={`${styles.cardLine} acc`}>
        {spinnerFrame} {queue.phase ?? 'Starting...'}
      </div>
    );
  }
  if (queue.status === 'queued') {
    return (
      <div className={`${styles.cardLine} dim`}>
        ⏳ Queued (#{queue.position ?? '?'})
      </div>
    );
  }
  if (queue.status === 'retrying') {
    return (
      <div className={`${styles.cardLine} ylw`}>
        ↻ Retrying ({queue.retries ?? 0}/3)
      </div>
    );
  }
  if (queue.status === 'failed') {
    return (
      <div className={`${styles.cardLine} red`}>
        ✗ Failed: {queue.phase ?? 'unknown'}
      </div>
    );
  }
  return null;
}
