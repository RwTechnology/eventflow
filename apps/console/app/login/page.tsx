import { AuthPage } from '@ef/shell';

// login/page.tsx — écrit à la main (route infra, comme layout.tsx). Le corps de
// page vit dans le module @ef/auth ; ici on ne fait que le monter en lisant les
// paramètres de vue/état. Next 16 : searchParams est asynchrone (à await).
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: string; etat?: string }>;
}) {
  const { vue, etat } = await searchParams;
  const resolvedVue =
    vue === 'inscription' || vue === 'oubli' ? vue : 'connexion';
  const demoEtat = etat === 'erreur' || etat === 'envoye' ? etat : undefined;
  return <AuthPage vue={resolvedVue} demoEtat={demoEtat} />;
}
