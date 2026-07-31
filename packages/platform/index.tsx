'use client';

import { LayoutGrid } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/platform — module métier « tableau de bord plateforme » de la Console
// Maître (CSM-1). Domaine, pas infrastructure : il n'est pas réutilisable tel
// quel, contrairement à @ef/shell (P2).

export const platformModule: Module = {
  id: 'platform',
  label: 'Plateforme',
  routePrefix: '/master-console',
  useNavSection: () => ({
    eyebrow: 'Plateforme',
    items: [{ href: '/master-console', label: 'Plateforme', icon: <LayoutGrid /> }],
  }),
};

export {
  PlatformDashboard,
  type PlatformDashboardProps,
  type DashboardState,
} from './components/platform-dashboard';
