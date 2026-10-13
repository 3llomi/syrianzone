import React from 'react';

import MainLayout from '@/Layouts/MainLayout';
import { SolitaireIcon } from '@/Components/Icons/ProjectIcons';
import GameShell from '../_components/GameShell';
import Solitaire, { SolitaireRules } from '../_components/Solitaire';

export default function Index() {
  return (
    <MainLayout>
      

      <GameShell
        title="سوليتير"
        icon={SolitaireIcon}
        width="max-w-6xl"
        rules={<SolitaireRules />}
      >
        <Solitaire />
      </GameShell>
    </MainLayout>
  );
}
