import { about } from '@/content/profile';
import { Rich } from '../Rich';
import { SectionHeading, TitleBlock } from '../TitleBlock';
import Contact from './Contact';

export default function About() {
  return (
    <section className="sheet" id="about" data-name="About" aria-labelledby="aboutTitle">
      <TitleBlock cells={about.titleblock} />
      <div className="about">
        <div>
          <SectionHeading id="aboutTitle" headline={about.headline} />
          {about.paragraphs.map((p) => (
            <p key={p}>
              <Rich text={p} />
            </p>
          ))}
        </div>
        <Contact />
      </div>
    </section>
  );
}
