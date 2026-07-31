// @ef/shell — infra partagée : layout/shell, nav, providers, login, proxy, theme.
export { AppShellLayout } from './app-shell-layout';
export { MasterShell, type MasterShellProps } from './master-shell';
export { useModuleNav } from './use-module-nav';
// Etats transverses (maquette ecran 9) : reutilisables par tout module.
export {
  StaleDataBanner,
  StaleDataRegion,
  type StaleDataBannerProps,
} from './stale-data-banner';
export { DashboardSkeleton } from './dashboard-skeleton';
export { ModuleNav } from './nav-config';
export { Providers } from './providers';
export { LoginForm } from './login-form';
export { AuthPage, type AuthPageProps } from './auth-page';
export { ThemeToggle } from './theme-toggle';
export { proxyMiddleware } from './proxy';
// Le preset Tailwind est exposé en sous-chemin dédié '@ef/shell/tailwind-preset'
// (import depuis tailwind.config.ts, contexte Node — pas via ce barrel).
