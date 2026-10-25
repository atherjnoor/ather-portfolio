'use client';

import { hoursCopy } from '@/content/interests';
import { vars } from '@/lib/css';
import { useWinnipegHours } from '@/lib/winnipegTime';

/** "Sharpest at 9 a.m." — live Winnipeg time on a 6a–10p day bar with 9–5 highlighted. */
export default function WorkHours() {
  const h = useWinnipegHours();

  return (
    <article className="panel crop card hours-card" aria-labelledby="hoursTitle">
      <div className="sky" aria-hidden="true">
        <span className="sun"></span>
      </div>
      <span className="label">{hoursCopy.label}</span>
      <h3 id="hoursTitle">
        {hoursCopy.title.plain}
        <i style={{ color: 'var(--mint)' }}>{hoursCopy.title.em}</i>
      </h3>
      <span className="hourstime" id="hoursTime">
        {h?.time ?? '--:--'}
      </span>
      <div className="day" aria-hidden="true">
        <div className="track">
          <span className="block"></span>
          <span
            className="now"
            id="dayNow"
            style={h ? vars({ '--pos': (h.pos * 100).toFixed(2) + '%' }) : undefined}
          ></span>
        </div>
        <div className="ticks">
          {hoursCopy.ticks.map((t) => (
            <span key={t.t} className={t.on ? 'on' : undefined} style={{ left: t.left }}>
              {t.t}
            </span>
          ))}
        </div>
      </div>
      <p id="hoursText">{h?.line ?? hoursCopy.loading}</p>
    </article>
  );
}
