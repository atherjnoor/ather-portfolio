import { Fragment } from 'react';
import { hero, strip } from '@/content/profile';
import { vars } from '@/lib/css';
import ArchitectureFigure from '../fx/ArchitectureFigure';

/** Split text into words that rise in one by one (`--i` drives the delay). */
function words(text: string, start: number) {
  let i = start;
  return text.split(/(\s+)/).map((part, k) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return <Fragment key={k}>{part}</Fragment>;
    return (
      <span key={k} className="w" aria-hidden="true" style={vars({ '--i': i++ })}>
        {part}
      </span>
    );
  });
}

export default function Overview() {
  const { plain, em } = hero.headline;
  const plainWords = plain.trim().split(/\s+/).length;

  return (
    <section className="sheet" id="overview" data-name="Overview" aria-label="Overview">
      <div className="hero">
        <div>
          <p className="eyebrow seq" style={vars({ '--sd': '0ms' })}>
            {hero.eyebrow}
          </p>
          <h1 aria-label={(plain + em).replace(/\s+/g, ' ').trim()}>
            {words(plain, 0)}
            <i>{words(em, plainWords)}</i>
          </h1>
          <p className="intro seq" style={vars({ '--sd': '520ms' })}>
            {hero.intro}
          </p>
          <div className="actions seq" style={vars({ '--sd': '680ms' })}>
            <a className="btn primary" href={hero.primary.href}>
              {hero.primary.label}
            </a>
            <a className="btn ghost" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </div>

        <ArchitectureFigure />
      </div>

      <div className="strip stg">
        {strip.map((s, i) => (
          <div key={s.label} style={vars({ '--d': i })}>
            <span className="label">{s.label}</span>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
