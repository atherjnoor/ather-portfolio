import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Page not found · Ather Johear Noor' },
  robots: { index: false },
};

/** Exported as out/404.html, which Netlify serves for unknown paths. Built only from existing styles. */
export default function NotFound() {
  return (
    <div className="wrap">
      <section className="sheet seen" aria-labelledby="nfTitle">
        <div className="titleblock">
          <span>Sheet 404</span>
          <span>Not found</span>
          <span>Off the plan</span>
        </div>
        <h1 id="nfTitle">
          This sheet isn’t <i>in the set.</i>
        </h1>
        <p className="lede">The page you’re looking for doesn’t exist, or it has moved.</p>
        <div className="actions">
          <Link className="btn primary" href="/">
            Back to the overview →
          </Link>
          <Link className="btn ghost" href="/work/lastclass/">
            LastClass.io case study
          </Link>
        </div>
      </section>
    </div>
  );
}
