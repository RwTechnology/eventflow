import { MasterShell } from '@ef/shell';
import modulesJson from '../../modules.json';

// (app)/layout.tsx — écrit à la main : monte la coquille de la Console Maître.
// Le corps du shell vit dans @ef/shell, composé depuis le design system publié
// (RG-1). Ici on ne fait que le monter. Référence : maquette écran 1
// (backoffice/pages/shell.html?console=master).
//
// Les compteurs de nav ne sont pas câblés : ils viendront de l'API (CSM-2/CSM-3),
// hors périmètre de ce lot. Sans valeur, les items s'affichent sans compteur.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MasterShell brand={modulesJson.brand}>{children}</MasterShell>;
}
