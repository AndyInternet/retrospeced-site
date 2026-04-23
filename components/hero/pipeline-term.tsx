import { TerminalWindow } from '@/components/primitives/terminal-window';
import { PHASES } from '@/components/pipeline/phases';
import styles from './hero.module.css';

export default function PipelineTerm() {
  const phase = PHASES[2]; // execution

  return (
    <TerminalWindow title="retro" subtitle="building — rate-limit">
      <div className={styles.pipeHeader}>
        <div className={styles.pipeHeaderLeft}>
          <span>Ticket: </span>
          <b className="cyn">rate-limit</b>
          <span> · Project: </span>
          <b className="acc">acme-app</b>
          <span className="dim"> · → main</span>
        </div>
        <div className={styles.pipePill}>
          <span>⠋ Task 3 of 5</span>
        </div>
      </div>

      <div className={styles.pipeLog}>
        {phase.events.map((event, i) => (
          <div key={i} className={styles.pipeLine}>
            {event.node}
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}
