import { requirePrincipal, type Principal } from '../auth/access';
import { Permission, Role, can } from '../auth/roles';
import { errors } from '../errors';

/**
 * Regeln der Moderation und Verwaltung.
 *
 * Der Grundsatz: **Ein Administrator ist nicht allmaechtig, sondern
 * zustaendig.** Was er darf, steht in der Rechtematrix; was er tut, steht im
 * Protokoll; und einige Dinge darf auch er nicht -- nicht aus Misstrauen,
 * sondern weil sie sonst niemand mehr rueckgaengig machen koennte.
 */

/** Begruendung fuer eine Massnahme. Sie ist Pflicht, nicht Zierrat. */
export function pruefeBegruendung(grund: string, feld = 'reason'): string {
  const bereinigt = grund.trim();
  if (bereinigt.length < 10) {
    throw errors.validation({
      [feld]: [
        'Bitte einen nachvollziehbaren Grund angeben. Er bleibt im Protokoll stehen und ' +
          'ist später die einzige Erklärung für diese Maßnahme.',
      ],
    });
  }
  if (bereinigt.length > 1000) {
    throw errors.validation({ [feld]: ['Der Grund ist zu lang.'] });
  }
  return bereinigt;
}

/**
 * Rollenvergabe.
 *
 * Vier Sperren, jede mit eigenem Grund:
 *
 * 1. Nur SUPER_ADMIN darf Rollen vergeben -- das ist die einzige
 *    Erweiterung gegenueber ADMIN und der Grund, dass es die Rolle gibt.
 * 2. Niemand aendert die eigene Rolle. Sich selbst zu erhoehen waere die
 *    naheliegendste Rechteausweitung ueberhaupt.
 * 3. Die letzte SUPER_ADMIN-Rolle laesst sich nicht abgeben -- danach koennte
 *    niemand mehr Rollen vergeben, auch nicht zurueck.
 * 4. Haendlerrollen werden hier nicht vergeben. Sie haengen an einem Betrieb
 *    und werden dort verwaltet; eine Haendlerrolle ohne Betrieb waere ein
 *    Zustand, den keine Pruefung erwartet.
 */
export function assertRollenwechselErlaubt(input: {
  handelnde: Principal | null;
  zielUserId: string;
  zielRolleAktuell: Role;
  zielRolleNeu: Role;
  verbleibendeSuperAdmins: number;
}): Principal {
  const admin = requirePrincipal(input.handelnde);

  if (!can(admin.role, Permission.ADMIN_ROLE_ASSIGN)) {
    throw errors.forbidden('Rollen vergibt ausschliesslich die oberste Administration.');
  }

  if (admin.userId === input.zielUserId) {
    throw errors.conflict(
      'Die eigene Rolle lässt sich hier nicht ändern. Das muss eine andere Person aus der ' +
        'obersten Administration tun.',
    );
  }

  if (
    input.zielRolleAktuell === Role.SUPER_ADMIN &&
    input.zielRolleNeu !== Role.SUPER_ADMIN &&
    input.verbleibendeSuperAdmins <= 1
  ) {
    throw errors.conflict(
      'Das ist die letzte Person mit oberster Administration. Danach könnte niemand mehr ' +
        'Rollen vergeben — auch nicht zurück.',
    );
  }

  if (input.zielRolleNeu === Role.DEALER_OWNER || input.zielRolleNeu === Role.DEALER_STAFF) {
    throw errors.conflict(
      'Händlerrollen werden im Händlerbereich vergeben, nicht hier. Sie hängen an einem ' +
        'Betrieb; ohne Betrieb ergäben sie keinen Sinn.',
    );
  }

  return admin;
}

/**
 * Sperren eines Kontos.
 *
 * Auch hier: nicht sich selbst, und keine Person mit oberster Administration
 * durch eine gewoehnliche Administration. Sonst waere die Sperrfunktion ein
 * Weg, die Aufsicht loszuwerden.
 */
export function assertSperrungErlaubt(input: {
  handelnde: Principal | null;
  zielUserId: string;
  zielRolle: Role;
}): Principal {
  const admin = requirePrincipal(input.handelnde);

  if (!can(admin.role, Permission.ADMIN_USERS)) {
    throw errors.forbidden();
  }
  if (admin.userId === input.zielUserId) {
    throw errors.conflict('Das eigene Konto lässt sich hier nicht sperren.');
  }
  if (input.zielRolle === Role.SUPER_ADMIN && admin.role !== Role.SUPER_ADMIN) {
    throw errors.forbidden(
      'Ein Konto der obersten Administration lässt sich nur von dort sperren.',
    );
  }

  return admin;
}

/** Massnahmen der Moderation an einer Anzeige. */
export const ListingModerationAction = {
  /** Anzeige aus dem Marktplatz nehmen. */
  HIDE: 'HIDE',
  /** Wieder freigeben. */
  RESTORE: 'RESTORE',
} as const;

export type ListingModerationAction =
  (typeof ListingModerationAction)[keyof typeof ListingModerationAction];

/** Massnahmen an einer Nachricht. */
export const MessageModerationAction = {
  HIDE: 'HIDE',
  RESTORE: 'RESTORE',
} as const;

export type MessageModerationAction =
  (typeof MessageModerationAction)[keyof typeof MessageModerationAction];
