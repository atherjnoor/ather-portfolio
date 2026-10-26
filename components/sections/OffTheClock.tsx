import { offSection } from '@/content/interests';
import FlipCard from '../fx/FlipCard';
import HardwareBoard from '../fx/HardwareBoard';
import Hoops from '../fx/Hoops';
import WorkHours from '../fx/WorkHours';
import Workout from '../fx/Workout';
import { SectionHeading, TitleBlock } from '../TitleBlock';

export default function OffTheClock() {
  return (
    <section className="sheet" id="offclock" data-name="Off the clock" aria-labelledby="offTitle">
      <TitleBlock cells={offSection.titleblock} />
      <SectionHeading id="offTitle" headline={offSection.headline} />
      <p className="lede">
        {offSection.lede} <span className="kbd">B</span>.
      </p>

      <div className="offgrid">
        <Hoops />
        <WorkHours />
        <HardwareBoard />
        <FlipCard />
        <Workout />
      </div>
    </section>
  );
}
