/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as nodeCrypto from 'crypto';
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = {} as any;
}
(globalThis as any).crypto.randomUUID = nodeCrypto.randomUUID.bind(nodeCrypto);