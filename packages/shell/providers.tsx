'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@rwtechnology/eventflow-design-system/tooltip';

// providers — enveloppe client partagée (auth session + react-query + tooltips)
// montée dans le layout racine de chaque app.
//
// `TooltipProvider` vit ici et non au point d'usage : le `Tooltip` du design
// system lève une erreur sans lui, et une app peut en afficher n'importe où.
// Le monter une fois à la racine évite d'y penser à chaque usage.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
