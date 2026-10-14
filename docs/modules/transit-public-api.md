# Transit Public API

Read-only, unauthenticated JSON API over the published transit data (cities,
routes, stops). Every endpoint is safe for all visitors: nothing here is
per-user and nothing exposes drafts or unpublished routes.

- Base URL: `/api/v1` (e.g. `https://syrian.zone/api/v1/cities`)
- Auth: none
- Rate limit: 60 requests/minute per IP (`throttle:60,1`); 429 beyond that
- Combined network: `damascus` and `rif-dimashq` are served as one network,
  because routes cross the boundary. Requesting either id returns both.
- Unknown city id: **404** `{ "message": "City not found." }` (never a cached
  empty 200).
- Only `published` routes and `active` cities appear.

## Endpoints

| Endpoint | Returns |
|---|---|
| `GET /cities` | every city with its route count and governorate icon |
| `GET /cities/{id}/routes` | published routes of one city |
| `GET /cities/{id}/map-data` | full GeoJSON for the map (routes + stops) |
| `GET /stops/nearby` | stops within a radius of a point |
| `GET /search` | routes and stops matching a text query in one city |
| `GET /global-search` | cross-module search (transit + mishwar + phonebook + officials + gov apps) |
| `GET /geo/poi` | points of interest (mosques, cafes…) for the map |

## `GET /cities`

Returns an array. The three fields a directory/landing page usually needs are
`nameAr` (or `nameEn`), `routeCount` (published routes), and `icon`.

```json
[
  {
    "id": "damascus",
    "nameAr": "دمشق",
    "nameEn": "Damascus",
    "status": "active",
    "zoom": 12,
    "center": [36.2765, 33.5138],
    "bounds": [[35.8, 33.3], [36.8, 33.7]],
    "routeCount": 4,
    "icon": { "viewBox": "0 0 0.174653 0.124551", "path": "M0.160,0.058 L..." }
  }
]
```

- `center` is `[lng, lat]`; `bounds` is `[[minLng, minLat], [maxLng, maxLat]]`.
- `status` is `active` or `coming_soon`.
- `icon` is the governorate outline or `null` when the city has no outline
  yet. Draw it with the `viewBox` and the single `path`:

  ```html
  <svg viewBox="0 0 0.174653 0.124551" fill="currentColor" aria-hidden="true">
    <path d="M0.160,0.058 L..." />
  </svg>
  ```

  The outlines are the same SVG files the web landing page bundles, read from
  `resources/js/Pages/Transit/_data/governorates/` (parsed by
  `App\Services\Transit\GovernorateIconService`). Cached for 1 hour under
  `transit:cities:api`.

## `GET /cities/{id}/routes`

Published routes of the city (Damascus + Rif Dimashq combined). Array:

```json
[
  {
    "id": "mezzeh-bab-touma",
    "cityId": "damascus",
    "nameAr": "المزة - باب توما",
    "nameEn": "Mezzeh - Bab Touma",
    "colorIndex": 1,
    "priceOld": 2000,
    "priceNew": 3000,
    "stopsCount": 10
  }
]
```

`stopsCount` is always an integer (never null). `colorIndex` selects the line
colour from the map palette. Cached for 10 minutes.

## `GET /cities/{id}/map-data`

The complete map payload as two GeoJSON `FeatureCollection`s. Cached for 10
minutes and sent with `Cache-Control: public, max-age=600`.

```json
{
  "routes": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "LineString", "coordinates": [[36.24, 33.5]] },
        "properties": {
          "id": "mezzeh-bab-touma",
          "nameAr": "المزة - باب توما",
          "nameEn": "Mezzeh - Bab Touma",
          "colorIndex": 1,
          "color_index": 1,
          "priceOld": 2000,
          "priceNew": 3000
        }
      }
    ]
  },
  "stops": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [36.24, 33.5] },
        "properties": { "id": "stop-1", "nameAr": "المزة", "routeIds": ["mezzeh-bab-touma"] }
      }
    ]
  }
}
```

`colorIndex` and `color_index` are both present (legacy aliases).

## `GET /stops/nearby`

Query: `lat` (required), `lng` (required), `radius` in metres (optional,
1..5000, default 500). Array, nearest first:

```json
[
  {
    "id": "stop-1",
    "nameAr": "المزة فيلات غربية",
    "cityId": "damascus",
    "coordinates": [36.24, 33.5],
    "routes": [{ "id": "mezzeh-bab-touma", "name_ar": "المزة - باب توما" }]
  }
]
```

## `GET /search`

Query: `q` (text), `city_id` (optional, limits to one city/network). Returns
`{ "routes": [...], "stops": [...] }`. Empty `q` returns both lists empty.
Route entries carry `type: "route"`, `id`, `nameAr`, `nameEn`, `cityId`; stop
entries carry `type: "stop"`, `id`, `nameAr`, `cityId`, `coordinates`.

## `GET /global-search`

Query: `q` (2..80 chars). Cross-module search returning up to 5 of each:
`routes`, `places` (mishwar), `phonebook`, `officials` (syofficial),
`govapps`. Useful for a single search box across the whole site. Not cached.

## `GET /geo/poi`

Query: `q` (3..100 chars), `city_id` (optional). Nearest places of interest
(mosques, cafes, hospitals…) for the transit map, biased to the city bounds.
Returns `{ "places": [ { "name", "category", "lat", "lng", "district"?,
"city"?, "source" } ] }` where `source` is `osm` or `google`. Backed by Photon
(OSM) with a Google Places fallback; results are cached for 24 hours and sent
with `Cache-Control: public, max-age=3600`. Third-party failures return an
empty list, never a 500.

## See also

- Module deep dive: [transit.md](transit.md)
- The web landing page and admin are separate; this document covers only the
  public JSON surface.
