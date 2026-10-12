<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

test('the about page renders with non-bot github contributors', function () {
    Cache::flush();
    Http::fake([
        'api.github.com/*' => Http::response([
            ['login' => 'hadealahmad', 'type' => 'User', 'avatar_url' => 'https://avatars.githubusercontent.com/u/1', 'html_url' => 'https://github.com/hadealahmad', 'contributions' => 10],
            ['login' => 'github-actions[bot]', 'type' => 'Bot', 'avatar_url' => 'https://avatars.githubusercontent.com/u/2', 'html_url' => 'https://github.com/apps/github-actions', 'contributions' => 1],
        ], 200),
    ]);

    $this->get('/about')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->has('contributors', 1)
            ->where('contributors.0.login', 'hadealahmad'));
});

test('the about page still renders when github is unavailable', function () {
    Cache::flush();
    Http::fake(['api.github.com/*' => Http::response('', 500)]);

    $this->get('/about')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->has('contributors', 0));
});
