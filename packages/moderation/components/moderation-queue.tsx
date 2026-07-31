'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Card } from '@rwtechnology/eventflow-design-system/card';
import { EmptyState } from '@rwtechnology/eventflow-design-system/empty-state';
import { StatusBadge } from '@rwtechnology/eventflow-design-system/status-badge';
import { DepublishDialog } from './depublish-dialog';

// ModerationQueue — file des evenements signales et apercu du signalement
// selectionne (CdC CSM-3). Composee a 100 % depuis le design system (RG-1).
// Reference : backoffice/pages/moderation.html (ecran 12).
//
// Layout maitre-detail : la file a gauche, l'apercu a droite. Les items traites
// restent visibles, attenues : la file raconte aussi ce qui vient d'etre fait.
//
// Donnees fictives du prototype, aucun appel API (CdC §9.4). Rejeter et
// depublier ne font que retirer l'item de la file cote client.

interface Report {
  id: string;
  title: string;
  organization: string;
  city: string;
  /** Motifs signales, en tags mono. */
  reasons: string[];
  /** Multiplicite, affichee quand elle depasse 1. */
  count: number;
  freshness: string;
  /** Verbatim du signalement. */
  quote: string;
  /** Source du verbatim : qui, quand, pour quel motif. */
  source: string;
  orgContext: string;
  eventContext: string;
  history: string;
  /** Nombre d'inscrits, rappele dans la modale de depublication. */
  attendees: number;
  /** Precisions pre-redigees, envoyees telles quelles au partenaire. */
  draft: string;
  /** Traite : reste visible, attenue. */
  settled?: string;
}

const REPORTS: Report[] = [
  {
    id: 'soiree-mousse-xxl',
    title: '« Soirée mousse XXL — open bar »',
    organization: 'Assoc. Court-Circuit',
    city: 'Angers',
    reasons: ['contenu trompeur'],
    count: 2,
    freshness: '1er signalement il y a 9 h',
    quote:
      '« L’événement annonce un open bar gratuit mais la page Instagram de l’asso indique une entrée à 15 €. »',
    source:
      'Signalé par 2 visiteurs · 14 juil. 22:31 et 15 juil. 08:02 · motif : contenu trompeur',
    orgContext: 'Assoc. Court-Circuit · Free · 2 événements actifs · 1er signalement',
    eventContext: 'sam. 1er août · 22 h 00 · Angers · 96/120 réservations',
    history: 'aucune dépublication antérieure pour cette Organisation',
    attendees: 96,
    draft:
      'Votre événement annonce « open bar gratuit » alors que vos réseaux indiquent une entrée payante à 15 €. Alignez la description sur les conditions réelles puis demandez la republication depuis votre console.',
  },
  {
    id: 'warm-up-warehouse',
    title: '« Warm-up warehouse »',
    organization: 'Rennes en Scène',
    city: 'Rennes',
    reasons: ['adresse invalide'],
    count: 1,
    freshness: 'il y a 2 j',
    quote: '« L’adresse indiquée ne correspond à aucun lieu identifiable. »',
    source: 'Signalé par 1 visiteur · motif : adresse invalide',
    orgContext: 'Rennes en Scène · Free · compte suspendu le 2 juil.',
    eventContext: 'ven. 8 août · 23 h 00 · Rennes',
    history: 'aucune dépublication antérieure pour cette Organisation',
    attendees: 0,
    draft:
      'L’adresse renseignée pour votre événement ne correspond à aucun lieu identifiable. Corrigez le lieu puis demandez la republication depuis votre console.',
  },
  {
    id: 'concert-caritatif',
    title: '« Concert caritatif — urgence »',
    organization: 'Les Amis du Val',
    city: 'Nantes',
    reasons: ['doute organisateur'],
    count: 1,
    freshness: 'il y a 3 j',
    quote: '« Aucune trace de cette association, et la collecte renvoie vers un compte personnel. »',
    source: 'Signalé par 1 visiteur · motif : doute organisateur',
    orgContext: 'Les Amis du Val · Free · 1 événement actif',
    eventContext: 'dim. 16 août · 18 h 00 · Nantes',
    history: 'aucune dépublication antérieure pour cette Organisation',
    attendees: 34,
    draft:
      'Des visiteurs signalent un doute sur l’identité de l’organisateur et la destination de la collecte. Complétez les informations de votre Organisation puis demandez la republication.',
  },
  {
    id: 'tournoi-esport-lan',
    title: '« Tournoi e-sport LAN »',
    organization: 'Café Brumaire',
    city: 'Nantes',
    reasons: [],
    count: 0,
    freshness: '',
    quote: '',
    source: '',
    orgContext: 'Café Brumaire · Free · 2 événements publiés',
    eventContext: '',
    history: '',
    attendees: 0,
    draft: '',
    settled: 'Signalement rejeté hier',
  },
];

/** Item de la file : titre, organisation, motifs, fraicheur. */
function QueueItem({
  report,
  selected,
  onSelect,
}: {
  report: Report;
  selected: boolean;
  onSelect: () => void;
}) {
  const settled = Boolean(report.settled);
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={settled}
      aria-current={selected ? 'true' : undefined}
      className={[
        'relative w-full border-b border-border px-4 py-3 text-left',
        'transition-colors duration-fast ease-out',
        'focus-visible:outline-none focus-visible:ring focus-visible:ring-focus',
        // Selection : role semantique (remappe en sombre) + lisere gauche.
        selected
          ? 'bg-surface-selected/60 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary-600 before:content-[""]'
          : 'hover:bg-surface-selected/60',
        settled ? 'opacity-55' : '',
      ].join(' ')}
    >
      <p className="text-sm font-semibold text-text-primary">{report.title}</p>
      <p className="mt-0.5 text-xs text-text-secondary">
        {report.organization} · {report.city}
      </p>

      {settled ? (
        <p className="mt-2 font-mono text-xs text-text-secondary">{report.settled}</p>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {report.reasons.map((r) => (
              <Badge key={r} tone="warning" className="font-mono text-xs">
                {r}
              </Badge>
            ))}
            {report.count > 1 ? (
              <span className="font-mono text-xs text-text-secondary">
                × {report.count} signalements
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 font-mono text-xs text-text-secondary">{report.freshness}</p>
        </>
      )}
    </button>
  );
}

/** Ligne de contexte de l'apercu. */
function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-b-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span className="text-right font-mono text-xs text-text-primary">{value}</span>
    </div>
  );
}

export function ModerationQueue() {
  const [reports, setReports] = React.useState(REPORTS);
  const [selectedId, setSelectedId] = React.useState(REPORTS[0]?.id ?? '');

  const pending = reports.filter((r) => !r.settled);
  const selected = reports.find((r) => r.id === selectedId);

  /** Retire l'item de la file et passe au suivant (maquette ecran 12). */
  function settle(id: string, label: string) {
    const next = pending.find((r) => r.id !== id);
    setReports((rs) => rs.map((r) => (r.id === id ? { ...r, settled: label } : r)));
    if (next) setSelectedId(next.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Modération</h1>
        <p className="mt-1 text-sm text-text-secondary">
          File des événements signalés · dépublication avec motif notifié au partenaire
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[360px_1fr]">
        {/* File */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-text-primary">File d’attente</h2>
            <Badge tone="warning">{pending.length}</Badge>
          </div>
          {reports.map((r) => (
            <QueueItem
              key={r.id}
              report={r}
              selected={r.id === selectedId}
              onSelect={() => setSelectedId(r.id)}
            />
          ))}
        </Card>

        {/* Apercu du signalement selectionne */}
        {selected && !selected.settled ? (
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-h3 text-text-primary">{selected.title}</h2>
              <StatusBadge status="confirmed" label="Publié" />
            </div>

            {/* Citation : encart ambre a lisere, verbatim + source mono. */}
            <blockquote className="mt-4 border-l-2 border-warning bg-warning/10 px-4 py-3">
              <p className="text-sm text-text-primary">{selected.quote}</p>
              <p className="mt-2 font-mono text-xs text-text-secondary">{selected.source}</p>
            </blockquote>

            <div className="mt-4">
              <ContextRow label="Organisation" value={selected.orgContext} />
              <ContextRow label="Événement" value={selected.eventContext} />
              <ContextRow label="Historique" value={selected.history} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ExternalLink className="h-icon-sm w-icon-sm" aria-hidden="true" />}
              >
                Voir la page publique
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => settle(selected.id, 'Signalement rejeté à l’instant')}
              >
                Rejeter le signalement
              </Button>
              <DepublishDialog
                title={selected.title}
                attendees={selected.attendees}
                draft={selected.draft}
                onConfirm={() => settle(selected.id, 'Dépublié à l’instant')}
              />
            </div>
          </Card>
        ) : (
          <Card className="p-5">
            <EmptyState
              title="Rien à modérer"
              description="La file est vide : aucun signalement en attente."
            />
          </Card>
        )}
      </div>
    </div>
  );
}
