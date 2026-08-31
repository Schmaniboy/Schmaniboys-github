-- =============================================================================
-- CARONEX Ausstattungsdaten Teil 2
--
-- Restliche Hersteller: Ford, Kia, Mazda, Volvo, Opel, Renault,
-- Nissan, Honda, MINI, CUPRA, SEAT, Peugeot, Citroen, Dacia, Fiat, DS
-- Nur echte, bei den Herstellern bestellbare/bestellbar gewesene Optionen.
-- =============================================================================

BEGIN;

-- =============================================================================
-- TEIL 1: SONDERAUSSTATTUNGEN (OptionalEquipment)
-- =============================================================================

-- ===== FORD =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_ford_pano',      'mfr_ford', 'Panorama-Schiebedach',          'panorama-schiebedach',     NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ford_shz',       'mfr_ford', 'Sitzheizung vorn',              'sitzheizung-vorn',         NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_ford_bo',        'mfr_ford', 'B&O Soundsystem',               'bo-soundsystem',           NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ford_hud',       'mfr_ford', 'Head-Up Display',               'head-up-display',          NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ford_matrix',    'mfr_ford', 'Matrix LED-Scheinwerfer',       'matrix-led',               NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ford_ahk',       'mfr_ford', 'Anhaengerkupplung abnehmbar',   'anhaengerkupplung',        NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ford_parkass',   'mfr_ford', 'Park-Pilot-System',             'park-pilot',               NULL, 'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_ford_standheiz', 'mfr_ford', 'Standheizung',                  'standheizung',             NULL, 'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== KIA =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_kia_shz',        'mfr_kia', 'Sitzheizung vorn',              'sitzheizung-vorn',         NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_kia_skuehl',     'mfr_kia', 'Sitzbelueftung vorn',           'sitzbelueftung-vorn',      NULL, 'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_kia_pano',       'mfr_kia', 'Panorama-Glasdach',             'panorama-glasdach',        NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_kia_harman',     'mfr_kia', 'Harman Kardon Soundsystem',     'harman-kardon',            NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_kia_hud',        'mfr_kia', 'Head-Up Display',               'head-up-display',          NULL, 'Technik',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_kia_ahk',        'mfr_kia', 'Anhaengerkupplung abnehmbar',   'anhaengerkupplung',        NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_kia_v2l',        'mfr_kia', 'Vehicle-to-Load (V2L)',         'vehicle-to-load',          NULL, 'Technik',    'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_kia_matrix',     'mfr_kia', 'Matrix LED-Scheinwerfer',       'matrix-led',               NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== MAZDA =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_maz_shz',        'mfr_mazda', 'Sitzheizung vorn',            'sitzheizung-vorn',         NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_maz_bose',       'mfr_mazda', 'BOSE Soundsystem',            'bose-soundsystem',         NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_maz_hud',        'mfr_mazda', 'Head-Up Display',             'head-up-display',          NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_maz_leder',      'mfr_mazda', 'Lederausstattung',            'lederausstattung',         NULL, 'Interieur',  'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_maz_matrix',     'mfr_mazda', 'Matrix LED-Scheinwerfer',     'matrix-led',               NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_maz_ahk',        'mfr_mazda', 'Anhaengerkupplung abnehmbar', 'anhaengerkupplung',        NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_maz_standheiz',  'mfr_mazda', 'Standheizung',                'standheizung',             NULL, 'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== VOLVO =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_vol_pano',       'mfr_volvo', 'Panorama-Glasdach',            'panorama-glasdach',       NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vol_shz',        'mfr_volvo', 'Sitzheizung vorn',             'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vol_skuehl',     'mfr_volvo', 'Sitzbelueftung vorn',          'sitzbelueftung-vorn',     NULL, 'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vol_harman',     'mfr_volvo', 'Harman Kardon Premium Sound',  'harman-kardon',           NULL, 'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vol_bw',         'mfr_volvo', 'Bowers & Wilkins',             'bowers-wilkins',          NULL, 'Multimedia', 'Interieur', 'HIGH',   'HIGH',   'RARE',     'PUBLISHED', NOW(), NOW()),
  ('opt_vol_hud',        'mfr_volvo', 'Head-Up Display',              'head-up-display',         NULL, 'Technik',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vol_pilotass',   'mfr_volvo', 'Pilot Assist',                 'pilot-assist',            NULL, 'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_vol_luftfed',    'mfr_volvo', 'Luftfederung hinten',          'luftfederung-hinten',     NULL, 'Fahrwerk',   'Fahrwerk',  'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vol_ahk',        'mfr_volvo', 'Anhaengerkupplung schwenkbar', 'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_vol_standheiz',  'mfr_volvo', 'Standheizung',                 'standheizung',            NULL, 'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== OPEL =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_opel_shz',       'mfr_opel', 'Sitzheizung vorn',             'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_opel_pano',      'mfr_opel', 'Panorama-Windschutzscheibe',   'panorama-windschutzscheibe', NULL, 'Komfort', 'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_opel_intellilux','mfr_opel', 'IntelliLux LED Matrix',        'intellilux-matrix',       NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_opel_ahk',       'mfr_opel', 'Anhaengerkupplung abnehmbar',  'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_opel_navipro',   'mfr_opel', 'Multimedia Navi Pro',          'multimedia-navi-pro',     NULL, 'Multimedia', 'Interieur', 'HIGH',   'MEDIUM', 'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_opel_standheiz', 'mfr_opel', 'Standheizung',                 'standheizung',            NULL, 'Komfort',    'Technik',   'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== RENAULT =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_ren_shz',        'mfr_renault', 'Sitzheizung vorn',           'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_ren_pano',       'mfr_renault', 'Panorama-Glasdach',          'panorama-glasdach',       NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ren_bose',       'mfr_renault', 'BOSE Soundsystem',           'bose-soundsystem',        NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ren_matrix',     'mfr_renault', 'Matrix LED Vision',          'matrix-led-vision',       NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ren_ahk',        'mfr_renault', 'Anhaengerkupplung abnehmbar','anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ren_hud',        'mfr_renault', 'Head-Up Display',            'head-up-display',         NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== NISSAN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_nis_shz',        'mfr_nissan', 'Sitzheizung vorn',            'sitzheizung-vorn',        NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_nis_pano',       'mfr_nissan', 'Panorama-Glasdach',           'panorama-glasdach',       NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_nis_bose',       'mfr_nissan', 'BOSE Soundsystem',            'bose-soundsystem',        NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_nis_propilot',   'mfr_nissan', 'ProPILOT',                    'propilot',                NULL, 'Assistenz',  'Technik',   'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_nis_ahk',        'mfr_nissan', 'Anhaengerkupplung abnehmbar', 'anhaengerkupplung',       NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_nis_360cam',     'mfr_nissan', 'Intelligent Around View Monitor','360-grad-kamera',      NULL, 'Assistenz',  'Technik',   'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== HONDA =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_hon_shz',        'mfr_honda', 'Sitzheizung vorn',             'sitzheizung-vorn',       NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_hon_pano',       'mfr_honda', 'Panorama-Glasdach',            'panorama-glasdach',      NULL, 'Komfort',    'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hon_bose',       'mfr_honda', 'BOSE Premium-Soundsystem',     'bose-premium',           NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hon_leder',      'mfr_honda', 'Lederausstattung',             'lederausstattung',       NULL, 'Interieur',  'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hon_hud',        'mfr_honda', 'Head-Up Display',              'head-up-display',        NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_hon_ahk',        'mfr_honda', 'Anhaengerkupplung abnehmbar',  'anhaengerkupplung',      NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== MINI =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_mini_shz',       'mfr_mini', 'Sitzheizung vorn',              'sitzheizung-vorn',       NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_mini_pano',      'mfr_mini', 'Panorama-Glasdach',             'panorama-glasdach',      NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mini_harman',    'mfr_mini', 'Harman Kardon HiFi',            'harman-kardon',          NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mini_hud',       'mfr_mini', 'Head-Up Display',               'head-up-display',        NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mini_leder',     'mfr_mini', 'Lederausstattung Chester',      'lederausstattung',       NULL, 'Interieur',  'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_mini_ahk',       'mfr_mini', 'Anhaengerkupplung',             'anhaengerkupplung',      NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== CUPRA =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_cup_shz',        'mfr_cupra', 'Sitzheizung vorn',             'sitzheizung-vorn',       NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_cup_pano',       'mfr_cupra', 'Panorama-Schiebedach',         'panorama-schiebedach',   NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cup_beats',      'mfr_cupra', 'Beats Soundsystem',            'beats-soundsystem',      NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cup_hud',        'mfr_cupra', 'Head-Up Display',              'head-up-display',        NULL, 'Technik',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cup_matrix',     'mfr_cupra', 'Matrix LED-Scheinwerfer',      'matrix-led',             NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cup_ahk',        'mfr_cupra', 'Anhaengerkupplung abnehmbar',  'anhaengerkupplung',      NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== SEAT =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_seat_shz',       'mfr_seat', 'Sitzheizung vorn',              'sitzheizung-vorn',       NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_seat_pano',      'mfr_seat', 'Panorama-Schiebedach',          'panorama-schiebedach',   NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_seat_beats',     'mfr_seat', 'Beats Soundsystem',             'beats-soundsystem',      NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_seat_fullled',   'mfr_seat', 'Full-LED-Scheinwerfer',         'full-led',               NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_seat_ahk',       'mfr_seat', 'Anhaengerkupplung abnehmbar',   'anhaengerkupplung',      NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== PEUGEOT =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_pgt_shz',        'mfr_peugeot', 'Sitzheizung vorn',            'sitzheizung-vorn',      NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_pgt_pano',       'mfr_peugeot', 'Panorama-Glasdach',           'panorama-glasdach',     NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_pgt_focal',      'mfr_peugeot', 'FOCAL Premium Hi-Fi',         'focal-premium',         NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_pgt_matrix',     'mfr_peugeot', 'Matrix LED-Scheinwerfer',     'matrix-led',            NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_pgt_ahk',        'mfr_peugeot', 'Anhaengerkupplung abnehmbar', 'anhaengerkupplung',     NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_pgt_nightvis',   'mfr_peugeot', 'Night Vision',                'night-vision',          NULL, 'Assistenz',  'Technik',   'MEDIUM', 'HIGH',   'RARE',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== CITROEN =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_cit_shz',        'mfr_citroen', 'Sitzheizung vorn',            'sitzheizung-vorn',      NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_cit_pano',       'mfr_citroen', 'Panorama-Glasdach',           'panorama-glasdach',     NULL, 'Komfort',    'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cit_ahk',        'mfr_citroen', 'Anhaengerkupplung abnehmbar', 'anhaengerkupplung',     NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_cit_advcomf',    'mfr_citroen', 'Advanced Comfort Sitze',      'advanced-comfort',      NULL, 'Komfort',    'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== DACIA =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_dac_shz',        'mfr_dacia', 'Sitzheizung vorn',              'sitzheizung-vorn',     NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_dac_klima_auto', 'mfr_dacia', 'Klimaautomatik',                'klimaautomatik',       NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_dac_navi',       'mfr_dacia', 'Multimedia-Navigationssystem',  'multimedia-navi',      NULL, 'Multimedia', 'Interieur', 'HIGH',   'MEDIUM', 'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_dac_ahk',        'mfr_dacia', 'Anhaengerkupplung abnehmbar',   'anhaengerkupplung',    NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== FIAT =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_fiat_shz',       'mfr_fiat', 'Sitzheizung vorn',               'sitzheizung-vorn',    NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_fiat_pano',      'mfr_fiat', 'Panorama-Glasdach',              'panorama-glasdach',   NULL, 'Komfort',    'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_fiat_beats',     'mfr_fiat', 'JBL Soundsystem',                'jbl-soundsystem',     NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_fiat_ahk',       'mfr_fiat', 'Anhaengerkupplung abnehmbar',    'anhaengerkupplung',   NULL, 'Praktisch',  'Exterieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===== DS AUTOMOBILES =====
INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, "purchaseRelevance", "resaleRelevance", rarity, status, "publishedAt", "updatedAt") VALUES
  ('opt_ds_shz',         'mfr_ds', 'Sitzheizung vorn',                'sitzheizung-vorn',      NULL, 'Komfort',    'Interieur', 'HIGH',   'HIGH',   'COMMON',   'PUBLISHED', NOW(), NOW()),
  ('opt_ds_skuehl',      'mfr_ds', 'Massagefunktion vorn',            'massagefunktion',       NULL, 'Komfort',    'Interieur', 'MEDIUM', 'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ds_pano',        'mfr_ds', 'Panorama-Glasdach',               'panorama-glasdach',     NULL, 'Komfort',    'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ds_focal',       'mfr_ds', 'FOCAL Electra Soundsystem',       'focal-electra',         NULL, 'Multimedia', 'Interieur', 'MEDIUM', 'MEDIUM', 'UNCOMMON', 'PUBLISHED', NOW(), NOW()),
  ('opt_ds_nightvis',    'mfr_ds', 'DS Night Vision',                 'night-vision',          NULL, 'Assistenz',  'Technik',   'MEDIUM', 'HIGH',   'RARE',     'PUBLISHED', NOW(), NOW()),
  ('opt_ds_matrix',      'mfr_ds', 'DS Matrix LED Vision',            'matrix-led-vision',     NULL, 'Licht',      'Exterieur', 'HIGH',   'HIGH',   'UNCOMMON', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- TEIL 2: AUSSTATTUNGSLINIEN (TrimLine)
-- =============================================================================

-- Ford Focus Mk4
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ford_focus_trend', 'gen_ford_focus_mk4', 'Trend',       'trend',    'PUBLISHED', NOW(), NOW()),
  ('tl_ford_focus_titan', 'gen_ford_focus_mk4', 'Titanium',    'titanium', 'PUBLISHED', NOW(), NOW()),
  ('tl_ford_focus_stline','gen_ford_focus_mk4', 'ST-Line',     'st-line',  'PUBLISHED', NOW(), NOW()),
  ('tl_ford_focus_vign',  'gen_ford_focus_mk4', 'Vignale',     'vignale',  'PUBLISHED', NOW(), NOW()),
  ('tl_ford_focus_st',    'gen_ford_focus_mk4', 'ST',          'st',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Kuga Mk3
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ford_kuga_trend',  'gen_ford_kuga_mk3', 'Trend',       'trend',    'PUBLISHED', NOW(), NOW()),
  ('tl_ford_kuga_titan',  'gen_ford_kuga_mk3', 'Titanium',    'titanium', 'PUBLISHED', NOW(), NOW()),
  ('tl_ford_kuga_stline', 'gen_ford_kuga_mk3', 'ST-Line',     'st-line',  'PUBLISHED', NOW(), NOW()),
  ('tl_ford_kuga_stlinex','gen_ford_kuga_mk3', 'ST-Line X',   'st-line-x','PUBLISHED', NOW(), NOW()),
  ('tl_ford_kuga_vign',   'gen_ford_kuga_mk3', 'Vignale',     'vignale',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Puma
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ford_puma_titan',  'gen_ford_puma_1', 'Titanium',    'titanium', 'PUBLISHED', NOW(), NOW()),
  ('tl_ford_puma_stline', 'gen_ford_puma_1', 'ST-Line',     'st-line',  'PUBLISHED', NOW(), NOW()),
  ('tl_ford_puma_stlinex','gen_ford_puma_1', 'ST-Line X',   'st-line-x','PUBLISHED', NOW(), NOW()),
  ('tl_ford_puma_st',     'gen_ford_puma_1', 'ST',          'st',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Sportage (NQ5)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_kia_sport_spirit',  'gen_kia_sportage_nq5', 'Spirit',     'spirit',    'PUBLISHED', NOW(), NOW()),
  ('tl_kia_sport_vision',  'gen_kia_sportage_nq5', 'Vision',     'vision',    'PUBLISHED', NOW(), NOW()),
  ('tl_kia_sport_plat',    'gen_kia_sportage_nq5', 'Platinum',   'platinum',  'PUBLISHED', NOW(), NOW()),
  ('tl_kia_sport_gtline',  'gen_kia_sportage_nq5', 'GT-Line',    'gt-line',   'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia EV6 (CV)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_kia_ev6_air',      'gen_kia_ev6_cv', 'Air',        'air',       'PUBLISHED', NOW(), NOW()),
  ('tl_kia_ev6_wind',     'gen_kia_ev6_cv', 'Wind',       'wind',      'PUBLISHED', NOW(), NOW()),
  ('tl_kia_ev6_earth',    'gen_kia_ev6_cv', 'Earth',      'earth',     'PUBLISHED', NOW(), NOW()),
  ('tl_kia_ev6_gt',       'gen_kia_ev6_cv', 'GT',         'gt',        'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-5 (KF)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_maz_cx5_prime',    'gen_cx5_2', 'Prime-Line',      'prime-line',     'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx5_excl',     'gen_cx5_2', 'Exclusive-Line',  'exclusive-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx5_homura',   'gen_cx5_2', 'Homura',          'homura',         'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx5_takumi',   'gen_cx5_2', 'Takumi',          'takumi',         'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda3 (BP)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_maz_3_prime',      'gen_mazda3_4', 'Prime-Line',      'prime-line',     'PUBLISHED', NOW(), NOW()),
  ('tl_maz_3_excl',       'gen_mazda3_4', 'Exclusive-Line',  'exclusive-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_maz_3_drive',      'gen_mazda3_4', 'Drive',           'drive',          'PUBLISHED', NOW(), NOW()),
  ('tl_maz_3_homura',     'gen_mazda3_4', 'Homura',          'homura',         'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-60 (CX-60)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_maz_cx60_prime',   'gen_cx60_1', 'Prime-Line',      'prime-line',     'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx60_excl',    'gen_cx60_1', 'Exclusive-Line',  'exclusive-line', 'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx60_homura',  'gen_cx60_1', 'Homura',          'homura',         'PUBLISHED', NOW(), NOW()),
  ('tl_maz_cx60_takumi',  'gen_cx60_1', 'Takumi',          'takumi',         'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC60 (SPA)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vol_xc60_core',    'gen_volvo_xc60_2', 'Core',     'core',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc60_plus',    'gen_volvo_xc60_2', 'Plus',     'plus',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc60_ult',     'gen_volvo_xc60_2', 'Ultimate', 'ultimate', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC40 (CMA)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vol_xc40_core',    'gen_volvo_xc40_1', 'Core',     'core',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc40_plus',    'gen_volvo_xc40_1', 'Plus',     'plus',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc40_ult',     'gen_volvo_xc40_1', 'Ultimate', 'ultimate', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC90 (SPA)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_vol_xc90_core',    'gen_volvo_xc90_2', 'Core',     'core',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc90_plus',    'gen_volvo_xc90_2', 'Plus',     'plus',     'PUBLISHED', NOW(), NOW()),
  ('tl_vol_xc90_ult',     'gen_volvo_xc90_2', 'Ultimate', 'ultimate', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Astra L
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_opel_astra_edit',  'gen_opel_astra_l', 'Edition',   'edition',   'PUBLISHED', NOW(), NOW()),
  ('tl_opel_astra_eleg',  'gen_opel_astra_l', 'Elegance',  'elegance',  'PUBLISHED', NOW(), NOW()),
  ('tl_opel_astra_gs',    'gen_opel_astra_l', 'GS Line',   'gs-line',   'PUBLISHED', NOW(), NOW()),
  ('tl_opel_astra_ult',   'gen_opel_astra_l', 'Ultimate',  'ultimate',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Corsa F
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_opel_corsa_edit',  'gen_opel_corsa_f', 'Edition',   'edition',   'PUBLISHED', NOW(), NOW()),
  ('tl_opel_corsa_eleg',  'gen_opel_corsa_f', 'Elegance',  'elegance',  'PUBLISHED', NOW(), NOW()),
  ('tl_opel_corsa_gs',    'gen_opel_corsa_f', 'GS Line',   'gs-line',   'PUBLISHED', NOW(), NOW()),
  ('tl_opel_corsa_ult',   'gen_opel_corsa_f', 'Ultimate',  'ultimate',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Qashqai J12
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_nis_qash_visia',   'gen_qashqai_3', 'Visia',       'visia',      'PUBLISHED', NOW(), NOW()),
  ('tl_nis_qash_acenta',  'gen_qashqai_3', 'Acenta',      'acenta',     'PUBLISHED', NOW(), NOW()),
  ('tl_nis_qash_nconn',   'gen_qashqai_3', 'N-Connecta',  'n-connecta', 'PUBLISHED', NOW(), NOW()),
  ('tl_nis_qash_tekna',   'gen_qashqai_3', 'Tekna',       'tekna',      'PUBLISHED', NOW(), NOW()),
  ('tl_nis_qash_tekna_p', 'gen_qashqai_3', 'Tekna+',      'tekna-plus', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Clio V
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ren_clio_evolut',  'gen_ren_clio5', 'Evolution',   'evolution', 'PUBLISHED', NOW(), NOW()),
  ('tl_ren_clio_techno',  'gen_ren_clio5', 'Techno',      'techno',   'PUBLISHED', NOW(), NOW()),
  ('tl_ren_clio_iconic',  'gen_ren_clio5', 'Iconic',      'iconic',   'PUBLISHED', NOW(), NOW()),
  ('tl_ren_clio_esprit',  'gen_ren_clio5', 'Esprit Alpine','esprit-alpine','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Captur II
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_ren_capt_evolut',  'gen_ren_captur2', 'Evolution',   'evolution', 'PUBLISHED', NOW(), NOW()),
  ('tl_ren_capt_techno',  'gen_ren_captur2', 'Techno',      'techno',   'PUBLISHED', NOW(), NOW()),
  ('tl_ren_capt_esprit',  'gen_ren_captur2', 'Esprit Alpine','esprit-alpine','PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 3008 II
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_pgt_3008_active', 'gen_3008_2', 'Active',    'active',   'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_3008_allure', 'gen_3008_2', 'Allure',    'allure',   'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_3008_gtline', 'gen_3008_2', 'GT Line',   'gt-line',  'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_3008_gt',     'gen_3008_2', 'GT',        'gt',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 308 III
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_pgt_308_active',  'gen_308_3', 'Active',    'active',   'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_308_allure',  'gen_308_3', 'Allure',    'allure',   'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_308_gtpack',  'gen_308_3', 'GT Pack',   'gt-pack',  'PUBLISHED', NOW(), NOW()),
  ('tl_pgt_308_gt',      'gen_308_3', 'GT',        'gt',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Leon IV
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_seat_leon_style',  'gen_seat_leon4', 'Style',     'style',    'PUBLISHED', NOW(), NOW()),
  ('tl_seat_leon_xcell',  'gen_seat_leon4', 'Xcellence', 'xcellence','PUBLISHED', NOW(), NOW()),
  ('tl_seat_leon_fr',     'gen_seat_leon4', 'FR',        'fr',       'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CUPRA Formentor
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_cup_form_base',   'gen_cupra_formentor1', 'V',     'v',       'PUBLISHED', NOW(), NOW()),
  ('tl_cup_form_vz',     'gen_cupra_formentor1', 'VZ',    'vz',      'PUBLISHED', NOW(), NOW()),
  ('tl_cup_form_vze',    'gen_cupra_formentor1', 'VZe',   'vze',     'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda Civic (FL)
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_hon_civic_eleg',   'gen_civic_11', 'Elegance',  'elegance', 'PUBLISHED', NOW(), NOW()),
  ('tl_hon_civic_sport',  'gen_civic_11', 'Sport',     'sport',    'PUBLISHED', NOW(), NOW()),
  ('tl_hon_civic_adv',    'gen_civic_11', 'Advance',   'advance',  'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Dacia Duster III
INSERT INTO "TrimLine" (id, "generationId", name, slug, status, "publishedAt", "updatedAt") VALUES
  ('tl_dac_dust_essent',  'gen_dacia_duster3', 'Essential',  'essential',  'PUBLISHED', NOW(), NOW()),
  ('tl_dac_dust_expr',    'gen_dacia_duster3', 'Expression', 'expression', 'PUBLISHED', NOW(), NOW()),
  ('tl_dac_dust_extr',    'gen_dacia_duster3', 'Extreme',    'extreme',    'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- TEIL 3: VERFUEGBARKEITEN (OptionAvailability)
-- =============================================================================

-- Ford Focus Mk4
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_fofoc_shz',     'opt_ford_shz',       'gen_ford_focus_mk4', 'OPTIONAL',  NOW()),
  ('oa_fofoc_bo',      'opt_ford_bo',        'gen_ford_focus_mk4', 'OPTIONAL',  NOW()),
  ('oa_fofoc_hud',     'opt_ford_hud',       'gen_ford_focus_mk4', 'OPTIONAL',  NOW()),
  ('oa_fofoc_matrix',  'opt_ford_matrix',    'gen_ford_focus_mk4', 'OPTIONAL',  NOW()),
  ('oa_fofoc_standh',  'opt_ford_standheiz', 'gen_ford_focus_mk4', 'OPTIONAL',  NOW()),
  ('oa_fofoc_park',    'opt_ford_parkass',   'gen_ford_focus_mk4', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Kuga Mk3
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_fokug_pano',    'opt_ford_pano',      'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_shz',     'opt_ford_shz',       'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_bo',      'opt_ford_bo',        'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_hud',     'opt_ford_hud',       'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_matrix',  'opt_ford_matrix',    'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_ahk',     'opt_ford_ahk',       'gen_ford_kuga_mk3',  'OPTIONAL',  NOW()),
  ('oa_fokug_standh',  'opt_ford_standheiz', 'gen_ford_kuga_mk3',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Puma
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_fopum_shz',     'opt_ford_shz',       'gen_ford_puma_1',    'OPTIONAL',  NOW()),
  ('oa_fopum_bo',      'opt_ford_bo',        'gen_ford_puma_1',    'OPTIONAL',  NOW()),
  ('oa_fopum_matrix',  'opt_ford_matrix',    'gen_ford_puma_1',    'OPTIONAL',  NOW()),
  ('oa_fopum_park',    'opt_ford_parkass',   'gen_ford_puma_1',    'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Sportage (NQ5)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_kiaspt_shz',    'opt_kia_shz',        'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_skuehl', 'opt_kia_skuehl',     'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_pano',   'opt_kia_pano',       'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_harman', 'opt_kia_harman',     'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_hud',    'opt_kia_hud',        'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_matrix', 'opt_kia_matrix',     'gen_kia_sportage_nq5','OPTIONAL',  NOW()),
  ('oa_kiaspt_ahk',    'opt_kia_ahk',        'gen_kia_sportage_nq5','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia EV6 (CV)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_kiaev6_shz',    'opt_kia_shz',        'gen_kia_ev6_cv',    'STANDARD',  NOW()),
  ('oa_kiaev6_skuehl', 'opt_kia_skuehl',     'gen_kia_ev6_cv',    'OPTIONAL',  NOW()),
  ('oa_kiaev6_pano',   'opt_kia_pano',       'gen_kia_ev6_cv',    'OPTIONAL',  NOW()),
  ('oa_kiaev6_harman', 'opt_kia_harman',     'gen_kia_ev6_cv',    'OPTIONAL',  NOW()),
  ('oa_kiaev6_hud',    'opt_kia_hud',        'gen_kia_ev6_cv',    'OPTIONAL',  NOW()),
  ('oa_kiaev6_v2l',    'opt_kia_v2l',        'gen_kia_ev6_cv',    'OPTIONAL',  NOW()),
  ('oa_kiaev6_ahk',    'opt_kia_ahk',        'gen_kia_ev6_cv',    'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-5 (KF)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_mazcx5_shz',    'opt_maz_shz',        'gen_cx5_2',         'OPTIONAL',  NOW()),
  ('oa_mazcx5_bose',   'opt_maz_bose',       'gen_cx5_2',         'OPTIONAL',  NOW()),
  ('oa_mazcx5_hud',    'opt_maz_hud',        'gen_cx5_2',         'OPTIONAL',  NOW()),
  ('oa_mazcx5_leder',  'opt_maz_leder',      'gen_cx5_2',         'OPTIONAL',  NOW()),
  ('oa_mazcx5_matrix', 'opt_maz_matrix',     'gen_cx5_2',         'OPTIONAL',  NOW()),
  ('oa_mazcx5_ahk',    'opt_maz_ahk',        'gen_cx5_2',         'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-60
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_mazcx60_shz',   'opt_maz_shz',        'gen_cx60_1',        'OPTIONAL',  NOW()),
  ('oa_mazcx60_bose',  'opt_maz_bose',       'gen_cx60_1',        'OPTIONAL',  NOW()),
  ('oa_mazcx60_hud',   'opt_maz_hud',        'gen_cx60_1',        'OPTIONAL',  NOW()),
  ('oa_mazcx60_leder', 'opt_maz_leder',      'gen_cx60_1',        'OPTIONAL',  NOW()),
  ('oa_mazcx60_ahk',   'opt_maz_ahk',        'gen_cx60_1',        'OPTIONAL',  NOW()),
  ('oa_mazcx60_standh','opt_maz_standheiz',  'gen_cx60_1',        'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC60
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_vxc60_pano',    'opt_vol_pano',       'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_shz',     'opt_vol_shz',        'gen_volvo_xc60_2',  'STANDARD',  NOW()),
  ('oa_vxc60_skuehl',  'opt_vol_skuehl',     'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_harman',  'opt_vol_harman',     'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_bw',      'opt_vol_bw',         'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_hud',     'opt_vol_hud',        'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_pilot',   'opt_vol_pilotass',   'gen_volvo_xc60_2',  'STANDARD',  NOW()),
  ('oa_vxc60_luftfed', 'opt_vol_luftfed',    'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_ahk',     'opt_vol_ahk',        'gen_volvo_xc60_2',  'OPTIONAL',  NOW()),
  ('oa_vxc60_standh',  'opt_vol_standheiz',  'gen_volvo_xc60_2',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC40
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_vxc40_pano',    'opt_vol_pano',       'gen_volvo_xc40_1',  'OPTIONAL',  NOW()),
  ('oa_vxc40_shz',     'opt_vol_shz',        'gen_volvo_xc40_1',  'STANDARD',  NOW()),
  ('oa_vxc40_harman',  'opt_vol_harman',     'gen_volvo_xc40_1',  'OPTIONAL',  NOW()),
  ('oa_vxc40_hud',     'opt_vol_hud',        'gen_volvo_xc40_1',  'OPTIONAL',  NOW()),
  ('oa_vxc40_pilot',   'opt_vol_pilotass',   'gen_volvo_xc40_1',  'STANDARD',  NOW()),
  ('oa_vxc40_ahk',     'opt_vol_ahk',        'gen_volvo_xc40_1',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC90
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_vxc90_pano',    'opt_vol_pano',       'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_shz',     'opt_vol_shz',        'gen_volvo_xc90_2',  'STANDARD',  NOW()),
  ('oa_vxc90_skuehl',  'opt_vol_skuehl',     'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_bw',      'opt_vol_bw',         'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_hud',     'opt_vol_hud',        'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_pilot',   'opt_vol_pilotass',   'gen_volvo_xc90_2',  'STANDARD',  NOW()),
  ('oa_vxc90_luftfed', 'opt_vol_luftfed',    'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_ahk',     'opt_vol_ahk',        'gen_volvo_xc90_2',  'OPTIONAL',  NOW()),
  ('oa_vxc90_standh',  'opt_vol_standheiz',  'gen_volvo_xc90_2',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Astra L
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_opastra_shz',    'opt_opel_shz',        'gen_opel_astra_l', 'OPTIONAL',  NOW()),
  ('oa_opastra_intelli', 'opt_opel_intellilux', 'gen_opel_astra_l', 'OPTIONAL',  NOW()),
  ('oa_opastra_navi',   'opt_opel_navipro',    'gen_opel_astra_l', 'OPTIONAL',  NOW()),
  ('oa_opastra_standh', 'opt_opel_standheiz',  'gen_opel_astra_l', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Corsa F
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_opcorsa_shz',    'opt_opel_shz',        'gen_opel_corsa_f', 'OPTIONAL',  NOW()),
  ('oa_opcorsa_intelli', 'opt_opel_intellilux', 'gen_opel_corsa_f', 'OPTIONAL',  NOW()),
  ('oa_opcorsa_navi',   'opt_opel_navipro',    'gen_opel_corsa_f', 'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Qashqai J12
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_nisqash_shz',    'opt_nis_shz',         'gen_qashqai_3',    'OPTIONAL',  NOW()),
  ('oa_nisqash_pano',   'opt_nis_pano',        'gen_qashqai_3',    'OPTIONAL',  NOW()),
  ('oa_nisqash_bose',   'opt_nis_bose',        'gen_qashqai_3',    'OPTIONAL',  NOW()),
  ('oa_nisqash_propil', 'opt_nis_propilot',    'gen_qashqai_3',    'OPTIONAL',  NOW()),
  ('oa_nisqash_360',    'opt_nis_360cam',      'gen_qashqai_3',    'OPTIONAL',  NOW()),
  ('oa_nisqash_ahk',    'opt_nis_ahk',         'gen_qashqai_3',    'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Captur II
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_rencapt_shz',    'opt_ren_shz',         'gen_ren_captur2',  'OPTIONAL',  NOW()),
  ('oa_rencapt_pano',   'opt_ren_pano',        'gen_ren_captur2',  'OPTIONAL',  NOW()),
  ('oa_rencapt_bose',   'opt_ren_bose',        'gen_ren_captur2',  'OPTIONAL',  NOW()),
  ('oa_rencapt_ahk',    'opt_ren_ahk',         'gen_ren_captur2',  'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 3008 II
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_pgt3008_shz',    'opt_pgt_shz',         'gen_3008_2',       'OPTIONAL',  NOW()),
  ('oa_pgt3008_pano',   'opt_pgt_pano',        'gen_3008_2',       'OPTIONAL',  NOW()),
  ('oa_pgt3008_focal',  'opt_pgt_focal',       'gen_3008_2',       'OPTIONAL',  NOW()),
  ('oa_pgt3008_matrix', 'opt_pgt_matrix',      'gen_3008_2',       'OPTIONAL',  NOW()),
  ('oa_pgt3008_nightv', 'opt_pgt_nightvis',    'gen_3008_2',       'OPTIONAL',  NOW()),
  ('oa_pgt3008_ahk',    'opt_pgt_ahk',         'gen_3008_2',       'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 308 III
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_pgt308_shz',     'opt_pgt_shz',         'gen_308_3',        'OPTIONAL',  NOW()),
  ('oa_pgt308_focal',   'opt_pgt_focal',       'gen_308_3',        'OPTIONAL',  NOW()),
  ('oa_pgt308_matrix',  'opt_pgt_matrix',      'gen_308_3',        'OPTIONAL',  NOW()),
  ('oa_pgt308_ahk',     'opt_pgt_ahk',         'gen_308_3',        'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Leon IV
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_sealeon_shz',    'opt_seat_shz',        'gen_seat_leon4',   'OPTIONAL',  NOW()),
  ('oa_sealeon_pano',   'opt_seat_pano',       'gen_seat_leon4',   'OPTIONAL',  NOW()),
  ('oa_sealeon_beats',  'opt_seat_beats',      'gen_seat_leon4',   'OPTIONAL',  NOW()),
  ('oa_sealeon_led',    'opt_seat_fullled',    'gen_seat_leon4',   'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- CUPRA Formentor
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_cupform_shz',    'opt_cup_shz',         'gen_cupra_formentor1','OPTIONAL',  NOW()),
  ('oa_cupform_pano',   'opt_cup_pano',        'gen_cupra_formentor1','OPTIONAL',  NOW()),
  ('oa_cupform_beats',  'opt_cup_beats',       'gen_cupra_formentor1','OPTIONAL',  NOW()),
  ('oa_cupform_hud',    'opt_cup_hud',         'gen_cupra_formentor1','OPTIONAL',  NOW()),
  ('oa_cupform_matrix', 'opt_cup_matrix',      'gen_cupra_formentor1','OPTIONAL',  NOW()),
  ('oa_cupform_ahk',    'opt_cup_ahk',         'gen_cupra_formentor1','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda Civic (FL)
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_honciv_shz',     'opt_hon_shz',         'gen_civic_11',     'OPTIONAL',  NOW()),
  ('oa_honciv_leder',   'opt_hon_leder',       'gen_civic_11',     'OPTIONAL',  NOW()),
  ('oa_honciv_bose',    'opt_hon_bose',        'gen_civic_11',     'OPTIONAL',  NOW()),
  ('oa_honciv_hud',     'opt_hon_hud',         'gen_civic_11',     'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- Dacia Duster III
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_dacdust_shz',    'opt_dac_shz',         'gen_dacia_duster3','OPTIONAL',  NOW()),
  ('oa_dacdust_klima',  'opt_dac_klima_auto',  'gen_dacia_duster3','OPTIONAL',  NOW()),
  ('oa_dacdust_navi',   'opt_dac_navi',        'gen_dacia_duster3','OPTIONAL',  NOW()),
  ('oa_dacdust_ahk',    'opt_dac_ahk',         'gen_dacia_duster3','OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 7
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, "updatedAt") VALUES
  ('oa_ds7_shz',        'opt_ds_shz',          'gen_ds7_1',        'STANDARD',  NOW()),
  ('oa_ds7_massage',    'opt_ds_skuehl',       'gen_ds7_1',        'OPTIONAL',  NOW()),
  ('oa_ds7_pano',       'opt_ds_pano',         'gen_ds7_1',        'OPTIONAL',  NOW()),
  ('oa_ds7_focal',      'opt_ds_focal',        'gen_ds7_1',        'OPTIONAL',  NOW()),
  ('oa_ds7_nightv',     'opt_ds_nightvis',     'gen_ds7_1',        'OPTIONAL',  NOW()),
  ('oa_ds7_matrix',     'opt_ds_matrix',       'gen_ds7_1',        'OPTIONAL',  NOW())
ON CONFLICT (id) DO NOTHING;


COMMIT;
