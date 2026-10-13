<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | These options configure the Inertia Server Side Rendering (SSR) system.
    | You may specify if SSR is enabled, the URL of the SSR server, and the
    | path to the bundle that should be executed by Node.
    |
    */

    'ssr' => [

        // On by default: the SSR server is part of the stack (docker/s6/inertia-ssr-run
        // in production, `bun run dev` locally). Inertia falls back to client-side
        // rendering automatically when the bundle is missing or the server is down
        // (HttpGateway::dispatch returns null), so a failure degrades rather than
        // 500s. Set INERTIA_SSR_ENABLED=false to force it off.
        'enabled' => env('INERTIA_SSR_ENABLED', true),

        'url' => 'http://127.0.0.1:13714',

        // 'bundle' => base_path('bootstrap/ssr/ssr.js'),

    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    | These values define where Inertia page components live and which file
    | extensions the view finder accepts.
    |
    */

    'pages' => [

        'ensure_pages_exist' => false,

        'paths' => [

            resource_path('js/Pages'),

        ],

        'extensions' => [

            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',

        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    |
    | Inertia assertions verify that rendered page components exist on disk.
    |
    */

    'testing' => [

        'ensure_pages_exist' => true,

    ],

];
