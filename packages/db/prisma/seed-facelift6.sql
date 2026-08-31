-- Seed: FaceliftPhase Runde 6 — Finale: Restliche Generationen
-- Quelle: Offizielle Hersteller-Pressemitteilungen und Modellhistorie

BEGIN;

INSERT INTO "FaceliftPhase" (id, "generationId", name, slug, "yearFrom", "yearTo", "distinguishingFeatures", status, "publishedAt", "updatedAt", "dataQuality") VALUES
-- BMW 3er E90
('fl_e90_pre', 'gen_bmw_3er_e90', 'Vorfacelift', 'vorfacelift', 2005, 2008, 'Neue Designsprache, iDrive 2. Generation, Bi-Xenon optional, Komfortfahrwerk', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_e90_fl', 'gen_bmw_3er_e90', 'LCI (Facelift)', 'lci', 2008, 2012, 'Ueberarbeitete Scheinwerfer mit LED-Standlicht, iDrive mit Controller-Direktwahltasten, modifizierte Heckleuchten', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- BMW 2er Active Tourer U06
('fl_u06_pre', 'gen_bmw_2er_u06', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Curved Display, iDrive 9, UKL2-Plattform, erstmals M Sport-Paket fuer 2er Active Tourer', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Nissan Leaf II (ZE1)
('fl_leaf2_pre', 'gen_leaf_2', 'Vorfacelift', 'vorfacelift', 2017, 2022, 'V-Motion-Front, 40-kWh-Batterie, e-Pedal, ProPILOT', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_leaf2_fl', 'gen_leaf_2', 'Facelift', 'facelift', 2022, 2023, 'Leicht ueberarbeitete Optik, verbesserte ProPILOT-Software, neue Farben, Auslaufmodell', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Nissan Juke II (F16)
('fl_juke2_pre', 'gen_juke_2', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'Coupehaftes Design, 8-Zoll-Touchscreen, LED-Scheinwerfer, ProPILOT optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_juke2_fl', 'gen_juke_2', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitete Front, 12,3-Zoll-Display, neue Farbkombinationen, erweiterte Konnektivitaet', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Nissan X-Trail IV (T33)
('fl_xtrail4_pre', 'gen_xtrail_4', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'V-Motion-3.0-Design, e-POWER Serienhybrid, 12,3-Zoll-Display, ProPILOT mit Navi-Link', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Nissan Ariya
('fl_ariya_pre', 'gen_ariya_1', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'CMF-EV-Plattform, Shield-Design, 12,3-Zoll-Doppeldisplay, e-4ORCE Allrad optional', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda3 IV (BP)
('fl_mazda3_pre', 'gen_mazda3_4', 'Vorfacelift', 'vorfacelift', 2019, 2024, 'Kodo-Design 2.0, 8,8-Zoll-Bildschirm, Skyactiv-X SPCCI, Head-up-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_mazda3_fl', 'gen_mazda3_4', 'Facelift', 'facelift', 2024, NULL, 'Ueberarbeitete Front, 10,25-Zoll-Display, neue Farben, verbesserte Konnektivitaet', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda MX-5 IV (ND)
('fl_mx5_pre', 'gen_mx5_4', 'Vorfacelift', 'vorfacelift', 2015, 2018, 'Leichtbau-Roadster, Stoffdach, 1,5- und 2,0-Liter-Skyactiv-G', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_mx5_fl', 'gen_mx5_4', 'Facelift', 'facelift', 2018, NULL, 'Ueberarbeiteter Motor (184 PS beim 2.0), Teleskoplenkrad, Apple CarPlay, braune Stoffverdeck-Option', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda CX-60
('fl_cx60_pre', 'gen_cx60_1', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Erste Mazda Hinterradantriebs-Plattform, PHEV und Reihensechszylinder-Diesel, 12,3-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Peugeot 2008 II (P24)
('fl_2008_pre', 'gen_2008_2', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'Loewenklauen-Tagfahrlicht, i-Cockpit, 10-Zoll-Display, auch als e-2008', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_2008_fl', 'gen_2008_2', 'Facelift', 'facelift', 2023, NULL, 'Neues Peugeot-Logo, ueberarbeitete Front, Matrix-LED-Scheinwerfer, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- SEAT Ibiza KJ
('fl_ibiza_pre', 'gen_seat_ibiza_kj', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'MQB-A0-Plattform, 8-Zoll-Display, Full-Link, SEAT-Markendesign', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ibiza_fl', 'gen_seat_ibiza_kj', 'Facelift', 'facelift', 2021, NULL, 'Ueberarbeitete Front und Heck, neues SEAT-Logo, neue LED-Signatur, 9,2-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- SEAT Arona
('fl_arona_pre', 'gen_arona_1', 'Vorfacelift', 'vorfacelift', 2017, 2021, 'Ibiza-Basis mit erhoehter Karosserie, 8-Zoll-Display, Dachkontrastfarbe', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_arona_fl', 'gen_arona_1', 'Facelift', 'facelift', 2021, NULL, 'Neues SEAT-Logo, ueberarbeitete Front, 9,2-Zoll-Display, neue LED-Signatur, neue Farben', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Honda Jazz IV (GR)
('fl_jazz4_pre', 'gen_jazz_4', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Retro-inspiriertes Design, e:HEV Hybrid serienmässig, Magic Seats, Honda SENSING', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Honda CR-V VI
('fl_crv6_pre', 'gen_crv_6', 'Markteinfuehrung', 'markteinfuehrung', 2023, NULL, 'Nur noch Hybrid/PHEV, neues Honda-Design, 9-Zoll-Display, Honda SENSING 360', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Honda e
('fl_hondae_pre', 'gen_hondae_1', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Retro-Design, Kamera-Aussenspiegel, 12,3-Zoll-Doppebildschirm, Hinterradantrieb, 35,5 kWh', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Porsche Panamera 971 II (dritte Generation)
('fl_panamera3_pre', 'gen_por_panamera_3', 'Markteinfuehrung', 'markteinfuehrung', 2023, NULL, 'Komplett neue Generation, Driver Experience Display, Active Ride Fahrwerk, Turbo S E-Hybrid mit 782 PS', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Toyota GR Supra A90
('fl_supra_pre', 'gen_toy_supra_a90', 'Vorfacelift', 'vorfacelift', 2019, 2023, 'Doppelblasen-Dach, BMW-B58-Motor, 8,8-Zoll-Display, ab 2022 auch mit Handschaltung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_supra_fl', 'gen_toy_supra_a90', 'Facelift', 'facelift', 2023, NULL, 'Ueberarbeitete Karosserie-Applikationen, neue Multimedia-Einheit, leicht modifiziertes Interieur', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Fiat Panda III (319)
('fl_panda_pre', 'gen_panda_3', 'Vorfacelift', 'vorfacelift', 2012, 2020, 'Squircle-Design, TFT-Display, City-Mode-Taste, auch als 4x4 und Cross', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_panda_fl', 'gen_panda_3', 'Facelift', 'facelift', 2020, NULL, 'Mild-Hybrid serienmässig, neues Fiat-Logo, ueberarbeitete Front, Sport- und City-Cross-Variante', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Citroen Berlingo III
('fl_berlingo_pre', 'gen_berlingo_3', 'Markteinfuehrung', 'markteinfuehrung', 2018, NULL, 'EMP2-Plattform, 8-Zoll-Touchscreen, Surround-Rear-Vision, Schiebtueren, auch als e-Berlingo', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Citroen C3 III
('fl_c3_pre', 'gen_c3_3', 'Vorfacelift', 'vorfacelift', 2016, 2020, 'Airbumps, 7-Zoll-Touchscreen, Zweifarb-Dach, ConnectedCAM', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_c3_fl', 'gen_c3_3', 'Facelift', 'facelift', 2020, 2024, 'Neue LED-Signatur, ueberarbeitete Front, 10-Zoll-Display, neue Farben und Personalisierungsoptionen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Citroen C4 III
('fl_c4_3_pre', 'gen_c4_3', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Crossover-Design, 10-Zoll-Display, Advanced Comfort Sitze, auch als e-C4, Progressive Hydraulic Cushions', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Citroen C4 X
('fl_c4x_pre', 'gen_c4x_1', 'Markteinfuehrung', 'markteinfuehrung', 2022, NULL, 'Stufenheck-Crossover, 10-Zoll-Display, gleiche Plattform wie C4, 510 Liter Kofferraum', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Citroen C5 Aircross
('fl_c5air_pre', 'gen_c5air_1', 'Vorfacelift', 'vorfacelift', 2018, 2022, 'Progressive Hydraulic Cushions, drei Einzelsitze hinten, 8-Zoll-Touchscreen, Airbumps', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_c5air_fl', 'gen_c5air_1', 'Facelift', 'facelift', 2022, NULL, 'Neues Citroen-Logo, V-foermige LED-Signatur, ueberarbeiteter Innenraum, 10-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- DS 3 Crossback
('fl_ds3cb_pre', 'gen_ds3cb_1', 'Markteinfuehrung', 'markteinfuehrung', 2019, NULL, 'Rautenmuster-Design, ausfahrbare Tuergriffe, DS Matrix LED Vision, auch als E-Tense, 10,3-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- DS 4 II
('fl_ds4_pre', 'gen_ds4_2', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'Rahmenlose DS-Matrix-LED, IRIS-System mit 10-Zoll-Display, Extended Head-up-Display, EMP2-Plattform', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- DS 7
('fl_ds7_pre', 'gen_ds7_1', 'Vorfacelift', 'vorfacelift', 2017, 2022, 'DS-Wings-Front, Matrix-LED-Scheinwerfer, 12-Zoll-Display, Night-Vision, DS Active Scan', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ds7_fl', 'gen_ds7_1', 'Facelift', 'facelift', 2022, NULL, 'Neues DS-Logo, ueberarbeitete Front, IRIS 2.0-Infotainment, neue PHEV-Variante mit 360 PS', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- DS 9
('fl_ds9_pre', 'gen_ds9_1', 'Markteinfuehrung', 'markteinfuehrung', 2020, NULL, 'Oberklasse-Limousine, 4,93 m, DS Active Scan Suspension, Opera-Innenraum, E-Tense PHEV', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Fiat Ducato III
('fl_ducato_pre', 'gen_ducato_3', 'Vorfacelift', 'vorfacelift', 2006, 2014, 'Neue Nutzfahrzeug-Generation, gemeinsam mit PSA (Jumper/Boxer), diverse Aufbaulaengen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_ducato_fl', 'gen_ducato_3', 'Facelift', 'facelift', 2014, NULL, 'Ueberarbeitete Front, Euro-6-Motoren, 5- oder 7-Zoll-Display, auch als E-Ducato, neues Fiat-Logo ab 2022', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Fiat Tipo II
('fl_tipo_pre', 'gen_tipo_2', 'Vorfacelift', 'vorfacelift', 2015, 2020, '5-Tuerer, Kombi und Limousine, 5- oder 7-Zoll-Display, einfache aber zweckmaessige Ausstattung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_tipo_fl', 'gen_tipo_2', 'Facelift', 'facelift', 2020, NULL, 'Neues Fiat-Logo, nur noch als 5-Tuerer und Kombi (Cross), ueberarbeitete Front, 10,25-Zoll-Display, LED-Scheinwerfer', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Honda HR-V III
('fl_hrv3_pre', 'gen_hrv_3', 'Markteinfuehrung', 'markteinfuehrung', 2021, NULL, 'e:HEV Hybrid serienmässig, minimalistisches Design, 9-Zoll-Display, Honda SENSING', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Mazda2 IV
('fl_mazda2_pre', 'gen_mazda2_4', 'Markteinfuehrung', 'markteinfuehrung', 2015, NULL, 'Kodo-Design, Skyactiv-Technik, 7-Zoll-Display, Head-up-Display optional, ab 2022 auch als Mazda2 Hybrid (Toyota-Basis)', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),

-- Peugeot 5008 II
('fl_5008_pre', 'gen_5008_2', 'Vorfacelift', 'vorfacelift', 2017, 2020, '7-Sitzer-SUV, i-Cockpit, 8-Zoll-Touchscreen, EMP2-Plattform, drei Einzelsitze in Reihe 2', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('fl_5008_fl', 'gen_5008_2', 'Facelift', 'facelift', 2020, 2024, 'Neues Peugeot-Loewen-Logo, rahmenloser Kuehlergrill, Matrix-LED-Scheinwerfer, 10-Zoll-Display', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')

ON CONFLICT (id) DO NOTHING;

COMMIT;
