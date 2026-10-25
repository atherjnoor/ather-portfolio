import { Fragment } from 'react';

/** Renders copy, turning every `[bracketed placeholder]` into <span class="todo">. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span key={i} className="todo">
            {part}
          </span>
        ) : part ? (
          <Fragment key={i}>{part}</Fragment>
        ) : null,
      )}
    </>
  );
}
