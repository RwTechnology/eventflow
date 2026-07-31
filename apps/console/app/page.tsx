import { redirect } from 'next/navigation';
import { registry } from '../registry';

// page.tsx racine — écrit à la main. Les écrans de la Console Maître vivent sous
// /master-console ; la racine redirige vers le premier module du registry, donc
// vers le tableau de bord (P8). Sans module embarqué, on retombe sur /login.
export default function RootPage() {
  const first = registry[0];
  redirect(first ? first.routePrefix : '/login');
}
