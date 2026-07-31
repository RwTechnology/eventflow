import * as React from 'react';
import { Building2, CalendarDays, CircleCheck, Ticket } from 'lucide-react';
import { Avatar } from '@rwtechnology/eventflow-design-system/avatar';
import { Badge } from '@rwtechnology/eventflow-design-system/badge';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@rwtechnology/eventflow-design-system/card';
import { StatCard } from '@rwtechnology/eventflow-design-system/stat-card';
import {
  TrendChart,
  type TrendPoint,
} from '@rwtechnology/eventflow-design-system/trend-chart';
import { DashboardSkeleton, StaleDataBanner, StaleDataRegion } from '@ef/shell';

// PlatformDashboard — tableau de bord de la Console Maître (CdC CSM-1).
// Composé à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/console-dashboard.html (écran 10).
//
// Les données sont le jeu fictif du prototype, cohérent d'un écran à l'autre.
// Le backend est un chantier séparé (CdC §9.4, dépôt eventflow-api) : aucune
// donnée n'est appelée ici. Les valeurs vivent dans ce fichier et seront
// remplacées par les appels API le moment venu.

const STATS = [
  {
    label: 'Partenaires actifs',
    value: '128',
    icon: <Building2 />,
    delta: '+9 sur 30 jours',
    trend: 'up' as const,
  },
  {
    label: 'Événements publiés',
    value: '2 412',
    icon: <CalendarDays />,
    delta: '+184 sur 30 jours',
    trend: 'up' as const,
  },
  {
    label: 'Réservations',
    value: '58 240',
    icon: <Ticket />,
    delta: '+4 926 sur 30 jours',
    trend: 'up' as const,
  },
  {
    label: 'Présence globale',
    value: '81 %',
    icon: <CircleCheck />,
    delta: 'stable · 30 jours',
    trend: 'flat' as const,
  },
];

// Série de la maquette : 30 jours, pics le week-end.
const SERIES: TrendPoint[] = [
  128, 142, 131, 118, 96, 167, 214, 182, 150, 139, 144, 126, 171, 236, 208, 161, 148, 152, 137,
  182, 248, 221, 173, 158, 164, 149, 186, 242, 231, 196,
].map((value, i) => ({ label: `J-${29 - i}`, value }));

const MODERATION = [
  {
    title: '« Soirée mousse XXL »',
    detail: 'Assoc. Court-Circuit · signalé 2 fois · contenu trompeur',
  },
  {
    title: '« Warm-up warehouse »',
    detail: 'Rennes en Scène · signalé 1 fois · adresse invalide',
  },
  {
    title: '« Concert caritatif »',
    detail: 'Anonyme · signalé 1 fois · doute sur l’organisateur',
  },
];

const NEW_PARTNERS = [
  { name: 'La Péniche Spectacle', detail: 'Rennes · 1er événement en brouillon' },
  { name: 'Café Brumaire', detail: 'Nantes · 2 événements publiés' },
  { name: 'Festival Aurores', detail: 'Saint-Nazaire · onboarding en cours' },
];

/** Ligne de liste des panneaux latéraux (modération, nouveaux partenaires). */
function MiniRow({
  leading,
  title,
  detail,
  trailing,
}: {
  leading?: React.ReactNode;
  title: React.ReactNode;
  detail: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0">
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
        <p className="truncate text-xs text-text-secondary">{detail}</p>
      </div>
      {trailing}
    </div>
  );
}

/** Etats transverses de l'ecran 9, montres dans le contexte reel du dashboard. */
export type DashboardState = 'chargement' | 'erreur';

export interface PlatformDashboardProps {
  /**
   * Etat de demonstration (maquette ecran 9). Sans valeur, le tableau de bord
   * affiche ses donnees. Le backend etant un chantier separe (CdC §9.4), ces
   * etats se declenchent par `?etat=` plutot que par un vrai chargement.
   */
  demoEtat?: DashboardState;
}

export function PlatformDashboard({ demoEtat }: PlatformDashboardProps) {
  // Chargement : le squelette reproduit la geometrie reelle, la page ne saute pas.
  if (demoEtat === 'chargement') return <DashboardSkeleton />;

  // En erreur, les dernieres donnees connues restent visibles mais attenuees et
  // en lecture seule ; sinon elles s'affichent normalement.
  const Stale = demoEtat === 'erreur' ? StaleDataRegion : React.Fragment;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Plateforme</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Mercredi 15 juillet · vue d’ensemble des 30 derniers jours
        </p>
      </div>

      {/* Erreur : on ne jette jamais l'ecran, les dernieres donnees restent. */}
      {demoEtat === 'erreur' ? (
        <StaleDataBanner
          subject="les données de la plateforme"
          reference="EF-5A2E"
          timestamp="15 juil. 11:42"
        />
      ) : null}

      {/* 4 tuiles : 2 colonnes sous 1280px, 4 au-delà (maquette écran 10) */}
      <Stale>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

      {/* Tendance à gauche, panneaux de contrôle à droite */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Réservations par jour</CardTitle>
            <span className="font-mono text-xs text-text-secondary">
              30 JOURS · TOTAL 4 926
            </span>
          </CardHeader>
          <div className="px-5 pb-4">
            <TrendChart
              data={SERIES}
              peakThreshold={200}
              unit="réservations"
              ticks={[0, 65, 130, 195, 260]}
              startLabel="J-30"
              endLabel="aujourd’hui"
              aria-label="Réservations confirmées par jour sur 30 jours"
              legend={
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-sm bg-primary-600"
                    aria-hidden="true"
                  />
                  Réservations confirmées / jour · pics le week-end
                </span>
              }
            />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Modération</CardTitle>
              <Badge tone="warning">3 en attente</Badge>
            </CardHeader>
            <div>
              {MODERATION.map((m) => (
                <MiniRow
                  key={m.title}
                  title={m.title}
                  detail={m.detail}
                  trailing={
                    <span className="shrink-0 text-sm font-medium text-primary-700">
                      Examiner
                    </span>
                  }
                />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Nouveaux partenaires</CardTitle>
              <span className="font-mono text-xs text-text-secondary">7 JOURS</span>
            </CardHeader>
            <div>
              {NEW_PARTNERS.map((p) => (
                <MiniRow
                  key={p.name}
                  leading={<Avatar name={p.name} size="sm" />}
                  title={p.name}
                  detail={p.detail}
                  trailing={<Badge tone="neutral">Free</Badge>}
                />
              ))}
            </div>
          </Card>
        </div>
        </div>
      </Stale>
    </div>
  );
}
