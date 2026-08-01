'use client';

import { CreditCard } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/partner-plan — page Plan & limites de la Console Partenaire (PTN-12).

export const partnerPlanModule: Module = {
  id: 'partner-plan',
  label: 'Plan & limites',
  routePrefix: '/partner-console/plan',
  useNavSection: () => ({
    eyebrow: 'Général',
    items: [
      { href: '/partner-console/plan', label: 'Plan & limites', icon: <CreditCard /> },
    ],
  }),
};

export { PlanPage } from './components/plan-page';
