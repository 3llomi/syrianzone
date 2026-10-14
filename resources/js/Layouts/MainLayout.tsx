import React from 'react';
import { AuthProvider } from '@/Contexts/AuthContext';
import ConditionalLayout from '@/Components/ConditionalLayout';
import GlobalRuntime from '@/Components/GlobalRuntime';
import GlobalCommandPalette from '@/Components/GlobalCommandPalette';
import RadioMiniPlayer from '@/Components/RadioMiniPlayer';
import ConfirmHost from '@/Components/ConfirmHost';
import RouteAnnouncer from '@/Components/RouteAnnouncer';
import SeoHead from '@/Components/SeoHead';
import { Toaster } from '@/Components/ui/sonner';
import SettingsSync from '@/Pages/Muslim/_components/SettingsSync';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SeoHead />
            <ConditionalLayout>
                {children}
            </ConditionalLayout>
            <SettingsSync />
            <GlobalCommandPalette />
            <GlobalRuntime />
            <RadioMiniPlayer />
            {/* One feedback language for the whole app: toasts + confirmations. */}
            <Toaster />
            <ConfirmHost />
            <RouteAnnouncer />
        </AuthProvider>
    );
}
