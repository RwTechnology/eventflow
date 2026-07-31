import type { ModuleNextConfig } from '@ef/module-kit';

// Contribution du module moderation au next.config de l'app (P5).
export const moderationNextConfig: ModuleNextConfig = {
  transpile: ['@ef/moderation'],
  rewrites: [],
};
