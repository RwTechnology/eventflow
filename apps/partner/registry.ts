import type { Module } from '@ef/module-kit';
import { partnerDashboardModule } from '@ef/partner-dashboard';
import { partnerEventsModule } from '@ef/partner-events';
import { partnerPlanModule } from '@ef/partner-plan';

// registry.ts — ordre des sections de nav (client) (P8).
// L'ordre du tableau = ordre des eyebrows ; systemModule en dernier (P13).
// Édité par `npm run gen:register` / `gen:unregister` — ne pas éditer à la main.
export const registry: Module[] = [
  partnerDashboardModule,
  partnerEventsModule,
  partnerPlanModule,
];
