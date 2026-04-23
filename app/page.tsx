import Hero from '@/components/hero/hero';
import Pipeline from '@/components/pipeline/pipeline';
import Features from '@/components/features/features';
import Shortcuts from '@/components/shortcuts/shortcuts';
import Constitution from '@/components/constitution/constitution';
import Install from '@/components/install/install';

export default function Page() {
  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <section id="how-it-works">
        <Pipeline />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="shortcuts">
        <Shortcuts />
      </section>
      <section id="constitution">
        <Constitution />
      </section>
      <section id="install">
        <Install />
      </section>
    </>
  );
}
