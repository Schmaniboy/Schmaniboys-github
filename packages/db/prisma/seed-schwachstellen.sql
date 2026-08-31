-- seed-schwachstellen.sql
-- Bekannte Schwachstellen fuer populaere Generationen
-- Alle Angaben oeffentlich dokumentiert (ADAC, TUeV-Reports, Herstellerrueckrufe)
-- Constraint C3: Keine erfundenen Daten

BEGIN;

-- ============================================================
-- BMW
-- ============================================================

-- BMW 3er F30 (2012-2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_bmw_f30_steuerkette', 'gen_bmw_3er_f30', 'Steuerkettenlängung N20/N26', 'Motor / Steuerkette', 'SIGNIFICANT', 'Rasseln beim Kaltstart, Motorleuchte, Leistungsverlust', 'Steuerkette, Kettenspanner und Gleitschienen ersetzen', 60000, 120000, 2012, 2015, 'MARKET_SIGNAL', 'HIGH', 'Bekanntes Problem beim N20-Vierzylinder, zahlreiche TUeV-Berichte und ADAC-Pannenstatistik', 'PUBLISHED', NOW(), NOW()),
('ki_bmw_f30_kuehler', 'gen_bmw_3er_f30', 'Undichtigkeit Kuehlsystem', 'Kuehlsystem', 'MINOR', 'Kuehlmittelverlust, Warnung im Display, Dampf unter der Haube', 'Kuehlerdeckel und ggf. Ausgleichsbehaelter erneuern', 80000, 150000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Haeufig in TUeV-Berichten erwaehnt, typischer Verschleiss bei BMW-Kunststoffbauteilen', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- BMW 3er G20 (seit 2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_bmw_g20_getriebe', 'gen_bmw_3er_g20', 'Ruckeln ZF 8-Gang-Automatik', 'Getriebe', 'MINOR', 'Leichtes Ruckeln bei niedrigen Geschwindigkeiten, insb. Anfahren und Rangieren', 'Software-Update der Getriebesteuerung', NULL, NULL, 2019, 2021, 'MARKET_SIGNAL', 'MEDIUM', 'Bekannte Softwarethematik, durch Updates weitgehend behoben', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- BMW X3 G01 (2017-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_bmw_x3g01_bremsen', 'gen_bmw_x3_g01', 'Vorzeitiger Bremsenverschleiss vorn', 'Bremse', 'MINOR', 'Quietschen, reduzierte Bremsleistung, ungleichmaessiger Verschleiss', 'Bremsscheiben und -belaege erneuern, Bremssattel pruefen', 30000, 60000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Ueberdurchschnittlicher Verschleiss in ADAC-Statistiken, vermutlich durch hohes Fahrzeuggewicht', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- MERCEDES-BENZ
-- ============================================================

-- Mercedes C-Klasse W205 (2014-2021)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mb_w205_lenkung', 'gen_mb_c_w205', 'Lenkungsgeraeusche bei Kaelte', 'Lenkung', 'MINOR', 'Knarzen oder Knacken beim Lenken bei niedrigen Temperaturen', 'Lenkgetriebe-Schmierung bzw. Lenkmanschette erneuern', NULL, NULL, 2014, 2018, 'MARKET_SIGNAL', 'MEDIUM', 'In Foren und ADAC-Daten dokumentiert, betrifft vor allem fruehe Baujahre', 'PUBLISHED', NOW(), NOW()),
('ki_mb_w205_rost', 'gen_mb_c_w205', 'Korrosion an Radhausschalen', 'Karosserie', 'MINOR', 'Rostbildung an den hinteren Radhausschalen, sichtbar bei HU', 'Rostbehandlung, Hohlraumversiegelung', 60000, 120000, 2014, 2017, 'ASSESSMENT', 'MEDIUM', 'In TUeV-Maengelberichten auffaellig, vor allem Fahrzeuge ohne Garagenstellplatz', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Mercedes E-Klasse W213 (2016-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mb_w213_luftfeder', 'gen_mb_e_w213', 'Ausfall Luftfederung (AIRMATIC)', 'Fahrwerk / Luftfederung', 'SIGNIFICANT', 'Fahrzeug steht schief, Warnung im Kombiinstrument, Kompressorgeraeusche', 'Luftfederbalg oder Kompressor ersetzen', 80000, 150000, NULL, NULL, 'MARKET_SIGNAL', 'HIGH', 'Bekanntes Problem bei Mercedes-Luftfederung, auch bei GLE und S-Klasse', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Mercedes GLC X254 (seit 2022)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mb_x254_mbux', 'gen_mb_glc_x254', 'MBUX-Systemabstuerze', 'Infotainment / MBUX', 'MINOR', 'Bildschirm friert ein, Neustart des Systems, zeitweise Funktionsausfall', 'Software-Update ueber OTA oder in der Werkstatt', NULL, NULL, 2022, 2023, 'MARKET_SIGNAL', 'MEDIUM', 'Erste-Baujahr-Softwareprobleme, schrittweise durch Updates behoben', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VOLKSWAGEN
-- ============================================================

-- VW Golf VII (2012-2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_vw_golf7_dsg', 'gen_vw_golf7', 'Ruckeln DQ200 7-Gang-DSG', 'Getriebe / DSG', 'SIGNIFICANT', 'Ruckeln beim Anfahren, Schaltstöße bei niedrigem Tempo, Vibrationen im Leerlauf', 'Mechatronik-Update, ggf. Kupplungssatz erneuern', 40000, 100000, 2012, 2016, 'MARKET_SIGNAL', 'HIGH', 'Eines der bekanntesten DSG-Probleme, millionenfach betroffen, VW hat mehrfach nachgebessert', 'PUBLISHED', NOW(), NOW()),
('ki_vw_golf7_wassereintr', 'gen_vw_golf7', 'Wassereinbruch Heckklappe', 'Karosserie / Dichtung', 'MINOR', 'Feuchtigkeit im Kofferraum, beschlagene Rueckleuchten', 'Dichtung der Heckklappe erneuern', NULL, NULL, 2012, 2017, 'MARKET_SIGNAL', 'MEDIUM', 'Bekanntes Problem der ersten Baujahre, in ADAC-Daten dokumentiert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- VW Golf VIII (seit 2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_vw_golf8_infotainment', 'gen_vw_golf8', 'Infotainment-Probleme MIB3', 'Infotainment', 'SIGNIFICANT', 'Touchscreen reagiert nicht, System haengt, Bluetooth-Abbrueche, Rueckfahrkamera-Ausfall', 'Software-Update, ggf. Headunit-Tausch', NULL, NULL, 2020, 2022, 'MARKET_SIGNAL', 'HIGH', 'Grosses Thema bei Markteinfuehrung, zahlreiche Medienberichte und Kundenbeschwerden, Updates lieferten Besserung', 'PUBLISHED', NOW(), NOW()),
('ki_vw_golf8_touchslider', 'gen_vw_golf8', 'Empfindliche Touch-Slider am Lenkrad', 'Bedienung', 'MINOR', 'Unbeabsichtigtes Verstellen von Lautstaerke oder Tempomat durch Beruehrung', 'Kein technisches Update moeglich, Bedienung ueber Lenkradtasten oder Sprachsteuerung', NULL, NULL, 2020, NULL, 'ASSESSMENT', 'HIGH', 'Design-Entscheidung, kein Defekt im engeren Sinne, aber breit kritisiert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- VW Tiguan AD (2016-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_vw_tigad_wasserp', 'gen_vw_tiguan_ad', 'Defekte Wasserpumpe (EA888)', 'Motor / Kuehlsystem', 'SIGNIFICANT', 'Kuehlmittelverlust, Warnleuchte, Motorueberhitzung', 'Wasserpumpe ersetzen (haeufig Kunststoff-Fluegelrad gebrochen)', 60000, 120000, NULL, NULL, 'MARKET_SIGNAL', 'HIGH', 'Bekanntes Problem des EA888-Motors, betrifft auch Golf, Passat, A3', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- VW Passat B8 (2014-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_vw_passb8_adblue', 'gen_vw_passat_b8', 'AdBlue-Systemfehler (2.0 TDI)', 'Abgasnachbehandlung', 'SIGNIFICANT', 'Fehlermeldung AdBlue, Motorleuchte, Startverbot nach Countdown', 'NOx-Sensor, SCR-Katalysator oder Harnstoff-Foerdermodul ersetzen', 80000, 150000, NULL, NULL, 'MARKET_SIGNAL', 'HIGH', 'Betrifft EA288-Dieselmotoren breit, ADAC-Pannenstatistik, TUeV-Berichte', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- AUDI
-- ============================================================

-- Audi A4 B9 (2015-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_audi_a4b9_oelverb', 'gen_audi_a4_b9', 'Erhoehter Oelverbrauch 2.0 TFSI', 'Motor', 'MINOR', 'Oelstand sinkt zwischen Serviceintervallen, Nachfuellen noetig', 'Kolbenringe pruefen, ggf. ueberarbeiten. Unter 0,5l/1000km gilt als normal', 60000, 120000, 2015, 2019, 'ASSESSMENT', 'MEDIUM', 'EA888 Gen3 bekannt fuer moderaten Oelverbrauch, in Fachforen breit dokumentiert', 'PUBLISHED', NOW(), NOW()),
('ki_audi_a4b9_mmi', 'gen_audi_a4_b9', 'MMI-Systemneustarts', 'Infotainment / MMI', 'MINOR', 'Bildschirm wird schwarz, System startet neu waehrend der Fahrt', 'Software-Update, ggf. SIM-Modul ersetzen', NULL, NULL, 2015, 2018, 'MARKET_SIGNAL', 'MEDIUM', 'Erste Baujahre betroffen, durch Updates groesstenteils behoben', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Audi Q5 FY (seit 2017)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_audi_q5fy_anlasser', 'gen_audi_q5_fy', 'Start-Stopp-Anlasserprobleme', 'Elektrik / Anlasser', 'MINOR', 'Motor startet verzoegert, Klacken beim Start-Stopp-Vorgang', 'Anlasser oder AGM-Batterie ersetzen', 50000, 100000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Haeufige Start-Stopp-Zyklen belasten Anlasser und Batterie ueberdurchschnittlich', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- FORD
-- ============================================================

-- Ford Focus MK4 (seit 2018)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ford_focus4_ecoboost', 'gen_ford_focus_mk4', 'Kuehlmittelverlust 1.0 EcoBoost', 'Motor / Kuehlsystem', 'SIGNIFICANT', 'Kuehlmittelwarnung, Dampf, Ueberhitzungsgefahr', 'Zylinderkopfdichtung und Kuehlmittelflansch pruefen/ersetzen', 40000, 100000, 2018, 2020, 'MARKET_SIGNAL', 'HIGH', 'Bekanntes Problem des 1.0 EcoBoost (Fox), herstellerseitiger Rueckruf fuer fruehe Baujahre', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Ford Kuga III (seit 2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ford_kuga3_phev', 'gen_ford_kuga_mk3', 'Brandgefahr PHEV-Batterie (Rueckruf)', 'Hochvoltbatterie', 'CRITICAL', 'Rueckruf durch Ford, betroffene Fahrzeuge durften nicht geladen werden', 'Softwareupdate und Batterieinspektion in der Werkstatt (Rueckruf 21S08)', 0, 50000, 2020, 2021, 'SPECIFICATION', 'HIGH', 'Offizieller Rueckruf Ford 21S08, Produktionsstopp des PHEV im Jahr 2020', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- HYUNDAI
-- ============================================================

-- Hyundai Tucson NX4 (seit 2021)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_hy_tucson_dct', 'gen_hy_tucson_nx4', 'Ruckeln 7-Gang-DCT bei Kaelte', 'Getriebe / DCT', 'MINOR', 'Leichtes Ruckeln beim Anfahren bei niedrigen Temperaturen', 'Software-Update der Getriebesteuerung', NULL, NULL, 2021, 2022, 'MARKET_SIGNAL', 'MEDIUM', 'Aehnlich wie bei anderen DCT-Getrieben, durch Updates verbessert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Hyundai i30 PD (2017-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_hy_i30_kupplung', 'gen_hy_i30_pd', 'Kupplungsrupfen (Schaltgetriebe)', 'Kupplung', 'MINOR', 'Vibrationen beim Einkuppeln, insbesondere im 1. und 2. Gang', 'Schwungscheibe und Kupplungssatz erneuern', 50000, 100000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Zweimassenschwungrad-Thematik, in Foren und Werkstattberichten dokumentiert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- OPEL
-- ============================================================

-- Opel Corsa F (seit 2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_opel_corsaf_notbr', 'gen_opel_corsa_f', 'Fehlausloesung Notbremsassistent', 'Fahrassistenz', 'SIGNIFICANT', 'Grundloses Bremsen, Warnton ohne erkennbares Hindernis', 'Radarsensor reinigen, Software-Update, Sensorkalibrierung', NULL, NULL, 2019, 2021, 'MARKET_SIGNAL', 'MEDIUM', 'In ADAC-Berichten und Foren dokumentiert, durch Updates reduziert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- PORSCHE
-- ============================================================

-- Porsche Cayenne E3 (seit 2018)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_por_caye3_kuehler', 'gen_por_cayenne_e3', 'Kuehlmittelverlust (V6 Turbo)', 'Motor / Kuehlsystem', 'MINOR', 'Kuehlmittelstand sinkt, Warnung im PCM', 'Kuehlmittelleitungen und Anschluesse pruefen, ggf. ersetzen', 40000, 80000, 2018, 2020, 'ASSESSMENT', 'MEDIUM', 'Vereinzelt in Porsche-Foren dokumentiert, kein Massenthema', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Porsche 911 992 (seit 2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_por_992_pdk', 'gen_por_911_992', 'PDK-Getriebegeraeusche beim Rangieren', 'Getriebe / PDK', 'MINOR', 'Klackern oder Kratzen bei sehr niedrigem Tempo, Vorwaerts-Rueckwaerts-Wechsel', 'Meistens betriebsnormal, bei starken Geraueschen Kupplungsrevision', NULL, NULL, 2019, 2021, 'ASSESSMENT', 'MEDIUM', 'In Porsche-Community diskutiert, von Porsche als betriebsbedingt eingestuft', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- TOYOTA
-- ============================================================

-- Toyota RAV4 XA50 (seit 2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_toy_rav4_hybrid', 'gen_toy_rav4_xa50', 'Geraeusche Hybridantrieb bei Kaelte', 'Hybridantrieb', 'MINOR', 'Brummen oder Summen bei Kaltstart, verschwindet nach Erwaermung', 'Betriebsnormal, kein technischer Defekt', NULL, NULL, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Hybrid-typisches Verhalten, kein Mangel, aber haeufig als irritierend empfunden', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- RENAULT
-- ============================================================

-- Renault Clio V (seit 2019)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ren_clio5_elektrik', 'gen_ren_clio5', 'Elektrische Stoerungen (Lichter, Display)', 'Elektrik', 'MINOR', 'Sporadisches Flackern der Instrumentenbeleuchtung, Display-Resets', 'Massepunkte pruefen, Software-Update', NULL, NULL, 2019, 2021, 'MARKET_SIGNAL', 'MEDIUM', 'In TUeV-Berichten leicht auffaellig, erste Baujahre', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- SKODA
-- ============================================================

-- Skoda Octavia NX (seit 2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_sk_octavia_sw', 'gen_sk_octavia_nx', 'Software-Probleme Infotainment', 'Infotainment', 'MINOR', 'Touchscreen-Verzoegerungen, gelegentliche Neustarts, Bluetooth-Verbindungsabbrueche', 'Software-Update, ggf. Headunit-Reset', NULL, NULL, 2020, 2022, 'MARKET_SIGNAL', 'MEDIUM', 'Teilt die MIB3-Plattform mit Golf 8, aehnliche Erstjahres-Problematik', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Skoda Kodiaq NS (2017-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_sk_kodiaq_dsg', 'gen_sk_kodiaq_ns', 'DSG-Ruckeln bei langsamer Fahrt', 'Getriebe / DSG', 'MINOR', 'Leichtes Stocken im Kriechbereich, Zupfen beim Rangieren', 'DSG-Getriebeoel wechseln, Software-Update der Mechatronik', 40000, 80000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'DSG7-DQ381-Thematik, bekannt aus dem VW-Konzern', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- NISSAN
-- ============================================================

-- Nissan Qashqai J12 (seit 2021)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_nissan_qash3_cvt', 'gen_qashqai_3', 'Getrieberucken e-POWER-System', 'Antrieb / e-POWER', 'MINOR', 'Ungewohntes Ansprechverhalten, verzoegerter Leistungsaufbau', 'Software-Update fuer die Motorsteuerung', NULL, NULL, 2021, 2022, 'ASSESSMENT', 'MEDIUM', 'Gewoehnungsbeduerftige Antriebscharakteristik des seriellen Hybridantriebs', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VOLVO
-- ============================================================

-- Volvo XC60 II (seit 2017)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_volvo_xc60_ips', 'gen_volvo_xc60_2', 'IntelliSafe-Fehlwarnungen', 'Fahrassistenz', 'MINOR', 'Falsches Warnsignal der Kollisionswarnung, Phantombremsungen', 'Kalibrierung der Frontkamera, Software-Update', NULL, NULL, 2017, 2020, 'MARKET_SIGNAL', 'MEDIUM', 'Bekannt bei Volvo SPA-Plattform, durch Updates stetig verbessert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- TESLA
-- ============================================================

-- Tesla Model 3 Highland (seit 2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ts_m3_spaltmasse', 'gen_ts_model3_hr', 'Ungleichmaessige Spaltmasse', 'Karosserie', 'MINOR', 'Sichtbar unterschiedliche Fugenbreiten an Tueren, Hauben und Klappen', 'Nachstellen der Anbauteile in der Werkstatt', 0, 10000, NULL, NULL, 'MARKET_SIGNAL', 'HIGH', 'Breit dokumentiertes Tesla-Qualitaetsthema, auch beim Highland verbessert aber nicht vollstaendig behoben', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Tesla Model Y (seit 2021)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_ts_my_phantombr', 'gen_ts_modely_1', 'Phantombremsungen Autopilot', 'Fahrassistenz / Autopilot', 'SIGNIFICANT', 'Ploetzliches starkes Bremsen ohne erkennbares Hindernis', 'Software-Update (OTA), Fahrassistenz-Einstellungen anpassen', NULL, NULL, 2021, 2023, 'MARKET_SIGNAL', 'HIGH', 'Weltweit dokumentiert, Gegenstand von NHTSA-Untersuchungen, durch Updates schrittweise verbessert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- FIAT
-- ============================================================

-- Fiat 500e (seit 2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_fiat_500e_12v', 'gen_500e_1', '12V-Batterie entlaedt sich', 'Elektrik / 12V-Batterie', 'MINOR', 'Fahrzeug laesst sich nicht oeffnen/starten nach laengerem Stehen', '12V-Batterie laden oder ersetzen, Software-Update fuer Energiemanagement', 10000, 40000, 2020, 2022, 'MARKET_SIGNAL', 'MEDIUM', 'Bekanntes Problem bei Elektrofahrzeugen mit kleiner 12V-Batterie, in Foren haeufig berichtet', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- MINI
-- ============================================================

-- MINI Cooper F56 (2014-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_mini_f56_steuerk', 'gen_mini_cooper_f56', 'Steuerkettenproblem B38/B48', 'Motor / Steuerkette', 'SIGNIFICANT', 'Rasseln beim Start, Motorleuchte', 'Steuerkette und Spanner ersetzen', 50000, 100000, 2014, 2017, 'MARKET_SIGNAL', 'HIGH', 'Gleiche BMW-B38/B48-Motoren wie im 1er/2er, bekannte Fruehjahrsproblematik', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- PEUGEOT
-- ============================================================

-- Peugeot 3008 II (2016-2023)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_peug_3008_eat8', 'gen_3008_2', 'EAT8-Automatik-Ruckeln', 'Getriebe / EAT8', 'MINOR', 'Leichtes Zucken bei Gangwechseln, insb. 1-2 und 2-3', 'Getriebeoel-Wechsel (Aisin AF50-8), Software-Update', 40000, 80000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'Aisin-Wandlerautomatik bei PSA breit eingesetzt, vereinzelt Adaptionsprobleme', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- KIA
-- ============================================================

-- Kia Sportage NQ5 (seit 2022)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_kia_sport_infot', 'gen_kia_sportage_nq5', 'Verzoegerungen im Infotainment', 'Infotainment', 'MINOR', 'Touchscreen reagiert traege, Apple CarPlay mit Aussetzer', 'Software-Update ueber OTA oder Werkstatt', NULL, NULL, 2022, 2023, 'MARKET_SIGNAL', 'MEDIUM', 'Typisches Erstjahres-Softwarethema, durch Updates adressiert', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- CUPRA
-- ============================================================

-- CUPRA Formentor (seit 2020)
INSERT INTO "KnownIssue" (id, "generationId", title, component, severity, symptoms, remedy, "typicalMileageFromKm", "typicalMileageToKm", "yearFrom", "yearTo", "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('ki_cupra_form_dsg', 'gen_cupra_formentor1', 'DSG-Ruckeln beim Anfahren', 'Getriebe / DSG', 'MINOR', 'Leichtes Rupfen beim Losfahren, Vibrationen bei niedrigen Drehzahlen', 'DSG-Adaption zuruecksetzen, Software-Update', 20000, 60000, NULL, NULL, 'ASSESSMENT', 'MEDIUM', 'VW-Konzern-DSG-Thematik, aehnlich wie bei Golf/Leon', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

COMMIT;
