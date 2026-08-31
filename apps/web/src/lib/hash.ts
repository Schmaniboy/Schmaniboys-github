import { createHmac } from 'node:crypto';

import { env } from './env';

/**
 * Kennzeichnende Angaben werden nicht im Klartext protokolliert.
 *
 * Ein einfacher Hash genuegt dafuer nicht: Sowohl der IPv4-Adressraum als
 * auch der Raum moeglicher VIN sind klein genug zum Durchprobieren. Deshalb
 * HMAC mit einem serverseitigen Geheimnis.
 *
 * Der `label`-Parameter trennt die Verwendungszwecke: Derselbe Wert ergibt
 * unter verschiedenen Labeln verschiedene Hashes. Ohne das liesse sich ueber
 * zwei Protokolle hinweg abgleichen, ob dieselbe Angabe vorlag.
 */
export function hashWithSecret(label: string, value: string | null | undefined): string | null {
  if (!value) return null;
  if (!env.IP_HASH_SECRET) return null;
  return createHmac('sha256', env.IP_HASH_SECRET)
    .update(`${label}:${value}`)
    .digest('base64url')
    .slice(0, 32);
}

/** Hash einer Fahrzeug-Identifizierungsnummer. */
export function hashVin(vin: string): string | null {
  return hashWithSecret('vin', vin.toUpperCase());
}
