import { Coffee, MessageCircle } from 'lucide-react';

import { commitUrl, repoUrl, shortSha, sponsorUrl } from '../lib/build-info';
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
        <div className="grid gap-3 sm:grid-cols-2">
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
          <section className="rounded-xl border border-line p-4">
            <h3 className="mb-1 flex items-center gap-2 font-bold">
              <Coffee className="size-4" aria-hidden />
              Buy me a coffee
            </h3>
            <p className="text-ink-soft">
              If these solutions helped you, you can buy me a coffee!
              <br />
              <a
                href={sponsorUrl}
                target="_blank"
                rel="noopener"
                data-testid="sponsor-link"
                className="text-ink"
              >
                Support me on GitHub Sponsors
              </a>
            </p>
          </section>
        </div>
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
