import type { Metadata } from 'next';
import { Providers } from '@ef/shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventFlow Console',
};

// layout.tsx racine — écrit à la main.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
