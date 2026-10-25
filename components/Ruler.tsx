'use client';

import { useEffect, useRef } from 'react';
import { ruler as rulerCopy, sections } from '@/content/profile';
import { useFinePointer } from '@/lib/useFinePointer';
import { useFxState } from './fx/FxProvider';

/** Sticky drafting ruler: sheet label, scroll-progress line, and a cursor tick with X/Y readout. */
export default function Ruler() {
  const { sheet } = useFxState();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const xyRef = useRef<HTMLSpanElement>(null);

  // Scroll progress
  useEffect(() => {
    const ruler = ref.current;
    if (!ruler) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight || 1;
      ruler.style.setProperty('--p', Math.min(1, h.scrollTop / max).toFixed(4));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Drafting cursor (mouse/trackpad only)
  useEffect(() => {
    const ruler = ref.current;
    const xy = xyRef.current;
    const main = document.querySelector('main');
    if (!fine || !ruler || !xy || !main) return;
    const onMove = (e: MouseEvent) => {
      const r = ruler.getBoundingClientRect();
      const x = Math.max(0, e.clientX - r.left);
      ruler.style.setProperty('--x', x + 'px');
      xy.textContent =
        'X ' + String(Math.round(x)).padStart(4, '0') + ' · Y ' + String(Math.round(e.clientY + window.scrollY)).padStart(4, '0');
      ruler.classList.add('hot');
    };
    const onLeave = () => ruler.classList.remove('hot');
    main.addEventListener('mousemove', onMove);
    main.addEventListener('mouseleave', onLeave);
    return () => {
      main.removeEventListener('mousemove', onMove);
      main.removeEventListener('mouseleave', onLeave);
      ruler.classList.remove('hot');
    };
  }, [fine]);

  return (
    <div className="ruler" aria-hidden="true" ref={ref}>
      <span>
        <span className="dot"></span>SHEET <b id="sheetNo">{sheet.no}</b> / {String(sections.length).padStart(2, '0')} —{' '}
        <b id="sheetName">{sheet.name}</b>
      </span>
      <span className="xy" id="xy" ref={xyRef}>
        X 0000 · Y 0000
      </span>
      <span>{rulerCopy.right}</span>
      <span className="cur"></span>
      <span className="prog"></span>
    </div>
  );
}
