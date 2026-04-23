'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { TerminalWindow } from '@/components/primitives/terminal-window';
import { SectionHead } from '@/components/primitives/section-head';
import { useBrailleSpinner } from '@/lib/braille';
import { PHASES, PIPELINE_ADVANCE_MS, PIPELINE_REVEAL_MS } from './phases';
import styles from './pipeline.module.css';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(cb: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export default function Pipeline() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(1);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const braille = useBrailleSpinner();

  const activeRef = useRef(active);
  const shownRef = useRef(shown);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  // Combined reveal + advance effect (refs avoid stale closures)
  useEffect(() => {
    if (reducedMotion) return;

    const revealId = window.setInterval(() => {
      setShown((s) => {
        const len = PHASES[activeRef.current].events.length;
        return s < len ? s + 1 : s;
      });
    }, PIPELINE_REVEAL_MS);

    let advanceId: number | null = null;
    if (!hovering) {
      advanceId = window.setInterval(() => {
        const len = PHASES[activeRef.current].events.length;
        if (shownRef.current >= len) {
          setActive((a) => (a + 1) % PHASES.length);
          setShown(1);
        }
      }, PIPELINE_ADVANCE_MS);
    }

    return () => {
      window.clearInterval(revealId);
      if (advanceId !== null) window.clearInterval(advanceId);
    };
  }, [hovering, reducedMotion]);

  const handleEnter = (i: number) => {
    setHovering(true);
    setActive(i);
    setShown(1);
  };

  const phase = PHASES[active];
  // Under reduced motion: render all events immediately (derived, avoids setState in effect)
  const displayShown = reducedMotion ? phase.events.length : shown;
  const visibleEvents = phase.events.slice(0, displayShown);
  const streaming = displayShown < phase.events.length;

  return (
    <>
      <SectionHead
        eyebrow="how it works"
        title="A six-phase build loop you can watch in real time."
        sub="Retro orchestrates Claude Code through a deterministic pipeline — planning, task generation, execution, review, retro rollup, PR. Every phase streams typed events, so you see every tool call, every file touched, every retry. If a build fails, it resumes from the last good phase instead of starting from zero."
      />

      <div className={styles.pipeline}>
        <div
          className={styles.steps}
          onMouseLeave={() => setHovering(false)}
        >
          {PHASES.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.step} ${isActive ? styles.stepActive : ''}`}
                onMouseEnter={() => handleEnter(i)}
                onFocus={() => handleEnter(i)}
                aria-pressed={isActive}
              >
                <span className={styles.stepNum}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.stepBody}>
                  <span className={styles.stepLabel}>{p.name}</span>
                  <span className={styles.stepSub}>{p.sub}</span>
                </span>
                <span className={styles.stepArrow} aria-hidden>
                  →
                </span>
              </button>
            );
          })}
        </div>

        <TerminalWindow className={styles.panel}>
          <div className={styles.logHeader}>
            <div className={styles.logHeaderLeft}>
              <span>Ticket: </span>
              <b className="cyn">rate-limit</b>
              <span> · Project: </span>
              <b className="acc">acme-app</b>
              <span className="dim"> · → main</span>
            </div>
            <div className={styles.logPill}>
              <span>
                {braille} Task {active + 1} of {PHASES.length}
              </span>
            </div>
          </div>

          <div className={styles.log}>
            {visibleEvents.map((event, i) => (
              <div key={i} className={styles.logLine}>
                {event.node}
              </div>
            ))}
            {streaming && (
              <div className={styles.logLine}>
                <span className="acc">{braille}</span>
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    </>
  );
}
