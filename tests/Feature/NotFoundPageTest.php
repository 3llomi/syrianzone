<?php

use Inertia\Testing\AssertableInertia as Assert;

test('muslim subdirectory 404 renders the muslim corner 404 variant', function () {
    $this->get('/muslim/unknown-page')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/NotFound')
            ->where('status', 404)
            ->where('path', '/muslim/unknown-page')
            ->where('section', 'muslim')
        );
});

test('games subdirectory 404 renders the games table 404 variant', function () {
    $this->get('/games/chess')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/NotFound')
            ->where('status', 404)
            ->where('path', '/games/chess')
            ->where('section', 'games')
        );
});

test('transit and mobility subdirectory 404s render the transit route 404 variant', function (string $url) {
    $this->get($url)
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/NotFound')
            ->where('status', 404)
            ->where('path', $url)
            ->where('section', 'transit')
        );
})->with([
    '/transit/unknown-route',
    '/transit/city/not-a-real-city-123',
    '/mishwar/unknown-place',
    '/crossings/unknown-border',
]);

test('general unknown paths render the digital diwan 404 variant', function () {
    $this->get('/some-non-existent-page')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Errors/NotFound')
            ->where('status', 404)
            ->where('path', '/some-non-existent-page')
            ->where('section', 'general')
        );
});
