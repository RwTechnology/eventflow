// @ef/shell — infra partagée : layout/shell, nav, providers, login, proxy, theme.
export { AppShellLayout } from './app-shell-layout';
export { MasterShell, type MasterShellProps } from './master-shell';
export { PlatformDashboard } from './platform-dashboard';
export { PartnersList } from './partners-list';
export { PartnerDetail, type PartnerDetailProps } from './partner-detail';
export { SuspendOrganization, type SuspendOrganizationProps } from './suspend-organization';
export { ModuleNav } from './nav-config';
export { Providers } from './providers';
export { LoginForm } from './login-form';
export { AuthPage, type AuthPageProps } from './auth-page';
export { ThemeToggle } from './theme-toggle';
export { proxyMiddleware } from './proxy';
// Le preset Tailwind est exposé en sous-chemin dédié '@ef/shell/tailwind-preset'
// (import depuis tailwind.config.ts, contexte Node — pas via ce barrel).
