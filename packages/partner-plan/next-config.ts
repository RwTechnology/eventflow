import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module partner-plan au next.config de l'app (P5).
export const partnerPlanNextConfig: ModuleNextConfig = {
  transpile: ['@ef/partner-plan'],
  rewrites: [],
};
