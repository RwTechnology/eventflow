'use client';

import type { Module, NavSection } from '@ef/module-kit';
import type { SidebarSection } from '@rwtechnology/eventflow-design-system/sidebar';

// useModuleNav — derive la nav de la coquille depuis le registry de modules (P8).
// Chaque module declare sa section via `useNavSection` ; le shell ne connait
// aucun libelle en dur.
//
// Deux modules peuvent partager un eyebrow : la Console Maitre range Plateforme
// et Partenaires sous « Plateforme », Moderation et Audit sous « Controle »
// (maquette ecran 1). Les sections de meme eyebrow sont donc fusionnees, dans
// l'ordre du registry.
//
// Rules of Hooks : `useNavSection` est un hook, appele une fois par module dans
// l'ordre du tableau. Le registry est statique, donc l'ordre et la longueur ne
// changent jamais entre deux rendus.

export function useModuleNav(modules: ReadonlyArray<Module>): SidebarSection[] {
  const sections: NavSection[] = modules.map((m) => m.useNavSection());

  const merged: SidebarSection[] = [];
  for (const section of sections) {
    const existing = merged.find((s) => s.eyebrow === section.eyebrow);
    if (existing) {
      existing.items = [...existing.items, ...section.items];
    } else {
      merged.push({ eyebrow: section.eyebrow, items: [...section.items] });
    }
  }
  return merged;
}
