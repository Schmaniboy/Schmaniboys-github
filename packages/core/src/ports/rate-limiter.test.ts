import { describe, expect, it } from 'vitest';

import { InMemoryRateLimiter } from './rate-limiter';

describe('Ratenbegrenzung', () => {
  it('laesst bis zum Limit durch und blockt danach', async () => {
    const limiter = new InMemoryRateLimiter({ now: () => 1000 });
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const decision = await limiter.consume('ip:1', 5, 60);
      expect(decision.allowed).toBe(true);
    }
    const blocked = await limiter.consume('ip:1', 5, 60);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('trennt Schluessel voneinander', async () => {
    const limiter = new InMemoryRateLimiter({ now: () => 1000 });
    await limiter.consume('ip:1', 1, 60);
    expect((await limiter.consume('ip:1', 1, 60)).allowed).toBe(false);
    expect((await limiter.consume('ip:2', 1, 60)).allowed).toBe(true);
  });

  it('gibt nach Ablauf des Fensters wieder frei', async () => {
    let now = 1000;
    const limiter = new InMemoryRateLimiter({ now: () => now });
    await limiter.consume('ip:1', 1, 60);
    expect((await limiter.consume('ip:1', 1, 60)).allowed).toBe(false);
    now += 61_000;
    expect((await limiter.consume('ip:1', 1, 60)).allowed).toBe(true);
  });

  it('waechst nicht unbegrenzt', async () => {
    let now = 1000;
    const limiter = new InMemoryRateLimiter({ now: () => now, maxEntries: 10 });
    for (let index = 0; index < 50; index += 1) {
      now += 1;
      await limiter.consume(`key:${index}`, 5, 1);
    }
    // Nach dem Aufraeumen muss ein frischer Schluessel weiterhin durchgehen.
    expect((await limiter.consume('key:neu', 5, 60)).allowed).toBe(true);
  });
});
