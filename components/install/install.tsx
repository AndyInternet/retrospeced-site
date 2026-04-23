'use client';

import { useId, useState } from 'react';
import { Github } from 'lucide-react';
import { SectionHead } from '@/components/primitives/section-head';
import { CopyButton } from '@/components/primitives/copy-button';
import styles from './install.module.css';

export type InstallTab = 'git' | 'bin';

export interface CmdLine {
  kind: 'comment' | 'cmd';
  text: string;
}

export const TAB_LABELS: Record<InstallTab, string> = {
  git: 'from source',
  bin: 'standalone binary',
};

// Lifted from design/reference/src/install.jsx. Comment `text` is stored
// without the leading `#` — the prefix is rendered by the component so the
// copy-to-clipboard payload for command lines is just the command.
export const INSTALL_COMMANDS: Record<InstallTab, CmdLine[]> = {
  git: [
    { kind: 'comment', text: 'clone' },
    { kind: 'cmd', text: 'git clone github.com/you/retrospeced-tui' },
    { kind: 'cmd', text: 'cd retrospeced-tui' },
    { kind: 'cmd', text: 'bun install' },
    { kind: 'cmd', text: 'bun src/index.tsx' },
  ],
  bin: [
    { kind: 'comment', text: 'build single binary' },
    { kind: 'cmd', text: 'bun run build' },
    { kind: 'cmd', text: 'cp bin/retro /usr/local/bin/' },
    { kind: 'cmd', text: 'retro' },
  ],
};

export const PREREQS: {
  title: string;
  code?: string;
  href?: string;
  sub?: string;
}[] = [
  {
    title: 'macOS 13+ (Ventura or later)',
    sub: 'Linux & Windows coming — star the repo to follow along.',
  },
  {
    title: 'Install Bun',
    code: 'curl -fsSL https://bun.sh/install | bash',
    href: 'https://bun.sh',
  },
  {
    title: 'Install the Claude Code CLI',
    code: 'npm i -g @anthropic-ai/claude-code',
    href: 'https://docs.anthropic.com/en/docs/claude-code',
  },
  {
    title: 'Install the GitHub CLI and run',
    code: 'gh auth login',
    href: 'https://cli.github.com',
  },
  {
    title: 'Get an Anthropic API key — paste it into Settings on first launch',
    href: 'https://console.anthropic.com/',
  },
];

const TAB_ORDER: InstallTab[] = ['git', 'bin'];

export default function Install() {
  const [active, setActive] = useState<InstallTab>('git');
  const uid = useId();
  const tabId = (id: InstallTab) => `${uid}-tab-${id}`;
  const panelId = (id: InstallTab) => `${uid}-panel-${id}`;

  const lines = INSTALL_COMMANDS[active];

  return (
    <section id="install">
      <div className="page">
        <SectionHead
          eyebrow="quickstart"
          title="Running in ninety seconds."
          sub="You'll need bun, the Claude Code CLI, the GitHub CLI, and an Anthropic API key. Retro is a single bun script — or a single binary, if you prefer."
        />

        <div className={styles.grid}>
          <div className={styles.prereqCard}>
            <h4 className={styles.prereqHead}>Prerequisites</h4>
            <ul className={styles.prereqList}>
              {PREREQS.map((p) => (
                <li className={styles.prereqItem} key={p.title}>
                  <div className={styles.prereqTitle}>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                    {p.code && <code className={styles.prereqCode}>{p.code}</code>}
                  </div>
                  {p.sub && <div className={styles.prereqSub}>{p.sub}</div>}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.installCard}>
            <div className={styles.tablist} role="tablist" aria-label="Install method">
              {TAB_ORDER.map((id) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={tabId(id)}
                    aria-selected={isActive}
                    aria-controls={panelId(id)}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(id)}
                    className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                  >
                    {TAB_LABELS[id]}
                  </button>
                );
              })}
            </div>

            {TAB_ORDER.map((id) => {
              const isActive = active === id;
              return (
                <div
                  key={id}
                  role="tabpanel"
                  id={panelId(id)}
                  aria-labelledby={tabId(id)}
                  hidden={!isActive}
                  className={styles.panel}
                >
                  {isActive && (
                    <div className={styles.code}>
                      {lines.map((line, i) =>
                        line.kind === 'comment' ? (
                          <div key={i} className={styles.lineComment}>
                            <span className={styles.lineText}># {line.text}</span>
                          </div>
                        ) : (
                          <div key={i} className={styles.lineCmd}>
                            <span className={styles.lineText}>
                              <span className={styles.prompt}>$</span>{' '}
                              <span className={styles.cmd}>{line.text}</span>
                            </span>
                            <CopyButton text={line.text} />
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.callout}>
          <div className={styles.calloutText}>
            Currently macOS-only. Cross-platform support is on the roadmap.
          </div>
          <a
            className={`btn primary ${styles.cta}`}
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={14} strokeWidth={1.75} aria-hidden="true" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
