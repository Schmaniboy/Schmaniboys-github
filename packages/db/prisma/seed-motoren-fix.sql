-- seed-motoren-fix.sql
-- PowertrainCombinations fuer die 12 verbleibenden Generationen ohne Motordaten

BEGIN;

-- Ford Puma (1.0 EcoBoost)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_puma1_eb10', 'gen_ford_puma_1', 'eng_ford_eb10', 'tr_man6', 'FRONT', 92, 170, 'PUBLISHED', NOW(), NOW()),
('pc_puma1_eb10_mhev', 'gen_ford_puma_1', 'eng_ford_eb15', 'tr_man6', 'FRONT', 110, 240, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Honda Civic XI (1.5 VTEC Turbo, 2.0 e:HEV)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_civic11_15t', 'gen_civic_11', 'eng_honda_15t', 'tr_cvt', 'FRONT', 134, 240, 'PUBLISHED', NOW(), NOW()),
('pc_civic11_hev20', 'gen_civic_11', 'eng_honda_hev20', 'tr_cvt', 'FRONT', 135, 315, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Kia EV6 (neuer Elektromotor noetig)
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_kia_ev6_rwd', 'mfr_kia', 'EV6 Elektromotor RWD', 'PE-RWD', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 168, 350, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_ev6_rwd', 'gen_kia_ev6_cv', 'eng_kia_ev6_rwd', 'tr_red1', 'REAR', 168, 350, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Mazda CX-60 (2.5 SKYACTIV-G, PHEV)
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_maz_sky30d', 'mfr_mazda', '3.3 SKYACTIV-D', 'S8-DPTS33', 3283, 6, 'DIESEL', 'TURBOCHARGED', 187, 550, 'PUBLISHED', NOW(), NOW()),
('eng_maz_phev25', 'mfr_mazda', '2.5 PHEV', 'PY-VPS-PHEV', 2488, 4, 'PLUGIN_HYBRID', 'NATURALLY_ASPIRATED', 241, 500, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_cx60_sky30d', 'gen_cx60_1', 'eng_maz_sky30d', 'tr_aut8', 'REAR', 187, 550, 'PUBLISHED', NOW(), NOW()),
('pc_cx60_phev', 'gen_cx60_1', 'eng_maz_phev25', 'tr_aut8', 'ALL', 241, 500, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Opel Corsa F (1.2 PureTech, Elektromotor)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_corsaf_pt12', 'gen_opel_corsa_f', 'eng_opel_pt12', 'tr_man6', 'FRONT', 74, 205, 'PUBLISHED', NOW(), NOW()),
('pc_corsaf_ev', 'gen_opel_corsa_f', 'eng_opel_ev136', 'tr_red1', 'FRONT', 100, 260, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Peugeot 308 III (1.2 PureTech, 1.5 BlueHDi, PHEV)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_308_pt12', 'gen_308_3', 'eng_peug_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_308_bhdi', 'gen_308_3', 'eng_peug_bhdi15', 'tr_aut8', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()),
('pc_308_phev', 'gen_308_3', 'eng_peug_phev', 'tr_aut8', 'FRONT', 165, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Renault Captur II (1.0 TCe, 1.6 E-TECH Hybrid)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_captur2_tce10', 'gen_ren_captur2', 'eng_ren_tce10', 'tr_man5', 'FRONT', 67, 160, 'PUBLISHED', NOW(), NOW()),
('pc_captur2_tce13', 'gen_ren_captur2', 'eng_ren_tce13', 'tr_dsg7', 'FRONT', 103, 240, 'PUBLISHED', NOW(), NOW()),
('pc_captur2_hev', 'gen_ren_captur2', 'eng_ren_hev16', 'tr_cvt', 'FRONT', 105, 205, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- SEAT Leon IV (1.0 TSI, 1.5 TSI)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_leon4_tsi10', 'gen_seat_leon4', 'eng_seat_tsi10', 'tr_man6', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_leon4_tsi15', 'gen_seat_leon4', 'eng_seat_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- VW Tiguan AD (1.5 TSI, 2.0 TDI)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_tigad_15tsi', 'gen_vw_tiguan_ad', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_tigad_20tdi', 'gen_vw_tiguan_ad', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'ALL', 110, 340, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Volvo XC40 (B4 Benzin, Elektromotor)
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_volvo_ev_xc40', 'mfr_volvo', 'Elektromotor Recharge', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 170, 330, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_xc40_b4p', 'gen_volvo_xc40_1', 'eng_volvo_b4p', 'tr_aut8', 'FRONT', 145, 300, 'PUBLISHED', NOW(), NOW()),
('pc_xc40_ev', 'gen_volvo_xc40_1', 'eng_volvo_ev_xc40', 'tr_red1', 'FRONT', 170, 330, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Volvo XC90 (B5 Benzin, T8 Recharge PHEV)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_xc90_b5p', 'gen_volvo_xc90_2', 'eng_volvo_b5p', 'tr_aut8', 'ALL', 184, 350, 'PUBLISHED', NOW(), NOW()),
('pc_xc90_t8', 'gen_volvo_xc90_2', 'eng_volvo_t8phev', 'tr_aut8', 'ALL', 290, 659, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Skoda Octavia NX (1.0 TSI, 1.5 TSI, 2.0 TSI, 2.0 TDI)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_octavia_tsi10', 'gen_sk_octavia_nx', 'eng_skoda_tsi10', 'tr_man6', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_octavia_tsi15', 'gen_sk_octavia_nx', 'eng_skoda_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_octavia_tsi20', 'gen_sk_octavia_nx', 'eng_skoda_tsi20', 'tr_dsg7', 'FRONT', 140, 320, 'PUBLISHED', NOW(), NOW()),
('pc_octavia_tdi20', 'gen_sk_octavia_nx', 'eng_skoda_tdi20', 'tr_dsg7', 'FRONT', 110, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

COMMIT;
