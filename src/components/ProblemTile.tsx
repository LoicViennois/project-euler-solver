import { Link } from '@tanstack/react-router';
import { ArrowRight, PencilLine } from 'lucide-react';
import { memo, useState } from 'react';

import { hasSolution } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { useRun } from '../lib/solver';
import { SolveButton } from './SolveButton';

const ONE_MINUTE = 60_000;

/** Share of Project Euler's one-minute budget used, on a log scale so fast runs still show. */
function budgetShare(duration: number): number {
  const share = Math.log10(duration + 1) / Math.log10(ONE_MINUTE + 1);
  return Math.min(1, Math.max(0.03, share));
}

export const ProblemTile = memo(function ProblemTile({ id }: { id: number }) {
  const run = useRun(id);
  const available = hasSolution(id);
  const solved = run?.status === 'solved';
  const busy = run?.status === 'queued' || run?.status === 'solving';
  // Only celebrate a solve that happens on screen, not one found on mount.
  const [solvedOnMount] = useState(solved);

  const title = (
    <>
      <span className="text-sm font-medium text-ink-soft">Problem</span>{' '}
      <span className="text-xl font-bold tabular-nums">{id}</span>
    </>
  );

  if (!available) {
    return (
      <article
        data-testid={`problem-${id}`}
        className="flex h-full flex-col justify-between gap-3 rounded-xl border border-dashed border-line p-3.5"
      >
        <h2 className="leading-none">{title}</h2>
        <p className="flex items-center gap-2 text-ink-soft">
          <PencilLine
            className="size-4 shrink-0 origin-bottom-left animate-wiggle"
            aria-hidden
          />
          Working on it…
        </p>
      </article>
    );
  }

  return (
    <article
      data-testid={`problem-${id}`}
      data-solved={solved}
      className={`group relative flex h-full flex-col gap-2 rounded-xl border p-3.5 transition duration-300 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-copper hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_var(--ink)] ${
        solved
          ? `border-solved/40 bg-solved-surface ${solvedOnMount ? '' : 'animate-glow'}`
          : busy
            ? 'border-copper/60 bg-surface'
            : 'border-line bg-surface hover:border-copper/60'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="pt-1 leading-none">
          {/* Stretched over the whole card: the card is the way to its code. */}
          <Link
            to="/code/$id"
            params={{ id }}
            className="outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {title}
          </Link>
        </h2>
        {/* Above the stretched link, so it stays clickable on its own. */}
        <SolveButton id={id} run={run} className="relative z-10" />
      </div>

      <p className="flex min-w-0 items-baseline gap-2 font-digits text-lg">
        <span aria-hidden className="text-ink-soft">
          =
        </span>
        <span className="sr-only">Answer: </span>
        {solved ? (
          <span
            key={run.value}
            data-testid="answer"
            className="inline-block animate-reveal font-semibold break-all"
          >
            {run.value}
          </span>
        ) : (
          <span data-testid="answer" className="text-ink-soft">
            {run?.status === 'failed' ? 'Failed' : '?'}
          </span>
        )}
      </p>

      <div className="mt-auto flex items-center gap-3 text-sm text-ink-soft">
        <div
          aria-hidden
          className="h-1 flex-1 overflow-hidden rounded-full bg-line"
        >
          <div
            className={`h-full origin-left rounded-full transition-transform duration-700 ease-out ${
              solved ? 'bg-solved' : 'animate-pulse bg-copper'
            }`}
            style={{
              transform: `scaleX(${solved ? budgetShare(run.duration) : run?.status === 'solving' ? 0.15 : 0})`,
            }}
          />
        </div>
        <span
          data-testid="duration"
          className="min-w-14 text-right font-digits"
        >
          {solved && (
            <span className="animate-fade-in">
              <span className="sr-only">Solved in </span>
              {formatDuration(run.duration)}
            </span>
          )}
        </span>
        <ArrowRight
          aria-hidden
          className="-ml-1 size-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:text-copper-text group-hover:opacity-100"
        />
      </div>
    </article>
  );
});
