import { PartnerDetail } from '../components/partner-detail';

// Corps de la page /partenaires/[slug]. Next 16 : params est asynchrone.
export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PartnerDetail slug={slug} />;
}
