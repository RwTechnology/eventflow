import type { Config } from 'tailwindcss';
import { efPreset } from '@ef/shell/tailwind-preset';
import dsPreset from '@rwtechnology/eventflow-design-system/preset';

// Deux presets fusionnés :
//  - dsPreset : le pont couleur du design system publié (classes primary/surface-
//    page/text-primary/accent… adossées aux tokens --ef-*). Requis par la page
//    d'auth composée à partir des composants @rwtechnology.
//  - efPreset : preset infra local historique (bg-brand/bg-surface/…) encore
//    utilisé par app-shell-layout et l'ancien LoginForm — conservé pour ne pas
//    casser ces écrans (branchement auth non destructif).
//
// content globs SCOPÉS aux seuls packages embarqués (P14) + le dist du design
// system (ses classes utilitaires doivent être générées par Tailwind).
const config: Config = {
  presets: [dsPreset as Partial<Config>, efPreset],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/shell/**/*.{ts,tsx}',
    '../../packages/partner/**/*.{ts,tsx}',
    '../../packages/platform/**/*.{ts,tsx}',
    '../../packages/moderation/**/*.{ts,tsx}',
    '../../packages/audit/**/*.{ts,tsx}',
    '../../node_modules/@rwtechnology/eventflow-design-system/dist/**/*.js',
  ],
};

export default config;
