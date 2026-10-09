import { Check, Clock, LoaderCircle, Play } from 'lucide-react';

import { type Run, solve } from '../lib/solver';

interface SolveButtonProps {
  id: number;
  run: Run | undefined;
  className?: string;
}

const states = {
  idle: { Icon: Play, label: (id: number) => `Solve problem ${id}` },
  queued: { Icon: Clock, label: (id: number) => `Problem ${id} is queued` },
  solving: {
    Icon: LoaderCircle,
    label: (id: number) => `Solving problem ${id}`,
  },
  solved: { Icon: Check, label: (id: number) => `Solve problem ${id} again` },
  failed: { Icon: Play, label: (id: number) => `Retry problem ${id}` },
};

export function SolveButton({ id, run, className }: SolveButtonProps) {
  const status = run?.status ?? 'idle';
  const { Icon, label } = states[status];
  const spin = status === 'solving';
  const busy = status === 'queued' || status === 'solving';

  return (
    <button
      type="button"
      onClick={() => !busy && solve([id])}
      // aria-disabled rather than disabled keeps focus on the button.
      aria-disabled={busy}
      aria-label={label(id)}
      data-status={status}
      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg transition aria-disabled:cursor-progress ${
        status === 'solved'
          ? 'bg-solved/15 text-solved hover:bg-solved/25'
          : busy
            ? 'bg-tint text-ink-soft'
            : 'bg-tint text-copper-text ring-1 ring-line hover:bg-copper hover:text-copper-ink active:scale-90'
      } ${className ?? ''}`}
    >
      <Icon
        key={status}
        aria-hidden
        className={`size-4 ${spin ? 'animate-spin' : status === 'solved' ? 'animate-pop' : ''}`}
      />
    </button>
  );
}
