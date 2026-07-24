'use client';

import { AppShellLayout } from '@ef/shell';
import { registry } from '../../registry';
import modulesJson from '../../modules.json';

// (app)/layout.tsx — écrit à la main : monte AppShellLayout avec le registry
// (P8). Toutes les pages sous ce groupe partagent la nav.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShellLayout brand={modulesJson.brand} modules={registry}>
      {children}
    </AppShellLayout>
  );
}
