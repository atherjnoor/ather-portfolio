'use client';

import { createContext, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { profile, sections, type SectionId } from '@/content/profile';
import { KEYS, store } from '@/lib/storage';
import { hasFinePointer, useFinePointer } from '@/lib/useFinePointer';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/**
 * Shared glue for the fun layer. The original page was one script where every
 * feature could call every other (the palette fires the swarm, a 3-in-a-row
 * fires the swarm, voice commands toggle the lights…). Here each effect lives in
 * its own component and registers its action; everyone else calls it through
 * this context.
 */

type Registered = {
  toast: (msg: string, ms?: number) => void;
  swarm: () => void;
  greet: () => void;
  speak: (text: string) => void;
  hoopsAuto: () => void;
  openPalette: () => void;
};
type RegKey = keyof Registered;

export type FxActions = Registered & {
  register<K extends RegKey>(key: K, fn: Registered[K]): () => void;
  /** Section id ("work"), or a route ("/work/lastclass/"). */
  go(target: string): void;
  copyEmail(): Promise<void>;
  setLights(on: boolean): void;
  toggleLights(): void;
  setBat(on: boolean): void;
  setMenu(open: boolean): void;
  /** Ruler label + active nav item. `name` overrides the ruler text (case study). */
  setSheet(id: SectionId, name?: string): void;
};

export type FxState = {
  lightsOut: boolean;
  batOn: boolean;
  menuOpen: boolean;
  sheet: { id: SectionId; no: string; name: string };
};

const ActionsCtx = createContext<FxActions | null>(null);
const StateCtx = createContext<FxState | null>(null);

export function useFx(): FxActions {
  const v = useContext(ActionsCtx);
  if (!v) throw new Error('useFx must be used inside <FxProvider>');
  return v;
}
export function useFxState(): FxState {
  const v = useContext(StateCtx);
  if (!v) throw new Error('useFxState must be used inside <FxProvider>');
  return v;
}

function sheetFor(id: SectionId, name?: string): FxState['sheet'] {
  const i = sections.findIndex((s) => s.id === id);
  return { id, no: String(i + 1).padStart(2, '0'), name: (name ?? sections[i]?.name ?? id).toUpperCase() };
}

export function FxProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reg = useRef<Partial<Registered>>({});
  const lightsRef = useRef(false);

  const [lightsOut, setLightsOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheet, setSheetState] = useState(() => sheetFor('overview'));

  // Bat cursor: on by default for mouse/trackpad users, unless switched off before.
  const fine = useFinePointer(true);
  const batPref = useSyncExternalStore(store.subscribe, () => store.get(KEYS.bat), () => null);
  const batOn = fine && batPref !== 'off';

  const actions = useMemo<FxActions>(() => {
    const toast: Registered['toast'] = (msg, ms) => reg.current.toast?.(msg, ms);

    const setLights = (on: boolean) => {
      lightsRef.current = on;
      setLightsOut(on);
      if (on)
        toast(
          hasFinePointer()
            ? 'Lights out — your cursor is the flashlight. Press L or Esc to switch back.'
            : 'Lights out — drag around to look. Tap “Lights” again to switch back.',
          3600,
        );
    };

    const go = (target: string) => {
      if (target.startsWith('/')) {
        router.push(target);
        return;
      }
      if (window.location.pathname !== '/') {
        router.push('/#' + target);
        return;
      }
      if (window.location.hash === '#' + target) {
        document.getElementById(target)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      } else {
        window.location.hash = target;
      }
    };

    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        toast('Email copied');
      } catch {
        const link = document.querySelector('.email a');
        const s = window.getSelection();
        if (link && s) {
          const r = document.createRange();
          r.selectNodeContents(link);
          s.removeAllRanges();
          s.addRange(r);
        }
        toast('Press Ctrl/⌘ C to copy');
      }
    };

    return {
      register(key, fn) {
        reg.current[key] = fn;
        return () => {
          if (reg.current[key] === fn) delete reg.current[key];
        };
      },
      toast,
      swarm: () => reg.current.swarm?.(),
      greet: () => reg.current.greet?.(),
      speak: (text) => reg.current.speak?.(text),
      hoopsAuto: () => reg.current.hoopsAuto?.(),
      go,
      copyEmail,
      setLights,
      toggleLights: () => setLights(!lightsRef.current),
      setBat: (on) => store.set(KEYS.bat, on && hasFinePointer() ? 'on' : 'off'),
      setMenu: setMenuOpen,
      setSheet: (id, name) =>
        setSheetState((prev) => {
          const next = sheetFor(id, name);
          return prev.id === next.id && prev.name === next.name ? prev : next;
        }),
      openPalette: () => reg.current.openPalette?.(),
    };
  }, [router]);

  const state = useMemo<FxState>(() => ({ lightsOut, batOn, menuOpen, sheet }), [lightsOut, batOn, menuOpen, sheet]);

  return (
    <ActionsCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </ActionsCtx.Provider>
  );
}
