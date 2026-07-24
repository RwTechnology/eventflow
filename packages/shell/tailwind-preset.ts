import type { Config } from 'tailwindcss';

// Preset Tailwind local minimal (remplace le design system @cellpay/react,
// non disponible sur le registre npm public). Toute app l'utilise via
// `presets: [efPreset]` dans son tailwind.config.ts (P14).
//
// Ce preset ne définit PAS de `content` (chaque app scope le sien) — il ne
// porte que le thème partagé.
export const efPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4f46e5',
          fg: '#ffffff',
          muted: '#6366f1',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f5f7',
          border: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default efPreset;
