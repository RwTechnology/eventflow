'use client';

import * as React from 'react';

import { Flag } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// Compteur de nav : signalements en attente. Jeu fictif du prototype ; il
// viendra de l'API (CdC §9.4). Porte par le module, pas par la coquille.
const PENDING_REPORTS = 3;

function NavCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-surface-raised px-1.5 font-mono text-xs text-text-secondary">
      {children}
    </span>
  );
}

// @ef/moderation — module métier « modération » de la Console Maître (CSM-3).

export const moderationModule: Module = {
  id: 'moderation',
  label: 'Modération',
  routePrefix: '/master-console/moderation',
  useNavSection: () => ({
    eyebrow: 'Contrôle',
    items: [
      {
        href: '/master-console/moderation',
        label: 'Modération',
        icon: <Flag />,
        trailing: <NavCount>{PENDING_REPORTS}</NavCount>,
      },
    ],
  }),
};

export { ModerationQueue } from './components/moderation-queue';
