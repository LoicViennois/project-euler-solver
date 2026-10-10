import { MessageCircle } from 'lucide-react';

import { commitSha, commitUrl, repoUrl, shortSha } from '../lib/build-info';
import { Logo } from './Logo';
import { Modal } from './Modal';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="About"
      className="w-[min(40rem,calc(100%-2rem))]"
    >
      <div className="space-y-4 leading-relaxed [&_a]:link">
        <div className="flex items-center gap-3">
          <Logo className="size-10" />
          <p>
            <span className="font-bold">Project Euler Solver</span>, build{' '}
            <a
              href={commitUrl}
              title={commitSha}
              target="_blank"
              rel="noopener"
              data-testid="commit-link"
              className="font-digits"
            >
              {shortSha}
            </a>
            <br />
            <span className="text-ink-soft">
              Copyright &copy; 2020-2026{' '}
              <a
                href="https://loicviennois.com/"
                target="_blank"
                rel="noopener"
              >
                Loïc Viennois
              </a>
            </span>
          </p>
        </div>
        <section className="rounded-xl border border-line p-4">
          <h3 className="mb-1 flex items-center gap-2 font-bold">
            <MessageCircle className="size-4" aria-hidden />
            Send feedback
          </h3>
          <ul className="space-y-1 text-ink-soft">
            <li>
              Found a bug or have an idea?
              <br />
              <a
                href={`${repoUrl}/issues/new`}
                target="_blank"
                rel="noopener"
                className="text-ink"
              >
                Open an issue on GitHub
              </a>
            </li>
            <li>
              Want to say hi?
              <br />
              <a
                href="https://www.reddit.com/message/compose/?to=LoicViennois"
                target="_blank"
                rel="noopener"
                className="text-ink"
              >
                Message me on Reddit
              </a>
            </li>
          </ul>
        </section>
        <p className="border-t border-line pt-4 text-sm text-ink-soft">
          This program is free software, released under the{' '}
          <a
            href={`${repoUrl}/blob/master/LICENSE`}
            target="_blank"
            rel="noopener"
            className="text-ink"
          >
            MIT License
          </a>
          . You may use, copy, modify and distribute it, provided the copyright
          notice is kept.
        </p>
      </div>
    </Modal>
  );
}
