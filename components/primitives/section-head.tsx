import type { ReactNode } from 'react';
import styles from './primitives.module.css';

export interface SectionHeadProps {
  eyebrow: string;
  title: string;
  sub?: string;
  right?: ReactNode;
}

export function SectionHead({ eyebrow, title, sub, right }: SectionHeadProps) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionHeadMain}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 className={styles.title}>{title}</h2>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
      {right && <div className={styles.sectionHeadRight}>{right}</div>}
    </div>
  );
}
