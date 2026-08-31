-- Seed: KnownIssue Runde 7 — Lueckenfueller: Generationen ohne KnownIssue
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen

BEGIN;

-- Peugeot 5008 II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_5008_eat8', 'gen_5008_2', 'EAT8 Automatik Schaltrucke', 'Getriebe', 'MINOR', 'Gelegentlich unharmonische Schaltvorgaenge im Stop-and-Go-Betrieb', 'Getriebeadaption und Software-Update beim Peugeot-Haendler', 2017, 2023, 'ASSESSMENT', 'MEDIUM', 'Stellantis EAT8-Thematik, auch bei 308 und 3008 dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen Berlingo III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_berlingo_eat8', 'gen_berlingo_3', 'EAT8 Automatik Verzoegerungen', 'Getriebe', 'MINOR', 'Verzoesertes Ansprechverhalten beim Anfahren, gelegentliches Ruckeln im Kriechgang', 'Software-Update beim Citroen-Haendler', 2018, 2023, 'ASSESSMENT', 'MEDIUM', 'Stellantis EAT8-Thematik im PSA-Konzern', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C3 III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_c3_eat6', 'gen_c3_3', 'EAT6 Automatik Ruckeln', 'Getriebe', 'MINOR', 'Ruckeln und Schaltstufensuchen im Stadtverkehr bei der 6-Stufen-Automatik', 'Getriebeadaption beim Citroen-Haendler', 2016, 2020, 'ASSESSMENT', 'MEDIUM', 'Aus Citroen-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C4 III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_c4_3_infotain', 'gen_c4_3', 'Infotainment-Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Start des 10-Zoll-Touchscreens, gelegentliche Verzoegerungen bei Navigation', 'Software-Update beim Citroen-Haendler', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Stellantis-Infotainment-Thematik, in Citroen-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C4 X
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_c4x_infotain', 'gen_c4x_1', 'Touchscreen-Verzoegerungen', 'Infotainment', 'MINOR', 'Gleiche Infotainment-Plattform wie C4 III, gelegentliche Verzoegerungen', 'Software-Update beim Citroen-Haendler', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Identische Plattform wie C4 III', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C5 Aircross
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_c5air_eat8', 'gen_c5air_1', 'EAT8 Automatik Anfahrschwaeche', 'Getriebe', 'MINOR', 'Verzoegertes Anfahren, gelegentliches Ruckeln im Rangierbereich', 'Getriebeadaption und Software-Update', 2018, 2022, 'ASSESSMENT', 'MEDIUM', 'Stellantis EAT8-Thematik, in C5-Aircross-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 3 Crossback
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ds3cb_tuergriff', 'gen_ds3cb_1', 'Elektrische Tuergriffe traege', 'Karosserie', 'MINOR', 'Ausfahrbare Tuergriffe reagieren bei Kaelte verzoegert oder gar nicht', 'Software-Update, bei Verschleiss Tuergriff-Mechanismus tauschen', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus DS-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 4 II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ds4_infotain', 'gen_ds4_2', 'IRIS-Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Systemstart, Verzoegerungen bei Touch-Eingaben auf dem 10-Zoll-Display', 'Software-Update beim DS-Haendler', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus DS-Foren und Fachpresse bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 7
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ds7_eat8', 'gen_ds7_1', 'EAT8 Automatik Schaltrucke', 'Getriebe', 'MINOR', 'Unharmonische Schaltvorgaenge bei niedrigen Geschwindigkeiten', 'Getriebeadaption beim DS-Haendler', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'Stellantis EAT8-Thematik', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 9
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ds9_elektrik', 'gen_ds9_1', 'PHEV Hochvolt-Fehlermeldungen', 'Elektrik', 'MINOR', 'Sporadische Fehlermeldungen im Hochvoltsystem bei E-Tense-Varianten', 'Software-Update beim DS-Haendler', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus DS-Foren bekannt, Stellantis PHEV-Plattform', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Ducato III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ducato_turbo', 'gen_ducato_3', 'Turbolader-Verschleiss', 'Motor', 'SIGNIFICANT', 'Leistungsverlust, pfeifende Geraeusche, Oelverbrauch erhoehnt, Motorwarnleuchte', 'Turbolader tauschen oder revidieren', 2014, 2022, 80000, 180000, 'ASSESSMENT', 'MEDIUM', 'Aus Ducato-Foren und Wohnmobil-Communities dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda HR-V III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_hrv3_infotain', 'gen_hrv_3', 'Infotainment Verbindungsprobleme', 'Infotainment', 'MINOR', 'Bluetooth-Verbindungsabbrueche, gelegentliche Verzoegerungen beim Touchscreen', 'Software-Update beim Honda-Haendler', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Honda-Foren und Testberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda2 IV
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mazda2_rost', 'gen_mazda2_4', 'Oberflaechenrost an Bremsen und Unterboden', 'Karosserie', 'MINOR', 'Oberflaechenrost an Bremsscheiben und Unterbodenelementen bei Wenig-Fahrern', 'Regelmaessige Bremsenreinigung, Unterbodenschutz', 2015, 2020, 'ASSESSMENT', 'MEDIUM', 'Aus TUeV-Report und Mazda-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Tipo II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_tipo_infotain', 'gen_tipo_2', 'Uconnect-System Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Start des Infotainments, gelegentliche Bluetooth-Abbrueche', 'Software-Update beim Fiat-Haendler', 2015, 2020, 'ASSESSMENT', 'MEDIUM', 'Aus Fiat-Foren und Testberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW Z4 G29
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_z4_verdeck', 'gen_bmw_z4_g29', 'Stoffverdeck-Mechanik bei Kaelte', 'Karosserie', 'MINOR', 'Verzoegertes Oeffnen/Schliessen des Verdecks bei Temperaturen unter 5 Grad', 'Konstruktionsbedingt, Verdeckmechanik pflegen und schmieren', 2018, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus BMW-Z4-Foren und Supra-Community bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda Civic XI (FL)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_civic11_infotain', 'gen_civic_11', 'Infotainment Verbindungsprobleme', 'Infotainment', 'MINOR', 'Bluetooth- und Apple-CarPlay-Verbindungsabbrueche, gelegentliche Display-Verzoegerungen', 'Software-Update beim Honda-Haendler', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Honda-Foren und Fachpresse bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-5 II (KF)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_cx5_inject', 'gen_cx5_2', 'Diesel-Injektoren Verschleiss', 'Motor', 'SIGNIFICANT', 'Unrunder Motorlauf, Leistungsverlust, erhoehter Verbrauch bei Skyactiv-D', 'Injektoren pruefen und ggf. tauschen', 2017, 2020, 'ASSESSMENT', 'MEDIUM', 'Aus Mazda-Werkstaetten und Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Dacia Sandero III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_sandero3_cvt', 'gen_dacia_sandero3', 'CVT-Getriebe Geraeusche', 'Getriebe', 'MINOR', 'Gummibandeffekt und erhoehte Motordrehzahl bei Beschleunigung mit CVT-Automatik', 'Konstruktionsbedingt bei CVT, Fahrweise anpassen', 2020, NULL, 'ASSESSMENT', 'MEDIUM', 'Typisches CVT-Verhalten, in Dacia-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Captur II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_captur2_edc', 'gen_ren_captur2', 'EDC-Doppelkupplungsgetriebe Ruckeln', 'Getriebe', 'MINOR', 'Ruckeln beim Anfahren und im niedrigen Geschwindigkeitsbereich', 'Getriebeadaption beim Renault-Haendler', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'Renault EDC-Thematik, auch beim Clio dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota Yaris (XP210)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_yaris4_hybrid', 'gen_toy_yaris_xp210', 'Hybrid-System Geraeusche bei Kaltstart', 'Motor', 'MINOR', 'Brummgeraeusch bei Kaltstart wenn der Benzinmotor anspringt, normal bei Hybrid', 'Konstruktionsbedingt beim Hybrid — kein Defekt', 2020, NULL, 'ASSESSMENT', 'MEDIUM', 'Typisches Toyota-Hybrid-Verhalten, in Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW ID.3 (E11)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_id3_software', 'gen_vw_id3_e1', 'Infotainment-Software Instabilitaeten', 'Infotainment', 'SIGNIFICANT', 'Sporadische Neustarts, Touchscreen-Verzoegerungen, Funktionsausfaelle bei fruehen Softwarestaenden', 'OTA-Updates, ab Software 3.x deutlich verbessert', 2020, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach dokumentiert in Fachpresse und VW-ID-Foren, VW hat den Softwarestand iterativ verbessert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
