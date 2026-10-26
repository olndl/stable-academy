import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Headers, Request, Response } = require('whatwg-fetch');

// React Native uses these fetch classes. Load them before importing MSW.
Object.assign(globalThis, { Headers, Request, Response });
