'use client';

import * as React from 'react';
import { Archive, Copy, Lock, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { CapacityGauge } from '@rwtechnology/eventflow-design-system/capacity-gauge';
import { Card } from '@rwtechnology/eventflow-design-system/card';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import {
  StatusBadge,
  type EventLifecycleStatus,
} from '@rwtechnology/eventflow-design-system/status-badge';
import { Tooltip } from '@rwtechnology/eventflow-design-system/tooltip';
import { GateBanner, GateModal } from './gating';

// EventsList — liste des événements de la Console Partenaire (CdC PTN-3, PTN-7,
// PTN-11). Composée à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/evenements.html (écran 4).
//
// Les 7 événements couvrent les 6 états du cycle de vie : la liste EST la
// démonstration du cycle, c'est ce que la maquette montre.
//
// Données fictives du prototype, cohérentes avec l'écran 3 et la Console
// Maître : même Organisation, plan Free à 2/2 actifs. Backend séparé (§9.4).

interface EventRow {
  id: string;
  day: string;
  month: string;
  title: string;
  venue: string;
  time: string;
  status: EventLifecycleStatus;
  /** Réservations sur capacité. `null` pour un événement sans jauge à afficher. */
  taken: number | null;
  capacity: number | null;
  /** Remplace la jauge : présence constatée ou inscrits notifiés. */
  outcome?: string;
  /** Liste d'attente, affichée seulement quand l'événement est complet. */
  waitlist?: number;
  date: string;
  modified: string;
}

const EVENTS: EventRow[] = [
  {
    id: 'nuit-electro',
    day: '14',
    month: 'Août',
    title: 'Nuit électro au Hangar à Bananes',
    venue: 'Hangar à Bananes',
    time: '21 h 00',
    status: 'published',
    taken: 374,
    capacity: 480,
    date: 'ven. 14 août',
    modified: 'il y a 2 h',
  },
  {
    id: 'sunset-session',
    day: '29',
    month: 'Août',
    title: 'Sunset session — rooftop de l’île',
    venue: 'Quartier de la Création',
    time: '19 h 00',
    status: 'published',
    taken: 94,
    capacity: 180,
    date: 'sam. 29 août',
    modified: 'hier',
  },
  {
    id: 'friche-sonore',
    day: '26',
    month: 'Sept',
    title: 'Friche sonore #4 — techno & live modulaire',
    venue: 'Friche des Chantiers',
    time: '22 h 00',
    status: 'draft',
    taken: 0,
    capacity: 350,
    date: 'sam. 26 sept.',
    modified: 'il y a 3 j',
  },
  {
    id: 'jazz-erdre',
    day: '23',
    month: 'Août',
    title: 'Jazz au fil de l’Erdre — session d’été',
    venue: 'Quai de Versailles',
    time: '18 h 00',
    status: 'full',
    taken: 480,
    capacity: 480,
    waitlist: 12,
    date: 'dim. 23 août',
    modified: 'il y a 5 h',
  },
  {
    id: 'fete-musique',
    day: '21',
    month: 'Juin',
    title: 'Fête de la musique — scène Loire',
    venue: 'Quai des Antilles',
    time: '18 h 00',
    status: 'finished',
    taken: null,
    capacity: null,
    outcome: '612/780 présents · 78 %',
    date: 'dim. 21 juin',
    modified: '21 juin',
  },
  {
    id: 'peniche-club',
    day: '18',
    month: 'Avr',
    title: 'Péniche club — house au fil de l’eau',
    venue: 'Ponton Belem',
    time: '20 h 00',
    status: 'archived',
    taken: null,
    capacity: null,
    outcome: '148/150 présents · 99 %',
    date: 'sam. 18 avril',
    modified: '2 mai',
  },
  {
    id: 'warm-up-rentree',
    day: '04',
    month: 'Juil',
    title: 'Warm-up de rentrée',
    venue: 'Le Lieu Unique',
    time: '19 h 00',
    status: 'event-cancelled',
    taken: null,
    capacity: null,
    outcome: '31 inscrits notifiés',
    date: 'sam. 4 juil.',
    modified: '28 juin',
  },
];

/** Segments de filtre par statut, avec leur compteur (maquette écran 4). */
const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'published', label: 'Publiés' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'full', label: 'Complets' },
  { value: 'finished', label: 'Terminés' },
  { value: 'archived', label: 'Archivés' },
  { value: 'event-cancelled', label: 'Annulés' },
];

/** Bloc-date compact (signature S3 de la DA) : jour au-dessus, mois dessous. */
function DateBlock({ day, month }: { day: string; month: string }) {
  return (
    <div className="flex w-10 shrink-0 flex-col items-center rounded-md border border-border py-1">
      <span className="font-mono text-sm font-semibold text-text-primary">{day}</span>
      <span className="font-mono text-xs uppercase text-text-secondary">{month}</span>
    </div>
  );
}

export function EventsList() {
  const [gateOpen, setGateOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [sort, setSort] = React.useState('date');

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: EVENTS.length };
    for (const e of EVENTS) map[e.status] = (map[e.status] ?? 0) + 1;
    return map;
  }, []);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = EVENTS.filter((e) => {
      if (status !== 'all' && e.status !== status) return false;
      // Recherche sur titre et lieu (maquette écran 4).
      return !q || `${e.title} ${e.venue}`.toLowerCase().includes(q);
    });
    if (sort === 'titre') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    }
    return filtered;
  }, [query, status, sort]);

  /** Un événement passé ou inactif s'affiche atténué (maquette écran 4). */
  const isDimmed = (s: EventLifecycleStatus) =>
    s === 'finished' || s === 'archived' || s === 'event-cancelled';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text-primary">Événements</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {EVENTS.length} événements · cycle de vie complet
          </p>
        </div>

        {/* PTN-11 : le CTA est verrouillé, la limite du plan est atteinte.
            Cohérent avec le GateBanner du tableau de bord. */}
        {/* Le CTA n'est pas mort : il ouvre la GateModal qui explique et propose
            des issues (maquette écran 8, état 2). */}
        <Tooltip content="Limite du plan Free atteinte">
          <Button
            onClick={() => setGateOpen(true)}
            leftIcon={<Lock className="h-icon-sm w-icon-sm" aria-hidden="true" />}
          >
            Nouvel événement
          </Button>
        </Tooltip>
      </div>

      {/* PTN-11 : où j'en suis, pourquoi, comment avancer. */}
      <GateBanner
        status="2/2 événements actifs"
        detail="votre plan Free est au maximum. « Nuit électro » se termine le 14 août et libère un emplacement automatiquement."
      />

      <GateModal
        open={gateOpen}
        onOpenChange={setGateOpen}
        title="Votre 3e événement actif attendra un peu"
        reassurance="Le plan Free permet 2 événements actifs simultanés. Rien n’est perdu : votre brouillon est enregistré et prêt à publier."
        options={[
          {
            title: 'Attendre le 14 août',
            detail: '« Nuit électro » se termine et libère un emplacement automatiquement.',
          },
          {
            title: 'Archiver un événement terminé',
            detail: '« Fête de la musique » peut être archivé dès maintenant.',
          },
          {
            title: 'Passer en Pro',
            detail: 'Événements actifs illimités — disponible prochainement.',
          },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-64 max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-icon-sm w-icon-sm -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un événement..."
            aria-label="Rechercher un événement"
            className="pl-9"
          />
        </div>
        <div className="w-52">
          <Select
            value={sort}
            onValueChange={setSort}
            aria-label="Trier les événements"
            options={[
              { value: 'date', label: 'Date' },
              { value: 'modifie', label: 'Dernière modification' },
              { value: 'titre', label: 'Titre A→Z' },
            ]}
          />
        </div>
      </div>

      {/* Filtres en segments : l'actif porte fond et bordure (maquette écran 4). */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              aria-pressed={active}
              className={[
                'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm',
                'transition-colors duration-fast ease-out',
                'focus-visible:outline-none focus-visible:ring focus-visible:ring-focus',
                active
                  ? 'border-primary-300 bg-surface-selected/60 text-text-selected'
                  : 'border-border text-text-primary hover:bg-surface-selected/60',
              ].join(' ')}
            >
              {f.label}
              <span className="font-mono text-xs text-text-secondary">
                {counts[f.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-table text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Événement', 'Statut', 'Remplissage', 'Attente', 'Date', 'Modifié', ''].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-secondary"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr
                  key={e.id}
                  className={`border-b border-border last:border-b-0 ${
                    isDimmed(e.status) ? 'opacity-70' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <DateBlock day={e.day} month={e.month} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">{e.title}</p>
                        <p className="truncate text-xs text-text-secondary">
                          {e.venue} · {e.time}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 py-3">
                    {e.outcome ? (
                      <span className="font-mono text-xs text-text-secondary">{e.outcome}</span>
                    ) : e.taken !== null && e.capacity !== null ? (
                      <div className="w-40">
                        <CapacityGauge taken={e.taken} total={e.capacity} />
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-text-primary">
                    {e.waitlist ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                    {e.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-secondary">
                    {e.modified}
                  </td>
                  <td className="w-32 px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* PTN-7 : dupliquer est l'action n°1 des récurrents,
                          donc directe plutôt que dans le menu. */}
                      <Button variant="ghost" size="sm" iconOnly aria-label="Dupliquer">
                        <Copy className="h-icon-sm w-icon-sm" aria-hidden="true" />
                      </Button>
                      {e.status === 'finished' ? (
                        <Button variant="ghost" size="sm" iconOnly aria-label="Archiver">
                          <Archive className="h-icon-sm w-icon-sm" aria-hidden="true" />
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" iconOnly aria-label="Plus d’actions">
                        <MoreHorizontal className="h-icon-sm w-icon-sm" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
