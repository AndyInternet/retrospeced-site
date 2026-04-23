import { Kbd } from '@/components/primitives/kbd';
import { SectionHead } from '@/components/primitives/section-head';
import { SHORTCUTS } from './data';
import styles from './shortcuts.module.css';

export default function Shortcuts() {
  return (
    <section id="shortcuts">
      <div className="page">
        <SectionHead
          eyebrow="shortcuts"
          title="Hands stay on home row."
          sub="Every screen is one key away, and no action ever requires a mouse. The whole app is a keyboard API first, a UI second."
        />
        <div className={styles.grid}>
          {SHORTCUTS.map((s) => (
            <div className={styles.cell} key={`${s.keys}-${s.desc}`}>
              <Kbd>{s.keys}</Kbd>
              <span className={styles.desc}>{s.desc}</span>
              <span className={`${styles.ctx} dim`}>{s.context}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
