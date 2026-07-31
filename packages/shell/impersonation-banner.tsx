'use client';

import { Eye } from 'lucide-react';
import { Button } from '@rwtechnology/eventflow-design-system/button';

// ImpersonationBanner — bandeau persistant de la vue « en tant que » (CdC CSM-5).
// Compose a 100 % depuis le design system (RG-1).
// Reference : backoffice/Ecran 11 - Partenaires.html.
//
// Le super-admin consulte la console d'un partenaire en LECTURE SEULE. Le
// bandeau reste visible tant que dure l'emprunt : c'est le seul repere qui
// distingue « je regarde le compte de X » de « je suis X ». Il ne se ferme pas,
// il se quitte.
//
// Rendu en haut du viewport, au-dessus du lisere maitre, pour la meme raison :
// un contexte emprunte ne doit jamais etre confondable.

export interface ImpersonationBannerProps {
  /** Nom de l'Organisation consultee. */
  organization: string;
  /** Quitte la vue empruntee et revient a la Console Maitre. */
  onExit?: () => void;
}

export function ImpersonationBanner({ organization, onExit }: ImpersonationBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-center gap-3 bg-warning px-4 py-2 text-sm text-gray-950"
    >
      <Eye className="h-icon-sm w-icon-sm shrink-0" aria-hidden="true" />
      <span>
        Vous consultez la console de <strong className="font-semibold">{organization}</strong>{' '}
        en lecture seule
      </span>
      {onExit ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={onExit}
          className="bg-gray-950 text-gray-100 hover:bg-gray-950/90"
        >
          Quitter
        </Button>
      ) : null}
    </div>
  );
}
