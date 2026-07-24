'use client';

import { useState } from 'react';

// theme-toggle — bascule de thème minimale (stub d'infra). Étend le
// data-attribute sur <html> ; le vrai thème vit dans le preset Tailwind.
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <button
      type="button"
      aria-label="Basculer le thème"
      className="rounded px-2 py-1 text-sm hover:bg-surface-muted"
      onClick={() => {
        const next = !dark;
        setDark(next);
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = next ? 'dark' : 'light';
        }
      }}
    >
      {dark ? '☾' : '☀'}
    </button>
  );
}
