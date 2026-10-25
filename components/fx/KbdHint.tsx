'use client';

import { useClientValue } from '@/lib/useMediaQuery';

const detectMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** "Ctrl K", or "⌘ K" on Apple devices. */
export default function KbdHint({ id }: { id?: string }) {
  const mac = useClientValue(detectMac, false);
  return (
    <span className="kbd" id={id}>
      {mac ? '⌘ K' : 'Ctrl K'}
    </span>
  );
}
