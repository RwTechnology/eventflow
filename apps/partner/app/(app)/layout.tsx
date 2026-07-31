import { PartnerShell } from '@ef/shell';
import { registry } from '../../registry';
import modulesJson from '../../modules.json';

// (app)/layout.tsx — écrit à la main : monte la coquille de la Console
// Partenaire avec le registry de modules (P8). La nav en dérive.
// Organisation et profil : jeu fictif du prototype, ils viendront de l'API
// avec la session (CdC §9.4).
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PartnerShell
      brand={modulesJson.brand}
      modules={registry}
      organization={{ name: 'Collectif Nuits Nantaises', plan: 'Free' }}
      user={{ name: 'Marc Guibert', role: 'Propriétaire' }}
    >
      {children}
    </PartnerShell>
  );
}
