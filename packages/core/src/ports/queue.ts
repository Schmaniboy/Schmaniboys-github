/**
 * Auftragswarteschlange fuer alles, was nicht im Request laufen darf:
 * KI-Aufrufe, Bildverarbeitung, Rechnungserzeugung, Marktdatenabgleich.
 *
 * Absichtlich ohne konkrete Technik. Bis eine Redis-Instanz feststeht, laeuft
 * die Speicherimplementierung -- die Aufrufstellen aendern sich dadurch nicht.
 */

export interface JobEnvelope<TPayload> {
  id: string;
  name: string;
  payload: TPayload;
  enqueuedAt: Date;
  attempts: number;
}

export interface JobQueue {
  enqueue<TPayload>(name: string, payload: TPayload): Promise<string>;
  /** Nimmt den naechsten Auftrag oder null, wenn nichts ansteht. */
  dequeue(): Promise<JobEnvelope<unknown> | null>;
  size(): Promise<number>;
}

export class InMemoryJobQueue implements JobQueue {
  readonly #jobs: JobEnvelope<unknown>[] = [];
  #sequence = 0;

  async enqueue<TPayload>(name: string, payload: TPayload): Promise<string> {
    this.#sequence += 1;
    const id = `job_${this.#sequence}`;
    this.#jobs.push({ id, name, payload, enqueuedAt: new Date(), attempts: 0 });
    return id;
  }

  async dequeue(): Promise<JobEnvelope<unknown> | null> {
    return this.#jobs.shift() ?? null;
  }

  async size(): Promise<number> {
    return this.#jobs.length;
  }
}
