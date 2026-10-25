/**
 * Canonical origin for metadata, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL in Netlify (Site settings → Environment variables)
 * once the final domain is known. The fallback is the expected Netlify URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ather-portfolio.netlify.app').replace(/\/+$/, '');
