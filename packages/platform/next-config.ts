import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module platform au next.config de l'app (P5).
// Consommé en source TS, il doit figurer dans transpilePackages.
// Aucune réécriture : pas de backend propre pour l'instant (CdC §9.4).
export const platformNextConfig: ModuleNextConfig = {
  transpile: ['@ef/platform'],
  rewrites: [],
};
