import type { Headline, Rich, TitleBlock } from './types';

export type Role = { when: string; title: string; org: string; text: Rich; now?: boolean };

export const experienceSection = {
  titleblock: ['Sheet 04', 'Experience', 'Newest first'] satisfies TitleBlock,
  headline: { plain: 'Where I’ve ', em: 'built things.' } satisfies Headline,
};

export const roles: Role[] = [
  {
    when: 'OCT 2026 — NOW',
    title: 'Software Engineer (Hackathon)',
    org: 'AssemblyAI · remote',
    text: 'Building voice agents and AI-native applications.',
    now: true,
  },
  {
    when: 'SEP 2026 — NOW',
    title: 'Technical Co-Founder',
    org: 'LastClass.io · Winnipeg',
    text: 'Translate product requirements into architecture, build the core flows in Next.js and TypeScript, and own decisions on stack, structure and delivery.',
    now: true,
  },
  {
    when: 'APR — JUL 2026',
    title: 'Full Stack Engineer',
    org: 'OutreachGenius · Winnipeg',
    text: 'Built and maintained frontend and backend features in TypeScript, Next.js, React and Python, on PostgreSQL and MongoDB. Designed the REST APIs connecting services, and tracked down defects to keep releases reliable.',
  },
  {
    when: 'AUG — OCT 2025',
    title: 'Full Stack AI Researcher',
    org: 'Ori.Gatou · volunteer',
    text: 'Full-stack development and applied AI research, exploring how LLM capabilities become working product features.',
  },
];

export const moreRoles = {
  summary: '6 more roles: production, warehouse, hospitality',
  toggle: 'SHOW ALL',
  items: [
    { role: 'Production Associate, Structural Composite Technologies', when: 'Oct 2026 —' },
    { role: 'Warehouse Associate, CCLS', when: 'Sep — Oct 2026' },
    { role: 'Kitchen Assistant, Smitty’s Canada', when: 'May — Jun 2026' },
    { role: 'Dining Room Server, The Melody', when: 'Oct 2025 — Jun 2026' },
    { role: 'Kitchen Assistant, The Melody', when: 'May 2023 — Apr 2024' },
    { role: 'Dishwasher, Asia Palace Restaurant', when: 'Feb — May 2023' },
  ],
};
