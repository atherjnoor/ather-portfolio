'use client';

import { useEffect } from 'react';
import { useFx } from './FxProvider';

/** Case study: ruler reads "WORK / LASTCLASS", Work is the active nav item, focus moves to the title. */
export default function CaseSheet({ titleId }: { titleId: string }) {
  const fx = useFx();
  useEffect(() => {
    fx.setSheet('work', 'Work / LastClass');
    const h = document.getElementById(titleId);
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }, [fx, titleId]);
  return null;
}
