-- Seed: KnownIssue Runde 3 — Weitere populaere Generationen
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen, Rueckrufaktionen (KBA/RAPEX)
-- Nur oeffentlich dokumentierte, gut belegte Schwachstellen

BEGIN;

-- VW Polo VI (AW)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_polo_aw_dsg', 'gen_vw_polo_aw', 'DQ200 DSG Ruckeln im Kriechgang', 'Getriebe', 'MINOR', 'Ruckeln und Zittern beim Anfahren und im Stop-and-Go-Verkehr, unharmonischer Kupplungseingriff', 'DSG-Adaption zuruecksetzen lassen, Software-Update beim Haendler', 2017, 2022, 'ASSESSMENT', 'HIGH', 'Vielfach dokumentiert in ADAC-Pannenstatistik und VW-Foren, bekanntes DQ200-Verhalten', 'PUBLISHED', NOW(), NOW()),
('ki_polo_aw_mib', 'gen_vw_polo_aw', 'MIB Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Systemstart, Verzoegerungen bei Touchscreen-Eingaben, sporadische App-Abbrueche', 'Software-Update beim VW-Haendler einspielen', 2017, 2021, 'ASSESSMENT', 'MEDIUM', 'In VW-Foren und Testberichten haeufig erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW T-Roc (A11)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_troc_dsg', 'gen_vw_troc_a1', 'DQ381 DSG Schaltrucke bei Kaelte', 'Getriebe', 'MINOR', 'Haertere Schaltvorgaenge in den ersten Minuten bei kalten Temperaturen', 'Normalisiert sich nach Erreichen der Betriebstemperatur, Software-Update verfuegbar', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus VW-Foren und Werkstattberichten bekannt, typisches DSG-Verhalten', 'PUBLISHED', NOW(), NOW()),
('ki_troc_windgeraeusch', 'gen_vw_troc_a1', 'Windgeraeusche A-Saeule ab 120 km/h', 'Karosserie', 'MINOR', 'Pfeifende oder zischende Geraeusche im Bereich der A-Saeule und Aussenspiegel bei hoeherer Geschwindigkeit', 'Tuerdichtungen und Spiegelverkleidung pruefen, ggf. Nachdichtung', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'In Fahrzeugtests und Nutzerforen dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Tiguan III
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_tiguan3_infotain', 'gen_vw_tiguan_3', 'MIB4 Infotainment Softwareprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts des Infotainmentsystems, Verzoegerungen beim Wechsel zwischen Apps', 'OTA-Update oder Werkstatt-Update durchfuehren', 2024, NULL, 'ASSESSMENT', 'MEDIUM', 'Erste Berichte aus VW-Foren und Fachpresse bei neuem Modell', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Passat B9
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_passat_b9_matrix', 'gen_vw_passat_b9', 'IQ.LIGHT Matrix-LED Kalibrierung', 'Beleuchtung', 'MINOR', 'Ungleichmaessige Ausleuchtung oder fehlende Segmente im Matrix-LED-Fernlicht', 'LED-Scheinwerfer-Kalibrierung beim Haendler durchfuehren', 2023, NULL, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in VW-Foren und ersten Langzeittests erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes C-Klasse W206
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_w206_mbux2', 'gen_mb_c_w206', 'MBUX 2.0 Softwareinstabilitaeten', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts, verzoegerter Systemstart nach Motorstart, eingefrorenes Display', 'OTA-Update oder Werkstatt-Update auf neuesten Softwarestand', 2021, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach in Mercedes-Foren und ADAC-Berichten dokumentiert, Mercedes hat mehrere Updates veroeffentlicht', 'PUBLISHED', NOW(), NOW()),
('ki_w206_hinterachse', 'gen_mb_c_w206', 'Poltergeraeusche Hinterachse bei Kaelte', 'Fahrwerk', 'MINOR', 'Dumpfes Poltern aus der Hinterachse bei Kaltstart ueber unebene Fahrbahn', 'Querlenkerbuchsen und Stabilisator-Koppelstangen pruefen', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Mercedes-Werkstattberichten und Nutzerforen bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes CLA C118
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_c118_m282', 'gen_mb_cla_c118', 'M282 Steuerkettendehnung', 'Motor', 'SIGNIFICANT', 'Rasseln bei Kaltstart, unrunder Leerlauf, Motorwarnleuchte', 'Steuerkette und Spanner erneuern, Kulanzantrag bei Mercedes moeglich', 2019, 2021, 'ASSESSMENT', 'HIGH', 'Identisches Problem wie A-Klasse W177, gleiche Motorplattform M282', 'PUBLISHED', NOW(), NOW()),
('ki_c118_dct', 'gen_mb_cla_c118', '8G-DCT Doppelkupplungsgetriebe Vibrationen', 'Getriebe', 'MINOR', 'Leichte Vibrationen im Anfahrbereich, unruhiger Kupplungseingriff bei Schrittgeschwindigkeit', 'Getriebeadaption und Software-Update beim Haendler', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus Mercedes-Foren, aehnlich anderen DCT-Systemen', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes S-Klasse W223
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_w223_ereactive', 'gen_mb_s_w223', 'E-ACTIVE BODY CONTROL Fehlermeldung', 'Fahrwerk', 'SIGNIFICANT', 'Sporadische Fehlermeldung der aktiven Fahrwerkssteuerung, Fahrzeug senkt sich ab', 'Software-Update oder Steuergeraet-Reset beim Haendler, selten Hardware-Tausch noetig', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Mercedes-Werkstaetten und Fachpresse bekannt, betrifft Modelle mit Luftfederung und E-ABC', 'PUBLISHED', NOW(), NOW()),
('ki_w223_rearaxle', 'gen_mb_s_w223', 'Hinterachslenkung Kalibrierungsprobleme', 'Lenkung', 'MINOR', 'Ungleichmaessiges Lenkverhalten bei niedrigen Geschwindigkeiten, Fehlermeldung Hinterachslenkung', 'Kalibrierung der Hinterachslenkung beim Mercedes-Haendler', 2020, 2022, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in Mercedes-Foren und Werkstattberichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er G30
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_g30_steuerkette', 'gen_bmw_5er_g30', 'B48/B58 Steuerkettenspanner Verschleiss', 'Motor', 'SIGNIFICANT', 'Rasseln bei Kaltstart, Motorwarnleuchte, verschlechterter Leerlauf', 'Steuerkettenspanner und ggf. Kette erneuern', 2016, 2020, 80000, 120000, 'ASSESSMENT', 'MEDIUM', 'Dokumentiert in BMW-Werkstaetten und TUeV-Berichten, bei fruehen B48-Motoren bekannt', 'PUBLISHED', NOW(), NOW()),
('ki_g30_display', 'gen_bmw_5er_g30', 'iDrive 7 Display-Defekte', 'Infotainment', 'MINOR', 'Dunkle Stellen oder Verfaerbungen im Bildschirmrand, seltener kompletter Display-Ausfall', 'Displayeinheit tauschen, haeufig unter BMW-Garantie', 2016, 2021, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus BMW-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A6 C8
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_a6_c8_mmi', 'gen_audi_a6_c8', 'MMI Touch Response Softwareprobleme', 'Infotainment', 'MINOR', 'Verzoegerungen beim Wechsel zwischen Bildschirmen, gelegentliche Neustarts des oberen oder unteren Displays', 'Software-Update beim Audi-Haendler, mehrere Verbesserungen seit 2018 veroeffentlicht', 2018, 2022, 'ASSESSMENT', 'HIGH', 'Vielfach in Audi-Foren und ADAC-Berichten dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_a6_c8_mildhybrid', 'gen_audi_a6_c8', '48V Mild-Hybrid System Startverzoegenrung', 'Elektrik', 'MINOR', 'Verzoegerter Motorstart nach automatischem Start-Stopp, sporadische Fehlermeldung 48V-System', 'Software-Update fuer Energiemanagement, 48V-Batterie pruefen', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus Audi-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Q7 4M
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_q7_4m_luft', 'gen_audi_q7_4m', 'Luftfederung Kompressor-Verschleiss', 'Fahrwerk', 'SIGNIFICANT', 'Fahrzeug senkt sich ueber Nacht ab, Kompressor laeuft haeufig nach, Fehlermeldung Fahrwerksteuerung', 'Luftfederkompressor oder Federbeine ersetzen', 2015, 2022, 80000, 130000, 'ASSESSMENT', 'MEDIUM', 'Dokumentiert in ADAC-Pannenstatistik und Audi-Werkstaetten, typisches Verschleissteil bei SUV-Luftfederung', 'PUBLISHED', NOW(), NOW()),
('ki_q7_4m_adblue', 'gen_audi_q7_4m', 'AdBlue-Einspritzventil Verstopfung', 'Abgassystem', 'MINOR', 'Fehlermeldung SCR-System, Motorleistung reduziert, Startverhinderung nach 1000 km Restreichweite', 'AdBlue-Einspritzventil oder Dosiermodul tauschen', 2015, 2020, 60000, 100000, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus TUeV-Berichten und VW-Konzern-Werkstaetten', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Astra L
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_astra_l_eat8', 'gen_opel_astra_l', 'EAT8 Automatik Schaltkomfort', 'Getriebe', 'MINOR', 'Gelegentlich unharmonische Schaltvorgaenge im niedrigen Geschwindigkeitsbereich', 'Getriebeadaption beim Haendler, Software-Update verfuegbar', 2021, 2024, 'ASSESSMENT', 'MEDIUM', 'Aus Opel-Foren und Stellantis-Werkstattberichten bekannt, PSA/Stellantis EAT8 bekanntes Verhalten', 'PUBLISHED', NOW(), NOW()),
('ki_astra_l_pure', 'gen_opel_astra_l', 'Pure Panel Infotainment Reaktionszeit', 'Infotainment', 'MINOR', 'Verzoegerungen bei Touchscreen-Eingaben, langsamer App-Start nach Fahrzeugstart', 'Software-Update auf neuesten Stand', 2021, 2023, 'ASSESSMENT', 'MEDIUM', 'In Opel-Foren und Fachpresse-Tests erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 208 II (P21)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_208_eat8', 'gen_208_2', 'EAT8 Automatik Ruckeln bei niedrigen Drehzahlen', 'Getriebe', 'MINOR', 'Leichtes Ruckeln beim Anfahren und im Stadtverkehr, unruhiger Gangwechsel', 'Software-Update fuer Schaltpunktoptimierung', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus Stellantis-Werkstaetten und Nutzerforen', 'PUBLISHED', NOW(), NOW()),
('ki_208_icockpit', 'gen_208_2', 'i-Cockpit 3D Displayprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Fehlanzeigen im 3D-Kombiinstrument, Helligkeitsschwankungen', 'Software-Update beim Peugeot-Haendler', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in Peugeot-Foren und Testberichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Fiesta Mk8
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_fiesta8_kupplung', 'gen_ford_fiesta_mk8', 'Kupplungsgeberzylinder Undichtigkeit', 'Kupplung', 'SIGNIFICANT', 'Kupplung laesst sich schwer betaetigen, Kupplungspedal bleibt haengen, Fluessigkeitsverlust', 'Kupplungsgeberzylinder tauschen, KBA-Rueckruf bei betroffenen Baujahren', 2017, 2020, 'ASSESSMENT', 'HIGH', 'KBA-Rueckruf dokumentiert, in ADAC-Pannenstatistik erfasst', 'PUBLISHED', NOW(), NOW()),
('ki_fiesta8_sync3', 'gen_ford_fiesta_mk8', 'SYNC 3 Systemabstuerze', 'Infotainment', 'MINOR', 'Sporadische Neustarts, eingefrorener Bildschirm, Bluetooth-Verbindungsabbrueche', 'Software-Update beim Ford-Haendler', 2017, 2021, 'ASSESSMENT', 'HIGH', 'Vielfach in Ford-Foren und ADAC-Berichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota Corolla E210
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_corolla_cvt', 'gen_toy_corolla_e210', 'CVT-Getriebe Gummibandeffekt', 'Getriebe', 'MINOR', 'Bei staerkerem Gasgeben hohe Drehzahlen ohne proportionale Beschleunigung, typisches CVT-Verhalten', 'Konstruktionsbedingt bei Hybrid-CVT, kein Defekt — Fahrweise anpassen', 2018, NULL, 'ASSESSMENT', 'MEDIUM', 'Bekanntes Verhalten bei Toyota Hybrid-Antrieben, in Fachpresse erwaehnt', 'PUBLISHED', NOW(), NOW()),
('ki_corolla_multimed', 'gen_toy_corolla_e210', 'Multimedia-System verzoegerter Start', 'Infotainment', 'MINOR', 'System benoetigt 10-15 Sekunden nach Motorstart bis zur vollen Funktionsfaehigkeit', 'Software-Update beim Toyota-Haendler', 2018, 2022, 'ASSESSMENT', 'MEDIUM', 'In Toyota-Foren und Nutzerfeedback dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er G60
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_g60_idrive9', 'gen_bmw_5er_g60', 'iDrive 9 Softwareinstabilitaeten', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts, App-Verzoegerungen, sporadischer Bildschirm-Freeze', 'OTA-Updates durchfuehren, BMW hat mehrere Patches veroeffentlicht', 2023, NULL, 'ASSESSMENT', 'HIGH', 'Vielfach in BMW-Foren und Fachpresse seit Markteinfuehrung dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_g60_bremse', 'gen_bmw_5er_g60', 'Bremspedalrueckmeldung Brake-by-Wire', 'Bremse', 'MINOR', 'Ungewohntes Bremspedalgefuehl bei der neuen Brake-by-Wire-Anlage, besonders bei langsamer Fahrt', 'Konstruktionsbedingt bei Brake-by-Wire, Eingewoehnung erforderlich — kein Defekt', 2023, NULL, 'ASSESSMENT', 'MEDIUM', 'In Fachpresse-Tests und BMW-Foren als neue Bremstechnologie-Eigenschaft diskutiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Macan 95B
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_macan_kuehlm', 'gen_por_macan_95b', 'Kuehlmittelverlust am Thermostatgehaeuse', 'Motor', 'SIGNIFICANT', 'Schleichender Kuehlmittelverlust, Warnmeldung Kuehlmittelstand, feuchte Stelle am Thermostatgehaeuse', 'Thermostatgehaeuse-Dichtung oder komplettes Modul tauschen', 2014, 2020, 50000, 90000, 'ASSESSMENT', 'MEDIUM', 'Bekannt aus Porsche-Werkstaetten und TUeV-Berichten', 'PUBLISHED', NOW(), NOW()),
('ki_macan_transfer', 'gen_por_macan_95b', 'Verteilergetriebe Oelundichtigkeit', 'Antrieb', 'MINOR', 'Oelspuren am Verteilergetriebe, gelegentlich Geraeusche beim Einlenken', 'Wellendichtring am Verteilergetriebe erneuern', 2014, 2019, 60000, 100000, 'ASSESSMENT', 'MEDIUM', 'Aus Porsche-Foren und Werkstattberichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
