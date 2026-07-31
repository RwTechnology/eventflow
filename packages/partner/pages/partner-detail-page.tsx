import { PartnerDetail } from '../components/partner-detail';

// Corps de la page /master-console/partenaires/[slug]. Next 16 : params et
// searchParams sont asynchrones. `?etat=suspendu` bascule la zone sensible sur
// la réactivation, comme le login et le tableau de bord le font pour leurs
// propres états de démonstration.
export default async function PartnerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ etat?: string }>;
}) {
  const { slug } = await params;
  const { etat } = await searchParams;
  return (
    <PartnerDetail slug={slug} demoEtat={etat === 'suspendu' ? 'suspendu' : undefined} />
  );
}
