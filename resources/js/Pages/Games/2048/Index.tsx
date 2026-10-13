import React from 'react';

import MainLayout from '@/Layouts/MainLayout';
import { Game2048Icon } from '@/Components/Icons/ProjectIcons';
import GameShell from '../_components/GameShell';
import Game2048, { Game2048Rules } from '../_components/Game2048';

export default function Index() {
  return (
    <MainLayout>
      

      <GameShell
        title="2048"
        icon={Game2048Icon}
        rules={<Game2048Rules />}
      >
        <Game2048 />
      </GameShell>
    </MainLayout>
  );
}
