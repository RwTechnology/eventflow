'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Flag, LayoutGrid, ScrollText } from 'lucide-react';
import { AppShell } from '@rwtechnology/eventflow-design-system/app-shell';
import type { SidebarSection } from '@rwtechnology/eventflow-design-system/sidebar';
import { ThemeToggle } from './theme-toggle';

// MasterShell — coquille de la Console Maître, composée à 100 % depuis le design
// system publié (RG-1 : aucun composant écrit dans apps/console).
// Référence maquette : backoffice/pages/shell.html?console=master (écran 1) et
// backoffice/pages/console-dashboard.html (écran 10) pour la nav et ses compteurs.
//
// L'identité maître (liseré warning 2px + badge mono) vient de la prop `master`
// d'AppShell — un seul AppShell partagé avec la console partenaire, comme le
// prescrit l'écran 1. Rien n'est restylé ici.

/** Compteur de nav (mono, discret) — le fond se renforce sur l'item actif via Sidebar. */
function NavCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-gray-100 px-1.5 font-mono text-xs text-gray-700">
      {children}
    </span>
  );
}

export interface MasterShellProps {
  /** Marque affichée dans le header et la sidebar. */
  brand?: React.ReactNode;
  /** Nombre d'Organisations, compteur de l'item Partenaires (CSM-2). */
  partnerCount?: number;
  /** Signalements en attente, compteur de l'item Modération (CSM-3). */
  moderationCount?: number;
  children: React.ReactNode;
}

export function MasterShell({
  brand = 'EventFlow',
  partnerCount,
  moderationCount,
  children,
}: MasterShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Sections de la Console Maître (maquette écran 1) : pas d'OrgSwitcher côté
  // maître, deux groupes, Plateforme puis Contrôle.
  const sections: SidebarSection[] = React.useMemo(
    () => [
      {
        eyebrow: 'Plateforme',
        items: [
          { href: '/', label: 'Plateforme', icon: <LayoutGrid /> },
          {
            href: '/partenaires',
            label: 'Partenaires',
            icon: <Building2 />,
            trailing:
              partnerCount === undefined ? undefined : <NavCount>{partnerCount}</NavCount>,
          },
        ],
      },
      {
        eyebrow: 'Contrôle',
        items: [
          {
            href: '/moderation',
            label: 'Modération',
            icon: <Flag />,
            trailing:
              moderationCount === undefined ? undefined : <NavCount>{moderationCount}</NavCount>,
          },
          { href: '/audit', label: 'Audit', icon: <ScrollText /> },
        ],
      },
    ],
    [partnerCount, moderationCount],
  );

  return (
    <AppShell
      brand={brand}
      master
      nav={{
        sections,
        activeHref: pathname,
        onNavigate: (href) => router.push(href),
      }}
      headerActions={<ThemeToggle />}
    >
      {children}
    </AppShell>
  );
}
