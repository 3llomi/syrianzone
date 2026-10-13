import React from 'react';

import MainLayout from '@/Layouts/MainLayout';
import { TarneebIcon } from '@/Components/Icons/ProjectIcons';
import GameShell from '../_components/GameShell';
import Tarneeb, { TarneebRules } from '../_components/Tarneeb';

export default function Index() {
  return (
    <MainLayout>
      

      <GameShell
        title="طرنيب"
        icon={TarneebIcon}
        width="max-w-4xl"
        rules={<TarneebRules />}
        fit
      >
        <Tarneeb />
      </GameShell>
    </MainLayout>
  );
}
