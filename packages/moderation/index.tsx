'use client';

import * as React from 'react';

import { Flag } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// Compteur de nav : signalements en attente. Jeu fictif du prototype ; il
// viendra de l'API (CdC §9.4). Porte par le module, pas par la coquille.
const PENDING_REPORTS = 3;

function NavCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-gray-100 px-1.5 font-mono text-xs text-gray-700">
      {children}
    </span>
  );
}

// @ef/moderation — module métier « modération » de la Console Maître (CSM-3).

export const moderationModule: Module = {
  id: 'moderation',
  label: 'Modération',
  routePrefix: '/moderation',
  useNavSection: () => ({
    eyebrow: 'Contrôle',
    items: [
      {
        href: '/moderation',
        label: 'Modération',
        icon: <Flag />,
        trailing: <NavCount>{PENDING_REPORTS}</NavCount>,
      },
    ],
  }),
};

export { ModerationQueue } from './components/moderation-queue';
