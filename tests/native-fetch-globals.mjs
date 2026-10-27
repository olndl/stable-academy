import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Headers, Request, Response } = require('whatwg-fetch');

Object.assign(globalThis, { Headers, Request, Response });
