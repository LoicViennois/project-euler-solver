import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Past this many pixels scrolled, the list is long enough to need a way back up. */
const THRESHOLD = 600;

/** Floating button bringing the page back to the top of a long page. */
export function BackToTop({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  function goToTop() {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    // Keyboard and screen reader users carry on from the top too.
    document.getElementById(targetId)?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={goToTop}
      aria-label="Back to top"
      className="fixed right-4 bottom-5 z-30 sm:right-6 sm:bottom-6 grid size-12 animate-rise cursor-pointer place-items-center rounded-full bg-copper text-copper-ink shadow-[0_8px_20px_-6px_var(--copper)] transition hover:-translate-y-0.5 active:scale-90"
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
