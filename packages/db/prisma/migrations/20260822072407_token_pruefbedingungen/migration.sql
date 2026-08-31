-- Pruefbedingungen fuer das Token-Guthaben.
--
-- Prisma kennt keine CHECK-Bedingungen im Schema, deshalb hier von Hand.
-- Sie sind die letzte Verteidigungslinie: Selbst wenn ein Fehler in der
-- Anwendung eine falsche Buchung erzeugt, laesst die Datenbank sie nicht zu.
--
-- Ohne diese Bedingungen waere "keine negativen Guthaben" eine Zusage der
-- Anwendung. Mit ihnen ist es eine Zusage der Datenbank.

ALTER TABLE "Wallet"
  ADD CONSTRAINT "Wallet_balance_nicht_negativ" CHECK ("balanceTokens" >= 0);

ALTER TABLE "Wallet"
  ADD CONSTRAINT "Wallet_reserviert_nicht_negativ" CHECK ("reservedTokens" >= 0);

-- Es kann nie mehr reserviert sein als vorhanden.
ALTER TABLE "Wallet"
  ADD CONSTRAINT "Wallet_reserviert_hoechstens_guthaben"
  CHECK ("reservedTokens" <= "balanceTokens");

-- Eine Reservierung ueber null oder negativ ergibt keinen Sinn.
ALTER TABLE "TokenHold"
  ADD CONSTRAINT "TokenHold_betrag_positiv" CHECK ("amountTokens" > 0);

-- Eine Buchung ueber null waere ein Eintrag ohne Wirkung.
ALTER TABLE "TokenTransaction"
  ADD CONSTRAINT "TokenTransaction_betrag_ungleich_null" CHECK ("amountTokens" <> 0);

-- Der Stand nach einer Buchung kann nicht negativ sein.
ALTER TABLE "TokenTransaction"
  ADD CONSTRAINT "TokenTransaction_stand_nicht_negativ" CHECK ("balanceAfter" >= 0);
