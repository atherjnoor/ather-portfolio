'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import { isTyping } from '@/lib/bat';
import { useFx, type FxActions } from './FxProvider';

type Item = { t: string; k: string; run: () => void };

function buildItems(fx: FxActions): Item[] {
  const go = (id: string) => () => fx.go(id);
  return [
    { t: 'Overview', k: 'Section', run: go('overview') },
    { t: 'Selected work', k: 'Section', run: go('work') },
    { t: 'LastClass.io case study', k: 'Project', run: go('/work/lastclass/') },
    { t: 'Lab — experiments', k: 'Section', run: go('lab') },
    { t: 'Experience', k: 'Section', run: go('experience') },
    { t: 'About', k: 'Section', run: go('about') },
    { t: 'Contact', k: 'Section', run: go('contact') },
    { t: 'Off the clock — interests', k: 'Section', run: go('offclock') },
    { t: 'Release the bats', k: 'Fun · B', run: fx.swarm },
    { t: 'Lights out (flashlight mode)', k: 'Fun · L', run: fx.toggleLights },
    { t: 'Play voice hello', k: 'Voice', run: fx.greet },
    {
      t: 'Shoot a basket',
      k: 'Game',
      run: () => {
        fx.go('offclock');
        window.setTimeout(fx.hoopsAuto, 900);
      },
    },
    { t: 'Copy email address', k: 'Action', run: () => void fx.copyEmail() },
    { t: 'Open GitHub', k: 'Link', run: () => window.open(profile.github.url, '_blank', 'noopener') },
    { t: 'Open LinkedIn', k: 'Link', run: () => window.open(profile.linkedin.url, '_blank', 'noopener') },
  ];
}

/** Ctrl/⌘ K or "/" — jump to a section or run a fun action. */
export default function CommandPalette() {
  const fx = useFx();
  const items = useMemo(() => buildItems(fx), [fx]);
  const dlg = useRef<HTMLDialogElement>(null);
  const inp = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  const query = q.trim().toLowerCase();
  const shown = items.filter((i) => (i.t + ' ' + i.k).toLowerCase().includes(query));
  const active = Math.min(sel, Math.max(shown.length - 1, 0));

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const open = () => {
      if (d.open) return;
      setQ('');
      setSel(0);
      if (d.showModal) d.showModal();
      else d.setAttribute('open', '');
      inp.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (d.open) d.close();
        else open();
      } else if (e.key === '/' && !isTyping() && !d.open) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', onKey);
    const unregister = fx.register('openPalette', open);
    return () => {
      document.removeEventListener('keydown', onKey);
      unregister();
    };
  }, [fx]);

  // Keep the highlighted option in view while arrowing through the list.
  useEffect(() => {
    list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (i: number) => {
    const it = shown[i];
    if (!it) return;
    dlg.current?.close();
    it.run();
  };

  return (
    <dialog
      className="k"
      id="palette"
      aria-label="Jump to"
      ref={dlg}
      onClick={(e) => {
        if (e.target === dlg.current) dlg.current.close();
      }}
    >
      <input
        ref={inp}
        id="kInput"
        type="text"
        placeholder="Jump to a section or action…"
        autoComplete="off"
        aria-controls="kList"
        aria-label="Search"
        aria-activedescendant={shown.length ? 'k' + active : undefined}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setSel(0);
        }}
        onKeyDown={(e) => {
          const n = Math.max(shown.length, 1);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSel((active + 1) % n);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSel((active - 1 + shown.length) % n);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(active);
          }
        }}
      />
      <ul id="kList" role="listbox" ref={list}>
        {shown.length === 0 ? (
          <li role="option" aria-selected="false" aria-disabled="true" style={{ color: 'var(--dim)' }}>
            Nothing matches
          </li>
        ) : (
          shown.map((it, i) => (
            <li
              key={it.t}
              role="option"
              id={'k' + i}
              aria-selected={i === active}
              onMouseMove={() => {
                if (active !== i) setSel(i);
              }}
              onClick={() => choose(i)}
            >
              <b style={{ fontWeight: 500 }}>{it.t}</b>
              <span>{it.k}</span>
            </li>
          ))
        )}
      </ul>
      <div className="foot">
        <span>↑↓ move</span>
        <span>↵ open</span>
        <span>esc close</span>
      </div>
    </dialog>
  );
}
