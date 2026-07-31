'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Module } from '@ef/module-kit';
import { AppShell } from '@rwtechnology/eventflow-design-system/app-shell';
import { Avatar } from '@rwtechnology/eventflow-design-system/avatar';
import { ThemeToggle } from './theme-toggle';
import { useModuleNav } from './use-module-nav';

// PartnerShell — coquille de la Console Partenaire (CdC §6.2).
// Composée à 100 % depuis le design system publié (RG-1).
// Référence maquette : backoffice/pages/shell.html (écran 1).
//
// **Le même AppShell que la Console Maître**, sans la prop `master` : la maquette
// impose une seule coquille pour les deux consoles. Ce qui distingue le
// partenaire, c'est ce que le maître n'a pas — sélecteur d'Organisation en haut
// de sidebar, profil en bas — et l'absence du liseré et du badge maître.
//
// La nav dérive du registry de modules (P8) : aucun libellé ici.

export interface PartnerShellProps {
  /** Marque affichée dans le header et la sidebar. */
  brand?: React.ReactNode;
  /** Registry de modules de l'app : l'ordre pilote l'ordre des eyebrows. */
  modules: ReadonlyArray<Module>;
  /** Organisation active : nom et plan, affichés en haut de sidebar. */
  organization?: { name: string; plan: string };
  /** Utilisateur connecté : nom et rôle, affichés en bas de sidebar. */
  user?: { name: string; role: string };
  children: React.ReactNode;
}

/** Sélecteur d'Organisation (maquette écran 1) : avatar, nom, plan. */
function OrgSwitcher({ name, plan }: { name: string; plan: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border p-2">
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
        <p className="font-mono text-xs text-text-secondary">Plan {plan}</p>
      </div>
    </div>
  );
}

/** Profil en bas de sidebar (maquette écran 1). */
function ProfileFooter({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{name}</p>
        <p className="truncate text-xs text-text-secondary">{role}</p>
      </div>
    </div>
  );
}

export function PartnerShell({
  brand = 'EventFlow',
  modules,
  organization,
  user,
  children,
}: PartnerShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sections = useModuleNav(modules);

  return (
    <AppShell
      brand={brand}
      nav={{
        sections,
        activeHref: pathname,
        onNavigate: (href) => router.push(href),
        header: organization ? (
          <OrgSwitcher name={organization.name} plan={organization.plan} />
        ) : undefined,
        footer: user ? <ProfileFooter name={user.name} role={user.role} /> : undefined,
      }}
      headerActions={<ThemeToggle />}
    >
      {children}
    </AppShell>
  );
}
