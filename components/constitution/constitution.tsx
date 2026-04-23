'use client';

import { useState } from 'react';
import { SectionHead } from '@/components/primitives/section-head';
import { RULES, buildConstitutionMarkdown } from './rules';
import styles from './constitution.module.css';

export default function Constitution() {
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RULES.map((r) => [r.id, r.defaultOn])),
  );

  const toggle = (id: string) =>
    setOn((prev) => ({ ...prev, [id]: !prev[id] }));

  const ruleStates = RULES.map((rule) => ({ rule, on: !!on[rule.id] }));
  const activeCount = ruleStates.filter((r) => r.on).length;

  // ISO timestamp regenerated on every render so "# Regenerated {iso}"
  // is always fresh — do NOT store in state.
  const nowIso = new Date().toISOString();
  const markdown = buildConstitutionMarkdown(ruleStates, nowIso);

  return (
    <section id="constitution">
      <div className="page">
        <SectionHead
          eyebrow="constitution"
          title="Your taste, as a system prompt."
          sub="Toggle the engineering principles every build agent has to follow. Retro regenerates .retro/constitution.md on each change — click the rules, try it."
        />

        <div className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span>.retro/constitution.md · toggles</span>
              <span>
                <span className="acc">●</span> {activeCount}/{RULES.length}{' '}
                active
              </span>
            </div>
            <div className={styles.panelBody}>
              {RULES.map((r) => {
                const isOn = !!on[r.id];
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => toggle(r.id)}
                    className={`${styles.row} ${isOn ? styles.on : ''}`}
                    aria-pressed={isOn}
                  >
                    <span className={styles.rule}>
                      <span className={styles.check} aria-hidden="true" />
                      <span className={styles.ruleText}>
                        <span className={styles.ruleLabel}>{r.label}</span>
                        <span className={styles.ruleDesc}>{r.description}</span>
                      </span>
                    </span>
                    <span className={styles.state}>{isOn ? 'ON' : 'OFF'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.previewWrap}>
            <div className={styles.previewLabel}>
              generated → .retro/constitution.md
            </div>
            <pre
              className={`${styles.preview} ${activeCount === 0 ? styles.previewEmpty : ''}`}
              suppressHydrationWarning
            >
              {markdown}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
