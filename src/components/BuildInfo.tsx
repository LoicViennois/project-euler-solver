import { commitSha, commitUrl, shortSha } from '../lib/build-info';

export function BuildInfo() {
  return (
    <footer
      data-testid="build-info"
      className="fixed bottom-2 left-2 z-30 rounded-full bg-bg/80 px-2 py-0.5 text-xs text-ink-soft backdrop-blur-sm"
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
