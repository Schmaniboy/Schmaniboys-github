-- seed-motoren.sql
-- Engines und PowertrainCombinations fuer alle Generationen
-- Reale Motorspezifikationen, oeffentlich dokumentiert

BEGIN;

-- ============================================================
-- TEIL 1: Neue Engines fuer fehlende Hersteller
-- ============================================================

-- ---- AUDI (Konzernmotoren EA211/EA888/EA288) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_audi_tfsi10', 'mfr_audi', '1.0 TFSI', 'EA211', 999, 3, 'PETROL', 'TURBOCHARGED', 81, 200, 'PUBLISHED', NOW(), NOW()),
('eng_audi_tfsi15', 'mfr_audi', '1.5 TFSI', 'EA211evo', 1498, 4, 'PETROL', 'TURBOCHARGED', 110, 250, 'PUBLISHED', NOW(), NOW()),
('eng_audi_tfsi20', 'mfr_audi', '2.0 TFSI', 'EA888', 1984, 4, 'PETROL', 'TURBOCHARGED', 150, 320, 'PUBLISHED', NOW(), NOW()),
('eng_audi_tdi20', 'mfr_audi', '2.0 TDI', 'EA288evo', 1968, 4, 'DIESEL', 'TURBOCHARGED', 110, 360, 'PUBLISHED', NOW(), NOW()),
('eng_audi_etron', 'mfr_audi', 'Elektromotor (e-tron)', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 350, 630, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- FORD (EcoBoost / EcoBlue) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_ford_eb10', 'mfr_ford', '1.0 EcoBoost', 'Fox', 999, 3, 'PETROL', 'TURBOCHARGED', 92, 170, 'PUBLISHED', NOW(), NOW()),
('eng_ford_eb15', 'mfr_ford', '1.5 EcoBoost', 'Dragon', 1498, 3, 'PETROL', 'TURBOCHARGED', 110, 240, 'PUBLISHED', NOW(), NOW()),
('eng_ford_eb20', 'mfr_ford', '2.0 EcoBoost', NULL, 1999, 4, 'PETROL', 'TURBOCHARGED', 140, 340, 'PUBLISHED', NOW(), NOW()),
('eng_ford_ecbl20', 'mfr_ford', '2.0 EcoBlue', NULL, 1997, 4, 'DIESEL', 'TURBOCHARGED', 110, 370, 'PUBLISHED', NOW(), NOW()),
('eng_ford_phev25', 'mfr_ford', '2.5 PHEV', NULL, 2488, 4, 'PLUGIN_HYBRID', 'NATURALLY_ASPIRATED', 165, NULL, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- KIA (Smartstream) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_kia_tgdi16', 'mfr_kia', '1.6 T-GDI', 'G4FJ', 1598, 4, 'PETROL', 'TURBOCHARGED', 132, 265, 'PUBLISHED', NOW(), NOW()),
('eng_kia_crdi16', 'mfr_kia', '1.6 CRDi', 'D4FE', 1598, 4, 'DIESEL', 'TURBOCHARGED', 100, 280, 'PUBLISHED', NOW(), NOW()),
('eng_kia_hev16', 'mfr_kia', '1.6 GDI Hybrid', 'G4LE-HEV', 1580, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 104, 265, 'PUBLISHED', NOW(), NOW()),
('eng_kia_phev16', 'mfr_kia', '1.6 T-GDI PHEV', 'G4LE-PHEV', 1598, 4, 'PLUGIN_HYBRID', 'TURBOCHARGED', 195, 350, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- MAZDA (SKYACTIV) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_maz_sky20g', 'mfr_mazda', '2.0 SKYACTIV-G', 'PE-VPS', 1998, 4, 'PETROL', 'NATURALLY_ASPIRATED', 121, 213, 'PUBLISHED', NOW(), NOW()),
('eng_maz_sky25', 'mfr_mazda', '2.5 SKYACTIV-G', 'PY-VPS', 2488, 4, 'PETROL', 'NATURALLY_ASPIRATED', 143, 252, 'PUBLISHED', NOW(), NOW()),
('eng_maz_skyx20', 'mfr_mazda', '2.0 e-SKYACTIV X', 'HF-VPH', 1998, 4, 'HYBRID_PETROL', 'SUPERCHARGED', 137, 240, 'PUBLISHED', NOW(), NOW()),
('eng_maz_skyd18', 'mfr_mazda', '1.8 SKYACTIV-D', 'S8-DPTS', 1759, 4, 'DIESEL', 'TURBOCHARGED', 85, 270, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- VOLVO (T/B/D Modularmotoren) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_volvo_b4p', 'mfr_volvo', 'B4 Benzin', 'B4204T47', 1969, 4, 'HYBRID_PETROL', 'TURBOCHARGED', 145, 300, 'PUBLISHED', NOW(), NOW()),
('eng_volvo_b5p', 'mfr_volvo', 'B5 Benzin', 'B4204T23', 1969, 4, 'HYBRID_PETROL', 'TURBOCHARGED', 184, 350, 'PUBLISHED', NOW(), NOW()),
('eng_volvo_b4d', 'mfr_volvo', 'B4 Diesel', 'D4204T14', 1969, 4, 'DIESEL', 'TURBOCHARGED', 145, 400, 'PUBLISHED', NOW(), NOW()),
('eng_volvo_t8phev', 'mfr_volvo', 'T8 Recharge PHEV', NULL, 1969, 4, 'PLUGIN_HYBRID', 'TWINCHARGED', 290, 659, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- NISSAN ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_nissan_dig13', 'mfr_nissan', '1.3 DIG-T', 'HR13DDT', 1332, 4, 'PETROL', 'TURBOCHARGED', 116, 270, 'PUBLISHED', NOW(), NOW()),
('eng_nissan_epower', 'mfr_nissan', '1.5 e-POWER', 'HR15DE', 1498, 3, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 140, 330, 'PUBLISHED', NOW(), NOW()),
('eng_nissan_em57', 'mfr_nissan', 'EM57 Elektromotor', 'EM57', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 160, 340, 'PUBLISHED', NOW(), NOW()),
('eng_nissan_ariya_e', 'mfr_nissan', 'Ariya Elektromotor', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 178, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- OPEL / PEUGEOT / CITROEN / DS (Stellantis PureTech/BlueHDi) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_opel_pt12', 'mfr_opel', '1.2 PureTech Turbo', 'EB2', 1199, 3, 'PETROL', 'TURBOCHARGED', 96, 230, 'PUBLISHED', NOW(), NOW()),
('eng_opel_bhdi15', 'mfr_opel', '1.5 BlueHDi', 'DV5', 1499, 4, 'DIESEL', 'TURBOCHARGED', 96, 300, 'PUBLISHED', NOW(), NOW()),
('eng_opel_ev136', 'mfr_opel', 'Elektromotor 136 PS', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 100, 260, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_peug_pt12', 'mfr_peugeot', '1.2 PureTech Turbo', 'EB2', 1199, 3, 'PETROL', 'TURBOCHARGED', 96, 230, 'PUBLISHED', NOW(), NOW()),
('eng_peug_bhdi15', 'mfr_peugeot', '1.5 BlueHDi', 'DV5', 1499, 4, 'DIESEL', 'TURBOCHARGED', 96, 300, 'PUBLISHED', NOW(), NOW()),
('eng_peug_phev', 'mfr_peugeot', '1.6 PHEV', NULL, 1598, 4, 'PLUGIN_HYBRID', 'TURBOCHARGED', 165, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_citr_pt12', 'mfr_citroen', '1.2 PureTech Turbo', 'EB2', 1199, 3, 'PETROL', 'TURBOCHARGED', 96, 230, 'PUBLISHED', NOW(), NOW()),
('eng_citr_bhdi15', 'mfr_citroen', '1.5 BlueHDi', 'DV5', 1499, 4, 'DIESEL', 'TURBOCHARGED', 96, 300, 'PUBLISHED', NOW(), NOW()),
('eng_citr_bhdi20', 'mfr_citroen', '2.0 BlueHDi', 'DW10', 1997, 4, 'DIESEL', 'TURBOCHARGED', 130, 400, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_ds_pt12', 'mfr_ds', '1.2 PureTech Turbo', 'EB2', 1199, 3, 'PETROL', 'TURBOCHARGED', 96, 230, 'PUBLISHED', NOW(), NOW()),
('eng_ds_phev16', 'mfr_ds', '1.6 E-TENSE PHEV', NULL, 1598, 4, 'PLUGIN_HYBRID', 'TURBOCHARGED', 165, 360, 'PUBLISHED', NOW(), NOW()),
('eng_ds_bhdi15', 'mfr_ds', '1.5 BlueHDi', 'DV5', 1499, 4, 'DIESEL', 'TURBOCHARGED', 96, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- DACIA (Renault TCe Motoren) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_dacia_tce10', 'mfr_dacia', '1.0 TCe 90', 'H5Ht-90', 999, 3, 'PETROL', 'TURBOCHARGED', 67, 160, 'PUBLISHED', NOW(), NOW()),
('eng_dacia_tce13', 'mfr_dacia', '1.3 TCe 130', 'H5Ht-130', 1332, 4, 'PETROL', 'TURBOCHARGED', 96, 240, 'PUBLISHED', NOW(), NOW()),
('eng_dacia_hev14', 'mfr_dacia', '1.6 Hybrid 140', NULL, 1598, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 103, 205, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- RENAULT (TCe) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_ren_tce10', 'mfr_renault', '1.0 TCe 90', 'H5Ht-90', 999, 3, 'PETROL', 'TURBOCHARGED', 67, 160, 'PUBLISHED', NOW(), NOW()),
('eng_ren_tce13', 'mfr_renault', '1.3 TCe 140', 'H5Ht-140', 1332, 4, 'PETROL', 'TURBOCHARGED', 103, 240, 'PUBLISHED', NOW(), NOW()),
('eng_ren_hev16', 'mfr_renault', '1.6 E-TECH Hybrid', NULL, 1598, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 105, 205, 'PUBLISHED', NOW(), NOW()),
('eng_ren_ev', 'mfr_renault', 'Elektromotor (Megane E-TECH)', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 160, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- FIAT ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_fiat_fire10', 'mfr_fiat', '1.0 FireFly Hybrid', 'GSE-T3', 999, 3, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 51, 92, 'PUBLISHED', NOW(), NOW()),
('eng_fiat_fire13', 'mfr_fiat', '1.3 FireFly', 'GSE-T4', 1332, 4, 'PETROL', 'TURBOCHARGED', 110, 270, 'PUBLISHED', NOW(), NOW()),
('eng_fiat_ev_87', 'mfr_fiat', 'Elektromotor 87 kW', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 87, 220, 'PUBLISHED', NOW(), NOW()),
('eng_fiat_mj23', 'mfr_fiat', '2.3 MultiJet', 'F1A', 2287, 4, 'DIESEL', 'TURBOCHARGED', 103, 380, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- HONDA (i-VTEC / e:HEV) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_honda_15t', 'mfr_honda', '1.5 VTEC Turbo', 'L15B7', 1498, 4, 'PETROL', 'TURBOCHARGED', 134, 240, 'PUBLISHED', NOW(), NOW()),
('eng_honda_hev15', 'mfr_honda', '1.5 e:HEV', 'LEB', 1498, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 80, 253, 'PUBLISHED', NOW(), NOW()),
('eng_honda_hev20', 'mfr_honda', '2.0 e:HEV', 'LFB', 1993, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 107, 315, 'PUBLISHED', NOW(), NOW()),
('eng_honda_ev', 'mfr_honda', 'Elektromotor (Honda e)', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 113, 315, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- MINI (BMW B38/B48 Basis) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_mini_one', 'mfr_mini', '1.5 One', 'B38A15-75', 1499, 3, 'PETROL', 'TURBOCHARGED', 75, 190, 'PUBLISHED', NOW(), NOW()),
('eng_mini_cooper', 'mfr_mini', '1.5 Cooper', 'B38A15-100', 1499, 3, 'PETROL', 'TURBOCHARGED', 100, 220, 'PUBLISHED', NOW(), NOW()),
('eng_mini_coop_s', 'mfr_mini', '2.0 Cooper S', 'B48A20', 1998, 4, 'PETROL', 'TURBOCHARGED', 141, 280, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- CUPRA (VW EA888 / Elektromotor) ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_cupra_tsi15', 'mfr_cupra', '1.5 TSI', 'EA211evo', 1498, 4, 'PETROL', 'TURBOCHARGED', 110, 250, 'PUBLISHED', NOW(), NOW()),
('eng_cupra_tsi20', 'mfr_cupra', '2.0 TSI', 'EA888evo4', 1984, 4, 'PETROL', 'TURBOCHARGED', 228, 400, 'PUBLISHED', NOW(), NOW()),
('eng_cupra_ev', 'mfr_cupra', 'Elektromotor (Born)', NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 150, 310, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- SEAT ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_seat_tsi10', 'mfr_seat', '1.0 TSI', 'EA211', 999, 3, 'PETROL', 'TURBOCHARGED', 81, 200, 'PUBLISHED', NOW(), NOW()),
('eng_seat_tsi15', 'mfr_seat', '1.5 TSI', 'EA211evo', 1498, 4, 'PETROL', 'TURBOCHARGED', 110, 250, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- SKODA ----
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('eng_skoda_tsi10', 'mfr_skoda', '1.0 TSI', 'EA211', 999, 3, 'PETROL', 'TURBOCHARGED', 81, 200, 'PUBLISHED', NOW(), NOW()),
('eng_skoda_tsi15', 'mfr_skoda', '1.5 TSI', 'EA211evo', 1498, 4, 'PETROL', 'TURBOCHARGED', 110, 250, 'PUBLISHED', NOW(), NOW()),
('eng_skoda_tsi20', 'mfr_skoda', '2.0 TSI', 'EA888', 1984, 4, 'PETROL', 'TURBOCHARGED', 140, 320, 'PUBLISHED', NOW(), NOW()),
('eng_skoda_tdi20', 'mfr_skoda', '2.0 TDI', 'EA288', 1968, 4, 'DIESEL', 'TURBOCHARGED', 110, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- TEIL 2: PowertrainCombinations fuer alle Generationen
-- ============================================================

-- ---- AUDI ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_a3_8y_15tfsi', 'gen_audi_a3_8y', 'eng_audi_tfsi15', 'tr_man6', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_a3_8y_20tfsi', 'gen_audi_a3_8y', 'eng_audi_tfsi20', 'tr_dsg7', 'FRONT', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_a4_b9_20tfsi', 'gen_audi_a4_b9', 'eng_audi_tfsi20', 'tr_dsg7', 'FRONT', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_a4_b9_20tdi', 'gen_audi_a4_b9', 'eng_audi_tdi20', 'tr_dsg7', 'FRONT', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_a5_f5_20tfsi', 'gen_audi_a5_f5', 'eng_audi_tfsi20', 'tr_dsg7', 'FRONT', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_a6_c8_20tfsi', 'gen_audi_a6_c8', 'eng_audi_tfsi20', 'tr_dsg7', 'FRONT', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_a6_c8_20tdi', 'gen_audi_a6_c8', 'eng_audi_tdi20', 'tr_dsg7', 'ALL', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_q3_f3_15tfsi', 'gen_audi_q3_f3', 'eng_audi_tfsi15', 'tr_man6', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_q3_f3_20tfsi', 'gen_audi_q3_f3', 'eng_audi_tfsi20', 'tr_dsg7', 'ALL', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_q5_fy_20tfsi', 'gen_audi_q5_fy', 'eng_audi_tfsi20', 'tr_dsg7', 'ALL', 150, 320, 'PUBLISHED', NOW(), NOW()),
('pc_q5_fy_20tdi', 'gen_audi_q5_fy', 'eng_audi_tdi20', 'tr_dsg7', 'ALL', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_q7_4m_20tfsi', 'gen_audi_q7_4m', 'eng_audi_tfsi20', 'tr_aut8', 'ALL', 180, 370, 'PUBLISHED', NOW(), NOW()),
('pc_q7_4m_20tdi', 'gen_audi_q7_4m', 'eng_audi_tdi20', 'tr_aut8', 'ALL', 170, 500, 'PUBLISHED', NOW(), NOW()),
('pc_etron_gt', 'gen_audi_etron_j1', 'eng_audi_etron', 'tr_red2', 'ALL', 350, 630, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- BMW (bestehende Engines fuer fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_2er_u06_b38', 'gen_bmw_2er_u06', 'eng_bmw_b38b15', 'tr_dct7', 'FRONT', 103, 190, 'PUBLISHED', NOW(), NOW()),
('pc_2er_u06_b48', 'gen_bmw_2er_u06', 'eng_bmw_b48b20', 'tr_dct7', 'FRONT', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_3er_e90_b48', 'gen_bmw_3er_e90', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_3er_f30_b48', 'gen_bmw_3er_f30', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_3er_f30_b47', 'gen_bmw_3er_f30', 'eng_bmw_b47d20', 'tr_aut8', 'REAR', 140, 400, 'PUBLISHED', NOW(), NOW()),
('pc_4er_g22_b48', 'gen_bmw_4er_g22', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_4er_g22_b58', 'gen_bmw_4er_g22', 'eng_bmw_b58b30', 'tr_aut8', 'REAR', 285, 450, 'PUBLISHED', NOW(), NOW()),
('pc_5er_g30_b48', 'gen_bmw_5er_g30', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_5er_g30_b57', 'gen_bmw_5er_g30', 'eng_bmw_b57d30', 'tr_aut8', 'REAR', 195, 620, 'PUBLISHED', NOW(), NOW()),
('pc_5er_g60_b48', 'gen_bmw_5er_g60', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 145, 310, 'PUBLISHED', NOW(), NOW()),
('pc_5er_g60_b57', 'gen_bmw_5er_g60', 'eng_bmw_b57d30', 'tr_aut8', 'ALL', 210, 650, 'PUBLISHED', NOW(), NOW()),
('pc_x1_u11_b38', 'gen_bmw_x1_u11', 'eng_bmw_b38b15', 'tr_dct7', 'FRONT', 103, 190, 'PUBLISHED', NOW(), NOW()),
('pc_x1_u11_b48', 'gen_bmw_x1_u11', 'eng_bmw_b48b20', 'tr_dct7', 'ALL', 150, 300, 'PUBLISHED', NOW(), NOW()),
('pc_x3_g01_b48', 'gen_bmw_x3_g01', 'eng_bmw_b48b20', 'tr_aut8', 'ALL', 135, 300, 'PUBLISHED', NOW(), NOW()),
('pc_x3_g01_b47', 'gen_bmw_x3_g01', 'eng_bmw_b47d20', 'tr_aut8', 'ALL', 140, 400, 'PUBLISHED', NOW(), NOW()),
('pc_x5_g05_b48', 'gen_bmw_x5_g05', 'eng_bmw_b48b20', 'tr_aut8', 'ALL', 195, 400, 'PUBLISHED', NOW(), NOW()),
('pc_x5_g05_b57', 'gen_bmw_x5_g05', 'eng_bmw_b57d30', 'tr_aut8', 'ALL', 195, 620, 'PUBLISHED', NOW(), NOW()),
('pc_z4_g29_b48', 'gen_bmw_z4_g29', 'eng_bmw_b48b20', 'tr_aut8', 'REAR', 145, 310, 'PUBLISHED', NOW(), NOW()),
('pc_z4_g29_b58', 'gen_bmw_z4_g29', 'eng_bmw_b58b30', 'tr_aut8', 'REAR', 285, 450, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- MERCEDES (bestehende Engines fuer fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_a_w177_m254', 'gen_mb_a_w177', 'eng_mb_m254', 'tr_dct7', 'FRONT', 120, 250, 'PUBLISHED', NOW(), NOW()),
('pc_c_w205_m254', 'gen_mb_c_w205', 'eng_mb_m254', 'tr_aut9', 'REAR', 150, 300, 'PUBLISHED', NOW(), NOW()),
('pc_c_w205_om654', 'gen_mb_c_w205', 'eng_mb_om654', 'tr_aut9', 'REAR', 147, 360, 'PUBLISHED', NOW(), NOW()),
('pc_cla_c118_m254', 'gen_mb_cla_c118', 'eng_mb_m254', 'tr_dct7', 'FRONT', 120, 250, 'PUBLISHED', NOW(), NOW()),
('pc_e_w213_m254', 'gen_mb_e_w213', 'eng_mb_m254', 'tr_aut9', 'REAR', 150, 300, 'PUBLISHED', NOW(), NOW()),
('pc_e_w213_m256', 'gen_mb_e_w213', 'eng_mb_m256', 'tr_aut9', 'REAR', 270, 500, 'PUBLISHED', NOW(), NOW()),
('pc_e_w214_m254', 'gen_mb_e_w214', 'eng_mb_m254', 'tr_aut9', 'REAR', 150, 300, 'PUBLISHED', NOW(), NOW()),
('pc_e_w214_m256', 'gen_mb_e_w214', 'eng_mb_m256', 'tr_aut9', 'ALL', 280, 520, 'PUBLISHED', NOW(), NOW()),
('pc_gla_h247_m254', 'gen_mb_gla_h247', 'eng_mb_m254', 'tr_dct7', 'FRONT', 120, 250, 'PUBLISHED', NOW(), NOW()),
('pc_glc_x254_m254', 'gen_mb_glc_x254', 'eng_mb_m254', 'tr_aut9', 'ALL', 150, 300, 'PUBLISHED', NOW(), NOW()),
('pc_glc_x254_om654', 'gen_mb_glc_x254', 'eng_mb_om654', 'tr_aut9', 'ALL', 147, 440, 'PUBLISHED', NOW(), NOW()),
('pc_gle_v167_m256', 'gen_mb_gle_v167', 'eng_mb_m256', 'tr_aut9', 'ALL', 270, 500, 'PUBLISHED', NOW(), NOW()),
('pc_s_w223_m256', 'gen_mb_s_w223', 'eng_mb_m256', 'tr_aut9', 'ALL', 280, 520, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- PORSCHE (fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_macan_95b_turbo', 'gen_por_macan_95b', 'eng_por_9a2evo', 'tr_dct7', 'ALL', 280, 520, 'PUBLISHED', NOW(), NOW()),
('pc_pana_971_turbo', 'gen_por_panamera_3', 'eng_por_9a2evo', 'tr_dct8', 'ALL', 353, 570, 'PUBLISHED', NOW(), NOW()),
('pc_cayenne_e3', 'gen_por_cayenne_e3', 'eng_por_9a2evo', 'tr_aut8', 'ALL', 260, 450, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- TESLA (fehlende Generation) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_ms_plaid', 'gen_ts_models_p', 'eng_ts_s_plaid', 'tr_red1', 'ALL', 760, 1420, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- TOYOTA (fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_yaris_xp210', 'gen_toy_yaris_xp210', 'eng_toy_m20afks', 'tr_cvt', 'FRONT', 85, 185, 'PUBLISHED', NOW(), NOW()),
('pc_supra_a90', 'gen_toy_supra_a90', 'eng_bmw_b58b30', 'tr_aut8', 'REAR', 285, 450, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- VOLKSWAGEN (fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_golf7_10tsi', 'gen_vw_golf7', 'eng_vw_ea211_10tsi', 'tr_man5', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_golf7_15tsi', 'gen_vw_golf7', 'eng_vw_ea211_15tsi', 'tr_man6', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_golf7_20tsi', 'gen_vw_golf7', 'eng_vw_ea888_20tsi', 'tr_dsg7', 'FRONT', 169, 350, 'PUBLISHED', NOW(), NOW()),
('pc_golf7_20tdi', 'gen_vw_golf7', 'eng_vw_ea288_20tdi', 'tr_man6', 'FRONT', 110, 340, 'PUBLISHED', NOW(), NOW()),
('pc_passb8_15tsi', 'gen_vw_passat_b8', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_passb8_20tdi', 'gen_vw_passat_b8', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'FRONT', 110, 340, 'PUBLISHED', NOW(), NOW()),
('pc_passb9_15tsi', 'gen_vw_passat_b9', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_passb9_20tdi', 'gen_vw_passat_b9', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'FRONT', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_polo_10tsi', 'gen_vw_polo_aw', 'eng_vw_ea211_10tsi', 'tr_man5', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_polo_15tsi', 'gen_vw_polo_aw', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_troc_10tsi', 'gen_vw_troc_a1', 'eng_vw_ea211_10tsi', 'tr_man6', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_troc_15tsi', 'gen_vw_troc_a1', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_troc_20tsi', 'gen_vw_troc_a1', 'eng_vw_ea888_20tsi', 'tr_dsg7', 'ALL', 140, 320, 'PUBLISHED', NOW(), NOW()),
('pc_tig3_15tsi', 'gen_vw_tiguan_3', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_tig3_20tdi', 'gen_vw_tiguan_3', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'ALL', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_touran_15tsi', 'gen_vw_touran_5t', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_touran_20tdi', 'gen_vw_touran_5t', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'FRONT', 110, 340, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- HYUNDAI (fehlende Generationen) ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_kona_16tgdi', 'gen_hy_kona_sz', 'eng_hy_smartstream16', 'tr_dct7', 'FRONT', 132, 265, 'PUBLISHED', NOW(), NOW()),
('pc_i20_10tgdi', 'gen_hy_i20_bc3', 'eng_hy_smartstream16', 'tr_dct7', 'FRONT', 88, 172, 'PUBLISHED', NOW(), NOW()),
('pc_i30_16tgdi', 'gen_hy_i30_pd', 'eng_hy_smartstream16', 'tr_dct7', 'FRONT', 132, 265, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- FORD ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_fiesta_mk8_eb10', 'gen_ford_fiesta_mk8', 'eng_ford_eb10', 'tr_man6', 'FRONT', 92, 170, 'PUBLISHED', NOW(), NOW()),
('pc_fiesta_mk8_eb15', 'gen_ford_fiesta_mk8', 'eng_ford_eb15', 'tr_man6', 'FRONT', 147, 290, 'PUBLISHED', NOW(), NOW()),
('pc_focus_mk4_eb10', 'gen_ford_focus_mk4', 'eng_ford_eb10', 'tr_man6', 'FRONT', 92, 170, 'PUBLISHED', NOW(), NOW()),
('pc_focus_mk4_eb15', 'gen_ford_focus_mk4', 'eng_ford_eb15', 'tr_aut8', 'FRONT', 110, 240, 'PUBLISHED', NOW(), NOW()),
('pc_kuga3_eb15', 'gen_ford_kuga_mk3', 'eng_ford_eb15', 'tr_man6', 'FRONT', 110, 240, 'PUBLISHED', NOW(), NOW()),
('pc_kuga3_phev', 'gen_ford_kuga_mk3', 'eng_ford_phev25', 'tr_cvt', 'FRONT', 165, 200, 'PUBLISHED', NOW(), NOW()),
('pc_kuga3_ecbl', 'gen_ford_kuga_mk3', 'eng_ford_ecbl20', 'tr_aut8', 'ALL', 140, 370, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- KIA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_sport_nq5_tgdi', 'gen_kia_sportage_nq5', 'eng_kia_tgdi16', 'tr_dct7', 'FRONT', 132, 265, 'PUBLISHED', NOW(), NOW()),
('pc_sport_nq5_phev', 'gen_kia_sportage_nq5', 'eng_kia_phev16', 'tr_aut6', 'ALL', 195, 350, 'PUBLISHED', NOW(), NOW()),
('pc_ceed_tgdi', 'gen_kia_ceed_cd', 'eng_kia_tgdi16', 'tr_dct7', 'FRONT', 132, 265, 'PUBLISHED', NOW(), NOW()),
('pc_ceed_crdi', 'gen_kia_ceed_cd', 'eng_kia_crdi16', 'tr_man6', 'FRONT', 100, 280, 'PUBLISHED', NOW(), NOW()),
('pc_niro_hev', 'gen_kia_niro_de3', 'eng_kia_hev16', 'tr_dsg6', 'FRONT', 104, 265, 'PUBLISHED', NOW(), NOW()),
('pc_niro_phev', 'gen_kia_niro_de3', 'eng_kia_phev16', 'tr_dsg6', 'FRONT', 135, 265, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- MAZDA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_cx5_sky20', 'gen_cx5_2', 'eng_maz_sky20g', 'tr_man6', 'FRONT', 121, 213, 'PUBLISHED', NOW(), NOW()),
('pc_cx5_sky25', 'gen_cx5_2', 'eng_maz_sky25', 'tr_aut6', 'ALL', 143, 252, 'PUBLISHED', NOW(), NOW()),
('pc_cx30_sky20', 'gen_cx30_1', 'eng_maz_sky20g', 'tr_man6', 'FRONT', 121, 213, 'PUBLISHED', NOW(), NOW()),
('pc_cx30_skyx', 'gen_cx30_1', 'eng_maz_skyx20', 'tr_aut6', 'FRONT', 137, 240, 'PUBLISHED', NOW(), NOW()),
('pc_mx5_sky20', 'gen_mx5_4', 'eng_maz_sky20g', 'tr_man6', 'REAR', 135, 205, 'PUBLISHED', NOW(), NOW()),
('pc_maz3_sky20', 'gen_mazda3_4', 'eng_maz_sky20g', 'tr_man6', 'FRONT', 121, 213, 'PUBLISHED', NOW(), NOW()),
('pc_maz3_skyx', 'gen_mazda3_4', 'eng_maz_skyx20', 'tr_aut6', 'FRONT', 137, 240, 'PUBLISHED', NOW(), NOW()),
('pc_maz2_sky15', 'gen_mazda2_4', 'eng_maz_sky20g', 'tr_man6', 'FRONT', 85, 148, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- VOLVO ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_xc60_b5p', 'gen_volvo_xc60_2', 'eng_volvo_b5p', 'tr_aut8', 'ALL', 184, 350, 'PUBLISHED', NOW(), NOW()),
('pc_xc60_b4d', 'gen_volvo_xc60_2', 'eng_volvo_b4d', 'tr_aut8', 'ALL', 145, 400, 'PUBLISHED', NOW(), NOW()),
('pc_xc60_t8', 'gen_volvo_xc60_2', 'eng_volvo_t8phev', 'tr_aut8', 'ALL', 290, 659, 'PUBLISHED', NOW(), NOW()),
('pc_v60_b4p', 'gen_v60_2', 'eng_volvo_b4p', 'tr_aut8', 'FRONT', 145, 300, 'PUBLISHED', NOW(), NOW()),
('pc_v60_b4d', 'gen_v60_2', 'eng_volvo_b4d', 'tr_aut8', 'FRONT', 145, 400, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- NISSAN ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_qash3_dig13', 'gen_qashqai_3', 'eng_nissan_dig13', 'tr_man6', 'FRONT', 116, 270, 'PUBLISHED', NOW(), NOW()),
('pc_qash3_epower', 'gen_qashqai_3', 'eng_nissan_epower', 'tr_cvt', 'FRONT', 140, 330, 'PUBLISHED', NOW(), NOW()),
('pc_juke2_dig13', 'gen_juke_2', 'eng_nissan_dig13', 'tr_dct7', 'FRONT', 84, 200, 'PUBLISHED', NOW(), NOW()),
('pc_leaf2_em57', 'gen_leaf_2', 'eng_nissan_em57', 'tr_red1', 'FRONT', 110, 320, 'PUBLISHED', NOW(), NOW()),
('pc_ariya_ev', 'gen_ariya_1', 'eng_nissan_ariya_e', 'tr_red1', 'FRONT', 178, 300, 'PUBLISHED', NOW(), NOW()),
('pc_xtrl4_epower', 'gen_xtrail_4', 'eng_nissan_epower', 'tr_cvt', 'FRONT', 150, 330, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- OPEL ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_astra_l_pt12', 'gen_opel_astra_l', 'eng_opel_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_astra_l_bhdi', 'gen_opel_astra_l', 'eng_opel_bhdi15', 'tr_aut8', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()),
('pc_astra_l_ev', 'gen_opel_astra_l', 'eng_opel_ev136', 'tr_red1', 'FRONT', 100, 260, 'PUBLISHED', NOW(), NOW()),
('pc_mokka2_pt12', 'gen_opel_mokka_2', 'eng_opel_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_mokka2_ev', 'gen_opel_mokka_2', 'eng_opel_ev136', 'tr_red1', 'FRONT', 100, 260, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- PEUGEOT ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_208_pt12', 'gen_208_2', 'eng_peug_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_208_bhdi', 'gen_208_2', 'eng_peug_bhdi15', 'tr_aut8', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()),
('pc_2008_pt12', 'gen_2008_2', 'eng_peug_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_3008_pt12', 'gen_3008_2', 'eng_peug_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_3008_phev', 'gen_3008_2', 'eng_peug_phev', 'tr_aut8', 'FRONT', 165, 360, 'PUBLISHED', NOW(), NOW()),
('pc_5008_pt12', 'gen_5008_2', 'eng_peug_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_5008_bhdi', 'gen_5008_2', 'eng_peug_bhdi15', 'tr_aut8', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- CITROEN ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_c3_pt12', 'gen_c3_3', 'eng_citr_pt12', 'tr_man6', 'FRONT', 81, 205, 'PUBLISHED', NOW(), NOW()),
('pc_c4_pt12', 'gen_c4_3', 'eng_citr_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_c4_bhdi', 'gen_c4_3', 'eng_citr_bhdi15', 'tr_aut8', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()),
('pc_c4x_pt12', 'gen_c4x_1', 'eng_citr_pt12', 'tr_man6', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_c5ac_pt12', 'gen_c5air_1', 'eng_citr_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_c5ac_bhdi20', 'gen_c5air_1', 'eng_citr_bhdi20', 'tr_aut8', 'FRONT', 130, 400, 'PUBLISHED', NOW(), NOW()),
('pc_berl3_pt12', 'gen_berlingo_3', 'eng_citr_pt12', 'tr_man6', 'FRONT', 81, 205, 'PUBLISHED', NOW(), NOW()),
('pc_berl3_bhdi', 'gen_berlingo_3', 'eng_citr_bhdi15', 'tr_man6', 'FRONT', 96, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- DS AUTOMOBILES ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_ds3cb_pt12', 'gen_ds3cb_1', 'eng_ds_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_ds4_pt12', 'gen_ds4_2', 'eng_ds_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_ds4_phev', 'gen_ds4_2', 'eng_ds_phev16', 'tr_aut8', 'FRONT', 165, 360, 'PUBLISHED', NOW(), NOW()),
('pc_ds7_pt12', 'gen_ds7_1', 'eng_ds_pt12', 'tr_aut8', 'FRONT', 96, 230, 'PUBLISHED', NOW(), NOW()),
('pc_ds7_phev', 'gen_ds7_1', 'eng_ds_phev16', 'tr_aut8', 'ALL', 220, 520, 'PUBLISHED', NOW(), NOW()),
('pc_ds9_phev', 'gen_ds9_1', 'eng_ds_phev16', 'tr_aut8', 'FRONT', 165, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- DACIA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_duster3_tce10', 'gen_dacia_duster3', 'eng_dacia_tce10', 'tr_man6', 'FRONT', 67, 160, 'PUBLISHED', NOW(), NOW()),
('pc_duster3_tce13', 'gen_dacia_duster3', 'eng_dacia_tce13', 'tr_man6', 'ALL', 96, 240, 'PUBLISHED', NOW(), NOW()),
('pc_duster3_hev', 'gen_dacia_duster3', 'eng_dacia_hev14', 'tr_cvt', 'FRONT', 103, 205, 'PUBLISHED', NOW(), NOW()),
('pc_sandero3_tce10', 'gen_dacia_sandero3', 'eng_dacia_tce10', 'tr_man5', 'FRONT', 67, 160, 'PUBLISHED', NOW(), NOW()),
('pc_sandero3_tce10a', 'gen_dacia_sandero3', 'eng_dacia_tce13', 'tr_cvt', 'FRONT', 96, 240, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- RENAULT ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_clio5_tce10', 'gen_ren_clio5', 'eng_ren_tce10', 'tr_man5', 'FRONT', 67, 160, 'PUBLISHED', NOW(), NOW()),
('pc_clio5_hev', 'gen_ren_clio5', 'eng_ren_hev16', 'tr_cvt', 'FRONT', 105, 205, 'PUBLISHED', NOW(), NOW()),
('pc_megane_ev', 'gen_ren_megane_ev', 'eng_ren_ev', 'tr_red1', 'FRONT', 160, 300, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- FIAT ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_500e_ev87', 'gen_500e_1', 'eng_fiat_ev_87', 'tr_red1', 'FRONT', 87, 220, 'PUBLISHED', NOW(), NOW()),
('pc_panda3_fire', 'gen_panda_3', 'eng_fiat_fire10', 'tr_man5', 'FRONT', 51, 92, 'PUBLISHED', NOW(), NOW()),
('pc_tipo2_fire13', 'gen_tipo_2', 'eng_fiat_fire13', 'tr_man6', 'FRONT', 110, 270, 'PUBLISHED', NOW(), NOW()),
('pc_ducato3_mj', 'gen_ducato_3', 'eng_fiat_mj23', 'tr_man6', 'FRONT', 103, 380, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- HONDA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_crv6_hev20', 'gen_crv_6', 'eng_honda_hev20', 'tr_cvt', 'ALL', 135, 315, 'PUBLISHED', NOW(), NOW()),
('pc_hrv3_hev15', 'gen_hrv_3', 'eng_honda_hev15', 'tr_cvt', 'FRONT', 96, 253, 'PUBLISHED', NOW(), NOW()),
('pc_hondae_ev', 'gen_hondae_1', 'eng_honda_ev', 'tr_red1', 'REAR', 113, 315, 'PUBLISHED', NOW(), NOW()),
('pc_jazz4_hev15', 'gen_jazz_4', 'eng_honda_hev15', 'tr_cvt', 'FRONT', 80, 253, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- MINI ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_coop_f56_one', 'gen_mini_cooper_f56', 'eng_mini_one', 'tr_man6', 'FRONT', 75, 190, 'PUBLISHED', NOW(), NOW()),
('pc_coop_f56_coop', 'gen_mini_cooper_f56', 'eng_mini_cooper', 'tr_man6', 'FRONT', 100, 220, 'PUBLISHED', NOW(), NOW()),
('pc_coop_f56_s', 'gen_mini_cooper_f56', 'eng_mini_coop_s', 'tr_aut7', 'FRONT', 141, 280, 'PUBLISHED', NOW(), NOW()),
('pc_country_f60', 'gen_mini_country_f60', 'eng_mini_cooper', 'tr_man6', 'FRONT', 100, 220, 'PUBLISHED', NOW(), NOW()),
('pc_country_f60_s', 'gen_mini_country_f60', 'eng_mini_coop_s', 'tr_aut8', 'ALL', 141, 280, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- CUPRA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_form_tsi15', 'gen_cupra_formentor1', 'eng_cupra_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_form_tsi20', 'gen_cupra_formentor1', 'eng_cupra_tsi20', 'tr_dsg7', 'ALL', 228, 400, 'PUBLISHED', NOW(), NOW()),
('pc_born_ev', 'gen_cupra_born1', 'eng_cupra_ev', 'tr_red1', 'REAR', 150, 310, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- SEAT ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_arona_tsi10', 'gen_arona_1', 'eng_seat_tsi10', 'tr_man5', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_arona_tsi15', 'gen_arona_1', 'eng_seat_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_ibiza_tsi10', 'gen_seat_ibiza_kj', 'eng_seat_tsi10', 'tr_man5', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_ibiza_tsi15', 'gen_seat_ibiza_kj', 'eng_seat_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ---- SKODA ----
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "powerKw", "torqueNm", status, "createdAt", "updatedAt") VALUES
('pc_fabia_tsi10', 'gen_sk_fabia_pj', 'eng_skoda_tsi10', 'tr_man5', 'FRONT', 81, 200, 'PUBLISHED', NOW(), NOW()),
('pc_fabia_tsi15', 'gen_sk_fabia_pj', 'eng_skoda_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_kodiaq_tsi15', 'gen_sk_kodiaq_ns', 'eng_skoda_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_kodiaq_tsi20', 'gen_sk_kodiaq_ns', 'eng_skoda_tsi20', 'tr_dsg7', 'ALL', 140, 320, 'PUBLISHED', NOW(), NOW()),
('pc_kodiaq_tdi20', 'gen_sk_kodiaq_ns', 'eng_skoda_tdi20', 'tr_dsg7', 'ALL', 110, 360, 'PUBLISHED', NOW(), NOW()),
('pc_super_tsi15', 'gen_sk_superb_3v', 'eng_skoda_tsi15', 'tr_dsg7', 'FRONT', 110, 250, 'PUBLISHED', NOW(), NOW()),
('pc_super_tsi20', 'gen_sk_superb_3v', 'eng_skoda_tsi20', 'tr_dsg7', 'FRONT', 140, 320, 'PUBLISHED', NOW(), NOW()),
('pc_super_tdi20', 'gen_sk_superb_3v', 'eng_skoda_tdi20', 'tr_dsg7', 'FRONT', 110, 360, 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

COMMIT;
