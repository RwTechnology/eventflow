'use client';

import * as React from 'react';

import { Building2 } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// Compteur de nav : nombre d'Organisations. Jeu fictif du prototype ; il
// viendra de l'API avec le reste (CdC §9.4). C'est le module qui le porte,
// pas la coquille : lui seul connait la donnee.
const ORGANIZATION_COUNT = 128;

function NavCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-gray-100 px-1.5 font-mono text-xs text-gray-700">
      {children}
    </span>
  );
}

// @ef/partner — module métier « partenaires » de la Console Maître (CSM-2).
// Un module porte un domaine et sa nav ; il n'est pas réutilisable tel quel,
// contrairement à @ef/shell qui expose la coquille, l'auth et le thème (P2).

export const partnerModule: Module = {
  id: 'partner',
  label: 'Partenaires',
  routePrefix: '/partenaires',
  useNavSection: () => ({
    eyebrow: 'Plateforme',
    items: [
      {
        href: '/partenaires',
        label: 'Partenaires',
        icon: <Building2 />,
        trailing: <NavCount>{ORGANIZATION_COUNT}</NavCount>,
      },
    ],
  }),
};

export { PartnersList } from './components/partners-list';
export { PartnerDetail, type PartnerDetailProps } from './components/partner-detail';
export {
  SuspendOrganization,
  type SuspendOrganizationProps,
} from './components/suspend-organization';
