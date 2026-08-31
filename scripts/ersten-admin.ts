/**
 * Den ersten SUPER_ADMIN anlegen oder ernennen.
 *
 *   npx tsx scripts/ersten-admin.ts <e-mail>
 *
 * Ohne diesen Schritt lassen sich nach der Installation keine Rollen
 * vergeben -- niemand hat das Recht dazu, auch niemand mit Zugang zur
 * Datenbank, ohne von Hand in Tabellen zu schreiben.
 *
 * Zwei Regeln, die hier alles bestimmen:
 *
 * **Das Passwort kommt nie als Aufrufparameter.** Argumente stehen in der
 * Prozessliste (`ps`), in der Shell-Historie und in Protokollen von
 * Bereitstellungswerkzeugen. Es wird eingelesen oder erzeugt.
 *
 * **Gibt es schon einen SUPER_ADMIN, bricht das Skript ab.** Ein Werkzeug,
 * das jederzeit einen weiteren Vollzugriff schafft, ist eine Hintertuer --
 * jeder mit Dateizugriff waere damit Administrator. Weitere Rollen werden
 * im Adminbereich vergeben, protokolliert und von einer Person verantwortet.
 * `--zusaetzlich` hebt die Sperre auf, wenn es wirklich noetig ist.
 */
import { createInterface } from 'node:readline/promises';
import { randomBytes } from 'node:crypto';

import { PASSWORD_MIN_LENGTH, hashPassword, password as passwortRegel } from '@ap/core';
import { auditLogger, createUser, prisma, setUserRole } from '@ap/db';

/** Erzeugt ein Passwort, das die Regel erfuellt und nicht zu tippen ist. */
function erzeugePasswort(): string {
  // base64url: keine Zeichen, die sich beim Kopieren in Konsolen verlieren.
  return randomBytes(24).toString('base64url');
}

async function fragePasswort(): Promise<string> {
  const leser = createInterface({ input: process.stdin, output: process.stderr });
  try {
    const eingabe = (
      await leser.question(
        `Passwort (mindestens ${PASSWORD_MIN_LENGTH} Zeichen, leer = erzeugen lassen): `,
      )
    ).trim();
    return eingabe;
  } finally {
    leser.close();
  }
}

async function main(): Promise<void> {
  const argumente = process.argv.slice(2);
  const zusaetzlich = argumente.includes('--zusaetzlich');
  const email = argumente.find((a) => !a.startsWith('--'))?.trim().toLowerCase();

  if (!email) {
    console.error('Aufruf: npx tsx scripts/ersten-admin.ts <e-mail> [--zusaetzlich]');
    process.exitCode = 1;
    return;
  }

  const vorhandene = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
  if (vorhandene > 0 && !zusaetzlich) {
    console.error(
      `\nEs gibt bereits ${vorhandene} Konto/Konten mit SUPER_ADMIN.\n\n` +
        'Weitere Rollen werden im Adminbereich vergeben — dort ist protokolliert,\n' +
        'wer sie vergeben hat. Dieses Skript ist für den ersten Zugang gedacht,\n' +
        'nicht als zweiter Weg an der Protokollierung vorbei.\n\n' +
        'Wenn es wirklich sein muss: --zusaetzlich\n',
    );
    process.exitCode = 1;
    return;
  }

  const bestehend = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, displayName: true, status: true },
  });

  if (bestehend) {
    if (bestehend.role === 'SUPER_ADMIN') {
      console.error(`\n${email} ist bereits SUPER_ADMIN. Nichts zu tun.\n`);
      return;
    }
    await setUserRole(bestehend.id, 'SUPER_ADMIN');
    await auditLogger.record({
      action: 'admin.role_changed',
      actorId: null,
      subjectType: 'User',
      subjectId: bestehend.id,
      metadata: { von: bestehend.role, zu: 'SUPER_ADMIN', ueber: 'scripts/ersten-admin.ts' },
    });
    console.error(
      `\n${email} ist jetzt SUPER_ADMIN (vorher ${bestehend.role}).` +
        (bestehend.status !== 'ACTIVE'
          ? `\nAchtung: Das Konto hat den Status ${bestehend.status} und kann sich so nicht anmelden.`
          : '') +
        '\nDas Passwort wurde nicht verändert.\n',
    );
    return;
  }

  let klartext = await fragePasswort();
  let erzeugt = false;
  if (!klartext) {
    klartext = erzeugePasswort();
    erzeugt = true;
  }

  const geprueft = passwortRegel.safeParse(klartext);
  if (!geprueft.success) {
    console.error(`\n${geprueft.error.issues.map((i) => i.message).join(' ')}\n`);
    process.exitCode = 1;
    return;
  }

  const benutzer = await createUser({
    email,
    passwordHash: await hashPassword(klartext),
    displayName: email.split('@')[0] ?? 'Administrator',
    role: 'SUPER_ADMIN',
  });

  await auditLogger.record({
    action: 'admin.role_changed',
    actorId: null,
    subjectType: 'User',
    subjectId: benutzer.id,
    metadata: { von: null, zu: 'SUPER_ADMIN', ueber: 'scripts/ersten-admin.ts' },
  });

  console.error(`\nKonto angelegt: ${email} (SUPER_ADMIN)`);
  if (erzeugt) {
    // Nur das erzeugte Passwort auf die Standardausgabe -- so laesst es sich
    // in einen Passwortspeicher umleiten, ohne dass es im Protokoll landet.
    console.error('Erzeugtes Passwort (jetzt sichern, es wird nicht wieder angezeigt):\n');
    process.stdout.write(`${klartext}\n`);
  }
  console.error('\nBitte nach der ersten Anmeldung ändern.\n');
}

main()
  .catch((fehler) => {
    console.error(fehler instanceof Error ? fehler.message : fehler);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
