import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module audit au next.config de l'app (P5).
export const auditNextConfig: ModuleNextConfig = {
  transpile: ['@ef/audit'],
  rewrites: [],
};
