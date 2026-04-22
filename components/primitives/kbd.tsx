import type { ReactNode } from 'react';
import styles from './primitives.module.css';

export interface KbdProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export function Kbd({ children, accent = false, className }: KbdProps) {
  const classes = [styles.kbd, accent ? styles.kbdAccent : styles.kbdDim];
  if (className) classes.push(className);
  return <kbd className={classes.join(' ')}>[{children}]</kbd>;
}
