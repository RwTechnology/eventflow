// Config ESLint flat unique (racine), partagée par tout le repo (§4.6).
// Next 16 : @next/eslint-plugin-next / eslint-config-next exportent nativement
// un tableau flat config — on le spread directement (pas de FlatCompat).
import next from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/out/**',
      // Fichiers de routes générés (bannière GENERATED) — ne pas linter.
      'apps/*/app/**/(app)/**/page.tsx',
    ],
  },
  ...next,
  {
    // plopfile.mjs : l'API plop attend un export default de fonction anonyme.
    files: ['plopfile.mjs'],
    rules: { 'import/no-anonymous-default-export': 'off' },
  },
];

export default eslintConfig;
