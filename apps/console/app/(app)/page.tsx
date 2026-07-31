import { PlatformDashboard } from '@ef/shell';

// (app)/page.tsx — écrit à la main : route `/` de la Console Maître.
// Le corps de page vit dans @ef/shell (MONOREPO-GUIDE P9) ; ici on ne fait que
// le monter. Exigence CdC CSM-1, maquette écran 10.
export default function PlatformPage() {
  return <PlatformDashboard />;
}
