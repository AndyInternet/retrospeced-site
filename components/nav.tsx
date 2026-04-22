import { ArrowRight, Github } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import styles from './nav.module.css';

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#shortcuts', label: 'Shortcuts' },
  { href: '#constitution', label: 'Constitution' },
  { href: '#install', label: 'Install' },
];

export function Nav() {
  return (
    <header className={styles.topnav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.caret} aria-hidden="true">
            ▊
          </span>
          <span className={styles.brandText}>
            retro<span className={styles.brandMuted}>(speced)</span>
          </span>
          <span className={styles.version}>v0.4.2</span>
        </div>
        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles.cta}>
          <ThemeToggle className={`${styles.btn} ${styles.btnGhost}`} />
          <a
            href="https://github.com/"
            aria-label="GitHub repo"
            target="_blank"
            rel="noreferrer"
            className={`${styles.btn} ${styles.github}`}
          >
            <Github className={styles.icon} aria-hidden="true" />
            github
          </a>
          <a href="#install" className={`${styles.btn} ${styles.btnPrimary}`}>
            Install
            <ArrowRight className={styles.icon} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
