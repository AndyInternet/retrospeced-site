'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import {
  setAccent,
  setScanlines,
  setTheme,
  STORAGE_KEYS,
  type AccentValue,
  type HeroVariantValue,
  type ScanlinesValue,
  type ThemeValue,
} from '@/lib/theme';
import styles from './tweaks.module.css';

type AttrName =
  | 'data-theme'
  | 'data-accent'
  | 'data-scanlines'
  | 'data-hero-variant';

function subscribeAttr(attr: AttrName) {
  return (onChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attr],
    });
    return () => observer.disconnect();
  };
}

function readAttr<T extends string>(attr: AttrName, fallback: T): T {
  const v = document.documentElement.getAttribute(attr);
  return (v ?? fallback) as T;
}

const THEMES: ThemeValue[] = ['dark', 'light'];
const ACCENTS: AccentValue[] = ['orange', 'green', 'cyan', 'magenta'];
const SCANLINES: ScanlinesValue[] = ['on', 'off'];
const HERO_VARIANTS: HeroVariantValue[] = ['kanban', 'draft', 'pipeline'];

function setHeroVariant(v: HeroVariantValue) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-hero-variant', v);
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEYS.heroVariant, v);
    } catch {
      // ignore
    }
  }
}

export function Tweaks() {
  // Build-time gate — dead-code-eliminated when NEXT_PUBLIC_TWEAKS !== '1'.
  if (process.env.NEXT_PUBLIC_TWEAKS !== '1') return null;
  return <TweaksPanel />;
}

function TweaksPanel() {
  const [open, setOpen] = useState(false);

  const theme = useSyncExternalStore(
    subscribeAttr('data-theme'),
    () => readAttr<ThemeValue>('data-theme', 'dark'),
    () => 'dark' as ThemeValue,
  );
  const accent = useSyncExternalStore(
    subscribeAttr('data-accent'),
    () => readAttr<AccentValue>('data-accent', 'orange'),
    () => 'orange' as AccentValue,
  );
  const scanlines = useSyncExternalStore(
    subscribeAttr('data-scanlines'),
    () => readAttr<ScanlinesValue>('data-scanlines', 'on'),
    () => 'on' as ScanlinesValue,
  );
  const heroVariant = useSyncExternalStore(
    subscribeAttr('data-hero-variant'),
    () => readAttr<HeroVariantValue>('data-hero-variant', 'kanban'),
    () => 'kanban' as HeroVariantValue,
  );

  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  return (
    <div className={styles.root} data-open={open ? 'true' : 'false'}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Tweaks">
          <Row label="theme">
            {THEMES.map((v) => (
              <Chip
                key={v}
                active={theme === v}
                onClick={() => setTheme(v)}
                label={v}
              />
            ))}
          </Row>
          <Row label="accent">
            {ACCENTS.map((v) => (
              <Chip
                key={v}
                active={accent === v}
                onClick={() => setAccent(v)}
                label={v}
              />
            ))}
          </Row>
          <Row label="scanlines">
            {SCANLINES.map((v) => (
              <Chip
                key={v}
                active={scanlines === v}
                onClick={() => setScanlines(v)}
                label={v}
              />
            ))}
          </Row>
          <Row label="hero">
            {HERO_VARIANTS.map((v) => (
              <Chip
                key={v}
                active={heroVariant === v}
                onClick={() => setHeroVariant(v)}
                label={v}
              />
            ))}
          </Row>
        </div>
      )}
      <button
        type="button"
        className={styles.toggle}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label="Toggle tweaks panel"
      >
        {open ? '× tweaks' : '⚙ tweaks'}
      </button>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowOptions}>{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={styles.chip}
      data-active={active ? 'true' : 'false'}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Tweaks;
