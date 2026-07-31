'use client';

import * as React from 'react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Field } from '@rwtechnology/eventflow-design-system/field';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@rwtechnology/eventflow-design-system/modal';
import { Select } from '@rwtechnology/eventflow-design-system/select';
import { Textarea } from '@rwtechnology/eventflow-design-system/textarea';

// DepublishDialog — depublication d'un evenement signale avec motif notifie au
// partenaire (CdC CSM-3). Compose a 100 % depuis le design system (RG-1).
// Reference : backoffice/pages/moderation.html, modale de depublication.
//
// Le libelle du bouton porte les DEUX effets : « Depublier et notifier ». Pas de
// notification silencieuse. Les precisions partent telles quelles par e-mail,
// d'ou le texte pre-redige et le hint qui rappelle de rester actionnable.
//
// Rien n'est applique : le backend est un chantier separe (CdC §9.4).

const REASONS = [
  { value: 'trompeur', label: 'Contenu trompeur — informations tarifaires contradictoires' },
  { value: 'adresse', label: 'Adresse ou lieu invalide' },
  { value: 'inapproprie', label: 'Contenu inapproprié' },
  { value: 'fraude', label: 'Suspicion de fraude / usurpation' },
  { value: 'autre', label: 'Autre (préciser)' },
];

export interface DepublishDialogProps {
  /** Titre de l'evenement, repris dans le titre de la modale. */
  title: string;
  /** Inscrits dont la reservation reste en suspens. */
  attendees: number;
  /** Precisions pre-redigees, modifiables avant envoi. */
  draft: string;
  /** Appele a la confirmation. */
  onConfirm?: () => void;
}

export function DepublishDialog({
  title,
  attendees,
  draft,
  onConfirm,
}: DepublishDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState(REASONS[0].value);
  const [details, setDetails] = React.useState(draft);

  // Le brouillon repart du texte pre-redige a chaque ouverture, jamais d'un
  // reliquat de la fois precedente. Fait dans le handler, pas dans un effet.
  function handleOpenChange(next: boolean) {
    if (next) {
      setReason(REASONS[0].value);
      setDetails(draft);
    }
    setOpen(next);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Button variant="danger" size="sm" onClick={() => handleOpenChange(true)}>
        Dépublier…
      </Button>

      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Dépublier {title} ?</ModalTitle>
          <ModalDescription>
            L’événement disparaît immédiatement du site public. Les {attendees} inscrits
            gardent leur réservation en suspens jusqu’à republication ou annulation par le
            partenaire.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <Field label="Motif (envoyé au partenaire par e-mail)">
            <Select
              value={reason}
              onValueChange={setReason}
              aria-label="Motif de dépublication"
              options={REASONS}
            />
          </Field>

          <Field
            label="Précisions pour le partenaire"
            description="Ce texte figure tel quel dans l’e-mail. Restez factuel et actionnable — le partenaire peut corriger et demander la republication."
          >
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          {/* Les deux effets sont dans le libelle (maquette ecran 12). */}
          <Button
            variant="danger"
            disabled={!details.trim()}
            onClick={() => {
              onConfirm?.();
              setOpen(false);
            }}
          >
            Dépublier et notifier
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
