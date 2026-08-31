-- =============================================================================
-- CARONEX Katalog-Stammdaten
--
-- Echte, oeffentlich dokumentierte Fahrzeugdaten.
-- Quellen: Hersteller-Websites, KBA-Typgenehmigungen, ADAC Autokatalog.
--
-- Alle Leistungsdaten, Hubräume und Zylinderzahlen stammen aus offiziellen
-- Hersteller-Datenblättern. Wo Angaben nicht zweifelsfrei belegbar sind,
-- werden sie weggelassen (NULL).
-- =============================================================================

BEGIN;

-- ===== KAROSSERIEFORMEN =====
INSERT INTO "BodyType" (id, name, slug) VALUES
  ('bt_limousine',   'Limousine',    'limousine'),
  ('bt_kombi',       'Kombi',        'kombi'),
  ('bt_suv',         'SUV',          'suv'),
  ('bt_coupe',       'Coupé',        'coupe'),
  ('bt_cabrio',      'Cabriolet',    'cabriolet'),
  ('bt_van',         'Van',          'van'),
  ('bt_kleinwagen',  'Kleinwagen',   'kleinwagen'),
  ('bt_kompakt',     'Kompaktklasse','kompaktklasse'),
  ('bt_sportwagen',  'Sportwagen',   'sportwagen'),
  ('bt_pickup',      'Pick-up',      'pick-up'),
  ('bt_shooting',    'Shooting Brake','shooting-brake'),
  ('bt_gran_coupe',  'Gran Coupé',   'gran-coupe'),
  ('bt_crossover',   'Crossover',    'crossover')
ON CONFLICT (id) DO NOTHING;

-- ===== GETRIEBE =====
INSERT INTO "Transmission" (id, name, type, gears) VALUES
  ('tr_man5',   '5-Gang Schaltgetriebe',      'MANUAL', 5),
  ('tr_man6',   '6-Gang Schaltgetriebe',      'MANUAL', 6),
  ('tr_aut6',   '6-Gang Wandlerautomatik',    'AUTOMATIC_TORQUE_CONVERTER', 6),
  ('tr_aut7',   '7-Gang Wandlerautomatik',    'AUTOMATIC_TORQUE_CONVERTER', 7),
  ('tr_aut8',   '8-Gang Wandlerautomatik',    'AUTOMATIC_TORQUE_CONVERTER', 8),
  ('tr_aut9',   '9-Gang Wandlerautomatik',    'AUTOMATIC_TORQUE_CONVERTER', 9),
  ('tr_dsg6',   '6-Gang DSG',                 'DUAL_CLUTCH', 6),
  ('tr_dsg7',   '7-Gang DSG',                 'DUAL_CLUTCH', 7),
  ('tr_dct7',   '7-Gang Doppelkupplung',      'DUAL_CLUTCH', 7),
  ('tr_dct8',   '8-Gang Doppelkupplung',      'DUAL_CLUTCH', 8),
  ('tr_smg',    'SMG Automatisiert',          'AUTOMATED_MANUAL', 6),
  ('tr_cvt',    'CVT Stufenlos',              'CVT', NULL),
  ('tr_red1',   '1-Gang Reduktionsgetriebe',  'REDUCTION_GEAR', 1),
  ('tr_red2',   '2-Gang Reduktionsgetriebe',  'REDUCTION_GEAR', 2)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- HERSTELLER
-- =============================================================================

INSERT INTO "Manufacturer" (id, name, slug, country, "wmiCodes", status, "publishedAt", "updatedAt") VALUES
  ('mfr_bmw',       'BMW',            'bmw',            'Deutschland', ARRAY['WBA','WBS','WBY'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_mercedes',  'Mercedes-Benz',  'mercedes-benz',  'Deutschland', ARRAY['WDB','WDC','WDD'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_vw',        'Volkswagen',     'volkswagen',     'Deutschland', ARRAY['WVW','WV1','WV2'], 'PUBLISHED', NOW(), NOW()),
  ('mfr_audi',      'Audi',           'audi',           'Deutschland', ARRAY['WAU','WUA'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_porsche',   'Porsche',        'porsche',        'Deutschland', ARRAY['WP0','WP1'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_opel',      'Opel',           'opel',           'Deutschland', ARRAY['W0L'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_ford',      'Ford',           'ford',           'USA',         ARRAY['WF0'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_toyota',    'Toyota',         'toyota',         'Japan',       ARRAY['JTD','SB1'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_skoda',     'Škoda',          'skoda',          'Tschechien',  ARRAY['TMB'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_seat',      'SEAT',           'seat',           'Spanien',     ARRAY['VSS'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_hyundai',   'Hyundai',        'hyundai',        'Suedkorea',   ARRAY['KMH','TMA'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_kia',       'Kia',            'kia',            'Suedkorea',   ARRAY['KNA','U5Y'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_volvo',     'Volvo',          'volvo',          'Schweden',    ARRAY['YV1'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_mazda',     'Mazda',          'mazda',          'Japan',       ARRAY['JMZ'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_honda',     'Honda',          'honda',          'Japan',       ARRAY['JHM'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_nissan',    'Nissan',         'nissan',         'Japan',       ARRAY['JN1','VSK'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_renault',   'Renault',        'renault',        'Frankreich',  ARRAY['VF1'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_peugeot',   'Peugeot',        'peugeot',        'Frankreich',  ARRAY['VF3'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_citroen',   'Citroën',        'citroen',        'Frankreich',  ARRAY['VF7'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_fiat',      'Fiat',           'fiat',           'Italien',     ARRAY['ZFA'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_mini',      'MINI',           'mini',           'Grossbritannien', ARRAY['WMW'],         'PUBLISHED', NOW(), NOW()),
  ('mfr_tesla',     'Tesla',          'tesla',          'USA',         ARRAY['5YJ','7SA'],       'PUBLISHED', NOW(), NOW()),
  ('mfr_cupra',     'CUPRA',          'cupra',          'Spanien',     ARRAY['VSS'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_ds',        'DS Automobiles', 'ds-automobiles', 'Frankreich',  ARRAY['VR1'],             'PUBLISHED', NOW(), NOW()),
  ('mfr_dacia',     'Dacia',          'dacia',          'Rumaenien',   ARRAY['UU1'],             'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODELLE + GENERATIONEN
-- =============================================================================

-- ----- BMW -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_bmw_1er',   'mfr_bmw', '1er',      '1er',      'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_2er',   'mfr_bmw', '2er',      '2er',      'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_3er',   'mfr_bmw', '3er',      '3er',      'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_4er',   'mfr_bmw', '4er',      '4er',      'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_5er',   'mfr_bmw', '5er',      '5er',      'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x1',    'mfr_bmw', 'X1',       'x1',       'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x3',    'mfr_bmw', 'X3',       'x3',       'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_x5',    'mfr_bmw', 'X5',       'x5',       'PUBLISHED', NOW(), NOW()),
  ('mod_bmw_z4',    'mfr_bmw', 'Z4',       'z4',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_bmw_3er_e90', 'mod_bmw_3er', '3er (E90/E91/E92/E93)',  'E90', 'e90',  'bt_limousine', 2005, 2013, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_3er_f30', 'mod_bmw_3er', '3er (F30/F31)',          'F30', 'f30',  'bt_limousine', 2012, 2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_3er_g20', 'mod_bmw_3er', '3er (G20/G21)',          'G20', 'g20',  'bt_limousine', 2019, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_1er_f40', 'mod_bmw_1er', '1er (F40)',              'F40', 'f40',  'bt_kompakt',   2019, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_5er_g30', 'mod_bmw_5er', '5er (G30/G31)',          'G30', 'g30',  'bt_limousine', 2017, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_5er_g60', 'mod_bmw_5er', '5er (G60/G61)',          'G60', 'g60',  'bt_limousine', 2023, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x1_u11',  'mod_bmw_x1',  'X1 (U11)',              'U11', 'u11',  'bt_suv',       2022, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x3_g01',  'mod_bmw_x3',  'X3 (G01)',              'G01', 'g01',  'bt_suv',       2017, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_x5_g05',  'mod_bmw_x5',  'X5 (G05)',              'G05', 'g05',  'bt_suv',       2018, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_4er_g22',  'mod_bmw_4er', '4er Coupé (G22)',       'G22', 'g22',  'bt_coupe',     2020, NULL,  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- MERCEDES-BENZ -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_mb_a',      'mfr_mercedes', 'A-Klasse',   'a-klasse',   'PUBLISHED', NOW(), NOW()),
  ('mod_mb_c',      'mfr_mercedes', 'C-Klasse',   'c-klasse',   'PUBLISHED', NOW(), NOW()),
  ('mod_mb_e',      'mfr_mercedes', 'E-Klasse',   'e-klasse',   'PUBLISHED', NOW(), NOW()),
  ('mod_mb_s',      'mfr_mercedes', 'S-Klasse',   's-klasse',   'PUBLISHED', NOW(), NOW()),
  ('mod_mb_glc',    'mfr_mercedes', 'GLC',        'glc',        'PUBLISHED', NOW(), NOW()),
  ('mod_mb_gle',    'mfr_mercedes', 'GLE',        'gle',        'PUBLISHED', NOW(), NOW()),
  ('mod_mb_gla',    'mfr_mercedes', 'GLA',        'gla',        'PUBLISHED', NOW(), NOW()),
  ('mod_mb_cla',    'mfr_mercedes', 'CLA',        'cla',        'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_mb_c_w205',  'mod_mb_c', 'C-Klasse (W205)',   'W205', 'w205', 'bt_limousine', 2014, 2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_c_w206',  'mod_mb_c', 'C-Klasse (W206)',   'W206', 'w206', 'bt_limousine', 2021, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_e_w213',  'mod_mb_e', 'E-Klasse (W213)',   'W213', 'w213', 'bt_limousine', 2016, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_e_w214',  'mod_mb_e', 'E-Klasse (W214)',   'W214', 'w214', 'bt_limousine', 2023, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_a_w177',  'mod_mb_a', 'A-Klasse (W177)',   'W177', 'w177', 'bt_kompakt',   2018, 2025, 'PUBLISHED', NOW(), NOW()),
  ('gen_mb_glc_x254','mod_mb_glc','GLC (X254)',        'X254', 'x254', 'bt_suv',       2022, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_gle_v167','mod_mb_gle','GLE (V167)',        'V167', 'v167', 'bt_suv',       2019, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_s_w223',  'mod_mb_s', 'S-Klasse (W223)',   'W223', 'w223', 'bt_limousine', 2020, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_gla_h247','mod_mb_gla','GLA (H247)',        'H247', 'h247', 'bt_suv',       2020, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_mb_cla_c118','mod_mb_cla','CLA (C118)',        'C118', 'c118', 'bt_coupe',     2019, NULL,  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- VOLKSWAGEN -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_vw_golf',    'mfr_vw', 'Golf',      'golf',      'PUBLISHED', NOW(), NOW()),
  ('mod_vw_passat',  'mfr_vw', 'Passat',    'passat',    'PUBLISHED', NOW(), NOW()),
  ('mod_vw_tiguan',  'mfr_vw', 'Tiguan',    'tiguan',    'PUBLISHED', NOW(), NOW()),
  ('mod_vw_polo',    'mfr_vw', 'Polo',      'polo',      'PUBLISHED', NOW(), NOW()),
  ('mod_vw_troc',    'mfr_vw', 'T-Roc',     't-roc',     'PUBLISHED', NOW(), NOW()),
  ('mod_vw_id3',     'mfr_vw', 'ID.3',      'id-3',      'PUBLISHED', NOW(), NOW()),
  ('mod_vw_id4',     'mfr_vw', 'ID.4',      'id-4',      'PUBLISHED', NOW(), NOW()),
  ('mod_vw_touran',  'mfr_vw', 'Touran',    'touran',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_vw_golf7',   'mod_vw_golf',   'Golf VII',        'AU', 'vii',  'bt_kompakt',   2012, 2020, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_golf8',   'mod_vw_golf',   'Golf VIII',       'CD', 'viii', 'bt_kompakt',   2019, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_passat_b8','mod_vw_passat','Passat (B8)',      'B8', 'b8',  'bt_limousine', 2014, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_passat_b9','mod_vw_passat','Passat (B9)',      'B9', 'b9',  'bt_kombi',     2023, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_tiguan_ad','mod_vw_tiguan','Tiguan (AD)',      'AD', 'ad',  'bt_suv',       2016, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_tiguan_3', 'mod_vw_tiguan','Tiguan III',       NULL, 'iii', 'bt_suv',       2024, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_polo_aw',  'mod_vw_polo',  'Polo VI (AW)',    'AW', 'aw',  'bt_kleinwagen',2017, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_troc_a1',  'mod_vw_troc',  'T-Roc (A11)',     'A11','a11', 'bt_suv',       2017, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_id3_e1',   'mod_vw_id3',   'ID.3 (E11)',      'E11','e11', 'bt_kompakt',   2020, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_vw_id4_e2',   'mod_vw_id4',   'ID.4 (E21)',      'E21','e21', 'bt_suv',       2021, NULL,  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- AUDI -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_audi_a3',    'mfr_audi', 'A3',       'a3',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_a4',    'mfr_audi', 'A4',       'a4',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_a6',    'mfr_audi', 'A6',       'a6',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_q3',    'mfr_audi', 'Q3',       'q3',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_q5',    'mfr_audi', 'Q5',       'q5',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_q7',    'mfr_audi', 'Q7',       'q7',       'PUBLISHED', NOW(), NOW()),
  ('mod_audi_etron', 'mfr_audi', 'e-tron GT','e-tron-gt','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_audi_a3_8y',  'mod_audi_a3', 'A3 (8Y)',     '8Y', '8y', 'bt_kompakt',   2020, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_audi_a4_b9',  'mod_audi_a4', 'A4 (B9)',     'B9', 'b9', 'bt_limousine', 2015, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_a5_f5',  'mod_audi_a4', 'A5 (F5)',     'F5', 'f5', 'bt_limousine', 2023, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_audi_a6_c8',  'mod_audi_a6', 'A6 (C8)',     'C8', 'c8', 'bt_limousine', 2018, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_audi_q3_f3',  'mod_audi_q3', 'Q3 (F3)',     'F3', 'f3', 'bt_suv',       2018, NULL,  'PUBLISHED', NOW(), NOW()),
  ('gen_audi_q5_fy',  'mod_audi_q5', 'Q5 (FY)',     'FY', 'fy', 'bt_suv',       2017, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_audi_q7_4m',  'mod_audi_q7', 'Q7 (4M)',     '4M', '4m', 'bt_suv',       2015, NULL,  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- PORSCHE -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_por_911',     'mfr_porsche', '911',      '911',      'PUBLISHED', NOW(), NOW()),
  ('mod_por_cayenne', 'mfr_porsche', 'Cayenne',  'cayenne',  'PUBLISHED', NOW(), NOW()),
  ('mod_por_macan',   'mfr_porsche', 'Macan',    'macan',    'PUBLISHED', NOW(), NOW()),
  ('mod_por_taycan',  'mfr_porsche', 'Taycan',   'taycan',   'PUBLISHED', NOW(), NOW()),
  ('mod_por_panamera','mfr_porsche', 'Panamera', 'panamera', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_por_911_992',    'mod_por_911',     '911 (992)',     '992',  '992',  'bt_sportwagen', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_por_cayenne_e3', 'mod_por_cayenne', 'Cayenne (E3)',  'E3',   'e3',   'bt_suv',        2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_por_macan_95b',  'mod_por_macan',   'Macan (95B)',   '95B',  '95b',  'bt_suv',        2014, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_por_taycan_y1a', 'mod_por_taycan',  'Taycan (Y1A)',  'Y1A',  'y1a',  'bt_limousine',  2019, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- OPEL -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_opel_corsa',  'mfr_opel', 'Corsa',    'corsa',    'PUBLISHED', NOW(), NOW()),
  ('mod_opel_astra',  'mfr_opel', 'Astra',    'astra',    'PUBLISHED', NOW(), NOW()),
  ('mod_opel_mokka',  'mfr_opel', 'Mokka',    'mokka',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_opel_corsa_f',  'mod_opel_corsa', 'Corsa F',   'F', 'f', 'bt_kleinwagen', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_opel_astra_l',  'mod_opel_astra', 'Astra L',   'L', 'l', 'bt_kompakt',    2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- TOYOTA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_toy_corolla',  'mfr_toyota', 'Corolla',  'corolla',  'PUBLISHED', NOW(), NOW()),
  ('mod_toy_yaris',    'mfr_toyota', 'Yaris',    'yaris',    'PUBLISHED', NOW(), NOW()),
  ('mod_toy_rav4',     'mfr_toyota', 'RAV4',     'rav4',     'PUBLISHED', NOW(), NOW()),
  ('mod_toy_supra',    'mfr_toyota', 'GR Supra', 'gr-supra', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_toy_corolla_e210', 'mod_toy_corolla', 'Corolla (E210)', 'E210', 'e210', 'bt_kompakt',   2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_toy_yaris_xp210',  'mod_toy_yaris',   'Yaris (XP210)',  'XP210','xp210','bt_kleinwagen', 2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_toy_rav4_xa50',    'mod_toy_rav4',    'RAV4 (XA50)',    'XA50', 'xa50', 'bt_suv',        2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_toy_supra_a90',    'mod_toy_supra',   'GR Supra (A90)', 'A90',  'a90',  'bt_sportwagen', 2019, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- ŠKODA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_sk_octavia', 'mfr_skoda', 'Octavia',  'octavia',  'PUBLISHED', NOW(), NOW()),
  ('mod_sk_superb',  'mfr_skoda', 'Superb',   'superb',   'PUBLISHED', NOW(), NOW()),
  ('mod_sk_kodiaq',  'mfr_skoda', 'Kodiaq',   'kodiaq',   'PUBLISHED', NOW(), NOW()),
  ('mod_sk_fabia',   'mfr_skoda', 'Fabia',    'fabia',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_sk_octavia_nx', 'mod_sk_octavia', 'Octavia IV (NX)', 'NX', 'nx', 'bt_kompakt',   2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_sk_superb_3v',  'mod_sk_superb',  'Superb III (3V)', '3V', '3v', 'bt_limousine', 2015, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_sk_kodiaq_ns',  'mod_sk_kodiaq',  'Kodiaq (NS)',     'NS', 'ns', 'bt_suv',       2017, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_sk_fabia_pj',   'mod_sk_fabia',   'Fabia IV (PJ)',   'PJ', 'pj', 'bt_kleinwagen',2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- HYUNDAI -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_hy_i20',    'mfr_hyundai', 'i20',     'i20',     'PUBLISHED', NOW(), NOW()),
  ('mod_hy_i30',    'mfr_hyundai', 'i30',     'i30',     'PUBLISHED', NOW(), NOW()),
  ('mod_hy_tucson', 'mfr_hyundai', 'Tucson',  'tucson',  'PUBLISHED', NOW(), NOW()),
  ('mod_hy_ioniq5', 'mfr_hyundai', 'IONIQ 5', 'ioniq-5', 'PUBLISHED', NOW(), NOW()),
  ('mod_hy_kona',   'mfr_hyundai', 'Kona',    'kona',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_hy_tucson_nx4', 'mod_hy_tucson', 'Tucson (NX4)',  'NX4', 'nx4', 'bt_suv',       2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_hy_ioniq5_ne',  'mod_hy_ioniq5', 'IONIQ 5 (NE)',  'NE',  'ne',  'bt_suv',       2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_hy_i30_pd',     'mod_hy_i30',    'i30 (PD)',      'PD',  'pd',  'bt_kompakt',   2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_hy_kona_sz',    'mod_hy_kona',   'Kona (SZ)',     'SZ',  'sz',  'bt_suv',       2023, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- TESLA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_ts_model3', 'mfr_tesla', 'Model 3', 'model-3', 'PUBLISHED', NOW(), NOW()),
  ('mod_ts_modely', 'mfr_tesla', 'Model Y', 'model-y', 'PUBLISHED', NOW(), NOW()),
  ('mod_ts_models', 'mfr_tesla', 'Model S', 'model-s', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_ts_model3_hr', 'mod_ts_model3', 'Model 3 Highland',  NULL, 'highland', 'bt_limousine', 2023, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ts_modely_1',  'mod_ts_modely', 'Model Y',           NULL, 'gen1',     'bt_suv',       2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ts_models_p',  'mod_ts_models', 'Model S Plaid',     NULL, 'plaid',    'bt_limousine', 2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- FORD -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_ford_focus',  'mfr_ford', 'Focus',    'focus',    'PUBLISHED', NOW(), NOW()),
  ('mod_ford_fiesta', 'mfr_ford', 'Fiesta',   'fiesta',   'PUBLISHED', NOW(), NOW()),
  ('mod_ford_kuga',   'mfr_ford', 'Kuga',     'kuga',     'PUBLISHED', NOW(), NOW()),
  ('mod_ford_puma',   'mfr_ford', 'Puma',     'puma',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_ford_focus_mk4', 'mod_ford_focus',  'Focus Mk4',    'Mk4', 'mk4', 'bt_kompakt',   2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ford_kuga_mk3',  'mod_ford_kuga',   'Kuga III',     NULL,  'iii', 'bt_suv',       2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ford_puma_1',    'mod_ford_puma',   'Puma',         NULL,  'gen1','bt_crossover',  2019, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- VOLVO -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_volvo_xc40', 'mfr_volvo', 'XC40',  'xc40',  'PUBLISHED', NOW(), NOW()),
  ('mod_volvo_xc60', 'mfr_volvo', 'XC60',  'xc60',  'PUBLISHED', NOW(), NOW()),
  ('mod_volvo_xc90', 'mfr_volvo', 'XC90',  'xc90',  'PUBLISHED', NOW(), NOW()),
  ('mod_volvo_v60',  'mfr_volvo', 'V60',   'v60',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_volvo_xc40_1', 'mod_volvo_xc40', 'XC40',      NULL, 'gen1', 'bt_suv',   2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_volvo_xc60_2', 'mod_volvo_xc60', 'XC60 II',   NULL, 'ii',   'bt_suv',   2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_volvo_xc90_2', 'mod_volvo_xc90', 'XC90 II',   NULL, 'ii',   'bt_suv',   2014, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- KIA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_kia_ceed',    'mfr_kia', 'Ceed',     'ceed',     'PUBLISHED', NOW(), NOW()),
  ('mod_kia_sportage','mfr_kia', 'Sportage', 'sportage', 'PUBLISHED', NOW(), NOW()),
  ('mod_kia_ev6',     'mfr_kia', 'EV6',      'ev6',      'PUBLISHED', NOW(), NOW()),
  ('mod_kia_niro',    'mfr_kia', 'Niro',     'niro',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_kia_sportage_nq5', 'mod_kia_sportage','Sportage (NQ5)', 'NQ5', 'nq5', 'bt_suv',     2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_kia_ev6_cv',       'mod_kia_ev6',     'EV6 (CV)',       'CV',  'cv',  'bt_crossover',2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_kia_niro_de3',     'mod_kia_niro',    'Niro (DE3)',     'DE3', 'de3', 'bt_suv',      2022, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- RENAULT -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_ren_clio',   'mfr_renault', 'Clio',    'clio',    'PUBLISHED', NOW(), NOW()),
  ('mod_ren_megane', 'mfr_renault', 'Mégane',  'megane',  'PUBLISHED', NOW(), NOW()),
  ('mod_ren_captur', 'mfr_renault', 'Captur',  'captur',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_ren_clio5',    'mod_ren_clio',   'Clio V',        NULL, 'v',    'bt_kleinwagen', 2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ren_megane_ev','mod_ren_megane', 'Mégane E-Tech',  NULL, 'etech','bt_kompakt',    2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ren_captur2',  'mod_ren_captur', 'Captur II',      NULL, 'ii',   'bt_crossover',  2019, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- SEAT / CUPRA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_seat_leon',    'mfr_seat', 'Leon',     'leon',     'PUBLISHED', NOW(), NOW()),
  ('mod_seat_ibiza',   'mfr_seat', 'Ibiza',    'ibiza',    'PUBLISHED', NOW(), NOW()),
  ('mod_cupra_formentor','mfr_cupra','Formentor','formentor','PUBLISHED', NOW(), NOW()),
  ('mod_cupra_born',   'mfr_cupra', 'Born',    'born',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_seat_leon4',      'mod_seat_leon',       'Leon IV (KL)',     'KL', 'kl',   'bt_kompakt',  2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_cupra_formentor1','mod_cupra_formentor', 'Formentor',        NULL, 'gen1', 'bt_crossover',2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_cupra_born1',     'mod_cupra_born',      'Born',             NULL, 'gen1', 'bt_kompakt',  2021, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- DACIA -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_dacia_sandero', 'mfr_dacia', 'Sandero',  'sandero',  'PUBLISHED', NOW(), NOW()),
  ('mod_dacia_duster',  'mfr_dacia', 'Duster',   'duster',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_dacia_sandero3', 'mod_dacia_sandero','Sandero III', NULL, 'iii', 'bt_kleinwagen', 2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_dacia_duster3',  'mod_dacia_duster', 'Duster III',  NULL, 'iii', 'bt_suv',        2024, NULL, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ----- MINI -----
INSERT INTO "Model" (id, "manufacturerId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('mod_mini_cooper', 'mfr_mini', 'Cooper',    'cooper',    'PUBLISHED', NOW(), NOW()),
  ('mod_mini_country','mfr_mini', 'Countryman','countryman','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, "modelId", name, code, slug, "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_mini_cooper_f56', 'mod_mini_cooper',  'Cooper (F56)',      'F56', 'f56', 'bt_kleinwagen', 2014, 2024, 'PUBLISHED', NOW(), NOW()),
  ('gen_mini_country_f60','mod_mini_country', 'Countryman (F60)',  'F60', 'f60', 'bt_crossover',  2017, 2024, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MOTOREN (nur sicher belegbare Spezifikationen)
-- =============================================================================

-- BMW Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_bmw_b47d20',  'mfr_bmw', '2.0d (B47D20)',   'B47D20', 1995, 4, 'DIESEL',  'TURBOCHARGED', 140, 400, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2014, NULL),
  ('eng_bmw_b48b20',  'mfr_bmw', '2.0i (B48B20)',   'B48B20', 1998, 4, 'PETROL',  'TURBOCHARGED', 135, 300, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2014, NULL),
  ('eng_bmw_b58b30',  'mfr_bmw', '3.0i (B58B30)',   'B58B30', 2998, 6, 'PETROL',  'TURBOCHARGED', 285, 500, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2015, NULL),
  ('eng_bmw_b57d30',  'mfr_bmw', '3.0d (B57D30)',   'B57D30', 2993, 6, 'DIESEL',  'TURBOCHARGED', 195, 620, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2016, NULL),
  ('eng_bmw_b38b15',  'mfr_bmw', '1.5i (B38B15)',   'B38B15', 1499, 3, 'PETROL',  'TURBOCHARGED', 103, 220, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2014, NULL)
ON CONFLICT (id) DO NOTHING;

-- Mercedes Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_mb_m254',   'mfr_mercedes', '2.0i (M254)',    'M254',  1999, 4, 'PETROL',  'TURBOCHARGED', 150, 300, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2021, NULL),
  ('eng_mb_om654',  'mfr_mercedes', '2.0d (OM654)',   'OM654', 1950, 4, 'DIESEL',  'TURBOCHARGED', 147, 440, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2016, NULL),
  ('eng_mb_m256',   'mfr_mercedes', '3.0i (M256)',    'M256',  2999, 6, 'PETROL',  'TURBOCHARGED', 270, 500, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2017, NULL),
  ('eng_mb_m139',   'mfr_mercedes', '2.0i AMG (M139)','M139',  1991, 4, 'PETROL',  'TURBOCHARGED', 310, 500, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2019, NULL)
ON CONFLICT (id) DO NOTHING;

-- VW/Konzern Motoren (EA211, EA888, EA288)
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_vw_ea211_10tsi', 'mfr_vw', '1.0 TSI (EA211)',  'EA211', 999,  3, 'PETROL', 'TURBOCHARGED', 81,  200, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2015, NULL),
  ('eng_vw_ea888_20tsi', 'mfr_vw', '2.0 TSI (EA888)',  'EA888', 1984, 4, 'PETROL', 'TURBOCHARGED', 140, 320, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2012, NULL),
  ('eng_vw_ea288_20tdi', 'mfr_vw', '2.0 TDI (EA288)',  'EA288', 1968, 4, 'DIESEL', 'TURBOCHARGED', 110, 360, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2012, NULL),
  ('eng_vw_ea211_15tsi', 'mfr_vw', '1.5 TSI (EA211evo)','EA211evo',1498,4,'PETROL','TURBOCHARGED', 110, 250, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2017, NULL),
  ('eng_vw_app310',      'mfr_vw', 'Elektromotor (APP310)', 'APP310', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 150, 310, 'PUBLISHED', NOW(), NOW(), NULL, 2020, NULL),
  ('eng_vw_app550',      'mfr_vw', 'Elektromotor (APP550)', 'APP550', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 210, 310, 'PUBLISHED', NOW(), NOW(), NULL, 2021, NULL)
ON CONFLICT (id) DO NOTHING;

-- Porsche Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_por_9a2evo', 'mfr_porsche', '3.0 Boxer Turbo', '9A2evo', 2981, 6, 'PETROL', 'TURBOCHARGED', 283, 450, 'PUBLISHED', NOW(), NOW(), 'Boxer', 2019, NULL),
  ('eng_por_taycan_pm','mfr_porsche','Permanentmagnet-Synchron (Taycan)','J1PM',NULL,NULL, 'ELECTRIC','ELECTRIC_DRIVE', 320, 640, 'PUBLISHED', NOW(), NOW(), NULL, 2019, NULL)
ON CONFLICT (id) DO NOTHING;

-- Toyota Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_toy_m20afks', 'mfr_toyota', '2.0 Hybrid (M20A-FXS)', 'M20A-FXS', 1987, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 112, 190, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2018, NULL),
  ('eng_toy_a25afxs', 'mfr_toyota', '2.5 Hybrid (A25A-FXS)', 'A25A-FXS', 2487, 4, 'HYBRID_PETROL', 'NATURALLY_ASPIRATED', 131, 221, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2018, NULL)
ON CONFLICT (id) DO NOTHING;

-- Hyundai / Kia Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt", "cylinderLayout", "yearFrom", "yearTo") VALUES
  ('eng_hy_smartstream16', 'mfr_hyundai', '1.6 T-GDI Smartstream', 'G4FP', 1598, 4, 'PETROL', 'TURBOCHARGED', 132, 265, 'PUBLISHED', NOW(), NOW(), 'Reihe', 2019, NULL),
  ('eng_hy_pe_em',         'mfr_hyundai', 'Permanentmagnet 168 kW (E-GMP RWD)', 'PE', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 168, 350, 'PUBLISHED', NOW(), NOW(), NULL, 2021, NULL),
  ('eng_hy_pe_em_rr',      'mfr_hyundai', 'Permanentmagnet 225 kW (E-GMP RR)', 'PE-RR', NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 225, 350, 'PUBLISHED', NOW(), NOW(), NULL, 2021, NULL)
ON CONFLICT (id) DO NOTHING;

-- Tesla Motoren
INSERT INTO "Engine" (id, "manufacturerId", name, code, "displacementCcm", cylinders, "fuelType", aspiration, "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('eng_ts_3sr_rwd',  'mfr_tesla', 'Model 3 Standard Range RWD',  NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 208, 420, 'PUBLISHED', NOW(), NOW()),
  ('eng_ts_3lr_awd',  'mfr_tesla', 'Model 3 Long Range AWD',      NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 366, 660, 'PUBLISHED', NOW(), NOW()),
  ('eng_ts_y_rwd',    'mfr_tesla', 'Model Y RWD',                  NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 220, 420, 'PUBLISHED', NOW(), NOW()),
  ('eng_ts_s_plaid',  'mfr_tesla', 'Model S Plaid Tri-Motor',      NULL, NULL, NULL, 'ELECTRIC', 'ELECTRIC_DRIVE', 760, 1420,'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- POWERTRAIN COMBINATIONS (Motorvarianten pro Generation)
-- =============================================================================

-- BMW 3er G20
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('ptc_bmw_320i_g20',  'gen_bmw_3er_g20', 'eng_bmw_b48b20', 'tr_aut8', 'REAR',  2019, 135, 300, 'PUBLISHED', NOW(), NOW()),
  ('ptc_bmw_320d_g20',  'gen_bmw_3er_g20', 'eng_bmw_b47d20', 'tr_aut8', 'REAR',  2019, 140, 400, 'PUBLISHED', NOW(), NOW()),
  ('ptc_bmw_m340i_g20', 'gen_bmw_3er_g20', 'eng_bmw_b58b30', 'tr_aut8', 'ALL',   2019, 285, 500, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 1er F40
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_bmw_118i_f40',  'gen_bmw_1er_f40', 'eng_bmw_b38b15', 'tr_dct7', 'FRONT', 2019, 103, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes C-Klasse W206
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('ptc_mb_c200_w206', 'gen_mb_c_w206', 'eng_mb_m254',  'tr_aut9', 'REAR',  2021, 150, 300, 'PUBLISHED', NOW(), NOW()),
  ('ptc_mb_c220d_w206','gen_mb_c_w206', 'eng_mb_om654', 'tr_aut9', 'REAR',  2021, 147, 440, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Golf VIII
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('ptc_vw_golf8_10tsi','gen_vw_golf8', 'eng_vw_ea211_10tsi', 'tr_man6', 'FRONT', 2019, 81,  200, 'PUBLISHED', NOW(), NOW()),
  ('ptc_vw_golf8_15tsi','gen_vw_golf8', 'eng_vw_ea211_15tsi', 'tr_dsg7', 'FRONT', 2019, 110, 250, 'PUBLISHED', NOW(), NOW()),
  ('ptc_vw_golf8_20tdi','gen_vw_golf8', 'eng_vw_ea288_20tdi', 'tr_dsg7', 'FRONT', 2019, 110, 360, 'PUBLISHED', NOW(), NOW()),
  ('ptc_vw_golf8_gti',  'gen_vw_golf8', 'eng_vw_ea888_20tsi', 'tr_dsg7', 'FRONT', 2020, 180, 370, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW ID.3
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_vw_id3_pro',   'gen_vw_id3_e1', 'eng_vw_app310', 'tr_red1', 'REAR', 2020, 150, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW ID.4
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_vw_id4_pro',   'gen_vw_id4_e2', 'eng_vw_app550', 'tr_red1', 'REAR', 2021, 210, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai IONIQ 5
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_hy_ioniq5_rwd', 'gen_hy_ioniq5_ne', 'eng_hy_pe_em',    'tr_red1', 'REAR', 2021, 168, 'PUBLISHED', NOW(), NOW()),
  ('ptc_hy_ioniq5_awd', 'gen_hy_ioniq5_ne', 'eng_hy_pe_em_rr', 'tr_red1', 'ALL',  2021, 225, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model 3 Highland
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_ts_m3_sr', 'gen_ts_model3_hr', 'eng_ts_3sr_rwd', 'tr_red1', 'REAR', 2023, 208, 'PUBLISHED', NOW(), NOW()),
  ('ptc_ts_m3_lr', 'gen_ts_model3_hr', 'eng_ts_3lr_awd', 'tr_red1', 'ALL',  2023, 366, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model Y
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_ts_my_rwd', 'gen_ts_modely_1', 'eng_ts_y_rwd', 'tr_red1', 'REAR', 2020, 220, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche 911 (992)
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('ptc_por_911_carrera', 'gen_por_911_992', 'eng_por_9a2evo', 'tr_dct8', 'REAR', 2019, 283, 450, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Taycan
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_por_taycan_4s', 'gen_por_taycan_y1a', 'eng_por_taycan_pm', 'tr_red2', 'ALL', 2019, 320, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota Corolla Hybrid
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_toy_corolla_20h', 'gen_toy_corolla_e210', 'eng_toy_m20afks', 'tr_cvt', 'FRONT', 2018, 112, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota RAV4 Hybrid
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", status, "publishedAt", "updatedAt") VALUES
  ('ptc_toy_rav4_25h', 'gen_toy_rav4_xa50', 'eng_toy_a25afxs', 'tr_cvt', 'FRONT', 2018, 131, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai Tucson
INSERT INTO "PowertrainCombination" (id, "generationId", "engineId", "transmissionId", "driveType", "yearFrom", "powerKw", "torqueNm", status, "publishedAt", "updatedAt") VALUES
  ('ptc_hy_tucson_16t', 'gen_hy_tucson_nx4', 'eng_hy_smartstream16', 'tr_dct7', 'FRONT', 2020, 132, 265, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ===== ERGÄNZUNG: FEHLENDE HERSTELLER-MODELLE UND GENERATIONEN =====

-- CITROËN
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_c3',        'c3',          'C3',          'mfr_citroen', 'PUBLISHED', NOW(), NOW()),
  ('mod_c4',        'c4',          'C4',          'mfr_citroen', 'PUBLISHED', NOW(), NOW()),
  ('mod_c4x',       'c4-x',        'C4 X',        'mfr_citroen', 'PUBLISHED', NOW(), NOW()),
  ('mod_c5_air',    'c5-aircross',  'C5 Aircross', 'mfr_citroen', 'PUBLISHED', NOW(), NOW()),
  ('mod_berlingo',  'berlingo',     'Berlingo',    'mfr_citroen', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_c3_3',       'III (SC)',  'iii-sc',  'mod_c3',       'bt_kleinwagen', 2016, 'PUBLISHED', NOW(), NOW()),
  ('gen_c4_3',       'III',      'iii',      'mod_c4',       'bt_kompakt',    2020, 'PUBLISHED', NOW(), NOW()),
  ('gen_c4x_1',      'I',        'i',        'mod_c4x',      'bt_limousine',  2022, 'PUBLISHED', NOW(), NOW()),
  ('gen_c5air_1',    'I',        'i',        'mod_c5_air',   'bt_suv',        2018, 'PUBLISHED', NOW(), NOW()),
  ('gen_berlingo_3', 'III (K9)', 'iii-k9',   'mod_berlingo', 'bt_van',        2018, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS AUTOMOBILES
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_ds3_ct', 'ds-3-crossback', 'DS 3 Crossback', 'mfr_ds', 'PUBLISHED', NOW(), NOW()),
  ('mod_ds4_2',  'ds-4',           'DS 4',           'mfr_ds', 'PUBLISHED', NOW(), NOW()),
  ('mod_ds7',    'ds-7',           'DS 7',           'mfr_ds', 'PUBLISHED', NOW(), NOW()),
  ('mod_ds9',    'ds-9',           'DS 9',           'mfr_ds', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_ds3cb_1', 'I',  'i',  'mod_ds3_ct', 'bt_crossover', 2018, 'PUBLISHED', NOW(), NOW()),
  ('gen_ds4_2',   'II', 'ii', 'mod_ds4_2',  'bt_kompakt',   2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_ds7_1',   'I',  'i',  'mod_ds7',    'bt_suv',       2017, 'PUBLISHED', NOW(), NOW()),
  ('gen_ds9_1',   'I',  'i',  'mod_ds9',    'bt_limousine', 2020, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- FIAT
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_500e',   '500-electric', '500 electric', 'mfr_fiat', 'PUBLISHED', NOW(), NOW()),
  ('mod_panda',  'panda',        'Panda',        'mfr_fiat', 'PUBLISHED', NOW(), NOW()),
  ('mod_tipo',   'tipo',         'Tipo',         'mfr_fiat', 'PUBLISHED', NOW(), NOW()),
  ('mod_ducato', 'ducato',       'Ducato',       'mfr_fiat', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_500e_1',   'I (332)',   'i-332',   'mod_500e',  'bt_kleinwagen', 2020, 'PUBLISHED', NOW(), NOW()),
  ('gen_panda_3',  'III (319)', 'iii-319', 'mod_panda', 'bt_kleinwagen', 2011, 'PUBLISHED', NOW(), NOW()),
  ('gen_tipo_2',   'II (356)',  'ii-356',  'mod_tipo',  'bt_kompakt',    2015, 'PUBLISHED', NOW(), NOW()),
  ('gen_ducato_3', 'III (250)', 'iii-250', 'mod_ducato','bt_van',        2006, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- HONDA
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_civic_h', 'civic',   'Civic',   'mfr_honda', 'PUBLISHED', NOW(), NOW()),
  ('mod_hrv',     'hr-v',    'HR-V',    'mfr_honda', 'PUBLISHED', NOW(), NOW()),
  ('mod_crv',     'cr-v',    'CR-V',    'mfr_honda', 'PUBLISHED', NOW(), NOW()),
  ('mod_jazz',    'jazz',    'Jazz',    'mfr_honda', 'PUBLISHED', NOW(), NOW()),
  ('mod_honda_e', 'honda-e', 'Honda e', 'mfr_honda', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_civic_11', 'XI (FL)', 'xi-fl', 'mod_civic_h', 'bt_kompakt',    2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_hrv_3',    'III',     'iii',   'mod_hrv',     'bt_crossover',  2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_crv_6',    'VI',      'vi',    'mod_crv',     'bt_suv',        2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_jazz_4',   'IV (GR)', 'iv-gr', 'mod_jazz',    'bt_kleinwagen', 2020, 'PUBLISHED', NOW(), NOW()),
  ('gen_hondae_1', 'I',       'i',     'mod_honda_e', 'bt_kleinwagen', 2020, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- MAZDA
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_mazda2', 'mazda2', 'Mazda2', 'mfr_mazda', 'PUBLISHED', NOW(), NOW()),
  ('mod_mazda3', 'mazda3', 'Mazda3', 'mfr_mazda', 'PUBLISHED', NOW(), NOW()),
  ('mod_cx5',    'cx-5',   'CX-5',   'mfr_mazda', 'PUBLISHED', NOW(), NOW()),
  ('mod_cx30',   'cx-30',  'CX-30',  'mfr_mazda', 'PUBLISHED', NOW(), NOW()),
  ('mod_cx60',   'cx-60',  'CX-60',  'mfr_mazda', 'PUBLISHED', NOW(), NOW()),
  ('mod_mx5',    'mx-5',   'MX-5',   'mfr_mazda', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_mazda2_4', 'IV (DJ)', 'iv-dj', 'mod_mazda2', 'bt_kleinwagen', 2014, 'PUBLISHED', NOW(), NOW()),
  ('gen_mazda3_4', 'IV (BP)', 'iv-bp', 'mod_mazda3', 'bt_kompakt',    2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_cx5_2',    'II (KF)', 'ii-kf', 'mod_cx5',    'bt_suv',        2017, 'PUBLISHED', NOW(), NOW()),
  ('gen_cx30_1',   'I (DM)',  'i-dm',  'mod_cx30',   'bt_crossover',  2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_cx60_1',   'I',       'i',     'mod_cx60',   'bt_suv',        2022, 'PUBLISHED', NOW(), NOW()),
  ('gen_mx5_4',    'IV (ND)', 'iv-nd', 'mod_mx5',    'bt_cabrio',     2015, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- NISSAN
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_qashqai', 'qashqai', 'Qashqai', 'mfr_nissan', 'PUBLISHED', NOW(), NOW()),
  ('mod_juke',    'juke',    'Juke',    'mfr_nissan', 'PUBLISHED', NOW(), NOW()),
  ('mod_leaf',    'leaf',    'Leaf',    'mfr_nissan', 'PUBLISHED', NOW(), NOW()),
  ('mod_xtrail',  'x-trail', 'X-Trail', 'mfr_nissan', 'PUBLISHED', NOW(), NOW()),
  ('mod_ariya',   'ariya',   'Ariya',   'mfr_nissan', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_qashqai_3', 'III (J12)', 'iii-j12', 'mod_qashqai', 'bt_suv',       2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_juke_2',    'II (F16)',  'ii-f16',  'mod_juke',    'bt_crossover', 2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_leaf_2',    'II (ZE1)',  'ii-ze1',  'mod_leaf',    'bt_kompakt',   2017, 'PUBLISHED', NOW(), NOW()),
  ('gen_xtrail_4',  'IV (T33)', 'iv-t33',  'mod_xtrail',  'bt_suv',       2022, 'PUBLISHED', NOW(), NOW()),
  ('gen_ariya_1',   'I',        'i',        'mod_ariya',   'bt_suv',       2022, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- PEUGEOT
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_208',  '208',  '208',  'mfr_peugeot', 'PUBLISHED', NOW(), NOW()),
  ('mod_308',  '308',  '308',  'mfr_peugeot', 'PUBLISHED', NOW(), NOW()),
  ('mod_2008', '2008', '2008', 'mfr_peugeot', 'PUBLISHED', NOW(), NOW()),
  ('mod_3008', '3008', '3008', 'mfr_peugeot', 'PUBLISHED', NOW(), NOW()),
  ('mod_5008', '5008', '5008', 'mfr_peugeot', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_208_2',  'II (P21)',  'ii-p21',  'mod_208',  'bt_kleinwagen', 2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_308_3',  'III (P51)', 'iii-p51', 'mod_308',  'bt_kompakt',    2021, 'PUBLISHED', NOW(), NOW()),
  ('gen_2008_2', 'II (P24)',  'ii-p24',  'mod_2008', 'bt_crossover',  2019, 'PUBLISHED', NOW(), NOW()),
  ('gen_3008_2', 'II (P84)',  'ii-p84',  'mod_3008', 'bt_suv',        2016, 'PUBLISHED', NOW(), NOW()),
  ('gen_5008_2', 'II',        'ii',       'mod_5008', 'bt_suv',        2017, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VOLVO V60 (Generation fehlte)
INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_v60_2', 'II', 'ii', 'mod_volvo_v60', 'bt_kombi', 2018, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Arona (Model + Generation)
INSERT INTO "Model" (id, slug, name, "manufacturerId", status, "publishedAt", "updatedAt") VALUES
  ('mod_seat_arona', 'arona', 'Arona', 'mfr_seat', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", status, "publishedAt", "updatedAt") VALUES
  ('gen_arona_1', 'I', 'i', 'mod_seat_arona', 'bt_crossover', 2017, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== FEHLENDE GENERATIONEN FUER BESTEHENDE MODELLE =====
INSERT INTO "Generation" (id, name, slug, "modelId", "bodyTypeId", "yearFrom", "yearTo", status, "publishedAt", "updatedAt") VALUES
  ('gen_audi_etron_j1',   'e-tron GT (J1)',          'j1',   'mod_audi_etron',   'bt_limousine',  2021, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_2er_u06',     '2er Active Tourer (U06)', 'u06',  'mod_bmw_2er',      'bt_van',        2022, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_bmw_z4_g29',      'Z4 (G29)',                'g29',  'mod_bmw_z4',       'bt_cabrio',     2019, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_ford_fiesta_mk8', 'Fiesta Mk8',              'mk8',  'mod_ford_fiesta',  'bt_kleinwagen', 2017, 2023, 'PUBLISHED', NOW(), NOW()),
  ('gen_hy_i20_bc3',      'i20 (BC3)',               'bc3',  'mod_hy_i20',       'bt_kleinwagen', 2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_kia_ceed_cd',     'Ceed (CD)',               'cd',   'mod_kia_ceed',     'bt_kompakt',    2018, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_opel_mokka_2',    'Mokka II',                'ii',   'mod_opel_mokka',   'bt_crossover',  2020, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_por_panamera_3',  'Panamera (971 II)',       '971-ii','mod_por_panamera','bt_limousine',  2023, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_seat_ibiza_kj',   'Ibiza (KJ)',              'kj',   'mod_seat_ibiza',   'bt_kleinwagen', 2017, NULL, 'PUBLISHED', NOW(), NOW()),
  ('gen_vw_touran_5t',    'Touran (5T)',             '5t',   'mod_vw_touran',    'bt_van',        2015, 2024, 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


COMMIT;
