# Stable Academy

A small learning platform for riders. The idea is to keep courses, watchlists and training notes in one place.

Work in progress. The first step is the app layout and routing; the course catalogue comes next.

## Run locally

Node 24 and npm.

```sh
nvm use
npm ci
npm run dev
```

```sh
npm run lint
npm run format:check
npm run build
```

## Stack

Vite, React, TypeScript and React Router are set up. TanStack Query, Redux Toolkit, MSW, Recharts and Vitest will be added with the features that need them.

TanStack Query will handle course data from the mock API: fetching, caching and request states. Redux will hold watchlists, lesson progress and diary entries, with localStorage persistence. Course responses won't be copied into Redux.

## Progress

See [ROADMAP.md](ROADMAP.md) for the daily tasks and [docs/progress.md](docs/progress.md) for completed work.
