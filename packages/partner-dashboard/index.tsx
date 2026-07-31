'use client';

import { LayoutDashboard } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/partner-dashboard — tableau de bord de la Console Partenaire (CdC PTN-1).

export const partnerDashboardModule: Module = {
  id: 'partner-dashboard',
  label: 'Tableau de bord',
  routePrefix: '/partner-console',
  useNavSection: () => ({
    eyebrow: 'Général',
    items: [
      { href: '/partner-console', label: 'Tableau de bord', icon: <LayoutDashboard /> },
    ],
  }),
};

export { PartnerDashboard } from './components/partner-dashboard';
