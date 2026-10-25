import type { Headline, Rich, TitleBlock } from './types';

export const offSection = {
  titleblock: ['Sheet 05', 'Off the clock', 'After hours'] satisfies TitleBlock,
  headline: { plain: 'When I’m not ', em: 'shipping.' } satisfies Headline,
  // The lede ends with a <kbd>-styled "B" and a full stop; see OffTheClock.tsx.
  lede: 'Computer hardware, cooking and basketball. I’m also a big Batman fan, which is why bats keep flying around this page. Press',
};

export const hoopsCopy = {
  label: 'Basketball · mini-game',
  title: 'Take a shot.',
  canvasLabel: 'Basketball mini-game with a ball, a hoop and a backboard. Use the Hold to shoot button.',
  button: 'Hold to shoot',
  intro: 'Hold the button (or Space), release inside the green zone.',
  charging: 'Release inside the green zone…',
  swish: 'Swish!',
  onFire: (n: number) => `On fire — ${n} in a row!`,
  long: 'Off the backboard. Ease off a little.',
  short: 'Short. Give it more power.',
};

export const hoursCopy = {
  label: 'Work hours · Central Time',
  title: { plain: 'Sharpest at ', em: '9 a.m.' } satisfies Headline,
  loading: 'Checking the time in Winnipeg…',
  ticks: [
    { t: '6a', left: '0' },
    { t: '9a', left: '18.75%', on: true },
    { t: '12p', left: '37.5%' },
    { t: '5p', left: '68.75%', on: true },
    { t: '10p', left: '100%' },
  ],
};

export const hardware = {
  label: 'Computer hardware',
  title: 'I like knowing what’s under the abstraction.',
  groupLabel: 'Components — select one',
  defaultChip: 'GPU',
  chips: [
    {
      name: 'CPU',
      sub: 'compute',
      info: 'The generalist. Core count and clock speed decide how fast builds and test suites run.',
    },
    {
      name: 'GPU',
      sub: 'parallel',
      info: 'Thousands of small cores working in parallel. VRAM is why OllamaForge checks your hardware before picking a model.',
    },
    { name: 'RAM', sub: 'memory', info: 'Where running work lives. Run out and everything starts swapping, then crawling.' },
    { name: 'SSD', sub: 'storage', info: 'Fast storage means fast installs, fast container starts and fast everything else.' },
  ],
};

export const cooking = {
  label: 'Cooking',
  front: 'Like code, except you get to eat the output.',
  frontHint: 'Flip the card ↻',
  backLabel: 'On the menu',
  dish: 'Chicken BBQ wrap' as Rich,
  line: 'I love to cook BBQ chicken. High protein, every time.' as Rich,
  backHint: 'Flip back ↻',
};
