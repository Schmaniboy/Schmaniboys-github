/**
 * Erzeugt eine Sitzung fuer Browserdurchlaeufe und gibt das Cookie aus.
 *
 *   export PRUEF_COOKIE=$(npx tsx scripts/pruefsitzung.ts)
 *
 * Die Sitzung entsteht auf demselben Weg wie in der Anwendung: Zufallstoken
 * ins Cookie, nur dessen Hash in die Datenbank. Ueber die Anmeldemaske zu
 * gehen waere unnoetig -- die ist auf zehn Versuche je fuenf Minuten und
 * Adresse begrenzt, und diese Grenze ist fuer Angreifer gedacht, nicht fuer
 * die eigene Pruefung.
 *
 * Mit `--entfernen` werden die so angelegten Konten wieder entfernt.
 */
import { SESSION_COOKIE_NAME, generateToken, hashPassword, hashToken } from '@ap/core';
import type { Role } from '@ap/core';
import { createSession, createUser, prisma } from '@ap/db';

const MARKE = 'pruefsitzung';

async function main(): Promise<void> {
  if (process.argv.includes('--entfernen')) {
    const konten = await prisma.user.findMany({
      where: { email: { startsWith: MARKE } },
      select: { id: true },
    });
    const ids = konten.map((k) => k.id);
    const haendlerIds = (
      await prisma.dealer.findMany({
        where: { name: { startsWith: 'Prüfhändler' } },
        select: { id: true },
      })
    ).map((h) => h.id);
    await prisma.session.deleteMany({ where: { userId: { in: ids } } });
    await prisma.listingDraft.deleteMany({ where: { ownerId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.dealer.deleteMany({ where: { id: { in: haendlerIds } } });
    console.error(`${ids.length} Prüfkonten entfernt.`);
    return;
  }

  /*
   * Die Rolle bestimmt, welche Bereiche der Rundgang ueberhaupt sieht. Der
   * Haendlerbereich braucht DEALER_OWNER, der Adminbereich SUPER_ADMIN --
   * ohne die richtige Rolle laeuft der Rundgang gegen eine Weiterleitung
   * und meldet "nicht erreichbar", obwohl alles in Ordnung ist.
   */
  const rolle = (process.argv.find((a) => a.startsWith('--rolle='))?.split('=')[1] ??
    'USER') as Role;

  const benutzer = await createUser({
    email: `${MARKE}.${Date.now().toString(36)}@example.test`,
    passwordHash: await hashPassword('ein-ausreichend-langes-passwort'),
    displayName: 'Prüfsitzung',
    role: rolle,
  });

  /*
   * Haendlerrollen ohne Haendler sind wirkungslos: Die Mandantentrennung
   * laeuft ueber die Zugehoerigkeit, nicht ueber die Rolle allein.
   */
  if (rolle === 'DEALER_OWNER' || rolle === 'DEALER_STAFF') {
    const haendler = await prisma.dealer.create({
      data: {
        name: `Prüfhändler ${Date.now().toString(36)}`,
        slug: `pruefhaendler-${Date.now().toString(36)}`,
        status: 'ACTIVE',
      },
    });
    await prisma.user.update({
      where: { id: benutzer.id },
      data: { dealerId: haendler.id },
    });
  }

  const token = generateToken();
  await createSession({
    userId: benutzer.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  // Nur das Cookie auf die Standardausgabe -- alles andere nach stderr,
  // damit sich der Aufruf direkt in eine Variable schreiben laesst.
  process.stdout.write(`${SESSION_COOKIE_NAME}=${token}`);
}

main()
  .catch((fehler) => {
    console.error(fehler);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
