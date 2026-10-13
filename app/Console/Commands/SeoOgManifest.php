<?php

namespace App\Console\Commands;

use App\Models\City;
use App\Models\Poll;
use Illuminate\Console\Command;

/**
 * Prints the records that want a per-record OpenGraph card, as JSON, for
 * scripts/generate_og.py to render.
 *
 *   php artisan seo:og-manifest | python3 scripts/generate_og.py
 *
 * Cards land in public/og/polls/<slug>.png and public/og/cities/<id>.png;
 * SeoMeta picks them up when the file exists and falls back to the section card
 * otherwise. Re-run after adding polls or transit cities.
 */
class SeoOgManifest extends Command
{
    protected $signature = 'seo:og-manifest';

    protected $description = 'Print JSON of polls and transit cities needing OG cards';

    public function handle(): int
    {
        $polls = Poll::query()
            ->orderBy('title')
            ->get(['slug', 'title'])
            ->map(fn (Poll $p) => ['slug' => $p->slug, 'title' => $p->title])
            ->all();

        $cities = City::query()
            ->orderBy('name_ar')
            ->get(['id', 'name_ar'])
            ->map(fn (City $c) => ['id' => $c->id, 'name' => $c->name_ar])
            ->all();

        $this->line((string) json_encode(
            ['polls' => $polls, 'cities' => $cities],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
        ));

        return self::SUCCESS;
    }
}
