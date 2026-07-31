'use client';

import { Flag } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/moderation — module métier « modération » de la Console Maître (CSM-3).

export const moderationModule: Module = {
  id: 'moderation',
  label: 'Modération',
  routePrefix: '/moderation',
  useNavSection: () => ({
    eyebrow: 'Contrôle',
    items: [{ href: '/moderation', label: 'Modération', icon: <Flag /> }],
  }),
};

export { ModerationQueue } from './components/moderation-queue';
