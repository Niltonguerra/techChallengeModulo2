/* eslint-disable */
/* @ts-nocheck */

import * as nodeCrypto from 'crypto';
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = {};
}

(globalThis as any).crypto.randomUUID = nodeCrypto.randomUUID.bind(nodeCrypto);
