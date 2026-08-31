-- Seed: FaceliftPhase Runde 4 — Weitere populaere Generationen
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- SEAT Leon IV (KL)
('fl_leon4_pre', 'gen_seat_leon4', 'Vorfacelift', 'vorfacelift', 2020, NULL, 'Neues SEAT-Design, 10-Zoll-Display, Full-LED-Scheinwerfer, MQB-evo-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Skoda Fabia IV (PJ)
('fl_fabia4_pre', 'gen_sk_fabia_pj', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'MQB-A0-Plattform, neues Skoda-Design, 9,2-Zoll-Infotainment, Matrix-LED optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Skoda Superb III (3V) — hat bereits 2 Facelifts, ergaenzen nur falls noetig

-- VW ID.4 (E21)
('fl_id4_pre', 'gen_vw_id4_e2', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'MEB-Plattform, 12-Zoll-Display, ID. Light, Touch-Slider, Software 2.x', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_id4_fl', 'gen_vw_id4_e2', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitetes Display-Konzept, physische Tasten zurueck, Software 4.x, neue LED-Signatur', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW Touran (5T)
('fl_touran_pre', 'gen_vw_touran_5t', 'Vorfacelift', 'vorfacelift', 2015, 2019, 'MQB-Plattform, 6,5-Zoll-Display, Halogen-Scheinwerfer Basis', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_touran_fl', 'gen_vw_touran_5t', 'Facelift', 'facelift', 2019, 2024, 'LED-Scheinwerfer Serie, ueberarbeitete Front, Digital Cockpit optional, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Hyundai Kona (SZ)
('fl_kona_pre', 'gen_hy_kona_sz', 'Vorfacelift', 'vorfacelift', 2017, 2020, 'Geteilte Scheinwerfer, 7- oder 8-Zoll-Display, markantes SUV-Design', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_kona_fl', 'gen_hy_kona_sz', 'Facelift', 'facelift', 2020, 2023, 'Ueberarbeitete Front mit breiterer Nase, neue LED-Tagfahrlichter, 10,25-Zoll-Display, N Line', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Hyundai i20 (BC3)
('fl_i20_pre', 'gen_hy_i20_bc3', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Neues Hyundai-Design, 10,25-Zoll-Display, parametrische Tagfahrlichter', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_i20_fl', 'gen_hy_i20_bc3', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitete Front, neue LED-Signatur, aktualisiertes Infotainment, erweiterte Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Kia Ceed (CD)
('fl_ceed_pre', 'gen_kia_ceed_cd', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Tigernase-Front, 8-Zoll-Display, klassisches Kia-Design', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ceed_fl', 'gen_kia_ceed_cd', 'Facelift', 'facelift', 2022, NULL, 'Neues Kia-Logo, ueberarbeitete Frontpartie, 10,25-Zoll-Display, neue Farbpalette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Kia Niro (DE3)
('fl_niro2_pre', 'gen_kia_niro_de3', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Komplett neues Design, Boomerang-Tagfahrlichter, 10,25-Zoll-Breitbild, nachhaltiger Innenraum', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Dacia Duster III
('fl_duster3_pre', 'gen_dacia_duster3', 'Markteinfuehrung', 'markteinfuehrung', 2024, NULL, 'Neues Dacia-Markendesign, Y-foermige LED-Signatur, 10,1-Zoll-Display, CMF-B-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Opel Mokka II
('fl_mokka2_pre', 'gen_opel_mokka_2', 'Vorfacelift', 'vorfacelift', 2020, NULL, 'Vizor-Front, Bold-und-Pure-Design, Pure Panel, PSA-CMP-Plattform, auch als Mokka-e', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Peugeot 308 III (P51)
('fl_308_pre', 'gen_308_3', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'Neues Peugeot-Loewen-Logo, Loewenklauen-LED, i-Cockpit neuester Generation, EMP2-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Renault Megane E-Tech
('fl_megane_ev_pre', 'gen_ren_megane_ev', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'CMF-EV-Plattform, OpenR Link (Android Automotive), L-foermige Tagfahrlichter, bis zu 470 km WLTP', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Ford Puma
('fl_puma_pre', 'gen_ford_puma_1', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'Sportliches Coupe-SUV-Design, 8-Zoll-SYNC3, MegaBox im Kofferraum', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_puma_fl', 'gen_ford_puma_1', 'Facelift', 'facelift', 2024, NULL, 'Neues Ford-Logo, 12-Zoll-SYNC4-Display, ueberarbeitete Frontpartie, Matrix-LED optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda CX-30 (DM)
('fl_cx30_pre', 'gen_cx30_1', 'Markteinfuehrung', 'markteinfuehrung', 2019, NULL, 'Kodo-Design, 8,8-Zoll-Bildschirm, Skyactiv-X optional, Head-up-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
