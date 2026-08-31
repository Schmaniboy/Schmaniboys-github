-- =============================================================================
-- Admin-Konto fuer CARONEX
--
-- Dieses Skript legt den ersten SUPER_ADMIN an, damit der Adminbereich
-- erreichbar ist. Das Passwort muss nach dem ersten Login geaendert werden.
--
-- Alternativ: npx tsx scripts/ersten-admin.ts JannikMittendorf2006@gmail.com
-- =============================================================================

BEGIN;

INSERT INTO "User" (id, email, "passwordHash", "displayName", role, status, "emailVerifiedAt", "createdAt", "updatedAt")
VALUES (
  'usr_admin_jannik',
  'jannikmittendorf2006@gmail.com',
  'scrypt$32768$8$1$q0kA0vuCKYC7CFisXDdEAQ==$I7OxeqgUviGaiWO8bcK/rgRRTdgxlrfUfsHe61tYRXhjD2BwF5+q39YjIcU+lFEdY5bKRpRQm7cqNIR3cSJYjQ==',
  'Jannik',
  'SUPER_ADMIN',
  'ACTIVE',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  status = 'ACTIVE',
  "updatedAt" = NOW();

COMMIT;
