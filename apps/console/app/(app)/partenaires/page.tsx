import { PartnersList } from '@ef/shell';

// (app)/partenaires/page.tsx — écrit à la main : route /partenaires de la
// Console Maître. Le corps de page vit dans @ef/shell (MONOREPO-GUIDE P9).
// Exigence CdC CSM-2, maquette écran 11 (vue liste).
export default function PartenairesPage() {
  return <PartnersList />;
}
