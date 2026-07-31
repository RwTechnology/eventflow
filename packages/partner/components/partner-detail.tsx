'use client';

import * as React from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { Avatar } from '@rwtechnology/eventflow-design-system/avatar';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@rwtechnology/eventflow-design-system/card';
import { PlanMeter } from '@rwtechnology/eventflow-design-system/plan-meter';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import { StatusBadge } from '@rwtechnology/eventflow-design-system/status-badge';
import { SuspendOrganization } from './suspend-organization';

// PartnerDetail — fiche Organisation de la Console Maître (CdC CSM-2).
// Composée à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/partenaires.html, vue fiche (écran 11).
//
// Périmètre du lot : la fiche en lecture. La zone sensible et la modale de
// suspension font l'objet du lot suivant ; la vue « en tant que » (CSM-5) touche
// le shell et sera traitée à part.
//
// Données fictives du prototype. Le backend est un chantier séparé (CdC §9.4) :
// le changement de plan n'est pas appliqué, il est seulement présenté.

export interface PartnerDetailProps {
  /** Slug de l'Organisation. Le jeu fictif n'en contient qu'une. */
  slug?: string;
  /**
   * Etat de demonstration : `suspendu` bascule la zone sensible sur la
   * reactivation. Le backend est un chantier separe (CdC §9.4), l'etat reel
   * viendra de l'API.
   */
  demoEtat?: 'suspendu';
}

const ORGANIZATION = {
  slug: 'collectif-nuits-nantaises',
  name: 'Collectif Nuits Nantaises',
  initials: 'CN',
  city: 'Nantes',
  owner: 'Marc Guibert (propriétaire)',
  since: 'Sur EventFlow depuis juin 2023',
  plan: 'Free',
  status: 'active' as const,
  activity: [
    { key: 'Événements', value: '24 créés · 2 actifs · 1 brouillon · 21 terminés/archivés' },
    { key: 'Réservations', value: '6 830 cumulées · 148 sur 30 jours' },
    { key: 'Présence', value: '78 % en moyenne (12 derniers événements)' },
    { key: 'Agents', value: '1 agente active (Léa Bernard)' },
    { key: 'Signalements', value: 'aucun' },
    { key: 'Slug', value: 'collectif-nuits-nantaises' },
  ],
  // Les 3 limites du plan Free (CdC §4.4).
  usage: [
    { label: 'Événements actifs', used: 2, limit: 2 },
    { label: 'Réservations / événement (max constaté)', used: 50, limit: 50 },
    { label: 'Agents / événement', used: 1, limit: 1 },
  ],
  // Conséquences chiffrées de la suspension (maquette écran 11).
  suspendSummary:
    'Dépublie immédiatement ses 2 événements actifs, bloque l’accès à sa console et gèle les réservations. Les visiteurs déjà inscrits sont notifiés. Réversible.',
  suspendConsequences: [
    '2 événements actifs dépubliés — « Nuit électro » (374 réservations) et « Sunset session » (94).',
    '468 visiteurs inscrits notifiés par e-mail.',
    'L’accès du propriétaire à sa console est bloqué (lecture seule).',
    'Réactivation possible à tout moment depuis cette fiche.',
  ],
  reactivateSummary:
    'Republie ses événements dans l’état où ils étaient, rend l’accès à la console et réactive les réservations en attente.',
  reactivateConsequences: [
    '2 événements republiés dans leur état antérieur.',
    'L’accès du propriétaire à sa console est rétabli.',
    'Les réservations en suspens redeviennent actives.',
  ],
};

/** Ligne clé/valeur du bloc Activité : libellé à gauche, valeur mono à droite. */
function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-text-secondary">{label}</span>
      <span className="text-right font-mono text-xs text-text-primary">{value}</span>
    </div>
  );
}

export function PartnerDetail({ slug, demoEtat }: PartnerDetailProps) {
  const o = ORGANIZATION;
  const suspended = demoEtat === 'suspendu';
  const [plan, setPlan] = React.useState(o.plan);

  // Le jeu fictif ne porte qu'une Organisation : tout autre slug est signalé
  // plutôt que rendu avec des données qui ne lui correspondent pas.
  if (slug && slug !== o.slug) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 text-text-primary">Organisation introuvable</h1>
        <p className="text-sm text-text-secondary">
          Le jeu de démonstration ne contient que « {o.name} ».
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête : identité, statut, actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={o.name} fallback={o.initials} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1 text-text-primary">{o.name}</h1>
              <Badge tone="neutral" className="font-mono text-xs uppercase tracking-wider">
                {o.plan}
              </Badge>
              <StatusBadge
                status={suspended ? 'suspended' : o.status}
                label={suspended ? 'Suspendue le 2 juil.' : undefined}
              />
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {o.city} · {o.owner} · {o.since}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSM-5 : la vue « en tant que » touche le shell, hors de ce lot.
              L'icône passe par `leftIcon`, pas en enfant : le composant gère
              l'espacement et l'alignement. */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye className="h-icon-sm w-icon-sm" aria-hidden="true" />}
          >
            Voir en tant que (lecture seule)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ExternalLink className="h-icon-sm w-icon-sm" aria-hidden="true" />}
          >
            Page publique
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité</CardTitle>
          </CardHeader>
          <div>
            {o.activity.map((row) => (
              <KeyValue key={row.key} label={row.key} value={row.value} />
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Consommation du plan</CardTitle>
              <span className="font-mono text-xs text-text-secondary">
                recalculée en direct
              </span>
            </CardHeader>
            <div className="grid gap-4 px-5 pb-5">
              {o.usage.map((u) => (
                <PlanMeter key={u.label} label={u.label} used={u.used} limit={u.limit} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changer le plan</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-3 px-5 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-48">
                  <Select
                    value={plan}
                    onValueChange={setPlan}
                    aria-label="Plan de l’Organisation"
                    options={[
                      { value: 'Free', label: 'Free (actuel)' },
                      { value: 'Pro', label: 'Pro' },
                      { value: 'Business', label: 'Business' },
                    ]}
                  />
                </div>
                {/* Non câblé : le changement de plan passera par l'API (CSM-2). */}
                <Button size="sm" disabled={plan === o.plan}>
                  Appliquer
                </Button>
              </div>
              <p className="text-xs text-text-secondary">
                Le changement est manuel et immédiat : les limites sont recalculées à
                l’application. Un e-mail notifie le propriétaire ; l’action est consignée
                dans l’AuditLog.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Zone sensible : les conséquences sont chiffrées avant même la modale. */}
      <SuspendOrganization
        name={o.name}
        slug={o.slug}
        suspended={suspended}
        summary={suspended ? o.reactivateSummary : o.suspendSummary}
        consequences={suspended ? o.reactivateConsequences : o.suspendConsequences}
      />
    </div>
  );
}
