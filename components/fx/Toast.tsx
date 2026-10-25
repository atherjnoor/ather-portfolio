'use client';

import { useEffect, useRef, useState } from 'react';
import { useFx } from './FxProvider';

export default function Toast() {
  const fx = useFx();
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const unregister = fx.register('toast', (text, ms) => {
      setMsg(text);
      setShow(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShow(false), ms || 1800);
    });
    return () => {
      unregister();
      window.clearTimeout(timer.current);
    };
  }, [fx]);

  return (
    <div className={show ? 'toast show' : 'toast'} id="toast" role="status" aria-live="polite">
      {msg}
    </div>
  );
}
