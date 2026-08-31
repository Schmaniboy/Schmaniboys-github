-- =============================================================================
-- CARONEX Katalog-Erweiterung: Zusaetzliche Hersteller, Modelle, Generationen
--
-- Echte, oeffentlich dokumentierte Fahrzeugdaten.
-- Quellen: Hersteller-Websites, KBA-Typgenehmigungen, ADAC Autokatalog.
-- =============================================================================

BEGIN;

-- ===== NEUE HERSTELLER =====
INSERT INTO "Manufacturer" (id, name, slug, country, "wmiCodes", status, "publishedAt", "updatedAt") VALUES
  ('mfr_alfa',       'Alfa Romeo',     'alfa-romeo',     'Italien',          ARRAY['ZAR'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_jaguar',     'Jaguar',         'jaguar',         'Grossbritannien',  ARRAY['SAJ'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_landrover',  'Land Rover',     'land-rover',     'Grossbritannien',  ARRAY['SAL'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_suzuki',     'Suzuki',         'suzuki',         'Japan',            ARRAY['JSA','TSM'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_mitsubishi', 'Mitsubishi',     'mitsubishi',     'Japan',            ARRAY['JMB','JMY'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_subaru',     'Subaru',         'subaru',         'Japan',            ARRAY['JF1','JF2'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_lexus',      'Lexus',          'lexus',          'Japan',            ARRAY['JTH'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_jeep',       'Jeep',           'jeep',           'USA',              ARRAY['1C4','ZCD'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_smart',      'smart',          'smart',          'Deutschland',      ARRAY['WME'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_mg',         'MG',             'mg',             'China',            ARRAY['LSJ'],       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== ALFA ROMEO =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_alfa_giulia',    'mfr_alfa', 'Giulia',    'giulia',    'PUBLISHED', NOW(), NOW()),
  ('mod_alfa_stelvio',   'mfr_alfa', 'Stelvio',   'stelvio',   'PUBLISHED', NOW(), NOW()),
  ('mod_alfa_tonale',    'mfr_alfa', 'Tonale',    'tonale',    'PUBLISHED', NOW(), NOW()),
  ('mod_alfa_giulietta', 'mfr_alfa', 'Giulietta', 'giulietta', 'PUBLISHED', NOW(), NOW()),
  ('mod_alfa_mito',      'mfr_alfa', 'MiTo',      'mito',      'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_alfa_giulia_952',    'mod_alfa_giulia',    'Giulia (952)',    '952', '952',  'bt_limousine', 2016, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_alfa_stelvio_949',   'mod_alfa_stelvio',   'Stelvio (949)',   '949', '949',  'bt_suv',       2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_alfa_tonale',        'mod_alfa_tonale',    'Tonale',          NULL,  'tonale','bt_suv',      2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_alfa_giulietta_940', 'mod_alfa_giulietta', 'Giulietta (940)', '940', '940',  'bt_kompakt',   2010, 2020, 'PUBLISHED', NOW(), NOW()),
  ('gen_alfa_mito_955',      'mod_alfa_mito',      'MiTo (955)',      '955', '955',  'bt_kleinwagen', 2008, 2018, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== JAGUAR =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_jag_xe',     'mfr_jaguar', 'XE',      'xe',      'PUBLISHED', NOW(), NOW()),
  ('mod_jag_xf',     'mfr_jaguar', 'XF',      'xf',      'PUBLISHED', NOW(), NOW()),
  ('mod_jag_ftype',  'mfr_jaguar', 'F-Type',  'f-type',  'PUBLISHED', NOW(), NOW()),
  ('mod_jag_fpace',  'mfr_jaguar', 'F-Pace',  'f-pace',  'PUBLISHED', NOW(), NOW()),
  ('mod_jag_epace',  'mfr_jaguar', 'E-Pace',  'e-pace',  'PUBLISHED', NOW(), NOW()),
  ('mod_jag_ipace',  'mfr_jaguar', 'I-Pace',  'i-pace',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_jag_xe_x760',    'mod_jag_xe',    'XE (X760)',     'X760', 'x760',  'bt_limousine', 2015, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_jag_xf_x260',    'mod_jag_xf',    'XF (X260)',     'X260', 'x260',  'bt_limousine', 2015, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jag_ftype_x152',  'mod_jag_ftype', 'F-Type (X152)', 'X152', 'x152', 'bt_sportwagen', 2013, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_jag_fpace_x761',  'mod_jag_fpace', 'F-Pace (X761)', 'X761', 'x761', 'bt_suv',       2016, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jag_epace',       'mod_jag_epace', 'E-Pace',        NULL,   'e-pace','bt_suv',       2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jag_ipace',       'mod_jag_ipace', 'I-Pace',        NULL,   'i-pace','bt_suv',       2018, 2024, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== LAND ROVER =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_lr_defender',   'mfr_landrover', 'Defender',       'defender',       'PUBLISHED', NOW(), NOW()),
  ('mod_lr_discovery',  'mfr_landrover', 'Discovery',      'discovery',      'PUBLISHED', NOW(), NOW()),
  ('mod_lr_sport',      'mfr_landrover', 'Range Rover Sport', 'range-rover-sport', 'PUBLISHED', NOW(), NOW()),
  ('mod_lr_evoque',     'mfr_landrover', 'Range Rover Evoque', 'range-rover-evoque', 'PUBLISHED', NOW(), NOW()),
  ('mod_lr_velar',      'mfr_landrover', 'Range Rover Velar', 'range-rover-velar', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_lr_defender_l663',  'mod_lr_defender',  'Defender (L663)',        'L663', 'l663', 'bt_suv', 2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lr_disco5_l462',    'mod_lr_discovery', 'Discovery 5 (L462)',     'L462', 'l462', 'bt_suv', 2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lr_sport_l461',     'mod_lr_sport',     'Range Rover Sport (L461)', 'L461', 'l461', 'bt_suv', 2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lr_evoque_l551',    'mod_lr_evoque',    'Range Rover Evoque (L551)', 'L551', 'l551', 'bt_suv', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lr_velar_l560',     'mod_lr_velar',     'Range Rover Velar (L560)', 'L560', 'l560', 'bt_suv', 2017, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== SUZUKI =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_suz_swift',   'mfr_suzuki', 'Swift',    'swift',    'PUBLISHED', NOW(), NOW()),
  ('mod_suz_vitara',  'mfr_suzuki', 'Vitara',   'vitara',   'PUBLISHED', NOW(), NOW()),
  ('mod_suz_sx4',     'mfr_suzuki', 'SX4 S-Cross', 'sx4-s-cross', 'PUBLISHED', NOW(), NOW()),
  ('mod_suz_jimny',   'mfr_suzuki', 'Jimny',    'jimny',    'PUBLISHED', NOW(), NOW()),
  ('mod_suz_ignis',   'mfr_suzuki', 'Ignis',    'ignis',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_suz_swift_az',    'mod_suz_swift',  'Swift (AZ)',    'AZ',   'az',    'bt_kleinwagen', 2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_suz_vitara_ly',   'mod_suz_vitara', 'Vitara (LY)',   'LY',   'ly',    'bt_suv',        2015, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_suz_sx4_jy',      'mod_suz_sx4',    'SX4 S-Cross',  NULL,   's-cross','bt_suv',       2013, 2022, 'PUBLISHED', NOW(), NOW()),
  ('gen_suz_jimny_jb74',  'mod_suz_jimny',  'Jimny (JB74)', 'JB74', 'jb74',  'bt_suv',        2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_suz_ignis_mf',    'mod_suz_ignis',  'Ignis (MF)',   'MF',   'mf',    'bt_kleinwagen', 2016, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== MITSUBISHI =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_mit_outlander', 'mfr_mitsubishi', 'Outlander',    'outlander',    'PUBLISHED', NOW(), NOW()),
  ('mod_mit_asx',       'mfr_mitsubishi', 'ASX',          'asx',          'PUBLISHED', NOW(), NOW()),
  ('mod_mit_eclipse',   'mfr_mitsubishi', 'Eclipse Cross', 'eclipse-cross', 'PUBLISHED', NOW(), NOW()),
  ('mod_mit_spacest',   'mfr_mitsubishi', 'Space Star',   'space-star',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_mit_outlander_gn', 'mod_mit_outlander', 'Outlander (GN)', 'GN', 'gn', 'bt_suv',        2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mit_asx',          'mod_mit_asx',       'ASX',            NULL, 'asx', 'bt_suv',        2023, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mit_eclipse_gk',   'mod_mit_eclipse',   'Eclipse Cross (GK)', 'GK', 'gk', 'bt_suv',    2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mit_spacestar_a0', 'mod_mit_spacest',   'Space Star (A00)', 'A00', 'a00', 'bt_kleinwagen', 2012, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== SUBARU =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_sub_forester', 'mfr_subaru', 'Forester', 'forester', 'PUBLISHED', NOW(), NOW()),
  ('mod_sub_outback',  'mfr_subaru', 'Outback',  'outback',  'PUBLISHED', NOW(), NOW()),
  ('mod_sub_xv',       'mfr_subaru', 'XV',       'xv',       'PUBLISHED', NOW(), NOW()),
  ('mod_sub_impreza',  'mfr_subaru', 'Impreza',  'impreza',  'PUBLISHED', NOW(), NOW()),
  ('mod_sub_brz',      'mfr_subaru', 'BRZ',      'brz',      'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_sub_forester_sk', 'mod_sub_forester', 'Forester (SK)', 'SK', 'sk', 'bt_suv',       2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_sub_outback_bt',  'mod_sub_outback',  'Outback (BT)',  'BT', 'bt', 'bt_kombi',     2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_sub_xv_gt',       'mod_sub_xv',       'XV (GT)',       'GT', 'gt', 'bt_crossover', 2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_sub_impreza_gk',  'mod_sub_impreza',  'Impreza (GK)', 'GK', 'gk', 'bt_kompakt',   2016, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_sub_brz_zd8',     'mod_sub_brz',      'BRZ (ZD8)',    'ZD8', 'zd8', 'bt_coupe',    2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== LEXUS =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_lex_is',  'mfr_lexus', 'IS',  'is',  'PUBLISHED', NOW(), NOW()),
  ('mod_lex_es',  'mfr_lexus', 'ES',  'es',  'PUBLISHED', NOW(), NOW()),
  ('mod_lex_nx',  'mfr_lexus', 'NX',  'nx',  'PUBLISHED', NOW(), NOW()),
  ('mod_lex_rx',  'mfr_lexus', 'RX',  'rx',  'PUBLISHED', NOW(), NOW()),
  ('mod_lex_ux',  'mfr_lexus', 'UX',  'ux',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_lex_is_xe30',  'mod_lex_is',  'IS (XE30)',   'XE30', 'xe30', 'bt_limousine', 2013, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lex_es_xz10',  'mod_lex_es',  'ES (XZ10)',   'XZ10', 'xz10', 'bt_limousine', 2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lex_nx_az20',  'mod_lex_nx',  'NX (AZ20)',   'AZ20', 'az20', 'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lex_rx_al20',  'mod_lex_rx',  'RX (AL20)',   'AL20', 'al20', 'bt_suv',       2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_lex_ux_za10',  'mod_lex_ux',  'UX (ZA10)',   'ZA10', 'za10', 'bt_crossover', 2018, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== JEEP =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_jeep_wrangler', 'mfr_jeep', 'Wrangler',    'wrangler',    'PUBLISHED', NOW(), NOW()),
  ('mod_jeep_compass',  'mfr_jeep', 'Compass',     'compass',     'PUBLISHED', NOW(), NOW()),
  ('mod_jeep_renegade', 'mfr_jeep', 'Renegade',    'renegade',    'PUBLISHED', NOW(), NOW()),
  ('mod_jeep_avenger',  'mfr_jeep', 'Avenger',     'avenger',     'PUBLISHED', NOW(), NOW()),
  ('mod_jeep_cherokee', 'mfr_jeep', 'Grand Cherokee', 'grand-cherokee', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_jeep_wrangler_jl',  'mod_jeep_wrangler', 'Wrangler (JL)',        'JL',  'jl',  'bt_suv', 2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jeep_compass_mp',   'mod_jeep_compass',  'Compass (MP)',         'MP',  'mp',  'bt_suv', 2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jeep_renegade_bu',  'mod_jeep_renegade', 'Renegade (BU)',        'BU',  'bu',  'bt_suv', 2014, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jeep_avenger',      'mod_jeep_avenger',  'Avenger',              NULL,  'avenger', 'bt_suv', 2023, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_jeep_cherokee_wl',  'mod_jeep_cherokee', 'Grand Cherokee (WL)', 'WL',  'wl',  'bt_suv', 2022, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== SMART =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_smart_fortwo',  'mfr_smart', 'fortwo',  'fortwo',  'PUBLISHED', NOW(), NOW()),
  ('mod_smart_forfour', 'mfr_smart', 'forfour', 'forfour', 'PUBLISHED', NOW(), NOW()),
  ('mod_smart_hash1',   'mfr_smart', '#1',      'hash-1',  'PUBLISHED', NOW(), NOW()),
  ('mod_smart_hash3',   'mfr_smart', '#3',      'hash-3',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_smart_fortwo_c453',  'mod_smart_fortwo',  'fortwo (C453)',  'C453', 'c453', 'bt_kleinwagen', 2014, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_smart_forfour_w453', 'mod_smart_forfour', 'forfour (W453)', 'W453', 'w453', 'bt_kleinwagen', 2014, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_smart_hash1',        'mod_smart_hash1',   '#1',             NULL,   'hash-1', 'bt_suv',      2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_smart_hash3',        'mod_smart_hash3',   '#3',             NULL,   'hash-3', 'bt_limousine', 2024, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== MG =====
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_mg_zs',  'mfr_mg', 'ZS',  'zs',  'PUBLISHED', NOW(), NOW()),
  ('mod_mg_4',   'mfr_mg', 'MG4', 'mg4', 'PUBLISHED', NOW(), NOW()),
  ('mod_mg_hs',  'mfr_mg', 'HS',  'hs',  'PUBLISHED', NOW(), NOW()),
  ('mod_mg_5',   'mfr_mg', 'MG5', 'mg5', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_mg_zs_ev',  'mod_mg_zs',  'ZS EV',  NULL, 'zs-ev',  'bt_suv',       2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mg_4',      'mod_mg_4',   'MG4',    NULL, 'mg4',    'bt_kompakt',   2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mg_hs',     'mod_mg_hs',  'HS',     NULL, 'hs',     'bt_suv',       2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mg_5_ev',   'mod_mg_5',   'MG5 EV', NULL, 'mg5-ev', 'bt_kombi',     2022, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== ZUSAETZLICHE MODELLE FUER BESTEHENDE HERSTELLER =====

-- BMW: fehlende Baureihen
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_bmw_7er',   'mfr_bmw', '7er',  '7er',  'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x2',    'mfr_bmw', 'X2',   'x2',   'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x4',    'mfr_bmw', 'X4',   'x4',   'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x6',    'mfr_bmw', 'X6',   'x6',   'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_ix',    'mfr_bmw', 'iX',   'ix',   'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_i4',    'mfr_bmw', 'i4',   'i4',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_bmw_7er_g70', 'mod_bmw_7er', '7er (G70)',  'G70', 'g70', 'bt_limousine', 2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x2_u10',  'mod_bmw_x2',  'X2 (U10)',  'U10', 'u10', 'bt_suv',       2024, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x4_g02',  'mod_bmw_x4',  'X4 (G02)',  'G02', 'g02', 'bt_suv',       2018, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x6_g06',  'mod_bmw_x6',  'X6 (G06)',  'G06', 'g06', 'bt_suv',       2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_ix_i20',   'mod_bmw_ix',  'iX (i20)',  'i20', 'i20', 'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_i4_g26',   'mod_bmw_i4',  'i4 (G26)',  'G26', 'g26', 'bt_gran_coupe',2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- Mercedes: fehlende Baureihen
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_mb_b',      'mfr_mercedes', 'B-Klasse',   'b-klasse',   'PUBLISHED', NOW(), NOW()),
  ('mod_mb_cla',    'mfr_mercedes', 'CLA',         'cla',         'PUBLISHED', NOW(), NOW()),
  ('mod_mb_eqc',    'mfr_mercedes', 'EQC',         'eqc',         'PUBLISHED', NOW(), NOW()),
  ('mod_mb_eqa',    'mfr_mercedes', 'EQA',         'eqa',         'PUBLISHED', NOW(), NOW()),
  ('mod_mb_eqb',    'mfr_mercedes', 'EQB',         'eqb',         'PUBLISHED', NOW(), NOW()),
  ('mod_mb_eqs',    'mfr_mercedes', 'EQS',         'eqs',         'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_mb_b_w247',    'mod_mb_b',   'B-Klasse (W247)',  'W247', 'w247', 'bt_van',       2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_cla_c118',  'mod_mb_cla', 'CLA (C118)',       'C118', 'c118', 'bt_coupe',     2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_eqc_n293',  'mod_mb_eqc', 'EQC (N293)',       'N293', 'n293', 'bt_suv',       2019, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_eqa_h243',  'mod_mb_eqa', 'EQA (H243)',       'H243', 'h243', 'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_eqb_x243',  'mod_mb_eqb', 'EQB (X243)',       'X243', 'x243', 'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_eqs_v297',  'mod_mb_eqs', 'EQS (V297)',       'V297', 'v297', 'bt_limousine', 2022, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- VW: fehlende Baureihen
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_vw_id3',    'mfr_vw', 'ID.3',   'id-3',   'PUBLISHED', NOW(), NOW()),
  ('mod_vw_id4',    'mfr_vw', 'ID.4',   'id-4',   'PUBLISHED', NOW(), NOW()),
  ('mod_vw_id5',    'mfr_vw', 'ID.5',   'id-5',   'PUBLISHED', NOW(), NOW()),
  ('mod_vw_id7',    'mfr_vw', 'ID.7',   'id-7',   'PUBLISHED', NOW(), NOW()),
  ('mod_vw_arteon', 'mfr_vw', 'Arteon', 'arteon', 'PUBLISHED', NOW(), NOW()),
  ('mod_vw_taigo',  'mfr_vw', 'Taigo',  'taigo',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_vw_id3',     'mod_vw_id3',    'ID.3',     NULL, 'id-3',   'bt_kompakt',   2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_id4',     'mod_vw_id4',    'ID.4',     NULL, 'id-4',   'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_id5',     'mod_vw_id5',    'ID.5',     NULL, 'id-5',   'bt_suv',       2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_id7',     'mod_vw_id7',    'ID.7',     NULL, 'id-7',   'bt_limousine', 2023, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_arteon',  'mod_vw_arteon', 'Arteon',   NULL, 'arteon', 'bt_limousine', 2017, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_taigo',   'mod_vw_taigo',  'Taigo',    NULL, 'taigo',  'bt_crossover', 2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- Audi: fehlende Baureihen
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_audi_q2',     'mfr_audi', 'Q2',      'q2',      'PUBLISHED', NOW(), NOW()),
  ('mod_audi_q4',     'mfr_audi', 'Q4 e-tron', 'q4-e-tron', 'PUBLISHED', NOW(), NOW()),
  ('mod_audi_etron',  'mfr_audi', 'e-tron',  'e-tron',  'PUBLISHED', NOW(), NOW()),
  ('mod_audi_etrongt','mfr_audi', 'e-tron GT', 'e-tron-gt', 'PUBLISHED', NOW(), NOW()),
  ('mod_audi_a1',     'mfr_audi', 'A1',      'a1',      'PUBLISHED', NOW(), NOW()),
  ('mod_audi_q8',     'mfr_audi', 'Q8',      'q8',      'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_audi_q2_ga',      'mod_audi_q2',     'Q2 (GA)',        'GA',  'ga',  'bt_suv',       2016, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_q4_fz',      'mod_audi_q4',     'Q4 e-tron (FZ)', 'FZ', 'fz',  'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_etron_ge',    'mod_audi_etron',  'e-tron (GE)',    'GE',  'ge',  'bt_suv',       2019, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_etrongt_f8',  'mod_audi_etrongt','e-tron GT (F8)', 'F8', 'f8',  'bt_sportwagen', 2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_a1_gb',       'mod_audi_a1',     'A1 (GB)',        'GB',  'gb',  'bt_kleinwagen', 2018, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_q8_4m',       'mod_audi_q8',     'Q8 (4M)',        '4M',  '4m',  'bt_suv',       2018, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
