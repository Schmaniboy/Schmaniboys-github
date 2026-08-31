-- Seed: KnownIssue Runde 4 — Weitere populaere Generationen
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen, Rueckrufaktionen (KBA/RAPEX)

BEGIN;

-- SEAT Leon IV (KL)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_leon4_dsg', 'gen_seat_leon4', 'DQ381 DSG Schaltrucke', 'Getriebe', 'MINOR', 'Ruckeln und unharmonische Schaltvorgaenge im niedrigen Geschwindigkeitsbereich', 'DSG-Adaption zuruecksetzen, Software-Update verfuegbar', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Bekanntes VW-Konzern DSG-Verhalten, in SEAT-Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_leon4_mib3', 'gen_seat_leon4', 'MIB3 Infotainment Softwareprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts, Verzoegerungen bei Touchscreen-Eingaben, App-Verbindungsabbrueche', 'Software-Update beim SEAT-Haendler', 2020, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach in SEAT- und VW-Foren dokumentiert, identisches MIB3-System wie im Golf 8', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Fabia IV (PJ)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_fabia4_mib3', 'gen_sk_fabia_pj', 'MIB3 Infotainment Startverzoegerung', 'Infotainment', 'MINOR', 'Langsamer Systemstart, Verzoegerungen bei Navigation und App-Anbindung', 'Software-Update auf aktuellen Stand', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Skoda-Foren und Testberichten bekannt, VW-Konzern MIB3-Thematik', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Superb III (3V)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_superb_dsg', 'gen_sk_superb_3v', 'DQ381 DSG Schaltrucke bei Kaelte', 'Getriebe', 'MINOR', 'Haertere Schaltvorgaenge bei kaltem Getriebe, Ruckeln im Anfahrbereich', 'Software-Update, Getriebeadaption zuruecksetzen', 2015, 2022, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Bekanntes VW-Konzern DSG-Verhalten, in Skoda-Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_superb_stossdaempfer', 'gen_sk_superb_3v', 'Stossdaempfer Hinterachse Poltern', 'Fahrwerk', 'MINOR', 'Poltergeraeusche ueber unebene Strassen, insbesondere bei kalten Temperaturen', 'Stossdaempfer und Domlager pruefen, bei Verschleiss tauschen', 2015, 2021, 40000, 80000, 'ASSESSMENT', 'MEDIUM', 'Aus TUeV-Berichten und Skoda-Werkstaetten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW ID.4 (E21)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_id4_software', 'gen_vw_id4_e2', 'Infotainment-Software Instabilitaeten', 'Infotainment', 'SIGNIFICANT', 'Haeufige Neustarts, eingefrorene Displays, Verzoegerungen bei Toucheingaben, sporadisch fehlende Funktionen', 'OTA-Updates (mehrere Versionen seit 2021 veroeffentlicht), Werkstatt-Update bei hartneckigen Problemen', 2020, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach in ADAC-Berichten, VW-Foren und Fachpresse dokumentiert, VW hat zahlreiche OTA-Updates nachgeliefert', 'PUBLISHED', NOW(), NOW()),
('ki_id4_12v', 'gen_vw_id4_e2', '12V-Batterie Entladung', 'Elektrik', 'MINOR', 'Fahrzeug laesst sich nach laengerem Stehen nicht starten, 12V-Zusatzbatterie entladen', 'Software-Update fuer Ruhestrommanagement, ggf. 12V-Batterie ersetzen', 2020, 2022, 'ASSESSMENT', 'HIGH', 'Bekannt aus ADAC-Pannenhilfe und VW-Rueckrufen', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Touran (5T)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_touran_dsg', 'gen_vw_touran_5t', 'DQ200 DSG Ruckeln', 'Getriebe', 'MINOR', 'Ruckeln und Zittern beim Anfahren, unruhiges Verhalten im Stop-and-Go', 'DSG-Adaption zuruecksetzen, Software-Update beim Haendler', 2015, 2022, NULL, NULL, 'ASSESSMENT', 'HIGH', 'VW-Konzern DQ200-Thematik, vielfach dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_touran_schiebetuer', 'gen_vw_touran_5t', 'Schiebetuer-Mechanik klemmt', 'Karosserie', 'MINOR', 'Schiebetuer oeffnet oder schliesst nicht sauber, Blockieren bei Kaelte', 'Fuehrungsschienen reinigen und schmieren, ggf. Seilzug erneuern', 2015, 2020, 30000, 70000, 'ASSESSMENT', 'MEDIUM', 'Aus VW-Werkstaetten und Nutzerforen bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai Kona (SZ)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_kona_dct', 'gen_hy_kona_sz', '7-Gang-DCT Vibrationen', 'Getriebe', 'MINOR', 'Vibrationen und Ruckeln beim Anfahren und bei niedrigen Geschwindigkeiten', 'Getriebeadaption und Software-Update beim Hyundai-Haendler', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'Bekanntes Hyundai/Kia DCT-Verhalten, in Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_kona_ev_recall', 'gen_hy_kona_sz', 'Kona Electric Batterie-Rueckruf', 'Batterie', 'CRITICAL', 'Risiko eines Batteriebrands bei der Hochvolt-Batterie, Rueckruf KBA weltweit', 'Batteriemodul-Tausch beim Hyundai-Haendler (kostenlos im Rueckruf)', 2018, 2020, 'SPECIFICATION', 'HIGH', 'KBA-Rueckruf dokumentiert, Hyundai hat weltweiten Rueckruf durchgefuehrt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai i20 (BC3)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_i20_kuppl', 'gen_hy_i20_bc3', 'iMT Schaltgetriebe-Assistent Ruckeln', 'Getriebe', 'MINOR', 'Ungewohntes Kupplungsverhalten durch automatischen Kupplungsaktuator (iMT), Ruckeln beim Schalten', 'Eingewoehnung erforderlich, Software-Update fuer sanftere Uebergaenge verfuegbar', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Hyundai-Foren und Testberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Ceed (CD)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ceed_dct', 'gen_kia_ceed_cd', '7-Gang-DCT Schaltrucke', 'Getriebe', 'MINOR', 'Ruckeln beim Anfahren und im niedrigen Geschwindigkeitsbereich, unharmonische Schaltvorgaenge', 'Software-Update beim Kia-Haendler, Getriebeadaption', 2018, 2023, 'ASSESSMENT', 'MEDIUM', 'Bekanntes Hyundai/Kia DCT-Verhalten, in Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_ceed_navi', 'gen_kia_ceed_cd', 'Navigationssystem Kartendaten veraltet', 'Infotainment', 'MINOR', 'Veraltete Kartendaten, umstaendliche Aktualisierung ueber USB-Stick', 'Karten-Update beim Haendler oder ueber Kia-Connect-Portal', 2018, 2022, 'ASSESSMENT', 'MEDIUM', 'In Kia-Foren haeufig erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Niro (DE3)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_niro2_infotain', 'gen_kia_niro_de3', 'Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Gelegentliche Verzoegerungen beim Systemstart und App-Wechsel', 'OTA-Update oder Werkstatt-Update durchfuehren', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Kia-Foren und ersten Langzeittests bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Dacia Duster III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_duster3_wind', 'gen_dacia_duster3', 'Windgeraeusche bei Autobahngeschwindigkeit', 'Karosserie', 'MINOR', 'Erhoehte Windgeraeusche ab 120 km/h im Bereich der A-Saeule und des Dachs', 'Tuerdichtungen und Spiegelverkleidung pruefen, konstruktionsbedingt in der Preisklasse', 2024, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Fachpresse-Tests und Nutzerforen bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Mokka II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mokka2_eat8', 'gen_opel_mokka_2', 'EAT8 Automatik Schaltverzoegerungen', 'Getriebe', 'MINOR', 'Gelegentlich verzoegerte Gangwechsel im Sportmodus, unruhiges Schalten bei Kaelte', 'Getriebeadaption beim Haendler, Software-Update', 2020, 2024, 'ASSESSMENT', 'MEDIUM', 'Bekanntes PSA/Stellantis EAT8-Verhalten, aus Opel-Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_mokka2_sicht', 'gen_opel_mokka_2', 'Eingeschraenkte Uebersichtlichkeit', 'Karosserie', 'MINOR', 'Dicke C-Saeule und schmale Heckscheibe schraenken die Sicht nach hinten deutlich ein', 'Rueckfahrkamera (Serie ab GS Line) nutzen, Einparksensoren empfehlenswert', 2020, NULL, 'ASSESSMENT', 'HIGH', 'In ADAC-Autotest und Fachpresse-Tests dokumentiert, designbedingt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 308 III (P51)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_308_eat8', 'gen_308_3', 'EAT8 Automatik Schaltrucke', 'Getriebe', 'MINOR', 'Gelegentlich unharmonische Schaltvorgaenge, insbesondere bei niedrigen Drehzahlen', 'Software-Update fuer Schaltpunktoptimierung beim Peugeot-Haendler', 2021, 2024, 'ASSESSMENT', 'MEDIUM', 'Bekanntes Stellantis EAT8-Verhalten, aus Peugeot-Foren dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_308_icockpit', 'gen_308_3', 'i-Cockpit Lenkrad-Sichtfeld', 'Innenraum', 'MINOR', 'Bei manchen Sitzpositionen verdeckt das kleine Lenkrad Teile des Kombiinstruments', 'Sitz- und Lenkradposition anpassen, konstruktionsbedingt bei i-Cockpit', 2021, NULL, 'ASSESSMENT', 'MEDIUM', 'In Fachpresse-Tests und Nutzerforen dokumentiert, Peugeot i-Cockpit Eigenart', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Megane E-Tech
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_megane_ev_ota', 'gen_ren_megane_ev', 'OpenR Link Infotainment Softwareprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts des Android-basierten OpenR-Systems, App-Verzoegerungen', 'OTA-Updates (Google regelmässige Updates), Werkstatt-Reset bei hartneckigen Problemen', 2022, 2024, 'ASSESSMENT', 'MEDIUM', 'Aus Renault-Foren und Fachpresse bekannt, Android Automotive erste Generation', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Puma
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_puma_mhev', 'gen_ford_puma_1', 'Mild-Hybrid 48V Startverzoegenrung', 'Elektrik', 'MINOR', 'Gelegentlich verzoegerter Motorstart nach automatischem Start-Stopp', 'Software-Update fuer Energiemanagement', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus Ford-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW()),
('ki_puma_megabox', 'gen_ford_puma_1', 'MegaBox Abfluss verstopft', 'Karosserie', 'MINOR', 'Wasser sammelt sich in der MegaBox im Kofferraum, Ablauf verstopft durch Laub', 'Ablauf regelmässig pruefen und reinigen', 2019, NULL, 'ASSESSMENT', 'MEDIUM', 'In Ford-Foren vereinzelt dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-30 (DM)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_cx30_skyactx', 'gen_cx30_1', 'Skyactiv-X Motorsound bei Kaelte', 'Motor', 'MINOR', 'Dieselaehnliches Klopfgeraeusch bei kaltem Motor durch Kompressionszuendung (SPCCI)', 'Konstruktionsbedingt bei Skyactiv-X, verschwindet nach Warmlaufen — kein Defekt', 2019, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Mazda-Foren und Fachpresse bekannt, SPCCI-Technologie Eigenart', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
