-- =============================================================================
-- CARONEX Ausstattungsdaten
--
-- Sonderausstattungen, Ausstattungslinien und deren Verfuegbarkeiten.
-- Nur echte, bei den Herstellern bestellbare/bestellbar gewesene Optionen.
-- Quellen: Hersteller-Konfiguratoren, Preislisten, ADAC Autokatalog.
-- =============================================================================

BEGIN;

-- =============================================================================
-- TEIL 1: SONDERAUSSTATTUNGEN (OptionalEquipment)
--
-- Herstelleruebergreifend gaengige Extras. Jede Option ist an einen
-- Hersteller gebunden, weil die Bezeichnungen und Optionscodes
-- herstellerspezifisch sind.
-- =============================================================================

-- ===== BMW SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_bmw_pano',      'mfr_bmw', 'Panorama-Glasdach',           'panorama-glasdach',        '402',  'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_shz',       'mfr_bmw', 'Sitzheizung vorn',            'sitzheizung-vorn',         '494',  'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_shz_hint',  'mfr_bmw', 'Sitzheizung hinten',          'sitzheizung-hinten',       '496',  'Komfort',    'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_skuehl',    'mfr_bmw', 'Sitzbelueftung vorn',         'sitzbelueftung-vorn',      '453',  'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_hud',       'mfr_bmw', 'Head-Up Display',             'head-up-display',          '610',  'Technik',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_leder',     'mfr_bmw', 'Lederausstattung Vernasca',   'lederausstattung-vernasca','LCPH', 'Interieur',  'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_ahk',       'mfr_bmw', 'Anhaengerkupplung schwenkbar','anhaengerkupplung',        '3AC',  'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_harman',    'mfr_bmw', 'Harman Kardon Surround Sound','harman-kardon',            '688',  'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_laser',     'mfr_bmw', 'Laserlicht',                  'laserlicht',               '552',  'Licht',      'Exterieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_parkass',   'mfr_bmw', 'Parking Assistant Plus',      'parking-assistant-plus',   '5DP',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_adapt_fahr','mfr_bmw', 'Adaptives Fahrwerk',          'adaptives-fahrwerk',       '223',  'Fahrwerk',   'Fahrwerk',  'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_drivas',    'mfr_bmw', 'Driving Assistant Professional','driving-assistant-pro',  '5AT',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_wlan',      'mfr_bmw', 'WLAN-Hotspot',                'wlan-hotspot',             '6WD',  'Multimedia', 'Technik',   'LOW',    'LOW',    'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_bmw_standheiz', 'mfr_bmw', 'Standheizung',                'standheizung',             '248',  'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== MERCEDES-BENZ SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_mb_pano',       'mfr_mercedes', 'Panorama-Schiebedach',        'panorama-schiebedach',     'U65',  'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mb_shz',        'mfr_mercedes', 'Sitzheizung vorn',            'sitzheizung-vorn',         '873',  'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mb_skuehl',     'mfr_mercedes', 'Sitzbelueftung vorn',         'sitzbelueftung-vorn',      'P65',  'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_burmester',  'mfr_mercedes', 'Burmester Surround-Soundsystem','burmester-surround',     'P17',  'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mb_hud',        'mfr_mercedes', 'Head-Up Display',             'head-up-display',          'P47',  'Technik',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_multibeam',  'mfr_mercedes', 'MULTIBEAM LED',               'multibeam-led',            'LG1',  'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_ahk',        'mfr_mercedes', 'Anhaengerkupplung schwenkbar','anhaengerkupplung',        'F60',  'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_distronic',  'mfr_mercedes', 'DISTRONIC',                   'distronic',                '233',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mb_luftfed',    'mfr_mercedes', 'AIRMATIC Luftfederung',       'airmatic-luftfederung',    '489',  'Fahrwerk',   'Fahrwerk',  'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_360cam',     'mfr_mercedes', '360-Grad-Kamera',             '360-grad-kamera',          'P44',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mb_standheiz',  'mfr_mercedes', 'Standheizung',                'standheizung',             'U10',  'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mb_ambilicht',  'mfr_mercedes', 'Ambientebeleuchtung 64 Farben','ambientebeleuchtung',     'U30',  'Interieur',  'Interieur', 'MEDIUM', 'MEDIUM', 'COMMON',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== VOLKSWAGEN SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_vw_pano',      'mfr_vw', 'Panorama-Ausstell-/Schiebedach','panorama-schiebedach',   '3FE',  'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_shz',       'mfr_vw', 'Sitzheizung vorn',              'sitzheizung-vorn',       '4A3',  'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vw_leder',     'mfr_vw', 'Lederausstattung',              'lederausstattung',       'N0A',  'Interieur',  'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_hud',       'mfr_vw', 'Head-Up Display',               'head-up-display',        'KS1',  'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_ahk',       'mfr_vw', 'Anhaengerkupplung schwenkbar',  'anhaengerkupplung',      '1M6',  'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_harman',    'mfr_vw', 'Harman Kardon Soundsystem',     'harman-kardon',          '9VD',  'Multimedia', 'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_led_mat',   'mfr_vw', 'IQ.LIGHT LED-Matrixscheinwerfer','iq-light-matrix',       '8IT',  'Licht',      'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vw_travelass', 'mfr_vw', 'Travel Assist',                 'travel-assist',          '2Q1',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vw_standheiz', 'mfr_vw', 'Standheizung',                  'standheizung',           '9M1',  'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vw_360cam',    'mfr_vw', 'Area-View 360-Grad-Kamera',     'area-view-360',          'KA2',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== AUDI SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_audi_pano',     'mfr_audi', 'Panorama-Glasdach',            'panorama-glasdach',       'PCZ',  'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_audi_shz',      'mfr_audi', 'Sitzheizung vorn',             'sitzheizung-vorn',        '4A3',  'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_audi_skuehl',   'mfr_audi', 'Sitzbelueftung vorn',          'sitzbelueftung-vorn',     '4A4',  'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_audi_bang',     'mfr_audi', 'Bang & Olufsen 3D Klang',      'bang-olufsen-3d',         '9VJ',  'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_audi_hud',      'mfr_audi', 'Head-Up Display',              'head-up-display',         'KS1',  'Technik',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_audi_matrix',   'mfr_audi', 'Matrix LED-Scheinwerfer',      'matrix-led',              '8G4',  'Licht',      'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_audi_ahk',      'mfr_audi', 'Anhaengerkupplung schwenkbar', 'anhaengerkupplung',       '1M6',  'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_audi_virtcp',   'mfr_audi', 'Audi virtual cockpit plus',    'virtual-cockpit-plus',    '9S9',  'Technik',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_audi_assist',   'mfr_audi', 'Assistenzpaket Tour',          'assistenzpaket-tour',     'PCM',  'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_audi_luftfed',  'mfr_audi', 'Adaptive Luftfederung',        'adaptive-luftfederung',   '1BK',  'Fahrwerk',   'Fahrwerk',  'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_audi_standheiz','mfr_audi', 'Standheizung',                 'standheizung',            '9AQ',  'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== PORSCHE SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_por_pano',       'mfr_porsche', 'Panorama-Dachsystem',          'panorama-dachsystem',     'Q2D',  'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_por_shz',        'mfr_porsche', 'Sitzheizung vorn',             'sitzheizung-vorn',        '4A3',  'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_por_skuehl',     'mfr_porsche', 'Sitzbelueftung vorn',          'sitzbelueftung-vorn',     '4D2',  'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_por_bose',       'mfr_porsche', 'BOSE Surround Sound-System',   'bose-surround',           '9VL',  'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_por_burmester',  'mfr_porsche', 'Burmester High-End Surround',  'burmester-high-end',      '9VJ',  'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_por_sport_chrono','mfr_porsche','Sport Chrono Paket',           'sport-chrono-paket',      'XDE',  'Fahrwerk',   'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_por_pasm',       'mfr_porsche', 'PASM Porsche Active Suspension','pasm',                   '1BH',  'Fahrwerk',   'Fahrwerk',  'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_por_pdls',       'mfr_porsche', 'LED-Matrix-Scheinwerfer PDLS+','pdls-plus',               '8J7',  'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_por_hinterachs', 'mfr_porsche', 'Hinterachslenkung',            'hinterachslenkung',       '1BU',  'Fahrwerk',   'Fahrwerk',  'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_por_keramik',    'mfr_porsche', 'PCCB Keramik-Bremsanlage',     'pccb-keramik',            '450',  'Fahrwerk',   'Fahrwerk',  'MEDIUM', 'HIGH',   'RARE',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== TOYOTA SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_toy_shz',       'mfr_toyota', 'Sitzheizung vorn',              'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_toy_skuehl',    'mfr_toyota', 'Sitzbelueftung vorn',           'sitzbelueftung-vorn',     NULL, 'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_toy_jbl',       'mfr_toyota', 'JBL Premium-Soundsystem',       'jbl-premium',             NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_toy_hud',       'mfr_toyota', 'Head-Up Display',               'head-up-display',         NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_toy_pano',      'mfr_toyota', 'Panoramadach',                  'panoramadach',            NULL, 'Komfort',    'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_toy_ahk',       'mfr_toyota', 'Anhaengerkupplung abnehmbar',   'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== HYUNDAI SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_hy_shz',        'mfr_hyundai', 'Sitzheizung vorn',             'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_hy_skuehl',     'mfr_hyundai', 'Sitzbelueftung vorn',          'sitzbelueftung-vorn',     NULL, 'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hy_shz_hint',   'mfr_hyundai', 'Sitzheizung hinten',           'sitzheizung-hinten',      NULL, 'Komfort',    'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hy_pano',       'mfr_hyundai', 'Panorama-Glasdach',            'panorama-glasdach',       NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_hy_bose',       'mfr_hyundai', 'BOSE Premium-Soundsystem',     'bose-premium',            NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hy_hud',        'mfr_hyundai', 'Head-Up Display',              'head-up-display',         NULL, 'Technik',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hy_v2l',        'mfr_hyundai', 'Vehicle-to-Load (V2L)',        'vehicle-to-load',         NULL, 'Technik',    'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_hy_ahk',        'mfr_hyundai', 'Anhaengerkupplung abnehmbar',  'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== TESLA SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_ts_shz',        'mfr_tesla', 'Sitzheizung alle Sitze',       'sitzheizung-alle',         NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_ts_fsd',        'mfr_tesla', 'Full Self-Driving Capability', 'full-self-driving',        NULL, 'Assistenz',  'Technik',   'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ts_ahk',        'mfr_tesla', 'Anhaengerkupplung',            'anhaengerkupplung',        NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ts_weiss_int',  'mfr_tesla', 'Weisses Interieur',            'weisses-interieur',        NULL, 'Interieur',  'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== SKODA SONDERAUSSTATTUNGEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_sk_pano',       'mfr_skoda', 'Panorama-Schiebedach',          'panorama-schiebedach',    NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_sk_shz',        'mfr_skoda', 'Sitzheizung vorn',              'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_sk_canton',     'mfr_skoda', 'Canton Soundsystem',            'canton-soundsystem',      NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_sk_ahk',        'mfr_skoda', 'Anhaengerkupplung schwenkbar',  'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_sk_matrix',     'mfr_skoda', 'Matrix LED-Scheinwerfer',       'matrix-led',              NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_sk_standheiz',  'mfr_skoda', 'Standheizung',                  'standheizung',            NULL, 'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- TEIL 2: AUSSTATTUNGSLINIEN (TrimLine)
--
-- Die offiziellen Ausstattungsvarianten je Generation.
-- =============================================================================

-- BMW 3er (G20/G21)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_bmw_3er_g20_adv',   'gen_bmw_3er_g20', 'Advantage',   'advantage',  'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_3er_g20_sport', 'gen_bmw_3er_g20', 'Sport Line',  'sport-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_3er_g20_lux',   'gen_bmw_3er_g20', 'Luxury Line', 'luxury-line','PUBLISHED', NOW(), NOW()),
  ('tl_bmw_3er_g20_msport','gen_bmw_3er_g20', 'M Sport',     'm-sport',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er (G30/G31)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_bmw_5er_g30_sport', 'gen_bmw_5er_g30', 'Sport Line',  'sport-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_5er_g30_lux',   'gen_bmw_5er_g30', 'Luxury Line', 'luxury-line','PUBLISHED', NOW(), NOW()),
  ('tl_bmw_5er_g30_msport','gen_bmw_5er_g30', 'M Sport',     'm-sport',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er (G60/G61)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_bmw_5er_g60_sport', 'gen_bmw_5er_g60', 'Sport Line',  'sport-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_5er_g60_lux',   'gen_bmw_5er_g60', 'Luxury Line', 'luxury-line','PUBLISHED', NOW(), NOW()),
  ('tl_bmw_5er_g60_msport','gen_bmw_5er_g60', 'M Sport',     'm-sport',    'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_5er_g60_mspro', 'gen_bmw_5er_g60', 'M Sport Pro', 'm-sport-pro','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X3 (G01)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_bmw_x3_g01_adv',   'gen_bmw_x3_g01', 'Advantage',   'advantage',  'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_x3_g01_xline', 'gen_bmw_x3_g01', 'xLine',       'xline',      'PUBLISHED', NOW(), NOW()),
  ('tl_bmw_x3_g01_msport','gen_bmw_x3_g01', 'M Sport',     'm-sport',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes C-Klasse (W206)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_mb_c_w206_avg',   'gen_mb_c_w206', 'Avantgarde',    'avantgarde',  'PUBLISHED', NOW(), NOW()),
  ('tl_mb_c_w206_amg',   'gen_mb_c_w206', 'AMG Line',      'amg-line',    'PUBLISHED', NOW(), NOW()),
  ('tl_mb_c_w206_amgp',  'gen_mb_c_w206', 'AMG Line Premium','amg-line-premium','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes E-Klasse (W214)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_mb_e_w214_avg',   'gen_mb_e_w214', 'Avantgarde',    'avantgarde',  'PUBLISHED', NOW(), NOW()),
  ('tl_mb_e_w214_excl',  'gen_mb_e_w214', 'Exclusive',     'exclusive',   'PUBLISHED', NOW(), NOW()),
  ('tl_mb_e_w214_amg',   'gen_mb_e_w214', 'AMG Line',      'amg-line',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes GLC (X254)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_mb_glc_x254_avg', 'gen_mb_glc_x254', 'Avantgarde',  'avantgarde',  'PUBLISHED', NOW(), NOW()),
  ('tl_mb_glc_x254_amg', 'gen_mb_glc_x254', 'AMG Line',    'amg-line',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Golf VIII
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vw_golf8_life',   'gen_vw_golf8', 'Life',      'life',     'PUBLISHED', NOW(), NOW()),
  ('tl_vw_golf8_style',  'gen_vw_golf8', 'Style',     'style',    'PUBLISHED', NOW(), NOW()),
  ('tl_vw_golf8_rline',  'gen_vw_golf8', 'R-Line',    'r-line',   'PUBLISHED', NOW(), NOW()),
  ('tl_vw_golf8_gti',    'gen_vw_golf8', 'GTI',       'gti',      'PUBLISHED', NOW(), NOW()),
  ('tl_vw_golf8_r',      'gen_vw_golf8', 'R',         'r',        'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Tiguan (AD)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vw_tiguan_life',  'gen_vw_tiguan_ad', 'Life',    'life',   'PUBLISHED', NOW(), NOW()),
  ('tl_vw_tiguan_eleg',  'gen_vw_tiguan_ad', 'Elegance','elegance','PUBLISHED', NOW(), NOW()),
  ('tl_vw_tiguan_rline', 'gen_vw_tiguan_ad', 'R-Line',  'r-line', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Passat (B9)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vw_passat_b9_bus', 'gen_vw_passat_b9', 'Business',  'business', 'PUBLISHED', NOW(), NOW()),
  ('tl_vw_passat_b9_eleg','gen_vw_passat_b9', 'Elegance',  'elegance', 'PUBLISHED', NOW(), NOW()),
  ('tl_vw_passat_b9_rl',  'gen_vw_passat_b9', 'R-Line',    'r-line',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A3 (8Y)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_audi_a3_8y_adv',  'gen_audi_a3_8y',  'Advanced',   'advanced',  'PUBLISHED', NOW(), NOW()),
  ('tl_audi_a3_8y_sline','gen_audi_a3_8y',  'S line',     's-line',    'PUBLISHED', NOW(), NOW()),
  ('tl_audi_a3_8y_ed1',  'gen_audi_a3_8y',  'Edition One','edition-one','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Q5 (FY)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_audi_q5_fy_adv',  'gen_audi_q5_fy',  'Advanced',  'advanced', 'PUBLISHED', NOW(), NOW()),
  ('tl_audi_q5_fy_sline','gen_audi_q5_fy',  'S line',    's-line',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche 911 (992)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_por_911_carrera', 'gen_por_911_992', 'Carrera',   'carrera',  'PUBLISHED', NOW(), NOW()),
  ('tl_por_911_carr_s',  'gen_por_911_992', 'Carrera S', 'carrera-s','PUBLISHED', NOW(), NOW()),
  ('tl_por_911_turbo',   'gen_por_911_992', 'Turbo',     'turbo',    'PUBLISHED', NOW(), NOW()),
  ('tl_por_911_turbo_s', 'gen_por_911_992', 'Turbo S',   'turbo-s',  'PUBLISHED', NOW(), NOW()),
  ('tl_por_911_gt3',     'gen_por_911_992', 'GT3',       'gt3',      'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Cayenne (E3)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_por_cayenne_base','gen_por_cayenne_e3','Cayenne',       'cayenne',      'PUBLISHED', NOW(), NOW()),
  ('tl_por_cayenne_s',   'gen_por_cayenne_e3','Cayenne S',     'cayenne-s',    'PUBLISHED', NOW(), NOW()),
  ('tl_por_cayenne_gts', 'gen_por_cayenne_e3','Cayenne GTS',   'cayenne-gts',  'PUBLISHED', NOW(), NOW()),
  ('tl_por_cayenne_turbo','gen_por_cayenne_e3','Cayenne Turbo','cayenne-turbo','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Octavia IV (NX)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_sk_oct_active',   'gen_sk_octavia_nx', 'Active',       'active',       'PUBLISHED', NOW(), NOW()),
  ('tl_sk_oct_ambition', 'gen_sk_octavia_nx', 'Ambition',     'ambition',     'PUBLISHED', NOW(), NOW()),
  ('tl_sk_oct_style',    'gen_sk_octavia_nx', 'Style',        'style',        'PUBLISHED', NOW(), NOW()),
  ('tl_sk_oct_laurin',   'gen_sk_octavia_nx', 'Laurin & Klement','laurin-klement','PUBLISHED', NOW(), NOW()),
  ('tl_sk_oct_rs',       'gen_sk_octavia_nx', 'RS',           'rs',           'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai Tucson (NX4)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_hy_tuc_select',  'gen_hy_tucson_nx4', 'Select',   'select',  'PUBLISHED', NOW(), NOW()),
  ('tl_hy_tuc_trend',   'gen_hy_tucson_nx4', 'Trend',    'trend',   'PUBLISHED', NOW(), NOW()),
  ('tl_hy_tuc_prime',   'gen_hy_tucson_nx4', 'Prime',    'prime',   'PUBLISHED', NOW(), NOW()),
  ('tl_hy_tuc_nline',   'gen_hy_tucson_nx4', 'N Line',   'n-line',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai IONIQ 5 (NE)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_hy_ioniq5_base',  'gen_hy_ioniq5_ne', 'IONIQ 5',        'ioniq-5',      'PUBLISHED', NOW(), NOW()),
  ('tl_hy_ioniq5_uniq',  'gen_hy_ioniq5_ne', 'Uniq',           'uniq',         'PUBLISHED', NOW(), NOW()),
  ('tl_hy_ioniq5_top',   'gen_hy_ioniq5_ne', 'Techniq',        'techniq',      'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota Corolla (E210)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_toy_cor_comfort', 'gen_toy_corolla_e210', 'Comfort',   'comfort',  'PUBLISHED', NOW(), NOW()),
  ('tl_toy_cor_team_d',  'gen_toy_corolla_e210', 'Team Deutschland','team-deutschland','PUBLISHED', NOW(), NOW()),
  ('tl_toy_cor_club',    'gen_toy_corolla_e210', 'Club',      'club',     'PUBLISHED', NOW(), NOW()),
  ('tl_toy_cor_lounge',  'gen_toy_corolla_e210', 'Lounge',    'lounge',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model 3 Highland
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ts_m3_hl',       'gen_ts_model3_hr', 'Model 3',            'model-3',           'PUBLISHED', NOW(), NOW()),
  ('tl_ts_m3_lr',       'gen_ts_model3_hr', 'Model 3 Long Range', 'model-3-long-range','PUBLISHED', NOW(), NOW()),
  ('tl_ts_m3_perf',     'gen_ts_model3_hr', 'Model 3 Performance','model-3-performance','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model Y
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ts_my_rwd',      'gen_ts_modely_1', 'Model Y',            'model-y',           'PUBLISHED', NOW(), NOW()),
  ('tl_ts_my_lr',       'gen_ts_modely_1', 'Model Y Long Range', 'model-y-long-range','PUBLISHED', NOW(), NOW()),
  ('tl_ts_my_perf',     'gen_ts_modely_1', 'Model Y Performance','model-y-performance','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- TEIL 3: VERFUEGBARKEITEN (OptionAvailability)
--
-- Welche Sonderausstattung bei welcher Generation erhaeltlich war/ist.
-- kind: STANDARD = Serie, OPTIONAL = gegen Aufpreis, PACKAGE_ONLY = nur im Paket
-- =============================================================================

-- BMW 3er (G20): Sitzheizung vorn Serie ab M Sport, sonst optional
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_bmw3_pano',     'opt_bmw_pano',      'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_shz',      'opt_bmw_shz',       'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_skuehl',   'opt_bmw_skuehl',    'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_hud',      'opt_bmw_hud',       'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_leder',    'opt_bmw_leder',     'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_harman',   'opt_bmw_harman',    'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_laser',    'opt_bmw_laser',     'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_parkass',  'opt_bmw_parkass',   'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_drivas',   'opt_bmw_drivas',    'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_ahk',      'opt_bmw_ahk',       'gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_adapt',    'opt_bmw_adapt_fahr','gen_bmw_3er_g20', 'OPTIONAL',  NOW()),
  ('oa_bmw3_standh',   'opt_bmw_standheiz', 'gen_bmw_3er_g20', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X5 (G05)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_bmwx5_pano',    'opt_bmw_pano',      'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_shz',     'opt_bmw_shz',       'gen_bmw_x5_g05',  'STANDARD',  NOW()),
  ('oa_bmwx5_shzh',    'opt_bmw_shz_hint',  'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_skuehl',  'opt_bmw_skuehl',    'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_hud',     'opt_bmw_hud',       'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_leder',   'opt_bmw_leder',     'gen_bmw_x5_g05',  'STANDARD',  NOW()),
  ('oa_bmwx5_harman',  'opt_bmw_harman',    'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_laser',   'opt_bmw_laser',     'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_ahk',     'opt_bmw_ahk',       'gen_bmw_x5_g05',  'OPTIONAL',  NOW()),
  ('oa_bmwx5_adapt',   'opt_bmw_adapt_fahr','gen_bmw_x5_g05',  'STANDARD',  NOW()),
  ('oa_bmwx5_standh',  'opt_bmw_standheiz', 'gen_bmw_x5_g05',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes C-Klasse (W206)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_mbc_pano',      'opt_mb_pano',       'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_shz',       'opt_mb_shz',        'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_skuehl',    'opt_mb_skuehl',     'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_burm',      'opt_mb_burmester',  'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_hud',       'opt_mb_hud',        'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_multibeam', 'opt_mb_multibeam',  'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_distronic', 'opt_mb_distronic',  'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_360',       'opt_mb_360cam',     'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_ambil',     'opt_mb_ambilicht',  'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_ahk',       'opt_mb_ahk',        'gen_mb_c_w206',   'OPTIONAL',  NOW()),
  ('oa_mbc_standh',    'opt_mb_standheiz',  'gen_mb_c_w206',   'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes E-Klasse (W214)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_mbe_pano',      'opt_mb_pano',       'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_shz',       'opt_mb_shz',        'gen_mb_e_w214',   'STANDARD',  NOW()),
  ('oa_mbe_skuehl',    'opt_mb_skuehl',     'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_burm',      'opt_mb_burmester',  'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_hud',       'opt_mb_hud',        'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_multibeam', 'opt_mb_multibeam',  'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_luftfed',   'opt_mb_luftfed',    'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_360',       'opt_mb_360cam',     'gen_mb_e_w214',   'OPTIONAL',  NOW()),
  ('oa_mbe_distronic', 'opt_mb_distronic',  'gen_mb_e_w214',   'STANDARD',  NOW()),
  ('oa_mbe_ambil',     'opt_mb_ambilicht',  'gen_mb_e_w214',   'STANDARD',  NOW()),
  ('oa_mbe_standh',    'opt_mb_standheiz',  'gen_mb_e_w214',   'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Golf VIII
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_vwg8_pano',     'opt_vw_pano',       'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_shz',      'opt_vw_shz',        'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_hud',      'opt_vw_hud',        'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_harman',   'opt_vw_harman',     'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_matrix',   'opt_vw_led_mat',    'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_travel',   'opt_vw_travelass',  'gen_vw_golf8',   'OPTIONAL',  NOW()),
  ('oa_vwg8_standh',   'opt_vw_standheiz',  'gen_vw_golf8',   'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Tiguan (AD)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_vwtig_pano',    'opt_vw_pano',       'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_shz',     'opt_vw_shz',        'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_ahk',     'opt_vw_ahk',        'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_harman',  'opt_vw_harman',     'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_matrix',  'opt_vw_led_mat',    'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_travel',  'opt_vw_travelass',  'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_360',     'opt_vw_360cam',     'gen_vw_tiguan_ad','OPTIONAL',  NOW()),
  ('oa_vwtig_standh',  'opt_vw_standheiz',  'gen_vw_tiguan_ad','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai Tucson (NX4)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_hytuc_shz',     'opt_hy_shz',        'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_skuehl',  'opt_hy_skuehl',     'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_shzh',    'opt_hy_shz_hint',   'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_pano',    'opt_hy_pano',       'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_bose',    'opt_hy_bose',       'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_hud',     'opt_hy_hud',        'gen_hy_tucson_nx4','OPTIONAL',  NOW()),
  ('oa_hytuc_ahk',     'opt_hy_ahk',        'gen_hy_tucson_nx4','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai IONIQ 5 (NE)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_hyio5_shz',     'opt_hy_shz',        'gen_hy_ioniq5_ne','STANDARD',  NOW()),
  ('oa_hyio5_skuehl',  'opt_hy_skuehl',     'gen_hy_ioniq5_ne','OPTIONAL',  NOW()),
  ('oa_hyio5_pano',    'opt_hy_pano',       'gen_hy_ioniq5_ne','OPTIONAL',  NOW()),
  ('oa_hyio5_bose',    'opt_hy_bose',       'gen_hy_ioniq5_ne','OPTIONAL',  NOW()),
  ('oa_hyio5_hud',     'opt_hy_hud',        'gen_hy_ioniq5_ne','OPTIONAL',  NOW()),
  ('oa_hyio5_v2l',     'opt_hy_v2l',        'gen_hy_ioniq5_ne','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model 3 Highland
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_tsm3_shz',      'opt_ts_shz',        'gen_ts_model3_hr','STANDARD',  NOW()),
  ('oa_tsm3_fsd',      'opt_ts_fsd',        'gen_ts_model3_hr','OPTIONAL',  NOW()),
  ('oa_tsm3_weiss',    'opt_ts_weiss_int',  'gen_ts_model3_hr','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model Y
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_tsmy_shz',      'opt_ts_shz',        'gen_ts_modely_1', 'STANDARD',  NOW()),
  ('oa_tsmy_fsd',      'opt_ts_fsd',        'gen_ts_modely_1', 'OPTIONAL',  NOW()),
  ('oa_tsmy_ahk',      'opt_ts_ahk',        'gen_ts_modely_1', 'OPTIONAL',  NOW()),
  ('oa_tsmy_weiss',    'opt_ts_weiss_int',  'gen_ts_modely_1', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche 911 (992)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_por911_pano',    'opt_por_pano',       'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_shz',     'opt_por_shz',        'gen_por_911_992', 'STANDARD',  NOW()),
  ('oa_por911_skuehl',  'opt_por_skuehl',     'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_bose',    'opt_por_bose',       'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_burm',    'opt_por_burmester',  'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_chrono',  'opt_por_sport_chrono','gen_por_911_992','OPTIONAL',  NOW()),
  ('oa_por911_pasm',    'opt_por_pasm',       'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_pdls',    'opt_por_pdls',       'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_hinter',  'opt_por_hinterachs', 'gen_por_911_992', 'OPTIONAL',  NOW()),
  ('oa_por911_keramik', 'opt_por_keramik',    'gen_por_911_992', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Octavia IV (NX)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_skoct_pano',    'opt_sk_pano',       'gen_sk_octavia_nx','OPTIONAL',  NOW()),
  ('oa_skoct_shz',     'opt_sk_shz',        'gen_sk_octavia_nx','OPTIONAL',  NOW()),
  ('oa_skoct_canton',  'opt_sk_canton',     'gen_sk_octavia_nx','OPTIONAL',  NOW()),
  ('oa_skoct_ahk',     'opt_sk_ahk',        'gen_sk_octavia_nx','OPTIONAL',  NOW()),
  ('oa_skoct_matrix',  'opt_sk_matrix',     'gen_sk_octavia_nx','OPTIONAL',  NOW()),
  ('oa_skoct_standh',  'opt_sk_standheiz',  'gen_sk_octavia_nx','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;


COMMIT;
