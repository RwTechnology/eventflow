'use client';

import * as React from 'react';
import { Button } from '@rwtechnology/eventflow-design-system/button';
import { Alert } from '@rwtechnology/eventflow-design-system/alert';

// StaleDataBanner — bandeau d'erreur de rafraichissement (maquette ecran 9,
// etat 2). Compose a 100 % depuis le design system (RG-1).
//
// Principe de la maquette : **ne jamais jeter l'ecran**. Les dernieres donnees
// connues restent affichees, attenuees et en lecture seule ; le bandeau dit ce
// qui s'est passe, rassure, donne une reference tracable et une action.
//
// Un seul bandeau a la fois : un echec de « Reessayer » remet le bouton au repos
// sans empiler un second bandeau.

export interface StaleDataBannerProps {
  /** Ce qui n'a pas pu etre rafraichi, ex. « vos evenements ». */
  subject: string;
  /** Reference tracable, ex. « EF-5A2E ». */
  reference: string;
  /** Horodatage de l'incident. */
  timestamp: string;
  /** Appele au clic sur Reessayer. Doit resoudre, meme en cas d'echec. */
  onRetry?: () => Promise<void> | void;
}

export function StaleDataBanner({
  subject,
  reference,
  timestamp,
  onRetry,
}: StaleDataBannerProps) {
  const [retrying, setRetrying] = React.useState(false);

  async function handleRetry() {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      // Le bandeau reste en cas d'echec : on ne l'empile pas, on rend la main.
      setRetrying(false);
    }
  }

  return (
    <Alert tone="danger" role="alert">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-64 flex-1">
          <p className="text-sm font-semibold text-text-primary">
            Impossible de rafraîchir {subject}.
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Vos données ne sont pas perdues — nous affichons la dernière version connue.
          </p>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            ref {reference} · {timestamp} · signalée automatiquement
          </p>
        </div>
        {onRetry ? (
          <Button variant="secondary" size="sm" loading={retrying} onClick={handleRetry}>
            Réessayer
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}

/**
 * Enveloppe les dernieres donnees connues : attenuees, en lecture seule, avec la
 * note qui dit d'ou elles viennent (maquette ecran 9).
 */
export function StaleDataRegion({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="pointer-events-none opacity-60" aria-disabled="true">
        {children}
      </div>
      <p className="mt-2 font-mono text-xs text-text-secondary">
        données du dernier chargement (lecture seule)
      </p>
    </div>
  );
}
