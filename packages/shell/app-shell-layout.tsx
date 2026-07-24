'use client';

import type { Module } from '@ef/module-kit';
import { ModuleNav } from './nav-config';
import { ThemeToggle } from './theme-toggle';

// AppShellLayout — la coquille visuelle partagée : header (brand + theme) +
// nav dérivée du registry (P8) + zone de contenu. Monté par (app)/layout.tsx.
export function AppShellLayout({
  brand,
  modules,
  children,
}: {
  brand: string;
  modules: Module[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-black">
      <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <span className="font-semibold text-brand">{brand}</span>
        <ThemeToggle />
      </header>
      <div className="flex flex-1">
        <aside className="w-60 border-r border-surface-border bg-surface-muted">
          <ModuleNav modules={modules} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
