import type { Config } from 'tailwindcss';
import { efPreset } from '@ef/shell/tailwind-preset';
import dsPreset from '@rwtechnology/eventflow-design-system/preset';

// content globs SCOPÉS aux seuls packages embarqués (P14) : le CSS de cette
// app n'inclut jamais les classes d'un module non embarqué.
// Ajouter une ligne '../../packages/<id>/**/*.{ts,tsx}' par module branché.
const config: Config = {
  presets: [dsPreset as Partial<Config>, efPreset],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/shell/**/*.{ts,tsx}',
    '../../packages/partner-dashboard/**/*.{ts,tsx}',
    '../../packages/partner-events/**/*.{ts,tsx}',
    '../../packages/partner-plan/**/*.{ts,tsx}',
    '../../node_modules/@rwtechnology/eventflow-design-system/dist/**/*.js',
  ],
};

export default config;
