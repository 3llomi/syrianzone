import { Head, usePage } from '@inertiajs/react';

/**
 * The single renderer of per-page <head> metadata.
 *
 * Values come from the `seo` Inertia shared prop, resolved server-side once per
 * request by App\Support\Seo\SeoMeta (title, description, canonical, robots,
 * OpenGraph, Twitter, JSON-LD). Because it lives in the layout, every page gets
 * it and SPA navigation updates it from the fresh shared prop.
 *
 * When Inertia SSR is off, the root view renders the same values server-side for
 * non-JS crawlers; when it is on, this component is rendered by the SSR process.
 * Either way there is one source of truth. See docs/guidelines/seo.md.
 */
export interface SeoData {
  title: string;
  description: string;
  type: string;
  image: string;
  url: string;
  canonical: string;
  robots: string;
  json_ld: string;
}

export default function SeoHead() {
  const { seo } = usePage<{ seo?: SeoData }>().props;
  if (!seo) return null;

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta name="robots" content={seo.robots} />
        <meta property="og:site_name" content="Syrian Zone" />
        <meta property="og:locale" content="ar_SY" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content={seo.type} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={seo.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
      </Head>
      {seo.json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seo.json_ld }}
        />
      )}
    </>
  );
}
