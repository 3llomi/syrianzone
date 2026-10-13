# SEO Standards & Audit

How search/social metadata is produced, and the state of every page. The
machine-enforced parts are the sitemap (`app/Services/Sitemap/*`) and
`public/robots.txt`; the rest is convention.

## The two audiences

| Consumer | Runs JS? | Sees |
|---|---|---|
| Googlebot / Bingbot | yes (renders) | the client `<Head>` metadata |
| Social scrapers (WhatsApp, Telegram, Facebook, X, Slack, Discord) | **no** | only the server-rendered HTML |
| Other crawlers / previews | mostly no | server-rendered HTML |

**Consequence:** anything only set client-side is invisible to link previews.
Metadata that matters for sharing must be **server-rendered** (or the app must
run Inertia SSR).

## How it is wired

One source of truth: `App\Support\Seo\SeoMeta` resolves the metadata for the
request (explicit map + dynamic poll/city lookups), and it is delivered two ways
so both JS and non-JS consumers see the same values.

- **React**: `SeoMeta::resolve()` is shared to every Inertia response as the
  `seo` prop, and the single `Components/SeoHead.tsx` (mounted in `MainLayout`)
  renders title, description, canonical, robots, OpenGraph, Twitter and JSON-LD
  from it. SPA navigation updates the head from the fresh prop.
- **Root view**: when Inertia SSR is **off**, `app.blade.php` renders the same
  values server-side (the `$meta` view composer) so social scrapers see them.
  When SSR is **on**, the blade block is skipped and `@inertiaHead` renders the
  SSR `SeoHead` instead.
- **Per-page `<Head>` metadata was removed** — no page sets its own title,
  description or OG tags any more; everything comes from `SeoMeta`. (A page may
  still put resource hints like `<link rel="preload">` in `<Head>`.)
- `robots.txt` disallows `/admin/`, `/dashboard`, `/auth/`, `/guesswho/room/`
  (and `SeoMeta` marks those `noindex`); `/api/` is intentionally crawlable.
- `sitemap.xml` is generated from `SitemapBuilder` (44 URLs, `lastmod` where a
  content date exists) and cached an hour.

To change a page's SEO copy, edit `SeoMeta::PAGES` (or the dynamic lookup) — not
the page component.

### Delivery decision: SSR is off by default, but fully wired

`config/inertia.php` has `ssr.enabled = env('INERTIA_SSR_ENABLED', false)`, so the
PHP `$meta` fallback is what scrapers see until it is turned on. **SSR is wired
into the production image and verified working**: with `INERTIA_SSR_ENABLED=true`
the first response carries the server-rendered markup and exactly one title, one
description, one canonical, one `og:image` and one JSON-LD block (all from
`SeoHead`), with no PHP block emitted.

The Dockerfile already provides everything SSR needs:

1. **Bundle**: `bootstrap/ssr` is copied from the frontend-builder stage.
2. **Node 22** is installed in the runtime stage (the base image ships none).
3. **Runtime deps**: production `node_modules` is copied in — the SSR bundle
   externalizes its dependencies (react, radix, leaflet, …) and imports them at
   render time.
4. **s6 service** `inertia-ssr` runs `docker/s6/inertia-ssr-run` (idles unless
   `INERTIA_SSR_ENABLED=true`).

So enabling it is a single environment change: set **`INERTIA_SSR_ENABLED=true`**
on the app container and redeploy. To turn it off again, set it back to `false`.

Kept off by default because a down SSR process must not take the site down, and
the PHP fallback already gives scrapers everything they need.

> **Note:** `Home` renders its full shell server-side (tool grid, links, footer);
> `Roznama` renders its hero, and its live dashboard (clock, holidays, prayer)
> stays client-rendered because it depends on the device time/zone and
> localStorage. Both hydrate without mismatches.

## Requirements per page

Every **indexable** page (i.e. everything except `/dashboard`, `/admin/*`,
`/guesswho/room/*`, `/auth/*`) must have:

1. A unique `<title>` (≤ ~60 chars) — `SeoMeta` map or the page `<Head>`.
2. A unique meta `description` (~50–160 chars).
3. `rel="canonical"` — clean path, no query string, canonical host.
4. `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (1200×630 PNG).
5. `twitter:card=summary_large_image` + `twitter:title/description/image`.
6. `robots` = `index,follow` (the disallowed routes should be `noindex` too).
7. One `<h1>` and a sane heading order (see accessibility.md).
8. JSON-LD where a type fits (see below).

## JSON-LD

Emitted server-side by `SeoMeta::jsonLd()` as one `@graph` per page:

- **Site-wide**: `Organization` (`#organization`) + `WebSite` (`#website`).
- **A typed page node** (`SeoMeta::SCHEMA`), default `WebPage`:
  `CollectionPage` (directories, mishwar, transit, muslim, games hub),
  `Article` (tierlist, leaderboard, house, justice, and every `/polls/{slug}`),
  `Dataset` (atlas), `Quiz` (compass, alignment), `VideoGame` (each game,
  guesswho).
- **`BreadcrumbList`** for every non-root page.

Adding a page type is a one-line entry in `SeoMeta::SCHEMA`.

## Share images

- Per-section cards live in `public/og/<slug>.png` (1200×630, generated) and are
  mapped by `SeoMeta::IMAGES`.
- **Per-record cards** for polls and transit cities live in
  `public/og/polls/<slug>.png` and `public/og/cities/<id>.png`. `SeoMeta` uses
  them when the file exists. Generate/refresh them with:

  ```bash
  php artisan seo:og-manifest | python3 scripts/generate_og.py
  ```

  (needs playwright + chromium; the command emits JSON, the script renders). Run
  it after adding polls or transit cities, and commit the PNGs.
- Pages with neither fall back to `config('seo.default_image')`
  (`/assets/thumbnail.jpg`).
- `og:image`, `og:image:width/height/alt` and `twitter:image` are emitted for
  every page.

## Audit (this branch)

Legend: ✓ present (client-side today), – missing. **Every page additionally
lacked server-rendered meta, canonical and JSON-LD before this change**; the
`SeoMeta` resolver now fills those on the server for all pages.

| Route | title | desc | og | og:image | twitter | canonical | JSON-LD |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `/` | ✓ | ✓ | ✓ | – | – | – | – |
| `/tierlist` | ✓ | ✓ | ✓ | – | – | – | – |
| `/tierlist/leaderboard` | ✓ | ✓ | – | – | – | – | – |
| `/polls` | ✓ | ✓ | – | – | – | – | – |
| `/polls/{slug}` | ✓ | ✓ | ✓ | – | – | – | – |
| `/mishwar` | ✓ | ✓ | ✓ | – | – | – | – |
| `/transit` | ✓ | ✓ | – | – | – | – | – |
| `/transit/city/{id}` | ✓ | ✓ | – | – | – | – | – |
| `/transit/studio` | ✓ | – | – | – | – | – | – |
| `/syofficial` | ✓ | ✓ | ✓ | ✓ (SVG) | ✓ | – | – |
| `/phonebook` | ✓ | ✓ | ✓ | – | ✓ | – | – |
| `/govapps` | ✓ | ✓ | ✓ | – | – | – | – |
| `/sites` | ✓ | ✓ | ✓ | – | – | – | – |
| `/party` | ✓ | ✓ | ✓ | – | – | – | – |
| `/house` | ✓ | ✓ | – | – | – | – | – |
| `/justice` | ✓ | ✓ | ✓ | – | – | – | – |
| `/crossings` | ✓ | ✓ | ✓ | – | – | – | – |
| `/atlas` | ✓ | ✓ | ✓ | – | – | – | – |
| `/syid` | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ |
| `/muslim` | ✓ | ✓ | ✓ | – | – | – | – |
| `/muslim/prayer` | ✓ | ✓ | ✓ | – | – | – | – |
| `/muslim/quran` | ✓ | ✓ | ✓ | – | – | – | – |
| `/muslim/radio` | ✓ | ✓ | ✓ | – | – | – | – |
| `/roznama` | ✓ | ✓ | ✓ | – | ✓ | – | – |
| `/priorities` | ✓ | ✓ | ✓ | – | – | – | – |
| `/compass` | ✓ | ✓ | ✓ | – | – | – | – |
| `/compass/stats` | ✓ | ✓ | – | – | – | – | – |
| `/compass/s/{id}` | ✓ | – | – | – | – | – | – |
| `/alignment` | ✓ | ✓ | ✓ | – | – | – | – |
| `/games` + each game | ✓ | ✓ | ✓ | – | – | – | – |
| `/guesswho` | ✓ | ✓ | ✓ | – | – | – | – |
| `/board` | ✓ | ✓ | ✓ | – | – | – | – |
| `/syrian-contributors` | ✓ | ✓ | – | – | – | – | – |
| `/shawarma` | ✓ | ✓ | – | – | – | – | – |
| `/stats` | ✓ | ✓ | – | – | – | – | – |
| `/about` | ✓ | ✓ | ✓ | – | – | – | – |
| `/privacy`, `/terms` | ✓ | ✓ | – | – | – | – | – |

**Global before the fix:** 0 canonical tags, 1 JSON-LD, 2 `og:image` (one an
SVG), 4 `twitter:card`, and no server-rendered metadata at all.

## Definition of done for a new page

- [ ] Added to `SeoMeta` (or the page `<Head>` mirrors it) with a unique
      title + description.
- [ ] Server-rendered canonical/OG/Twitter present (automatic via `SeoMeta`).
- [ ] `og:image` is a 1200×630 PNG (default at `/assets/og-default.png`).
- [ ] JSON-LD type chosen where one fits.
- [ ] Listed in `SitemapBuilder::STATIC_PAGES` if it is a stable public page
      (dynamic pages: add a builder source).
- [ ] `robots.txt` updated if it must stay out of the index.
- [ ] `lang="ar"` (global) and one `<h1>`.
