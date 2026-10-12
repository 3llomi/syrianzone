import React from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { QuranRadioIcon } from '@/Components/Icons/ProjectIcons';
import MuslimShell from '../_components/MuslimShell';
import RadioView from '../_components/RadioView';
import { useMuslimNav } from '../_lib/nav';

export default function Index() {
  const setTargetAyah = useMuslimNav((s) => s.setTargetAyah);

  // Continue in the reader: the player is global, so it keeps playing; we just
  // hand the reader the ayah being recited and open its route.
  const continueToReader = (surah: number, ayah: number) => {
    setTargetAyah(`${surah}:${ayah}`);
    router.visit('/muslim/quran');
  };

  return (
    <MainLayout>
      <Head>
        <title>إذاعة القرآن | الركن الإسلامي | Syrian Zone</title>
        <meta
          name="description"
          content="تلاوة متابَعة للقرآن كاملاً: الاستماع المستمر مع النص والكلمة المُتلوّة، ومؤقّت نوم."
        />
        <meta property="og:title" content="إذاعة القرآن | الركن الإسلامي | Syrian Zone" />
        <meta
          property="og:description"
          content="تلاوة متابَعة للقرآن كاملاً مع النص والكلمة المُتلوّة، ومؤقّت نوم."
        />
      </Head>

      <MuslimShell title="إذاعة القرآن" icon={QuranRadioIcon}>
        <RadioView onContinue={continueToReader} />
      </MuslimShell>
    </MainLayout>
  );
}
