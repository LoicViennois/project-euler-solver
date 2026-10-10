import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { SolveButton } from '../components/SolveButton';
import {
  hasSolution,
  loadSource,
  problemTitle,
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
  const navigate = useNavigate();

  // ← and → step through the solutions, like turning pages.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented
      ) {
        return;
      }
      const target =
        event.key === 'ArrowLeft'
          ? previous
          : event.key === 'ArrowRight'
            ? next
            : undefined;
      if (target !== undefined) {
        event.preventDefault();
        void navigate({ to: '/code/$id', params: { id: target } });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, previous, next]);

  return (
    <article aria-labelledby="solution-title" className="min-w-0">
      <div className="sticky top-14 z-30 -mx-4 mb-6 flex items-center justify-between gap-3 bg-bg/85 px-4 py-3 backdrop-blur-md lg:-mx-6 lg:px-6">
        <Link
          to="/"
          className="group btn btn-ghost bg-surface py-2.5 text-base"
        >
          <ArrowLeft
            className="size-5 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
          Problems list
        </Link>
        <nav aria-label="Other solutions" className="flex items-center gap-2">
          <SiblingLink id={previous} direction="previous" />
          <SiblingLink id={next} direction="next" />
        </nav>
      </div>

      <div className="mb-4">
        <h1
          id="solution-title"
          className="font-digits text-2xl font-bold sm:text-3xl"
        >
          {solutionName(id)}.ts
        </h1>
        <p className="mt-1 text-lg text-ink-soft">
          Problem {id}
          {problemTitle(id) && (
            <>
              {' · '}
              <span className="text-ink">{problemTitle(id)}</span>
            </>
          )}
        </p>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <a
          href={problemUrl(id)}
          target="_blank"
          rel="noopener"
          className="group btn border border-copper/60 bg-surface px-4 py-2.5 text-base text-ink hover:border-copper hover:bg-tint"
        >
          <BookOpen className="size-5 text-copper-text" aria-hidden />
          <span>
            Read problem {id} on{' '}
            <span className="text-copper-text">Project Euler</span>
          </span>
          <ExternalLink
            className="size-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
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

      <pre
        key={id}
        className="animate-fade-in overflow-x-auto rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed sm:p-6"
      >
        <code
          className="hljs font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
      <p className="mt-3 hidden text-right text-sm text-ink-soft sm:block">
        Tip: use <kbd className="font-digits">←</kbd> and{' '}
        <kbd className="font-digits">→</kbd> to switch solutions.
      </p>
    </article>
  );
}

function SiblingLink({
  id,
  direction,
}: {
  id: number | undefined;
  direction: 'previous' | 'next';
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  if (id === undefined) {
    return (
      <span
        aria-hidden
        className="btn btn-ghost cursor-default px-2.5 py-2.5 opacity-40"
      >
        <Icon className="size-5" />
      </span>
    );
  }
  return (
    <Link
      to="/code/$id"
      params={{ id }}
      className={`group btn btn-ghost bg-surface px-2.5 py-2.5 font-digits text-sm sm:px-3 ${
        direction === 'next' ? 'flex-row-reverse' : ''
      }`}
    >
      <Icon
        className={`size-5 transition-transform ${
          direction === 'previous'
            ? 'group-hover:-translate-x-0.5'
            : 'group-hover:translate-x-0.5'
        }`}
        aria-hidden
      />
      <span className="max-sm:sr-only">{solutionName(id)}</span>
    </Link>
  );
}
