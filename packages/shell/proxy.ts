import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// proxyMiddleware — fonction de proxy (ex-middleware) partagée par toutes les
// apps (P15). Next 16 : runtime nodejs, edge non supporté. Les apps réexportent
// cette fonction dans leur proxy.ts, avec un `export const config` littéral
// inline (Next le parse statiquement — ne pas l'importer).
//
// Stub d'infra : laisse passer les requêtes. La vraie logique auth (vérif de
// session, redirection vers /login) se branche ici quand un module à backend
// est embarqué.
export function proxyMiddleware(_request: NextRequest) {
  return NextResponse.next();
}
