'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sections } from '@/content/profile';
import { useFx } from './fx/FxProvider';

/** Home page only: drives the active nav marker + ruler label from the section in view. */
export default function SectionSpy() {
  const fx = useFx();

  useEffect(() => {
    fx.setSheet('overview');
    if (!('IntersectionObserver' in window)) return;
    const order = sections.map((s) => s.id);
    const vis = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => vis.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
        // Contact is nested inside About: prefer it once it is visible enough.
        let best: (typeof order)[number] | null = null;
        let bestR = 0;
        order.forEach((id) => {
          const r = vis.get(id) || 0;
          if (r > bestR || (id === 'contact' && r > 0.35)) {
            best = id;
            bestR = Math.max(r, bestR);
          }
        });
        if (best) fx.setSheet(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 1], rootMargin: '-38px 0px -35% 0px' },
    );
    order.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [fx]);

  return null;
}

/** Old links used the hash router (#/work/lastclass). Send them to the real route. */
export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (window.location.hash.startsWith('#/work/lastclass')) router.replace('/work/lastclass/');
  }, [router]);
  return null;
}
