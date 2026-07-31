import { PartnerDetail } from '@ef/shell';

// (app)/partenaires/[slug]/page.tsx — écrit à la main : fiche Organisation de la
// Console Maître. Le corps de page vit dans @ef/shell (MONOREPO-GUIDE P9).
// Exigence CdC CSM-2, maquette écran 11 (vue fiche).
// Next 16 : params est asynchrone (à await).
export default async function PartenaireDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PartnerDetail slug={slug} />;
}
