import type { AuthProviderDescriptor } from '@ef/module-kit';
import type { NextAuthOptions } from 'next-auth';

// buildAuthOptions — compose les options NextAuth à partir des SEULS
// descripteurs des modules embarqués par l'app (P12). Chaque module à backend
// exporte son <camel>AuthDescriptor ; l'app les liste dans auth-options.ts.
export function buildAuthOptions(
  descriptors: AuthProviderDescriptor[],
): NextAuthOptions {
  const providers = descriptors.flatMap(
    (d) => (d.providers ?? []) as NextAuthOptions['providers'],
  );

  return {
    providers,
    session: { strategy: 'jwt' },
    // Les callbacks des descripteurs pourraient être fusionnés ici. Socle : vide.
  };
}
