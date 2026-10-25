import type { Metadata } from 'next';
import Link from 'next/link';
import { Rich } from '@/components/Rich';
import CaseSheet from '@/components/fx/CaseSheet';
import Reveal from '@/components/fx/Reveal';
import { profile } from '@/content/profile';
import { lastclassCase as c } from '@/content/projects';
import { vars } from '@/lib/css';

export const metadata: Metadata = {
  title: { absolute: c.metaTitle },
  description: c.metaDescription,
  alternates: { canonical: '/work/lastclass/' },
  openGraph: {
    type: 'article',
    url: '/work/lastclass/',
    title: c.metaTitle,
    description: c.metaDescription,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: c.metaTitle }],
  },
  twitter: { card: 'summary_large_image', title: c.metaTitle, description: c.metaDescription, images: ['/og.png'] },
};

export default function LastClassCaseStudy() {
  return (
    <article id="case" aria-labelledby="caseTitle">
      <div className="wrap">
        <p className="crumb">
          <Link className="ul" href="/#work">
            ← Work
          </Link>{' '}
          / LastClass.io
        </p>
        <div className="case-head">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h1 id="caseTitle" style={{ marginTop: 14 }}>
              {c.title}
            </h1>
            <p className="intro" style={{ color: 'var(--muted)', fontSize: 19 }}>
              {c.intro}
            </p>
          </div>
          <dl className="metagrid">
            {c.meta.map((m) => (
              <div key={m.label}>
                <dt className="label">{m.label}</dt>
                <dd style={m.label === 'Status' ? { color: 'var(--mint)' } : undefined}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="case-body stg">
          {c.body.map((b, i) => (
            <div key={b.heading} style={vars({ '--d': i })}>
              <h2>{b.heading}</h2>
              <p>
                <Rich text={b.text} />
              </p>
            </div>
          ))}
        </div>

        <div className="shot">
          <Rich text={c.screenshot} />
        </div>

        <div className="case-more">
          {c.more.map((m) => (
            <div key={m.heading}>
              <h2>{m.heading}</h2>
              <p>
                <Rich text={m.text} />
              </p>
            </div>
          ))}
        </div>

        <footer>
          <Link className="ul" href="/#work" style={{ textDecoration: 'none' }}>
            ← Back to all work
          </Link>
          <a className="ul" href={'mailto:' + profile.email} style={{ textDecoration: 'none' }}>
            {profile.email}
          </a>
        </footer>
      </div>
      <CaseSheet titleId="caseTitle" />
      <Reveal />
    </article>
  );
}
