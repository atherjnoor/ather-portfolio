import { education, educationLabel } from '@/content/education';
import { experienceSection, moreRoles, roles } from '@/content/experience';
import { vars } from '@/lib/css';
import { Rich } from '../Rich';
import { SectionHeading, TitleBlock } from '../TitleBlock';

export default function Experience() {
  return (
    <section className="sheet" id="experience" data-name="Experience" aria-labelledby="expTitle">
      <TitleBlock cells={experienceSection.titleblock} />
      <SectionHeading id="expTitle" headline={experienceSection.headline} />

      <div className="exp">
        <div>
          <ol className="log stg">
            {roles.map((r, i) => (
              <li key={r.title} className={r.now ? 'now' : undefined} style={vars({ '--d': i })}>
                <span className="when">{r.when}</span>
                <h3>{r.title}</h3>
                <div className="org">{r.org}</div>
                <p className="d">
                  <Rich text={r.text} />
                </p>
              </li>
            ))}
          </ol>
          <details className="more">
            <summary>
              {moreRoles.summary} <span className="mono">{moreRoles.toggle}</span>
            </summary>
            <ul>
              {moreRoles.items.map((m) => (
                <li key={m.role}>
                  {m.role} <span>{m.when}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="panel crop edu rv stg">
          <span className="label" style={vars({ '--d': 0 })}>
            {educationLabel}
          </span>
          {education.map((e, i) => (
            <div key={e.school} style={vars({ '--d': i + 1 })}>
              <b>{e.school}</b>
              <span>
                <Rich text={e.detail} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
