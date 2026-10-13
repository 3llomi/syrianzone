# SEO

How metadata, Open Graph cards, structured data, and `sitemap.xml` work across
Syrian Zone, and what to touch when adding or changing a page.

## Architecture

Every public page gets its `<head>` tags from **one** definition in
[`app/Support/Seo/SeoMeta.php`](../../app/Support/Seo/SeoMeta.php), rendered
through **two** paths that produce the same tags:

```text
Request
  │
  ├─► AppServiceProvider view composer  ──► resources/views/app.blade.php
  │     (server-rendered <head>; emitted whenever Inertia SSR did not render)
  │
  └─► HandleInertiaRequests shared prop (`seo`)
        └─► resources/js/Layouts/AppShell.tsx
              └─► <SeoHead />  (client-side navigation + Inertia SSR @inertiaHead)
```

- **Initial response (no JS / social scrapers):** WhatsApp, Telegram, X,
  Facebook, Slack, Discord, and non-JS crawlers read `app.blade.php` directly.
  Every tag inside `@unless ($ssrDispatched)` carries the `inertia` attribute so
  Inertia replaces — rather than duplicates — it once the bundle boots. Because
  `app.blade.php` checks whether `Inertia\Ssr\SsrState::dispatch()` actually
  returned a response, the server-rendered fallback is emitted both when SSR is
  disabled (`INERTIA_SSR_ENABLED=false`) and when SSR is enabled in config but
  the SSR server is unreachable.
- **SPA navigation & SSR:** `AppShell` mounts `<SeoHead />` unconditionally. By
   default it reads `usePage().props.seo` (populated by `SeoMeta::resolve()`) and
  renders `<title>`, description, canonical, robots, Open Graph, Twitter Card,
  and JSON-LD inside Inertia's `<Head>` component. Individual pages do **not**
  render their own `<SeoHead>` or Inertia `<Head>`.

Because both paths read `SeoMeta::resolve($request)` (memoized on the request
attributes), a page's title, description, canonical URL, image, and JSON-LD live
in one place and the initial HTML and hydrated DOM never disagree.

## Key files

| File | Responsibility |
| --- | --- |
| [`app/Support/Seo/SeoMeta.php`](../../app/Support/Seo/SeoMeta.php) | Single source of truth for per-route `title`, `description`, `type`, `image`, `robots`, and JSON-LD `@graph` |
| [`config/seo.php`](../../config/seo.php) | Site-wide defaults (`site_name`, `default_title`, `default_description`, `default_image`, `locale`, `base_url`) |
| [`resources/views/app.blade.php`](../../resources/views/app.blade.php) | Server-side `<head>` fallback when Inertia SSR is disabled or unreachable |
| [`resources/js/Components/SeoHead.tsx`](../../resources/js/Components/SeoHead.tsx) | Inertia `<Head>` wrapper for SPA transitions and SSR; accepts optional overrides |
| [`resources/js/Layouts/AppShell.tsx`](../../resources/js/Layouts/AppShell.tsx) | Mounts `<SeoHead />` once for the whole app |
| [`app/Console/Commands/SeoOgManifest.php`](../../app/Console/Commands/SeoOgManifest.php) | `php artisan seo:og-manifest` — dumps the card list (sections + DB polls + DB cities) as JSON |
| [`scripts/generate_og.py`](../../scripts/generate_og.py) | Renders `1200×630` RTL Arabic PNGs into `public/og/` from the manifest |
| [`app/Services/Sitemap/SitemapBuilder.php`](../../app/Services/Sitemap/SitemapBuilder.php) | Collects static routes + active polls + published transit cities for `/sitemap.xml` |
| [`app/Services/Sitemap/SitemapWriter.php`](../../app/Services/Sitemap/SitemapWriter.php) | Serializes `SitemapEntry` records to XML and writes `public/sitemap.xml` |
| [`app/Http/Controllers/SitemapController.php`](../../app/Http/Controllers/SitemapController.php) | Serves `/sitemap.xml` dynamically (cached 1h under `sitemap.xml.v1`) |
| [`public/robots.txt`](../../public/robots.txt) | Disallows `/admin`, `/superadmin`, `/transit/admin`, `/dashboard`, `/api/`, `/auth/`, `/user`, `/dev/`, `/mcp/`, `/guesswho/room`; points to `https://syrian.zone/sitemap.xml` |

## Adding a new public page

1. **Register the metadata in `SeoMeta.php`:**
   - Add the path to `SeoMeta::PAGES` with an Arabic `title` and `description`
     (keep descriptions around 110–160 characters so they don't truncate on
     SERPs or social cards).
   - Pick a JSON-LD type in `SeoMeta::SCHEMA` if the page is more specific than
     `WebPage` (`Article`, `CollectionPage`, `Dataset`, `Quiz`, `VideoGame`).
   - If the route is nested under a hub, add it to `SeoMeta::PARENT_BREADCRUMBS`
     so its `BreadcrumbList` emits a 3-level trail (`الرئيسية` → Hub → Page).
2. **Give it an Open Graph card:**
   - Either point `SeoMeta::IMAGES['/your-route']` at an existing section card,
     or add a new entry to `SeoOgManifest::SECTIONS` and run:
     ```bash
     python3 scripts/generate_og.py
     ```
   - Commit the generated `public/og/<slug>.png`.
3. **Add it to the sitemap:**
   - Append `[path, priority, changefreq]` to `SitemapBuilder::STATIC_PAGES`.
4. **Ensure the page has a single `<h1>`:**
   - Every indexable page must render one semantic `<h1>` in its React tree. If
     the visual design has no top heading (e.g. a full-bleed map or game board),
     use `<h1 className="sr-only">…</h1>`.
5. **Do not add `<Head>` or `<SeoHead>` to the page component** unless the page
   computes a title strictly in the browser that `SeoMeta` cannot know on the
   server.

## Dynamic routes

`SeoMeta::dynamicMeta()` and `SeoMeta::dynamicImage()` handle database-backed
routes:

- **`/polls/{slug}`** and **`/polls/{slug}/leaderboard`** — looks up `Poll` by
  `slug` (or `id` fallback, canonicalizing UUID URLs to `/polls/{slug}` and
  `best-ministers` to `/tierlist` and `/tierlist/leaderboard`), marks inactive
  polls as `noindex, follow`, and checks `public/og/polls/{slug}.png` before
  falling back to `/og/tierlist.png`.
- **`/transit/city/{id}`** — looks up `City::find($id)` for `name_ar` and checks
  `public/og/cities/{id}.png` before falling back to `/og/transit.png`. Unknown
  city IDs return a real HTTP `404`.
- **`/compass/s/{shareId}`** — resolves custom share metadata and marks the
  per-result share URL as `noindex, follow` so ephemeral user results do not
  bloat search indexes.

Both methods wrap Eloquent calls in `try / catch (\Throwable)` so a missing
table or unseeded database never breaks a page render. When new polls or cities
are added in production, regenerate the per-record cards with:

```bash
php artisan seo:og-manifest | python3 scripts/generate_og.py --manifest -
```

## Non-indexed routes

Routes under `SeoMeta::NOINDEX_PREFIXES` (`admin`, `superadmin`, `transit/admin`,
`dashboard`, `auth`, `user`, `dev`, `mcp/admin`, `guesswho/room`, `compass/s`) and
inactive polls emit `<meta name="robots" content="noindex, follow">` in addition
to being disallowed in `public/robots.txt` and excluded from `SitemapBuilder`.

## Structured data (JSON-LD)

`SeoMeta::jsonLd()` emits a single `@graph` per page containing:

1. `Organization` (`https://syrian.zone/#organization`)
2. `WebSite` (`https://syrian.zone/#website`, `inLanguage: ar`)
3. The page node (`WebPage` or the mapped `SeoMeta::SCHEMA` subtype; `Article`
   nodes automatically receive `headline` and `publisher`)
4. `BreadcrumbList` (`الرئيسية → Page` on top-level routes, or
   `الرئيسية → Parent Hub → Page` on nested routes)

Because Blade treats `@context` as a directive, the JSON string is built in PHP
and output via `{!! $meta['json_ld'] !!}` on the server and
`dangerouslySetInnerHTML` inside Inertia's `<Head>` on the client.

## Route inventory

| Path | JSON-LD `@type` | OG Card | Sitemap |
| --- | --- | --- | --- |
| `/` | `WebPage` | `/og/home.png` | `1.0` daily |
| `/tierlist` | `Article` | `/og/tierlist.png` | `0.9` daily |
| `/tierlist/leaderboard` | `Article` | `/og/tierlist.png` | `0.8` daily |
| `/polls` | `CollectionPage` | `/og/tierlist.png` | `0.8` daily |
| `/polls/{slug}` | `Article` | `/og/polls/{slug}.png` → `/og/tierlist.png` | `0.7` daily |
| `/polls/{slug}/leaderboard` | `Article` | `/og/polls/{slug}.png` → `/og/tierlist.png` | `0.6` daily |
| `/mishwar` | `CollectionPage` | `/og/mishwar.png` | `0.9` daily |
| `/transit` | `CollectionPage` | `/og/transit.png` | `0.9` weekly |
| `/transit/city/{id}` | `WebPage` | `/og/cities/{id}.png` → `/og/transit.png` | `0.8` weekly |
| `/transit/studio` | `WebPage` | `/og/transit.png` | `0.5` monthly |
| `/syofficial` | `CollectionPage` | `/og/syofficial.png` | `0.8` weekly |
| `/phonebook` | `CollectionPage` | `/og/phonebook.png` | `0.8` weekly |
| `/govapps` | `CollectionPage` | `/og/govapps.png` | `0.8` weekly |
| `/sites` | `CollectionPage` | `/og/sites.png` | `0.7` weekly |
| `/party` | `CollectionPage` | `/og/party.png` | `0.7` monthly |
| `/house` | `Article` | `/og/house.png` | `0.7` monthly |
| `/justice` | `Article` | `/og/justice.png` | `0.7` monthly |
| `/crossings` | `CollectionPage` | `/og/crossings.png` | `0.8` daily |
| `/atlas` | `Dataset` | `/og/atlas.png` | `0.8` monthly |
| `/syid` | `CollectionPage` | `/og/syid.png` | `0.7` monthly |
| `/muslim` | `CollectionPage` | `/og/muslim.png` | `0.7` weekly |
| `/muslim/prayer` | `WebPage` | `/og/muslim-prayer.png` | `0.7` daily |
| `/muslim/quran` | `WebPage` | `/og/muslim-quran.png` | `0.7` monthly |
| `/muslim/radio` | `WebPage` | `/og/muslim.png` | `0.6` monthly |
| `/roznama` | `WebPage` | `/og/roznama.png` | `0.7` daily |
| `/priorities` | `WebPage` | `/og/priorities.png` | `0.6` monthly |
| `/compass` | `Quiz` | `/og/compass.png` | `0.7` monthly |
| `/compass/stats` | `WebPage` | `/og/compass.png` | `0.6` weekly |
| `/alignment` | `Quiz` | `/og/compass.png` | `0.6` monthly |
| `/games` | `CollectionPage` | `/og/games.png` | `0.6` monthly |
| `/games/2048` | `VideoGame` | `/og/games.png` | `0.5` monthly |
| `/games/solitare` | `VideoGame` | `/og/games.png` | `0.5` monthly |
| `/games/tarneeb` | `VideoGame` | `/og/games.png` | `0.5` monthly |
| `/games/trix` | `VideoGame` | `/og/games.png` | `0.5` monthly |
| `/guesswho` | `VideoGame` | `/og/guesswho.png` | `0.6` monthly |
| `/board` | `WebPage` | `/og/board.png` | `0.7` weekly |
| `/syrian-contributors` | `CollectionPage` | `/og/syrian-contributors.png` | `0.6` weekly |
| `/shawarma` | `CollectionPage` | `/og/shawarma.png` | `0.5` monthly |
| `/stats` | `WebPage` | `/og/about.png` | `0.4` weekly |
| `/about` | `WebPage` | `/og/about.png` | `0.5` monthly |
| `/privacy` | `WebPage` | `/og/about.png` | `0.3` yearly |
| `/terms` | `WebPage` | `/og/about.png` | `0.3` yearly |
