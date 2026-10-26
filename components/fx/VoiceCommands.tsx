'use client';

import { useEffect, useRef, useState } from 'react';
import { useClientValue } from '@/lib/useMediaQuery';
import { hoursStatus } from '@/lib/winnipegTime';
import { useFx, type FxActions } from './FxProvider';

/* Minimal Web Speech API types (not in lib.dom for every TS version). */
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
};
type RecognitionCtor = new () => Recognition;

const getSR = (): RecognitionCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

function command(fx: FxActions, s: string) {
  const nav = (id: string, label: string) => {
    fx.go(id);
    fx.toast('Heard “' + s + '” → ' + label, 2600);
  };
  if (/\bbats?\b/.test(s)) return fx.swarm();
  if (/light|dark|flashlight/.test(s)) return fx.toggleLights();
  if (/hello|\bhi\b|\bhey\b|greet/.test(s)) return fx.greet();
  if (/shoot|hoop|basket|\bball\b/.test(s)) {
    nav('offclock', 'Basketball');
    window.setTimeout(fx.hoopsAuto, 900);
    return;
  }
  if (/time|awake|available|hours|work mode/.test(s)) {
    const line = hoursStatus(new Date()).line;
    fx.toast(line, 3600);
    fx.speak(line);
    return;
  }
  if (/\bgym\b|work ?out|lifting/.test(s)) return nav('offclock', 'Working out'); // before "work"
  if (/project|work|portfolio/.test(s)) return nav('work', 'Selected work');
  if (/\blab\b|experiment/.test(s)) return nav('lab', 'Lab');
  if (/experience|career|job|resume/.test(s)) return nav('experience', 'Experience');
  if (/hobb|interest|free time|off the clock|cook|hardware/.test(s)) return nav('offclock', 'Off the clock');
  if (/about|who are you/.test(s)) return nav('about', 'About');
  if (/contact|email|reach|hire/.test(s)) return nav('contact', 'Contact');
  if (/\btop\b|home|start|overview/.test(s)) return nav('overview', 'Overview');
  fx.toast('Heard “' + s + '” — try “show projects” or “contact”', 3200);
}

/** The sidebar "Talk" button: voice commands via the Web Speech API. Hidden where unsupported. */
export default function VoiceCommands() {
  const fx = useFx();
  const supported = useClientValue(() => !!getSR(), true);
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);

  // Stop the microphone if this ever unmounts.
  useEffect(
    () => () => {
      rec.current?.abort();
      rec.current = null;
    },
    [],
  );

  const onClick = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const SR = getSR();
    if (!SR) return;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onstart = () => {
      setListening(true);
      fx.toast('Listening… try “show projects”, “lights out” or “release the bats”', 3600);
    };
    r.onend = () => setListening(false);
    r.onerror = (e) =>
      fx.toast(e.error === 'not-allowed' ? 'Microphone access was blocked' : 'Didn’t catch that — try again', 2600);
    r.onresult = (e) => command(fx, e.results[0][0].transcript.toLowerCase());
    rec.current = r;
    try {
      r.start();
    } catch {
      fx.toast('Couldn’t start the microphone', 2400);
    }
  };

  return (
    <button
      id="talkBtn"
      type="button"
      aria-pressed={listening}
      hidden={!supported}
      className={listening ? 'listening' : undefined}
      title="Voice commands — try “show projects”"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </svg>
      Talk
    </button>
  );
}
