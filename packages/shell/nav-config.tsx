'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Module } from '@ef/module-kit';

// nav-config — construit la nav à partir du registry de modules (P8).
// L'ordre des modules = ordre des eyebrows.
export function ModuleNav({ modules }: { modules: Module[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-4 p-4">
      {modules.map((m) => {
        const section = m.useNavSection();
        return (
          <div key={m.id} className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              {section.eyebrow}
            </span>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'rounded px-2 py-1 bg-brand text-brand-fg'
                      : 'rounded px-2 py-1 hover:bg-surface-muted'
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
