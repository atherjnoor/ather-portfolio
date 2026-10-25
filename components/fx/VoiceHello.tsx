'use client';

import { useEffect, useRef, useState } from 'react';
import { KEYS, store } from '@/lib/storage';
import { useFx } from './FxProvider';

const GREETING =
  '! Welcome to my workspace. I’m Ather, a full-stack and AI engineer in Winnipeg. Have a look at my work, shoot a few hoops, and if you’re hiring for a nine to five, I’m sharpest at nine a.m.';

function pickVoice(): SpeechSynthesisVoice | null {
  const vs = window.speechSynthesis.getVoices();
  return (
    vs.find((v) => /^en/i.test(v.lang) && /natural|google|samantha|daniel|aria|jenny|guy/i.test(v.name)) ||
    vs.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}

/**
 * Spoken greeting with on-screen captions. Speech only ever starts from a click
 * (Say hi, the pop-up, the palette or a voice command), never on its own.
 * The pop-up appears once per browser, ~2 s after load, and closes itself after 12 s.
 */
export default function VoiceHello() {
  const fx = useFx();
  const [caption, setCaption] = useState('');
  const [captionShow, setCaptionShow] = useState(false);
  const [helloHidden, setHelloHidden] = useState(true);
  const [helloShow, setHelloShow] = useState(false);
  const timers = useRef<Set<number>>(new Set());

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  const hideHello = () => {
    setHelloShow(false);
    store.set(KEYS.hello, 'done');
    later(() => setHelloHidden(true), 300);
  };

  useEffect(() => {
    const pending = timers.current;
    const canSpeak = 'speechSynthesis' in window;

    const speak = (text: string, onEnd?: () => void) => {
      if (!canSpeak) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/’/g, "'"));
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.02;
      u.pitch = 1;
      u.onstart = () => {
        setCaption(text);
        setCaptionShow(true);
      };
      u.onend = u.onerror = () => {
        setCaptionShow(false);
        onEnd?.();
      };
      synth.speak(u);
    };

    const greet = () => {
      if (!canSpeak) {
        fx.toast('Voice isn’t supported in this browser', 2400);
        return;
      }
      const h = new Date().getHours();
      const g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
      speak(g + GREETING);
    };

    const unregGreet = fx.register('greet', greet);
    const unregSpeak = fx.register('speak', (t) => speak(t));

    let raf = 0;
    if (canSpeak) {
      // Warm up the voice list (it loads asynchronously in Chrome).
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

      if (store.get(KEYS.hello) !== 'done') {
        later(() => {
          setHelloHidden(false);
          raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => setHelloShow(true))));
          later(() => {
            setHelloShow(false);
            store.set(KEYS.hello, 'done');
            later(() => setHelloHidden(true), 300);
          }, 12000);
        }, 2200);
      }
    }

    return () => {
      unregGreet();
      unregSpeak();
      cancelAnimationFrame(raf);
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
      if (canSpeak) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, [fx]);

  return (
    <>
      <div className={captionShow ? 'caption show' : 'caption'} id="caption" aria-live="polite">
        {caption}
      </div>
      <div
        className={helloShow ? 'hello show' : 'hello'}
        id="helloPrompt"
        hidden={helloHidden}
        role="dialog"
        aria-label="Voice greeting"
      >
        <p>
          <b>Hey there 👋</b> Want a quick voice hello?
        </p>
        <div className="row">
          <button
            className="yes"
            id="hpPlay"
            type="button"
            onClick={() => {
              hideHello();
              fx.greet();
            }}
          >
            Play hello
          </button>
          <button className="no" id="hpNo" type="button" onClick={hideHello}>
            No thanks
          </button>
        </div>
      </div>
    </>
  );
}
