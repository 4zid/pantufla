# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Pantufla is the site of a small web studio: a one-page home plus `/reunion`, project detail pages and an embedded Sanity Studio. Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, Sanity, GSAP, Lenis, Resend, Vercel. Code comments, copy and most identifiers are in Spanish (Argentine voseo); comments explain the _why_ at length and new code should keep that style.

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve the build (PORT=3350 npm run start)
npm run typecheck    # tsc --noEmit
npx prettier --write <files>   # formatting (Prettier defaults, no config file)
```

- There is no test suite and no linter: `npm run lint` calls `next lint`, which Next 16 no longer ships, and there is no ESLint config. Verify changes with `npm run typecheck`, `npm run build`, and by looking at the page in a browser (Playwright + Chromium are available in the cloud environment).
- Build output is long: redirect it to a file instead of piping into `head`, which kills the build. Sanity fetch errors during a build (403, offline) are expected and harmless; every query falls back to local content.
- For a clean check: `rm -rf .next && npm run build && PORT=3350 npm run start`.

## Branches and deploys

- `main` is production (Vercel's production branch and the repo's default branch). **Every push to it goes live** at www.pantufla.design.
- `staging` is the preview at `pantufla-git-staging-kalada.vercel.app` (behind Vercel login), for trying designs before they ship.
- Work goes on a branch cut from `main`: `feat/<topic>` for new things, `fix/<topic>` for fixes (lowercase, hyphens). Merge it into `staging` to preview, then into `main` through a pull request once approved, and delete it. Merge `main` back into `staging` whenever `main` gets something `staging` lacks. Do not commit straight to `main` unless the user asks for it.
- Non-production deployments (`VERCEL_ENV=preview`) render `noindex` and a closed `robots.txt` via `lib/entorno.ts`.
- Vercel does not build a branch whose head commit was already built on another branch; it needs its own commit.
- Pages that were removed (`/contacto`, `/notas`, the `/proyectos` listing) redirect in `next.config.ts`.

## Architecture

### Routing and languages

Every page lives under `app/[locale]`. Spanish is served at the root and English under `/en`: `middleware.ts` rewrites unprefixed paths to `/es/...`, redirects any public `/es/...` to the root, and picks a language for first visits from the Vercel country header, then `Accept-Language`, with the language cookie always winning. Route segments stay in Spanish in both languages. Hrefs in copy are written unprefixed and localized with `localeHref` / `useHref`.

The `(site)` route group adds the header and footer through `components/site-chrome.tsx`; `/studio` sits outside it and mounts Sanity Studio (`sanity.config.ts`, basePath `/studio`).

### Content comes in three layers

1. **Text.** `content/copy.ts` declares the `SiteCopy` type explicitly, so a new field breaks compilation until both `content/copy.es.ts` and `content/copy.en.ts` have it. Those files are the fallback; the editable version is one Sanity `siteCopy` document per language (fixed ids `siteCopy.es` / `siteCopy.en`), deep-merged over the local copy in `content/get-copy.ts`, where null fields are skipped. Arrays are not merged: a loaded array (nav, FAQ items, title segments, plans) replaces the local one whole, so editing one in the repo changes nothing in production until the Sanity document is patched and published too. Adding a copy field means updating the type, both locale files, and `sanity/schemas/site-copy.ts`.
2. **Design data.** Colors, icons, step numbers and bento grid placement live in `content/site.ts`, keyed by the same ids as the copy, and are joined to the text in `content/resolve.ts`. Text never carries colors.
3. **Sections.** `content/sections.ts` (`SECCIONES`) is the single list of home sections: it sets their order, the on/off switches in the Studio, and which anchors die with each one. The Sanity `siteSections` document stores `<id>` booleans and `<id>Fondo` (`claro` / `oscuro`); a missing value means the factory default (on, except sections marked `apagada`, currently the stack). `app/[locale]/(site)/page.tsx` maps each id to a builder that receives its `surface`, and `pruneHrefs` rewrites links that point at a disabled section. When testimonials and the clients map are both on, the map renders inside the testimonials section (`ClientsMap embedded`) with the testimonials surface.

`sanityFetch(query, params, fallback, tags)` in `sanity/client.ts` never throws; it returns the fallback. Projects and testimonials fall back to `content/fallback-content.ts` while the CMS is empty; that placeholder content is intentional. Cache tags are expired by the `/api/revalidate` webhook. The other API routes are `/api/brief` (form → Sanity + Resend) and `/api/reunion` (Cal.com webhook).

A project's written case (`body`, «Caso completo» in the Studio) decides whether its page exists publicly: with a case, the home row links «Leer el caso», the page is in the sitemap and indexable; without one, the page renders but is `noindex`, left out of the sitemap and of the home. The local copies of the written cases are in `content/casos.ts`. `lib/calendario.ts` says whether `NEXT_PUBLIC_CAL_LINK` is set; while it is not, CTAs that promise booking offer the email instead.

### One page background, two themes

Sections never paint a background. They declare `data-surface="mist" | "deep"`, and `components/theme-scroll.tsx` sets `data-tema="oscuro"` on `<html>` while a deep section covers the band at 45–55% of the viewport. All theme colors are custom properties registered with `@property` in `app/globals.css`, so they transition (600 ms; ink flips with a delay). The dark theme also sets `color-scheme: dark`, and `theme-scroll.tsx` swaps the `theme-color` meta between the two `--page-bg` values. Tailwind utilities resolve to those variables, which is what makes components theme-agnostic: use tokens, not hardcoded hex, for anything that must follow the theme.

### Motion

- GSAP and ScrollTrigger are registered through `lib/motion.ts` (`registerGsap`, `START`). Lenis (`components/smooth-scroll.tsx`) drives ScrollTrigger, and handles same-page anchor clicks in the capture phase so Next's `Link` does not jump.
- **Initial states of entrance animations live in CSS**, under `.motion-ready` (added by an inline script in `app/[locale]/layout.tsx`), and tweens are `gsap.to(..., { immediateRender: false, scrollTrigger })`. Do not use `from` / `fromTo` for scroll entrances: they write inline styles at creation, and across dozens of components that became a chain of forced reflows during hydration. A new animated `data-*` hook needs its initial state and a reduced-motion override in `globals.css`.
- Every animation runs inside `gsap.matchMedia()` with a reduced-motion branch. With reduced motion or with JavaScript off, everything must be visible.
- The hero entrance is pure CSS (`data-entra`, `SplitHeading immediate`) so the LCP does not wait for JavaScript.
- Anything that moves on its own must be stoppable. Tickers are wrapped in `RielPausable` (`components/ui/riel-pausable.tsx`): they pause on hover, focus-within, a touch tap, and a keyboard-only button (`header.pauseMotion` / `resumeMotion` in the copy). Testimonials auto-rotate until a face is picked, pause while hovered or focused, never rotate under reduced motion, and only use `aria-live` after a manual pick.
- The projects section (`components/sections/work.tsx` + `components/ui/project-stack.tsx`) scrolls freely. On desktop the heading is sticky at mid-height and the row crossing the viewport middle is highlighted. It used to be a pinned wheel-driven stepper; the user found it painful, so do not reintroduce scroll hijacking there.

### Styling

- Tokens are in `app/globals.css` (`@theme`). `cn()` in `lib/cn.ts` is a plain join, not tailwind-merge: when two utilities conflict, CSS order wins, not argument order.
- Four brand colors (aqua, rosa, verde, miel), each with `-soft`, base and `-deep`. The base shade never carries small text on a light background. `lib/tones.ts` maps tones to full class names because Tailwind cannot build class names at runtime.
- The font is a self-hosted subset of Schibsted Grotesk (weights 400–600, Latin) at `public/fonts/schibsted-grotesk-latin-v1.woff2`, preloaded by hand in the locale layout and declared in `globals.css` with metric-adjusted fallbacks. `next/font` did not emit its preload in this build. Weights above 600 do not exist; if the file changes, bump the `-vN` in its name, since `next.config.ts` serves it with an immutable cache header.
- `experimental.inlineCss` is on: CSS ships inside the HTML.
- Client logos (`public/logos/clientes`) are black on transparent and drawn as CSS masks filled with `currentColor` (`.logo-cliente`), so they follow the theme. Each entry in `socialProof.brands` (`content/site.ts`) carries its width/height `proporcion`; the strip gives every logo the same area, and `escala` nudges one that still reads light. A client without a file falls back to its name as text.

### SEO

Canonical, hreflang, sitemap and JSON-LD all derive from `siteUrl` (`lib/site-url.ts`); the structured-data graph is built in `lib/schema.ts`. `app/llms.txt` describes the studio for answer engines.

## Design skills vs. project decisions

Two third-party skills live in `.claude/skills` (sources and hashes in `skills-lock.json`, update with `npx skills update`): `design-taste-frontend` (from `Leonxlnx/taste-skill`), a general guide for new design work, and `web-design-guidelines` (from `vercel-labs/agent-skills`), a UI audit that fetches Vercel's rule list at run time. Where either conflicts with this site, the site's existing decisions win; do not "fix" these to satisfy a skill:

- Motion is GSAP + ScrollTrigger + Lenis, not Motion/Framer.
- The page switches theme on scroll (Proceso, Proyectos and the form default to dark).
- The hero keeps its three proof items and the HTML dashboard that the panels converge into.
- Icons (`components/ui/icons.tsx`), the brand mark and the bento vignettes are hand-made SVG/HTML.
- Section labels use the `Tag` pill on most sections.
- Client logos in the social-proof strip are one color (the theme ink), not their brand colors.
- Passive `scroll` listeners in `site-header.tsx`, `theme-scroll.tsx` and `project-stack.tsx` are intentional.
- First-visit language comes from the Vercel country header before `Accept-Language` (`middleware.ts`), on purpose.
- Copy is Spanish sentence case; English Title Case rules do not apply.

Changing any of these is a design decision for the user, not a cleanup.

## README

`README.md` is written in Spanish for the user and is current. It covers setup for Sanity (project `6zkp4mb1`, dataset `production`), Resend, Cal.com, the revalidation webhook and the Vercel environment variables, plus the branch flow, where each thing is edited, how the home is put together, motion rules and design decisions. When a change touches any of those, update the README in the same branch.
