import { Link } from '@tanstack/react-router';
import { Code, PencilLine } from 'lucide-react';
import { memo, useState } from 'react';

import { hasSolution, problemUrl } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { useRun } from '../lib/solver';
import { SolveButton } from './SolveButton';

export const ProblemTile = memo(function ProblemTile({ id }: { id: number }) {
  const run = useRun(id);
  const available = hasSolution(id);
  const solved = run?.status === 'solved';
  const busy = run?.status === 'queued' || run?.status === 'solving';
  // Only celebrate a solve that happens on screen, not one found on mount.
  const [solvedOnMount] = useState(solved);

  return (
    <article
      data-testid={`problem-${id}`}
      data-solved={solved}
      className={`grid min-h-18 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border px-3 py-2.5 transition duration-300 ${
        !available
          ? 'border-dashed border-line'
          : solved
            ? `border-solved/40 bg-solved-surface ${solvedOnMount ? '' : 'animate-glow'}`
            : busy
              ? 'border-copper/60 bg-surface'
              : 'border-line bg-surface hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-14px_var(--ink)]'
      }`}
    >
      <a
        href={problemUrl(id)}
        target="_blank"
        rel="noopener"
        className="-m-1 rounded p-1 text-2xl leading-none font-bold tabular-nums transition-colors hover:text-copper-text"
      >
        <span className="sr-only">Problem </span>
        {id}
      </a>

      {available ? (
        <>
          <div className="min-w-0">
            <p className="leading-tight">
              <span className="sr-only">Answer: </span>
              {solved ? (
                <span
                  key={run.value}
                  data-testid="answer"
                  className="inline-block animate-reveal font-digits font-semibold break-all"
                >
                  {run.value}
                </span>
              ) : (
                <span
                  data-testid="answer"
                  className="font-digits text-ink-soft"
                >
                  {run?.status === 'failed' ? 'Failed' : '—'}
                </span>
              )}
            </p>
            <div className="mt-0.5 flex items-center gap-3 text-sm text-ink-soft">
              {solved && (
                <span
                  data-testid="duration"
                  className="animate-fade-in font-digits"
                >
                  <span className="sr-only">Solved in </span>
                  {formatDuration(run.duration)}
                </span>
              )}
              <Link
                to="/code/$id"
                params={{ id }}
                aria-label={`Code for problem ${id}`}
                className="group/code -mx-1 flex items-center gap-1 rounded px-1 font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                <Code
                  className="size-4 transition-transform group-hover/code:scale-110"
                  aria-hidden
                />
                Code
              </Link>
            </div>
          </div>
          <SolveButton id={id} run={run} />
        </>
      ) : (
        <p className="col-span-2 flex items-center gap-2 text-ink-soft">
          <PencilLine
            className="size-4 shrink-0 origin-bottom-left animate-wiggle"
            aria-hidden
          />
          Working on it…
        </p>
      )}
    </article>
  );
});
