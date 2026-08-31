-- Seed: KnownIssue Runde 6 — Finale: Restliche Generationen
-- Quelle: ADAC Pannenstatistik, TUeV-Report, Herstellerinformationen

BEGIN;

-- BMW 3er E90
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_e90_steuerkette', 'gen_bmw_3er_e90', 'N47 Steuerkettenschaden', 'Motor', 'CRITICAL', 'Rasseln bei Kaltstart, schwere Motorschaeden bei Kettenabriss, Motorwarnleuchte', 'Steuerkette, Spanner und Schienen praeventiv tauschen', 2007, 2012, 80000, 150000, 'ASSESSMENT', 'HIGH', 'Einer der bekanntesten BMW-Motorprobleme, vielfach in TUeV-Report und ADAC-Statistik dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_e90_elektrik', 'gen_bmw_3er_e90', 'Elektrikprobleme und Wassereinbruch', 'Elektrik', 'SIGNIFICANT', 'Sporadische Fehlermeldungen, Fensterheber-Ausfaelle, Wassereinbruch im Kofferraum', 'Betroffene Steckverbinder reinigen und abdichten, Kofferraumdichtung erneuern', 2005, 2012, NULL, NULL, 'ASSESSMENT', 'HIGH', 'Bekannt aus TUeV-Report und BMW-Werkstaetten', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 2er Active Tourer U06
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_u06_idrive', 'gen_bmw_2er_u06', 'iDrive 9 Softwareprobleme', 'Infotainment', 'MINOR', 'Gelegentliche Neustarts, App-Verzoegerungen, Verbindungsprobleme mit Smartphones', 'OTA-Update auf neuesten Softwarestand', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Identische iDrive-9-Plattform wie X1 U11, gleiche Softwareproblematik', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Leaf II (ZE1)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "typicalMileageFromKm", "typicalMileageToKm", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_leaf2_degradation', 'gen_leaf_2', 'Batteriedegradation bei haeufigem Schnellladen', 'Batterie', 'SIGNIFICANT', 'Spuerbare Kapazitaetsabnahme nach haeufigem CHAdeMO-Schnellladen, keine aktive Batterie-Kuehlung', 'Schnellladen auf noetige Faelle beschraenken, Batterie nie vollstaendig laden im Alltag', 2017, 2023, 50000, 100000, 'ASSESSMENT', 'HIGH', 'Vielfach dokumentiert, Nissan Leaf hat keine aktive Batteriekuehlung (nur passiv)', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Juke II (F16)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_juke2_dct', 'gen_juke_2', 'DIG-T DCT Getrieberuckeln', 'Getriebe', 'MINOR', 'Ruckeln beim Anfahren und im niedrigen Geschwindigkeitsbereich mit dem neuen DCT', 'Getriebeadaption und Software-Update beim Nissan-Haendler', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Nissan-Foren und Werkstattberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan X-Trail IV (T33)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_xtrail4_epow', 'gen_xtrail_4', 'e-POWER Antriebsgeraeusche bei Volllast', 'Motor', 'MINOR', 'Hohe Drehzahlen des Benzinmotors bei Volllastanforderung, da Motor nur als Generator arbeitet', 'Konstruktionsbedingt bei e-POWER Serienhybrid — kein Defekt, Fahrweise anpassen', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'In Fachpresse-Tests und Nissan-Foren als Eigenart des e-POWER-Systems erwaehnt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Ariya
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ariya_navi', 'gen_ariya_1', 'Navigationssystem Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Start des Navigationssystems, gelegentliche Verzoegerungen bei Routenberechnung', 'OTA-Update von Nissan, mehrere Verbesserungen seit Markteinfuehrung', 2022, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Nissan-Foren und Fachpresse bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda3 IV (BP)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mazda3_skyactx', 'gen_mazda3_4', 'Skyactiv-X Motorsound bei Kaelte', 'Motor', 'MINOR', 'Dieselaehnliches Klopfgeraeusch bei kaltem Motor durch SPCCI-Kompressionszuendung', 'Konstruktionsbedingt, verschwindet nach Warmlaufen — kein Defekt', 2019, NULL, 'ASSESSMENT', 'MEDIUM', 'Identische Skyactiv-X-Thematik wie CX-30, in Mazda-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda MX-5 IV (ND)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mx5_verdeck', 'gen_mx5_4', 'Softtop Dichtungsprobleme bei Kaelte', 'Karosserie', 'MINOR', 'Leichte Windgeraeusche an der Verdeckdichtung bei kalten Temperaturen, vereinzelt Feuchtigkeit', 'Verdeckdichtungen reinigen und pflegen, bei Verschleiss tauschen', 2015, 2022, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in MX-5-Foren dokumentiert, bei Cabrios nicht ungewoehnlich', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-60
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_cx60_phev', 'gen_cx60_1', 'PHEV Softwareprobleme fruehe Baujahre', 'Elektrik', 'SIGNIFICANT', 'Sporadische Fehlermeldungen Hochvoltsystem, unerwarteter Wechsel zwischen E-Modus und Verbrenner', 'OTA-Update von Mazda, mehrere Patches seit Markteinfuehrung veroeffentlicht', 2022, 2023, 'ASSESSMENT', 'HIGH', 'Vielfach in Mazda-Foren und Fachpresse dokumentiert, Mazda hat Serienstand verbessert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 2008 II (P24)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_2008_eat8', 'gen_2008_2', 'EAT8 Automatik Schaltrucke', 'Getriebe', 'MINOR', 'Gelegentlich unharmonische Schaltvorgaenge im niedrigen Geschwindigkeitsbereich', 'Getriebeadaption und Software-Update beim Peugeot-Haendler', 2019, 2023, 'ASSESSMENT', 'MEDIUM', 'Stellantis EAT8-Thematik, auch bei 208 und 308 bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Ibiza KJ
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ibiza_dsg', 'gen_seat_ibiza_kj', 'DQ200 DSG Anfahrruckeln', 'Getriebe', 'MINOR', 'Ruckeln beim Anfahren, unruhiges Verhalten im Stop-and-Go-Verkehr', 'DSG-Adaption zuruecksetzen, Software-Update beim SEAT-Haendler', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'Bekanntes VW-Konzern DQ200-Verhalten', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Arona
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_arona_mib', 'gen_arona_1', 'MIB Infotainment Verzoegerungen', 'Infotainment', 'MINOR', 'Langsamer Systemstart, gelegentliche Verzoegerungen bei Touchscreen-Eingaben', 'Software-Update beim SEAT-Haendler', 2017, 2022, 'ASSESSMENT', 'MEDIUM', 'VW-Konzern MIB-Thematik, in SEAT-Foren dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda Jazz IV (GR)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_jazz4_hybrid', 'gen_jazz_4', 'e:HEV Hybrid Uebergangsruckeln', 'Antrieb', 'MINOR', 'Gelegentliches Ruckeln beim Uebergang zwischen Elektro- und Verbrennungsmodus', 'Software-Update beim Honda-Haendler, Fahrweise anpassen', 2020, 2023, 'ASSESSMENT', 'MEDIUM', 'Aus Honda-Foren und Testberichten bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda CR-V VI
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_crv6_infotain', 'gen_crv_6', 'Infotainment Verbindungsprobleme', 'Infotainment', 'MINOR', 'Bluetooth- und Apple-CarPlay-Verbindungsabbrueche, gelegentliche Neustarts', 'Software-Update beim Honda-Haendler', 2023, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Honda-Foren und ersten Langzeittests bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda e
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_hondae_reichweite', 'gen_hondae_1', 'Geringe Praxisreichweite', 'Batterie', 'MINOR', 'Reale Reichweite oft nur 150-180 km statt 222 km WLTP, besonders im Winter deutlich weniger', 'Konstruktionsbedingt bei 35,5-kWh-Batterie, Fahrweise und Heizung beinflussen Reichweite stark', 2020, NULL, 'ASSESSMENT', 'HIGH', 'Vielfach in ADAC-Tests und Fachpresse dokumentiert, Honda hat Produktion 2024 eingestellt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Panamera 971 II
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_panamera3_pcm', 'gen_por_panamera_3', 'PCM 7.0 Softwarereife', 'Infotainment', 'MINOR', 'Gelegentliche Verzoegerungen des neuen Driver Experience Systems, App-Startzeiten', 'OTA-Updates, Porsche hat mehrere Verbesserungen seit Markteinfuehrung veroeffentlicht', 2023, NULL, 'ASSESSMENT', 'MEDIUM', 'Aus Porsche-Foren und Fachpresse bei neuem Modell bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota GR Supra A90
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_supra_diff', 'gen_toy_supra_a90', 'Hinterachsdifferenzial Geraeusche bei Kaelte', 'Antrieb', 'MINOR', 'Leichtes Klacken oder Poltern aus dem Hinterachs-Differenzial bei Kaltstart und niedrigen Temperaturen', 'Differenzialoelwechsel, bei anhaltenden Geraueschen Differenzial pruefen lassen', 2019, 2022, 'ASSESSMENT', 'MEDIUM', 'Aus Supra-Foren und BMW-Z4-Community bekannt (gleiche Plattform)', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Panda III (319)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_panda_rost', 'gen_panda_3', 'Unterboden-Korrosion', 'Karosserie', 'MINOR', 'Oberflaechenrost am Unterboden und Radlaeufen, besonders bei Salzstrassen-Nutzung', 'Unterbodenschutz regelmaessig erneuern, Hohlraumversiegelung empfohlen', 2012, 2020, 'ASSESSMENT', 'MEDIUM', 'Aus TUeV-Report und Werkstattberichten dokumentiert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
