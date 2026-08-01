import { EventDetail } from '../components/event-detail';

// Corps de la page /partner-console/evenements/[id]. Next 16 : params et
// searchParams sont asynchrones. `?onglet=` porte l'onglet actif, pour qu'un
// lien vers les réservations reste partageable.
export default async function EventDetailPage({
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet } = await searchParams;
  return <EventDetail tab={onglet} />;
}
