import { buildAuthOptions } from '@ef/auth';

// auth-options.ts (serveur) — compose NextAuth depuis les descripteurs des
// seuls modules embarqués (P12). Aucun module à backend → liste vide.
export const authOptions = buildAuthOptions([]);
