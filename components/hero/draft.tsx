import { TerminalWindow } from '@/components/primitives/terminal-window';
import { FooterShortcuts } from '@/components/primitives/footer-shortcuts';
import { tokenColor } from '@/lib/token-color';
import styles from './hero.module.css';

export default function Draft() {
  const tokens = 1847;
  const tokenClass = tokenColor(tokens);
  const tokenClassName =
    tokenClass === 'red' ? 'red' : tokenClass === 'yellow' ? 'ylw' : 'dim';

  return (
    <TerminalWindow title="retro" subtitle="draft — specs/rate-limit.md">
      {/* Info bar */}
      <div className={styles.infoBar}>
        <span>Ticket: </span>
        <b className="cyn">rate-limit</b>
        <span> · Project: </span>
        <b className="acc">acme-app</b>
        <span> · </span>
        <span className="cyn">● </span>
        <span>Draft · </span>
        <span className="dim">→ main</span>
        <span> · References: 2 · </span>
        <span className={tokenClassName}>~1,847 tokens</span>
      </div>

      {/* Split panel */}
      <div className={styles.draftSplit}>
        {/* Left (focused) - editor */}
        <div className={`${styles.draftPanel} ${styles.draftPanelFocused}`}>
          <div className={styles.draftPanelHeader}>
            <span className="dim">FEATURE SPECIFICATION — EDIT</span>
            <span className="grn">saved ✓</span>
          </div>
          <div className="spec-mock">
            <div className="line"><span className="ln">1</span><span className="fm">---</span></div>
            <div className="line"><span className="ln">2</span><span className="fm">status:</span> <span className="dim">draft</span></div>
            <div className="line"><span className="ln">3</span><span className="fm">id:</span> <span className="dim">rate-limit</span></div>
            <div className="line"><span className="ln">4</span><span className="fm">---</span></div>
            <div className="line"><span className="ln">5</span>&nbsp;</div>
            <div className="line"><span className="ln">6</span><span className="h1"># Feature Specification</span></div>
            <div className="line"><span className="ln">7</span>&nbsp;</div>
            <div className="line"><span className="ln">8</span><span className="br">Add a token-bucket rate limiter to all /api/* endpoints.</span></div>
            <div className="line"><span className="ln">9</span><span className="br">Limits are per-API-key, configurable via dashboard.</span></div>
            <div className="line"><span className="ln">10</span>&nbsp;</div>
            <div className="line"><span className="ln">11</span><span className="h2">## Acceptance</span></div>
            <div className="line"><span className="ln">12</span><span className="bullet">- 429 response includes Retry-After header</span></div>
            <div className="line"><span className="ln">13</span><span className="bullet">- Counters persist across process restart</span></div>
            <div className="line"><span className="ln">14</span><span className="bullet">- Admin override bypasses limit</span><span className="caret" /></div>
          </div>
        </div>

        {/* Right (unfocused) - chat */}
        <div className={`${styles.draftPanel} ${styles.draftPanelUnfocused}`}>
          <div className={styles.draftPanelHeader}>
            <span className="dim">PM AGENT CHAT</span>
          </div>

          <div className={styles.chatMessages}>
            <div className={`${styles.msgBlock} ${styles.msgUser}`}>
              <div className={`${styles.msgHeader} acc`}>👤 You</div>
              <div className={styles.msgBody}>
                Add a rate limiter to /api/* endpoints.
              </div>
            </div>

            <div className={`${styles.msgBlock} ${styles.msgPm}`}>
              <div className={`${styles.msgHeader} cyn`}>🤖 PM</div>
              <div className={styles.msgBody}>
                A few edge cases to lock down:
                <br />• Behavior when Redis is unreachable — fail-open or fail-closed?
                <br />• Bypass header for health-check probes (/api/health hits every 30s)
                <br />• Does the admin override apply per-user or globally?
              </div>
            </div>

            <div className={`${styles.msgBlock} ${styles.msgTool}`}>
              <div className={`${styles.msgHeader} ylw`}>Read</div>
              <div className={`${styles.msgBody} dim`}>
                src/api/*.ts (11 files)
              </div>
            </div>

            <div className={`${styles.msgBlock} ${styles.msgUser}`}>
              <div className={`${styles.msgHeader} acc`}>👤 You</div>
              <div className={styles.msgBody}>
                fail-open, log to sentry. bypass health probes. admin override is global.
              </div>
            </div>

            <div className={`${styles.msgBlock} ${styles.msgPm}`}>
              <div className={`${styles.msgHeader} cyn`}>🤖 PM</div>
              <div className={styles.msgBody}>
                Noted. Adding to acceptance criteria.
              </div>
            </div>
          </div>

          <textarea
            className={styles.chatInput}
            rows={5}
            placeholder="Type a message..."
            readOnly
            aria-label="Chat input (static mock)"
          />
          <div className={`${styles.chatInputFooter} dim`}>
            Enter to send · Shift+Enter for newline
          </div>
        </div>
      </div>

      <div className={styles.draftFooter}>
        <FooterShortcuts
          entries={[
            { key: 'Tab', label: 'Switch panel' },
            { key: '⌥e', label: 'Open in editor' },
            { key: '⌥p', label: 'Start plan' },
            { key: '⌥k', label: 'Commands' },
          ]}
        />
      </div>
    </TerminalWindow>
  );
}
