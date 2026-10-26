/**
 * Canonical origin for metadata, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL in Netlify (Site settings → Environment variables)
 * if the site moves to a custom domain. The fallback is the live Netlify URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ather-profile.netlify.app').replace(/\/+$/, '');
