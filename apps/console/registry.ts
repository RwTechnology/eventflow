import type { Module } from '@ef/module-kit';
import { platformModule } from '@ef/platform';
import { partnerModule } from '@ef/partner';

// registry.ts — ordre des sections de nav (client) (P8).
// L'ordre du tableau = ordre des eyebrows ; systemModule en dernier (P13).
// Édité par `npm run gen:register` / `gen:unregister` — ne pas éditer à la main.
export const registry: Module[] = [
  platformModule,
  partnerModule,
];
