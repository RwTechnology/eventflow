'use client';

import * as React from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Field } from '@rwtechnology/eventflow-design-system/field';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@rwtechnology/eventflow-design-system/modal';

// SuspendOrganization — zone sensible de la fiche Organisation et sa modale de
// confirmation (CdC CSM-2). Composee a 100 % depuis le design system (RG-1).
// Reference : backoffice/pages/partenaires.html, modale de suspension (ecran 11).
//
// La maquette exige une confirmation serieuse : les consequences sont chiffrees
// AVANT l'ouverture de la modale, et le bouton danger reste desactive tant que
// le slug saisi ne correspond pas exactement.
//
// La suspension n'est pas appliquee : le backend est un chantier separe
// (CdC §9.4). Le composant remonte l'intention par `onConfirm`.

export interface SuspendOrganizationProps {
  /** Nom affiche dans le titre de la modale. */
  name: string;
  /** Slug a saisir pour confirmer. Ignore a la reactivation. */
  slug: string;
  /** Consequences chiffrees, listees dans la modale. */
  consequences: React.ReactNode[];
  /** Resume affiche dans la zone sensible, avant ouverture. */
  summary: React.ReactNode;
  /**
   * Organisation deja suspendue : la zone bascule sur la reactivation.
   * Motif inverse (maquette ecran 11) — bouton outline, confirmation simple,
   * **pas de saisie du slug** : on ne met pas de friction sur un retour en
   * arriere, seulement sur l'action destructrice.
   */
  suspended?: boolean;
  /** Appele a la confirmation. Sans handler, la modale se ferme simplement. */
  onConfirm?: () => void;
}

export function SuspendOrganization({
  name,
  slug,
  consequences,
  summary,
  suspended = false,
  onConfirm,
}: SuspendOrganizationProps) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState('');

  // Confirmation par saisie exacte du slug (maquette ecran 11), suspension
  // seulement. La reactivation se confirme d'un clic.
  const matches = suspended || typed.trim() === slug;

  // La saisie repart a zero a chaque ouverture : une confirmation ne se
  // pre-remplit pas. Fait dans le handler d'ouverture, pas dans un effet :
  // un setState synchrone dans useEffect declenche un rendu en cascade.
  function handleOpenChange(next: boolean) {
    if (next) setTyped('');
    setOpen(next);
  }

  return (
    <div
      className={
        suspended
          ? 'rounded-lg border border-border bg-surface-raised p-5'
          : 'rounded-lg border border-danger/40 bg-danger/5 p-5'
      }
    >
      <h2
        className={`flex items-center gap-2 text-sm font-semibold ${
          suspended ? 'text-text-secondary' : 'text-danger'
        }`}
      >
        <TriangleAlert className="h-icon-sm w-icon-sm" aria-hidden="true" />
        {suspended ? 'Compte suspendu' : 'Zone sensible'}
      </h2>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-64 flex-1">
          <p className="text-sm font-semibold text-text-primary">
            {suspended ? 'Réactiver l’Organisation' : 'Suspendre l’Organisation'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">{summary}</p>
        </div>

        <Modal open={open} onOpenChange={handleOpenChange}>
          {/* Reactivation en outline : un retour en arriere n'est pas destructeur. */}
          <Button
            variant={suspended ? 'secondary' : 'danger'}
            size="sm"
            onClick={() => handleOpenChange(true)}
          >
            {suspended ? 'Réactiver' : 'Suspendre'}
          </Button>

          <ModalContent size="md">
            <ModalHeader>
              <ModalTitle>
                {suspended ? 'Réactiver' : 'Suspendre'} « {name} » ?
              </ModalTitle>
              <ModalDescription>
                Cette action prend effet immédiatement et sera consignée dans l’AuditLog
                avec votre identifiant.
              </ModalDescription>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {consequences.map((c, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-text-primary before:text-danger before:content-['•']"
                  >
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              {/* Pas de saisie a la reactivation : la friction est reservee a
                  l'action destructrice (maquette ecran 11). */}
              {suspended ? null : (
                <Field
                  label="Pour confirmer, saisissez le slug de l’Organisation"
                  description={slug}
                >
                  <Input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={slug}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </Field>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              {/* Suspension : desactive tant que la saisie ne correspond pas. */}
              <Button
                variant={suspended ? 'primary' : 'danger'}
                disabled={!matches}
                onClick={() => {
                  onConfirm?.();
                  setOpen(false);
                }}
              >
                {suspended ? 'Réactiver l’Organisation' : 'Suspendre l’Organisation'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
