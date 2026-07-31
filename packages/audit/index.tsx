'use client';

import { ScrollText } from 'lucide-react';
import type { Module } from '@ef/module-kit';

// @ef/audit — module métier « journal d'audit » de la Console Maître (CSM-4).

export const auditModule: Module = {
  id: 'audit',
  label: 'Audit',
  routePrefix: '/audit',
  useNavSection: () => ({
    eyebrow: 'Contrôle',
    items: [{ href: '/audit', label: 'Audit', icon: <ScrollText /> }],
  }),
};

export { AuditJournal } from './components/audit-journal';
