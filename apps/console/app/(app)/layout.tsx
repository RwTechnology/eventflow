import { MasterShell } from '@ef/shell';
import { registry } from '../../registry';
import modulesJson from '../../modules.json';

// (app)/layout.tsx — écrit à la main : monte la coquille de la Console Maître
// avec le registry de modules (P8). La nav en dérive : aucun libellé ici.
// Le corps du shell vit dans @ef/shell, composé depuis le design system (RG-1).
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MasterShell brand={modulesJson.brand} modules={registry}>
      {children}
    </MasterShell>
  );
}
