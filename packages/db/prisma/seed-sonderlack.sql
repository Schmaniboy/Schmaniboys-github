-- seed-sonderlack.sql
-- SpecialEditions (Sondermodelle) und PaintColors (Lackfarben) mit PaintColorAvailability
-- Basiert auf offiziellen Herstellerangaben und Konfiguratoren

BEGIN;

-- ============================================================
-- SpecialEditions (Sondermodelle)
-- ============================================================

-- VW Golf VII
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_golf7_gti_tcr', 'gen_vw_golf7', 'GTI TCR', 'gti-tcr', NULL, 2019, 2020, 'EU', 'Strassenzulassung der TCR-Rennversion mit 290 PS', 'Spezifische Frontschuerze, groesserer Heckspoiler, 18-Zoll-Felgen, Progressivlenkung Serie, bis zu 264 km/h', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('se_golf7_r400', 'gen_vw_golf7', 'R Performance', 'r-performance', NULL, 2018, 2020, 'EU', 'Sportlich verschaerfte Version des Golf R', 'Akrapovic-Abgasanlage optional, 19-Zoll-Spielberg-Felgen, Performance-Paket mit 310 PS', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- BMW 3er F30
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_f30_edition_sport', 'gen_bmw_3er_f30', 'Edition Sport Line Shadow', 'edition-sport-shadow', NULL, 2017, 2019, 'DE', 'Sonderedition mit Shadow-Line-Elementen', 'Schwarz hochglaenzende Niere, dunkle Scheinwerfer-Einfassung, M-Sportpaket, Sportsitze', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('se_f30_m_sport', 'gen_bmw_3er_f30', 'M Performance Edition', 'm-performance-edition', NULL, 2016, 2019, 'EU', 'Werkseitig mit M-Performance-Teilen versehen', 'M-Performance-Seitenschweller, M-Lenkrad, Carbon-Applikationen, Sportauspuff', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes C-Klasse W205
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_w205_amg_final', 'gen_mb_c_w205', 'AMG C 63 Final Edition', 'amg-c63-final-edition', NULL, 2021, 2021, 'EU', 'Letzte Version des V8-AMG vor dem Wechsel zum Vierzylinder-Hybrid', 'Spezielle Lackierung, AMG Night-Paket, Carbon-Exterieur, limitierte Stueckzahl', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Audi A4 B9
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_a4b9_edition_one', 'gen_audi_a4_b9', 'Edition One', 'edition-one', NULL, 2019, 2020, 'DE', 'Sonderedition zum Facelift-Start', 'Spezifische Felgen, S-line-Exterieur schwarz, Privacy-Verglasung, Komfortklimaautomatik', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('se_a4b9_competition', 'gen_audi_a4_b9', 'S4 Competition', 's4-competition', NULL, 2022, 2023, 'EU', 'Sportliche Spitzenversion des S4 Avant zum Modellende', 'Schwarze Optik-Elemente, Sport-Differenzial, adaptive Daempfer, Sportabgasanlage', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Porsche 911 992
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_992_sport_classic', 'gen_por_911_992', 'Sport Classic', 'sport-classic', NULL, 2022, 2023, 'GLOBAL', 'Retro-Edition mit Entenbuerzelspoiler und manuellem Getriebe', 'Feststehendem Entenbuerzelspoiler, 7-Gang-Handschaltung, 550 PS, auf 1250 Stueck limitiert', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('se_992_dakar', 'gen_por_911_992', 'Dakar', 'dakar', NULL, 2023, 2024, 'GLOBAL', 'Offroad-Version des 911 mit erhoehtem Fahrwerk', 'Hoehergelegtes PASM-Fahrwerk (+50mm), Unterfahrschutz, Dachgepaeecktraeger, Rallye-Design, limitiert auf 2500 Stueck', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- VW Tiguan AD
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_tigad_urban_sport', 'gen_vw_tiguan_ad', 'Urban Sport', 'urban-sport', NULL, 2022, 2024, 'DE', 'Sportlich-urbane Sonderedition', 'Schwarze R-Line-Elemente, 20-Zoll-Felgen Suzuka, IQ.LIGHT LED-Matrix, Panoramadach', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Skoda Octavia NX
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_octavia_rs', 'gen_sk_octavia_nx', 'RS Challenge', 'rs-challenge', NULL, 2023, 2024, 'EU', 'Top-Sportversion mit exklusiven Ausstattungsdetails', 'Rote Bremssaettel, 19-Zoll-Aero-Felgen, Sportfahrwerk -15mm, Sound-Aktuator, Canton-Soundsystem', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Toyota GR Supra A90
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_supra_jarama', 'gen_toy_supra_a90', 'Jarama Racetrack Edition', 'jarama-racetrack', NULL, 2021, 2021, 'EU', 'Limitierte Sonderedition fuer den europaeischen Markt', 'Exklusives Horizon Blue, 19-Zoll-Felgen Mattschwarz, rote Lederausstattung, Head-up-Display, auf 90 Stueck limitiert', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Ford Focus Mk4
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_focus_st_edition', 'gen_ford_focus_mk4', 'ST Edition', 'st-edition', NULL, 2021, 2023, 'EU', 'Track-orientierte Sonderversion des Focus ST', 'KW-Gewindefahrwerk, Quaife-Sperrdifferenzial, Ford Performance Schaltknauf, 19-Zoll-Felgen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- MINI Cooper F56
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_f56_jcw_gp', 'gen_mini_cooper_f56', 'John Cooper Works GP', 'jcw-gp', NULL, 2020, 2021, 'GLOBAL', 'Leistungssstaerkster MINI aller Zeiten, limitiert auf 3000 Stueck', '306 PS 2.0-Turbo, grosser Dachspoiler, breite Kotfluegel, Gewindefahrwerk, ohne Ruecksitze, 8-Gang-Automatik', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mazda MX-5 ND
INSERT INTO "SpecialEdition" (id, "generationId", name, slug, code, "yearFrom", "yearTo", "marketRegion", description, "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('se_mx5_100th', 'gen_mx5_4', '100th Anniversary', '100th-anniversary', NULL, 2020, 2020, 'GLOBAL', 'Sonderedition zum 100. Geburtstag von Mazda', 'Exklusiv Snowflake White Pearl mit Burgundy-Verdeck, Burgundy-Leder, spezielle Nabenkappe, Plakette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- ============================================================
-- PaintColors (Lackfarben) - pro Hersteller die wichtigsten
-- ============================================================

-- VW Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_vw_purewhite', 'mfr_vw', 'Pure White', 'pure-white', '0Q', 'UNI', '#FFFFFF', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_deepblack', 'mfr_vw', 'Deep Black Perleffekt', 'deep-black-perleffekt', '2T', 'PEARL_EFFECT', '#0A0A0A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_oryx', 'mfr_vw', 'Oryx Weiss Perleffekt', 'oryx-weiss-perleffekt', '0R', 'PEARL_EFFECT', '#F5F2E8', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_atlantic', 'mfr_vw', 'Atlantic Blue Metallic', 'atlantic-blue-metallic', '2Y', 'METALLIC', '#1E3A5F', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_urano', 'mfr_vw', 'Urano Grau', 'urano-grau', '5K', 'UNI', '#6B6B6B', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_tornado', 'mfr_vw', 'Tornado Rot', 'tornado-rot', 'G2', 'UNI', '#CC0000', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_vw_indium', 'mfr_vw', 'Indium Grau Metallic', 'indium-grau-metallic', 'R7', 'METALLIC', '#8C8C8C', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- BMW Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_bmw_alpinweiss', 'mfr_bmw', 'Alpinweiss III', 'alpinweiss-iii', '300', 'UNI', '#FFFFFF', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_bmw_mineralgrau', 'mfr_bmw', 'Mineralgrau Metallic', 'mineralgrau-metallic', 'B39', 'METALLIC', '#5C5C5C', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_bmw_schwarz2', 'mfr_bmw', 'Schwarz II', 'schwarz-ii', '668', 'UNI', '#0D0D0D', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_bmw_saphir', 'mfr_bmw', 'Saphirschwarz Metallic', 'saphirschwarz-metallic', '475', 'METALLIC', '#0F0F1A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_bmw_estoril', 'mfr_bmw', 'Estorilblau Metallic', 'estorilblau-metallic', 'B45', 'METALLIC', '#1C3F8C', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_bmw_melbourne', 'mfr_bmw', 'Melbourne Rot Metallic', 'melbourne-rot-metallic', 'A75', 'METALLIC', '#8C1515', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Mercedes Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_mb_polarweiss', 'mfr_mercedes', 'Polarweiss', 'polarweiss', '149', 'UNI', '#F2F2F2', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_mb_obsidian', 'mfr_mercedes', 'Obsidianschwarz Metallic', 'obsidianschwarz-metallic', '197', 'METALLIC', '#1A1A1A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_mb_selenitgrau', 'mfr_mercedes', 'Selenitgrau Metallic', 'selenitgrau-metallic', '992', 'METALLIC', '#7A7A7A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_mb_brillantblau', 'mfr_mercedes', 'Brillantblau Metallic', 'brillantblau-metallic', '896', 'METALLIC', '#1A2D5A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_mb_hyazinthrot', 'mfr_mercedes', 'Hyazinthrot Metallic', 'hyazinthrot-metallic', '996', 'METALLIC', '#7A1A1A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Audi Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_audi_ibisweiss', 'mfr_audi', 'Ibisweiss', 'ibisweiss', 'T9', 'UNI', '#FFFFFF', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_audi_mythos', 'mfr_audi', 'Mythosschwarz Metallic', 'mythosschwarz-metallic', '0E', 'METALLIC', '#0D0D0D', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_audi_monsun', 'mfr_audi', 'Monsungrau Metallic', 'monsungrau-metallic', '0C', 'METALLIC', '#7A7A7A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_audi_navarrablau', 'mfr_audi', 'Navarrablau Metallic', 'navarrablau-metallic', '2D', 'METALLIC', '#1A2E5A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_audi_tangorot', 'mfr_audi', 'Tangorot Metallic', 'tangorot-metallic', 'Y1', 'METALLIC', '#8C1A1A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Porsche Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_por_carrara', 'mfr_porsche', 'Carraraweiss', 'carraraweiss', NULL, 'UNI', '#F5F5F0', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_por_schwarz', 'mfr_porsche', 'Schwarz', 'schwarz', NULL, 'UNI', '#0D0D0D', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_por_gt_silber', 'mfr_porsche', 'GT-Silber Metallic', 'gt-silber-metallic', NULL, 'METALLIC', '#B0B0B0', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_por_racing', 'mfr_porsche', 'Racinggelb', 'racinggelb', NULL, 'UNI', '#FFD700', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_por_guards', 'mfr_porsche', 'Guardsrot', 'guardsrot', NULL, 'UNI', '#CC0000', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_por_pts_rubystar', 'mfr_porsche', 'Ruby Star (PTS)', 'ruby-star-pts', NULL, 'SPECIAL_ORDER', '#9B1B30', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Toyota Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_toy_purewhite', 'mfr_toyota', 'Platinumweiss Perleffekt', 'platinumweiss-perleffekt', '089', 'PEARL_EFFECT', '#F0F0E8', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_toy_attitudeblack', 'mfr_toyota', 'Attitude Black Mica', 'attitude-black-mica', '218', 'METALLIC', '#0D0D0D', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_toy_emotional', 'mfr_toyota', 'Emotional Red II', 'emotional-red-ii', '3U5', 'METALLIC', '#CC1A1A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- Tesla Farben
INSERT INTO "PaintColor" (id, "manufacturerId", name, slug, code, kind, "approximateHex", status, "publishedAt", "updatedAt", "dataQuality") VALUES
('pc_ts_pearlwhite', 'mfr_tesla', 'Pearl White Multi-Coat', 'pearl-white-multi-coat', NULL, 'PEARL_EFFECT', '#F0F0F0', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_ts_solidblack', 'mfr_tesla', 'Solid Black', 'solid-black', NULL, 'UNI', '#0D0D0D', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_ts_midnight', 'mfr_tesla', 'Midnight Silver Metallic', 'midnight-silver-metallic', NULL, 'METALLIC', '#4A4A4A', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('pc_ts_ultrared', 'mfr_tesla', 'Ultra Red', 'ultra-red', NULL, 'METALLIC', '#CC0033', 'PUBLISHED', NOW(), NOW(), 'VERIFIED') ON CONFLICT DO NOTHING;

-- ============================================================
-- PaintColorAvailability (Zuordnung zu Generationen)
-- ============================================================

-- VW Golf VII
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_golf7_pw', 'pc_vw_purewhite', 'gen_vw_golf7', 'STANDARD', NOW()),
('pca_golf7_db', 'pc_vw_deepblack', 'gen_vw_golf7', 'OPTIONAL', NOW()),
('pca_golf7_tr', 'pc_vw_tornado', 'gen_vw_golf7', 'STANDARD', NOW()),
('pca_golf7_ab', 'pc_vw_atlantic', 'gen_vw_golf7', 'OPTIONAL', NOW()),
('pca_golf7_ig', 'pc_vw_indium', 'gen_vw_golf7', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- VW Golf VIII
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_golf8_pw', 'pc_vw_purewhite', 'gen_vw_golf8', 'STANDARD', NOW()),
('pca_golf8_db', 'pc_vw_deepblack', 'gen_vw_golf8', 'OPTIONAL', NOW()),
('pca_golf8_ow', 'pc_vw_oryx', 'gen_vw_golf8', 'OPTIONAL', NOW()),
('pca_golf8_ug', 'pc_vw_urano', 'gen_vw_golf8', 'STANDARD', NOW()) ON CONFLICT DO NOTHING;

-- VW Tiguan AD
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_tigad_pw', 'pc_vw_purewhite', 'gen_vw_tiguan_ad', 'STANDARD', NOW()),
('pca_tigad_db', 'pc_vw_deepblack', 'gen_vw_tiguan_ad', 'OPTIONAL', NOW()),
('pca_tigad_ow', 'pc_vw_oryx', 'gen_vw_tiguan_ad', 'OPTIONAL', NOW()),
('pca_tigad_ab', 'pc_vw_atlantic', 'gen_vw_tiguan_ad', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- BMW 3er F30
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_f30_aw', 'pc_bmw_alpinweiss', 'gen_bmw_3er_f30', 'STANDARD', NOW()),
('pca_f30_ss', 'pc_bmw_schwarz2', 'gen_bmw_3er_f30', 'STANDARD', NOW()),
('pca_f30_sb', 'pc_bmw_saphir', 'gen_bmw_3er_f30', 'OPTIONAL', NOW()),
('pca_f30_mg', 'pc_bmw_mineralgrau', 'gen_bmw_3er_f30', 'OPTIONAL', NOW()),
('pca_f30_eb', 'pc_bmw_estoril', 'gen_bmw_3er_f30', 'OPTIONAL', NOW()),
('pca_f30_mr', 'pc_bmw_melbourne', 'gen_bmw_3er_f30', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- BMW 3er G20
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_g20_aw', 'pc_bmw_alpinweiss', 'gen_bmw_3er_g20', 'STANDARD', NOW()),
('pca_g20_sb', 'pc_bmw_saphir', 'gen_bmw_3er_g20', 'OPTIONAL', NOW()),
('pca_g20_mg', 'pc_bmw_mineralgrau', 'gen_bmw_3er_g20', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Mercedes C-Klasse W205
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_w205_pw', 'pc_mb_polarweiss', 'gen_mb_c_w205', 'STANDARD', NOW()),
('pca_w205_ob', 'pc_mb_obsidian', 'gen_mb_c_w205', 'OPTIONAL', NOW()),
('pca_w205_sg', 'pc_mb_selenitgrau', 'gen_mb_c_w205', 'OPTIONAL', NOW()),
('pca_w205_bb', 'pc_mb_brillantblau', 'gen_mb_c_w205', 'OPTIONAL', NOW()),
('pca_w205_hr', 'pc_mb_hyazinthrot', 'gen_mb_c_w205', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Audi A4 B9
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_a4b9_iw', 'pc_audi_ibisweiss', 'gen_audi_a4_b9', 'STANDARD', NOW()),
('pca_a4b9_ms', 'pc_audi_mythos', 'gen_audi_a4_b9', 'OPTIONAL', NOW()),
('pca_a4b9_mg', 'pc_audi_monsun', 'gen_audi_a4_b9', 'OPTIONAL', NOW()),
('pca_a4b9_nb', 'pc_audi_navarrablau', 'gen_audi_a4_b9', 'OPTIONAL', NOW()),
('pca_a4b9_tr', 'pc_audi_tangorot', 'gen_audi_a4_b9', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Porsche 911 992
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_992_cw', 'pc_por_carrara', 'gen_por_911_992', 'STANDARD', NOW()),
('pca_992_sw', 'pc_por_schwarz', 'gen_por_911_992', 'STANDARD', NOW()),
('pca_992_gs', 'pc_por_gt_silber', 'gen_por_911_992', 'OPTIONAL', NOW()),
('pca_992_rg', 'pc_por_racing', 'gen_por_911_992', 'OPTIONAL', NOW()),
('pca_992_gr', 'pc_por_guards', 'gen_por_911_992', 'OPTIONAL', NOW()),
('pca_992_rs', 'pc_por_pts_rubystar', 'gen_por_911_992', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Tesla Model 3 Highland
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_m3h_pw', 'pc_ts_pearlwhite', 'gen_ts_model3_hr', 'STANDARD', NOW()),
('pca_m3h_sb', 'pc_ts_solidblack', 'gen_ts_model3_hr', 'OPTIONAL', NOW()),
('pca_m3h_ms', 'pc_ts_midnight', 'gen_ts_model3_hr', 'OPTIONAL', NOW()),
('pca_m3h_ur', 'pc_ts_ultrared', 'gen_ts_model3_hr', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Tesla Model Y
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_my_pw', 'pc_ts_pearlwhite', 'gen_ts_modely_1', 'STANDARD', NOW()),
('pca_my_sb', 'pc_ts_solidblack', 'gen_ts_modely_1', 'OPTIONAL', NOW()),
('pca_my_ur', 'pc_ts_ultrared', 'gen_ts_modely_1', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

-- Toyota RAV4 XA50
INSERT INTO "PaintColorAvailability" (id, "paintColorId", "generationId", kind, "updatedAt") VALUES
('pca_rav4_pw', 'pc_toy_purewhite', 'gen_toy_rav4_xa50', 'OPTIONAL', NOW()),
('pca_rav4_ab', 'pc_toy_attitudeblack', 'gen_toy_rav4_xa50', 'STANDARD', NOW()),
('pca_rav4_er', 'pc_toy_emotional', 'gen_toy_rav4_xa50', 'OPTIONAL', NOW()) ON CONFLICT DO NOTHING;

COMMIT;
