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

`config/inertia.php` has `ssr.enabled = false` and there is no SSR service in
`docker/` — the container runs no Node process. Enabling SSR would server-render
the React `<Head>` directly (no duplicated tags) but needs a new s6 service and
`php artisan inertia:start-ssr` in the image. Until then the PHP `SeoMeta`
resolver is the source of truth for the first HTML response, and the client
`<Head>` covers SPA navigation. **This means the server and client both emit
`description`/`og:*` on first load** (harmless — crawlers take the first, scrapers
read the server one — but the long-term clean fix is SSR).

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

- **Site-wide** (emitted in the blade for every page): `Organization` + `WebSite`.
- **Per type**: `ItemList` for directories (syofficial, phonebook, govapps,
  sites, party), `Article`/`FAQPage` for polls & leaderboards, `Place` for
  mishwar, `SoftwareApplication` for govapps, `BreadcrumbList` for sub-pages.

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
