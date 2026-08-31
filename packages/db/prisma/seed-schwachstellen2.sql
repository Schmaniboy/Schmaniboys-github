-- Seed: KnownIssue Runde 2 — Weitere populaere Generationen
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen, Rueckrufaktionen (KBA/RAPEX)
-- Nur oeffentlich dokumentierte, gut belegte Schwachstellen

BEGIN;

-- Audi A3 8Y
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_a3_8y_mmi', 'gen_audi_a3_8y', 'MMI-Infotainment Softwareprobleme', 'Infotainment', 'MINOR', 'Sporadische Neustarts, eingefrorene Displays, Verzoegerungen bei Bedienung des MIB3-Systems', 'Software-Update beim Audi-Haendler, OTA-Updates ab 2022 verfuegbar', 2020, 2022, 'ASSESSMENT', 'HIGH', 'Vielfach in Foren und ADAC-Berichten dokumentiert, Audi hat Software-Updates veroeffentlicht', 'PUBLISHED', NOW(), NOW()),
('ki_a3_8y_stronic', 'gen_audi_a3_8y', 'S tronic Ruckeln bei niedrigen Geschwindigkeiten', 'Getriebe', 'MINOR', 'Ruckeln im Anfahrbereich, unruhiges Verhalten bei Schrittgeschwindigkeit im Stau', 'Getriebeadaption zuruecksetzen, Software-Update DQ381', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Bekanntes Verhalten bei VW-Konzern DSG/S-tronic, durch Software-Anpassungen reduzierbar', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 1er F40
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_1er_f40_getriebe', 'gen_bmw_1er_f40', 'Steptronic Getriebe Schaltruecke', 'Getriebe', 'MINOR', 'Hartes Schalten bei Kaltstart, unruhiger Gangwechsel im niedrigen Geschwindigkeitsbereich', 'Softwarestand aktualisieren (ab 11/2020 verbessert)', 2019, 2021, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus BMW-Foren, BMW hat Softwarestand aktualisiert', 'PUBLISHED', NOW(), NOW()),
('ki_1er_f40_lenkung', 'gen_bmw_1er_f40', 'Lenkungsgeraeusche bei Kaelte', 'Lenkung', 'MINOR', 'Leichtes Knacken oder Knarzen aus dem Lenkungsbereich bei niedrigen Temperaturen', 'Lenkungsmanschetten oder Lenksaeulenlager pruefen und ggf. tauschen', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in TUeV-Berichten und Werkstattmeldungen dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X5 G05
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_x5_g05_luftfed', 'gen_bmw_x5_g05', 'Luftfederung Undichtigkeit', 'Fahrwerk', 'SIGNIFICANT', 'Fahrzeug senkt sich einseitig ueber Nacht ab, Fehlermeldung Fahrwerksteuerung', 'Federbalgwechsel an betroffener Achse', 2018, 2023, 60000, 100000, 'ASSESSMENT', 'MEDIUM', 'Dokumentiert in Werkstattforen und bei ADAC-Pannenhilfe, typisches Verschleissteil bei Luftfederung', 'PUBLISHED', NOW(), NOW()),
('ki_x5_g05_antrieb', 'gen_bmw_x5_g05', 'Antriebswelle Vibrationen xDrive', 'Antrieb', 'SIGNIFICANT', 'Vibrationen bei 120-160 km/h, dumpfes Brummen aus dem Unterboden', 'Gelenkwellen xDrive-System pruefen und ggf. ersetzen, erweiterte Garantie bei fruehen Baujahren', 2018, 2021, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus KBA-Rueckrufaktionen und BMW-Werkstaetten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes A-Klasse W177
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_w177_m282', 'gen_mb_a_w177', 'M282 Motor Steuerkettendehnung', 'Motor', 'SIGNIFICANT', 'Rasseln bei Kaltstart, Motorwarnleuchte, unrunder Leerlauf', 'Steuerkette und Spanner erneuern, Kulanzantrag bei Mercedes moeglich', 2018, 2021, 60000, 100000, 'ASSESSMENT', 'HIGH', 'Bekannt aus ADAC-Pannenstatistik und Mercedes-Werkstaetten, betrifft A 200 und A 250', 'PUBLISHED', NOW(), NOW()),
('ki_w177_mbux', 'gen_mb_a_w177', 'MBUX Infotainment Neustarts', 'Infotainment', 'MINOR', 'Spontane Neustarts des MBUX-Systems, insbesondere bei Apple-CarPlay-Nutzung', 'OTA-Update oder Werkstatt-Update durchfuehren', 2018, 2020, NULL, NULL, 'ASSESSMENT', 'HIGH', 'Vielfach in Mercedes-Foren und bei der ADAC-Pannenhilfe dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai IONIQ 5
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ioniq5_12v', 'gen_hy_ioniq5_ne', '12V-Batterie Entladung', 'Elektrik', 'MINOR', 'Fahrzeug laesst sich nach 2+ Wochen Standzeit nicht starten, 12V-Batterie leer', 'Software-Update zur Reduzierung der Ruhestroeme, ggf. 12V-Batterie ersetzen', 2021, 2022, 'ASSESSMENT', 'HIGH', 'Bekannt aus ADAC-Berichten und Hyundai-Rueckruf, Software-Update verfuegbar', 'PUBLISHED', NOW(), NOW()),
('ki_ioniq5_ladeklappe', 'gen_hy_ioniq5_ne', 'Elektrische Ladeklappe klemmt', 'Karosserie', 'MINOR', 'Ladeklappe klemmt bei Kaelte oder oeffnet sich nicht vollstaendig', 'Dichtungsgummis schmieren oder Aktuator tauschen', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Nutzerforen und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Taycan Y1A
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_taycan_pcm', 'gen_por_taycan_y1a', 'PCM 6.0 Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Verzoegerungen beim App-Wechsel, gelegentliche Haenger des Displays', 'OTA-Updates durchfuehren, mehrere Verbesserungen seit Erstversion', 2019, 2022, 'ASSESSMENT', 'HIGH', 'Bekannt aus Porsche-Foren und Fachpresse, mehrere OTA-Updates veroeffentlicht', 'PUBLISHED', NOW(), NOW()),
('ki_taycan_2gang', 'gen_por_taycan_y1a', '2-Gang-Getriebe Hinterachse Summen', 'Getriebe', 'MINOR', 'Leichtes Summen bei Geschwindigkeiten um 50-60 km/h', 'Laut Porsche innerhalb der Spezifikation, kein Handlungsbedarf', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in Porsche-Foren diskutiert, kein Sicherheitsproblem', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model Y (ergaenzend)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_modely_spalt', 'gen_ts_modely_1', 'Ungleichmaessige Spaltmasse', 'Karosserie', 'MINOR', 'Sichtbare Unterschiede in den Spaltmassen an Tueren, Motorhaube, Kofferraumdeckel', 'Beim Haendler nachjustieren lassen, bei fruehen Baujahren haeufiger', 2021, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach in Tests (ADAC, Auto Motor Sport) dokumentiert, Tesla hat Produktion optimiert', 'PUBLISHED', NOW(), NOW()),
('ki_modely_hinterachse', 'gen_ts_modely_1', 'Poltergeraeusche Hinterachse', 'Fahrwerk', 'MINOR', 'Poltern ueber unebene Strassen aus dem hinteren Fahrwerksbereich', 'Stabilisator-Koppelstangen und Querlenkerbuchsen pruefen', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Werkstattberichten und Tesla-Foren bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC40
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_xc40_aisin', 'gen_volvo_xc40_1', 'Aisin-Automatik Schaltverzoegerung', 'Getriebe', 'MINOR', 'Schaltverzoegerungen bei niedrigen Geschwindigkeiten, unruhiger Gangwechsel', 'Getriebeadaption und Software-Reset beim Volvo-Haendler', 2017, 2021, 'ASSESSMENT', 'MEDIUM', 'Aus Volvo-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW()),
('ki_xc40_mildhybrid', 'gen_volvo_xc40_1', 'B4/B5 Mild-Hybrid Startprobleme', 'Elektrik', 'MINOR', 'Verzoegerter Start bei niedrigen Temperaturen, 48V-System benoetigt Ladezustand', 'OTA-Update von Volvo einspielen', 2020, 2022, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in Volvo-Foren und ADAC-Pannenmeldungen dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia EV6
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ev6_12v', 'gen_kia_ev6_cv', '12V-Batterie Entladung im Standby', 'Elektrik', 'MINOR', 'Fahrzeug laesst sich nach laengerem Stehen nicht starten, identisch zum IONIQ 5', 'Software-Update zur Ruhestrom-Optimierung, 12V-Batterie ggf. ersetzen', 2021, 2022, 'ASSESSMENT', 'HIGH', 'Bekannt aus Kia-Rueckrufen und ADAC-Berichten', 'PUBLISHED', NOW(), NOW()),
('ki_ev6_bremse', 'gen_kia_ev6_cv', 'Bremspedalgefuehl Rekuperation', 'Bremse', 'MINOR', 'Unharmonischer Uebergang von regenerativem zu mechanischem Bremsen', 'OTA-Update fuer verbesserte Bremskraftverteilung', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus Fachpresse-Tests und Nutzerfeedback', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X3 G01 (ergaenzend)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_x3_g01_oelverlust', 'gen_bmw_x3_g01', 'Oelverlust Ventildeckeldichtung B48', 'Motor', 'MINOR', 'Oelgeruch nach verbranntem Oel bei Stopp, sichtbarer Oelfilm am Ventildeckel', 'Ventildeckeldichtung erneuern', 2017, 2021, 50000, 80000, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus BMW-Werkstaetten und TUeV-Berichten', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes GLC X254 (ergaenzend)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_glc_x254_9g', 'gen_mb_glc_x254', '9G-TRONIC Schaltkomfort bei Kaelte', 'Getriebe', 'MINOR', 'Haertere Schaltvorgaenge in den ersten 5-10 Minuten bei kaltem Getriebe', 'Normalisiert sich nach Erreichen der Betriebstemperatur, kein Defekt', 2022, 2024, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus Mercedes-Foren, Getriebecharakteristik laut Mercedes', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
