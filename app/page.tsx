import Hero from '@/components/hero/hero';
import Pipeline from '@/components/pipeline/pipeline';
import Features from '@/components/features/features';
import Shortcuts from '@/components/shortcuts/shortcuts';
import Constitution from '@/components/constitution/constitution';
import Install from '@/components/install/install';

export default function Page() {
  return (
    <>
      <Hero />
      <section id="how-it-works">
        <Pipeline />
      </section>
      <Features />
      <Shortcuts />
      <Constitution />
      <Install />
    </>
  );
}
