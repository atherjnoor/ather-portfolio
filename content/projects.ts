import type { Fact, Headline, Rich, TitleBlock } from './types';

export const workSection = {
  titleblock: ['Sheet 02', 'Selected work', '2 projects'] satisfies TitleBlock,
  headline: { plain: 'Fewer projects, ', em: 'told in depth.' } satisfies Headline,
};

export const lastclass = {
  status: 'In build',
  when: 'Sep 2026 — now',
  name: 'LastClass.io',
  summary:
    'A private companion app that helps people build healthier habits around alcohol. I’m the technical owner, working alongside the product owner from PRD to build.',
  facts: [
    { label: 'Role', value: 'Technical co-founder' },
    { label: 'Stack', value: 'Next.js · TypeScript' },
  ] satisfies Fact[],
  link: { label: 'Read the case study', arrow: '→', href: '/work/lastclass/' },
  flowsLabel: 'Core flows',
  /** The last flow (SOS) is highlighted in mint. */
  flows: ['Onboarding', 'Today', 'Journey', 'Coach', 'SOS'],
};

export const ollamaforge = {
  status: 'Completed',
  when: 'Open source · CLI',
  name: 'OllamaForge',
  summary:
    'A Python CLI that takes the friction out of local Ollama development: guided setup, restart workflows, and choosing a model that fits your hardware.',
  facts: [
    { label: 'Role', value: 'Solo — design & build' },
    { label: 'Stack', value: 'Python · Typer' },
  ] satisfies Fact[],
  // TODO(Ather): replace with the exact repo URL, then delete `repoTodo`.
  link: { label: 'View on GitHub', arrow: '↗', href: 'https://github.com/atherjnoor' },
  repoTodo: '[swap in the exact repo URL]' as Rich | null,
  terminal: {
    title: '~/ollamaforge',
    handles: ['guided setup', 'restart workflows', 'hardware-aware model selection'],
    builtWith: 'python · typer · packaging',
  },
};

/** /work/lastclass/ case study */
export const lastclassCase = {
  metaTitle: 'LastClass.io — Case study · Ather Johear Noor',
  metaDescription:
    'Case study: LastClass.io, a private, supportive companion for people building healthier habits around alcohol. Ather Johear Noor, technical co-founder.',
  eyebrow: 'Case study · Sheet 02-A',
  title: 'LastClass.io',
  intro: 'A private, supportive companion for people building healthier habits around alcohol.',
  meta: [
    { label: 'Role', value: 'Technical co-founder' },
    { label: 'Timeline', value: 'Sep 2026 — now' },
    { label: 'Stack', value: 'Next.js · TypeScript' },
    { label: 'Status', value: 'In build' },
  ] satisfies Fact[],
  body: [
    {
      heading: '01 · Problem',
      text: 'A sensitive habit needs a tool people can trust: private by default, supportive and never judgmental.',
    },
    {
      heading: '02 · My role',
      text: 'Technical owner alongside the product owner. I translate the PRD into technical architecture, build the core flows, and own decisions on stack, structure and delivery.',
    },
    {
      heading: '03 · Decisions',
      text: '[Add 2–3 real tradeoffs — e.g. what data is stored, and where, and why]',
    },
  ] satisfies { heading: string; text: Rich }[],
  screenshot: '[ Product screenshots — add when you’re comfortable sharing ]' as Rich,
  more: [
    { heading: 'Core flows', text: 'Onboarding, Today, Journey, Coach and SOS. [One line on what each does]' },
    { heading: 'Next steps', text: '[Launch status, what’s next, and what you’d do differently]' },
  ] satisfies { heading: string; text: Rich }[],
};
