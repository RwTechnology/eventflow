import { PlatformDashboard, type DashboardState } from '../components/platform-dashboard';

// Corps de la page `/` de la Console Maître. Monté par la route générée (P9).
// `?etat=` déclenche les états transverses de l'écran 9 (chargement, erreur),
// comme la page de login le fait déjà pour ses propres états de démonstration.
// Next 16 : searchParams est asynchrone.
export default async function PlatformPage({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string }>;
}) {
  const { etat } = await searchParams;
  const demoEtat: DashboardState | undefined =
    etat === 'chargement' || etat === 'erreur' ? etat : undefined;
  return <PlatformDashboard demoEtat={demoEtat} />;
}
