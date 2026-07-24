'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

// login-form — formulaire de connexion partagé (infra). L'auth réelle est
// composée par module via @ef/auth ; ici on déclenche signIn().
export function LoginForm({ brand }: { brand: string }) {
  const [pending, setPending] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted">
      <div className="w-80 rounded-lg border border-surface-border bg-surface p-6 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold text-brand">{brand}</h1>
        <button
          type="button"
          disabled={pending}
          className="w-full rounded bg-brand px-3 py-2 text-brand-fg disabled:opacity-50"
          onClick={() => {
            setPending(true);
            void signIn();
          }}
        >
          {pending ? 'Connexion…' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
}
