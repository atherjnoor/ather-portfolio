'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { useFx } from './FxProvider';

export default function BackToTop() {
  const fx = useFx();
  const onHome = usePathname() === '/';
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(document.documentElement.scrollTop > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={show ? 'totop show' : 'totop'}
      id="totop"
      type="button"
      aria-label="Back to top"
      onClick={() => {
        // From the case study, "top" means back to the overview (as in the original).
        if (!onHome) fx.go('overview');
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }}
    >
      ↑ TOP
    </button>
  );
}
