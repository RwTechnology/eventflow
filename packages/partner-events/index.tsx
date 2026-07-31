'use client';

import { CalendarDays } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/partner-events — liste des événements de la Console Partenaire (PTN-3).

export const partnerEventsModule: Module = {
  id: 'partner-events',
  label: 'Événements',
  routePrefix: '/partner-console/evenements',
  useNavSection: () => ({
    eyebrow: 'Général',
    items: [
      {
        href: '/partner-console/evenements',
        label: 'Événements',
        icon: <CalendarDays />,
      },
    ],
  }),
};

export { EventsList } from './components/events-list';
