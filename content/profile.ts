import type { Headline, Rich, TitleBlock } from './types';

export const profile = {
  name: 'Ather Johear Noor',
  initials: 'AJN',
  role: 'Full-stack & AI engineer',
  location: 'Winnipeg, MB',
  email: 'atherjohearn@gmail.com',
  github: { url: 'https://github.com/atherjnoor', handle: 'atherjnoor' },
  linkedin: { url: 'https://www.linkedin.com/in/ather-johearn-621541278', handle: 'Ather Johear Noor' },
} as const;

export const seo = {
  title: 'Ather Johear Noor — Full-Stack & AI Engineer',
  description:
    'Ather Johear Noor is a full-stack and AI engineer in Winnipeg, and technical co-founder of LastClass.io.',
  ogTitle: 'Ather Johear Noor — Full-Stack & AI Engineer',
  ogDescription: 'Next.js, TypeScript and LLM APIs. Technical co-founder at LastClass.io.',
} as const;

export type SectionId = 'overview' | 'work' | 'lab' | 'experience' | 'offclock' | 'about' | 'contact';

/** Sidebar nav order (01–07). `name` is what the ruler shows (uppercased). */
export const sections: { id: SectionId; label: string; name: string }[] = [
  { id: 'overview', label: 'Overview', name: 'Overview' },
  { id: 'work', label: 'Work', name: 'Work' },
  { id: 'lab', label: 'Lab', name: 'Lab' },
  { id: 'experience', label: 'Experience', name: 'Experience' },
  { id: 'offclock', label: 'Off the clock', name: 'Off the clock' },
  { id: 'about', label: 'About', name: 'About' },
  { id: 'contact', label: 'Contact', name: 'Contact' },
];

export const ruler = { right: 'AJN · PORTFOLIO · REV A · 2026' };

export const hero = {
  eyebrow: 'Full-stack & AI engineer · Winnipeg',
  headline: { plain: 'I turn product requirements into ', em: 'working software.' } satisfies Headline,
  intro:
    'Next.js, TypeScript and LLM APIs. Currently technical co-founder at LastClass.io, building a privacy-first habit companion from PRD to production.',
  primary: { label: 'View work →', href: '#work' },
  secondary: { label: 'Get in touch', href: '#contact' },
};

export type FigureNode = { name: string; tech: string; cap: string; half?: boolean };

export const figure = {
  title: 'Fig. 1 — How I build',
  hint: 'tap a layer',
  defaultKey: 'ILLUSTRATIVE',
  defaultCap: 'A simplified view of how the pieces of a product fit together. Select a layer to read more.',
  nodes: [
    {
      name: 'Interface',
      tech: 'Next.js · React',
      cap: 'Where the product lives for users. LastClass’s core flows are built here, in Next.js and React with TypeScript.',
    },
    {
      name: 'API layer',
      tech: 'TypeScript · REST',
      cap: 'REST APIs and server logic in TypeScript, so the interface stays thin and the rules live in one place.',
    },
    {
      name: 'Data',
      tech: 'PostgreSQL · MongoDB',
      cap: 'PostgreSQL or MongoDB, picked to suit the shape of the data in each project.',
      half: true,
    },
    {
      name: 'AI',
      tech: 'LLM APIs',
      cap: 'LLM APIs, including Claude, built into product features rather than bolted on.',
      half: true,
    },
  ] satisfies FigureNode[],
};

export const strip: { label: string; text: string }[] = [
  { label: 'Now', text: 'Technical co-founder, LastClass.io' },
  { label: 'Recent', text: 'AssemblyAI voice hackathon, Oct 2026' },
  { label: 'Learning', text: 'Y Combinator Startup School, Oct 2026' },
  { label: 'Stack', text: 'TypeScript, Next.js, Python, PostgreSQL' },
];

export const about = {
  titleblock: ['Sheet 06', 'About', 'In my words'] satisfies TitleBlock,
  headline: { plain: 'I like the stretch between an idea and the ', em: 'working thing.' } satisfies Headline,
  paragraphs: [
    'I’m a full-stack and AI engineer in Winnipeg. I trained in full-stack development at RRC Polytech, and today I’m technical co-founder of LastClass.io, turning a product owner’s requirements into architecture, code and shipped flows.',
    'Alongside code, I’ve spent years in customer-facing and production roles. They taught me to listen first, communicate clearly with the people around me, and show up.',
  ] satisfies Rich[],
};

export const contact = {
  label: 'Sheet 07 — Contact',
  heading: 'Let’s talk.',
  lead: 'Email is the fastest way to reach me.',
  note: 'No contact form here on purpose. A plain email link can’t pretend a message was sent.',
};

export const footer = { credit: 'Designed & built by Ather Johear Noor · 2026' };
