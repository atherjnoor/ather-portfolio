'use client';

import { useEffect, useRef, useState } from 'react';
import { useFx } from './FxProvider';

/** COPY → "COPIED ✓" for 1.6 s, plus a toast. */
export default function CopyEmail() {
  const fx = useFx();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      className={copied ? 'copybtn ok' : 'copybtn'}
      id="copyEmail"
      type="button"
      onClick={() => {
        void fx.copyEmail();
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? 'COPIED ✓' : 'COPY'}
    </button>
  );
}
