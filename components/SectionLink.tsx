'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes } from 'react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { section: string };

/**
 * Link to a home-page section. On the home page it is a plain `#id` anchor
 * (native smooth scroll, like the original); on other routes it navigates to `/#id`.
 */
export function SectionLink({ section, ...rest }: Props) {
  const onHome = usePathname() === '/';
  return onHome ? <a href={'#' + section} {...rest} /> : <Link href={'/#' + section} {...rest} />;
}
