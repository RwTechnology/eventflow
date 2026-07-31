// @ef/module-kit — types partagés du contrat de module (infra).
// Aucune dépendance runtime : uniquement des types + helpers légers.
import type { ReactNode } from 'react';

// --- Navigation ---------------------------------------------------------
export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  /**
   * Contenu affiché en fin de ligne : compteur, badge. Le module le fournit
   * lui-même, c'est lui qui connaît la donnée (ex. signalements en attente).
   */
  trailing?: ReactNode;
}

export interface NavSection {
  /** Libellé de section (eyebrow) affiché dans la nav. */
  eyebrow: string;
  items: NavItem[];
}

// --- Module -------------------------------------------------------------
/**
 * Contrat d'un module produit. Exporté par chaque packages/<id>/index.tsx
 * sous le nom `<camel>Module` (P8/P19).
 */
export interface Module {
  /** id kebab-case, unique. */
  id: string;
  /** libellé affiché. */
  label: string;
  /** préfixe de route, ex. "/sandbox". */
  routePrefix: string;
  /** hook client renvoyant la section de nav du module. */
  useNavSection: () => NavSection;
}

// --- Auth ---------------------------------------------------------------
/**
 * Descripteur auth d'un module à backend propre (P12). Assemblé côté app via
 * @ef/auth.buildAuthOptions([...descriptors]).
 */
export interface AuthProviderDescriptor {
  id: string;
  // Providers NextAuth contribués par le module (typés `unknown` ici pour
  // éviter que module-kit dépende de next-auth ; @ef/auth affine).
  providers: unknown[];
  callbacks?: Record<string, unknown>;
}

// --- Next config contribué par un module -------------------------------
export interface ModuleRewrite {
  source: string;
  destination: string;
}

/**
 * Contribution d'un module au next.config.ts de l'app : <camel>NextConfig
 * (P5/P11). `transpile` = packages à transpiler ; `rewrites` = proxies mergés.
 */
export interface ModuleNextConfig {
  transpile: string[];
  rewrites: ModuleRewrite[];
}
