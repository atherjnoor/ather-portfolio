/**
 * Copy strings may contain `[bracketed placeholders]`. The <Rich> component
 * renders each one as <span class="todo">, exactly like the original page.
 */
export type Rich = string;

/** A heading with a mint italic tail, e.g. "Fewer projects, <i>told in depth.</i>" */
export type Headline = { plain: string; em: string };

/** The three cells of a section's drafting title block. */
export type TitleBlock = [sheet: string, name: string, note: string];

export type Fact = { label: string; value: string };
