# Project Euler Solver

<a href="https://euler.loicviennois.com/" target="_blank"><img src="public/icons/icon-192x192.png" width="192" alt="logo" /></a>

Project Euler Solver is a demonstration of solving [Project Euler](https://projecteuler.net/) problems with web
technologies. Every solution is written in TypeScript and runs live in your browser, in a Web Worker.

Project Euler Solver is a static single-page app built with [React](https://react.dev), [TanStack Router](https://tanstack.com/router), [Tailwind CSS](https://tailwindcss.com) and [Vite](https://vite.dev), deployed on Vercel.

## Development

Tools are pinned in `mise.toml` (`mise install`).

```bash
pnpm install
pnpm dev     # dev server on http://localhost:5173
pnpm build   # type-check and build to dist/
pnpm lint
pnpm test    # unit tests of the solutions (Vitest)
pnpm e2e     # Playwright end-to-end and accessibility tests
```
