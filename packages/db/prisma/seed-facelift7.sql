-- Seed: FaceliftPhase Runde 7 — Lueckenfueller: Generationen ohne FaceliftPhase
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- Peugeot 3008 II
('fl_3008_pre', 'gen_3008_2', 'Vorfacelift', 'vorfacelift', 2016, 2020, 'i-Cockpit zweite Generation, 12,3-Zoll-Display, Loewenklauen-Tagfahrlicht, EMP2-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_3008_fl', 'gen_3008_2', 'Facelift', 'facelift', 2020, 2024, 'Neues Peugeot-Logo, rahmenloser Kuehlergrill, Matrix-LED, neue Farben, ueberarbeitetes Cockpit', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Fiat 500e
('fl_500e_pre', 'gen_500e_1', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Komplett neue Elektro-Plattform, Retro-Design, 10,25-Zoll-Display, 42-kWh-Batterie, auch als Cabrio und 3+1', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Audi Q5 FY
('fl_q5_fy_pre', 'gen_audi_q5_fy', 'Vorfacelift', 'vorfacelift', 2017, 2020, 'MLB-evo-Plattform, Virtual Cockpit, 8,3-Zoll-MMI, quattro serienmässig', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_q5_fy_fl', 'gen_audi_q5_fy', 'Facelift', 'facelift', 2020, 2024, 'Ueberarbeitete Front, OLED-Heckleuchten, 10,1-Zoll-Touch-Display, MIB3, S line Black Edition', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Honda Civic XI
('fl_civic11_pre', 'gen_civic_11', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Klares Liniendesign, 9-Zoll-Display, Honda SENSING, e:HEV Hybrid, Sport Tourer Kombi', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- CUPRA Formentor
('fl_formentor_pre', 'gen_cupra_formentor1', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Erstes eigenstaendiges CUPRA-Modell, MQB-evo, Kupfer-Akzente, bis zu 310 PS VZ5', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_formentor_fl', 'gen_cupra_formentor1', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitete Front, neue LED-Signatur, 12,9-Zoll-Display, Matrix-LED, erweitertes DCC', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda CX-5 II
('fl_cx5_pre', 'gen_cx5_2', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'Kodo-Design, 7-Zoll-Display, Skyactiv-Technik, i-Activsense Assistenzsysteme', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_cx5_fl', 'gen_cx5_2', 'Facelift', 'facelift', 2021, NULL, 'Ueberarbeitete Front, 10,25-Zoll-Display, neue Interieurfarben, Zylinderabschaltung beim 2.5', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Dacia Sandero III
('fl_sandero3_pre', 'gen_dacia_sandero3', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'CMF-B-Plattform, Y-foermige LED-Signatur, 8-Zoll-Display, Media Nav, auch als Stepway', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Ford Focus Mk4
('fl_focus4_pre', 'gen_ford_focus_mk4', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'C2-Plattform, 8-Zoll-SYNC3, Ford Co-Pilot360, Active-Variante', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_focus4_fl', 'gen_ford_focus_mk4', 'Facelift', 'facelift', 2022, 2025, 'Ueberarbeitete Front, 13,2-Zoll-SYNC4-Display, neues Ford-Logo, Matrix-LED', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Hyundai i30 PD
('fl_i30_pre', 'gen_hy_i30_pd', 'Vorfacelift', 'vorfacelift', 2017, 2020, '8-Zoll-Display, Cascading-Grille, i30 N Performance ab 2018', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_i30_fl', 'gen_hy_i30_pd', 'Facelift', 'facelift', 2020, NULL, 'Ueberarbeitete Front, 10,25-Zoll-Display, parametrische Tagfahrlichter, 48V-Mild-Hybrid', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Hyundai IONIQ 5
('fl_ioniq5_pre', 'gen_hy_ioniq5_ne', 'Vorfacelift', 'vorfacelift', 2021, 2025, 'E-GMP-Plattform, 800V-Architektur, Pixel-LED-Scheinwerfer, Vehicle-to-Load', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ioniq5_fl', 'gen_hy_ioniq5_ne', 'Facelift', 'facelift', 2025, NULL, 'Ueberarbeitete Front, Active-Air-Flap, neue Farben, groessere Batterie, verbesserte Ladeleistung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Kia EV6
('fl_ev6_pre', 'gen_kia_ev6_cv', 'Vorfacelift', 'vorfacelift', 2021, 2025, 'E-GMP-Plattform, 800V, bis zu 585 PS (GT), Crossover-Design, Vehicle-to-Load', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ev6_fl', 'gen_kia_ev6_cv', 'Facelift', 'facelift', 2025, NULL, 'Ueberarbeitete Frontpartie, neues Star-Map-LED-Design, groessere Batterie, verbesserte Ladegeschwindigkeit', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Kia Sportage NQ5
('fl_sportage_pre', 'gen_kia_sportage_nq5', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Boomerang-Tagfahrlicht, 12,3-Zoll-Curved-Display, N Line, auch als PHEV und HEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mercedes GLC X254
('fl_glc_x254_pre', 'gen_mb_glc_x254', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'MBUX 2.0, 11,9-Zoll-Portrait-Display, neue Designsprache, auch als Coupe und AMG', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Porsche Cayenne E3
('fl_cayenne_e3_pre', 'gen_por_cayenne_e3', 'Vorfacelift', 'vorfacelift', 2018, 2023, 'Neues Cayenne-Design, 12,3-Zoll-Touchscreen, PCM 6.0, Porsche Surface Coated Brakes', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_cayenne_e3_fl', 'gen_por_cayenne_e3', 'Facelift', 'facelift', 2023, NULL, 'HD-Matrix-LED, ueberarbeitetes PCM, neue Turbo-GT-Variante, verbesserte PHEV-Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Porsche Taycan Y1A
('fl_taycan_pre', 'gen_por_taycan_y1a', 'Vorfacelift', 'vorfacelift', 2019, 2024, '800V-Architektur, bis zu 761 PS (Turbo S), 2-Gang-Getriebe Hinterachse, PCM mit Curved-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_taycan_fl', 'gen_por_taycan_y1a', 'Facelift', 'facelift', 2024, NULL, 'Groessere Batterie (105 kWh), bis zu 952 PS (Turbo GT), verbesserte Ladeleistung bis 320 kW, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Nissan Qashqai III
('fl_qashqai3_pre', 'gen_qashqai_3', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'CMF-C-Plattform, 12,3-Zoll-Display, e-POWER Serienhybrid, ProPILOT mit Navi-Link', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Renault Captur II
('fl_captur2_pre', 'gen_ren_captur2', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'CMF-B-Plattform, 9,3-Zoll-Display, C-foermige LED-Signatur, E-TECH Hybrid/PHEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_captur2_fl', 'gen_ren_captur2', 'Facelift', 'facelift', 2024, NULL, 'Neue LED-Signatur, ueberarbeitetes Interieur, OpenR Link (Android Automotive), neues Renault-Logo', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Renault Clio V
('fl_clio5_pre', 'gen_ren_clio5', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'CMF-B-Plattform, 9,3-Zoll-Display, C-foermige LED, E-TECH Hybrid', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_clio5_fl', 'gen_ren_clio5', 'Facelift', 'facelift', 2023, NULL, 'Neues Renault-Logo, OpenR Link, ueberarbeitete Frontpartie, neue LED-Signatur', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Toyota Yaris XP210
('fl_yaris4_pre', 'gen_toy_yaris_xp210', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'GA-B-Plattform (TNGA), 2-Zylinder-Hybrid, 8- oder 9-Zoll-Display, Toyota Safety Sense', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Tesla Model 3 Highland
('fl_model3hr_pre', 'gen_ts_model3_hr', 'Highland Refresh', 'highland', 2023, NULL, 'Komplett ueberarbeitetes Exterieur und Interieur, neues LED-Band, Ambientebeleuchtung, verbesserte Daemmung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Tesla Model Y
('fl_modely_pre', 'gen_ts_modely_1', 'Vorfacelift', 'vorfacelift', 2020, 2024, 'Model-3-basiert, SUV-Proportionen, 15-Zoll-Touchscreen, Falcon-Wing-Doors nicht uebernommen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_modely_fl', 'gen_ts_modely_1', 'Juniper Refresh', 'juniper', 2025, NULL, 'Komplett ueberarbeitete Front und Heck, neues LED-Band, ueberarbeitetes Interieur, verbesserte Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Volvo XC40
('fl_xc40_pre', 'gen_volvo_xc40_1', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'CMA-Plattform, 9-Zoll-Sensus-Touchscreen, Thors-Hammer-LED, auch als Recharge (EX40)', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_xc40_fl', 'gen_volvo_xc40_1', 'Facelift', 'facelift', 2022, NULL, 'Google-basiertes Infotainment (Android Automotive), ueberarbeitete Front, neue Farben, verbesserte PHEV-Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Volvo XC60 II
('fl_xc60_pre', 'gen_volvo_xc60_2', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'SPA-Plattform, Sensus 9-Zoll-Touchscreen, Thors-Hammer-LED, T8 PHEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_xc60_fl', 'gen_volvo_xc60_2', 'Facelift', 'facelift', 2021, NULL, 'Google-basiertes Infotainment, ueberarbeiteter Kuehlergrill, neue Farben, verbesserte PHEV-Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW ID.3
('fl_id3_pre', 'gen_vw_id3_e1', 'Vorfacelift', 'vorfacelift', 2020, 2023, 'MEB-Plattform, 10-Zoll-Display, ID. Light, Touch-Slider, Software 2.x', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_id3_fl', 'gen_vw_id3_e1', 'Facelift', 'facelift', 2023, NULL, 'Ueberarbeitetes Display (12 Zoll), physische Tasten zurueck, Software 4.x, neue LED-Signatur, verbesserte Materialien', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- VW Tiguan III
('fl_tiguan3_pre', 'gen_vw_tiguan_3', 'Markteinfuehrung', 'markteinfuehrung', 2024, NULL, 'MQB-evo-Plattform, 15-Zoll-Display, IQ.Light HD, eHybrid PHEV mit 100 km Reichweite', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
