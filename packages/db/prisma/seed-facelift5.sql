-- Seed: FaceliftPhase Runde 5 — Restliche populaere Generationen
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- Mercedes GLA H247
('fl_h247_pre', 'gen_mb_gla_h247', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Neue GLA-Generation auf MFA2-Plattform, MBUX, deutlich sportlichere Proportionen als Vorgaenger', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes GLE V167
('fl_v167_pre', 'gen_mb_gle_v167', 'Vorfacelift', 'vorfacelift', 2018, 2023, 'MBUX erste Generation, Widescreen-Cockpit, AIRMATIC optional, E-ACTIVE BODY CONTROL optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_v167_fl', 'gen_mb_gle_v167', 'Facelift (MOPF)', 'mopf', 2023, NULL, 'Ueberarbeitete Front, MBUX-Update, neue LED-Scheinwerfer, erweiterte Assistenzsysteme, neues Lenkrad', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes E-Klasse W214
('fl_w214_pre', 'gen_mb_e_w214', 'Markteinfuehrung', 'markteinfuehrung', 2023, NULL, 'Superscreen optional, MBUX 3.0, neue Designsprache, erstmals elektrische E-Klasse (EQE) parallel', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW X1 U11
('fl_u11_pre', 'gen_bmw_x1_u11', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Curved Display, iDrive 9, UKL2-Plattform, erstmals iX1 als Elektroversion', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW 4er G22
('fl_g22_pre', 'gen_bmw_4er_g22', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Grosse Doppelniere, iDrive 7, Live Cockpit Professional, M Performance Modelle', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_g22_fl', 'gen_bmw_4er_g22', 'LCI (Facelift)', 'lci', 2024, NULL, 'Curved Display, iDrive 8.5, ueberarbeitete Scheinwerfer, neue Aussenfarben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW Z4 G29
('fl_z4_pre', 'gen_bmw_z4_g29', 'Markteinfuehrung', 'markteinfuehrung', 2018, NULL, 'Roadster mit Stoffdach, 10,25-Zoll-Infotainment, iDrive 7, auch als M40i', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi A5 F5
('fl_a5_f5_pre', 'gen_audi_a5_f5', 'Vorfacelift', 'vorfacelift', 2016, 2019, 'Einzelrahmen-Design, separater MMI-Bildschirm, klassische Audi-Bedienlogik', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_a5_f5_fl', 'gen_audi_a5_f5', 'Facelift', 'facelift', 2019, 2024, 'Neue LED-Scheinwerfer, breiterer Singleframe, MIB3-Infotainment, ueberarbeitete Heckpartie', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi Q3 F3
('fl_q3_f3_pre', 'gen_audi_q3_f3', 'Markteinfuehrung', 'markteinfuehrung', 2019, NULL, 'Deutlich gewachsen, Virtual Cockpit, 10,1-Zoll-MMI, auch als Q3 Sportback', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi e-tron GT J1
('fl_etgt_pre', 'gen_audi_etron_j1', 'Vorfacelift', 'vorfacelift', 2021, 2024, 'J1-Plattform (Porsche Taycan), 800V-Architektur, bis zu 646 PS (RS)', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_etgt_fl', 'gen_audi_etron_j1', 'Performance-Update', 'performance-update', 2024, NULL, 'Bis zu 925 PS (RS Performance), groessere Batterie, ueberarbeitete Optik, verbesserte Ladeleistung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- CUPRA Born
('fl_born_pre', 'gen_cupra_born1', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'MEB-Plattform, CUPRA-Design mit Kupfer-Akzenten, bis zu 77 kWh Batterie, DCC Sport', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- MINI Countryman F60
('fl_f60_pre', 'gen_mini_country_f60', 'Vorfacelift', 'vorfacelift', 2017, 2020, 'MINI-typisches Design, 6,5-Zoll-Display, runde Zentral-Instrumente, UKL-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_f60_fl', 'gen_mini_country_f60', 'Facelift (LCI)', 'lci', 2020, 2023, 'Union-Jack-Heckleuchten, 8,8-Zoll-Touchscreen, ueberarbeiteter Innenraum, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Volvo XC90 II
('fl_xc90_pre', 'gen_volvo_xc90_2', 'Vorfacelift', 'vorfacelift', 2015, 2019, 'Sensus 9-Zoll-Touchscreen, Thors-Hammer-Tagfahrlichter, T8 PHEV, SPA-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_xc90_fl', 'gen_volvo_xc90_2', 'Facelift', 'facelift', 2019, NULL, 'Ueberarbeiteter Kuehlergrill, Android Automotive (ab 2022), verbesserte PHEV-Reichweite, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Volvo V60 II
('fl_v60_pre', 'gen_v60_2', 'Vorfacelift', 'vorfacelift', 2018, 2023, 'Sensus Touchscreen, Thors-Hammer-LED, Cross Country verfuegbar, T6/T8 PHEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_v60_fl', 'gen_v60_2', 'Facelift', 'facelift', 2023, NULL, 'Google-basiertes Infotainment, ueberarbeitete Front, verbesserte PHEV-Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Tesla Model S Plaid
('fl_models_p', 'gen_ts_models_p', 'Refresh', 'refresh', 2021, NULL, 'Komplett neues Interieur, Yoke-Lenkrad optional, 17-Zoll-Display, kein Blinkerhebel, Tri-Motor', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
