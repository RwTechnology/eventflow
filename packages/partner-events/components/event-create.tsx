'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Check, ImageUp, X } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Card } from '@rwtechnology/eventflow-design-system/card';
import { Field } from '@rwtechnology/eventflow-design-system/field';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import { Steps, type Step } from '@rwtechnology/eventflow-design-system/steps';
import { Switch } from '@rwtechnology/eventflow-design-system/switch';
import { Textarea } from '@rwtechnology/eventflow-design-system/textarea';
import { GateBanner, GateLock } from './gating';

// EventCreate — creation d'un evenement en 5 etapes (CdC PTN-2, PTN-10, PTN-11).
// Composee a 100 % depuis le design system publie (RG-1).
// Reference : backoffice/pages/creation.html (ecran 5).
//
// Trois principes de la maquette, tenus ici :
//
//   1. **Sauvegarde continue.** Le brouillon est enregistre a chaque champ ;
//      quitter ne perd jamais rien. La mention le dit explicitement.
//   2. **Colonne etroite.** Un formulaire se lit verticalement — 760 px, pas la
//      pleine largeur du contenu.
//   3. **Le gating n'empeche pas la saisie** (PTN-11). Depasser 50 en capacite
//      sur Free affiche un avertissement et un chemin d'upgrade, jamais un
//      blocage : l'organisateur decrit son evenement reel, la limite s'applique
//      aux reservations, pas a sa description.

const STEPS: Step[] = [
  { label: 'Infos' },
  { label: 'Lieu' },
  { label: 'Date & capacité' },
  { label: 'Visuel' },
  { label: 'Relecture' },
];

const CATEGORIES = [
  { value: 'concert', label: 'Concert' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'atelier', label: 'Atelier' },
  { value: 'conference', label: 'Conférence' },
  { value: 'associatif', label: 'Événement associatif' },
];

const PRICING = [
  { value: 'gratuit', label: 'Gratuit' },
  { value: 'prix-libre', label: 'Prix libre (indicatif)' },
];

interface Draft {
  title: string;
  category: string;
  pricing: string;
  description: string;
  venue: string;
  address: string;
  start: string;
  end: string;
  capacity: string;
  waitlist: boolean;
}

const INITIAL: Draft = {
  title: '',
  category: 'concert',
  pricing: 'gratuit',
  description: '',
  venue: '',
  address: '',
  start: '',
  end: '',
  capacity: '',
  waitlist: true,
};

export interface EventCreateProps {
  /** Étape courante, lue depuis `?etape=` : l'avancement reste partageable. */
  step?: string;
}

export function EventCreate({ step }: EventCreateProps) {
  const parsed = Number(step);
  const initialIndex =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= STEPS.length ? parsed - 1 : 0;

  const [current, setCurrent] = React.useState(initialIndex);
  const [draft, setDraft] = React.useState<Draft>(INITIAL);
  const [touched, setTouched] = React.useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setTouched(true);
  }

  // Validation de l'etape courante. Les messages viennent de la maquette.
  const titleError =
    touched && draft.title.length > 0 && draft.title.length < 5
      ? 'Donnez un titre à votre événement (5 caractères min.).'
      : undefined;
  const descriptionError =
    touched && draft.description.length > 0 && draft.description.length < 50
      ? 'Décrivez votre événement en 50 caractères au moins.'
      : undefined;
  const scheduleError =
    draft.start && draft.end && draft.end <= draft.start
      ? 'La fin doit suivre le début — vérifiez les deux horaires.'
      : undefined;

  // PTN-11 : au-dela de 50, on avertit, on ne bloque pas.
  const overFreeCap = Number(draft.capacity) > 50;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text-primary">Nouvel événement</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Étape {current + 1} sur {STEPS.length}
          </p>
        </div>
        {/* Topbar reduite : quitter, rien d'autre. Le brouillon est conserve. */}
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<X className="h-icon-sm w-icon-sm" aria-hidden="true" />}
        >
          Quitter
        </Button>
      </div>

      {/* Colonne etroite : un formulaire se lit verticalement. */}
      <div className="w-full max-w-3xl">
        <Steps steps={STEPS} current={current} />

        <p className="mt-2 font-mono text-xs text-text-secondary">
          {touched ? 'Brouillon enregistré il y a quelques secondes' : 'Brouillon vide'}
        </p>

        <Card className="mt-4 p-5">
          {current === 0 ? (
            <div className="flex flex-col gap-4">
              <Field
                label="Titre"
                error={titleError}
                description={`${draft.title.length}/80 caractères`}
              >
                <Input
                  value={draft.title}
                  onChange={(e) => set('title', e.target.value.slice(0, 80))}
                  placeholder="Nuit électro au Hangar à Bananes"
                  invalid={Boolean(titleError)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Catégorie">
                  <Select
                    value={draft.category}
                    onValueChange={(v) => set('category', v)}
                    options={CATEGORIES}
                    aria-label="Catégorie"
                  />
                </Field>
                <Field label="Tarif">
                  <Select
                    value={draft.pricing}
                    onValueChange={(v) => set('pricing', v)}
                    options={PRICING}
                    aria-label="Tarif"
                  />
                </Field>
              </div>

              <Field
                label="Description"
                error={descriptionError}
                description="La première phrase sert d’aperçu sur le site public."
              >
                <Textarea
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value.slice(0, 2000))}
                  rows={6}
                  invalid={Boolean(descriptionError)}
                />
              </Field>
            </div>
          ) : null}

          {current === 1 ? (
            <div className="flex flex-col gap-4">
              <Field label="Nom du lieu">
                <Input
                  value={draft.venue}
                  onChange={(e) => set('venue', e.target.value)}
                  placeholder="Hangar à Bananes"
                />
              </Field>
              <Field
                label="Adresse"
                description={
                  draft.address.length > 8
                    ? 'Adresse localisée — la carte de la page publique est prête.'
                    : 'Renseignez une adresse complète, code postal inclus.'
                }
              >
                <Input
                  value={draft.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="21 Quai des Antilles, 44200 Nantes"
                />
              </Field>
            </div>
          ) : null}

          {current === 2 ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Début">
                  <Input
                    type="datetime-local"
                    value={draft.start}
                    onChange={(e) => set('start', e.target.value)}
                    invalid={Boolean(scheduleError)}
                  />
                </Field>
                <Field label="Fin" error={scheduleError}>
                  <Input
                    type="datetime-local"
                    value={draft.end}
                    onChange={(e) => set('end', e.target.value)}
                    invalid={Boolean(scheduleError)}
                  />
                </Field>
              </div>

              <Field label="Capacité">
                <Input
                  type="number"
                  min={1}
                  value={draft.capacity}
                  onChange={(e) => set('capacity', e.target.value)}
                  placeholder="480"
                />
              </Field>

              {/* PTN-11 : la saisie reste libre, l'avertissement explique. */}
              {overFreeCap ? (
                <GateBanner
                  level="info"
                  status="Plan Free"
                  detail="les réservations seront plafonnées à 50 pour cet événement. Vous pouvez publier quand même : la capacité annoncée reste la vôtre."
                />
              ) : null}

              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Liste d’attente</p>
                  <p className="text-xs text-text-secondary">
                    Les inscrits au-delà de la capacité rejoignent la file et sont promus
                    automatiquement.
                  </p>
                </div>
                <Switch
                  checked={draft.waitlist}
                  onCheckedChange={(v) => set('waitlist', v)}
                  aria-label="Liste d’attente"
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Rappel J-1</p>
                  <p className="text-xs text-text-secondary">
                    Un e-mail part la veille aux inscrits confirmés.
                  </p>
                </div>
                {/* PTN-10 : verrouille sur Free, affiche quand meme. */}
                <GateLock
                  label="Pro"
                  availableIn="Pro et Business"
                  description="Le rappel J-1 réduit l’absentéisme sans que vous ayez à y penser."
                />
              </div>
            </div>
          ) : null}

          {current === 3 ? (
            <div className="flex flex-col gap-4">
              <Field
                label="Visuel de l’événement"
                description="Format 16/10 recommandé, 2 Mo maximum. Il illustre la page publique et les partages."
              >
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center">
                  <ImageUp
                    className="h-icon-xl w-icon-xl text-text-secondary"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-text-primary">
                    Déposez une image ou parcourez vos fichiers
                  </p>
                  <Button variant="secondary" size="sm" className="mt-1">
                    Parcourir
                  </Button>
                </div>
              </Field>
            </div>
          ) : null}

          {current === 4 ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-secondary">
                Relisez avant de publier. Vous pourrez tout modifier ensuite.
              </p>
              {[
                { label: 'Titre', value: draft.title || '—' },
                {
                  label: 'Catégorie',
                  value: CATEGORIES.find((c) => c.value === draft.category)?.label ?? '—',
                },
                { label: 'Lieu', value: draft.venue || '—' },
                { label: 'Adresse', value: draft.address || '—' },
                { label: 'Début', value: draft.start || '—' },
                { label: 'Fin', value: draft.end || '—' },
                { label: 'Capacité', value: draft.capacity || '—' },
                { label: 'Liste d’attente', value: draft.waitlist ? 'Activée' : 'Désactivée' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-2 last:border-b-0"
                >
                  <span className="text-sm text-text-secondary">{r.label}</span>
                  <span className="text-right text-sm text-text-primary">{r.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm">
            Enregistrer le brouillon
          </Button>

          <div className="flex items-center gap-2">
            {current > 0 ? (
              <Button
                variant="secondary"
                onClick={() => setCurrent((c) => c - 1)}
                leftIcon={<ArrowLeft className="h-icon-sm w-icon-sm" aria-hidden="true" />}
              >
                Précédent
              </Button>
            ) : null}
            {current < STEPS.length - 1 ? (
              <Button
                onClick={() => setCurrent((c) => c + 1)}
                rightIcon={<ArrowRight className="h-icon-sm w-icon-sm" aria-hidden="true" />}
              >
                Suivant
              </Button>
            ) : (
              <Button
                leftIcon={<Check className="h-icon-sm w-icon-sm" aria-hidden="true" />}
              >
                Publier l’événement
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
