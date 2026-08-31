/**
 * Zeigt, unter welcher Adresse die Anwendung im eigenen Netz erreichbar ist
 * -- fuer den Aufruf vom Telefon oder Tablet.
 *
 *   npm run netz
 *
 * Das Skript raet nicht. Es liest die Netzwerkschnittstellen dieses Rechners
 * und sagt fuer jede Adresse, ob sie taugt. Eine Adresse zu nennen, die dann
 * nicht laedt, waere schlechter als die Auskunft, dass es keine gibt.
 */
import { networkInterfaces } from 'node:os';
import { readFileSync, existsSync } from 'node:fs';

/** Adressbereiche, die im eigenen Netz vergeben werden (RFC 1918). */
function istPrivat(ip) {
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  const teile = ip.split('.').map(Number);
  return teile[0] === 172 && teile[1] >= 16 && teile[1] <= 31;
}

/**
 * Bereiche, die aussehen wie eine Adresse, aber keine erreichbare sind.
 * Ohne diese Pruefung nennt das Skript in einer Cloud-Umgebung eine Zahl,
 * die auf dem Telefon garantiert nicht laedt.
 */
function nichtErreichbar(ip) {
  if (ip.startsWith('127.')) return 'Rueckschleife -- nur dieser Rechner selbst';
  if (ip.startsWith('169.254.')) return 'Selbstvergeben (kein DHCP) -- kein richtiges Netz';
  if (ip.startsWith('192.0.2.') || ip.startsWith('198.51.100.') || ip.startsWith('203.0.113.'))
    return 'Dokumentationsbereich nach RFC 5737 -- weltweit nicht routbar';
  if (ip.startsWith('100.64.') || ip.startsWith('100.')) {
    const zweit = Number(ip.split('.')[1]);
    if (zweit >= 64 && zweit <= 127) return 'Traeger-NAT (RFC 6598) -- vom Telefon aus nicht erreichbar';
  }
  return null;
}

function appUrlAusEnv() {
  for (const datei of ['.env.local', '.env']) {
    if (!existsSync(datei)) continue;
    const treffer = /^APP_URL\s*=\s*(.+)$/m.exec(readFileSync(datei, 'utf8'));
    if (treffer) return treffer[1].trim().replace(/^["']|["']$/g, '');
  }
  return process.env.APP_URL ?? null;
}

const port = process.env.PORT ?? '3000';
const gefunden = [];

for (const [name, adressen] of Object.entries(networkInterfaces())) {
  for (const adresse of adressen ?? []) {
    if (adresse.family !== 'IPv4') continue;
    gefunden.push({ name, ip: adresse.address, intern: adresse.internal });
  }
}

const brauchbar = gefunden.filter((a) => !a.intern && istPrivat(a.ip) && !nichtErreichbar(a.ip));

console.log('\nNetzwerkschnittstellen dieses Rechners:\n');
for (const a of gefunden) {
  const grund = nichtErreichbar(a.ip);
  const zeichen = brauchbar.includes(a) ? '  ok  ' : ' nein ';
  console.log(`${zeichen} ${a.name.padEnd(10)} ${a.ip.padEnd(16)} ${grund ?? (istPrivat(a.ip) ? 'eigenes Netz' : 'oeffentlich oder unbekannt')}`);
}

if (brauchbar.length === 0) {
  console.log('\nKeine Adresse aus dem eigenen Netz gefunden.');
  console.log('Dieser Rechner haengt in keinem WLAN/LAN, in dem ein Telefon ihn erreichen');
  console.log('koennte -- typisch fuer Container und Cloud-Umgebungen. Eine Adresse zum');
  console.log('Aufrufen gibt es hier nicht; siehe docs/DEPLOYMENT.md fuer den Weg ueber Vercel.\n');
  process.exit(1);
}

const appUrl = appUrlAusEnv();
console.log('\nAuf dem Telefon aufrufen (gleiches WLAN):\n');
for (const a of brauchbar) console.log(`   http://${a.ip}:${port}`);

console.log('\nDamit das funktioniert, muss der Server auf allen Schnittstellen lauschen:\n');
console.log('   npm run dev:netz        (Entwicklung)');
console.log('   npm run build && npm run start:netz   (wie im Betrieb)\n');

const erwartet = `http://${brauchbar[0].ip}:${port}`;
if (!appUrl) {
  console.log(`Hinweis: APP_URL ist nicht gesetzt. Setze sie auf ${erwartet},`);
  console.log('sonst zeigen Links aus E-Mails und Weiterleitungen auf localhost --');
  console.log('und das Telefon laedt dann ins Leere.\n');
} else if (!brauchbar.some((a) => appUrl.includes(a.ip))) {
  console.log(`Achtung: APP_URL steht auf ${appUrl}.`);
  console.log(`Fuer den Zugriff vom Telefon muss dort ${erwartet} stehen.`);
  console.log('Betrifft Bestaetigungslinks, Zurueckleitungen nach der Zahlung und die');
  console.log('Entscheidung, ob das Sitzungscookie als "secure" gesetzt wird.\n');
} else {
  console.log(`APP_URL passt (${appUrl}).\n`);
}

if (appUrl?.startsWith('https://') && brauchbar.some((a) => appUrl.includes(a.ip))) {
  console.log('Achtung: APP_URL beginnt mit https://, im eigenen Netz laeuft aber http.');
  console.log('Das Sitzungscookie wird dann als "secure" gesetzt und vom Browser ueber');
  console.log('http nicht zurueckgeschickt -- die Anmeldung schlaegt scheinbar grundlos fehl.\n');
}
