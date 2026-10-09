import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { ArrowLeft, FileCode } from 'lucide-react';

import { solutionName, solvedIds } from '../lib/catalog';

export const Route = createFileRoute('/code')({
  component: CodeLayout,
});

function CodeLayout() {
  return (
    <>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All problems
      </Link>
      <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav
          aria-label="Solutions"
          className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] self-start overflow-y-auto rounded-xl border border-line bg-surface py-2 lg:block"
        >
          <ul>
            {solvedIds.map((id) => (
              <li key={id}>
                <Link
                  to="/code/$id"
                  params={{ id }}
                  className="flex items-center gap-2 px-4 py-1 font-digits text-sm text-ink-soft hover:bg-tint hover:text-ink aria-[current=page]:bg-tint aria-[current=page]:font-bold aria-[current=page]:text-copper-text"
                >
                  <FileCode className="size-3.5 shrink-0" aria-hidden />
                  {solutionName(id)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
