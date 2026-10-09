import { createFileRoute, redirect } from '@tanstack/react-router';

import { solvedIds } from '../lib/catalog';

export const Route = createFileRoute('/code/')({
  beforeLoad: () => {
    throw redirect({
      to: '/code/$id',
      params: { id: solvedIds[0] ?? 1 },
      replace: true,
    });
  },
});
