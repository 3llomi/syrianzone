<?php

use App\Models\Poll;
use App\Support\Seo\SeoMeta;
use Illuminate\Http\Request;

test('server-rendered html includes seo meta and json-ld even when inertia.ssr.enabled is true and ssr server is offline', function () {
    config()->set('inertia.ssr.enabled', true);
    config()->set('inertia.ssr.url', 'http://127.0.0.1:59999');

    $html = $this->get('/about')->assertOk()->getContent();

    expect($html)->toContain('<title inertia>عن المنصة | Syrian Zone</title>')
        ->and($html)->toContain('<link rel="canonical" href="https://syrian.zone/about" inertia>')
        ->and($html)->toContain('<meta property="og:image" content="https://syrian.zone/og/about.png" inertia>')
        ->and($html)->toContain('<script type="application/ld+json" inertia>');
});

test('poll show and leaderboard routes resolve distinct metadata and canonicals', function () {
    $poll = Poll::factory()->create([
        'slug' => 'governors-2026',
        'title' => 'تقييم المحافظين',
        'is_active' => true,
    ]);

    $showMeta = SeoMeta::resolve(Request::create('/polls/governors-2026', 'GET'));
    $lbMeta = SeoMeta::resolve(Request::create('/polls/governors-2026/leaderboard', 'GET'));

    expect($showMeta['title'])->toBe('تقييم المحافظين | استطلاعات سوريا زون')
        ->and($showMeta['canonical'])->toBe('https://syrian.zone/polls/governors-2026')
        ->and($showMeta['robots'])->toBe('index, follow')
        ->and($lbMeta['title'])->toBe('نتائج تقييم المحافظين | استطلاعات سوريا زون')
        ->and($lbMeta['canonical'])->toBe('https://syrian.zone/polls/governors-2026/leaderboard')
        ->and($lbMeta['robots'])->toBe('index, follow');

    // Accessing by UUID canonicalizes to the slug URL
    $uuidMeta = SeoMeta::resolve(Request::create('/polls/'.$poll->id, 'GET'));
    expect($uuidMeta['canonical'])->toBe('https://syrian.zone/polls/governors-2026');
});

test('best-ministers poll alias canonicalizes to /tierlist and /tierlist/leaderboard', function () {
    Poll::factory()->create([
        'slug' => 'best-ministers',
        'title' => 'تقييم الوزراء',
        'is_active' => true,
    ]);

    $showMeta = SeoMeta::resolve(Request::create('/polls/best-ministers', 'GET'));
    $lbMeta = SeoMeta::resolve(Request::create('/polls/best-ministers/leaderboard', 'GET'));

    expect($showMeta['canonical'])->toBe('https://syrian.zone/tierlist')
        ->and($lbMeta['canonical'])->toBe('https://syrian.zone/tierlist/leaderboard');
});

test('inactive polls and compass share pages resolve to noindex, follow', function () {
    Poll::factory()->create([
        'slug' => 'closed-poll',
        'title' => 'استطلاع منتهي',
        'is_active' => false,
    ]);

    $pollMeta = SeoMeta::resolve(Request::create('/polls/closed-poll', 'GET'));
    $compassShareMeta = SeoMeta::resolve(Request::create('/compass/s/abc123xyz', 'GET'));
    $transitAdminMeta = SeoMeta::resolve(Request::create('/transit/admin', 'GET'));

    expect($pollMeta['robots'])->toBe('noindex, follow')
        ->and($compassShareMeta['robots'])->toBe('noindex, follow')
        ->and($compassShareMeta['title'])->toContain('نتيجة مشتركة')
        ->and($transitAdminMeta['robots'])->toBe('noindex, follow');
});

test('nested routes emit 3-level BreadcrumbList in JSON-LD', function () {
    $meta = SeoMeta::resolve(Request::create('/muslim/quran', 'GET'));
    $decoded = json_decode($meta['json_ld'], true);

    $breadcrumbs = collect($decoded['@graph'])->firstWhere('@type', 'BreadcrumbList');

    expect($breadcrumbs)->not->toBeNull()
        ->and($breadcrumbs['itemListElement'])->toHaveCount(3)
        ->and($breadcrumbs['itemListElement'][0]['item'])->toBe('https://syrian.zone/')
        ->and($breadcrumbs['itemListElement'][1]['item'])->toBe('https://syrian.zone/muslim')
        ->and($breadcrumbs['itemListElement'][2]['item'])->toBe('https://syrian.zone/muslim/quran');
});

test('non-existent transit city returns 404 instead of a soft-404 200', function () {
    $this->get('/transit/city/not-a-real-city-123')->assertNotFound();
});
