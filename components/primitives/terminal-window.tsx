import type { ReactNode } from 'react';
import styles from './primitives.module.css';

export interface TerminalWindowProps {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title,
  subtitle,
  rightSlot,
  children,
  className,
}: TerminalWindowProps) {
  const showHeader = Boolean(title);
  const rootClassName = className ? `${styles.term} ${className}` : styles.term;

  return (
    <div className={rootClassName}>
      {showHeader && (
        <div className={styles.termHeader}>
          <div className={styles.termTitleBlock}>
            <span className={styles.termTitle}>{title}</span>
            {subtitle && <span className={styles.termSubtitle}>{subtitle}</span>}
          </div>
          {rightSlot && <div className={styles.termRight}>{rightSlot}</div>}
        </div>
      )}
      <div className={styles.termBody}>{children}</div>
    </div>
  );
}
