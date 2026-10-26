# Прогресс

## День 1 — 25 октября 2026

Формат: приложение для Android/iPhone на React Native + Expo. Простой интерфейс без декоративного дизайна.

Сделано:

- Expo SDK 57 + React Native + TypeScript со strict-проверками.
- Expo Router: Home, Courses, My learning, Diary, Statistics, нижние вкладки и экран ненайденного маршрута.
- ESLint и Prettier.
- План адаптирован: AsyncStorage, expo-video, Jest и React Native Testing Library.
- [Pull Request #1](https://github.com/olndl/stable-academy/pull/1).

Проверки:

- lint, format:check, typecheck проходят.
- Expo экспортирует бандлы Android, iOS и веб-превью.
- expo install --check: версии совместимы с SDK.
- В браузерном превью проверены вкладки, переходы с главной и ненайденный маршрут.
- Expo Doctor: 20 из 21 проверок проходят. Для локальной компиляции SDK 57 нужен Xcode 26.4+, на компьютере установлен 16.2. Через Expo Go можно запускать без локальной компиляции.
- На настоящем телефоне и в симуляторе приложение пока не запускалось. APK/IPA не собирались.
- npm audit: 8 замечаний в зависимостях Expo CLI/Router (5 high, 3 moderate). Автоисправление предлагает смену SDK; принудительные обновления не применялись. Перепроверить при обновлении Expo.

День 1: основа готова. Vercel не используем. Для запуска: Node 24, npm start, QR-код открыть в Expo Go на телефоне в той же Wi-Fi сети.

Следующий шаг: день 2 — типы Course, Lesson, Trainer, данные курсов и моковый API.

README пока оставлен только с названием. Оформим его в конце, вместе с презентацией проекта.
