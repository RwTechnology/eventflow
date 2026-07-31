// proxy.ts — middleware auth partagé depuis @ef/shell (P15).
// Next 16 : le fichier `middleware` a été renommé `proxy` ; runtime nodejs,
// edge non supporté. `export const config` DOIT rester un littéral inline —
// Next le parse statiquement. Ne pas le remplacer par un import.
export { proxyMiddleware as proxy } from '@ef/shell';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
