import React from 'react';

import MainLayout from '@/Layouts/MainLayout';
import { TrixIcon } from '@/Components/Icons/ProjectIcons';
import GameShell from '../_components/GameShell';
import Trix, { TrixRules } from '../_components/Trix';

export default function Index() {
  return (
    <MainLayout>
      

      <GameShell
        title="تركس"
        icon={TrixIcon}
        width="max-w-4xl"
        rules={<TrixRules />}
        fit
      >
        <Trix />
      </GameShell>
    </MainLayout>
  );
}
