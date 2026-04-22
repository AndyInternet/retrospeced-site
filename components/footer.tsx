import styles from './footer.module.css';

const ASCII_WORDMARK = `   ┌─┐─┐─┐┌┬┐┬─┐┌─┐
   ├┬┘├┤  │ ├┬┘│ │
   ┴└─└─┘ ┴ ┴└─└─┘
   speced ── 2026`;

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterGroup {
  heading: string;
  links: FooterLink[];
}

const GROUPS: FooterGroup[] = [
  {
    heading: 'Product',
    links: [
      { href: '#how-it-works', label: 'Pipeline' },
      { href: '#features', label: 'Features' },
      { href: '#shortcuts', label: 'Shortcuts' },
      { href: '#constitution', label: 'Constitution' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '#install', label: 'Quickstart' },
      { href: '#', label: 'Docs' },
      { href: '#', label: 'Changelog' },
      { href: '#', label: 'Blog' },
    ],
  },
  {
    heading: 'Source',
    links: [
      { href: 'https://github.com/', label: 'GitHub', external: true },
      { href: 'https://github.com/', label: 'Issues', external: true },
      { href: 'https://github.com/', label: 'Discussions', external: true },
      { href: 'https://github.com/', label: 'License', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.foot}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.brand}>
              <span className={styles.caret} aria-hidden="true">
                ▊
              </span>
              <span className={styles.brandText}>
                retro<span className={styles.brandMuted}>(speced)</span>
              </span>
            </div>
            <div className={styles.blurb}>
              A TUI for spec-driven AI development.
              <br />
              Runs on <span className={styles.acc}>Claude Code</span> and your
              taste.
            </div>
            <pre className={styles.ascii} aria-hidden="true">
              {ASCII_WORDMARK}
            </pre>
          </div>
          {GROUPS.map((group) => (
            <div key={group.heading} className={styles.col}>
              <h5 className={styles.heading}>{group.heading}</h5>
              {group.links.map((link) =>
                link.external ? (
                  <a
                    key={`${group.heading}-${link.label}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={`${group.heading}-${link.label}`}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>
            © 2026 · MIT · built with bun, opentui, and entirely too much
            coffee
          </span>
          <span className={styles.status}>
            <span className={styles.statusLabel}>status:</span>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              operational
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
