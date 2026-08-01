import { EventCreate } from '../components/event-create';

// Corps de la page /partner-console/evenements/nouveau. Next 16 : searchParams
// est asynchrone. `?etape=` porte l'étape courante, pour que l'avancement
// reste partageable et rechargeable.
export default async function EventCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ etape?: string }>;
}) {
  const { etape } = await searchParams;
  return <EventCreate step={etape} />;
}
