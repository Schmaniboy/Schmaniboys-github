-- seed-ausstattung-3.sql
-- TrimLines und OptionAvailability fuer alle verbleibenden 79 Generationen
-- Erstellt: 2026-08-26

BEGIN;

-- ============================================================
-- TEIL 1: TrimLine-Eintraege
-- ============================================================

-- ---- AUDI ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_a4b9_basis', 'gen_audi_a4_b9', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a4b9_sport', 'gen_audi_a4_b9', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a4b9_design', 'gen_audi_a4_b9', 'Design', 'design', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a4b9_sline', 'gen_audi_a4_b9', 'S line', 's-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_a5f5_basis', 'gen_audi_a5_f5', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a5f5_sport', 'gen_audi_a5_f5', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a5f5_adv',   'gen_audi_a5_f5', 'Advanced', 'advanced', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a5f5_sline', 'gen_audi_a5_f5', 'S line', 's-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_a6c8_basis', 'gen_audi_a6_c8', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a6c8_sport', 'gen_audi_a6_c8', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a6c8_design', 'gen_audi_a6_c8', 'Design', 'design', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_a6c8_sline', 'gen_audi_a6_c8', 'S line', 's-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_q3f3_basis', 'gen_audi_q3_f3', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_q3f3_adv',   'gen_audi_q3_f3', 'Advanced', 'advanced', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_q3f3_sline', 'gen_audi_q3_f3', 'S line', 's-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_q74m_basis', 'gen_audi_q7_4m', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_q74m_sport', 'gen_audi_q7_4m', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_q74m_sline', 'gen_audi_q7_4m', 'S line', 's-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_audi_etgt_basis', 'gen_audi_etron_j1', 'e-tron GT', 'e-tron-gt', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_audi_etgt_rs',    'gen_audi_etron_j1', 'RS e-tron GT', 'rs-e-tron-gt', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- BMW ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_1f40_adv',    'gen_bmw_1er_f40', 'Advantage', 'advantage', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_1f40_sport',  'gen_bmw_1er_f40', 'Sport Line', 'sport-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_1f40_msport', 'gen_bmw_1er_f40', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_2u06_sport',  'gen_bmw_2er_u06', 'Sport Line', 'sport-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_2u06_lux',    'gen_bmw_2er_u06', 'Luxury Line', 'luxury-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_2u06_msport', 'gen_bmw_2er_u06', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_3f30_se',     'gen_bmw_3er_f30', 'SE', 'se', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_3f30_sport',  'gen_bmw_3er_f30', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_3f30_lux',    'gen_bmw_3er_f30', 'Luxury', 'luxury', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_3f30_msport', 'gen_bmw_3er_f30', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_3e90_basis',  'gen_bmw_3er_e90', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_3e90_msport', 'gen_bmw_3er_e90', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_4g22_sport',  'gen_bmw_4er_g22', 'Sport Line', 'sport-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_4g22_lux',    'gen_bmw_4er_g22', 'Luxury Line', 'luxury-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_4g22_msport', 'gen_bmw_4er_g22', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_x1u11_xline', 'gen_bmw_x1_u11', 'xLine', 'xline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_x1u11_msport','gen_bmw_x1_u11', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_x5g05_xline', 'gen_bmw_x5_g05', 'xLine', 'xline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_x5g05_msport','gen_bmw_x5_g05', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_x5g05_msp_pr','gen_bmw_x5_g05', 'M Sport Pro', 'm-sport-pro', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_bmw_z4g29_sport', 'gen_bmw_z4_g29', 'Sport Line', 'sport-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_bmw_z4g29_msport','gen_bmw_z4_g29', 'M Sport', 'm-sport', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- CITROEN ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cit_berl_feel',  'gen_berlingo_3', 'Feel', 'feel', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_berl_shine', 'gen_berlingo_3', 'Shine', 'shine', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_berl_flair', 'gen_berlingo_3', 'Flair', 'flair', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cit_c3_feel',  'gen_c3_3', 'Feel', 'feel', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c3_shine', 'gen_c3_3', 'Shine', 'shine', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c3_flair', 'gen_c3_3', 'Flair', 'flair', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cit_c4_feel',  'gen_c4_3', 'Feel', 'feel', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c4_shine', 'gen_c4_3', 'Shine', 'shine', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c4_cserie','gen_c4_3', 'C-Series', 'c-series', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cit_c4x_feel',  'gen_c4x_1', 'Feel', 'feel', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c4x_shine', 'gen_c4x_1', 'Shine', 'shine', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cit_c5a_feel',  'gen_c5air_1', 'Feel', 'feel', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c5a_shine', 'gen_c5air_1', 'Shine', 'shine', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cit_c5a_cserie','gen_c5air_1', 'C-Series', 'c-series', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- CUPRA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_cup_born_v',  'gen_cupra_born1', 'V', 'v', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_cup_born_vz', 'gen_cupra_born1', 'VZ', 'vz', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- DS AUTOMOBILES ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ds_3cb_sochic', 'gen_ds3cb_1', 'So Chic', 'so-chic', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_3cb_perf',   'gen_ds3cb_1', 'Performance Line', 'performance-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_3cb_grand',  'gen_ds3cb_1', 'Grand Chic', 'grand-chic', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ds_4_perf',   'gen_ds4_2', 'Performance Line', 'performance-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_4_cross',  'gen_ds4_2', 'Cross', 'cross', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_4_rivoli', 'gen_ds4_2', 'Rivoli', 'rivoli', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ds_7_perf',    'gen_ds7_1', 'Performance Line', 'performance-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_7_grand',   'gen_ds7_1', 'Grand Chic', 'grand-chic', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_7_rivoli',  'gen_ds7_1', 'Rivoli', 'rivoli', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_7_premiere','gen_ds7_1', 'La Premiere', 'la-premiere', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ds_9_perf',    'gen_ds9_1', 'Performance Line', 'performance-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_9_rivoli',  'gen_ds9_1', 'Rivoli', 'rivoli', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ds_9_rivolipl','gen_ds9_1', 'Rivoli+', 'rivoli-plus', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- DACIA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_dac_sand_ess',  'gen_dacia_sandero3', 'Essential', 'essential', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_dac_sand_comf', 'gen_dacia_sandero3', 'Comfort', 'comfort', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_dac_sand_expr', 'gen_dacia_sandero3', 'Expression', 'expression', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_dac_sand_extr', 'gen_dacia_sandero3', 'Extreme', 'extreme', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- FIAT ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_fiat_500e_act',   'gen_500e_1', 'Action', 'action', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_500e_pass',  'gen_500e_1', 'Passion', 'passion', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_500e_icon',  'gen_500e_1', 'Icon', 'icon', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_500e_prima', 'gen_500e_1', 'La Prima', 'la-prima', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_fiat_duc_basis', 'gen_ducato_3', 'Basis', 'basis', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_duc_prof',  'gen_ducato_3', 'Professional', 'professional', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_fiat_panda_pop',    'gen_panda_3', 'Pop', 'pop', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_panda_lounge', 'gen_panda_3', 'Lounge', 'lounge', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_panda_cross',  'gen_panda_3', 'Cross', 'cross', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_panda_sport',  'gen_panda_3', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_fiat_tipo_pop',   'gen_tipo_2', 'Pop', 'pop', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_tipo_life',  'gen_tipo_2', 'Life', 'life', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_fiat_tipo_cross', 'gen_tipo_2', 'Cross', 'cross', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- FORD ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ford_fies_trend', 'gen_ford_fiesta_mk8', 'Trend', 'trend', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ford_fies_titan', 'gen_ford_fiesta_mk8', 'Titanium', 'titanium', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ford_fies_stline','gen_ford_fiesta_mk8', 'ST-Line', 'st-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ford_fies_st',    'gen_ford_fiesta_mk8', 'ST', 'st', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- HONDA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hon_crv_eleg', 'gen_crv_6', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_crv_adv',  'gen_crv_6', 'Advance', 'advance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_crv_life', 'gen_crv_6', 'Lifestyle', 'lifestyle', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hon_hrv_eleg', 'gen_hrv_3', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_hrv_adv',  'gen_hrv_3', 'Advance', 'advance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_hrv_sport','gen_hrv_3', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hon_he_base', 'gen_hondae_1', 'Honda e', 'honda-e', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_he_adv',  'gen_hondae_1', 'Honda e Advance', 'honda-e-advance', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hon_jazz_comf', 'gen_jazz_4', 'Comfort', 'comfort', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_jazz_eleg', 'gen_jazz_4', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_jazz_cross','gen_jazz_4', 'Crosstar', 'crosstar', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hon_jazz_exec', 'gen_jazz_4', 'Executive', 'executive', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- HYUNDAI ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hy_kona_sel',  'gen_hy_kona_sz', 'Select', 'select', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_kona_trend','gen_hy_kona_sz', 'Trend', 'trend', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_kona_style','gen_hy_kona_sz', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_kona_nline','gen_hy_kona_sz', 'N Line', 'n-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hy_i20_sel',   'gen_hy_i20_bc3', 'Select', 'select', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i20_trend', 'gen_hy_i20_bc3', 'Trend', 'trend', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i20_style', 'gen_hy_i20_bc3', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i20_nline', 'gen_hy_i20_bc3', 'N Line', 'n-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_hy_i30_sel',   'gen_hy_i30_pd', 'Select', 'select', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i30_trend', 'gen_hy_i30_pd', 'Trend', 'trend', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i30_style', 'gen_hy_i30_pd', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i30_nline', 'gen_hy_i30_pd', 'N Line', 'n-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_hy_i30_n',     'gen_hy_i30_pd', 'N', 'n', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- KIA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_kia_ceed_ed7',  'gen_kia_ceed_cd', 'Edition 7', 'edition-7', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_kia_ceed_spir', 'gen_kia_ceed_cd', 'Spirit', 'spirit', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_kia_ceed_plat', 'gen_kia_ceed_cd', 'Platinum', 'platinum', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_kia_ceed_gt',   'gen_kia_ceed_cd', 'GT-Line', 'gt-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_kia_niro_vis',  'gen_kia_niro_de3', 'Vision', 'vision', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_kia_niro_spir', 'gen_kia_niro_de3', 'Spirit', 'spirit', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_kia_niro_plat', 'gen_kia_niro_de3', 'Platinum', 'platinum', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- MAZDA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_maz_cx30_prime', 'gen_cx30_1', 'Prime-Line', 'prime-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_cx30_excl',  'gen_cx30_1', 'Exclusive-Line', 'exclusive-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_cx30_sel',   'gen_cx30_1', 'Selection', 'selection', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_maz_mx5_prime',  'gen_mx5_4', 'Prime-Line', 'prime-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_mx5_excl',   'gen_mx5_4', 'Exclusive-Line', 'exclusive-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_mx5_homura', 'gen_mx5_4', 'Homura', 'homura', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_maz_m2_prime',  'gen_mazda2_4', 'Prime-Line', 'prime-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_m2_excl',   'gen_mazda2_4', 'Exclusive-Line', 'exclusive-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_maz_m2_homura', 'gen_mazda2_4', 'Homura', 'homura', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- MERCEDES-BENZ ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_aw177_prog', 'gen_mb_a_w177', 'Progressive', 'progressive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_aw177_amg',  'gen_mb_a_w177', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_cw205_avant', 'gen_mb_c_w205', 'Avantgarde', 'avantgarde', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_cw205_excl',  'gen_mb_c_w205', 'Exclusive', 'exclusive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_cw205_amg',   'gen_mb_c_w205', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_clac118_prog', 'gen_mb_cla_c118', 'Progressive', 'progressive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_clac118_amg',  'gen_mb_cla_c118', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_ew213_avant', 'gen_mb_e_w213', 'Avantgarde', 'avantgarde', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_ew213_excl',  'gen_mb_e_w213', 'Exclusive', 'exclusive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_ew213_amg',   'gen_mb_e_w213', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_glah247_prog', 'gen_mb_gla_h247', 'Progressive', 'progressive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_glah247_amg',  'gen_mb_gla_h247', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_glev167_excl', 'gen_mb_gle_v167', 'Exclusive', 'exclusive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_glev167_amg',  'gen_mb_gle_v167', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mb_sw223_excl', 'gen_mb_s_w223', 'Exclusive', 'exclusive', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mb_sw223_amg',  'gen_mb_s_w223', 'AMG Line', 'amg-line', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- MINI ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mini_f56_classic','gen_mini_cooper_f56', 'Classic', 'classic', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f56_salt',   'gen_mini_cooper_f56', 'Salt', 'salt', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f56_pepper', 'gen_mini_cooper_f56', 'Pepper', 'pepper', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f56_chili',  'gen_mini_cooper_f56', 'Chili', 'chili', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_mini_f60_classic','gen_mini_country_f60', 'Classic', 'classic', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f60_salt',   'gen_mini_country_f60', 'Salt', 'salt', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f60_pepper', 'gen_mini_country_f60', 'Pepper', 'pepper', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_mini_f60_chili',  'gen_mini_country_f60', 'Chili', 'chili', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- NISSAN ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_nis_ariya_adv',  'gen_ariya_1', 'Advance', 'advance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_ariya_evol', 'gen_ariya_1', 'Evolve', 'evolve', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_ariya_evolp','gen_ariya_1', 'Evolve+', 'evolve-plus', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_nis_juke_vis',  'gen_juke_2', 'Visia', 'visia', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_juke_acen', 'gen_juke_2', 'Acenta', 'acenta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_juke_ncon', 'gen_juke_2', 'N-Connecta', 'n-connecta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_juke_tekn', 'gen_juke_2', 'Tekna', 'tekna', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_nis_leaf_vis',  'gen_leaf_2', 'Visia', 'visia', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_leaf_acen', 'gen_leaf_2', 'Acenta', 'acenta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_leaf_ncon', 'gen_leaf_2', 'N-Connecta', 'n-connecta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_leaf_tekn', 'gen_leaf_2', 'Tekna', 'tekna', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_nis_xt_vis',  'gen_xtrail_4', 'Visia', 'visia', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_xt_acen', 'gen_xtrail_4', 'Acenta', 'acenta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_xt_ncon', 'gen_xtrail_4', 'N-Connecta', 'n-connecta', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_nis_xt_tekn', 'gen_xtrail_4', 'Tekna', 'tekna', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- OPEL ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_opel_mokka_ed',  'gen_opel_mokka_2', 'Edition', 'edition', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_opel_mokka_eleg','gen_opel_mokka_2', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_opel_mokka_gs',  'gen_opel_mokka_2', 'GS Line', 'gs-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_opel_mokka_ult', 'gen_opel_mokka_2', 'Ultimate', 'ultimate', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- PEUGEOT ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_pgt_2008_act',  'gen_2008_2', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_2008_all',  'gen_2008_2', 'Allure', 'allure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_2008_gtl',  'gen_2008_2', 'GT Line', 'gt-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_2008_gt',   'gen_2008_2', 'GT', 'gt', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_pgt_208_act',  'gen_208_2', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_208_all',  'gen_208_2', 'Allure', 'allure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_208_gtl',  'gen_208_2', 'GT Line', 'gt-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_208_gt',   'gen_208_2', 'GT', 'gt', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_pgt_5008_act',  'gen_5008_2', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_5008_all',  'gen_5008_2', 'Allure', 'allure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_5008_gtl',  'gen_5008_2', 'GT Line', 'gt-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_pgt_5008_gt',   'gen_5008_2', 'GT', 'gt', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- PORSCHE ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_por_mac_base',  'gen_por_macan_95b', 'Macan', 'macan', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_mac_s',     'gen_por_macan_95b', 'Macan S', 'macan-s', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_mac_gts',   'gen_por_macan_95b', 'Macan GTS', 'macan-gts', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_mac_turbo', 'gen_por_macan_95b', 'Macan Turbo', 'macan-turbo', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_por_pan_base',  'gen_por_panamera_3', 'Panamera', 'panamera', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_pan_4s',    'gen_por_panamera_3', 'Panamera 4S', 'panamera-4s', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_pan_gts',   'gen_por_panamera_3', 'Panamera GTS', 'panamera-gts', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_pan_turbo', 'gen_por_panamera_3', 'Panamera Turbo', 'panamera-turbo', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_pan_turbs', 'gen_por_panamera_3', 'Panamera Turbo S', 'panamera-turbo-s', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_por_tayc_base',  'gen_por_taycan_y1a', 'Taycan', 'taycan', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_tayc_4s',    'gen_por_taycan_y1a', 'Taycan 4S', 'taycan-4s', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_tayc_gts',   'gen_por_taycan_y1a', 'Taycan GTS', 'taycan-gts', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_tayc_turbo', 'gen_por_taycan_y1a', 'Taycan Turbo', 'taycan-turbo', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_por_tayc_turbs', 'gen_por_taycan_y1a', 'Taycan Turbo S', 'taycan-turbo-s', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- RENAULT ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ren_megev_equi',  'gen_ren_megane_ev', 'Equilibre', 'equilibre', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ren_megev_tech',  'gen_ren_megane_ev', 'Techno', 'techno', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_ren_megev_icon',  'gen_ren_megane_ev', 'Iconic', 'iconic', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- SEAT ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_seat_arona_style', 'gen_arona_1', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_seat_arona_xcel',  'gen_arona_1', 'Xcellence', 'xcellence', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_seat_arona_fr',    'gen_arona_1', 'FR', 'fr', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_seat_ibiza_style', 'gen_seat_ibiza_kj', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_seat_ibiza_xcel',  'gen_seat_ibiza_kj', 'Xcellence', 'xcellence', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_seat_ibiza_fr',    'gen_seat_ibiza_kj', 'FR', 'fr', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- SKODA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_sk_fab_active',  'gen_sk_fabia_pj', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_fab_ambit',   'gen_sk_fabia_pj', 'Ambition', 'ambition', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_fab_style',   'gen_sk_fabia_pj', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_fab_monte',   'gen_sk_fabia_pj', 'Monte Carlo', 'monte-carlo', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_sk_kod_active', 'gen_sk_kodiaq_ns', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_kod_ambit',  'gen_sk_kodiaq_ns', 'Ambition', 'ambition', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_kod_style',  'gen_sk_kodiaq_ns', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_kod_lk',     'gen_sk_kodiaq_ns', 'L&K', 'lk', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_kod_sport',  'gen_sk_kodiaq_ns', 'Sportline', 'sportline', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_sk_sup_active', 'gen_sk_superb_3v', 'Active', 'active', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_sup_ambit',  'gen_sk_superb_3v', 'Ambition', 'ambition', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_sup_style',  'gen_sk_superb_3v', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_sup_lk',     'gen_sk_superb_3v', 'L&K', 'lk', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_sk_sup_sport',  'gen_sk_superb_3v', 'Sportline', 'sportline', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- TESLA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_ts_modsp_plaid', 'gen_ts_models_p', 'Plaid', 'plaid', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- TOYOTA ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_toy_supra_pure',  'gen_toy_supra_a90', 'Pure', 'pure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_supra_fuji',  'gen_toy_supra_a90', 'Fuji Speedway', 'fuji-speedway', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_toy_rav4_comf',  'gen_toy_rav4_xa50', 'Comfort', 'comfort', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_rav4_club',  'gen_toy_rav4_xa50', 'Club', 'club', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_rav4_lounge','gen_toy_rav4_xa50', 'Lounge', 'lounge', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_rav4_adv',   'gen_toy_rav4_xa50', 'Adventure', 'adventure', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_toy_yaris_comf',    'gen_toy_yaris_xp210', 'Comfort', 'comfort', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_yaris_club',    'gen_toy_yaris_xp210', 'Club', 'club', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_toy_yaris_premiere','gen_toy_yaris_xp210', 'Premiere', 'premiere', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- VOLKSWAGEN ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_golf7_trend', 'gen_vw_golf7', 'Trendline', 'trendline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_golf7_comf',  'gen_vw_golf7', 'Comfortline', 'comfortline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_golf7_high',  'gen_vw_golf7', 'Highline', 'highline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_golf7_gti',   'gen_vw_golf7', 'GTI', 'gti', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_golf7_gtd',   'gen_vw_golf7', 'GTD', 'gtd', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_golf7_r',     'gen_vw_golf7', 'R', 'r', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_id3_pure',  'gen_vw_id3_e1', 'Pure', 'pure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id3_pro',   'gen_vw_id3_e1', 'Pro', 'pro', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id3_pros',  'gen_vw_id3_e1', 'Pro S', 'pro-s', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id3_gtx',   'gen_vw_id3_e1', 'GTX', 'gtx', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_id4_pure',  'gen_vw_id4_e2', 'Pure', 'pure', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id4_pro',   'gen_vw_id4_e2', 'Pro', 'pro', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id4_pros',  'gen_vw_id4_e2', 'Pro S', 'pro-s', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_id4_gtx',   'gen_vw_id4_e2', 'GTX', 'gtx', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_pass_trend', 'gen_vw_passat_b8', 'Trendline', 'trendline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_pass_comf',  'gen_vw_passat_b8', 'Comfortline', 'comfortline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_pass_high',  'gen_vw_passat_b8', 'Highline', 'highline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_pass_eleg',  'gen_vw_passat_b8', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_pass_rline', 'gen_vw_passat_b8', 'R-Line', 'r-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_polo_trend', 'gen_vw_polo_aw', 'Trendline', 'trendline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_polo_comf',  'gen_vw_polo_aw', 'Comfortline', 'comfortline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_polo_high',  'gen_vw_polo_aw', 'Highline', 'highline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_polo_rline', 'gen_vw_polo_aw', 'R-Line', 'r-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_polo_gti',   'gen_vw_polo_aw', 'GTI', 'gti', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_troc_style', 'gen_vw_troc_a1', 'Style', 'style', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_troc_design','gen_vw_troc_a1', 'Design', 'design', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_troc_rline', 'gen_vw_troc_a1', 'R-Line', 'r-line', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_troc_sport', 'gen_vw_troc_a1', 'Sport', 'sport', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_troc_r',     'gen_vw_troc_a1', 'R', 'r', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_tig3_life',  'gen_vw_tiguan_3', 'Life', 'life', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_tig3_eleg',  'gen_vw_tiguan_3', 'Elegance', 'elegance', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_tig3_rline', 'gen_vw_tiguan_3', 'R-Line', 'r-line', NULL, 'PUBLISHED', NOW(), NOW());

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vw_tour_trend', 'gen_vw_touran_5t', 'Trendline', 'trendline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_tour_comf',  'gen_vw_touran_5t', 'Comfortline', 'comfortline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_tour_high',  'gen_vw_touran_5t', 'Highline', 'highline', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vw_tour_rline', 'gen_vw_touran_5t', 'R-Line', 'r-line', NULL, 'PUBLISHED', NOW(), NOW());

-- ---- VOLVO ----

INSERT INTO "TrimLine" (id, "generationId", name, slug, description, status, "createdAt", "updatedAt") VALUES
('tl_vol_v60_core',  'gen_v60_2', 'Core', 'core', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vol_v60_plus',  'gen_v60_2', 'Plus', 'plus', NULL, 'PUBLISHED', NOW(), NOW()),
('tl_vol_v60_ult',   'gen_v60_2', 'Ultimate', 'ultimate', NULL, 'PUBLISHED', NOW(), NOW());

-- ============================================================
-- TEIL 2: OptionAvailability-Eintraege
-- ============================================================

-- ---- AUDI: 11 options, 6 generations ----
-- Sitzheizung = STANDARD bei Audi (ab Sport), Rest OPTIONAL

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_a4b9_shz', 'opt_audi_shz', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_skuehl', 'opt_audi_skuehl', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_pano', 'opt_audi_pano', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_matrix', 'opt_audi_matrix', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_bang', 'opt_audi_bang', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_hud', 'opt_audi_hud', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_virtcp', 'opt_audi_virtcp', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_assist', 'opt_audi_assist', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_ahk', 'opt_audi_ahk', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_standheiz', 'opt_audi_standheiz', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a4b9_luftfed', 'opt_audi_luftfed', 'gen_audi_a4_b9', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_a5f5_shz', 'opt_audi_shz', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_skuehl', 'opt_audi_skuehl', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_pano', 'opt_audi_pano', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_matrix', 'opt_audi_matrix', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_bang', 'opt_audi_bang', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_hud', 'opt_audi_hud', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_virtcp', 'opt_audi_virtcp', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_assist', 'opt_audi_assist', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_ahk', 'opt_audi_ahk', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a5f5_standheiz', 'opt_audi_standheiz', 'gen_audi_a5_f5', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_a6c8_shz', 'opt_audi_shz', 'gen_audi_a6_c8', 'STANDARD', NULL, NOW(), NOW()),
('oa_a6c8_skuehl', 'opt_audi_skuehl', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_pano', 'opt_audi_pano', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_matrix', 'opt_audi_matrix', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_bang', 'opt_audi_bang', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_hud', 'opt_audi_hud', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_virtcp', 'opt_audi_virtcp', 'gen_audi_a6_c8', 'STANDARD', NULL, NOW(), NOW()),
('oa_a6c8_assist', 'opt_audi_assist', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_ahk', 'opt_audi_ahk', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_standheiz', 'opt_audi_standheiz', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a6c8_luftfed', 'opt_audi_luftfed', 'gen_audi_a6_c8', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_q3f3_shz', 'opt_audi_shz', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_pano', 'opt_audi_pano', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_matrix', 'opt_audi_matrix', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_bang', 'opt_audi_bang', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_hud', 'opt_audi_hud', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_virtcp', 'opt_audi_virtcp', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_ahk', 'opt_audi_ahk', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q3f3_standheiz', 'opt_audi_standheiz', 'gen_audi_q3_f3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_q74m_shz', 'opt_audi_shz', 'gen_audi_q7_4m', 'STANDARD', NULL, NOW(), NOW()),
('oa_q74m_skuehl', 'opt_audi_skuehl', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_pano', 'opt_audi_pano', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_matrix', 'opt_audi_matrix', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_bang', 'opt_audi_bang', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_hud', 'opt_audi_hud', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_virtcp', 'opt_audi_virtcp', 'gen_audi_q7_4m', 'STANDARD', NULL, NOW(), NOW()),
('oa_q74m_assist', 'opt_audi_assist', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_ahk', 'opt_audi_ahk', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_standheiz', 'opt_audi_standheiz', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q74m_luftfed', 'opt_audi_luftfed', 'gen_audi_q7_4m', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_etgt_shz', 'opt_audi_shz', 'gen_audi_etron_j1', 'STANDARD', NULL, NOW(), NOW()),
('oa_etgt_skuehl', 'opt_audi_skuehl', 'gen_audi_etron_j1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_etgt_pano', 'opt_audi_pano', 'gen_audi_etron_j1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_etgt_matrix', 'opt_audi_matrix', 'gen_audi_etron_j1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_etgt_bang', 'opt_audi_bang', 'gen_audi_etron_j1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_etgt_hud', 'opt_audi_hud', 'gen_audi_etron_j1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_etgt_luftfed', 'opt_audi_luftfed', 'gen_audi_etron_j1', 'STANDARD', NULL, NOW(), NOW());

-- ---- BMW: 14 options (incl. WLAN), 8 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_1f40_shz', 'opt_bmw_shz', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_1f40_pano', 'opt_bmw_pano', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_1f40_harman', 'opt_bmw_harman', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_1f40_hud', 'opt_bmw_hud', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_1f40_drivas', 'opt_bmw_drivas', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_1f40_parkass', 'opt_bmw_parkass', 'gen_bmw_1er_f40', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_2u06_shz', 'opt_bmw_shz', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2u06_pano', 'opt_bmw_pano', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2u06_harman', 'opt_bmw_harman', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2u06_hud', 'opt_bmw_hud', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2u06_drivas', 'opt_bmw_drivas', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2u06_leder', 'opt_bmw_leder', 'gen_bmw_2er_u06', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_3f30_shz', 'opt_bmw_shz', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_pano', 'opt_bmw_pano', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_harman', 'opt_bmw_harman', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_hud', 'opt_bmw_hud', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_leder', 'opt_bmw_leder', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_standheiz', 'opt_bmw_standheiz', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3f30_ahk', 'opt_bmw_ahk', 'gen_bmw_3er_f30', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_3e90_shz', 'opt_bmw_shz', 'gen_bmw_3er_e90', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3e90_pano', 'opt_bmw_pano', 'gen_bmw_3er_e90', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3e90_leder', 'opt_bmw_leder', 'gen_bmw_3er_e90', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_3e90_standheiz', 'opt_bmw_standheiz', 'gen_bmw_3er_e90', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_4g22_shz', 'opt_bmw_shz', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_pano', 'opt_bmw_pano', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_harman', 'opt_bmw_harman', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_hud', 'opt_bmw_hud', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_laser', 'opt_bmw_laser', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_leder', 'opt_bmw_leder', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_4g22_drivas', 'opt_bmw_drivas', 'gen_bmw_4er_g22', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_x1u11_shz', 'opt_bmw_shz', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x1u11_pano', 'opt_bmw_pano', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x1u11_harman', 'opt_bmw_harman', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x1u11_hud', 'opt_bmw_hud', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x1u11_drivas', 'opt_bmw_drivas', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x1u11_ahk', 'opt_bmw_ahk', 'gen_bmw_x1_u11', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_x5g05_shz', 'opt_bmw_shz', 'gen_bmw_x5_g05', 'STANDARD', NULL, NOW(), NOW()),
('oa_x5g05_shz_h', 'opt_bmw_shz_hint', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_skuehl', 'opt_bmw_skuehl', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_pano', 'opt_bmw_pano', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_harman', 'opt_bmw_harman', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_hud', 'opt_bmw_hud', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_laser', 'opt_bmw_laser', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_leder', 'opt_bmw_leder', 'gen_bmw_x5_g05', 'STANDARD', NULL, NOW(), NOW()),
('oa_x5g05_adapt', 'opt_bmw_adapt_fahr', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_drivas', 'opt_bmw_drivas', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_ahk', 'opt_bmw_ahk', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x5g05_standheiz', 'opt_bmw_standheiz', 'gen_bmw_x5_g05', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_z4g29_shz', 'opt_bmw_shz', 'gen_bmw_z4_g29', 'STANDARD', NULL, NOW(), NOW()),
('oa_z4g29_harman', 'opt_bmw_harman', 'gen_bmw_z4_g29', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_z4g29_hud', 'opt_bmw_hud', 'gen_bmw_z4_g29', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_z4g29_leder', 'opt_bmw_leder', 'gen_bmw_z4_g29', 'STANDARD', NULL, NOW(), NOW()),
('oa_z4g29_adapt', 'opt_bmw_adapt_fahr', 'gen_bmw_z4_g29', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- CITROEN: 4 options, 5 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_berl3_shz', 'opt_cit_shz', 'gen_berlingo_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_berl3_ahk', 'opt_cit_ahk', 'gen_berlingo_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_c33_shz', 'opt_cit_shz', 'gen_c3_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_c43_shz', 'opt_cit_shz', 'gen_c4_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c43_pano', 'opt_cit_pano', 'gen_c4_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c43_advcomf', 'opt_cit_advcomf', 'gen_c4_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_c4x1_shz', 'opt_cit_shz', 'gen_c4x_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c4x1_advcomf', 'opt_cit_advcomf', 'gen_c4x_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_c5a1_shz', 'opt_cit_shz', 'gen_c5air_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c5a1_pano', 'opt_cit_pano', 'gen_c5air_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c5a1_ahk', 'opt_cit_ahk', 'gen_c5air_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_c5a1_advcomf', 'opt_cit_advcomf', 'gen_c5air_1', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- CUPRA: 6 options, Born gen1 ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_born1_shz', 'opt_cup_shz', 'gen_cupra_born1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_born1_pano', 'opt_cup_pano', 'gen_cupra_born1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_born1_beats', 'opt_cup_beats', 'gen_cupra_born1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_born1_hud', 'opt_cup_hud', 'gen_cupra_born1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_born1_matrix', 'opt_cup_matrix', 'gen_cupra_born1', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- DS AUTOMOBILES: 6 options, 4 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ds3cb_shz', 'opt_ds_shz', 'gen_ds3cb_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds3cb_matrix', 'opt_ds_matrix', 'gen_ds3cb_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds3cb_focal', 'opt_ds_focal', 'gen_ds3cb_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ds42_shz', 'opt_ds_shz', 'gen_ds4_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds42_pano', 'opt_ds_pano', 'gen_ds4_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds42_matrix', 'opt_ds_matrix', 'gen_ds4_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds42_focal', 'opt_ds_focal', 'gen_ds4_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds42_nightvis', 'opt_ds_nightvis', 'gen_ds4_2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ds71_shz', 'opt_ds_shz', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds71_massage', 'opt_ds_skuehl', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds71_pano', 'opt_ds_pano', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds71_matrix', 'opt_ds_matrix', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds71_focal', 'opt_ds_focal', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds71_nightvis', 'opt_ds_nightvis', 'gen_ds7_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ds91_shz', 'opt_ds_shz', 'gen_ds9_1', 'STANDARD', NULL, NOW(), NOW()),
('oa_ds91_massage', 'opt_ds_skuehl', 'gen_ds9_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds91_pano', 'opt_ds_pano', 'gen_ds9_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds91_matrix', 'opt_ds_matrix', 'gen_ds9_1', 'STANDARD', NULL, NOW(), NOW()),
('oa_ds91_focal', 'opt_ds_focal', 'gen_ds9_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ds91_nightvis', 'opt_ds_nightvis', 'gen_ds9_1', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- DACIA: 4 options, Sandero III ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_sand3_shz', 'opt_dac_shz', 'gen_dacia_sandero3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sand3_klima', 'opt_dac_klima_auto', 'gen_dacia_sandero3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sand3_navi', 'opt_dac_navi', 'gen_dacia_sandero3', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- FIAT: 4 options, 4 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_500e_shz', 'opt_fiat_shz', 'gen_500e_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_500e_pano', 'opt_fiat_pano', 'gen_500e_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_500e_jbl', 'opt_fiat_beats', 'gen_500e_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_duc3_shz', 'opt_fiat_shz', 'gen_ducato_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_duc3_ahk', 'opt_fiat_ahk', 'gen_ducato_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_panda3_shz', 'opt_fiat_shz', 'gen_panda_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_tipo2_shz', 'opt_fiat_shz', 'gen_tipo_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tipo2_pano', 'opt_fiat_pano', 'gen_tipo_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tipo2_ahk', 'opt_fiat_ahk', 'gen_tipo_2', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- FORD: 8 options, Fiesta Mk8 ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_fies8_shz', 'opt_ford_shz', 'gen_ford_fiesta_mk8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_fies8_bo', 'opt_ford_bo', 'gen_ford_fiesta_mk8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_fies8_matrix', 'opt_ford_matrix', 'gen_ford_fiesta_mk8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_fies8_parkass', 'opt_ford_parkass', 'gen_ford_fiesta_mk8', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- HONDA: 6 options, 4 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_crv6_shz', 'opt_hon_shz', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_crv6_pano', 'opt_hon_pano', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_crv6_bose', 'opt_hon_bose', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_crv6_leder', 'opt_hon_leder', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_crv6_hud', 'opt_hon_hud', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_crv6_ahk', 'opt_hon_ahk', 'gen_crv_6', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_hrv3_shz', 'opt_hon_shz', 'gen_hrv_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_hrv3_pano', 'opt_hon_pano', 'gen_hrv_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_hrv3_bose', 'opt_hon_bose', 'gen_hrv_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_hrv3_leder', 'opt_hon_leder', 'gen_hrv_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_he1_shz', 'opt_hon_shz', 'gen_hondae_1', 'STANDARD', NULL, NOW(), NOW()),
('oa_he1_bose', 'opt_hon_bose', 'gen_hondae_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_jazz4_shz', 'opt_hon_shz', 'gen_jazz_4', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- HYUNDAI: 8 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_konasz_shz', 'opt_hy_shz', 'gen_hy_kona_sz', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_konasz_pano', 'opt_hy_pano', 'gen_hy_kona_sz', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_konasz_bose', 'opt_hy_bose', 'gen_hy_kona_sz', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_konasz_hud', 'opt_hy_hud', 'gen_hy_kona_sz', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_konasz_shz_h', 'opt_hy_shz_hint', 'gen_hy_kona_sz', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_i20bc3_shz', 'opt_hy_shz', 'gen_hy_i20_bc3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i20bc3_pano', 'opt_hy_pano', 'gen_hy_i20_bc3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i20bc3_bose', 'opt_hy_bose', 'gen_hy_i20_bc3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_i30pd_shz', 'opt_hy_shz', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i30pd_pano', 'opt_hy_pano', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i30pd_bose', 'opt_hy_bose', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i30pd_hud', 'opt_hy_hud', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i30pd_shz_h', 'opt_hy_shz_hint', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_i30pd_skuehl', 'opt_hy_skuehl', 'gen_hy_i30_pd', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- KIA: 8 options, 2 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ceedcd_shz', 'opt_kia_shz', 'gen_kia_ceed_cd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ceedcd_pano', 'opt_kia_pano', 'gen_kia_ceed_cd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ceedcd_harman', 'opt_kia_harman', 'gen_kia_ceed_cd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ceedcd_matrix', 'opt_kia_matrix', 'gen_kia_ceed_cd', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ceedcd_ahk', 'opt_kia_ahk', 'gen_kia_ceed_cd', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_nirode3_shz', 'opt_kia_shz', 'gen_kia_niro_de3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_nirode3_pano', 'opt_kia_pano', 'gen_kia_niro_de3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_nirode3_harman', 'opt_kia_harman', 'gen_kia_niro_de3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_nirode3_hud', 'opt_kia_hud', 'gen_kia_niro_de3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_nirode3_v2l', 'opt_kia_v2l', 'gen_kia_niro_de3', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- MAZDA: 7 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_cx30_shz', 'opt_maz_shz', 'gen_cx30_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cx30_bose', 'opt_maz_bose', 'gen_cx30_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cx30_hud', 'opt_maz_hud', 'gen_cx30_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cx30_leder', 'opt_maz_leder', 'gen_cx30_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cx30_matrix', 'opt_maz_matrix', 'gen_cx30_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_mx54_shz', 'opt_maz_shz', 'gen_mx5_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mx54_bose', 'opt_maz_bose', 'gen_mx5_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mx54_leder', 'opt_maz_leder', 'gen_mx5_4', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_m24_shz', 'opt_maz_shz', 'gen_mazda2_4', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- MERCEDES-BENZ: 12 options, 7 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_aw177_shz', 'opt_mb_shz', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_aw177_pano', 'opt_mb_pano', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_aw177_burmester', 'opt_mb_burmester', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_aw177_multibeam', 'opt_mb_multibeam', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_aw177_ambi', 'opt_mb_ambilicht', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_aw177_distronic', 'opt_mb_distronic', 'gen_mb_a_w177', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_cw205_shz', 'opt_mb_shz', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_pano', 'opt_mb_pano', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_burmester', 'opt_mb_burmester', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_hud', 'opt_mb_hud', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_multibeam', 'opt_mb_multibeam', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_distronic', 'opt_mb_distronic', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_ahk', 'opt_mb_ahk', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_cw205_standheiz', 'opt_mb_standheiz', 'gen_mb_c_w205', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_clac118_shz', 'opt_mb_shz', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clac118_pano', 'opt_mb_pano', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clac118_burmester', 'opt_mb_burmester', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clac118_multibeam', 'opt_mb_multibeam', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clac118_ambi', 'opt_mb_ambilicht', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clac118_distronic', 'opt_mb_distronic', 'gen_mb_cla_c118', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ew213_shz', 'opt_mb_shz', 'gen_mb_e_w213', 'STANDARD', NULL, NOW(), NOW()),
('oa_ew213_skuehl', 'opt_mb_skuehl', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_pano', 'opt_mb_pano', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_burmester', 'opt_mb_burmester', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_hud', 'opt_mb_hud', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_multibeam', 'opt_mb_multibeam', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_distronic', 'opt_mb_distronic', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_360cam', 'opt_mb_360cam', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_ahk', 'opt_mb_ahk', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ew213_standheiz', 'opt_mb_standheiz', 'gen_mb_e_w213', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_glah247_shz', 'opt_mb_shz', 'gen_mb_gla_h247', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glah247_pano', 'opt_mb_pano', 'gen_mb_gla_h247', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glah247_burmester', 'opt_mb_burmester', 'gen_mb_gla_h247', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glah247_multibeam', 'opt_mb_multibeam', 'gen_mb_gla_h247', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glah247_distronic', 'opt_mb_distronic', 'gen_mb_gla_h247', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_glev167_shz', 'opt_mb_shz', 'gen_mb_gle_v167', 'STANDARD', NULL, NOW(), NOW()),
('oa_glev167_skuehl', 'opt_mb_skuehl', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_pano', 'opt_mb_pano', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_burmester', 'opt_mb_burmester', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_hud', 'opt_mb_hud', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_luftfed', 'opt_mb_luftfed', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_360cam', 'opt_mb_360cam', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_ahk', 'opt_mb_ahk', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glev167_standheiz', 'opt_mb_standheiz', 'gen_mb_gle_v167', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_sw223_shz', 'opt_mb_shz', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_skuehl', 'opt_mb_skuehl', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_pano', 'opt_mb_pano', 'gen_mb_s_w223', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sw223_burmester', 'opt_mb_burmester', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_hud', 'opt_mb_hud', 'gen_mb_s_w223', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sw223_luftfed', 'opt_mb_luftfed', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_360cam', 'opt_mb_360cam', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_ambi', 'opt_mb_ambilicht', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_distronic', 'opt_mb_distronic', 'gen_mb_s_w223', 'STANDARD', NULL, NOW(), NOW()),
('oa_sw223_standheiz', 'opt_mb_standheiz', 'gen_mb_s_w223', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- MINI: 6 options, 2 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_minif56_shz', 'opt_mini_shz', 'gen_mini_cooper_f56', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif56_pano', 'opt_mini_pano', 'gen_mini_cooper_f56', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif56_harman', 'opt_mini_harman', 'gen_mini_cooper_f56', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif56_hud', 'opt_mini_hud', 'gen_mini_cooper_f56', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif56_leder', 'opt_mini_leder', 'gen_mini_cooper_f56', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_minif60_shz', 'opt_mini_shz', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif60_pano', 'opt_mini_pano', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif60_harman', 'opt_mini_harman', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif60_hud', 'opt_mini_hud', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif60_leder', 'opt_mini_leder', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_minif60_ahk', 'opt_mini_ahk', 'gen_mini_country_f60', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- NISSAN: 6 options, 4 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ariya_shz', 'opt_nis_shz', 'gen_ariya_1', 'STANDARD', NULL, NOW(), NOW()),
('oa_ariya_pano', 'opt_nis_pano', 'gen_ariya_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ariya_bose', 'opt_nis_bose', 'gen_ariya_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ariya_propilot', 'opt_nis_propilot', 'gen_ariya_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ariya_360cam', 'opt_nis_360cam', 'gen_ariya_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_juke2_shz', 'opt_nis_shz', 'gen_juke_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_juke2_bose', 'opt_nis_bose', 'gen_juke_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_juke2_propilot', 'opt_nis_propilot', 'gen_juke_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_juke2_360cam', 'opt_nis_360cam', 'gen_juke_2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_leaf2_shz', 'opt_nis_shz', 'gen_leaf_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_leaf2_bose', 'opt_nis_bose', 'gen_leaf_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_leaf2_propilot', 'opt_nis_propilot', 'gen_leaf_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_leaf2_360cam', 'opt_nis_360cam', 'gen_leaf_2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_xt4_shz', 'opt_nis_shz', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_xt4_pano', 'opt_nis_pano', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_xt4_bose', 'opt_nis_bose', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_xt4_propilot', 'opt_nis_propilot', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_xt4_360cam', 'opt_nis_360cam', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_xt4_ahk', 'opt_nis_ahk', 'gen_xtrail_4', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- OPEL: 6 options, Mokka II ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_mokka2_shz', 'opt_opel_shz', 'gen_opel_mokka_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mokka2_pano', 'opt_opel_pano', 'gen_opel_mokka_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mokka2_intellilux', 'opt_opel_intellilux', 'gen_opel_mokka_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mokka2_navi', 'opt_opel_navipro', 'gen_opel_mokka_2', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- PEUGEOT: 6 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_2008_2_shz', 'opt_pgt_shz', 'gen_2008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2008_2_pano', 'opt_pgt_pano', 'gen_2008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2008_2_focal', 'opt_pgt_focal', 'gen_2008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_2008_2_matrix', 'opt_pgt_matrix', 'gen_2008_2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_208_2_shz', 'opt_pgt_shz', 'gen_208_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_208_2_focal', 'opt_pgt_focal', 'gen_208_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_208_2_matrix', 'opt_pgt_matrix', 'gen_208_2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_5008_2_shz', 'opt_pgt_shz', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5008_2_pano', 'opt_pgt_pano', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5008_2_focal', 'opt_pgt_focal', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5008_2_matrix', 'opt_pgt_matrix', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5008_2_nightvis', 'opt_pgt_nightvis', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5008_2_ahk', 'opt_pgt_ahk', 'gen_5008_2', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- PORSCHE: 10 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_mac95b_shz', 'opt_por_shz', 'gen_por_macan_95b', 'STANDARD', NULL, NOW(), NOW()),
('oa_mac95b_skuehl', 'opt_por_skuehl', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_pano', 'opt_por_pano', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_bose', 'opt_por_bose', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_burmester', 'opt_por_burmester', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_pdls', 'opt_por_pdls', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_pasm', 'opt_por_pasm', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_sport', 'opt_por_sport_chrono', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_mac95b_ahk', 'opt_por_hinterachs', 'gen_por_macan_95b', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_pan3_shz', 'opt_por_shz', 'gen_por_panamera_3', 'STANDARD', NULL, NOW(), NOW()),
('oa_pan3_skuehl', 'opt_por_skuehl', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_pano', 'opt_por_pano', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_bose', 'opt_por_bose', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_burmester', 'opt_por_burmester', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_pdls', 'opt_por_pdls', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_pasm', 'opt_por_pasm', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_sport', 'opt_por_sport_chrono', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_hinter', 'opt_por_hinterachs', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_pan3_keramik', 'opt_por_keramik', 'gen_por_panamera_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_tayc_shz', 'opt_por_shz', 'gen_por_taycan_y1a', 'STANDARD', NULL, NOW(), NOW()),
('oa_tayc_skuehl', 'opt_por_skuehl', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_pano', 'opt_por_pano', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_bose', 'opt_por_bose', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_burmester', 'opt_por_burmester', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_pdls', 'opt_por_pdls', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_pasm', 'opt_por_pasm', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_sport', 'opt_por_sport_chrono', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_hinter', 'opt_por_hinterachs', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tayc_keramik', 'opt_por_keramik', 'gen_por_taycan_y1a', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- RENAULT: 6 options, Megane E-TECH ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_megev_shz', 'opt_ren_shz', 'gen_ren_megane_ev', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_megev_pano', 'opt_ren_pano', 'gen_ren_megane_ev', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_megev_bose', 'opt_ren_bose', 'gen_ren_megane_ev', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_megev_hud', 'opt_ren_hud', 'gen_ren_megane_ev', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_megev_matrix', 'opt_ren_matrix', 'gen_ren_megane_ev', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- SEAT: 5 options, 2 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_arona1_shz', 'opt_seat_shz', 'gen_arona_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_arona1_beats', 'opt_seat_beats', 'gen_arona_1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_arona1_fullled', 'opt_seat_fullled', 'gen_arona_1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_ibizakj_shz', 'opt_seat_shz', 'gen_seat_ibiza_kj', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ibizakj_beats', 'opt_seat_beats', 'gen_seat_ibiza_kj', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_ibizakj_fullled', 'opt_seat_fullled', 'gen_seat_ibiza_kj', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- SKODA: 6 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_fabpj_shz', 'opt_sk_shz', 'gen_sk_fabia_pj', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_fabpj_matrix', 'opt_sk_matrix', 'gen_sk_fabia_pj', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_kodns_shz', 'opt_sk_shz', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_kodns_pano', 'opt_sk_pano', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_kodns_canton', 'opt_sk_canton', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_kodns_matrix', 'opt_sk_matrix', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_kodns_ahk', 'opt_sk_ahk', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_kodns_standheiz', 'opt_sk_standheiz', 'gen_sk_kodiaq_ns', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_sup3v_shz', 'opt_sk_shz', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sup3v_pano', 'opt_sk_pano', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sup3v_canton', 'opt_sk_canton', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sup3v_matrix', 'opt_sk_matrix', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sup3v_ahk', 'opt_sk_ahk', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_sup3v_standheiz', 'opt_sk_standheiz', 'gen_sk_superb_3v', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- TESLA: 4 options, Model S Plaid ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_msp_shz', 'opt_ts_shz', 'gen_ts_models_p', 'STANDARD', NULL, NOW(), NOW()),
('oa_msp_fsd', 'opt_ts_fsd', 'gen_ts_models_p', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_msp_weiss', 'opt_ts_weiss_int', 'gen_ts_models_p', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_msp_ahk', 'opt_ts_ahk', 'gen_ts_models_p', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- TOYOTA: 6 options, 3 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_supra_shz', 'opt_toy_shz', 'gen_toy_supra_a90', 'STANDARD', NULL, NOW(), NOW()),
('oa_supra_hud', 'opt_toy_hud', 'gen_toy_supra_a90', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_supra_jbl', 'opt_toy_jbl', 'gen_toy_supra_a90', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_rav4_shz', 'opt_toy_shz', 'gen_toy_rav4_xa50', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_rav4_pano', 'opt_toy_pano', 'gen_toy_rav4_xa50', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_rav4_jbl', 'opt_toy_jbl', 'gen_toy_rav4_xa50', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_rav4_hud', 'opt_toy_hud', 'gen_toy_rav4_xa50', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_rav4_ahk', 'opt_toy_ahk', 'gen_toy_rav4_xa50', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_yaris_shz', 'opt_toy_shz', 'gen_toy_yaris_xp210', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_yaris_hud', 'opt_toy_hud', 'gen_toy_yaris_xp210', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_yaris_jbl', 'opt_toy_jbl', 'gen_toy_yaris_xp210', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- VOLKSWAGEN: 10 options, 8 generations ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_golf7_shz', 'opt_vw_shz', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_golf7_pano', 'opt_vw_pano', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_golf7_leder', 'opt_vw_leder', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_golf7_harman', 'opt_vw_harman', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_golf7_standheiz', 'opt_vw_standheiz', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_golf7_ahk', 'opt_vw_ahk', 'gen_vw_golf7', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_id3_shz', 'opt_vw_shz', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id3_pano', 'opt_vw_pano', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id3_harman', 'opt_vw_harman', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id3_hud', 'opt_vw_hud', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id3_led_mat', 'opt_vw_led_mat', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id3_travelass', 'opt_vw_travelass', 'gen_vw_id3_e1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_id4_shz', 'opt_vw_shz', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_pano', 'opt_vw_pano', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_harman', 'opt_vw_harman', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_hud', 'opt_vw_hud', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_led_mat', 'opt_vw_led_mat', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_travelass', 'opt_vw_travelass', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_id4_ahk', 'opt_vw_ahk', 'gen_vw_id4_e2', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_passb8_shz', 'opt_vw_shz', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_pano', 'opt_vw_pano', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_leder', 'opt_vw_leder', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_harman', 'opt_vw_harman', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_hud', 'opt_vw_hud', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_led_mat', 'opt_vw_led_mat', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_travelass', 'opt_vw_travelass', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_ahk', 'opt_vw_ahk', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb8_standheiz', 'opt_vw_standheiz', 'gen_vw_passat_b8', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_poloaw_shz', 'opt_vw_shz', 'gen_vw_polo_aw', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_poloaw_pano', 'opt_vw_pano', 'gen_vw_polo_aw', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_poloaw_led_mat', 'opt_vw_led_mat', 'gen_vw_polo_aw', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_troca1_shz', 'opt_vw_shz', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_troca1_pano', 'opt_vw_pano', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_troca1_harman', 'opt_vw_harman', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_troca1_led_mat', 'opt_vw_led_mat', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_troca1_360cam', 'opt_vw_360cam', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_troca1_ahk', 'opt_vw_ahk', 'gen_vw_troc_a1', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_tig3_shz', 'opt_vw_shz', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_pano', 'opt_vw_pano', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_harman', 'opt_vw_harman', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_hud', 'opt_vw_hud', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_led_mat', 'opt_vw_led_mat', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_travelass', 'opt_vw_travelass', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_360cam', 'opt_vw_360cam', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_ahk', 'opt_vw_ahk', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tig3_standheiz', 'opt_vw_standheiz', 'gen_vw_tiguan_3', 'OPTIONAL', NULL, NOW(), NOW());

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_tour5t_shz', 'opt_vw_shz', 'gen_vw_touran_5t', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tour5t_pano', 'opt_vw_pano', 'gen_vw_touran_5t', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tour5t_harman', 'opt_vw_harman', 'gen_vw_touran_5t', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tour5t_ahk', 'opt_vw_ahk', 'gen_vw_touran_5t', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_tour5t_standheiz', 'opt_vw_standheiz', 'gen_vw_touran_5t', 'OPTIONAL', NULL, NOW(), NOW());

-- ---- VOLVO: 10 options, V60 II ----

INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_v602_shz', 'opt_vol_shz', 'gen_v60_2', 'STANDARD', NULL, NOW(), NOW()),
('oa_v602_skuehl', 'opt_vol_skuehl', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_pano', 'opt_vol_pano', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_harman', 'opt_vol_harman', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_bw', 'opt_vol_bw', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_hud', 'opt_vol_hud', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_pilotass', 'opt_vol_pilotass', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_ahk', 'opt_vol_ahk', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_v602_standheiz', 'opt_vol_standheiz', 'gen_v60_2', 'OPTIONAL', NULL, NOW(), NOW());

COMMIT;
-- seed-ausstattung-3-fix.sql
-- OptionAvailability fuer die 11 fehlenden Generationen
BEGIN;

-- Audi A3 8Y
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_a3_8y_shz', 'opt_audi_shz', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a3_8y_pano', 'opt_audi_pano', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a3_8y_matrix', 'opt_audi_matrix', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a3_8y_virtcp', 'opt_audi_virtcp', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a3_8y_bang', 'opt_audi_bang', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_a3_8y_assist', 'opt_audi_assist', 'gen_audi_a3_8y', 'OPTIONAL', NULL, NOW(), NOW());

-- Audi Q5 FY
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_q5_fy_shz', 'opt_audi_shz', 'gen_audi_q5_fy', 'STANDARD', NULL, NOW(), NOW()),
('oa_q5_fy_pano', 'opt_audi_pano', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q5_fy_matrix', 'opt_audi_matrix', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q5_fy_bang', 'opt_audi_bang', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q5_fy_hud', 'opt_audi_hud', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q5_fy_ahk', 'opt_audi_ahk', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_q5_fy_standheiz', 'opt_audi_standheiz', 'gen_audi_q5_fy', 'OPTIONAL', NULL, NOW(), NOW());

-- BMW 5er G60
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_5g60_shz', 'opt_bmw_shz', 'gen_bmw_5er_g60', 'STANDARD', NULL, NOW(), NOW()),
('oa_5g60_pano', 'opt_bmw_pano', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_hud', 'opt_bmw_hud', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_harman', 'opt_bmw_harman', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_laser', 'opt_bmw_laser', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_drivas', 'opt_bmw_drivas', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_leder', 'opt_bmw_leder', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g60_standheiz', 'opt_bmw_standheiz', 'gen_bmw_5er_g60', 'OPTIONAL', NULL, NOW(), NOW());

-- BMW 5er G30
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_5g30_shz', 'opt_bmw_shz', 'gen_bmw_5er_g30', 'STANDARD', NULL, NOW(), NOW()),
('oa_5g30_pano', 'opt_bmw_pano', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g30_hud', 'opt_bmw_hud', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g30_harman', 'opt_bmw_harman', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g30_laser', 'opt_bmw_laser', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g30_drivas', 'opt_bmw_drivas', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_5g30_standheiz', 'opt_bmw_standheiz', 'gen_bmw_5er_g30', 'OPTIONAL', NULL, NOW(), NOW());

-- BMW X3 G01
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_x3g01_shz', 'opt_bmw_shz', 'gen_bmw_x3_g01', 'STANDARD', NULL, NOW(), NOW()),
('oa_x3g01_pano', 'opt_bmw_pano', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x3g01_hud', 'opt_bmw_hud', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x3g01_harman', 'opt_bmw_harman', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x3g01_drivas', 'opt_bmw_drivas', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x3g01_ahk', 'opt_bmw_ahk', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_x3g01_standheiz', 'opt_bmw_standheiz', 'gen_bmw_x3_g01', 'OPTIONAL', NULL, NOW(), NOW());

-- Mazda Mazda3 IV BP
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_maz3_shz', 'opt_maz_shz', 'gen_mazda3_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_maz3_bose', 'opt_maz_bose', 'gen_mazda3_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_maz3_hud', 'opt_maz_hud', 'gen_mazda3_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_maz3_leder', 'opt_maz_leder', 'gen_mazda3_4', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_maz3_matrix', 'opt_maz_matrix', 'gen_mazda3_4', 'OPTIONAL', NULL, NOW(), NOW());

-- Mercedes GLC X254
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_glcx254_shz', 'opt_mb_shz', 'gen_mb_glc_x254', 'STANDARD', NULL, NOW(), NOW()),
('oa_glcx254_pano', 'opt_mb_pano', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glcx254_burm', 'opt_mb_burmester', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glcx254_distr', 'opt_mb_distronic', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glcx254_hud', 'opt_mb_hud', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glcx254_360', 'opt_mb_360cam', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_glcx254_standh', 'opt_mb_standheiz', 'gen_mb_glc_x254', 'OPTIONAL', NULL, NOW(), NOW());

-- Porsche Cayenne E3
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_caye3_shz', 'opt_por_shz', 'gen_por_cayenne_e3', 'STANDARD', NULL, NOW(), NOW()),
('oa_caye3_pano', 'opt_por_pano', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_bose', 'opt_por_bose', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_burm', 'opt_por_burmester', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_pasm', 'opt_por_pasm', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_hint', 'opt_por_hinterachs', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_pdls', 'opt_por_pdls', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_caye3_pccb', 'opt_por_keramik', 'gen_por_cayenne_e3', 'OPTIONAL', NULL, NOW(), NOW());

-- Renault Clio V
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_clio5_shz', 'opt_ren_shz', 'gen_ren_clio5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clio5_bose', 'opt_ren_bose', 'gen_ren_clio5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clio5_matrix', 'opt_ren_matrix', 'gen_ren_clio5', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_clio5_pano', 'opt_ren_pano', 'gen_ren_clio5', 'OPTIONAL', NULL, NOW(), NOW());

-- Toyota Corolla E210
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_core210_shz', 'opt_toy_shz', 'gen_toy_corolla_e210', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_core210_hud', 'opt_toy_hud', 'gen_toy_corolla_e210', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_core210_jbl', 'opt_toy_jbl', 'gen_toy_corolla_e210', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_core210_pano', 'opt_toy_pano', 'gen_toy_corolla_e210', 'OPTIONAL', NULL, NOW(), NOW());

-- VW Passat B9
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, note, "createdAt", "updatedAt") VALUES
('oa_passb9_shz', 'opt_vw_shz', 'gen_vw_passat_b9', 'STANDARD', NULL, NOW(), NOW()),
('oa_passb9_pano', 'opt_vw_pano', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb9_harman', 'opt_vw_harman', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb9_hud', 'opt_vw_hud', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb9_led', 'opt_vw_led_mat', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb9_travel', 'opt_vw_travelass', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW()),
('oa_passb9_ahk', 'opt_vw_ahk', 'gen_vw_passat_b9', 'OPTIONAL', NULL, NOW(), NOW());

COMMIT;
