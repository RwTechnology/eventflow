import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module partner-events au next.config de l'app (P5).
export const partnerEventsNextConfig: ModuleNextConfig = {
  transpile: ['@ef/partner-events'],
  rewrites: [],
};
