import type { Headline, Rich, TitleBlock } from './types';

export type LabKind = 'building' | 'shipped' | 'idea';
/** `tone` maps to the status pill style: '' (mint), 'neutral' or 'dim'. */
export type LabItem = { kind: LabKind; name: string; text: Rich; status: string; tone: '' | 'neutral' | 'dim' };

export const labSection = {
  titleblock: ['Sheet 03', 'Lab', 'Honest status'] satisfies TitleBlock,
  headline: { plain: 'Experiments and ', em: 'work in progress.' } satisfies Headline,
  lede: 'Each status says exactly how far it got.',
};

export const labFilters: { f: 'all' | LabKind; label: string }[] = [
  { f: 'all', label: 'All' },
  { f: 'building', label: 'Building' },
  { f: 'shipped', label: 'Hackathon & client' },
  { f: 'idea', label: 'Ideas' },
];

export const labItems: LabItem[] = [
  {
    kind: 'building',
    name: 'Kynetiq',
    text: 'Fitness & nutrition dashboard: workouts, meals, progress. Next.js API routes + PostgreSQL; RAG features planned.',
    status: 'In progress',
    tone: '',
  },
  {
    kind: 'shipped',
    name: 'Voice agent',
    text: 'Built during AssemblyAI’s voice hackathon, Oct 2026. [what it does + link]',
    status: 'Hackathon',
    tone: 'neutral',
  },
  {
    kind: 'shipped',
    name: 'Atlas',
    text: 'AI chief-of-staff platform for founders. Next.js, Supabase, Claude. [confirm it’s shareable]',
    status: 'Client work',
    tone: 'neutral',
  },
  {
    kind: 'idea',
    name: '3D Explorer',
    text: 'Earlier portfolio experiment: folders as projects, rendered in Three.js.',
    status: 'Concept',
    tone: 'dim',
  },
  {
    kind: 'idea',
    name: 'Workflow agent',
    text: 'Multi-task AI automation agent for business workflows.',
    status: 'Exploring',
    tone: 'dim',
  },
];
