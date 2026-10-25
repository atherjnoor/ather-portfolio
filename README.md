# Ather Johear Noor: portfolio

A Next.js (App Router, TypeScript) port of the original single-file portfolio (`index (1).html`, kept in the repo as the design and behaviour reference). It builds to a fully static site in `out/` and is deployed on Netlify.

- No backend, no API keys, no analytics, no UI or animation libraries.
- The CSS in `app/globals.css` is the original stylesheet, copied as-is.
- Fonts are self-hosted with `next/font/google` (Instrument Serif, IBM Plex Sans, JetBrains Mono).

## Run locally

Requires Node 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → out/
npm start            # serves out/ at http://localhost:3000 (via `serve`)
```

Checks:

```bash
npm run lint
npx tsc --noEmit
npx playwright install chromium     # once
npm run build && npm run test:e2e   # behaviour + axe accessibility tests against out/
node scripts/compare.mjs            # side-by-side screenshots vs the original (needs `npx serve out -l 4173` running)
npm run og                          # regenerate public/og.png
```

> **Why `--webpack`?** The `build` and `dev` scripts use webpack instead of Turbopack because Turbopack ignores `adjustFontFallback: false`. Without that option, glyphs that aren't in the Google font files (like `→` and `●`) render from a resized Arial instead of the original `system-ui` fallback, which makes the hero buttons 10px wider.

## Editing content

All copy lives in typed files in `content/`:

| File | What's in it |
| --- | --- |
| `content/profile.ts` | Name, email, GitHub/LinkedIn URLs, SEO text, nav sections, hero, Fig. 1 captions, the Now/Recent/Learning/Stack strip, About, Contact, footer |
| `content/projects.ts` | LastClass.io and OllamaForge cards, and the `/work/lastclass/` case study |
| `content/lab.ts` | Lab filters and rows |
| `content/experience.ts` | Timeline and the "Show all roles" list |
| `content/education.ts` | Education panel |
| `content/interests.ts` | Off the clock: hoops text, work-hours card, hardware chips, cooking card |

**Placeholders:** any text wrapped in `[square brackets]` is rendered as a dashed `.todo` placeholder (see `components/Rich.tsx`). Replace the whole bracketed text, brackets included, with the real copy. For OllamaForge, put the repo URL in `ollamaforge.link.href` and set `repoTodo` to `null`.

Placeholders still to fill:

- `projects.ts`: OllamaForge exact repo URL
- `experience.ts`: OutreachGenius, 1–2 lines on what you built
- `lab.ts`: Voice agent (AssemblyAI hackathon), what it does + link
- `lab.ts`: Atlas, confirm it's shareable
- `education.ts`: University of the People, confirm status
- `projects.ts` (case study): decisions, screenshots, one line per core flow, next steps

## How the effects are wired

Each effect is its own client component and cleans up after itself (listeners, `requestAnimationFrame`, observers, speech). Effects call each other through `components/fx/FxProvider.tsx`. For example, the palette, a voice command and a three-in-a-row in hoops can all release the bats. **If you remove a component, any call to its action quietly does nothing**, so it's safe to turn effects off one at a time.

Visitors with `prefers-reduced-motion` get no animations or pointer effects, and all content is visible immediately. Pointer effects only run on `(hover: hover) and (pointer: fine)`.

| Effect | Where | To turn it off |
| --- | --- | --- |
| Bat cursor, companion bat, sonar + mini bats | `components/fx/BatCursor.tsx` | Visitors can use the **Bats** button (saved in `localStorage`). To remove: delete `<BatCursor />` from `app/layout.tsx` and the `#batBtn` button in `components/Sidebar.tsx` |
| Bat swarm (**B** key) | `components/fx/BatSwarm.tsx` | Delete `<BatSwarm />` from `app/layout.tsx` |
| Lights out (**L**, Esc to exit) | `components/fx/LightsOut.tsx` | Delete `<LightsOut />` and the `#lightBtn` button in `Sidebar.tsx` |
| Command palette (Ctrl/⌘ K or `/`) | `components/fx/CommandPalette.tsx` | Delete `<CommandPalette />`, plus the "Jump to…" button in `Sidebar.tsx` and the footer hint in `app/page.tsx` |
| Voice hello pop-up, captions, **Say hi** | `components/fx/VoiceHello.tsx` | Delete `<VoiceHello />` and the `#helloBtn` button |
| Voice commands (**Talk**) | `components/fx/VoiceCommands.tsx` | Delete `<VoiceCommands />` from `Sidebar.tsx` |
| Cursor spotlight, ~3° tilt, magnetic buttons | `components/fx/Spotlight.tsx` | Delete `<Spotlight />` from `app/page.tsx` |
| Scroll reveals (`.rv`, staggered `.stg`, title blocks drawing in) | `components/fx/Reveal.tsx` | Removing `<Reveal />` alone would leave content hidden. Instead, delete the `/* reveal */`, `/* section title blocks draw in */` and `/* staggered groups */` rules in `globals.css` |
| Hero words rising in | CSS `h1 .w` / `.seq` in `globals.css` | Delete those two rules |
| Ruler X/Y cursor tick, scroll progress | `components/Ruler.tsx` | Delete the second `useEffect` (cursor) or the first (progress) |
| Fig. 1 diagram | `components/fx/ArchitectureFigure.tsx` | Interactive by design. The flowing wires are the `.wire::before` animation in CSS |
| Basketball game | `components/fx/Hoops.tsx` | Delete `<Hoops />` from `components/sections/OffTheClock.tsx` |
| Work-hours card + sidebar status | `components/fx/WorkHours.tsx`, `lib/winnipegTime.ts` | Delete `<WorkHours />`. The sidebar status is in `Sidebar.tsx` |
| Hardware board / cooking flip card | `components/fx/HardwareBoard.tsx`, `FlipCard.tsx` | Delete them from `OffTheClock.tsx` |
| Back-to-top button | `components/fx/BackToTop.tsx` | Delete `<BackToTop />` |
| Copy-email button | `components/fx/CopyEmail.tsx` | Replace `<CopyEmail />` in `components/sections/Contact.tsx` |

## Routes

- `/`: all seven sections
- `/work/lastclass/`: the case study, now a real page with its own title and metadata. Old `#/work/lastclass` links redirect here.
- `404.html`: served by Netlify for unknown paths
- `/sitemap.xml`, `/robots.txt`

## Deploying to Netlify

`netlify.toml` sets everything up: build command `npm run build`, publish folder `out`, Node 20, and security headers. Keep `microphone=(self)` in the `Permissions-Policy` header, because voice commands need it.

Set **`NEXT_PUBLIC_SITE_URL`** (for example `https://atherjnoor.com`) under *Site configuration → Environment variables* so canonical URLs, Open Graph, the sitemap and robots point at the real domain. Without it, they fall back to `https://ather-portfolio.netlify.app`.

**Option A: Git (recommended)**

1. Create a GitHub repo called `ather-portfolio` and push: `gh repo create ather-portfolio --private --source . --push` (or `--public`).
2. In Netlify: **Add new site → Import an existing project → GitHub →** `ather-portfolio`. The build settings are read from `netlify.toml`. Click **Deploy**.
3. Every push to `main` redeploys, and pull requests get preview URLs.

**Option B: Netlify CLI**

```bash
npm i -g netlify-cli
netlify login
netlify init                      # create/link the site
netlify deploy --build            # draft (preview) URL
netlify deploy --build --prod     # production
```

## Accessibility notes

axe (run by the Playwright tests) reports no serious or critical issues. To get there, three small texts that used the original colours were lightened to a new `--faint` token (`#85857e`, at least 4.6:1). These were the sidebar nav numbers, "Winnipeg, MB · time" and the "tap a layer" hint. `--line2` is unchanged and is still used for borders.
