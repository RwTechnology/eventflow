import path from 'node:path';
import type { NextConfig } from 'next';
import type { ModuleNextConfig } from '@ef/module-kit';

// Chaque module à backend contribue son <camel>NextConfig ici (P5/P11).
// Aucun module embarqué actuellement.
const moduleConfigs: ModuleNextConfig[] = [];

// Packages internes toujours transpilés (infra) + modules embarqués (P5).
// La liste blanche IP réelle reste le package.json de l'app (P3).
const SHARED_INTERNAL_PACKAGES = [
  '@ef/shell',
  '@ef/auth',
  '@ef/module-kit',
];

const nextConfig: NextConfig = {
  output: 'standalone', // P11
  // Trace les imports depuis la racine du workspace : seuls les fichiers
  // atteints entrent dans .next/standalone. Un package non importé ne peut
  // pas apparaître dans le bundle (frontière IP).
  outputFileTracingRoot: path.join(__dirname, '..', '..'),
  transpilePackages: [
    ...SHARED_INTERNAL_PACKAGES,
    ...moduleConfigs.flatMap((c) => c.transpile),
  ], // P5
  async rewrites() {
    return moduleConfigs.flatMap((c) => c.rewrites);
  },
};

export default nextConfig;
