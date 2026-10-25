'use client';

import { useEffect } from 'react';
import { profile } from '@/content/profile';
import { SectionLink } from './SectionLink';
import { useFx, useFxState } from './fx/FxProvider';

/** Phone-width header. The Menu button slides the sidebar in (CSS: body.menu-open). */
export default function MobileTopbar() {
  const fx = useFx();
  const { menuOpen } = useFxState();

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fx.setMenu(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen, fx]);

  return (
    <header className="topbar">
      <SectionLink section="overview" className="mark" aria-label="AJN — Ather Johear Noor, home">
        {profile.initials}
      </SectionLink>
      <button id="menuBtn" aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => fx.setMenu(!menuOpen)}>
        {menuOpen ? 'Close' : 'Menu'}
      </button>
    </header>
  );
}
