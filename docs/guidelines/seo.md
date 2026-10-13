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

- `resources/views/app.blade.php` renders a meta block **only when the `$meta`
  view variable is set**. `app/Support/Seo/SeoMeta` + a view composer now set it
  for every app response, so the initial HTML carries title, description,
  canonical, OpenGraph, Twitter and JSON-LD.
- The React `<Head>` in each page updates the same tags during SPA navigation
  (for Googlebot and in-app UX).
- `robots.txt` disallows `/admin/`, `/dashboard`, `/auth/`, `/guesswho/room/`;
  `/api/` is intentionally crawlable.
- `sitemap.xml` is generated from `SitemapBuilder` (44 URLs, `lastmod` where a
  content date exists) and cached an hour.

### Delivery decision: SSR is off

`config/inertia.php` has `ssr.enabled = env('INERTIA_SSR_ENABLED', false)`, and
the container runs no Node process. The PHP `SeoMeta` resolver is therefore the
source of truth for the first HTML response, and the client `<Head>` covers SPA
navigation.

**SSR was attempted and works** — `npm run build` produces `bootstrap/ssr/ssr.js`,
`php artisan inertia:start-ssr` serves it on `127.0.0.1:13714`, and with
`INERTIA_SSR_ENABLED=true` the first response carries ~39 KB of server-rendered
markup plus the React `<Head>` tags. The `<title>` is emitted only by one side
(the PHP fallback title is wrapped in `@unless(config('inertia.ssr.enabled'))`),
so there is no duplicate title; the PHP meta block always renders because the
React `<Head>` does not carry canonical / per-section `og:image` / JSON-LD.

To enable it in production, all of the following are required:

1. **Ship the bundle**: add `COPY --from=frontend-builder /app/bootstrap/ssr ./bootstrap/ssr`
   to the runtime stage (the builder already produces it).
2. **Node in the runtime image** (the `serversideup/php` runtime stage does not
   ship Node by default).
3. **An s6 service** running `docker/s6/inertia-ssr-run` (included, wired like
   `reverb-server`: `type` = longrun, added to the user bundle).
4. **`INERTIA_SSR_ENABLED=true`** in the environment.

Until then it stays off, which is the safer default: a down SSR process must not
take the site down, and the PHP meta already gives scrapers everything they need.

**Known trade-off (either mode):** the server and the React `<Head>` both emit
`description`/`og:*` on the first load. Harmless — crawlers take the first,
scrapers read the server one — but the fully clean fix is SSR **plus** moving
canonical/`og:image`/JSON-LD into a shared React head component and dropping the
PHP block.

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
