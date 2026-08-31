-- =============================================================================
-- CARONEX Motoren-Erweiterung: Engines + PowertrainCombinations fuer neue Hersteller
-- Reale Motorspezifikationen, oeffentlich dokumentiert (Hersteller-Datenblaetter)
-- =============================================================================

BEGIN;

-- ===== ALFA ROMEO Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_alfa_20tb', 'mfr_alfa', '2.0 Turbo Benzin', 'GME', 1995, 4, 'PETROL', 'TURBOCHARGED', 147, 330, 'PUBLISHED', NOW(), NOW()),
  ('eng_alfa_20tb_280', 'mfr_alfa', '2.0 Turbo Benzin 280 PS', 'GME', 1995, 4, 'PETROL', 'TURBOCHARGED', 206, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_alfa_22d', 'mfr_alfa', '2.2 Diesel', NULL, 2143, 4, 'DIESEL', 'TURBOCHARGED', 140, 450, 'PUBLISHED', NOW(), NOW()),
  ('eng_alfa_22d_210', 'mfr_alfa', '2.2 Diesel 210 PS', NULL, 2143, 4, 'DIESEL', 'TURBOCHARGED', 154, 470, 'PUBLISHED', NOW(), NOW()),
  ('eng_alfa_29v6', 'mfr_alfa', '2.9 V6 Bi-Turbo', NULL, 2891, 6, 'PETROL', 'TURBOCHARGED', 375, 600, 'PUBLISHED', NOW(), NOW()),
  ('eng_alfa_15t_hybrid', 'mfr_alfa', '1.5 Turbo Hybrid', NULL, 1469, 4, 'HYBRID_PETROL', 'TURBOCHARGED', 96, 240, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Giulia Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_giulia_20tb', 'gen_alfa_giulia_952', 'eng_alfa_20tb', 'tr_aut8', 'REAR', 147, 6.6, 235, 7.3, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_giulia_20tb_280', 'gen_alfa_giulia_952', 'eng_alfa_20tb_280', 'tr_aut8', 'ALL_WHEEL', 206, 5.2, 240, 8.0, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_giulia_22d', 'gen_alfa_giulia_952', 'eng_alfa_22d', 'tr_aut8', 'REAR', 140, 7.1, 230, 5.2, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_giulia_qv', 'gen_alfa_giulia_952', 'eng_alfa_29v6', 'tr_aut8', 'REAR', 375, 3.9, 307, 10.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Stelvio Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_stelvio_20tb', 'gen_alfa_stelvio_949', 'eng_alfa_20tb', 'tr_aut8', 'ALL_WHEEL', 147, 6.6, 215, 8.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_stelvio_22d', 'gen_alfa_stelvio_949', 'eng_alfa_22d', 'tr_aut8', 'ALL_WHEEL', 140, 7.3, 210, 6.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_stelvio_qv', 'gen_alfa_stelvio_949', 'eng_alfa_29v6', 'tr_aut8', 'ALL_WHEEL', 375, 3.8, 283, 11.0, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tonale Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_tonale_15hyb', 'gen_alfa_tonale', 'eng_alfa_15t_hybrid', 'tr_dsg7', 'FRONT', 96, 8.8, 210, 6.0, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== JAGUAR Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_jag_20p', 'mfr_jaguar', '2.0 Turbo Benzin', 'Ingenium', 1997, 4, 'PETROL', 'TURBOCHARGED', 184, 365, 'PUBLISHED', NOW(), NOW()),
  ('eng_jag_20d', 'mfr_jaguar', '2.0 Diesel', 'Ingenium', 1999, 4, 'DIESEL', 'TURBOCHARGED', 132, 430, 'PUBLISHED', NOW(), NOW()),
  ('eng_jag_30v6sc', 'mfr_jaguar', '3.0 V6 Kompressor', 'AJ126', 2995, 6, 'PETROL', 'SUPERCHARGED', 250, 450, 'PUBLISHED', NOW(), NOW()),
  ('eng_jag_50v8sc', 'mfr_jaguar', '5.0 V8 Kompressor', 'AJ133', 5000, 8, 'PETROL', 'SUPERCHARGED', 423, 700, 'PUBLISHED', NOW(), NOW()),
  ('eng_jag_ev400', 'mfr_jaguar', 'EV400 Doppelmotor', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 294, 696, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- F-Type Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_ftype_20t', 'gen_jag_ftype_x152', 'eng_jag_20p', 'tr_aut8', 'REAR', 184, 5.7, 250, 8.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_ftype_v6', 'gen_jag_ftype_x152', 'eng_jag_30v6sc', 'tr_aut8', 'REAR', 250, 5.0, 260, 10.3, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_ftype_r', 'gen_jag_ftype_x152', 'eng_jag_50v8sc', 'tr_aut8', 'ALL_WHEEL', 423, 3.7, 300, 12.4, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- I-Pace Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_ipace_ev400', 'gen_jag_ipace', 'eng_jag_ev400', 'tr_red1', 'ALL_WHEEL', 294, 4.8, 200, 22.0, 'KWH_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== LAND ROVER Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_lr_d300', 'mfr_landrover', 'D300 Ingenium Diesel', 'Ingenium', 2996, 6, 'DIESEL', 'TURBOCHARGED', 221, 650, 'PUBLISHED', NOW(), NOW()),
  ('eng_lr_p400', 'mfr_landrover', 'P400 Ingenium MHEV', 'Ingenium', 2996, 6, 'HYBRID_PETROL', 'TURBOCHARGED', 294, 550, 'PUBLISHED', NOW(), NOW()),
  ('eng_lr_p300', 'mfr_landrover', 'P300 Turbo Benzin', 'Ingenium', 1997, 4, 'PETROL', 'TURBOCHARGED', 221, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_lr_d200', 'mfr_landrover', 'D200 Diesel', 'Ingenium', 1999, 4, 'DIESEL', 'TURBOCHARGED', 147, 430, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Defender Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_defender_d300', 'gen_lr_defender_l663', 'eng_lr_d300', 'tr_aut8', 'ALL_WHEEL', 221, 6.7, 191, 8.6, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_defender_p400', 'gen_lr_defender_l663', 'eng_lr_p400', 'tr_aut8', 'ALL_WHEEL', 294, 6.1, 209, 10.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_defender_d200', 'gen_lr_defender_l663', 'eng_lr_d200', 'tr_aut8', 'ALL_WHEEL', 147, 9.9, 175, 7.6, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== SUZUKI Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_suz_boost10', 'mfr_suzuki', '1.0 BoosterJet', 'K10C', 998, 3, 'PETROL', 'TURBOCHARGED', 82, 160, 'PUBLISHED', NOW(), NOW()),
  ('eng_suz_12_hybrid', 'mfr_suzuki', '1.2 DualJet Hybrid', 'K12D', 1197, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 61, 107, 'PUBLISHED', NOW(), NOW()),
  ('eng_suz_14_boost', 'mfr_suzuki', '1.4 BoosterJet', 'K14C', 1373, 4, 'PETROL', 'TURBOCHARGED', 103, 220, 'PUBLISHED', NOW(), NOW()),
  ('eng_suz_15_jimny', 'mfr_suzuki', '1.5 Allgrip', 'K15B', 1462, 4, 'PETROL', 'NATURALLY_ASPIRATED', 75, 130, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Swift Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_swift_12hyb', 'gen_suz_swift_az', 'eng_suz_12_hybrid', 'tr_cvt', 'FRONT', 61, 13.6, 165, 4.6, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_swift_10t', 'gen_suz_swift_az', 'eng_suz_boost10', 'tr_man6', 'FRONT', 82, 10.6, 195, 5.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW()),
  ('pt_swift_sport', 'gen_suz_swift_az', 'eng_suz_14_boost', 'tr_man6', 'FRONT', 103, 8.1, 210, 5.6, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Jimny Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_jimny_15', 'gen_suz_jimny_jb74', 'eng_suz_15_jimny', 'tr_man5', 'ALL_WHEEL', 75, NULL, 145, 6.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== SUBARU Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_sub_fb20', 'mfr_subaru', '2.0 e-BOXER', 'FB20', 1995, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 110, 196, 'PUBLISHED', NOW(), NOW()),
  ('eng_sub_fa24', 'mfr_subaru', '2.4 Turbo Boxer', 'FA24', 2387, 4, 'PETROL', 'TURBOCHARGED', 200, 370, 'PUBLISHED', NOW(), NOW()),
  ('eng_sub_fb25', 'mfr_subaru', '2.5 Boxer', 'FB25', 2498, 4, 'PETROL', 'NATURALLY_ASPIRATED', 136, 235, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Forester Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_forester_20eb', 'gen_sub_forester_sk', 'eng_sub_fb20', 'tr_cvt', 'ALL_WHEEL', 110, 11.8, 188, 8.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BRZ Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_brz_24t', 'gen_sub_brz_zd8', 'eng_sub_fa24', 'tr_man6', 'REAR', 170, 6.3, 226, 9.4, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== LEXUS Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_lex_25hyb', 'mfr_lexus', '2.5 Hybrid', 'A25A-FXS', 2487, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 152, 221, 'PUBLISHED', NOW(), NOW()),
  ('eng_lex_25hyb_nx', 'mfr_lexus', '2.5 Hybrid NX', 'A25A-FXS', 2487, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 179, 221, 'PUBLISHED', NOW(), NOW()),
  ('eng_lex_20t', 'mfr_lexus', '2.0 Turbo', '8AR-FTS', 1998, 4, 'PETROL', 'TURBOCHARGED', 180, 350, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- NX Powertrains
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_nx_350h', 'gen_lex_nx_az20', 'eng_lex_25hyb_nx', 'tr_cvt', 'ALL_WHEEL', 179, 7.7, 200, 5.9, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- RX Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_rx_350h', 'gen_lex_rx_al20', 'eng_lex_25hyb', 'tr_cvt', 'ALL_WHEEL', 183, 7.9, 200, 6.1, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== JEEP Motoren =====
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
  ('eng_jeep_20t', 'mfr_jeep', '2.0 Turbo', 'GME T4', 1995, 4, 'PETROL', 'TURBOCHARGED', 200, 400, 'PUBLISHED', NOW(), NOW()),
  ('eng_jeep_13t', 'mfr_jeep', '1.3 GSE Turbo', 'T4', 1332, 4, 'PETROL', 'TURBOCHARGED', 110, 270, 'PUBLISHED', NOW(), NOW()),
  ('eng_jeep_ev156', 'mfr_jeep', 'Elektromotor 156 PS', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 115, 260, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Wrangler Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_wrangler_20t', 'gen_jeep_wrangler_jl', 'eng_jeep_20t', 'tr_aut8', 'ALL_WHEEL', 200, 7.4, 180, 10.5, 'LITERS_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Avenger Powertrain
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "acceleration0to100", "topSpeedKmh", "consumptionCombined", "consumptionUnit", "measurementStandard", status, "publishedAt", "updatedAt") VALUES
  ('pt_avenger_ev', 'gen_jeep_avenger', 'eng_jeep_ev156', 'tr_red1', 'FRONT', 115, 9.0, 150, 15.7, 'KWH_PER_100KM', 'WLTP', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
