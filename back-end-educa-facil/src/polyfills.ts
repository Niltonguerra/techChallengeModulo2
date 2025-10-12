import * as nodeCrypto from 'crypto';

declare global {
  interface Crypto {
    randomUUID(): string;
  }

  var crypto: Crypto;
}

if (!globalThis.crypto) {
  globalThis.crypto = { randomUUID: nodeCrypto.randomUUID.bind(nodeCrypto) };
}
