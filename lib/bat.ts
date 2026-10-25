/** Flapping bat used by the companion, sonar mini-bats and the swarm (wings animate via .wl/.wr). */
export const BAT_SVG =
  '<svg viewBox="0 0 64 32" aria-hidden="true"><path class="wl" d="M31 12 C27 8 20 6 4 9 C9 11 11 15 11 19 C14 16 18 16 20 19 C22 16 26 16 28 21 L31 18 Z"/><path class="wr" d="M33 12 C37 8 44 6 60 9 C55 11 53 15 53 19 C50 16 46 16 44 19 C42 16 38 16 36 21 L33 18 Z"/><ellipse cx="32" cy="15" rx="3.4" ry="7"/><path d="M29.4 10 L29.8 5.5 L31.8 8.6 Z M34.6 10 L34.2 5.5 L32.2 8.6 Z"/></svg>';

/** Is the command palette open? Single-key shortcuts are ignored while it is. */
export const paletteOpen = () => (document.getElementById('palette') as HTMLDialogElement | null)?.open ?? false;

/** True while the user is typing in a field (single-key shortcuts must not fire). */
export const isTyping = () => /INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '');
