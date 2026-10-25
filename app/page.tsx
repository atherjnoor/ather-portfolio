import SectionSpy, { LegacyHashRedirect } from '@/components/SectionSpy';
import Reveal from '@/components/fx/Reveal';
import Spotlight from '@/components/fx/Spotlight';
import KbdHint from '@/components/fx/KbdHint';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Lab from '@/components/sections/Lab';
import OffTheClock from '@/components/sections/OffTheClock';
import Overview from '@/components/sections/Overview';
import Work from '@/components/sections/Work';
import { footer } from '@/content/profile';

export default function Home() {
  return (
    <div id="home">
      <div className="wrap">
        <Overview />
        <Work />
        <Lab />
        <Experience />
        <OffTheClock />
        <About />

        <footer>
          <span>{footer.credit}</span>
          <span>
            Press <KbdHint id="kHint2" /> to jump · <span className="kbd">B</span> bats ·{' '}
            <span className="kbd">L</span> lights
          </span>
        </footer>
      </div>

      <SectionSpy />
      <Reveal />
      <Spotlight />
      <LegacyHashRedirect />
    </div>
  );
}
