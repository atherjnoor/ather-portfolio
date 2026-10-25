import Link from 'next/link';
import type { Fact } from '@/content/types';
import { lastclass, ollamaforge, workSection } from '@/content/projects';
import { isLive, vars } from '@/lib/css';
import { Rich } from '../Rich';
import { SectionHeading, TitleBlock } from '../TitleBlock';

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="label">{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Status({ text }: { text: string }) {
  return <span className={isLive(text) ? 'status live' : 'status'}>{text}</span>;
}

export default function Work() {
  return (
    <section className="sheet" id="work" data-name="Work" aria-labelledby="workTitle">
      <TitleBlock cells={workSection.titleblock} />
      <SectionHeading id="workTitle" headline={workSection.headline} />

      <div className="work">
        <article className="panel crop proj rv">
          <div className="copy">
            <div className="meta">
              <Status text={lastclass.status} />
              <span className="label">{lastclass.when}</span>
            </div>
            <h3>{lastclass.name}</h3>
            <p>{lastclass.summary}</p>
            <Facts facts={lastclass.facts} />
            <Link className="go" href={lastclass.link.href}>
              {lastclass.link.label} <span className="arr">{lastclass.link.arrow}</span>
            </Link>
          </div>
          <div className="visual" aria-label="LastClass core flows">
            <span className="label">{lastclass.flowsLabel}</span>
            <ol className="rail stg">
              {lastclass.flows.map((f, i) => (
                <li
                  key={f}
                  className={i === lastclass.flows.length - 1 ? 'sos' : undefined}
                  style={vars({ '--d': i })}
                >
                  {f} <small>{String(i + 1).padStart(2, '0')}</small>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="panel crop proj term rv">
          <div className="copy">
            <div className="meta">
              <Status text={ollamaforge.status} />
              <span className="label">{ollamaforge.when}</span>
            </div>
            <h3>{ollamaforge.name}</h3>
            <p>{ollamaforge.summary}</p>
            <Facts facts={ollamaforge.facts} />
            <a className="go" href={ollamaforge.link.href} target="_blank" rel="noopener">
              {ollamaforge.link.label} <span className="arr">{ollamaforge.link.arrow}</span>
            </a>
            {ollamaforge.repoTodo && <Rich text={ollamaforge.repoTodo} />}
          </div>
          <div className="visual">
            <div className="term-win" role="img" aria-label="Terminal panel listing what OllamaForge handles">
              <div className="term-bar">
                <i></i>
                <i></i>
                <i></i>
                <span>{ollamaforge.terminal.title}</span>
              </div>
              <div className="term-body">
                <div className="c"># what it handles</div>
                {ollamaforge.terminal.handles.map((h) => (
                  <div key={h}>
                    <span className="g">▸</span> {h}
                  </div>
                ))}
                <div className="c" style={{ marginTop: 8 }}>
                  # built with
                </div>
                <div>{ollamaforge.terminal.builtWith}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
