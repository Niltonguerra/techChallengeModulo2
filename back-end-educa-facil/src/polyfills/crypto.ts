import crypto from 'crypto';

if (!global.crypto) {
  global.crypto = {
    ...crypto,
    randomUUID:
      crypto.randomUUID ??
      (() => {
        // Fallback manual para gerar UUID caso randomUUID não exista
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = crypto.randomBytes(1)[0] % 16;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }),
  } as any;
}
