'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, MailCheck, Ticket } from 'lucide-react';
import { AuthLayout } from '@rwtechnology/eventflow-design-system/auth-layout';
import { Alert } from '@rwtechnology/eventflow-design-system/alert';
import { Field } from '@rwtechnology/eventflow-design-system/field';
import { Input } from '@rwtechnology/eventflow-design-system/input';
import { PasswordInput } from '@rwtechnology/eventflow-design-system/password-input';
import { PasswordStrength } from '@rwtechnology/eventflow-design-system/password-strength';
import { Checkbox } from '@rwtechnology/eventflow-design-system/checkbox';
import { Button } from '@rwtechnology/eventflow-design-system/button';

// auth-page — corps de la page d'authentification (module @ef/auth). Reproduit
// fidèlement la maquette « Page 6 · Auth » du prototype : split panneau de marque
// + formulaire, trois vues (connexion / inscription / oubli). 100 % composé à
// partir des composants publiés du design system @rwtechnology — aucun style local.

type Vue = 'connexion' | 'inscription' | 'oubli';

const Brand = () => (
  <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-current no-underline">
    <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary-600 text-white">
      <Ticket className="h-4 w-4" aria-hidden="true" />
    </span>
    EventFlow
  </a>
);

export interface AuthPageProps {
  /** Vue initiale (route). Défaut : connexion. */
  vue?: Vue;
  /** État de démonstration de la maquette (erreur connexion / lien envoyé). */
  demoEtat?: 'erreur' | 'envoye';
}

export function AuthPage({ vue: initialVue = 'connexion', demoEtat }: AuthPageProps) {
  const [vue, setVue] = useState<Vue>(initialVue);
  const showLoginError = demoEtat === 'erreur' && vue === 'connexion';
  const showSentNote = demoEtat === 'envoye' && vue === 'oubli';

  return (
    <AuthLayout
      brand={<Brand />}
      headline="Votre prochaine soirée tient dans un QR code."
      tagline="Réservation gratuite, annulation en un clic, entrée scannée en trois secondes."
      back={
        <Button asChild variant="ghost" size="sm">
          <a href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour au site
          </a>
        </Button>
      }
    >
      {/* CONNEXION */}
      {vue === 'connexion' ? (
        <div className="animate-rise">
          <h1 className="text-h1 font-bold tracking-tight">Bon retour</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Pas encore de compte ?{' '}
            <button type="button" className="font-medium text-accent" onClick={() => setVue('inscription')}>
              Créez-le en une minute
            </button>
            .
          </p>

          {showLoginError ? (
            <Alert tone="danger" role="alert" className="mt-6">
              E-mail ou mot de passe incorrect. Vérifiez votre saisie ou{' '}
              <button type="button" className="font-medium underline" onClick={() => setVue('oubli')}>
                réinitialisez votre mot de passe
              </button>
              .
            </Alert>
          ) : null}

          <form className="mt-8 grid gap-4">
            <Field label="Adresse e-mail" htmlFor="email">
              <Input id="email" type="email" placeholder="sarah@exemple.fr" autoComplete="email" />
            </Field>
            <Field
              label="Mot de passe"
              htmlFor="pwd"
              error={showLoginError ? 'Mot de passe incorrect' : undefined}
            >
              <PasswordInput id="pwd" autoComplete="current-password" invalid={showLoginError} />
            </Field>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <Checkbox defaultChecked />
                Rester connectée
              </label>
              <button type="button" className="text-sm font-medium text-accent" onClick={() => setVue('oubli')}>
                Mot de passe oublié ?
              </button>
            </div>
            <Button type="button" size="lg" className="w-full">
              Se connecter
            </Button>
          </form>
        </div>
      ) : null}

      {/* INSCRIPTION */}
      {vue === 'inscription' ? (
        <div className="animate-rise">
          <h1 className="text-h1 font-bold tracking-tight">Créer un compte</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Déjà inscrite ?{' '}
            <button type="button" className="font-medium text-accent" onClick={() => setVue('connexion')}>
              Connectez-vous
            </button>
            .
          </p>

          <form className="mt-8 grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prénom" htmlFor="prenom">
                <Input id="prenom" type="text" placeholder="Sarah" autoComplete="given-name" />
              </Field>
              <Field label="Nom" htmlFor="nom">
                <Input id="nom" type="text" placeholder="Lemoine" autoComplete="family-name" />
              </Field>
            </div>
            <Field
              label="Adresse e-mail"
              htmlFor="email2"
              description="Vos QR codes seront envoyés ici"
            >
              <Input id="email2" type="email" defaultValue="sarah.lemoine@exemple.fr" autoComplete="email" />
            </Field>
            <Field label="Mot de passe" htmlFor="pwd2">
              <PasswordInput
                id="pwd2"
                defaultValue="nuits-nantaises"
                autoComplete="new-password"
                aria-describedby="pwd2-help"
              />
              <PasswordStrength score={3} label="Moyen" className="mt-2" />
              <p id="pwd2-help" className="mt-1 text-xs text-text-secondary">
                8 caractères minimum, dont un chiffre — ajoutez un chiffre pour renforcer
              </p>
            </Field>
            <Button type="button" size="lg" className="w-full">
              Créer mon compte
            </Button>
            <p className="text-xs leading-4 text-text-secondary">
              En créant un compte, vous acceptez les <a href="/legal" className="text-accent">CGU</a> et la{' '}
              <a href="/legal" className="text-accent">politique de confidentialité</a>. Aucune newsletter sans
              votre accord.
            </p>
          </form>
        </div>
      ) : null}

      {/* MOT DE PASSE OUBLIÉ */}
      {vue === 'oubli' ? (
        <div className="animate-rise">
          <h1 className="text-h1 font-bold tracking-tight">Réinitialiser le mot de passe</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Indiquez votre e-mail : nous vous envoyons un lien valable 1 heure.
          </p>

          {showSentNote ? (
            <Alert tone="success" role="status" icon={<MailCheck className="h-icon-md w-icon-md" />} className="mt-6">
              Si un compte existe pour <b>sarah.lemoine@exemple.fr</b>, un lien de réinitialisation vient d’être
              envoyé. Pensez aux indésirables.
            </Alert>
          ) : null}

          <form className="mt-8 grid gap-4">
            <Field label="Adresse e-mail" htmlFor="email3">
              <Input id="email3" type="email" placeholder="sarah@exemple.fr" autoComplete="email" />
            </Field>
            <Button type="button" size="lg" className="w-full" leftIcon={<Mail className="h-4 w-4" />}>
              Envoyer le lien
            </Button>
            <p className="text-center text-xs">
              <button type="button" className="text-accent" onClick={() => setVue('connexion')}>
                ← Retour à la connexion
              </button>
            </p>
          </form>
        </div>
      ) : null}
    </AuthLayout>
  );
}
