import { CalendarCheck, CircleCheck, Gauge, Ticket, TriangleAlert } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
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

// PartnerDashboard — tableau de bord de la Console Partenaire (CdC PTN-1).
// Composé à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/dashboard.html (écran 3).
//
// Données fictives du prototype, cohérentes avec la Console Maître : la même
// Organisation y apparaît en plan Free à 2/2 événements actifs. Le backend est
// un chantier séparé (CdC §9.4).

const ORGANIZATION = {
  owner: 'Marc',
  name: 'Collectif Nuits Nantaises',
};

const STATS = [
  {
    label: 'Réservations · 7 jours',
    value: '148',
    icon: <Ticket />,
    delta: '+22 % vs semaine précédente',
    trend: 'up' as const,
  },
  {
    label: 'Remplissage moyen',
    value: '64 %',
    icon: <Gauge />,
    delta: '+6 pts sur 30 jours',
    trend: 'up' as const,
  },
  {
    label: 'Événements actifs',
    value: '2/2',
    icon: <CalendarCheck />,
    delta: 'Limite du plan Free',
    trend: 'flat' as const,
  },
  {
    label: 'Présence · dernier évén.',
    value: '78 %',
    icon: <CircleCheck />,
    delta: '612/780 scannés · Fête de la musique',
    trend: 'flat' as const,
  },
];

// Inscriptions des 7 derniers jours, total 148 (maquette écran 3).
const SERIES: TrendPoint[] = [12, 18, 24, 16, 21, 29, 28].map((value, i) => ({
  label: `J-${6 - i}`,
  value,
}));

/**
 * Bandeau de gating (PTN-11) : la limite du plan est atteinte. Il dit ce qui est
 * bloqué, pourquoi, et donne le chemin de sortie — jamais un simple refus.
 */
function GateBanner() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-warning/40 bg-warning/10 px-4 py-3">
      <TriangleAlert className="h-icon-md w-icon-md shrink-0 text-warning" aria-hidden="true" />
      <p className="min-w-64 flex-1 text-sm text-text-primary">
        <strong className="font-semibold">2/2 événements actifs</strong> — votre plan Free
        est au maximum. Archivez un événement terminé ou passez en Pro pour en publier
        davantage.
      </p>
      <Button variant="secondary" size="sm">
        Voir le plan
      </Button>
    </div>
  );
}

export function PartnerDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1 text-text-primary">Bonjour {ORGANIZATION.owner}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Mercredi 15 juillet · voici l’activité de vos événements
        </p>
      </div>

      <GateBanner />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inscriptions des 7 derniers jours</CardTitle>
          <span className="font-mono text-xs text-text-secondary">total 148</span>
        </CardHeader>
        <div className="px-5 pb-4">
          <TrendChart
            data={SERIES}
            unit="inscriptions"
            startLabel="J-7"
            endLabel="aujourd’hui"
            aria-label="Inscriptions des 7 derniers jours"
          />
        </div>
      </Card>
    </div>
  );
}
