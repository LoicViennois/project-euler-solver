import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { memo, useState } from 'react';

import { hasSolution, problemTitle } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { useRun } from '../lib/solver';
import { SolveButton } from './SolveButton';

const ONE_MINUTE = 60_000;

/** Green for instant runs to red at Project Euler's one-minute limit, on a log scale. */
function durationColor(duration: number): string {
  const share = Math.min(
    1,
    Math.log10(duration + 1) / Math.log10(ONE_MINUTE + 1),
  );
  const hue = 145 - share * 120;
  return `oklch(var(--time-lightness) 0.16 ${hue})`;
}

export const ProblemTile = memo(function ProblemTile({ id }: { id: number }) {
  const run = useRun(id);
  const available = hasSolution(id);
  const solved = run?.status === 'solved';
  const busy = run?.status === 'queued' || run?.status === 'solving';
  // Only celebrate a solve that happens on screen, not one found on mount.
  const [solvedOnMount] = useState(solved);

  const name = problemTitle(id);
  const heading = (
    <>
      <span className="text-base font-medium text-ink-soft">Problem</span>{' '}
      <span className="text-xl font-bold tabular-nums">{id}</span>
    </>
  );

  if (!available) {
    return (
      <article
        data-testid={`problem-${id}`}
        className="flex h-full flex-col justify-between gap-3 rounded-xl border border-dashed border-line p-3.5"
      >
        <div>
          <h2 className="leading-none">{heading}</h2>
          {name && (
            <p className="mt-1.5 leading-snug font-medium text-copper-text">
              {name}
            </p>
          )}
        </div>
        <p className="flex items-center gap-2 text-ink-soft">
          <span aria-hidden className="relative h-4 w-6 shrink-0">
            <Pencil className="absolute bottom-px left-0 size-4 origin-bottom-left animate-write-pen" />
            <svg
              viewBox="0 0 8 3"
              className="absolute bottom-0 left-px h-[3px] w-2 overflow-visible"
            >
              <path
                d="M0 2 Q1 0 2 2 T4 2 T6 2 T8 2"
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.8}
                strokeLinecap="round"
                strokeDasharray={1}
                className="animate-write-ink"
              />
            </svg>
          </span>
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
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="leading-none">
            {/* Stretched over the whole card: the card is the way to its code. */}
            <Link
              to="/code/$id"
              params={{ id }}
              className="outline-none after:absolute after:inset-0 after:rounded-xl"
            >
              {heading}
            </Link>
          </h2>
          {/* Above the stretched link, so it stays clickable on its own. */}
          <SolveButton id={id} run={run} compact className="relative z-10" />
        </div>
        {name && (
          <p className="mt-1.5 leading-snug font-medium text-pretty text-copper-text">
            {name}
          </p>
        )}
      </div>

      <div className="mt-auto flex min-w-0 items-center gap-2 font-digits">
        <p className="flex min-w-0 items-baseline gap-2 text-lg">
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
            <span
              data-testid="answer"
              className={`text-ink-soft ${run?.status === 'solving' ? 'animate-pulse' : ''}`}
            >
              {run?.status === 'failed' ? 'Failed' : '?'}
            </span>
          )}
        </p>
        <span
          data-testid="duration"
          className="ml-auto shrink-0 text-sm font-medium"
          style={solved ? { color: durationColor(run.duration) } : undefined}
        >
          {solved && (
            <span className="inline-flex animate-fade-in items-center gap-1.5">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              <span className="sr-only">Solved in </span>
              {formatDuration(run.duration)}
            </span>
          )}
        </span>
      </div>
    </article>
  );
});
