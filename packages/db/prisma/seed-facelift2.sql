-- Seed: FaceliftPhase Runde 2 — Weitere populaere Generationen
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- BMW 3er G20
('fl_3er_g20_pre', 'gen_bmw_3er_g20', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Schmale Scheinwerfer, klassische Niere, physische Bedienelemente auf Mittelkonsole', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_3er_g20_fl', 'gen_bmw_3er_g20', 'LCI (Facelift)', 'lci', 2022, NULL, 'Flachere Scheinwerfer, Curved Display, neues iDrive 8, ueberarbeitete Frontschuerze', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW 1er F40
('fl_1er_f40_pre', 'gen_bmw_1er_f40', 'Vorfacelift', 'vorfacelift', 2019, 2022, 'Klassische BMW-Niere, rundes Cockpit-Display, physische Klimabedienung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_1er_f40_fl', 'gen_bmw_1er_f40', 'LCI (Facelift)', 'lci', 2023, NULL, 'Neue Frontschuerze, ueberarbeitete Heckleuchten, Curved Display Serie, iDrive 8.5', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW X5 G05
('fl_x5_g05_pre', 'gen_bmw_x5_g05', 'Vorfacelift', 'vorfacelift', 2018, 2023, 'Klassische Doppelniere, separate Scheinwerfer, physische Bedienleiste', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_x5_g05_fl', 'gen_bmw_x5_g05', 'LCI (Facelift)', 'lci', 2023, NULL, 'Schmalere Scheinwerfer, beleuchtete Niere Serie, Curved Display, ueberarbeitete Heckpartie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes A-Klasse W177
('fl_w177_pre', 'gen_mb_a_w177', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Zweiteiliges Display-Layout, klassische Sternform, MBUX 1.0', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_w177_fl', 'gen_mb_a_w177', 'Facelift (MOPF)', 'mopf', 2022, 2025, 'Neue AMG-Line-Frontschuerze, ueberarbeitetes Lichtdesign, MBUX-Update, neue Farbpalette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi A3 8Y
('fl_a3_8y_pre', 'gen_audi_a3_8y', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Singleframe mit Wabenmuster, LED-Scheinwerfer, 10,1-Zoll-MMI-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_a3_8y_fl', 'gen_audi_a3_8y', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeiteter Singleframe, Matrix-LED Serie, neues MMI mit 11,6 Zoll, erweiterte Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Hyundai Tucson NX4
('fl_tucson_nx4_pre', 'gen_hy_tucson_nx4', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Parametrisches Tagfahrlicht in Kuehlerblende integriert, 10,25-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_tucson_nx4_fl', 'gen_hy_tucson_nx4', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitete Front mit neuen LED-Signatur, groesseres Display, aktualisierte Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Porsche 911 992
('fl_992_pre', 'gen_por_911_992', 'Vorfacelift (992.1)', '992-1', 2019, 2024, 'Klassisches 911-Design, 10,9-Zoll-PCM, analoge Drehzahlmesser-Optik', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_992_fl', 'gen_por_911_992', 'Facelift (992.2)', '992-2', 2024, NULL, 'Neues HD-Matrix-LED-Licht, ueberarbeiteter Heckspoiler, neues PCM 6.0 mit 12,6 Zoll', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW Golf VIII
('fl_golf8_pre', 'gen_vw_golf8', 'Vorfacelift', 'vorfacelift', 2019, 2024, '10-Zoll-Discover-Pro, Touch-Slider, flaches Lenkrad', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_golf8_fl', 'gen_vw_golf8', 'Facelift', 'facelift', 2024, NULL, 'Beleuchteter VW-Logo, ueberarbeitete LED-Scheinwerfer, 12,9-Zoll-Display, physische Lautstaerkeregler zurueck', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Skoda Octavia NX
('fl_octavia_nx_pre', 'gen_sk_octavia_nx', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'Zweigeteilte Scheinwerfer, 10-Zoll-Display, klassische Skoda-Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_octavia_nx_fl', 'gen_sk_octavia_nx', 'Facelift', 'facelift', 2024, NULL, 'Neues Skoda-Logo, ueberarbeitete Frontschuerze, 13-Zoll-Display, neue Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Opel Corsa F
('fl_corsa_f_pre', 'gen_opel_corsa_f', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'Vizor-Design, IntelliLux-LED-Matrix, 7-Zoll-Display Basis', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_corsa_f_fl', 'gen_opel_corsa_f', 'Facelift', 'facelift', 2023, NULL, 'Neues Opel-Logo, ueberarbeitete Frontpartie, 10-Zoll-Display Serie, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Ford Kuga III
('fl_kuga_mk3_pre', 'gen_ford_kuga_mk3', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'Grosser Kuehlergrill, 8-Zoll-SYNC3-Display, klassische Ford-Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_kuga_mk3_fl', 'gen_ford_kuga_mk3', 'Facelift', 'facelift', 2024, NULL, 'Neues Ford-Logo, ueberarbeitete LED-Scheinwerfer, 13,2-Zoll-SYNC4-Display, digitales Cockpit', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Toyota RAV4 XA50
('fl_rav4_xa50_pre', 'gen_toy_rav4_xa50', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Markante Trapez-Front, 8-Zoll-Display, physische Klimabedienung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_rav4_xa50_fl', 'gen_toy_rav4_xa50', 'Facelift', 'facelift', 2022, NULL, 'Ueberarbeitete Front mit schmaleren Scheinwerfern, 10,5-Zoll-Multimedia, neue Sicherheitssysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
