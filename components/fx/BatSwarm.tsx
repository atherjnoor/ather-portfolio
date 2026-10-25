'use client';

import { useEffect } from 'react';
import { BAT_SVG, isTyping, paletteOpen } from '@/lib/bat';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { useFx } from './FxProvider';

/** Press B (or use the palette / voice / a 3-in-a-row) to release a swarm of bats. */
export default function BatSwarm() {
  const fx = useFx();

  useEffect(() => {
    const live = new Set<HTMLElement>();

    const swarm = () => {
      if (prefersReducedMotion()) {
        fx.toast('The bats are resting — reduced motion is on', 2400);
        return;
      }
      const W = window.innerWidth,
        H = window.innerHeight,
        n = W < 700 ? 9 : 16;
      for (let i = 0; i < n; i++) {
        const b = document.createElement('span');
        b.className = 'swarmbat';
        b.innerHTML = BAT_SVG;
        b.style.width = 18 + Math.random() * 28 + 'px';
        b.style.color = Math.random() < 0.3 ? '#7DDCB0' : '#ECE8DF';
        document.body.appendChild(b);
        live.add(b);
        const y0 = H * (0.08 + Math.random() * 0.78),
          amp = 20 + Math.random() * 40,
          dir = Math.random() < 0.5 ? 1 : -1;
        const x0 = dir > 0 ? -70 : W + 70,
          x1 = dir > 0 ? W + 70 : -70;
        const frames: Keyframe[] = [];
        for (let k = 0; k <= 8; k++) {
          const t = k / 8;
          frames.push({
            transform: 'translate(' + (x0 + (x1 - x0) * t) + 'px,' + (y0 + Math.sin(t * Math.PI * 3 + i) * amp) + 'px)',
          });
        }
        const a = b.animate(frames, {
          duration: 2200 + Math.random() * 2200,
          delay: Math.random() * 700,
          easing: 'linear',
          fill: 'backwards',
        });
        a.onfinish = () => {
          b.remove();
          live.delete(b);
        };
      }
      fx.toast('🦇 Bats released', 1600);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || paletteOpen() || isTyping()) return;
      if (e.key === 'b' || e.key === 'B') swarm();
    };

    const unregister = fx.register('swarm', swarm);
    document.addEventListener('keydown', onKey);
    return () => {
      unregister();
      document.removeEventListener('keydown', onKey);
      live.forEach((b) => b.remove());
    };
  }, [fx]);

  return null;
}
