import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module partner-dashboard au next.config de l'app (P5).
export const partnerDashboardNextConfig: ModuleNextConfig = {
  transpile: ['@ef/partner-dashboard'],
  rewrites: [],
};
