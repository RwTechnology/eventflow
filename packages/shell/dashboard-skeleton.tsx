import { Card } from '@rwtechnology/eventflow-design-system/card';
import { Skeleton } from '@rwtechnology/eventflow-design-system/skeleton';

// DashboardSkeleton — gabarit de chargement du tableau de bord (maquette ecran 9,
// etat 3). Compose a 100 % depuis le design system (RG-1).
//
// Regle de la maquette : le squelette reproduit la **geometrie reelle** de la
// page. Meme grille de tuiles, meme hauteur de graphe, memes lignes de liste :
// la page ne saute pas a l'arrivee des donnees.
//
// `aria-busy` porte sur la zone entiere. La pulsation vient du token
// `animate-skeleton` ; sous reduced-motion elle tombe a une opacite fixe.

/** Tuile de metrique au repos : libelle, valeur, delta. */
function StatCardSkeleton() {
  return (
    <Card className="px-5 py-4">
      <Skeleton shape="text" className="h-3 w-32" />
      <Skeleton shape="text" className="mt-3 h-8 w-24" />
      <Skeleton shape="text" className="mt-2 h-3 w-28" />
    </Card>
  );
}

/** Ligne de liste : pastille, deux lignes de texte, valeur a droite. */
function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0">
      <Skeleton shape="circle" className="h-7 w-7 shrink-0" />
      <div className="min-w-0 flex-1">
        <Skeleton shape="text" className="h-3.5 w-48" />
        <Skeleton shape="text" className="mt-1.5 h-3 w-32" />
      </div>
      <Skeleton shape="text" className="h-3 w-12 shrink-0" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement du tableau de bord</span>

      <div>
        <Skeleton shape="text" className="h-8 w-56" />
        <Skeleton shape="text" className="mt-2 h-3.5 w-80" />
      </div>

      {/* 4 tuiles, meme grille que le tableau de bord reel */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Graphe a gauche, panneaux a droite : meme repartition qu'a l'arrivee */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Skeleton shape="text" className="h-4 w-40" />
            <Skeleton shape="text" className="h-3 w-32" />
          </div>
          <div className="px-5 py-4">
            <Skeleton shape="block" className="h-chart w-full" />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          {[0, 1].map((card) => (
            <Card key={card}>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Skeleton shape="text" className="h-4 w-32" />
                <Skeleton shape="text" className="h-3 w-16" />
              </div>
              <div>
                {[0, 1, 2].map((row) => (
                  <ListRowSkeleton key={row} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
