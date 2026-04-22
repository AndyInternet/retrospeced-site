'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import styles from './primitives.module.css';

export interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

const REVERT_MS = 1400;

export function CopyButton({
  text,
  label = 'copy',
  copiedLabel,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop — clipboard may be blocked in some contexts
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, REVERT_MS);
  }, [text]);

  const displayLabel = copied ? (copiedLabel ?? 'copied') : label;
  const showIcon = !displayLabel;

  const classes = [styles.copyButton];
  if (copied) classes.push(styles.copied);
  if (className) classes.push(className);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classes.join(' ')}
      aria-label={showIcon ? 'Copy command' : undefined}
    >
      {showIcon ? (
        <span className={styles.copyIcon} aria-hidden="true">
          <Copy size={14} strokeWidth={1.5} />
        </span>
      ) : (
        <span>{displayLabel}</span>
      )}
    </button>
  );
}
