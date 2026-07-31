'use client';

import * as React from 'react';
import { FilePlus2, PenLine, ShieldAlert, TrendingUp } from 'lucide-react';
import { Badge, type BadgeProps } from '@rwtechnology/eventflow-design-system/badge';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Card } from '@rwtechnology/eventflow-design-system/card';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelRow,
  SidePanelTitle,
} from '@rwtechnology/eventflow-design-system/side-panel';

// AuditJournal — journal d'audit filtrable de la Console Maître (CdC CSM-4).
// Composé à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/audit.html (écran 13).
//
// Lecture seule, rétention 24 mois. Les filtres sont combinables ; ici ils
// s'appliquent en mémoire sur le jeu fictif, le backend étant un chantier
// séparé (CdC §9.4). La synchronisation dans l'URL n'est pas implémentée.

type ActionKind = 'creation' | 'modification' | 'plan' | 'depublication';

/** Un type d'action = couleur + icône + libellé (la couleur n'est jamais seule). */
const ACTION_META: Record<
  ActionKind,
  { tone: NonNullable<BadgeProps['tone']>; label: string; icon: typeof FilePlus2 }
> = {
  creation: { tone: 'success', label: 'Création', icon: FilePlus2 },
  modification: { tone: 'brand', label: 'Modification', icon: PenLine },
  plan: { tone: 'warning', label: 'Changement de plan', icon: TrendingUp },
  depublication: { tone: 'danger', label: 'Dépublication', icon: ShieldAlert },
};

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: ActionKind;
  entityType: string;
  entityLabel: string;
  /** Détail du panneau latéral. */
  timestampUtc: string;
  session: string;
  origin: string;
  notification: string;
  /** Diff avant/après, preuve exacte du changement. */
  diff?: { before: string[]; after: string[] };
}

const ENTRIES: AuditEntry[] = [
  {
    id: 'AUD-2026-071511-4F2K',
    timestamp: '15 juil. 11:52:08',
    actor: 'Vous',
    actorRole: 'super-admin',
    action: 'plan',
    entityType: 'Organisation',
    entityLabel: 'La Cantine Numérique',
    timestampUtc: '15 juil. 2026 09:52:08 UTC',
    session: 'sess-8F2A · 10.0.0.4',
    origin: 'Console Maître · fiche Organisation · Appliquer',
    notification: 'e-mail envoyé au propriétaire · 15 juil. 11:52:09',
    diff: {
      before: ['plan: FREE', 'limite_evenements_actifs: 2', 'limite_reservations: 50'],
      after: ['plan: PRO', 'limite_evenements_actifs: illimité', 'limite_reservations: illimité'],
    },
  },
  {
    id: 'AUD-2026-071510-9C1X',
    timestamp: '15 juil. 10:14:41',
    actor: 'Marc Guibert',
    actorRole: 'partenaire · CN Nantaises',
    action: 'modification',
    entityType: 'Événement',
    entityLabel: 'Nuit électro au Hangar à Bananes',
    timestampUtc: '15 juil. 2026 08:14:41 UTC',
    session: 'sess-2B7D · 92.184.x.x',
    origin: 'Console Partenaire · édition d’événement',
    notification: 'aucune notification associée',
    diff: {
      before: ['capacite: 420'],
      after: ['capacite: 480'],
    },
  },
  {
    id: 'AUD-2026-071509-7T4M',
    timestamp: '15 juil. 09:03:17',
    actor: 'Système',
    actorRole: 'promotion automatique',
    action: 'creation',
    entityType: 'Réservation',
    entityLabel: 'EF-2W7HK3PM (liste d’attente → confirmée)',
    timestampUtc: '15 juil. 2026 07:03:17 UTC',
    session: 'job BullMQ · waitlist-promote',
    origin: 'Automatisme · promotion de liste d’attente',
    notification: 'e-mail de confirmation envoyé · 15 juil. 09:03:18',
    diff: {
      before: ['statut: WAITLISTED'],
      after: ['statut: CONFIRMED'],
    },
  },
  {
    id: 'AUD-2026-071422-1K9P',
    timestamp: '14 juil. 22:40:55',
    actor: 'Vous',
    actorRole: 'super-admin',
    action: 'depublication',
    entityType: 'Événement',
    entityLabel: 'Warm-up warehouse (Rennes en Scène)',
    timestampUtc: '14 juil. 2026 20:40:55 UTC',
    session: 'sess-8F2A · 10.0.0.4',
    origin: 'Console Maître · modération · Dépublier et notifier',
    notification: 'e-mail envoyé au partenaire · 14 juil. 22:40:56',
    diff: {
      before: ['statut: PUBLISHED'],
      after: ['statut: DRAFT', 'motif: adresse ou lieu invalide'],
    },
  },
  {
    id: 'AUD-2026-071418-3R6V',
    timestamp: '14 juil. 18:22:03',
    actor: 'Marc Guibert',
    actorRole: 'partenaire · CN Nantaises',
    action: 'creation',
    entityType: 'Agent',
    entityLabel: 'Léa Bernard (périmètre : Nuit électro)',
    timestampUtc: '14 juil. 2026 16:22:03 UTC',
    session: 'sess-2B7D · 92.184.x.x',
    origin: 'Console Partenaire · gestion des agents',
    notification: 'invitation envoyée · 14 juil. 18:22:04',
  },
];

/** Tag d'action : couleur + icône + libellé (jamais la couleur seule). */
function ActionTag({ action }: { action: ActionKind }) {
  const meta = ACTION_META[action];
  const Icon = meta.icon;
  return (
    <Badge tone={meta.tone}>
      <Icon className="h-icon-sm w-icon-sm shrink-0" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

export function AuditJournal() {
  const [actor, setActor] = React.useState('all');
  const [action, setAction] = React.useState('all');
  const [entity, setEntity] = React.useState('all');
  const [period, setPeriod] = React.useState('7');
  const [openId, setOpenId] = React.useState<string | null>(null);

  const rows = React.useMemo(
    () =>
      ENTRIES.filter((e) => {
        if (actor !== 'all') {
          const kind =
            e.actorRole.startsWith('super-admin')
              ? 'admin'
              : e.actor === 'Système'
                ? 'systeme'
                : 'partenaire';
          if (kind !== actor) return false;
        }
        if (action !== 'all' && e.action !== action) return false;
        if (entity !== 'all' && e.entityType !== entity) return false;
        return true;
      }),
    [actor, action, entity],
  );

  const selected = ENTRIES.find((e) => e.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Audit</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Journal filtrable des actions sensibles · lecture seule · rétention 24 mois
        </p>
      </div>

      {/* 4 filtres combinables (maquette écran 13) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-48">
          <Select
            value={actor}
            onValueChange={setActor}
            aria-label="Filtrer par acteur"
            options={[
              { value: 'all', label: 'Tous les acteurs' },
              { value: 'admin', label: 'Super-admins' },
              { value: 'partenaire', label: 'Partenaires' },
              { value: 'systeme', label: 'Système' },
            ]}
          />
        </div>
        <div className="w-52">
          <Select
            value={action}
            onValueChange={setAction}
            aria-label="Filtrer par action"
            options={[
              { value: 'all', label: 'Toutes les actions' },
              { value: 'creation', label: 'Création' },
              { value: 'modification', label: 'Modification' },
              { value: 'depublication', label: 'Dépublication / suspension' },
              { value: 'plan', label: 'Changement de plan' },
            ]}
          />
        </div>
        <div className="w-44">
          <Select
            value={entity}
            onValueChange={setEntity}
            aria-label="Filtrer par entité"
            options={[
              { value: 'all', label: 'Toutes les entités' },
              { value: 'Organisation', label: 'Organisation' },
              { value: 'Événement', label: 'Événement' },
              { value: 'Réservation', label: 'Réservation' },
              { value: 'Agent', label: 'Agent' },
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            value={period}
            onValueChange={setPeriod}
            aria-label="Filtrer par période"
            options={[
              { value: '7', label: '7 derniers jours' },
              { value: '30', label: '30 derniers jours' },
            ]}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Horodatage', 'Acteur', 'Action', 'Entité', ''].map((h) => (
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
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-primary">
                    {e.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{e.actor}</p>
                    <p className="font-mono text-xs text-text-secondary">{e.actorRole}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ActionTag action={e.action} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-text-primary">{e.entityType}</span>
                    <span className="text-text-secondary"> · {e.entityLabel}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setOpenId(e.id)}>
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Volumétrie : la pagination serveur viendra avec l'API. */}
        <p className="border-t border-border px-4 py-3 font-mono text-xs text-text-secondary">
          {rows.length} sur 12 480 entrées (filtres : {period} jours) · page 1/2080
        </p>
      </Card>

      {/* Détail : panneau latéral, le contexte de la table reste visible. */}
      <SidePanel
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
      >
        <SidePanelContent>
          {selected ? (
            <>
              <SidePanelHeader>
                <ActionTag action={selected.action} />
                <span className="font-mono text-xs text-text-secondary">{selected.id}</span>
              </SidePanelHeader>

              <SidePanelBody>
                <SidePanelTitle className="px-5 py-3 text-h3 text-text-primary">
                  {selected.entityType} · {selected.entityLabel}
                </SidePanelTitle>

                <SidePanelRow label="Horodatage">
                  <span className="font-mono text-xs">{selected.timestampUtc}</span>
                </SidePanelRow>
                <SidePanelRow label="Acteur">
                  <span className="font-mono text-xs">
                    {selected.actor} · {selected.actorRole}
                  </span>
                </SidePanelRow>
                <SidePanelRow label="Session">
                  <span className="font-mono text-xs">{selected.session}</span>
                </SidePanelRow>
                <SidePanelRow label="Origine">
                  <span className="font-mono text-xs">{selected.origin}</span>
                </SidePanelRow>
                <SidePanelRow label="Notification">
                  <span className="font-mono text-xs">{selected.notification}</span>
                </SidePanelRow>

                {selected.diff ? (
                  <div className="px-5 py-4">
                    <p className="mb-2 text-sm text-text-secondary">Changement</p>
                    <pre className="overflow-x-auto rounded-md bg-surface-page p-3 font-mono text-xs">
                      {selected.diff.before.map((l) => (
                        <span key={l} className="block text-danger">
                          - {l}
                        </span>
                      ))}
                      {selected.diff.after.map((l) => (
                        <span key={l} className="block text-success">
                          + {l}
                        </span>
                      ))}
                    </pre>
                  </div>
                ) : null}
              </SidePanelBody>

              <SidePanelFooter>
                <Button variant="secondary" size="sm">
                  Copier l’entrée (JSON)
                </Button>
              </SidePanelFooter>
            </>
          ) : null}
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
