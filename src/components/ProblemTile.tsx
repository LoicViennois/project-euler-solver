import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { memo, useState } from 'react';

import { hasSolution, problemTitle } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { type Run, useRun } from '../lib/solver';
import { SolveButton } from './SolveButton';

const ONE_MINUTE = 60_000;

/** How close a run came to Project Euler's one-minute limit, from 0 to 1 on a log scale. */
function durationShare(duration: number): number {
  return Math.min(1, Math.log10(duration + 1) / Math.log10(ONE_MINUTE + 1));
}

/** Green for instant runs to red at the one-minute limit. */
function durationColor(duration: number): string {
  const hue = 145 - durationShare(duration) * 120;
  return `oklch(var(--time-lightness) 0.16 ${hue})`;
}

// A big faint numeral behind the card, drawn from data-number so it stays out of the text.
const watermark =
  'isolate overflow-hidden before:pointer-events-none before:absolute before:-right-1 before:-bottom-4 before:-z-10 before:font-digits before:text-[4.5rem] before:leading-none before:font-bold before:tracking-tighter before:transition-colors before:duration-300 before:content-[attr(data-number)]';

export const ProblemTile = memo(function ProblemTile({ id }: { id: number }) {
  const run = useRun(id);
  const available = hasSolution(id);
  const solved = run?.status === 'solved';
  const busy = run?.status === 'queued' || run?.status === 'solving';
  // Only celebrate a solve that happens on screen, not one found on mount.
  const [solvedOnMount] = useState(solved);

  const name = problemTitle(id);
  const heading = (
    <span className="font-digits text-xs font-semibold tracking-widest text-accent-text uppercase">
      Problem {id}
    </span>
  );
  const title = name && (
    <p className="mt-1.5 text-[1.0625rem] leading-snug font-semibold text-pretty">
      {name}
    </p>
  );

  if (!available) {
    return (
      <article
        data-testid={`problem-${id}`}
        data-number={id}
        className={`relative flex h-full flex-col justify-between gap-2 rounded-xl border border-dashed border-line px-3.5 py-3 before:text-ink/5 ${watermark}`}
      >
        <div>
          <h2 className="leading-none">{heading}</h2>
          {title}
        </div>
        <p className="flex items-center gap-2 border-t border-dashed border-line pt-2 text-ink-soft">
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
      data-number={id}
      className={`group relative flex h-full flex-col gap-2 rounded-xl border px-3.5 py-3 transition duration-300 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_var(--ink)] ${watermark} ${
        solved
          ? `border-solved/40 bg-solved-surface before:text-solved/10 ${solvedOnMount ? '' : 'animate-glow'}`
          : busy
            ? 'border-accent/60 bg-surface before:text-accent/10'
            : 'border-line bg-surface before:text-ink/5 hover:border-accent/60 hover:before:text-accent/10'
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
        {title}
      </div>

      <div
        className={`mt-auto flex min-w-0 items-center gap-2 border-t border-dashed pt-2 font-digits transition-colors duration-300 ${
          solved ? 'border-solved/30' : 'border-line'
        }`}
      >
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

      <TimeGauge run={run} />
    </article>
  );
});

/** A bar along the bottom edge: how much of the one-minute limit a solve took. */
function TimeGauge({ run }: { run: Run | undefined }) {
  if (run?.status === 'solving') {
    return (
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 bg-accent/15"
      >
        <span className="absolute inset-y-0 w-1/3 animate-scan bg-accent/70" />
      </span>
    );
  }
  if (run?.status !== 'solved') {
    return null;
  }
  return (
    <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-solved/10">
      <span
        key={run.duration}
        className="absolute inset-y-0 left-0 origin-left animate-grow"
        style={{
          // Even an instant run gets a sliver, so the bar never looks missing.
          width: `${Math.max(3, durationShare(run.duration) * 100)}%`,
          backgroundColor: durationColor(run.duration),
        }}
      />
    </span>
  );
}
