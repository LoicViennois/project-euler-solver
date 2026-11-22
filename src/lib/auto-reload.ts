import type { BeforeSendEvent } from '@vercel/analytics/react';

/**
 * Set in sessionStorage right before an update reloads the page by itself, so
 * that the reload is not counted as a visit. The inline script of index.html
 * turns it into the `data-auto-reload` attribute of the root element before
 * any analytics run, and skipAutoReloadPageView below drops the Vercel one.
 */
const AUTO_RELOAD_KEY = 'pes_auto_reload';

export function markAutoReload(): void {
  try {
    sessionStorage.setItem(AUTO_RELOAD_KEY, '1');
  } catch {
    // Not counting the reload is a nicety; never block the update over it.
  }
}

/** Drops the page view of a reload made by an update, and only that one. */
export function skipAutoReloadPageView(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  const root = document.documentElement;
  if (event.type !== 'pageview' || root.dataset.autoReload === undefined) {
    return event;
  }
  delete root.dataset.autoReload;
  return null;
}
