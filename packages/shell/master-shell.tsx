'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Module } from '@ef/module-kit';
import { AppShell } from '@rwtechnology/eventflow-design-system/app-shell';
import { ImpersonationBanner } from './impersonation-banner';
import { ThemeToggle } from './theme-toggle';
import { useModuleNav } from './use-module-nav';

// MasterShell — coquille de la Console Maître, composée à 100 % depuis le design
// system publié (RG-1 : aucun composant écrit dans apps/console).
// Référence maquette : backoffice/pages/shell.html?console=master (écran 1).
//
// La nav est dérivée du registry de modules (P8) : le shell ne connaît aucun
// libellé ni aucune route. Ajouter un module à `modules.json` suffit à le faire
// apparaître dans la nav, sans toucher à ce fichier.
//
// L'identité maître (liseré warning 2px + badge mono) vient de la prop `master`
// d'AppShell — un seul AppShell partagé avec la console partenaire, comme le
// prescrit l'écran 1. Rien n'est restylé ici.

export interface MasterShellProps {
  /** Marque affichée dans le header et la sidebar. */
  brand?: React.ReactNode;
  /** Registry de modules de l'app : l'ordre pilote l'ordre des eyebrows. */
  modules: ReadonlyArray<Module>;
  children: React.ReactNode;
}

/**
 * Lit `?en-tant-que` et rend le bandeau (CSM-5). Isolé dans son propre composant
 * parce que `useSearchParams` bloque le prérendu statique de toute la page qui
 * l'appelle : sous Suspense, seul ce fragment devient dynamique, les 5 routes
 * restent statiques.
 */
function ImpersonationSlot() {
  const router = useRouter();
  const organization = useSearchParams().get('en-tant-que');
  if (!organization) return null;
  return (
    <ImpersonationBanner
      organization={organization}
      onExit={() => router.push('/master-console/partenaires')}
    />
  );
}

export function MasterShell({ brand = 'EventFlow', modules, children }: MasterShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sections = useModuleNav(modules);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Au-dessus de tout, lisere maître compris : un contexte emprunté ne doit
          jamais être confondable. */}
      <React.Suspense fallback={null}>
        <ImpersonationSlot />
      </React.Suspense>

      <AppShell
        brand={brand}
        master
        className="flex-1"
        nav={{
          sections,
          activeHref: pathname,
          onNavigate: (href) => router.push(href),
        }}
        headerActions={<ThemeToggle />}
      >
        {children}
      </AppShell>
    </div>
  );
}
