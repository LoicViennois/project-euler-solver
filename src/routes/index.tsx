import { createFileRoute } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ProblemTile } from '../components/ProblemTile';
import { allIds, hasSolution, solvedIds } from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { type Run, solve, useRuns } from '../lib/solver';

export const Route = createFileRoute('/')({
  component: ProblemsPage,
});

// The tiles rise in on the first visit only, not on every way back from the code.
let introPlayed = false;

function ProblemsPage() {
  const runs = useRuns();
  const [intro] = useState(() => !introPlayed);
  useEffect(() => {
    introPlayed = true;
  }, []);

  let solvedCount = 0;
  let totalTime = 0;
  for (const run of runs.values()) {
    if (run.status === 'solved') {
      solvedCount += 1;
      totalTime += run.duration;
    }
  }

  return (
    <>
      <section
        aria-labelledby="intro-title"
        className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div className="max-w-2xl">
          <h1
            id="intro-title"
            className="mb-4 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Project Euler, <br />
            solved in your browser.
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-ink-soft">
            {solvedIds.length} problems solved in TypeScript, each within
            Project Euler&apos;s{' '}
            <a
              href="https://projecteuler.net/about"
              target="_blank"
              rel="noopener"
              className="link text-ink"
            >
              one-minute rule
            </a>
            . Run a solution to get its answer and timing, or read its code.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={() => solve(solvedIds)}
              className="btn btn-primary"
            >
              <Play className="size-4" aria-hidden />
              Solve all {solvedIds.length}
            </button>
            <p role="status" className="text-ink-soft">
              <span
                key={solvedCount}
                className="inline-block animate-pop font-digits text-ink"
              >
                {solvedCount}
              </span>{' '}
              of {solvedIds.length} solved
              {solvedCount > 0 && (
                <>
                  {' '}
                  in{' '}
                  <span className="font-digits text-ink">
                    {formatDuration(totalTime)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <figure className="flex flex-col items-start gap-2 lg:items-end">
          <a
            href="https://projecteuler.net/progress=LoicViennois"
            target="_blank"
            rel="noopener"
            className="rounded-md"
          >
            <img
              src="https://projecteuler.net/profile/LoicViennois.png"
              alt="Project Euler profile of Loïc Viennois"
              width={200}
              height={60}
              className="rounded-md border border-line"
            />
          </a>
          <figcaption className="text-sm text-ink-soft">
            Author&apos;s Project Euler profile
          </figcaption>
        </figure>
      </section>

      <ProgressStrip runs={runs} />

      <ul className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allIds.map((id, index) => (
          <li
            key={id}
            className={intro ? 'animate-rise' : undefined}
            style={
              intro
                ? { animationDelay: `${Math.min(index * 12, 600)}ms` }
                : undefined
            }
          >
            <ProblemTile id={id} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** One cell per problem, lighting up as solutions come in. */
function ProgressStrip({ runs }: { runs: ReadonlyMap<number, Run> }) {
  return (
    <div
      aria-hidden
      className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(0.6rem,1fr))] gap-1"
    >
      {allIds.map((id) => {
        const status = runs.get(id)?.status;
        return (
          <span
            key={id}
            className={`h-3 rounded-sm transition-colors duration-300 ${
              !hasSolution(id)
                ? 'border border-dashed border-line'
                : status === 'solved'
                  ? 'animate-pop bg-solved'
                  : status === 'solving'
                    ? 'animate-pulse bg-copper/50'
                    : 'bg-line'
            }`}
          />
        );
      })}
    </div>
  );
}
