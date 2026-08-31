-- Seed: FaceliftPhase Runde 3 — Weitere populaere Generationen
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- VW Polo VI (AW)
('fl_polo_aw_pre', 'gen_vw_polo_aw', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'Klassisches VW-Frontdesign, Discover-Pro-Display, physische Klimabedienung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_polo_aw_fl', 'gen_vw_polo_aw', 'Facelift', 'facelift', 2021, 2024, 'Beleuchtetes VW-Logo, ueberarbeitete LED-Scheinwerfer, neues Digital-Cockpit, Travel-Assist', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW T-Roc (A11)
('fl_troc_pre', 'gen_vw_troc_a1', 'Vorfacelift', 'vorfacelift', 2017, 2022, 'Zweifarbige Karosserie moeglich, 8-Zoll-Display, klassische VW-Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_troc_fl', 'gen_vw_troc_a1', 'Facelift', 'facelift', 2022, NULL, 'Neue LED-Scheinwerfer, beleuchtetes VW-Logo, ueberarbeiteter Innenraum, Digital Cockpit Pro Serie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW Passat B9
('fl_passat_b9_pre', 'gen_vw_passat_b9', 'Markteinfuehrung', 'markteinfuehrung', 2023, NULL, 'Erstmals nur als Variant, IQ.LIGHT Matrix-LED Serie, 15-Zoll-Infotainment, ergoActive-Sitze', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes C-Klasse W206
('fl_w206_pre', 'gen_mb_c_w206', 'Vorfacelift', 'vorfacelift', 2021, NULL, 'MBUX 2.0 mit Hochformat-Display, Hinterachslenkung optional, neue Designsprache mit Sternmotorhaube', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes CLA C118
('fl_c118_pre', 'gen_mb_cla_c118', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'MBUX 1.0, zweiteiliges Display-Band, klassische Coupe-Silhouette', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_c118_fl', 'gen_mb_cla_c118', 'Facelift (MOPF)', 'mopf', 2023, 2025, 'Ueberarbeitete Front mit neuem Kuehlerdesign, MBUX-Update, neue AMG-Line-Optik, erweiterte Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes S-Klasse W223
('fl_w223_pre', 'gen_mb_s_w223', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'OLED-Zentraldisplay, 3D-Kombiinstrument, E-ACTIVE BODY CONTROL, DRIVE PILOT Level 3', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW 5er G60
('fl_g60_pre', 'gen_bmw_5er_g60', 'Markteinfuehrung', 'markteinfuehrung', 2023, NULL, 'Curved Display, iDrive 9, Brake-by-Wire, erstmals i5 als Elektroversion, neue Designsprache', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi A6 C8
('fl_a6_c8_pre', 'gen_audi_a6_c8', 'Vorfacelift', 'vorfacelift', 2018, 2024, 'Dual-Touchscreen-Konzept, HD-Matrix-LED, progressive Steering Serie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_a6_c8_fl', 'gen_audi_a6_c8', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeiteter Singleframe, neue LED-Signatur, aktualisiertes MMI, erweiterte Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi Q7 4M
('fl_q7_4m_pre', 'gen_audi_q7_4m', 'Vorfacelift', 'vorfacelift', 2015, 2019, 'Kantiges Design, separater MMI-Bildschirm, physische Klimabedienung, klassischer Singleframe', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_q7_4m_fl', 'gen_audi_q7_4m', 'Facelift', 'facelift', 2019, NULL, 'Neues Dual-Touchscreen-Konzept, ueberarbeiteter Singleframe, HD-Matrix-LED, digitalisierter Innenraum', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Opel Astra L
('fl_astra_l_pre', 'gen_opel_astra_l', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'Bold&Pure-Design, Pure Panel mit zwei 10-Zoll-Displays, Vizor-Front, PHEV-Option', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Peugeot 208 II
('fl_208_pre', 'gen_208_2', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'i-Cockpit 3D, Loewenklauen-LED, 7-Zoll- oder 10-Zoll-Display, farbiges 3D-Kombiinstrument', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_208_fl', 'gen_208_2', 'Facelift', 'facelift', 2023, NULL, 'Neues Peugeot-Logo, ueberarbeitete LED-Signatur, aktualisiertes i-Cockpit, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Ford Fiesta Mk8
('fl_fiesta8_pre', 'gen_ford_fiesta_mk8', 'Vorfacelift', 'vorfacelift', 2017, 2022, 'Klassische Ford-Front, 8-Zoll-SYNC3-Display, Vignale-Ausstattungslinie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_fiesta8_fl', 'gen_ford_fiesta_mk8', 'Facelift', 'facelift', 2022, 2023, 'Neues Ford-Logo, ueberarbeitete LED-Scheinwerfer, 12,3-Zoll-Digitaltacho, Produktion 2023 eingestellt', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Toyota Corolla E210
('fl_corolla_pre', 'gen_toy_corolla_e210', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Bi-Tone-Design, 8-Zoll-Display, 1.8 und 2.0 Hybrid, markante C-HR-aehnliche Front', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_corolla_fl', 'gen_toy_corolla_e210', 'Facelift', 'facelift', 2022, NULL, 'Ueberarbeitete Front mit schmaleren Scheinwerfern, 10,5-Zoll-Multimedia, fuenfte Generation Hybrid, neue Sicherheitsfeatures', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Porsche Macan 95B
('fl_macan_pre', 'gen_por_macan_95b', 'Vorfacelift', 'vorfacelift', 2014, 2018, 'Klassisches Macan-Design, 7-Zoll-PCM, rundes Cockpit, physische Bedienleiste', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_macan_fl', 'gen_por_macan_95b', 'Facelift (II)', 'facelift-2', 2018, 2024, 'Neue LED-Scheinwerfer, ueberarbeitete Heckpartie, 10,9-Zoll-PCM, GT Sport-Lenkrad optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
