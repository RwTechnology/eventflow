'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Avatar } from '@rwtechnology/eventflow-design-system/avatar';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import {
  DataTable,
  type ColumnDef,
} from '@rwtechnology/eventflow-design-system/data-table';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import { StatusBadge } from '@rwtechnology/eventflow-design-system/status-badge';

// PartnersList — liste des Organisations de la Console Maître (CdC CSM-2).
// Composée à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/partenaires.html, vue liste (écran 11).
//
// Données fictives du prototype. Le backend est un chantier séparé
// (CdC §9.4) : le filtrage est fait ici, en mémoire, sur ce jeu.

type Plan = 'Free' | 'Pro' | 'Business';

interface Organization {
  slug: string;
  name: string;
  /**
   * Initiales de la pastille. `Avatar` prend la première lettre de chaque mot,
   * ce qui donne « S » pour un nom d'un seul mot ; la maquette montre « ST ».
   */
  initials: string;
  city: string;
  descriptor: string;
  plan: Plan;
  activeEvents: number;
  /** Limite d'événements actifs du plan ; null = illimité. */
  activeLimit: number | null;
  bookings30d: number;
  status: 'active' | 'suspended';
  /** Date de suspension, affichée dans le badge quand le compte est suspendu. */
  suspendedOn?: string;
  since: string;
  /** Signalement en attente : lien croisé vers la modération (CSM-3). */
  flagged?: string;
}

const ORGANIZATIONS: Organization[] = [
  {
    slug: 'stereolux',
    name: 'Stereolux',
    initials: 'ST',
    city: 'Nantes',
    descriptor: 'scène culturelle',
    plan: 'Business',
    activeEvents: 14,
    activeLimit: null,
    bookings30d: 6214,
    status: 'active',
    since: 'janv. 2024',
  },
  {
    slug: 'la-cantine-numerique',
    name: 'La Cantine Numérique',
    initials: 'LC',
    city: 'Nantes',
    descriptor: 'communauté tech',
    plan: 'Pro',
    activeEvents: 6,
    activeLimit: null,
    bookings30d: 1480,
    status: 'active',
    since: 'mars 2024',
  },
  {
    slug: 'collectif-nuits-nantaises',
    name: 'Collectif Nuits Nantaises',
    initials: 'CN',
    city: 'Nantes',
    descriptor: 'association loi 1901',
    plan: 'Free',
    activeEvents: 2,
    activeLimit: 2,
    bookings30d: 148,
    status: 'active',
    since: 'juin 2023',
  },
  {
    slug: 'assoc-court-circuit',
    name: 'Assoc. Court-Circuit',
    initials: 'CC',
    city: 'Angers',
    descriptor: 'collectif étudiant',
    plan: 'Free',
    activeEvents: 2,
    activeLimit: 2,
    bookings30d: 96,
    status: 'active',
    since: 'févr. 2026',
    flagged: '1 signalement en attente',
  },
  {
    slug: 'rennes-en-scene',
    name: 'Rennes en Scène',
    initials: 'RS',
    city: 'Rennes',
    descriptor: 'programmation privée',
    plan: 'Free',
    activeEvents: 0,
    activeLimit: 2,
    bookings30d: 0,
    status: 'suspended',
    suspendedOn: 'Suspendue le 2 juil.',
    since: 'nov. 2025',
  },
];

/**
 * Plan-tag mono (maquette écran 11) : Free gris, Pro indigo, Business noir.
 * `Badge` n'a pas de ton « inversé » ; le noir plein passe donc par les rôles
 * de surface, pas par une couleur littérale.
 */
function PlanTag({ plan }: { plan: Plan }) {
  const mono = 'font-mono text-xs uppercase tracking-wider';
  if (plan === 'Business') {
    return (
      <Badge tone="neutral" className={`${mono} bg-text-primary text-surface-card`}>
        {plan}
      </Badge>
    );
  }
  return (
    <Badge tone={plan === 'Pro' ? 'brand' : 'neutral'} className={mono}>
      {plan}
    </Badge>
  );
}

const columns: ColumnDef<Organization, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Organisation',
    cell: ({ row }) => {
      const o = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar name={o.name} fallback={o.initials} size="sm" />
          <div className="min-w-0">
            {/* La ligne mène à la fiche Organisation (maquette écran 11). */}
            <Link
              href={`/partenaires/${o.slug}`}
              className="truncate font-semibold text-text-primary hover:text-primary-700 hover:underline"
            >
              {o.name}
            </Link>
            <p className="truncate text-xs text-text-secondary">
              {o.city} · {o.descriptor}
              {o.flagged ? (
                <span className="ml-2 text-warning">⚑ {o.flagged}</span>
              ) : null}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => <PlanTag plan={row.original.plan} />,
  },
  {
    accessorKey: 'activeEvents',
    header: 'Actifs',
    cell: ({ row }) => {
      const o = row.original;
      // Ambre quand la limite du plan est atteinte (maquette écran 11).
      const atLimit = o.activeLimit !== null && o.activeEvents >= o.activeLimit;
      return (
        <span className={`font-mono text-sm ${atLimit ? 'text-warning' : 'text-text-primary'}`}>
          {o.activeEvents} / {o.activeLimit ?? '∞'}
        </span>
      );
    },
  },
  {
    accessorKey: 'bookings30d',
    header: 'Résa · 30 j',
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums text-text-primary">
        {row.original.bookings30d.toLocaleString('fr-FR')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const o = row.original;
      return <StatusBadge status={o.status} label={o.suspendedOn} />;
    },
  },
  {
    accessorKey: 'since',
    header: 'Depuis',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">{row.original.since}</span>
    ),
  },
];

export function PartnersList() {
  const [query, setQuery] = React.useState('');
  const [plan, setPlan] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORGANIZATIONS.filter((o) => {
      if (plan !== 'all' && o.plan !== plan) return false;
      if (status !== 'all' && o.status !== status) return false;
      if (!q) return true;
      // Recherche sur nom, ville, descriptif (maquette : nom, ville, propriétaire).
      return `${o.name} ${o.city} ${o.descriptor}`.toLowerCase().includes(q);
    });
  }, [query, plan, status]);

  const active = ORGANIZATIONS.filter((o) => o.status === 'active').length;
  const suspended = ORGANIZATIONS.length - active;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Partenaires</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {ORGANIZATIONS.length} Organisations · {active} actives, {suspended} suspendues
        </p>
      </div>

      {/* Toolbar en ligne (maquette écran 11) : recherche large, filtres à droite. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-64 max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-icon-sm w-icon-sm -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, ville ou propriétaire..."
            aria-label="Rechercher une Organisation"
            className="pl-9"
          />
        </div>
        {/* Le Select du design system est w-full (adapté aux formulaires) : on
            le borne ici, dans la toolbar, sans toucher au composant. */}
        <div className="w-44">
          <Select
            value={plan}
            onValueChange={setPlan}
            aria-label="Filtrer par plan"
            options={[
              { value: 'all', label: 'Tous les plans' },
              { value: 'Free', label: 'Free' },
              { value: 'Pro', label: 'Pro' },
              { value: 'Business', label: 'Business' },
            ]}
          />
        </div>
        <div className="w-44">
          <Select
            value={status}
            onValueChange={setStatus}
            aria-label="Filtrer par statut"
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'active', label: 'Actives' },
              { value: 'suspended', label: 'Suspendues' },
            ]}
          />
        </div>
      </div>

      <DataTable columns={columns} data={rows} />
    </div>
  );
}
