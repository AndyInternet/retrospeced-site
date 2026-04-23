'use client';

import { useState, useSyncExternalStore } from 'react';
import { Bolt, ArrowRight, Github } from 'lucide-react';
import Kanban from './kanban.tsx';
import Draft from './draft';
import PipelineTerm from './pipeline-term';
import styles from './hero.module.css';

type HeroVariant = 'kanban' | 'draft' | 'pipeline';

const INSTALL_CMD =
  'git clone github.com/you/retrospeced-tui && cd $_ && bun install';

function subscribeHeroVariant(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-hero-variant'],
  });
  return () => observer.disconnect();
}

function getHeroVariantSnapshot(): HeroVariant {
  const v = document.documentElement.dataset.heroVariant;
  if (v === 'draft' || v === 'pipeline' || v === 'kanban') return v;
  return 'kanban';
}

function getHeroVariantServerSnapshot(): HeroVariant {
  return 'kanban';
}

export default function Hero() {
  // Variant switching gated on build-time env flag — dead-code-eliminated
  // when NEXT_PUBLIC_TWEAKS !== '1'.
  const tweaks = process.env.NEXT_PUBLIC_TWEAKS === '1';
  const variant = useSyncExternalStore(
    tweaks ? subscribeHeroVariant : () => () => {},
    tweaks ? getHeroVariantSnapshot : getHeroVariantServerSnapshot,
    getHeroVariantServerSnapshot,
  );
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="page">
        <div className="hero-inner">
          <div>
            <span className="hero-badge">
              <span className="pulse" />
              v0.4 · open source · mit-ish · macOS
            </span>

            <h1>
              Spec-driven<br />
              AI dev from the<br />
              <span className="accent">command line.</span>
            </h1>

            <p className="tag">
              <strong>Retro</strong> is a terminal UI that runs the full feature lifecycle —
              <span className="br"> draft a spec, plan it, build it, ship the PR</span> —
              while you stay in control of the review loop. No IDE plugin, no web dashboard, no context switch.
            </p>

            <div className="hero-ctas">
              <button
                type="button"
                className="btn primary"
                onClick={copy}
              >
                <Bolt size={13} /> {copied ? 'copied' : 'Install retro'}
              </button>
              <a className="btn" href="#how-it-works">
                How it works <ArrowRight size={13} />
              </a>
              <a
                className="btn ghost"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github size={13} /> github
              </a>
            </div>

            <div className="install-strip">
              <span className="prompt">$</span>
              <span className="cmd">{INSTALL_CMD}</span>
              <button
                type="button"
                className="copy"
                onClick={copy}
              >
                {copied ? 'copied' : 'copy'}
              </button>
            </div>

            <div className="hero-meta">
              <span><strong>bun</strong> native</span>
              <span className="dot">{'//'}</span>
              <span>runs on <strong>Claude</strong> Code</span>
              <span className="dot">{'//'}</span>
              <span>no db, no cloud</span>
              <span className="dot">{'//'}</span>
              <span><strong>80×24</strong> minimum</span>
              <span className="dot">{'//'}</span>
              <span>platform: <strong>macOS 13+</strong></span>
            </div>
          </div>

          <div className={styles.heroTerminal}>
            {variant === 'draft' ? (
              <Draft />
            ) : variant === 'pipeline' ? (
              <PipelineTerm />
            ) : (
              <Kanban />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
