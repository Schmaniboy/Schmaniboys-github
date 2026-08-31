-- seed-facelift-modelyear.sql
-- FaceliftPhases und ModelYears fuer Generationen mit dokumentierten Facelifts
-- Basiert auf offiziellen Marktstart-/Facelift-Terminen der Hersteller

BEGIN;

-- ============================================================
-- FaceliftPhases
-- ============================================================

-- BMW 3er F30/F31 (2012-2019)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_f30_pre', 'gen_bmw_3er_f30', 'Vorfacelift', 'vorfacelift', 2012, 2015, 'Runde Nebelscheinwerfer, schmalere Scheinwerfer, Chrome-Niere ohne Doppelsteg', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_f30_lci', 'gen_bmw_3er_f30', 'LCI (Facelift)', 'lci', 2015, 2019, 'Modifizierte LED-Scheinwerfer, breitere Niere, neue Rueckleuchten mit LED-Leiste, ueberarbeitetes iDrive', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- BMW 5er G30/G31 (2017-2023)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_g30_pre', 'gen_bmw_5er_g30', 'Vorfacelift', 'vorfacelift', 2017, 2020, 'Schmalere Niere, konventionelle Scheinwerferform, iDrive 6', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_g30_lci', 'gen_bmw_5er_g30', 'LCI (Facelift)', 'lci', 2020, 2023, 'Groessere Niere, neue Scheinwerferkontur, iDrive 7, 48V-Mildhybrid bei allen Benzinern', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- BMW X3 G01 (2017-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_g01_pre', 'gen_bmw_x3_g01', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'Schmale Doppelniere, konventionelle Rueckleuchten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_g01_lci', 'gen_bmw_x3_g01', 'LCI (Facelift)', 'lci', 2021, 2024, 'Groessere Niere, neue LED-Scheinwerfer, Curved Display innen, ueberarbeitete Heckpartie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Golf VII (2012-2020)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_golf7_pre', 'gen_vw_golf7', 'Vorfacelift', 'vorfacelift', 2012, 2017, 'Einteilige Rueckleuchten, Chromspange an der Front bis zu den Scheinwerfern', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_golf7_fl', 'gen_vw_golf7', 'Facelift (7.5)', 'facelift', 2017, 2020, 'Geteilte Rueckleuchten mit dynamischem Blinker, neue LED-Scheinwerfer, Discover-Pro-Navi, neuer 1.5 TSI', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Passat B8 (2014-2023)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_passatb8_pre', 'gen_vw_passat_b8', 'Vorfacelift', 'vorfacelift', 2014, 2019, 'Konventionelle Scheinwerfer, analoges Kombiinstrument Serie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_passatb8_fl', 'gen_vw_passat_b8', 'Facelift', 'facelift', 2019, 2023, 'IQ.LIGHT LED-Matrix-Scheinwerfer, neues Lenkrad mit Touch-Tasten, Teilautonomes Fahren Travel Assist', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Tiguan AD (2016-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_tigad_pre', 'gen_vw_tiguan_ad', 'Vorfacelift', 'vorfacelift', 2016, 2020, 'Schmalere Scheinwerfer, Chromleiste oben, konventionelle Rueckleuchten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_tigad_fl', 'gen_vw_tiguan_ad', 'Facelift', 'facelift', 2020, 2024, 'Breitere Scheinwerfer mit LED-Matrix, durchgehende Lichtleiste vorn, neue Rueckleuchten, MIB3-Infotainment', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Audi A4 B9 (2015-2023)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_a4b9_pre', 'gen_audi_a4_b9', 'Vorfacelift', 'vorfacelift', 2015, 2019, 'Horizontaler Chromgrill, konventionelle Scheinwerfer, breiterer Kuehlergrill', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_a4b9_fl', 'gen_audi_a4_b9', 'Facelift (B9.5)', 'facelift', 2019, 2023, 'Flacher gestalteter Singleframe-Grill, optionale HD-Matrix-LED, neues MMI mit Touch-Bedienung, 12.3-Zoll-Virtual-Cockpit Serie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes C-Klasse W205 (2014-2021)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_w205_pre', 'gen_mb_c_w205', 'Vorfacelift', 'vorfacelift', 2014, 2018, 'Rundere Scheinwerferkontur, kleinerer Zentralbildschirm, konventionelle Rueckleuchten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_w205_mopf', 'gen_mb_c_w205', 'MOPF (Facelift)', 'mopf', 2018, 2021, 'Neue Scheinwerferkontur aehnlich S-Klasse, groesserer Bildschirm, neue Motoren (M264, OM654), digitales Cockpit optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes E-Klasse W213 (2016-2023)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_w213_pre', 'gen_mb_e_w213', 'Vorfacelift', 'vorfacelift', 2016, 2020, 'Doppelte Powerdomes auf der Motorhaube, konventionelle Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_w213_mopf', 'gen_mb_e_w213', 'MOPF (Facelift)', 'mopf', 2020, 2023, 'Neue Frontpartie mit aggressiverem Design, MBUX-Generation 2, neue Rueckleuchten, ueberarbeitete Motoren', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Porsche Macan 95B (2014-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_macan_pre', 'gen_por_macan_95b', 'Vorfacelift', 'vorfacelift', 2014, 2018, 'Konventionelle Frontoptik, kleinerer Bildschirm, Kippschalterleiste', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_macan_fl', 'gen_por_macan_95b', 'Facelift', 'facelift', 2018, 2024, 'Durchgehendes Leuchtband hinten, 10.9-Zoll-Touchscreen, neue Scheinwerfer mit LED-Matrix, ueberarbeitete Karosserie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- MINI Cooper F56 (2014-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_f56_pre', 'gen_mini_cooper_f56', 'Vorfacelift', 'vorfacelift', 2014, 2018, 'Rundes Zentralinstrument, konventionelle Scheinwerfer, Halogennebel', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_f56_lci', 'gen_mini_cooper_f56', 'LCI (Facelift)', 'lci', 2018, 2021, 'Union-Jack-Rueckleuchten, neues Digital-Cockpit, LED-Scheinwerfer Serie, ueberarbeitete Motoren', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_f56_lci2', 'gen_mini_cooper_f56', 'LCI 2', 'lci2', 2021, 2024, 'Weiteres Feinschliff an LED-Lichtsignatur, Multitone-Dach optional, neue Farbpalette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Skoda Superb 3V (2015-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_superb3v_pre', 'gen_sk_superb_3v', 'Vorfacelift', 'vorfacelift', 2015, 2019, 'Konventionelle Scheinwerfer, breiterer Kuehlergrill, Crystal-Eye-Rueckleuchten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_superb3v_fl', 'gen_sk_superb_3v', 'Facelift', 'facelift', 2019, 2024, 'Schmalere Scheinwerfer mit Matrix-LED, neue Front mit breiterer Chromspange, groesserer Touchscreen, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Skoda Kodiaq NS (2017-2024)
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('fl_kodiaq_pre', 'gen_sk_kodiaq_ns', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'Zweiteilige Scheinwerfer, konventionelle Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_kodiaq_fl', 'gen_sk_kodiaq_ns', 'Facelift', 'facelift', 2021, 2024, 'Schmalere Scheinwerfer, breiterer Grill, neues Logo, Virtual Cockpit Serie, Columbus-Navi optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- ============================================================
-- ModelYears (Baujahre fuer die populaersten Generationen)
-- ============================================================

-- BMW 3er F30 (2012-2019)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_f30_2012', 'gen_bmw_3er_f30', 2012, 'fl_f30_pre', 'Markteinfuehrung F30 Limousine mit N20 und N55 Motoren', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2013', 'gen_bmw_3er_f30', 2013, 'fl_f30_pre', 'F31 Touring folgt, ActiveHybrid 3 eingefuehrt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2014', 'gen_bmw_3er_f30', 2014, 'fl_f30_pre', '318d und 316d mit neuen Dieselmotoren B47', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2015', 'gen_bmw_3er_f30', 2015, 'fl_f30_lci', 'LCI mit LED-Scheinwerfern Serie, neues iDrive, ueberarbeitete Motoren', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2016', 'gen_bmw_3er_f30', 2016, 'fl_f30_lci', 'Neue Assistenzsysteme, ueberarbeitete Getriebe', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2017', 'gen_bmw_3er_f30', 2017, 'fl_f30_lci', 'Neue Farben und Polsteroptionen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2018', 'gen_bmw_3er_f30', 2018, 'fl_f30_lci', 'Letztes volles Modelljahr, M Performance Parts erweitert', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_f30_2019', 'gen_bmw_3er_f30', 2019, 'fl_f30_lci', 'Auslaufmodell, letzte Exemplare parallel zum G20', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Golf VII (2012-2020)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_golf7_2012', 'gen_vw_golf7', 2012, 'fl_golf7_pre', 'Markteinfuehrung Golf VII auf MQB-Plattform, 1.2 TSI und 1.4 TSI', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2013', 'gen_vw_golf7', 2013, 'fl_golf7_pre', 'GTI, GTD und R-Line folgen, breitere Motorenpalette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2014', 'gen_vw_golf7', 2014, 'fl_golf7_pre', 'Golf R mit 300 PS, GTE (PHEV) und e-Golf eingefuehrt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2015', 'gen_vw_golf7', 2015, 'fl_golf7_pre', 'Variant Alltrack, neue Infotainment-Generation', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2016', 'gen_vw_golf7', 2016, 'fl_golf7_pre', 'Letztes Vorfacelift-Jahr, Dieselgate-Nachruest-Massnahmen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2017', 'gen_vw_golf7', 2017, 'fl_golf7_fl', 'Facelift: Neuer 1.5 TSI (EA211 evo), LED-Rueckleuchten, Active Info Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2018', 'gen_vw_golf7', 2018, 'fl_golf7_fl', 'GTI TCR Sonderedition, ueberarbeiteter e-Golf mit mehr Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2019', 'gen_vw_golf7', 2019, 'fl_golf7_fl', 'Letzte Modellaenderungen, R mit Akrapovic-Option', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_golf7_2020', 'gen_vw_golf7', 2020, 'fl_golf7_fl', 'Auslaufmodell, parallel zum Golf VIII, letzte Exemplare', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes C-Klasse W205 (2014-2021)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_w205_2014', 'gen_mb_c_w205', 2014, 'fl_w205_pre', 'Markteinfuehrung mit M274-Benzinern und OM651-Dieseln', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2015', 'gen_mb_c_w205', 2015, 'fl_w205_pre', 'C450 AMG 4Matic (Vorgaenger des C43), C350e PHEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2016', 'gen_mb_c_w205', 2016, 'fl_w205_pre', 'AMG C 43 ersetzt C450, Coupé C205 und Cabrio A205 starten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2017', 'gen_mb_c_w205', 2017, 'fl_w205_pre', 'Neue Assistenzsysteme, 9G-Tronic fuer weitere Motorisierungen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2018', 'gen_mb_c_w205', 2018, 'fl_w205_mopf', 'MOPF: Neue Motoren M264/OM654, groesserer Bildschirm, neue Scheinwerfer', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2019', 'gen_mb_c_w205', 2019, 'fl_w205_mopf', 'C300de Diesel-PHEV, ueberarbeiteter AMG C63', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2020', 'gen_mb_c_w205', 2020, 'fl_w205_mopf', 'Letzte Aenderungen, Sondermodelle zum Auslauf', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w205_2021', 'gen_mb_c_w205', 2021, 'fl_w205_mopf', 'Auslaufmodell, letzte Exemplare parallel zum W206', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Audi A4 B9 (2015-2023)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_a4b9_2015', 'gen_audi_a4_b9', 2015, 'fl_a4b9_pre', 'Markteinfuehrung auf MLB-evo-Plattform, Virtual Cockpit optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2016', 'gen_audi_a4_b9', 2016, 'fl_a4b9_pre', 'Avant folgt, S4 mit neuem V6-Turbo', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2017', 'gen_audi_a4_b9', 2017, 'fl_a4b9_pre', 'A4 Allroad quattro, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2018', 'gen_audi_a4_b9', 2018, 'fl_a4b9_pre', 'Letzte Vorfacelift-Modelle', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2019', 'gen_audi_a4_b9', 2019, 'fl_a4b9_fl', 'Facelift: Neuer Singleframe, Touch-MMI, neue Motoren mit 12V-Mildhybrid', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2020', 'gen_audi_a4_b9', 2020, 'fl_a4b9_fl', 'S4 TDI ersetzt S4 TFSI in Europa, neue Editionsmodelle', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2021', 'gen_audi_a4_b9', 2021, 'fl_a4b9_fl', 'Neue Ausstattungspakete, Competition-Exterieur', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2022', 'gen_audi_a4_b9', 2022, 'fl_a4b9_fl', 'Letzte Updates vor Modellwechsel', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_a4b9_2023', 'gen_audi_a4_b9', 2023, 'fl_a4b9_fl', 'Auslaufmodell, parallel zum neuen A5 (B10)', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Tiguan AD (2016-2024)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_tigad_2016', 'gen_vw_tiguan_ad', 2016, 'fl_tigad_pre', 'Markteinfuehrung auf MQB-Plattform, deutlich groesser als Vorgaenger', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2017', 'gen_vw_tiguan_ad', 2017, 'fl_tigad_pre', 'Tiguan Allspace (Langversion) folgt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2018', 'gen_vw_tiguan_ad', 2018, 'fl_tigad_pre', 'R-Line Paket, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2019', 'gen_vw_tiguan_ad', 2019, 'fl_tigad_pre', 'Tiguan eHybrid angekuendigt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2020', 'gen_vw_tiguan_ad', 2020, 'fl_tigad_fl', 'Facelift: Neue Front, LED-Matrix, MIB3, Tiguan R mit 320 PS', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2021', 'gen_vw_tiguan_ad', 2021, 'fl_tigad_fl', 'eHybrid startet, Travel Assist', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2022', 'gen_vw_tiguan_ad', 2022, 'fl_tigad_fl', 'Neue Farben, ueberarbeitete Ausstattungslinien', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2023', 'gen_vw_tiguan_ad', 2023, 'fl_tigad_fl', 'Letzte Updates, Sondermodelle', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_tigad_2024', 'gen_vw_tiguan_ad', 2024, 'fl_tigad_fl', 'Auslaufmodell, parallel zum neuen Tiguan III', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes E-Klasse W213 (2016-2023)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_w213_2016', 'gen_mb_e_w213', 2016, 'fl_w213_pre', 'Markteinfuehrung, Widescreen-Cockpit, MULTIBEAM LED', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2017', 'gen_mb_e_w213', 2017, 'fl_w213_pre', 'E-Klasse All-Terrain, AMG E 63 S', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2018', 'gen_mb_e_w213', 2018, 'fl_w213_pre', 'E53 AMG mit Reihensechszylinder M256', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2019', 'gen_mb_e_w213', 2019, 'fl_w213_pre', 'E300de Diesel-PHEV, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2020', 'gen_mb_e_w213', 2020, 'fl_w213_mopf', 'MOPF: Neue Frontoptik, MBUX Gen 2, neue Motoren, Hinterachslenkung optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2021', 'gen_mb_e_w213', 2021, 'fl_w213_mopf', 'AMG E 63 Final Edition, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2022', 'gen_mb_e_w213', 2022, 'fl_w213_mopf', 'Letzte Modellaenderungen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_w213_2023', 'gen_mb_e_w213', 2023, 'fl_w213_mopf', 'Auslaufmodell, parallel zum W214', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Porsche Macan 95B (2014-2024)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_macan_2014', 'gen_por_macan_95b', 2014, 'fl_macan_pre', 'Markteinfuehrung Macan S und Macan Turbo', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_macan_2015', 'gen_por_macan_95b', 2015, 'fl_macan_pre', 'Macan Diesel (S Diesel) folgt, GTS eingefuehrt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_macan_2016', 'gen_por_macan_95b', 2016, 'fl_macan_pre', 'Basis-Macan mit 2.0-Turbo', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_macan_2018', 'gen_por_macan_95b', 2018, 'fl_macan_fl', 'Facelift: Neues Infotainment, LED-Leuchtband hinten, ueberarbeitete Motoren', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_macan_2020', 'gen_por_macan_95b', 2020, 'fl_macan_fl', 'Macan GTS mit neuem V6', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_macan_2022', 'gen_por_macan_95b', 2022, 'fl_macan_fl', 'Macan T (Basisversion mit Sportfahrwerk)', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Skoda Superb 3V (2015-2024)
INSERT INTO "ModelYear" (id, "generationId", year, "faceliftPhaseId", changes, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('my_superb_2015', 'gen_sk_superb_3v', 2015, 'fl_superb3v_pre', 'Markteinfuehrung auf MQB-Plattform, groesster Innenraum der Mittelklasse', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_superb_2016', 'gen_sk_superb_3v', 2016, 'fl_superb3v_pre', 'Combi folgt, iV PHEV eingefuehrt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_superb_2019', 'gen_sk_superb_3v', 2019, 'fl_superb3v_fl', 'Facelift: Matrix-LED, ueberarbeitete Front, neuer 1.5 TSI', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('my_superb_2022', 'gen_sk_superb_3v', 2022, 'fl_superb3v_fl', 'Neue Farben, ueberarbeitete Ausstattungslinien', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

COMMIT;
