import { Check, Info, Minus } from 'lucide-react';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@rwtechnology/eventflow-design-system/card';
import { PlanMeter } from '@rwtechnology/eventflow-design-system/plan-meter';

// PlanPage — plan courant, consommation et comparatif (CdC PTN-12).
// Composée à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/plan.html (écran 7) ; limites = CdC §4.4.
//
// Deux principes de la maquette, tenus ici :
//   - chaque jauge dit QUOI, OÙ ON EN EST et QUAND ça se débloque ;
//   - le gating s'explique, il ne s'excuse pas — d'où l'encart de principe.
//
// Aucune promesse chiffrée sur Pro et Business : la tarification arrive en v1.1
// (CdC §4.4). « Me prévenir » est désactivé, pas un formulaire déguisé.

const USAGE = [
  {
    label: 'Événements actifs',
    used: 2,
    limit: 2,
    note: 'Limite atteinte — un emplacement se libérera le 14 août au soir.',
  },
  {
    // La limite du plan porte sur les réservations comptées par événement, pas
    // sur la capacité de la salle : « Nuit électro » a atteint son plafond.
    label: 'Réservations / événement',
    used: 50,
    limit: 50,
    note: '« Nuit électro » a atteint son plafond de 50 réservations comptées.',
  },
  {
    label: 'Agents de contrôle / événement',
    used: 1,
    limit: 1,
    note: 'Léa Bernard couvre « Nuit électro ».',
  },
];

/** Comparatif des 3 plans, repris ligne à ligne du CdC §4.4. */
const COMPARISON: { capability: string; free: string; pro: string; business: string }[] = [
  { capability: 'Événements actifs simultanés', free: '2', pro: 'Illimités', business: 'Illimités' },
  { capability: 'Réservations par événement', free: '50', pro: 'Illimitées', business: 'Illimitées' },
  { capability: 'Agents de contrôle par événement', free: '1', pro: '5', business: 'Illimités' },
  { capability: 'Statistiques', free: 'Essentielles', pro: 'Complètes', business: 'Complètes' },
  { capability: 'Export CSV des participants', free: '—', pro: 'Oui', business: 'Oui' },
  { capability: 'E-mail de rappel J-1', free: '—', pro: 'Oui', business: 'Oui' },
  { capability: 'Branding personnalisé (page événement)', free: '—', pro: '—', business: 'Oui' },
  { capability: 'Membres d’équipe multiples', free: '—', pro: '—', business: 'Oui (v2)' },
  { capability: 'Prix', free: '0 €', pro: 'bientôt disponible', business: 'bientôt disponible' },
];

/** Cellule du comparatif : coche verte, tiret gris, ou valeur en tabulaire. */
function Cell({ value }: { value: string }) {
  if (value === 'Oui') {
    return (
      <span className="flex items-center gap-1 text-success">
        <Check className="h-icon-sm w-icon-sm" aria-hidden="true" />
        <span className="sr-only">Inclus</span>
      </span>
    );
  }
  if (value === '—') {
    return (
      <span className="flex items-center gap-1 text-text-secondary">
        <Minus className="h-icon-sm w-icon-sm" aria-hidden="true" />
        <span className="sr-only">Non inclus</span>
      </span>
    );
  }
  return <span className="font-mono text-sm tabular-nums text-text-primary">{value}</span>;
}

/** Colonne d'un plan à venir : aucun prix annoncé, bouton désactivé. */
function UpcomingPlan({ name }: { name: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <h3 className="text-h3 text-text-primary">{name}</h3>
        <Badge tone="neutral" className="font-mono text-xs uppercase tracking-wider">
          bientôt
        </Badge>
      </div>
      <p className="mt-2 text-sm text-text-secondary">Tarif annoncé en v1.1.</p>
      <Button
        variant="secondary"
        size="sm"
        disabled
        className="mt-4"
        title="Disponible lorsque la souscription payante ouvrira"
      >
        Me prévenir
      </Button>
    </Card>
  );
}

export function PlanPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Plan &amp; limites</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Votre consommation face aux limites de votre plan
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-baseline justify-between">
            <CardTitle>Free · votre plan</CardTitle>
            <span className="font-mono text-sm text-text-secondary">0 €/mois</span>
          </CardHeader>
          <div className="grid gap-5 px-5 pb-5">
            {USAGE.map((u) => (
              <div key={u.label}>
                <PlanMeter label={u.label} used={u.used} limit={u.limit} />
                {/* La note dit QUAND ça se débloque : une jauge pleine sans
                    perspective serait un cul-de-sac. */}
                <p className="mt-1.5 text-xs text-text-secondary">{u.note}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Le gating s'explique, il ne s'excuse pas (CdC §4.4). */}
        <Card className="p-5">
          <div className="flex gap-3">
            <Info className="h-icon-md w-icon-md shrink-0 text-primary-600" aria-hidden="true" />
            <p className="text-sm text-text-primary">
              Le plan Free ne bride jamais la qualité d’un événement publié — seulement le
              volume et les outils de productivité.
            </p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Comparatif des plans</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-table text-sm">
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-secondary"
                >
                  Capacité
                </th>
                {/* La colonne du plan courant est surlignée et porte « vous ». */}
                <th
                  scope="col"
                  className="bg-surface-selected/60 px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-selected"
                >
                  Free <span className="ml-1 normal-case">· vous</span>
                </th>
                {['Pro', 'Business'].map((p) => (
                  <th
                    key={p}
                    scope="col"
                    className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-secondary"
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.capability} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text-primary">{row.capability}</td>
                  <td className="bg-surface-selected/60 px-4 py-3">
                    <Cell value={row.free} />
                  </td>
                  <td className="px-4 py-3">
                    <Cell value={row.pro} />
                  </td>
                  <td className="px-4 py-3">
                    <Cell value={row.business} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UpcomingPlan name="Pro" />
        <UpcomingPlan name="Business" />
      </div>
    </div>
  );
}
