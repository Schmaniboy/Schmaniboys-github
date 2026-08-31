-- Seed: KnownIssue Runde 5 — Restliche populaere Generationen
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen

BEGIN;

-- Mercedes GLA H247
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_h247_mbux', 'gen_mb_gla_h247', 'MBUX Infotainment Softwareprobleme', 'Infotainment', 'MINOR', 'Sporadische Neustarts des MBUX-Systems, Verzoegerungen bei App-Wechsel', 'OTA-Update oder Werkstatt-Update auf neuesten Softwarestand', 2020, 2022, 'ASSESSMENT', 'HIGH', 'Identische MBUX-Plattform wie A-Klasse W177, gleiche Softwareproblematik dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes GLE V167
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_v167_luft', 'gen_mb_gle_v167', 'AIRMATIC Luftfederung Undichtigkeit', 'Fahrwerk', 'SIGNIFICANT', 'Fahrzeug senkt sich einseitig oder komplett ueber Nacht ab, Fehlermeldung Fahrwerk', 'Federbein oder Luftbalg an betroffener Seite tauschen', 2018, 2023, 60000, 110000, 'ASSESSMENT', 'MEDIUM', 'Dokumentiert in Mercedes-Werkstaetten und ADAC-Pannenhilfe, typisches AIRMATIC-Verschleissteil', 'PUBLISHED', NOW(), NOW()),
('ki_v167_48v', 'gen_mb_gle_v167', '48V-Bordnetz EQ Boost Stoerungen', 'Elektrik', 'MINOR', 'Fehlermeldung 48V-Bordnetz, verzoegerter Motorstart nach Start-Stopp, reduzierte Rekuperation', 'Software-Update fuer Energiemanagement, selten 48V-Batterie tauschen', 2018, 2022, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Mercedes-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes E-Klasse W214
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_w214_mbux3', 'gen_mb_e_w214', 'MBUX 3.0 Superscreen Softwareprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Verzoegerungen des grossen Superscreen-Displays, sporadische Neustarts', 'OTA-Updates, Mercedes hat mehrere Patches seit Markteinfuehrung veroeffentlicht', 2023, NULL, 'ASSESSMENT', 'MEDIUM', 'Erste Berichte aus Mercedes-Foren und Fachpresse bei neuem Modell', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X1 U11
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_u11_idrive', 'gen_bmw_x1_u11', 'iDrive 9 Software-Startprobleme', 'Infotainment', 'MINOR', 'Verzoegerter Systemstart, gelegentliche App-Abbrueche, Verbindungsprobleme mit Smartphone', 'OTA-Update auf neuesten Softwarestand', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus BMW-Foren und Fachpresse bei neuem iDrive 9 bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 4er G22
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_g22_fwd', 'gen_bmw_4er_g22', 'Frontscheibenreflektion bei Sonnenlicht', 'Karosserie', 'MINOR', 'Instrumentenanzeige spiegelt sich bei flachem Sonneneinfallswinkel in der Frontscheibe', 'Polarisierende Sonnenschutzfolie oder Armaturenbrett-Abdeckung, konstruktionsbedingt', 2020, NULL, 'ASSESSMENT', 'MEDIUM', 'In BMW-Foren und Testberichten erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A5 F5
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_a5_f5_stronic', 'gen_audi_a5_f5', 'S tronic 7-Gang Anfahrruckeln', 'Getriebe', 'MINOR', 'Ruckeln beim Anfahren und im Kriechgang, unruhiger Kupplungseingriff', 'Getriebeadaption zuruecksetzen, Software-Update beim Audi-Haendler', 2016, 2022, 'ASSESSMENT', 'MEDIUM', 'Bekanntes VW-Konzern DSG/S-tronic-Verhalten, in Audi-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Q3 F3
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_q3_f3_mib', 'gen_audi_q3_f3', 'MIB3 Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Systemstart, Verzoegerungen bei Navigation und App-Anbindung', 'Software-Update beim Audi-Haendler', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'VW-Konzern MIB3-Thematik, in Audi-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi e-tron GT J1
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_etgt_2gang', 'gen_audi_etron_j1', '2-Gang-Getriebe Hinterachse Geraeusche', 'Getriebe', 'MINOR', 'Leichtes Summen bei Geschwindigkeiten um 50-70 km/h, aehnlich Porsche Taycan', 'Laut Audi innerhalb der Spezifikation, Geraeuschentwicklung bei E-Fahrzeugen normal', 2021, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Audi-Foren und Fachpresse bekannt, gleiche Plattform wie Porsche Taycan', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CUPRA Born
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_born_software', 'gen_cupra_born1', 'Infotainment-Software Instabilitaeten', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts, Verzoegerungen bei Touchscreen-Eingaben, VW-Konzern MEB-Softwarestand', 'OTA-Updates (ab Software 3.x deutlich verbessert)', 2021, 2023, 'ASSESSMENT', 'HIGH', 'Identische MEB-Software wie VW ID.3/ID.4, gleiche Problematik dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC90 II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_xc90_luft', 'gen_volvo_xc90_2', 'Luftfederung Undichtigkeit', 'Fahrwerk', 'SIGNIFICANT', 'Fahrzeug senkt sich ueber Nacht ab, Fehlermeldung Fahrwerkssteuerung', 'Federbein oder Luftbalg tauschen, bei fruehen Baujahren unter Volvo-Kulanz moeglich', 2015, 2022, 60000, 100000, 'ASSESSMENT', 'MEDIUM', 'Dokumentiert in Volvo-Werkstaetten und ADAC-Pannenhilfe', 'PUBLISHED', NOW(), NOW()),
('ki_xc90_sensus', 'gen_volvo_xc90_2', 'Sensus Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Systemstart, Verzoegerungen im 9-Zoll-Touchscreen, gelegentliche Neustarts', 'Software-Update beim Volvo-Haendler, ab 2020 deutlich verbessert', 2015, 2020, NULL, NULL, 'ASSESSMENT', 'HIGH', 'Vielfach in Volvo-Foren und ADAC-Berichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo V60 II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_v60_phev', 'gen_v60_2', 'T6/T8 PHEV Hochvolt-Fehlermeldung', 'Elektrik', 'MINOR', 'Sporadische Fehlermeldung Hochvoltsystem, reduzierte elektrische Leistung', 'Software-Update beim Volvo-Haendler, selten Hochvoltkomponente tauschen', 2018, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus Volvo-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model S Plaid
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_models_yoke', 'gen_ts_models_p', 'Yoke-Lenkrad Kritik', 'Innenraum', 'MINOR', 'Ungewohnte Lenkradbedienung bei Rangierfahrten und Kreisverkehren, fehlende Blinkerhebel', 'Umgewoehnung erforderlich, alternatives rundes Lenkrad ab 2023 verfuegbar', 2021, NULL, 'ASSESSMENT', 'HIGH', 'Vielfach in Fachpresse und Tesla-Foren diskutiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- MINI Countryman F60
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_f60_steuerkette', 'gen_mini_country_f60', 'B38/B48 Steuerkettendehnung', 'Motor', 'SIGNIFICANT', 'Rasseln bei Kaltstart, Motorwarnleuchte, unrunder Leerlauf', 'Steuerkette und Spanner erneuern, BMW-Konzern Motorenfamilie', 2017, 2020, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus BMW/MINI-Werkstaetten, fruehe B38/B48-Motoren betroffen', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
