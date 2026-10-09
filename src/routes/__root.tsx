import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { BuildInfo } from '../components/BuildInfo';
import { Header } from '../components/Header';
import { UpdatePrompt } from '../components/UpdatePrompt';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-8 pb-12 lg:px-6 lg:pt-12">
        <Outlet />
      </main>
      <BuildInfo />
      <UpdatePrompt />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
