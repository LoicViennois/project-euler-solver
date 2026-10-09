import { Link } from '@tanstack/react-router';
import { Code } from 'lucide-react';
import { memo } from 'react';

import { hasSolution, problemUrl } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { useRun } from '../lib/solver';
import { SolveButton } from './SolveButton';

export const ProblemTile = memo(function ProblemTile({ id }: { id: number }) {
  const run = useRun(id);
  const available = hasSolution(id);
  const solved = run?.status === 'solved';

  return (
    <article
      data-testid={`problem-${id}`}
      data-solved={solved}
      className={`relative flex min-h-36 flex-col rounded-xl border bg-surface p-3.5 transition-colors ${
        available ? 'border-line' : 'border-dashed border-line bg-transparent'
      } ${solved ? 'shadow-[inset_4px_0_0_var(--copper)]' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <a
          href={problemUrl(id)}
          target="_blank"
          rel="noopener"
          className="group -m-1 rounded p-1 leading-none"
        >
          <span className="block text-sm text-ink-soft group-hover:text-ink">
            Problem
          </span>
          <span className="text-3xl font-semibold tabular-nums group-hover:text-copper-text">
            {id}
          </span>
        </a>
        {available && <SolveButton id={id} run={run} />}
      </div>

      {available ? (
        <>
          <p className="mt-auto pt-3">
            <span className="sr-only">Answer: </span>
            {solved ? (
              <span
                key={run.value}
                data-testid="answer"
                className="inline-block animate-reveal font-digits text-lg font-semibold break-all"
              >
                {run.value}
              </span>
            ) : (
              <span
                data-testid="answer"
                className="font-digits text-lg text-ink-soft"
              >
                {run?.status === 'failed' ? 'Failed' : '—'}
              </span>
            )}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2 text-sm text-ink-soft">
            <span data-testid="duration" className="font-digits">
              <span className="sr-only">Solved in </span>
              {solved ? formatDuration(run.duration) : ''}
            </span>
            <Link
              to="/code/$id"
              params={{ id }}
              aria-label={`Code for problem ${id}`}
              className="-mr-1 flex items-center gap-1 rounded px-1 font-semibold text-ink-soft hover:text-ink"
            >
              <Code className="size-4" aria-hidden />
              Code
            </Link>
          </div>
        </>
      ) : (
        <p className="mt-auto pt-3 text-sm text-ink-soft">Not solved yet</p>
      )}
    </article>
  );
});
