<?php

namespace App\Support\Seo;

use App\Models\City;
use App\Models\Poll;
use Illuminate\Http\Request;

/**
 * Resolves the metadata for the initial HTML response.
 *
 * Inertia SSR is disabled and no Node process runs in the container, so social
 * scrapers (WhatsApp, Telegram, X, Facebook) — which do not execute JavaScript —
 * would otherwise see the generic app title and no description. This class is
 * the server-side source of truth for the first response; the React <Head> keeps
 * the tags in sync during SPA navigation.
 *
 * The map is intentionally explicit (mirrors the client titles/descriptions) so
 * a page's SEO copy lives in one obvious place per language.
 */
class SeoMeta
{
    /**
     * Fixed pages: path => [title, description, type?, image?].
     *
     * Titles include the site suffix already, matching what the browser tab
     * shows, so the client and server never disagree.
     */
    private const PAGES = [
        '/' => [
            'title' => 'المساحة السورية — منصة سورية مفتوحة المصدر',
            'description' => 'المساحة السورية - منصة تفاعلية تجمع وتوفر الموارد والخدمات والمعلومات المفتوحة المتعلقة بالشأن السوري من استطلاعات رأي، وأدلة رسمية، وأطلس، وترانزيت، وهويات بصرية.',
        ],
        '/tierlist' => [
            'title' => 'تير ليست الحكومة السورية | Syrian Zone',
            'description' => 'شارك في تقييم وتصنيف أداء أعضاء الحكومة السورية الجديدة عبر منصة تير ليست تفاعلية وشاركه مع الآخرين.',
            'type' => 'article',
        ],
        '/tierlist/leaderboard' => [
            'title' => 'نتائج تقييم الحكومة السورية | Syrian Zone',
            'description' => 'إحصائيات ونتائج تصويت تير ليست الحكومة السورية، المحافظين، والشخصيات العامة ببيانات تفاعلية محدثة.',
            'type' => 'article',
        ],
        '/polls' => [
            'title' => 'الاستبيانات واستطلاعات الرأي | Syrian Zone',
            'description' => 'شارك في الاستبيانات واستطلاعات الرأي المجتمعية حول مختلف القضايا والشؤون السورية.',
        ],
        '/mishwar' => [
            'title' => 'مشوار | دليل وخريطة الأماكن والخدمات والمعالم في سوريا',
            'description' => 'دليل وخريطة تفاعلية لاكتشاف وتصفح الأماكن الخدمية، المعالم، المطاعم، المقاهي، والأماكن المخفية في سوريا مع التوصيات والتقييمات.',
        ],
        '/transit' => [
            'title' => 'ترانزيت سوريا | شبكة المواصلات العامة',
            'description' => 'ترانزيت سوريا - دليل وخرائط تفاعلية لشبكات وخطوط المواصلات العامة والسرافيس في المدن السورية.',
        ],
        '/transit/studio' => [
            'title' => 'استوديو ترانزيت | رسم الخرائط',
            'description' => 'استوديو ترانزيت - ارسم خطوط المواصلات العامة، أضف المواقف، وشارك مسارك لمدن سوريا على الخريطة.',
        ],
        '/syofficial' => [
            'title' => 'الحسابات الرسمية السورية | Syrian Zone',
            'description' => 'دليل الحسابات والجهات الرسمية السورية الموثقة على منصات التواصل، مصنّف حسب القطاعات والجهات.',
        ],
        '/phonebook' => [
            'title' => 'دليل الهاتف والواتساب الخدمي | Syrian Zone',
            'description' => 'دليل أرقام الهواتف وخطوط الواتساب الرسمية للجهات الحكومية والخدمية السورية. أرقام الطوارئ، الشكاوى، والمؤسسات الرسمية.',
        ],
        '/govapps' => [
            'title' => 'دليل التطبيقات والخدمات الحكومية | Syrian Zone',
            'description' => 'دليل تفاعلي لاستكشاف، ومتابعة، وتقييم التطبيقات والخدمات الإلكترونية الصادرة عن الجهات الحكومية السورية.',
        ],
        '/sites' => [
            'title' => 'دليل المواقع السورية | Syrian Zone',
            'description' => 'دليل تفاعلي شامل للمواقع الإلكترونية والخدمات والمنصات السورية المفيدة بمختلف المجالات.',
        ],
        '/party' => [
            'title' => 'دليل الأحزاب والقوى السياسية | Syrian Zone',
            'description' => 'دليل تفاعلي للتعرف على الأحزاب، والتنظيمات، والقوى السياسية والمدنية الفاعلة في الساحة السورية.',
        ],
        '/house' => [
            'title' => 'المجلس التشريعي السوري 2026 | Syrian Zone',
            'description' => 'التشكيلة النهائية لمجلس الشعب السوري 2026: مخطط القاعة، إحصائيات، وقائمة الأعضاء. المصدر: مركز عمران للدراسات الاستراتيجية.',
        ],
        '/justice' => [
            'title' => 'العدالة الانتقالية | Syrian Zone',
            'description' => 'العدالة الانتقالية - قوائم وإحصائيات رموز نظام الأسد والمجرمين الموقوفين لدى وزارة الداخلية السورية وهيكل القيادة العسكرية والأمنية.',
            'type' => 'article',
        ],
        '/crossings' => [
            'title' => 'الحالة الفنية للمنافذ الحدودية في سوريا | Syrian Zone',
            'description' => 'متابعة الحالة الفنية وساعات العمل للمنافذ الحدودية السورية والمعابر البرية، مع أرقام التواصل والمواقع.',
        ],
        '/atlas' => [
            'title' => 'أطلس سوريا التفاعلي | Syrian Zone',
            'description' => 'أطلس سوريا التفاعلي - منصة لاستكشاف البيانات السكانية والجغرافية والإحصائية التفصيلية لمختلف المحافظات والمدن السورية.',
        ],
        '/syid' => [
            'title' => 'الهوية البصرية السورية | syrian.zone',
            'description' => 'عناصر الهوية البصرية السورية - دليل وموارد غير رسمية تشمل الألوان والخطوط وخريطة سوريا ونسب العلم السوري وتطبيقاته.',
        ],
        '/muslim' => [
            'title' => 'الركن الإسلامي | Syrian Zone',
            'description' => 'الركن الإسلامي - مواقيت الصلاة، قارئ القرآن بالرسم العثماني، وإذاعة القرآن الكريم، في مكان واحد.',
        ],
        '/muslim/prayer' => [
            'title' => 'مواقيت الصلاة | الركن الإسلامي | Syrian Zone',
            'description' => 'مواقيت الصلاة اليومية في سوريا حسب مدينتك وطريقة الحساب، مع عدّاد للصلاة القادمة وتتبّع الصلوات المنجزة.',
        ],
        '/muslim/quran' => [
            'title' => 'قارئ القرآن | الركن الإسلامي | Syrian Zone',
            'description' => 'قارئ القرآن بالرسم العثماني مع التلاوة الصوتية، تتبّع الآيات والكلمات، وعلامات الحفظ — يعمل دون اتصال.',
        ],
        '/muslim/radio' => [
            'title' => 'إذاعة القرآن | الركن الإسلامي | Syrian Zone',
            'description' => 'إذاعة القرآن الكريم وتلاوة مستمرة مع اختيار القارئ ومؤقت للنوم ومشغّل مصغّر يتابع القراءة.',
        ],
        '/roznama' => [
            'title' => 'الروزنامة السورية | Syrian Zone',
            'description' => 'الروزنامة السورية الرسمية: التوقيت المحلي، التاريخ الهجري والميلادي بأسماء الأشهر السورية، مواقيت الصلاة، والأعياد والعطل الرسمية للدولة السورية بموجب المرسوم 188 لعام 2025.',
        ],
        '/priorities' => [
            'title' => 'أولويات سوريا المستقبل | Syrian Zone',
            'description' => 'رتب أولوياتك للجمهورية العربية السورية المستقبلية وشاركها مع المجتمع عبر بطاقات مخصصة وتفاعلية.',
        ],
        '/compass' => [
            'title' => 'بوصلة سوريا | Syrian Zone',
            'description' => 'اكتشف موقعك السياسي على أحد عشر محوراً عبر اختبار بوصلة سوريا التفاعلي، وقارن نتائجك مع الشخصيات والقوى السياسية.',
        ],
        '/compass/stats' => [
            'title' => 'إحصاءات بوصلة سوريا | Syrian Zone',
            'description' => 'إحصاءات مجمّعة ومجهولة الهوية عن نتائج بوصلة سوريا عبر المحاور والفئات والمشاركات.',
        ],
        '/alignment' => [
            'title' => 'مواءمة البوصلة السياسية | Syrian Zone',
            'description' => 'أداة مواءمة البوصلة السياسية السورية - قارن توجهاتك وميولك مع المكونات والقوى السياسية المختلفة.',
        ],
        '/games' => [
            'title' => 'الألعاب | Syrian Zone',
            'description' => 'مجموعة ألعاب سورية تفاعلية: 2048، سوليتير، طرنيب، تركس، ومن هو؟ — العب مجاناً على المساحة السورية.',
        ],
        '/games/2048' => ['title' => '2048 | الألعاب | Syrian Zone', 'description' => 'لعبة 2048 الكلاسيكية على المساحة السورية - حرّك المربعات واجمع الأرقام للوصول إلى 2048.'],
        '/games/solitare' => ['title' => 'سوليتير | الألعاب | Syrian Zone', 'description' => 'لعبة سوليتير (كلوندايك) الكلاسيكية - رتّب البطاقات على أربعة أسس.'],
        '/games/tarneeb' => ['title' => 'طرنيب | الألعاب | Syrian Zone', 'description' => 'لعبة الطرنيب الشهيرة - العب مع شريكك ضد فريق الخصوم واجمع الطلبات.'],
        '/games/trix' => ['title' => 'تركس | الألعاب | Syrian Zone', 'description' => 'لعبة التركس الشهيرة - العب الفريقين أو اليهودية واستمتع بالذكاء والتخطيط.'],
        '/guesswho' => [
            'title' => 'لعبة من هو؟ - Guess Who | Syrian Zone',
            'description' => "تحدّ صديقك في لعبة التخمين الشهيرة 'من هو؟' بالاتصال المباشر! اطرح الأسئلة واستبعد الشخصيات لتكشف بطاقة خصمك السرية.",
        ],
        '/board' => [
            'title' => 'لوحتي | لوحة أدواتك اليومية المخصصة في سوريا زون',
            'description' => 'لوح أدوات مخصص: الطقس، مواقيت الصلاة، المهام، الملاحظات، الأخبار، والمزيد في لوحة واحدة قابلة للتخصيص.',
        ],
        '/syrian-contributors' => [
            'title' => 'أفضل المساهمين السوريين في GitHub | Syrian Zone',
            'description' => 'قائمة وتصنيف لأكثر المطورين والمبرمجين السوريين مساهمةً في المشاريع مفتوحة المصدر على GitHub على المستويات اليومية والشهرية والسنوية.',
        ],
        '/shawarma' => [
            'title' => "@macdoos's Shawarma Tier List",
            'description' => 'تقييم وتصنيف محلات الشاورما السورية الشهيرة - قائمة مكدوس لأفضل محلات الشاورما.',
        ],
        '/stats' => [
            'title' => 'إحصائيات المنصة | Syrian Zone',
            'description' => 'إحصائيات وتقارير تفاعلية حول المنصة وزوارها والنشاط العام في المساحة السورية.',
        ],
        '/about' => [
            'title' => 'عن المنصة | Syrian Zone',
            'description' => 'تعرف على منصة المساحة السورية (Syrian Zone) - مشروع تفاعلي غير تجاري ومفتوح المصدر يقدم أدوات وموارد بالشأن السوري.',
        ],
        '/privacy' => [
            'title' => 'سياسة الخصوصية | Syrian Zone',
            'description' => 'سياسة الخصوصية لمنصة المساحة السورية - تعرف على كيفية حماية بياناتك والتقنيات المستخدمة.',
        ],
        '/terms' => [
            'title' => 'الشروط والأحكام | Syrian Zone',
            'description' => 'الشروط والأحكام لمنصة المساحة السورية - شروط الاستخدام، السلوك المقبول، وحدود المسؤولية.',
        ],
    ];

    /** Path prefixes that must not be indexed even though they are reachable. */
    private const NOINDEX_PREFIXES = ['admin', 'dashboard', 'auth', 'guesswho/room'];

    /**
     * Section share images (1200×630 PNG under public/og/). Pages absent here
     * fall back to config('seo.default_image'). An explicit `image` in PAGES
     * wins over this map.
     */
    private const IMAGES = [
        '/' => '/og/home.png',
        '/tierlist' => '/og/tierlist.png',
        '/mishwar' => '/og/mishwar.png',
        '/transit' => '/og/transit.png',
        '/syofficial' => '/og/syofficial.png',
        '/phonebook' => '/og/phonebook.png',
        '/govapps' => '/og/govapps.png',
        '/sites' => '/og/sites.png',
        '/party' => '/og/party.png',
        '/house' => '/og/house.png',
        '/justice' => '/og/justice.png',
        '/crossings' => '/og/crossings.png',
        '/atlas' => '/og/atlas.png',
        '/syid' => '/og/syid.png',
        '/muslim' => '/og/muslim.png',
        '/muslim/prayer' => '/og/muslim-prayer.png',
        '/muslim/quran' => '/og/muslim-quran.png',
        '/roznama' => '/og/roznama.png',
        '/priorities' => '/og/priorities.png',
        '/compass' => '/og/compass.png',
        '/games' => '/og/games.png',
        '/guesswho' => '/og/guesswho.png',
        '/board' => '/og/board.png',
        '/syrian-contributors' => '/og/syrian-contributors.png',
        '/shawarma' => '/og/shawarma.png',
        '/about' => '/og/about.png',
    ];

    /**
     * JSON-LD type for the page node, keyed by path. Anything absent is a plain
     * WebPage. Kept separate from PAGES so the copy and the schema can evolve
     * independently.
     */
    private const SCHEMA = [
        '/tierlist' => 'Article',
        '/tierlist/leaderboard' => 'Article',
        '/house' => 'Article',
        '/justice' => 'Article',
        '/polls' => 'CollectionPage',
        '/mishwar' => 'CollectionPage',
        '/transit' => 'CollectionPage',
        '/syofficial' => 'CollectionPage',
        '/phonebook' => 'CollectionPage',
        '/govapps' => 'CollectionPage',
        '/sites' => 'CollectionPage',
        '/party' => 'CollectionPage',
        '/crossings' => 'CollectionPage',
        '/syid' => 'CollectionPage',
        '/muslim' => 'CollectionPage',
        '/games' => 'CollectionPage',
        '/syrian-contributors' => 'CollectionPage',
        '/shawarma' => 'CollectionPage',
        '/atlas' => 'Dataset',
        '/compass' => 'Quiz',
        '/alignment' => 'Quiz',
        '/games/2048' => 'VideoGame',
        '/games/solitare' => 'VideoGame',
        '/games/tarneeb' => 'VideoGame',
        '/games/trix' => 'VideoGame',
        '/guesswho' => 'VideoGame',
    ];

    /**
     * @return array{title:string,description:string,type:string,image:string,url:string,canonical:string,robots:string,json_ld:string}
     */
    public static function resolve(Request $request): array
    {
        $path = '/'.trim($request->path(), '/');
        if ($path === '//') {
            $path = '/';
        }

        $page = self::PAGES[$path] ?? null;
        $title = $page['title'] ?? config('seo.default_title');
        $description = $page['description'] ?? config('seo.default_description');
        $type = $page['type'] ?? 'website';

        // Dynamic pages: fill the title/description from the record when cheap.
        if ($page === null) {
            [$title, $description] = self::dynamicMeta($path, $title, $description);
        }

        $base = rtrim((string) config('seo.base_url'), '/');
        $canonical = $path === '/' ? $base.'/' : $base.$path;
        $image = self::absolute((string) ($page['image'] ?? self::IMAGES[$path] ?? config('seo.default_image')), $base);
        $robots = self::isNoindex($path) ? 'noindex, follow' : 'index, follow';
        $schema = self::SCHEMA[$path] ?? (str_starts_with($path, '/polls/') ? 'Article' : 'WebPage');

        return [
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'image' => $image,
            'url' => $canonical,
            'canonical' => $canonical,
            'robots' => $robots,
            'json_ld' => self::jsonLd($path, $schema, $title, $description, $canonical, $base),
        ];
    }

    /**
     * @return array{0:string,1:string}
     */
    private static function dynamicMeta(string $path, string $title, string $description): array
    {
        try {
            if (preg_match('#^/polls/([^/]+)$#', $path, $m)) {
                $poll = Poll::where('slug', $m[1])->first();
                if ($poll) {
                    return [
                        $poll->title.' | استطلاعات سوريا زون',
                        'شارك في استطلاع الرأي والتقييم المجتمعي لـ '.$poll->title.' وصوّت وشارك رأيك معنا.',
                    ];
                }
            }

            if (preg_match('#^/transit/city/([^/]+)$#', $path, $m)) {
                $city = City::find($m[1]);
                if ($city) {
                    return [
                        'مواصلات '.$city->name_ar.' | ترانزيت',
                        'خريطة خطوط المواصلات العامة والسرافيس والمواقف في '.$city->name_ar.' على ترانزيت سوريا.',
                    ];
                }
            }
        } catch (\Throwable) {
            // A missing table or a bad slug must never break the page render;
            // fall through to the generic title/description.
        }

        return [$title, $description];
    }

    private static function isNoindex(string $path): bool
    {
        $trimmed = ltrim($path, '/');
        foreach (self::NOINDEX_PREFIXES as $prefix) {
            if ($trimmed === $prefix || str_starts_with($trimmed, $prefix.'/')) {
                return true;
            }
        }

        return false;
    }

    private static function absolute(string $image, string $base): string
    {
        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        return $base.'/'.ltrim($image, '/');
    }

    /**
     * Organization + WebSite + a typed page node + (for non-root) a
     * BreadcrumbList.
     *
     * Returns a ready-to-embed JSON string (the "@context" key must not pass
     * through Blade, which would treat it as a directive).
     */
    private static function jsonLd(string $path, string $schema, string $title, string $description, string $canonical, string $base): string
    {
        $websiteId = $base.'/#website';
        $breadcrumbId = $canonical.'#breadcrumb';

        $graph = [
            [
                '@type' => 'Organization',
                '@id' => $base.'/#organization',
                'name' => config('seo.site_name'),
                'url' => $base.'/',
                'logo' => $base.'/assets/icon-512.png',
            ],
            [
                '@type' => 'WebSite',
                '@id' => $websiteId,
                'name' => config('seo.site_name'),
                'url' => $base.'/',
                'inLanguage' => 'ar',
                'publisher' => ['@id' => $base.'/#organization'],
            ],
        ];

        $page = [
            '@type' => $schema,
            '@id' => $canonical.'#webpage',
            'url' => $canonical,
            'name' => $title,
            'description' => $description,
            'inLanguage' => 'ar',
            'isPartOf' => ['@id' => $websiteId],
        ];

        if ($schema === 'Article') {
            $page['headline'] = $title;
            $page['publisher'] = ['@id' => $base.'/#organization'];
        }

        if ($path !== '/') {
            $page['breadcrumb'] = ['@id' => $breadcrumbId];
            $graph[] = $page;
            $graph[] = [
                '@type' => 'BreadcrumbList',
                '@id' => $breadcrumbId,
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'الرئيسية', 'item' => $base.'/'],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => $title, 'item' => $canonical],
                ],
            ];
        } else {
            $graph[] = $page;
        }

        return (string) json_encode(
            ['@context' => 'https://schema.org', '@graph' => $graph],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        );
    }
}