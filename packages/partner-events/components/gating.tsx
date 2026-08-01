'use client';

import * as React from 'react';
import { Info, Lock, TriangleAlert } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@rwtechnology/eventflow-design-system/modal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rwtechnology/eventflow-design-system/popover';

// Gating — les 4 états de l'écran 8 (CdC PTN-11, PTN-10, principe §4.4).
// Composés à 100 % depuis le design system publié (RG-1).
// Référence : backoffice/pages/gating.html.
//
// DOCTRINE, appliquée aux 4 états et rappelée ici parce qu'elle se perd vite :
//
//   1. Toujours visible, jamais caché. Une fonctionnalité verrouillée reste
//      affichée avec son cadenas : l'utilisateur sait ce qui existe.
//   2. Trois informations, toujours : où j'en suis, pourquoi, comment avancer.
//      L'upgrade n'est jamais la seule issue proposée.
//   3. Ton factuel. « Rien n'est perdu », « se libère automatiquement ».
//      Pas d'urgence artificielle, pas de compte à rebours.
//   4. `warning` pour la limite atteinte, jamais `danger` : atteindre une
//      limite n'est pas une erreur. `primary` pour l'approche de limite.

export type GateLevel = 'info' | 'limit';

export interface GateBannerProps {
  /** `info` à l'approche, `limit` à la limite atteinte. */
  level?: GateLevel;
  /** Où j'en suis, ex. « 2/2 événements actifs ». */
  status: React.ReactNode;
  /** Pourquoi et comment avancer. */
  detail: React.ReactNode;
  /** Action de sortie. Jamais primaire dans une bannière (maquette écran 8). */
  onSeePlan?: () => void;
}

export function GateBanner({
  level = 'limit',
  status,
  detail,
  onSeePlan,
}: GateBannerProps) {
  const isLimit = level === 'limit';
  const Icon = isLimit ? TriangleAlert : Info;

  return (
    <div
      className={[
        'flex flex-wrap items-center gap-3 rounded-md border px-4 py-3',
        isLimit
          ? 'border-warning/40 bg-warning/10'
          : 'border-primary-300 bg-surface-selected/60',
      ].join(' ')}
    >
      <Icon
        className={`h-icon-md w-icon-md shrink-0 ${isLimit ? 'text-warning' : 'text-primary-600'}`}
        aria-hidden="true"
      />
      <p className="min-w-64 flex-1 text-sm text-text-primary">
        <strong className="font-semibold">{status}</strong> — {detail}
      </p>
      {onSeePlan ? (
        // Ghost à l'approche, secondary à la limite : jamais primaire, la
        // bannière informe, elle ne pousse pas.
        <Button variant={isLimit ? 'secondary' : 'ghost'} size="sm" onClick={onSeePlan}>
          Voir le plan
        </Button>
      ) : null}
    </div>
  );
}

export interface GateOption {
  title: string;
  detail: string;
}

export interface GateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Titre dédramatisé (maquette écran 8). */
  title: string;
  /** Rappel que rien n'est perdu. */
  reassurance: string;
  /** Les issues, présentées à égalité — l'upgrade est une option parmi d'autres. */
  options: GateOption[];
  onSeePlan?: () => void;
}

export function GateModal({
  open,
  onOpenChange,
  title,
  reassurance,
  options,
  onSeePlan,
}: GateModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{reassurance}</ModalDescription>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-2">
          {/* Trois options équivalentes : attendre, archiver, passer en Pro.
              Aucune n'est mise en avant visuellement. */}
          {options.map((o) => (
            <div key={o.title} className="rounded-md border border-border px-4 py-3">
              <p className="text-sm font-semibold text-text-primary">{o.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{o.detail}</p>
            </div>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button variant="secondary" onClick={onSeePlan}>
            Voir le plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface GateLockProps {
  /** Libellé de la fonctionnalité verrouillée : elle reste visible. */
  label: string;
  /** Plans qui l'incluent. */
  availableIn: string;
  /** Ce que la fonctionnalité apporte, pour que le verrou soit informatif. */
  description: string;
  onSeePlan?: () => void;
}

/**
 * Fonctionnalité verrouillée : affichée avec son cadenas, jamais masquée. Le
 * popover explique ce qu'elle fait et où elle est disponible.
 */
export function GateLock({ label, availableIn, description, onSeePlan }: GateLockProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Lock className="h-icon-sm w-icon-sm" aria-hidden="true" />}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <p className="text-sm font-semibold text-text-primary">
          Réservé aux plans {availableIn}
        </p>
        <p className="mt-1.5 text-xs text-text-secondary">{description}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={onSeePlan}>
          Voir le plan
        </Button>
      </PopoverContent>
    </Popover>
  );
}
