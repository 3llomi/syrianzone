import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { MuslimIcon } from '@/Components/Icons/ProjectIcons';
import MuslimShell from '../_components/MuslimShell';
import PrayerView from '../_components/PrayerView';
import { useMuslimPrefs } from '../_lib/prefs';

export default function Index() {
  const { prefs, setPrefs, isLoggedIn } = useMuslimPrefs();

  return (
    <MainLayout>
      <Head>
        <title>مواقيت الصلاة | الركن الإسلامي | Syrian Zone</title>
        <meta
          name="description"
          content="مواقيت الصلاة حسب مدينتك وطريقة الحساب، مع التقويم الهجري وسجل الصلوات — يعمل دون اتصال."
        />
        <meta property="og:title" content="مواقيت الصلاة | الركن الإسلامي | Syrian Zone" />
        <meta
          property="og:description"
          content="مواقيت الصلاة حسب مدينتك وطريقة الحساب، مع التقويم الهجري وسجل الصلوات."
        />
      </Head>

      <MuslimShell title="مواقيت الصلاة" icon={MuslimIcon}>
        <PrayerView prefs={prefs} setPrefs={setPrefs} isLoggedIn={isLoggedIn} />
      </MuslimShell>
    </MainLayout>
  );
}
