<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AboutController extends Controller
{
    /** The repository whose contributors the About page credits. */
    private const REPO = 'syrianzone/syrianzone';

    public function index()
    {
        return Inertia::render('About', [
            'contributors' => $this->contributors(),
        ]);
    }

    /**
     * The repo's contributors, minus bots.
     *
     * Cached for an hour: the list changes slowly and the unauthenticated
     * GitHub API allows only 60 calls an hour, so one call serves every visit.
     * Any failure (offline, rate limited) yields an empty list and the page
     * simply omits the section.
     */
    private function contributors(): array
    {
        return Cache::remember('github:contributors:'.self::REPO, 3600, function () {
            try {
                $response = Http::withHeaders([
                    'Accept' => 'application/vnd.github+json',
                    'User-Agent' => 'syrianzone',
                ])->timeout(8)->get('https://api.github.com/repos/'.self::REPO.'/contributors', [
                    'per_page' => 100,
                    'anon' => 0,
                ]);

                if (! $response->ok()) {
                    return [];
                }

                return collect($response->json())
                    ->filter(fn ($c) => ($c['type'] ?? 'User') === 'User'
                        && ! str_ends_with($c['login'] ?? '', '[bot]'))
                    ->map(fn ($c) => [
                        'login' => $c['login'],
                        'avatar' => $c['avatar_url'],
                        'url' => $c['html_url'],
                        'contributions' => $c['contributions'] ?? 0,
                    ])
                    ->values()
                    ->all();
            } catch (\Throwable $e) {
                Log::warning('GitHub contributors fetch failed', ['error' => $e->getMessage()]);

                return [];
            }
        });
    }
}
