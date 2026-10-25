# Stable Academy

A small Android and iOS app for riders. Courses, watchlists and training notes in one place.

Work in progress. The app shell and navigation are ready; the course catalogue comes next.

## Run

Node 24 and npm.

```sh
nvm use
npm ci
npm start
```

Install Expo Go on your phone and scan the QR code from the terminal. The phone and computer should be on the same Wi-Fi network. This project uses Expo SDK 57.

With a local emulator or simulator available:

```sh
npm run android
npm run ios
```

`npm run web` is a browser preview of the same React Native screens.

Local native iOS compilation for SDK 57 needs Xcode 26.4+. Expo Go on a phone does not require local compilation.

## Checks

```sh
npm run lint
npm run format:check
npm run typecheck
npm run build
```

The build command exports JavaScript bundles for Android, iOS and web. It does not create an APK or IPA. Installable builds can be added with EAS later.

## Stack

Expo, React Native, TypeScript and Expo Router are set up. TanStack Query, Redux Toolkit, AsyncStorage, expo-video and tests will be added with the features that need them.

TanStack Query will handle course data: fetching, caching and request states. Redux will hold watchlists, lesson progress and diary entries, with AsyncStorage persistence. Course responses won't be copied into Redux.

## Progress

See [ROADMAP.md](ROADMAP.md) for the daily tasks and [docs/progress.md](docs/progress.md) for completed work.
