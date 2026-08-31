/**
 * Ratenbegrenzung als Schnittstelle.
 *
 * Die Speicherimplementierung unten gilt pro Prozess. Sobald mehr als eine
 * Instanz laeuft, ist sie kein verlaesslicher Schutz mehr -- dann muss eine
 * geteilte Implementierung (Redis o. ae.) dahinter. Die Schnittstelle bleibt
 * dieselbe, deshalb ist der Austausch spaeter eine Zeile.
 */

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitDecision>;
  reset(key: string): Promise<void>;
}

interface Window {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  readonly #windows = new Map<string, Window>();
  readonly #now: () => number;
  /** Verhindert, dass die Map durch Streuschluessel unbegrenzt waechst. */
  readonly #maxEntries: number;

  constructor(options: { now?: () => number; maxEntries?: number } = {}) {
    this.#now = options.now ?? (() => Date.now());
    this.#maxEntries = options.maxEntries ?? 50_000;
  }

  async consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitDecision> {
    const now = this.#now();
    const existing = this.#windows.get(key);

    if (!existing || existing.resetAt <= now) {
      this.#evictIfNeeded(now);
      this.#windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    existing.count += 1;
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    if (existing.count > limit) {
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }
    return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
  }

  async reset(key: string): Promise<void> {
    this.#windows.delete(key);
  }

  #evictIfNeeded(now: number): void {
    if (this.#windows.size < this.#maxEntries) return;
    for (const [key, window] of this.#windows) {
      if (window.resetAt <= now) this.#windows.delete(key);
    }
    // Falls nichts abgelaufen war: aeltesten Eintrag opfern statt zu wachsen.
    if (this.#windows.size >= this.#maxEntries) {
      const oldest = this.#windows.keys().next();
      if (!oldest.done) this.#windows.delete(oldest.value);
    }
  }
}
