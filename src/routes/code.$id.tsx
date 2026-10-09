import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

import { SolveButton } from '../components/SolveButton';
import {
  hasSolution,
  loadSource,
  problemUrl,
  solutionName,
  solvedIds,
} from '../lib/catalog';
import { formatDuration } from '../lib/format-time';
import { highlightTypeScript } from '../lib/highlight';
import { useRun } from '../lib/solver';

export const Route = createFileRoute('/code/$id')({
  params: {
    parse: ({ id }) => ({ id: Number(id) }),
    stringify: ({ id }) => ({ id: String(id) }),
  },
  beforeLoad: ({ params }) => {
    if (!hasSolution(params.id)) {
      throw redirect({ to: '/', replace: true });
    }
  },
  loader: ({ params }) => loadSource(params.id),
  component: CodePage,
});

function CodePage() {
  const { id } = Route.useParams();
  const source = Route.useLoaderData();
  const html = useMemo(() => highlightTypeScript(source), [source]);
  const run = useRun(id);

  const index = solvedIds.indexOf(id);
  const previous = solvedIds[index - 1];
  const next = solvedIds[index + 1];

  return (
    <article aria-labelledby="solution-title" className="min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h1
            id="solution-title"
            className="font-digits text-2xl font-bold sm:text-3xl"
          >
            {solutionName(id)}.ts
          </h1>
          <a
            href={problemUrl(id)}
            target="_blank"
            rel="noopener"
            className="link mt-1 inline-flex items-center gap-1.5 text-ink-soft"
          >
            Problem {id} on Project Euler
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <p
            role="status"
            className="text-right text-sm leading-tight text-ink-soft"
          >
            {run?.status === 'solved' ? (
              <>
                <span className="sr-only">Answer: </span>
                <span
                  data-testid="answer"
                  className="font-digits text-base font-semibold text-ink"
                >
                  {run.value}
                </span>
                <br />
                <span className="font-digits">
                  in {formatDuration(run.duration)}
                </span>
              </>
            ) : run?.status === 'failed' ? (
              run.error
            ) : (
              'Run it to get the answer'
            )}
          </p>
          <SolveButton id={id} run={run} />
        </div>
      </div>

      <pre className="overflow-x-auto rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed sm:p-6">
        <code
          className="hljs font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>

      <nav
        aria-label="Other solutions"
        className="mt-4 flex justify-between gap-4"
      >
        {previous !== undefined ? (
          <Link
            to="/code/$id"
            params={{ id: previous }}
            className="btn btn-ghost font-digits text-sm"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {solutionName(previous)}
          </Link>
        ) : (
          <span />
        )}
        {next !== undefined && (
          <Link
            to="/code/$id"
            params={{ id: next }}
            className="btn btn-ghost font-digits text-sm"
          >
            {solutionName(next)}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
      </nav>
    </article>
  );
}
