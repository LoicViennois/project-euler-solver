import { commitSha, commitUrl, shortSha } from '../lib/build-info';

export function BuildInfo() {
  return (
    <footer
      data-testid="build-info"
      className="mx-auto max-w-6xl px-4 pb-8 text-sm text-ink-soft lg:px-6"
    >
      Build{' '}
      <a
        href={commitUrl}
        title={commitSha}
        target="_blank"
        rel="noopener"
        className="font-digits underline hover:text-ink"
      >
        {shortSha}
      </a>
    </footer>
  );
}
