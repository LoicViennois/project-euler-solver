import { registerSW } from 'virtual:pwa-register';

// Long-lived sessions (an installed app left open) only look for a new service
// worker on navigation, so check periodically too.
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

let holds = 0;
let applyPending: (() => void) | null = null;

/**
 * Keeps an update from reloading the page while something that a reload would
 * lose is going on. Returns the function that releases the hold.
 */
export function holdUpdates(): () => void {
  holds += 1;
  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    holds -= 1;
    applyPending?.();
  };
}

/**
 * Activates the waiting service worker, which reloads the page, while nobody
 * is looking: once the page is hidden (another tab, the app sent to the
 * background, the phone locked) and nothing holds updates back. A closed app
 * picks the update up on its next launch anyway, so there is never anything
 * to click.
 */
function applyWhenHidden(update: () => Promise<void>): void {
  const apply = () => {
    if (document.visibilityState === 'hidden' && holds === 0) {
      document.removeEventListener('visibilitychange', apply);
      applyPending = null;
      void update();
    }
  };
  applyPending = apply;
  document.addEventListener('visibilitychange', apply);
  apply();
}

// The new service worker waits meanwhile, so an open page keeps being served
// the precached chunks of the version it was built against.
const updateServiceWorker = registerSW({
  onNeedRefresh: () => applyWhenHidden(() => updateServiceWorker()),
  onRegisteredSW(_swUrl, registration) {
    if (!registration) {
      return;
    }
    setInterval(() => {
      if (navigator.onLine) {
        registration.update().catch(() => {});
      }
    }, UPDATE_CHECK_INTERVAL);
  },
});
