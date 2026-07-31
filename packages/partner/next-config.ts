import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module partner au next.config de l'app qui l'embarque (P5).
// Consommé en source TS, il doit donc figurer dans transpilePackages.
// Aucune réécriture : pas de backend propre pour l'instant (CdC §9.4).
export const partnerNextConfig: ModuleNextConfig = {
  transpile: ['@ef/partner'],
  rewrites: [],
};
