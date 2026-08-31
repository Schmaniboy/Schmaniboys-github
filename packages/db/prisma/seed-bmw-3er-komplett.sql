-- =============================================================================
-- BMW 3er Komplett: Alle Generationen, Facelifts, Ausstattungslinien, Motoren
-- Quellen: BMW AG Datenblaetter, BMW Preislisten, KBA-Typgenehmigungen
-- =============================================================================

BEGIN;

-- ===== FEHLENDE GENERATIONEN =====
INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_bmw_3er_e36', 'mod_bmw_3er', '3er (E36)',         'E36', 'e36', 'bt_limousine', 1990, 1999, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_3er_e46', 'mod_bmw_3er', '3er (E46)',         'E46', 'e46', 'bt_limousine', 1998, 2006, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- FACELIFT-PHASEN
-- =============================================================================

-- E36
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt") VALUES
  ('fl_e36_pre',  'gen_bmw_3er_e36', 'Vorfacelift',  'vorfacelift', 1990, 1996,
   'Schmale Rueckleuchten ohne LED, Chrom-Grillleisten, Rundinstrumente mit orangefarbenem Zeiger. Seitenblinker am vorderen Kotfluegel eckig.',
   'PUBLISHED', NOW()),
  ('fl_e36_lci',  'gen_bmw_3er_e36', 'Facelift (LCI)', 'lci', 1996, 1999,
   'Breitere Rueckleuchten mit Klarglas, weisse Seitenblinker, Nebelscheinwerfer serienmäßig, Doppelspeichen-Lenkrad, OBD-II-Diagnose.',
   'PUBLISHED', NOW())
ON CONFLICT (id) DO NOTHING;

-- E46
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt") VALUES
  ('fl_e46_pre',  'gen_bmw_3er_e46', 'Vorfacelift',  'vorfacelift', 1998, 2001,
   'Runde Nebelscheinwerfer, bernsteinfarbene Blinker vorne, Rueckleuchten komplett rot/orange, Interieur mit sichtbarem Radio-Doppel-DIN.',
   'PUBLISHED', NOW()),
  ('fl_e46_lci',  'gen_bmw_3er_e46', 'Facelift (LCI)', 'lci', 2001, 2006,
   'Klarglas-Scheinwerfer mit Leuchtringen (Angel Eyes Serie ab 09/2001), weisse Blinker vorne, Rueckleuchten mit weissem Streifen, ueberarbeitete Mittelkonsole, iDrive bei Topmodellen.',
   'PUBLISHED', NOW())
ON CONFLICT (id) DO NOTHING;

-- E90
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt") VALUES
  ('fl_e90_pre',  'gen_bmw_3er_e90', 'Vorfacelift',  'vorfacelift', 2005, 2008,
   'Halogen-Scheinwerfer mit klassischen Standlichtringen, Rueckleuchten mit roten L-foermigen Einsaetzen, Chromleisten am Kuehlereinlass, Controller ohne Touchpad.',
   'PUBLISHED', NOW()),
  ('fl_e90_lci',  'gen_bmw_3er_e90', 'LCI (Life Cycle Impulse)', 'lci', 2008, 2013,
   'LED-Standlichtringe (Corona-Ringe), ueberarbeitete Rueckleuchten mit LED-Balken, modifizierte Frontschuerze, iDrive mit groesserem Bildschirm, N47/N55 Motoren statt N46/N52.',
   'PUBLISHED', NOW())
ON CONFLICT (id) DO NOTHING;

-- F30
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt") VALUES
  ('fl_f30_pre',  'gen_bmw_3er_f30', 'Vorfacelift',  'vorfacelift', 2012, 2015,
   'Bi-Xenon-Scheinwerfer (LED optional), breitere Niere als E90, Rueckleuchten mit rotem L-Streifen, iDrive 4 mit kleinerem Bildschirm.',
   'PUBLISHED', NOW()),
  ('fl_f30_lci',  'gen_bmw_3er_f30', 'LCI (Life Cycle Impulse)', 'lci', 2015, 2019,
   'Serienmäßige Voll-LED-Scheinwerfer, modifizierte Rueckleuchten mit durchgehendem LED-Lichtleiter, iDrive 5 mit 8.8-Zoll-Touchscreen, neue Motoren (B-Serie statt N-Serie).',
   'PUBLISHED', NOW())
ON CONFLICT (id) DO NOTHING;

-- G20
INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt") VALUES
  ('fl_g20_pre',  'gen_bmw_3er_g20', 'Vorfacelift',  'vorfacelift', 2019, 2022,
   'LED-Scheinwerfer mit schlankem Design, Connected Drive 7.0, 10.25-Zoll-Infotainment, klassische Niere, physische Klimabedieneinheit.',
   'PUBLISHED', NOW()),
  ('fl_g20_lci',  'gen_bmw_3er_g20', 'LCI (Life Cycle Impulse)', 'lci', 2022, NULL,
   'Flachere Scheinwerfer, Curved Display (12.3 + 14.9 Zoll), BMW Operating System 8, neue Lenkradgeneration, Tasten statt iDrive-Controller bei manchen Ausführungen.',
   'PUBLISHED', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- AUSSTATTUNGSLINIEN (TrimLines)
-- =============================================================================

-- E90 Trim Lines
INSERT INTO "TrimLine" (id, "generationId", name, slug, description, "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('tl_e90_basis',    'gen_bmw_3er_e90', 'Basis',           'basis',    'Grundausstattung mit Klimaanlage, Radio CD, Stoffsitzen, Nebelscheinwerfern, Bordcomputer.', 2005, 2013, 'PUBLISHED', NOW(), NOW()),
  ('tl_e90_advantage','gen_bmw_3er_e90', 'Advantage',       'advantage','Basis plus Sitzheizung vorne, Park Distance Control hinten, Multifunktionslenkrad, Regensensor.', 2008, 2013, 'PUBLISHED', NOW(), NOW()),
  ('tl_e90_sport',    'gen_bmw_3er_e90', 'Sport Line',      'sport',    'Sportlenkrad mit roter Ziernaht, Sportsitze, Dekorleisten Aluminium Laengsschliff, 17-Zoll Leichtmetallraeder.', 2005, 2013, 'PUBLISHED', NOW(), NOW()),
  ('tl_e90_exclusive','gen_bmw_3er_e90', 'Exclusive Line',  'exclusive','Holzdekorleisten, Lederlenkrad, Chromleisten, 17-Zoll Raeder im Sternspeichen-Design.', 2005, 2013, 'PUBLISHED', NOW(), NOW()),
  ('tl_e90_msport',   'gen_bmw_3er_e90', 'M Sportpaket',    'm-sport',  'M Aerodynamikpaket, M Sportfahrwerk (10mm tiefer), M Lederlenkrad, M Einstiegsleisten, 18-Zoll M Leichtmetallraeder, Schattenline.', 2005, 2013, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- F30 Trim Lines
INSERT INTO "TrimLine" (id, "generationId", name, slug, description, "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('tl_f30_basis',    'gen_bmw_3er_f30', 'Basis',           'basis',    'Grundausstattung mit Klimaautomatik, Radio Professional, Stoffsitzen, LED-Tagfahrlicht.', 2012, 2019, 'PUBLISHED', NOW(), NOW()),
  ('tl_f30_advantage','gen_bmw_3er_f30', 'Advantage',       'advantage','Basis plus Sitzheizung vorne, Tempomat, Lederlenkrad, Licht- und Regensensor, Park Distance Control hinten.', 2012, 2019, 'PUBLISHED', NOW(), NOW()),
  ('tl_f30_sport',    'gen_bmw_3er_f30', 'Sport Line',      'sport',    'Sportlenkrad mit roter Naht, Sportsitze mit Stoff/Alcantara, Dekor Aluminium Laengsschliff, 18-Zoll Felgen, Hochglanz Shadow Line.', 2012, 2019, 'PUBLISHED', NOW(), NOW()),
  ('tl_f30_luxury',   'gen_bmw_3er_f30', 'Luxury Line',     'luxury',   'Dakota-Lederpolsterung, Holzdekor, verchromte Niere, Chromleisten um die Seitenscheiben, 18-Zoll Multi-Speichen.', 2012, 2019, 'PUBLISHED', NOW(), NOW()),
  ('tl_f30_modern',   'gen_bmw_3er_f30', 'Modern Line',     'modern',   'Perlglanz-Chrom Niere, Leder Dakota Oyster, Dekor Feinholz Esche weiss, 18-Zoll Turbinenstyling. Nur bis LCI.', 2012, 2015, 'PUBLISHED', NOW(), NOW()),
  ('tl_f30_msport',   'gen_bmw_3er_f30', 'M Sportpaket',    'm-sport',  'M Aerodynamikpaket, M Sportfahrwerk (10mm tiefer), M Lederlenkrad, Dekor Aluminium Laengsschliff dunkel, 18-Zoll M Doppelspeiche, Schattenline.', 2012, 2019, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- G20 Trim Lines
INSERT INTO "TrimLine" (id, "generationId", name, slug, description, "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('tl_g20_basis',    'gen_bmw_3er_g20', 'Basis',           'basis',    'LED-Scheinwerfer, Klimaautomatik 2-Zonen, BMW Live Cockpit Plus mit 10.25-Zoll-Display, Sportsitze vorne, digitale Instrumente.', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('tl_g20_advantage','gen_bmw_3er_g20', 'Advantage',       'advantage','Basis plus Sitzheizung vorne, Durchladesystem, Licht- und Regensensor, Tempomat mit Bremsfunktion.', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('tl_g20_sport',    'gen_bmw_3er_g20', 'Sport Line',      'sport',    'Sportlenkrad Leder mit roter Naht, Sportsitze mit Alcantara/Sensatec, 18-Zoll Leichtmetallraeder, Hochglanz Shadow Line, Sport-Getriebe.', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('tl_g20_luxury',   'gen_bmw_3er_g20', 'Luxury Line',     'luxury',   'Vernasca-Leder, verchromte Niere, Chromleisten Seitenfenster, Holzdekor, 18-Zoll Doppelspeiche.', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('tl_g20_msport',   'gen_bmw_3er_g20', 'M Sportpaket',    'm-sport',  'M Aerodynamikpaket, M Sportfahrwerk, M Lederlenkrad, M Bremsen, 18-Zoll M Doppelspeiche, Schattenline Exterieur, Dekor Aluminium Mesheffekt.', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('tl_g20_msportpro','gen_bmw_3er_g20', 'M Sport Pro',     'm-sport-pro', 'M Sportpaket plus M Heckdiffusor, M Sport Bremsanlage, M Sportabgasanlage, 19-Zoll M Felgen, erweiterte Shadow Line.', 2019, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E46 Trim Lines
INSERT INTO "TrimLine" (id, "generationId", name, slug, description, "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('tl_e46_basis',    'gen_bmw_3er_e46', 'Basis',           'basis',    'Klimaanlage manuell, Radio CD, Stoffsitze, 15-Zoll Stahlfelgen mit Radzierblende, Nebelscheinwerfer.', 1998, 2006, 'PUBLISHED', NOW(), NOW()),
  ('tl_e46_exclusive','gen_bmw_3er_e46', 'Individual',      'individual','Vollleder-Ausstattung, individuelle Lackierung, Wurzelholzdekor, Komfortsitze.', 1998, 2006, 'PUBLISHED', NOW(), NOW()),
  ('tl_e46_msport',   'gen_bmw_3er_e46', 'M Sportpaket',   'm-sport',  'M Technik Fahrwerk, M Aerodynamik, 17-Zoll Doppelspeiche 68, M Lederlenkrad, Sportsitze, Aluminium-Dekorleisten.', 1998, 2006, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E36 Trim Lines
INSERT INTO "TrimLine" (id, "generationId", name, slug, description, "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('tl_e36_basis',    'gen_bmw_3er_e36', 'Basis',           'basis',    'Grundausstattung mit Zentralverriegelung, elektrischen Fensterhebern vorne, Halogen-Scheinwerfern, Stoffsitzen.', 1990, 1999, 'PUBLISHED', NOW(), NOW()),
  ('tl_e36_msport',   'gen_bmw_3er_e36', 'M Technik',       'm-technik','M Technik Fahrwerk (15mm tiefer), M Aerodynamik-Paket, M Lederlenkrad 3-Speichen, 16-Zoll Styling 32 oder 17-Zoll Styling 39.', 1990, 1999, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MOTOREN + POWERTRAINS
-- =============================================================================

-- E36 Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_bmw_m40b16',  'mfr_bmw', '1.6i',           'M40B16', 1596, 4, 'PETROL', 'NATURALLY_ASPIRATED', 75,  143, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m43b18',  'mfr_bmw', '1.8i',           'M43B18', 1796, 4, 'PETROL', 'NATURALLY_ASPIRATED', 85,  165, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m52b20',  'mfr_bmw', '2.0i',           'M52B20', 1991, 6, 'PETROL', 'NATURALLY_ASPIRATED', 110, 190, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m52b25',  'mfr_bmw', '2.5i',           'M52B25', 2494, 6, 'PETROL', 'NATURALLY_ASPIRATED', 125, 245, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m52b28',  'mfr_bmw', '2.8i',           'M52B28', 2793, 6, 'PETROL', 'NATURALLY_ASPIRATED', 142, 280, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m3_e36',  'mfr_bmw', 'M3 3.2',         'S50B32', 3201, 6, 'PETROL', 'NATURALLY_ASPIRATED', 236, 350, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m41d17',  'mfr_bmw', '318tds',         'M41D17', 1665, 4, 'DIESEL', 'TURBOCHARGED',        66,  180, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m51d25',  'mfr_bmw', '325td/tds',      'M51D25', 2503, 6, 'DIESEL', 'TURBOCHARGED',       105,  280, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E36 Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_e36_316i',   'gen_bmw_3er_e36', 'eng_bmw_m40b16', 'tr_man5', 'REAR', 75,  12.3, 188, 8.3, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_318i',   'gen_bmw_3er_e36', 'eng_bmw_m43b18', 'tr_man5', 'REAR', 85,  10.9, 197, 8.0, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_320i',   'gen_bmw_3er_e36', 'eng_bmw_m52b20', 'tr_man5', 'REAR', 110, 9.0,  217, 8.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_323i',   'gen_bmw_3er_e36', 'eng_bmw_m52b25', 'tr_man5', 'REAR', 125, 7.8,  232, 9.4, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_328i',   'gen_bmw_3er_e36', 'eng_bmw_m52b28', 'tr_man5', 'REAR', 142, 6.9,  240, 9.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_m3',     'gen_bmw_3er_e36', 'eng_bmw_m3_e36', 'tr_man6', 'REAR', 236, 5.5,  250, 11.3,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_318tds', 'gen_bmw_3er_e36', 'eng_bmw_m41d17', 'tr_man5', 'REAR', 66,  14.9, 172, 5.9, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e36_325tds', 'gen_bmw_3er_e36', 'eng_bmw_m51d25', 'tr_man5', 'REAR', 105, 9.4,  213, 6.7, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- E46 Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_bmw_n42b18',  'mfr_bmw', '316i/318i Valvetronic', 'N42B18', 1796, 4, 'PETROL', 'NATURALLY_ASPIRATED', 85,  175, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m54b22',  'mfr_bmw', '320i',           'M54B22', 2171, 6, 'PETROL', 'NATURALLY_ASPIRATED', 125, 210, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m54b25',  'mfr_bmw', '325i',           'M54B25', 2494, 6, 'PETROL', 'NATURALLY_ASPIRATED', 141, 245, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m54b30',  'mfr_bmw', '330i',           'M54B30', 2979, 6, 'PETROL', 'NATURALLY_ASPIRATED', 170, 300, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s54b32',  'mfr_bmw', 'M3 3.2 S54',    'S54B32', 3246, 6, 'PETROL', 'NATURALLY_ASPIRATED', 252, 365, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m47d20',  'mfr_bmw', '320d',           'M47D20', 1951, 4, 'DIESEL', 'TURBOCHARGED',       110, 330, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m57d30',  'mfr_bmw', '330d',           'M57D30', 2926, 6, 'DIESEL', 'TURBOCHARGED',       135, 390, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E46 Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_e46_316i',  'gen_bmw_3er_e46', 'eng_bmw_n42b18', 'tr_man5', 'REAR', 85,  11.2, 200, 7.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_320i',  'gen_bmw_3er_e46', 'eng_bmw_m54b22', 'tr_man5', 'REAR', 125, 8.9,  225, 9.0, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_325i',  'gen_bmw_3er_e46', 'eng_bmw_m54b25', 'tr_man5', 'REAR', 141, 7.3,  238, 9.5, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_330i',  'gen_bmw_3er_e46', 'eng_bmw_m54b30', 'tr_man5', 'REAR', 170, 6.5,  250, 10.0,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_m3',    'gen_bmw_3er_e46', 'eng_bmw_s54b32', 'tr_man6', 'REAR', 252, 5.2,  250, 11.9,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_m3_smg','gen_bmw_3er_e46', 'eng_bmw_s54b32', 'tr_smg',  'REAR', 252, 5.1,  250, 11.9,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_320d',  'gen_bmw_3er_e46', 'eng_bmw_m47d20', 'tr_man5', 'REAR', 110, 9.1,  213, 5.7, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e46_330d',  'gen_bmw_3er_e46', 'eng_bmw_m57d30', 'tr_man6', 'REAR', 135, 7.0,  240, 6.7, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- E90 Motoren (fehlende ergaenzen)
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_bmw_n46b20',  'mfr_bmw', '320i N46',       'N46B20', 1995, 4, 'PETROL', 'NATURALLY_ASPIRATED', 110, 200, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n52b25',  'mfr_bmw', '323i/325i N52',  'N52B25', 2497, 6, 'PETROL', 'NATURALLY_ASPIRATED', 141, 250, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n52b30',  'mfr_bmw', '330i N52',       'N52B30', 2996, 6, 'PETROL', 'NATURALLY_ASPIRATED', 190, 300, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n54b30',  'mfr_bmw', '335i Bi-Turbo',  'N54B30', 2979, 6, 'PETROL', 'TURBOCHARGED',       225, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n55b30',  'mfr_bmw', '335i Turbo',     'N55B30', 2979, 6, 'PETROL', 'TURBOCHARGED',       225, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s65b40',  'mfr_bmw', 'M3 V8',          'S65B40', 3999, 8, 'PETROL', 'NATURALLY_ASPIRATED', 309, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n47d20_e90','mfr_bmw','320d N47',      'N47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED',       130, 350, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_m57d30_e90','mfr_bmw','330d M57',      'M57D30', 2993, 6, 'DIESEL', 'TURBOCHARGED',       170, 500, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n57d30',  'mfr_bmw', '335d N57',       'N57D30', 2993, 6, 'DIESEL', 'TURBOCHARGED',       210, 580, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n43b20',  'mfr_bmw', '318i/320i N43',  'N43B20', 1995, 4, 'PETROL', 'NATURALLY_ASPIRATED', 105, 190, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n47d20_116','mfr_bmw','316d N47',      'N47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED',        85, 260, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E90 Powertrains (erweitern)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_e90_316d',    'gen_bmw_3er_e90', 'eng_bmw_n47d20_116','tr_man6', 'REAR', 85,  11.3, 195, 4.4, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_318i',    'gen_bmw_3er_e90', 'eng_bmw_n43b20', 'tr_man6', 'REAR', 105, 9.8,  210, 6.6, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_320i',    'gen_bmw_3er_e90', 'eng_bmw_n46b20', 'tr_man6', 'REAR', 110, 9.4,  218, 7.5, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_325i',    'gen_bmw_3er_e90', 'eng_bmw_n52b25', 'tr_man6', 'REAR', 141, 7.1,  240, 8.3, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_330i',    'gen_bmw_3er_e90', 'eng_bmw_n52b30', 'tr_man6', 'REAR', 190, 6.3,  250, 8.7, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_335i',    'gen_bmw_3er_e90', 'eng_bmw_n54b30', 'tr_man6', 'REAR', 225, 5.6,  250, 9.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_m3',      'gen_bmw_3er_e90', 'eng_bmw_s65b40', 'tr_man6', 'REAR', 309, 4.6,  250, 12.4,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_m3_dkg',  'gen_bmw_3er_e90', 'eng_bmw_s65b40', 'tr_dct7', 'REAR', 309, 4.3,  250, 12.4,'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_320d',    'gen_bmw_3er_e90', 'eng_bmw_n47d20_e90','tr_man6','REAR',130, 7.5,  228, 5.1, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_330d',    'gen_bmw_3er_e90', 'eng_bmw_m57d30_e90','tr_man6','REAR',170, 6.1,  250, 6.0, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_e90_335d',    'gen_bmw_3er_e90', 'eng_bmw_n57d30', 'tr_aut6', 'REAR', 210, 5.8,  250, 6.6, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- F30 Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_bmw_b38b15',  'mfr_bmw', '318i 3-Zyl Turbo',  'B38B15', 1499, 3, 'PETROL', 'TURBOCHARGED',  100, 220, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b48b20_f30','mfr_bmw','320i B48',          'B48B20', 1998, 4, 'PETROL', 'TURBOCHARGED',  135, 270, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n20b20',  'mfr_bmw', '320i/328i N20',     'N20B20', 1997, 4, 'PETROL', 'TURBOCHARGED',  180, 350, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b48b20_330','mfr_bmw','330i B48',          'B48B20', 1998, 4, 'PETROL', 'TURBOCHARGED',  185, 350, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n55b30_f30','mfr_bmw','340i N55/B58',     'B58B30', 2998, 6, 'PETROL', 'TURBOCHARGED',  240, 450, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s55b30',  'mfr_bmw', 'M3 S55 Bi-Turbo',  'S55B30', 2979, 6, 'PETROL', 'TURBOCHARGED',  317, 550, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s55b30_cs','mfr_bmw','M3 CS S55',         'S55B30', 2979, 6, 'PETROL', 'TURBOCHARGED',  338, 600, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_n47d20_f30','mfr_bmw','316d/318d N47',    'N47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED',   85, 270, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b47d20',  'mfr_bmw', '320d B47',          'B47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED',  140, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b57d30',  'mfr_bmw', '330d/340d B57',     'B57D30', 2993, 6, 'DIESEL', 'TURBOCHARGED',  195, 560, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- F30 Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_f30_316d',   'gen_bmw_3er_f30', 'eng_bmw_n47d20_f30','tr_man6', 'REAR',  85, 10.9, 200, 4.1, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_318i',   'gen_bmw_3er_f30', 'eng_bmw_b38b15', 'tr_man6', 'REAR', 100,  9.1, 210, 5.4, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_320i',   'gen_bmw_3er_f30', 'eng_bmw_b48b20_f30','tr_aut8','REAR',135, 7.2, 235, 6.4, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_328i',   'gen_bmw_3er_f30', 'eng_bmw_n20b20', 'tr_aut8', 'REAR', 180, 5.9, 250, 6.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_330i',   'gen_bmw_3er_f30', 'eng_bmw_b48b20_330','tr_aut8','REAR',185, 5.8, 250, 6.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_340i',   'gen_bmw_3er_f30', 'eng_bmw_n55b30_f30','tr_aut8','REAR',240, 5.1, 250, 7.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_m3',     'gen_bmw_3er_f30', 'eng_bmw_s55b30', 'tr_dct7', 'REAR', 317, 4.1, 250, 8.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_m3_man', 'gen_bmw_3er_f30', 'eng_bmw_s55b30', 'tr_man6', 'REAR', 317, 4.3, 250, 8.8, 'LITERS_PER_100KM', 'NEDC', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_320d',   'gen_bmw_3er_f30', 'eng_bmw_b47d20', 'tr_aut8', 'REAR', 140, 7.0, 236, 4.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_320d_xd','gen_bmw_3er_f30', 'eng_bmw_b47d20', 'tr_aut8', 'ALL_WHEEL',140, 7.3, 233, 4.8, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_f30_330d',   'gen_bmw_3er_f30', 'eng_bmw_b57d30', 'tr_aut8', 'REAR', 195, 5.4, 250, 5.4, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- G20 Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_bmw_b48b20_g20_320','mfr_bmw','320i B48 (G20)',  'B48B20', 1998, 4, 'PETROL', 'TURBOCHARGED', 135, 300, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b48b20_g20_330','mfr_bmw','330i B48 (G20)',  'B48B20', 1998, 4, 'PETROL', 'TURBOCHARGED', 190, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b48b20_g20_330e','mfr_bmw','330e PHEV (G20)','B48B20', 1998, 4, 'PLUGIN_HYBRID', 'TURBOCHARGED', 215, 420, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b58b30_g20',  'mfr_bmw', 'M340i B58 (G20)',  'B58B30', 2998, 6, 'PETROL', 'TURBOCHARGED', 275, 500, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s58b30',  'mfr_bmw', 'M3 S58 Bi-Turbo',      'S58B30', 2993, 6, 'PETROL', 'TURBOCHARGED', 353, 550, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s58b30_comp','mfr_bmw','M3 Competition S58',  'S58B30', 2993, 6, 'PETROL', 'TURBOCHARGED', 375, 550, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_s58b30_cs','mfr_bmw','M3 CS S58',            'S58B30', 2993, 6, 'PETROL', 'TURBOCHARGED', 405, 550, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b47d20_g20','mfr_bmw','320d B47 (G20)',      'B47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED', 140, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b47d20_g20_318','mfr_bmw','318d B47 (G20)',  'B47D20', 1995, 4, 'DIESEL', 'TURBOCHARGED', 110, 350, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b57d30_g20','mfr_bmw','330d B57 (G20)',      'B57D30', 2993, 6, 'DIESEL', 'TURBOCHARGED', 210, 580, 'PUBLISHED', NOW(), NOW()),
  ('eng_bmw_b57d30_g20_m340','mfr_bmw','M340d B57 (G20)','B57D30', 2993, 6, 'DIESEL', 'TURBOCHARGED', 250, 700, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- G20 Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_g20_318d',     'gen_bmw_3er_g20', 'eng_bmw_b47d20_g20_318','tr_aut8','REAR',110, 8.4, 222, 4.7, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_320i',     'gen_bmw_3er_g20', 'eng_bmw_b48b20_g20_320','tr_aut8','REAR',135, 7.1, 235, 6.8, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_320d',     'gen_bmw_3er_g20', 'eng_bmw_b47d20_g20','tr_aut8','REAR', 140, 6.8, 236, 4.7, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_320d_xd',  'gen_bmw_3er_g20', 'eng_bmw_b47d20_g20','tr_aut8','ALL_WHEEL',140, 7.1, 233, 5.0, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_330i',     'gen_bmw_3er_g20', 'eng_bmw_b48b20_g20_330','tr_aut8','REAR',190, 5.8, 250, 7.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_330e',     'gen_bmw_3er_g20', 'eng_bmw_b48b20_g20_330e','tr_aut8','REAR',215, 5.9, 230, 1.7, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_330d',     'gen_bmw_3er_g20', 'eng_bmw_b57d30_g20','tr_aut8','REAR',210, 5.5, 250, 5.3, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_m340i',    'gen_bmw_3er_g20', 'eng_bmw_b58b30_g20','tr_aut8','ALL_WHEEL',275, 4.4, 250, 7.8, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_m340d',    'gen_bmw_3er_g20', 'eng_bmw_b57d30_g20_m340','tr_aut8','ALL_WHEEL',250, 4.6, 250, 5.9, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_m3',       'gen_bmw_3er_g20', 'eng_bmw_s58b30', 'tr_man6', 'REAR', 353, 4.2, 250, 10.0,'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_m3_comp',  'gen_bmw_3er_g20', 'eng_bmw_s58b30_comp','tr_aut8','REAR',375, 3.9, 250, 10.2,'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_g20_m3_comp_xd','gen_bmw_3er_g20','eng_bmw_s58b30_comp','tr_aut8','ALL_WHEEL',375,3.5,250,10.4,'LITERS_PER_100KM','WLTP','PUBLISHED',NOW(),NOW()),
  ('pt_g20_m3_cs',    'gen_bmw_3er_g20', 'eng_bmw_s58b30_cs','tr_aut8','ALL_WHEEL',405, 3.4, 302, 10.1,'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
