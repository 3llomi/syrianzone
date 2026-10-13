import React, { Suspense } from 'react';
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryProvider } from '@/Providers/QueryProvider';
import { DirectionProvider } from '@radix-ui/react-direction';

const appName = import.meta.env.VITE_APP_NAME || 'Syrian Zone';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        // SeoHead supplies the full title (already carrying the brand); keep the
        // callback identity so the app name is not appended twice.
        title: (title) => title || appName,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx')
            ),
        setup: ({ App, props }) => (
            <DirectionProvider dir="rtl">
                <QueryProvider>
                    <Suspense fallback={null}>
                        <App {...props} />
                    </Suspense>
                </QueryProvider>
            </DirectionProvider>
        ),
    })
);
