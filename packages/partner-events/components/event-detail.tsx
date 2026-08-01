'use client';

import * as React from 'react';
import { Copy, ExternalLink, Search } from 'lucide-react';
import { Avatar } from '@rwtechnology/eventflow-design-system/avatar';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { CapacityGauge } from '@rwtechnology/eventflow-design-system/capacity-gauge';
import { Card, CardHeader, CardTitle } from '@rwtechnology/eventflow-design-system/card';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import { StatusBadge } from '@rwtechnology/eventflow-design-system/status-badge';
import { Tabs, type TabItem } from '@rwtechnology/eventflow-design-system/tabs';
import { TrendChart, type TrendPoint } from '@rwtechnology/eventflow-design-system/trend-chart';
import { GateBanner, GateLock } from './gating';

// EventDetail — detail d'un evenement en 5 onglets (CdC PTN-3 a PTN-10).
// Compose a 100 % depuis le design system publie (RG-1).
// Reference : backoffice/pages/evenement-detail.html (ecran 6).
//
// L'onglet actif vit dans l'URL (`?onglet=`) : un lien vers l'onglet
// Reservations doit rester partageable.
//
// Donnees fictives du prototype, coherentes avec la liste : « Nuit electro »,
// 374/480. Backend separe (CdC §9.4).

const EVENT = {
  day: '14',
  month: 'Août',
  title: 'Nuit électro au Hangar à Bananes',
  venue: 'Hangar à Bananes',
  schedule: 'ven. 14 août · 21 h 00 — 04 h 00',
  taken: 374,
  capacity: 480,
  waitlist: 0,
  slug: 'nuit-electro-hangar-bananes',
};

interface Reservation {
  name: string;
  email: string;
  code: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  /** Precision affichee a cote du badge : renvoi, position, date d'annulation. */
  note?: string;
  bookedAt: string;
}

const RESERVATIONS: Reservation[] = [
  {
    name: 'Sarah Lemoine',
    email: 'sarah.lemoine@exemple.fr',
    code: 'EF-7K2M9Q4B',
    status: 'confirmed',
    bookedAt: '12 juil. · 21:14',
  },
  {
    name: 'Yasmine Traoré',
    email: 'y.traore@exemple.fr',
    code: 'EF-3X8VW1TD',
    status: 'confirmed',
    note: 'e-mail renvoyé',
    bookedAt: '11 juil. · 09:32',
  },
  {
    name: 'Awa Diallo',
    email: 'awa.diallo@exemple.fr',
    code: '—',
    status: 'waitlist',
    note: 'pos. 3',
    bookedAt: '13 juil. · 17:48',
  },
  {
    name: 'Théo Blanchard',
    email: 'theo.blanchard@exemple.fr',
    code: 'EF-9P4RC7LN',
    status: 'cancelled',
    note: 'le 10 juil.',
    bookedAt: '09 juil. · 14:05',
  },
];

/** Journal d'activite (PTN-9) : qui a modifie quoi, quand. */
const ACTIVITY = [
  { actor: 'Marc Guibert', action: 'a modifié la capacité (420 → 480)', at: '15 juil. 10:14' },
  { actor: 'Marc Guibert', action: 'a publié l’événement', at: '02 juil. 16:40' },
  { actor: 'Système', action: 'a promu 1 inscrit depuis la liste d’attente', at: '28 juin 08:12' },
];

// Inscriptions cumulees sur 30 jours (maquette ecran 6).
const SERIES: TrendPoint[] = [
  18, 34, 52, 71, 96, 118, 141, 160, 178, 195, 210, 224, 239, 251, 264, 276, 288, 297, 307,
  316, 324, 331, 339, 346, 352, 358, 363, 368, 371, 374,
].map((value, i) => ({ label: `J-${29 - i}`, value }));

/** Ligne cle/valeur de l'apercu. */
function KeyValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border px-5 py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span className="text-right text-sm text-text-primary">{children}</span>
    </div>
  );
}

function ApercuTab() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <div>
          <KeyValue label="Capacité">
            <div className="w-56">
              <CapacityGauge taken={EVENT.taken} total={EVENT.capacity} />
            </div>
          </KeyValue>
          <KeyValue label="Liste d’attente">
            <span className="font-mono text-xs">aucune personne en attente</span>
          </KeyValue>
          <KeyValue label="Limite d’annulation">
            <span className="font-mono text-xs">jusqu’à H-2, soit le 14 août à 19 h 00</span>
          </KeyValue>
          <KeyValue label="Rappel J-1">
            {/* PTN-10 : verrouille sur Free, mais visible (doctrine ecran 8). */}
            <GateLock
              label="Rappel J-1"
              availableIn="Pro et Business"
              description="Un e-mail de rappel part automatiquement la veille de l’événement, aux inscrits confirmés."
            />
          </KeyValue>
          <KeyValue label="Slug">
            <span className="font-mono text-xs">{EVENT.slug}</span>
          </KeyValue>
        </div>
      </Card>

      {/* PTN-9 : journal d'activite. */}
      <Card>
        <CardHeader>
          <CardTitle>Journal d’activité</CardTitle>
        </CardHeader>
        <div>
          {ACTIVITY.map((a) => (
            <div
              key={a.at}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 py-3 last:border-b-0"
            >
              <p className="text-sm text-text-primary">
                <strong className="font-semibold">{a.actor}</strong> {a.action}
              </p>
              <span className="font-mono text-xs text-text-secondary">{a.at}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ReservationsTab() {
  const [query, setQuery] = React.useState('');

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESERVATIONS;
    return RESERVATIONS.filter((r) =>
      `${r.name} ${r.email} ${r.code}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-64 max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-icon-sm w-icon-sm -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, e-mail ou code..."
            aria-label="Rechercher une réservation"
            className="pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* PTN-4 + PTN-11 : l'export existe, il est verrouille, pas masque. */}
          <GateLock
            label="Exporter CSV"
            availableIn="Pro et Business"
            description="L’export inclut nom, e-mail, code, statut et heure de scan de chaque participant — idéal pour vos listes d’émargement."
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-table text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Participant', 'Code', 'Statut', 'Réservé le'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.email}
                  className={`border-b border-border last:border-b-0 ${
                    r.status === 'cancelled' ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{r.name}</p>
                    <p className="text-xs text-text-secondary">{r.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">{r.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={r.status} />
                      {r.note ? (
                        <span className="font-mono text-xs text-text-secondary">{r.note}</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-secondary">
                    {r.bookedAt}
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

function StatistiquesTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inscrits vs capacité</CardTitle>
          <span className="font-mono text-xs text-text-secondary">
            {EVENT.taken}/{EVENT.capacity}
          </span>
        </CardHeader>
        <div className="px-5 pb-5">
          <CapacityGauge taken={EVENT.taken} total={EVENT.capacity} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inscriptions cumulées · 30 jours</CardTitle>
        </CardHeader>
        <div className="px-5 pb-4">
          <TrendChart
            data={SERIES}
            unit="inscrits"
            startLabel="J-30"
            endLabel="aujourd’hui"
            aria-label="Inscriptions cumulées sur 30 jours"
          />
        </div>
      </Card>

      {/* Le taux de presence n'est pas « 0 % » : il n'existe pas encore. */}
      <Card className="p-5">
        <p className="text-sm font-semibold text-text-primary">Taux de présence</p>
        <p className="mt-1 text-sm text-text-secondary">
          Disponible après l’événement — les scans de Léa alimenteront ce chiffre.
        </p>
      </Card>
    </div>
  );
}

function AgentsTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* PTN-6 + PTN-11 : la limite d'agents est atteinte sur Free. */}
      <GateBanner
        status="1/1 agent de contrôle"
        detail="le plan Free autorise un agent par événement. Passez en Pro pour en inviter jusqu’à 5."
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Agents de contrôle</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-4">
          <Avatar name="Léa Bernard" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">Léa Bernard</p>
            <p className="text-xs text-text-secondary">lea.bernard@exemple.fr</p>
          </div>
          <Badge tone="success">Invitation acceptée</Badge>
          <Button variant="ghost" size="sm">
            Révoquer
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ParametresTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <p className="text-sm font-semibold text-text-primary">Dupliquer l’événement</p>
        <p className="mt-1 text-xs text-text-secondary">
          Crée un brouillon reprenant le contenu, la capacité et les agents. La date reste à
          définir.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          leftIcon={<Copy className="h-icon-sm w-icon-sm" aria-hidden="true" />}
        >
          Dupliquer
        </Button>
      </Card>

      {/* PTN-3 : annuler est destructeur, la zone le dit visuellement. */}
      <div className="rounded-lg border border-danger/40 bg-danger/5 p-5">
        <p className="text-sm font-semibold text-danger">Annuler l’événement</p>
        <p className="mt-1 text-xs text-text-secondary">
          Les {EVENT.taken} inscrits sont notifiés par e-mail. L’événement reste visible dans
          votre liste, marqué annulé. Irréversible.
        </p>
        <Button variant="danger" size="sm" className="mt-3">
          Annuler l’événement
        </Button>
      </div>
    </div>
  );
}

export interface EventDetailProps {
  /** Onglet actif, lu depuis `?onglet=` : un lien doit rester partageable. */
  tab?: string;
}

export function EventDetail({ tab }: EventDetailProps) {
  const items: TabItem[] = [
    { value: 'apercu', label: 'Aperçu', content: <ApercuTab /> },
    {
      value: 'reservations',
      label: (
        <span className="flex items-center gap-1.5">
          Réservations
          <span className="font-mono text-xs text-text-secondary">{EVENT.taken}</span>
        </span>
      ),
      content: <ReservationsTab />,
    },
    { value: 'statistiques', label: 'Statistiques', content: <StatistiquesTab /> },
    {
      value: 'agents',
      label: (
        <span className="flex items-center gap-1.5">
          Agents
          <span className="font-mono text-xs text-text-secondary">1/1</span>
        </span>
      ),
      content: <AgentsTab />,
    },
    { value: 'parametres', label: 'Paramètres', content: <ParametresTab /> },
  ];

  const active = items.some((i) => i.value === tab) ? tab : 'apercu';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex w-12 shrink-0 flex-col items-center rounded-md border border-border py-1.5">
            <span className="font-mono text-lg font-semibold text-text-primary">
              {EVENT.day}
            </span>
            <span className="font-mono text-xs uppercase text-text-secondary">
              {EVENT.month}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1 text-text-primary">{EVENT.title}</h1>
              <StatusBadge status="published" />
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {EVENT.schedule} · {EVENT.venue} ·{' '}
              <span className="font-mono text-xs">
                {EVENT.taken}/{EVENT.capacity}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ExternalLink className="h-icon-sm w-icon-sm" aria-hidden="true" />}
          >
            Page publique
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Copy className="h-icon-sm w-icon-sm" aria-hidden="true" />}
          >
            Dupliquer
          </Button>
          <Button size="sm">Modifier</Button>
        </div>
      </div>

      <Tabs items={items} defaultValue={active} />
    </div>
  );
}
