'use client';

import { useEffect } from 'react';
import { profile, sections } from '@/content/profile';
import { vars } from '@/lib/css';
import { useClientValue } from '@/lib/useMediaQuery';
import { hasFinePointer } from '@/lib/useFinePointer';
import { useWinnipegHours } from '@/lib/winnipegTime';
import { SectionLink } from './SectionLink';
import { useFx, useFxState } from './fx/FxProvider';
import KbdHint from './fx/KbdHint';
import VoiceCommands from './fx/VoiceCommands';

const canSpeak = () => 'speechSynthesis' in window;

export default function Sidebar() {
  const fx = useFx();
  const { sheet, batOn, lightsOut } = useFxState();
  const fine = useClientValue(hasFinePointer, true);
  const speech = useClientValue(canSpeak, true);
  const hours = useWinnipegHours();
  const working = hours?.working ?? false;

  // The sidebar status, the hours card and the clock all turn mint in work hours.
  useEffect(() => {
    document.body.classList.toggle('work-hours', working);
    return () => document.body.classList.remove('work-hours');
  }, [working]);

  const close = () => fx.setMenu(false);

  return (
    <aside className="side" id="sidebar" aria-label="Site navigation">
      <SectionLink
        section="overview"
        className="mark"
        aria-label="AJN — Ather Johear Noor, home"
        style={{ alignSelf: 'flex-start' }}
        onClick={close}
      >
        {profile.initials}
      </SectionLink>
      <div className="who">
        <b>{profile.name}</b>
        <span>{profile.role}</span>
      </div>
      <nav aria-label="Sections">
        <ul className="nav" id="nav">
          {sections.map((s, i) => (
            <li key={s.id} style={vars({ '--d': i })}>
              <SectionLink section={s.id} aria-current={sheet.id === s.id ? 'true' : 'false'} onClick={close}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>
      <button className="jump" id="jumpBtn" aria-haspopup="dialog" onClick={fx.openPalette}>
        Jump to… <KbdHint id="kHint" />
      </button>
      <div className="ctrls" role="group" aria-label="Fun controls">
        <button
          id="batBtn"
          type="button"
          aria-pressed={batOn}
          hidden={!fine}
          title="Bat cursor (click anywhere for sonar, press B for a swarm)"
          onClick={() => {
            fx.setBat(!batOn);
            fx.toast(!batOn ? 'Bat cursor on — click anywhere for sonar' : 'Bat cursor off', 2200);
          }}
        >
          <svg viewBox="0 0 64 32" aria-hidden="true">
            <path d="M32 9.5 L30.2 5.5 L29.4 10 C27 8 20 6 4 9 C9 11 11 15 11 19 C14 16 18 16 20 19 C22 16 26 16 28 21 L32 24 L36 21 C38 16 42 16 44 19 C46 16 50 16 53 19 C53 15 55 11 60 9 C44 6 37 8 34.6 10 L33.8 5.5 Z" />
          </svg>
          Bats
        </button>
        <button
          id="lightBtn"
          type="button"
          aria-pressed={lightsOut}
          title="Lights out — flashlight mode (L)"
          onClick={fx.toggleLights}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h10l-2 6H9L7 2zm2 7h6v13H9V9z" />
          </svg>
          Lights
        </button>
        <button id="helloBtn" type="button" hidden={!speech} title="Play a short voice greeting" onClick={fx.greet}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            <path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
          Say hi
        </button>
        <VoiceCommands />
      </div>
      <div className="side-foot">
        <a className="ul" href={profile.github.url} target="_blank" rel="noopener" onClick={close}>
          GitHub ↗
        </a>
        <a className="ul" href={profile.linkedin.url} target="_blank" rel="noopener" onClick={close}>
          LinkedIn ↗
        </a>
        <span className="loc">
          {profile.location} · <span id="clock">{hours?.time ?? '--:--'}</span>
        </span>
        <span className="avail">
          ● <span id="avail">{hours?.side ?? 'checking hours…'}</span>
        </span>
      </div>
    </aside>
  );
}
