import type { Headline, TitleBlock as Cells } from '@/content/types';

export function TitleBlock({ cells }: { cells: Cells }) {
  return (
    <div className="titleblock">
      <span>{cells[0]}</span>
      <span>{cells[1]}</span>
      <span>{cells[2]}</span>
    </div>
  );
}

export function SectionHeading({ id, headline }: { id: string; headline: Headline }) {
  return (
    <h2 className="h" id={id}>
      {headline.plain}
      <i>{headline.em}</i>
    </h2>
  );
}
