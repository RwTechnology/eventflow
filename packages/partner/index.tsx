'use client';

import { Building2 } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/partner — module métier « partenaires » de la Console Maître (CSM-2).
// Un module porte un domaine et sa nav ; il n'est pas réutilisable tel quel,
// contrairement à @ef/shell qui expose la coquille, l'auth et le thème (P2).

export const partnerModule: Module = {
  id: 'partner',
  label: 'Partenaires',
  routePrefix: '/partenaires',
  useNavSection: () => ({
    eyebrow: 'Plateforme',
    items: [{ href: '/partenaires', label: 'Partenaires', icon: <Building2 /> }],
  }),
};

export { PartnersList } from './components/partners-list';
export { PartnerDetail, type PartnerDetailProps } from './components/partner-detail';
export {
  SuspendOrganization,
  type SuspendOrganizationProps,
} from './components/suspend-organization';
