import { MasterShell } from '@ef/shell';
import modulesJson from '../../modules.json';

// (app)/layout.tsx — écrit à la main : monte la coquille de la Console Maître.
// Le corps du shell vit dans @ef/shell, composé depuis le design system publié
// (RG-1). Ici on ne fait que le monter. Référence : maquette écran 1
// (backoffice/pages/shell.html?console=master).
//
// Compteurs de nav : jeu fictif du prototype (128 Organisations, 3 signalements
// en attente), cohérent avec le contenu du tableau de bord. Le backend est un
// chantier séparé (CdC §9.4) ; ces valeurs viendront de l'API le moment venu.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MasterShell brand={modulesJson.brand} partnerCount={128} moderationCount={3}>
      {children}
    </MasterShell>
  );
}
