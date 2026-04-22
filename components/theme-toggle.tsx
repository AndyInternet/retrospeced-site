'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, type ThemeValue } from '@/lib/theme';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeValue {
  const current = document.documentElement.getAttribute('data-theme');
  return current === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): ThemeValue {
  return 'dark';
}

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const toggle = useCallback(() => {
    const next: ThemeValue = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme]);

  // SSR-safe: render stable Moon icon pre-mount to avoid hydration mismatch.
  const Icon = !mounted ? Moon : theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={className}
    >
      <Icon size={13} aria-hidden="true" />
    </button>
  );
}
