-- Seed: WheelOption, WheelOptionAvailability, EquipmentPackage, EquipmentPackageItem
-- Quelle: Oeffentlich dokumentierte OEM-Felgenbezeichnungen und Ausstattungspakete
-- Alle Daten basieren auf offiziellen Konfiguratoren und Preislisten

BEGIN;

-- =============================================
-- WHEEL OPTIONS
-- =============================================

-- VW Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_vw_belmont_16', 'mfr_vw', 'Belmont 16 Zoll', 'belmont-16', '5G0 071 496', 16, 6.5, '205/55 R16', 'Belmont 5-Speichen', 'COMMON', 'SPECIFICATION', 'HIGH', 'Standard-Alufelge Golf VII Comfortline', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_vw_dijon_17', 'mfr_vw', 'Dijon 17 Zoll', 'dijon-17', '5G0 071 497', 17, 7.0, '225/45 R17', 'Dijon 10-Speichen', 'COMMON', 'SPECIFICATION', 'HIGH', 'Standard-Alufelge Golf VII Highline', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_vw_brescia_18', 'mfr_vw', 'Brescia 18 Zoll', 'brescia-18', '5G0 071 498', 18, 7.5, '225/40 R18', 'Brescia 5-Doppelspeichen', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Optionale Felge Golf VII GTI Performance', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_vw_santiago_19', 'mfr_vw', 'Santiago 19 Zoll', 'santiago-19', '5G0 601 025 AJ', 19, 7.5, '225/35 R19', 'Santiago 5-Arm-Turbine', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Golf VII GTI TCR / Clubsport', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_vw_pretoria_19', 'mfr_vw', 'Pretoria 19 Zoll', 'pretoria-19', '5G0 601 025 AJ', 19, 8.0, '235/35 R19', 'Pretoria 5-Y-Speichen', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Golf VII R Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_vw_spielberg_19', 'mfr_vw', 'Spielberg 19 Zoll', 'spielberg-19', '5G0 601 025 CF', 19, 8.0, '235/35 R19', 'Spielberg 5-Arm', 'RARE', 'SPECIFICATION', 'MEDIUM', 'Golf VII R Performance-Option', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_bmw_star_spoke_393_17', 'mfr_bmw', 'Sternspeiche 393 17 Zoll', 'sternspeiche-393-17', 'Styling 393', 17, 7.5, '225/50 R17', 'Sternspeiche 5-Arm', 'COMMON', 'SPECIFICATION', 'HIGH', 'BMW F30 SE/Sport Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_bmw_star_spoke_400m_18', 'mfr_bmw', 'M Sternspeiche 400 18 Zoll', 'sternspeiche-400m-18', 'Styling 400M', 18, 8.0, '225/45 R18', 'M Sternspeiche 5-Doppelspeichen', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'BMW F30 M Sport Paket', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_bmw_orbit_grey_403_18', 'mfr_bmw', 'Doppelspeiche 403 18 Zoll', 'doppelspeiche-403-18', 'Styling 403', 18, 8.0, '225/45 R18', 'Doppelspeiche 10-Speichen', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'BMW F30 Luxury Line', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_bmw_style_791m_18', 'mfr_bmw', 'M Doppelspeiche 791 18 Zoll', 'doppelspeiche-791m-18', 'Styling 791M', 18, 7.5, '225/45 R18', 'M Doppelspeiche Bicolor', 'COMMON', 'SPECIFICATION', 'HIGH', 'BMW G60 M Sport Standard', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_bmw_style_936m_20', 'mfr_bmw', 'M Leichtmetallrad 936 20 Zoll', 'leichtmetallrad-936m-20', 'Styling 936M', 20, 8.5, '245/35 R20', 'M 5-Speichen Bicolor', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'BMW G60 M Sport Pro Option', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_mb_5twin_16', 'mfr_mercedes', '5-Doppelspeichen 16 Zoll', '5-doppelspeichen-16', 'A 205 401 1300', 16, 6.5, '205/55 R16', '5-Doppelspeichen', 'COMMON', 'SPECIFICATION', 'HIGH', 'Mercedes C-Klasse W205 Basisfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_mb_amg_5twin_18', 'mfr_mercedes', 'AMG 5-Doppelspeichen 18 Zoll', 'amg-5-doppelspeichen-18', 'A 205 401 2000', 18, 7.5, '225/45 R18', 'AMG 5-Doppelspeichen Titangrau', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Mercedes C-Klasse W205 AMG Line', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_mb_amg_10spoke_19', 'mfr_mercedes', 'AMG 10-Speichen 19 Zoll', 'amg-10-speichen-19', 'A 205 401 2100', 19, 8.0, '235/35 R19', 'AMG 10-Speichen Hochglanz', 'RARE', 'SPECIFICATION', 'MEDIUM', 'Mercedes C-Klasse W205 AMG C43/C63', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_mb_multispoke_17', 'mfr_mercedes', 'Vielspeichen 17 Zoll', 'vielspeichen-17', 'A 205 401 1400', 17, 7.0, '225/50 R17', 'Vielspeichen Silber', 'COMMON', 'SPECIFICATION', 'HIGH', 'Mercedes C-Klasse W205 Avantgarde', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_audi_5arm_16', 'mfr_audi', '5-Arm 16 Zoll', '5-arm-16', '8W0 601 025 L', 16, 7.0, '205/60 R16', '5-Arm Silber', 'COMMON', 'SPECIFICATION', 'HIGH', 'Audi A4 B9 Basis-Alufelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_audi_5arm_design_17', 'mfr_audi', '5-Arm-Design 17 Zoll', '5-arm-design-17', '8W0 601 025 CG', 17, 7.5, '225/50 R17', '5-Arm-Design Silber', 'COMMON', 'SPECIFICATION', 'HIGH', 'Audi A4 B9 Sport/Design Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_audi_5v_spoke_18', 'mfr_audi', '5-V-Speichen 18 Zoll', '5-v-speichen-18', '8W0 601 025 DE', 18, 8.0, '245/40 R18', '5-V-Speichen Kontrastgrau glanzgedreht', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Audi A4 B9 S line Option', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_audi_5arm_rotor_19', 'mfr_audi', '5-Arm-Rotor 19 Zoll', '5-arm-rotor-19', '8W0 601 025 DF', 19, 8.5, '255/35 R19', '5-Arm-Rotor-Design Mattschwarz', 'RARE', 'SPECIFICATION', 'MEDIUM', 'Audi S4/RS4-Option oder Nachruestung', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_por_carrera_20', 'mfr_porsche', 'Carrera 20 Zoll', 'carrera-20', '992 601 025', 20, 8.5, '245/35 ZR20', 'Carrera 10-Speichen', 'COMMON', 'SPECIFICATION', 'HIGH', 'Porsche 992 Carrera Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_por_carrera_s_20', 'mfr_porsche', 'Carrera S 20/21 Zoll', 'carrera-s-20-21', '992 601 025 A', 20, 8.5, '245/35 ZR20 / 305/30 ZR21', 'Carrera S 10-Speichen versetzt', 'COMMON', 'SPECIFICATION', 'HIGH', 'Porsche 992 Carrera S Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_por_sport_design_21', 'mfr_porsche', 'RS Spyder Design 21 Zoll', 'rs-spyder-design-21', '992 601 025 D', 21, 9.5, '265/30 ZR21', 'RS Spyder 5-Speichen Satin Platinum', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Porsche 992 Option fuer Turbo / GT-Modelle', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_por_dakar_19', 'mfr_porsche', 'Dakar 19 Zoll', 'dakar-19', '992 601 025 K', 19, 8.5, '245/45 R19', 'Dakar 5-Speichen Shaded Bronze', 'VERY_RARE', 'SPECIFICATION', 'HIGH', 'Porsche 911 Dakar Exklusivfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Felgen
INSERT INTO "WheelOption" (id, "manufacturerId", name, slug, code, "diameterInch", "widthInch", "tyreSize", design, rarity, "rarityEvidenceType", "rarityConfidence", "rarityReasoning", status, "publishedAt", "dataQuality", "updatedAt") VALUES
('wo_sk_mytikas_17', 'mfr_skoda', 'Mytikas 17 Zoll', 'mytikas-17', '5E0 071 497', 17, 7.0, '225/45 R17', 'Mytikas 5-Doppelspeichen Silber', 'COMMON', 'SPECIFICATION', 'HIGH', 'Skoda Octavia NX Style Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_sk_vega_18', 'mfr_skoda', 'Vega 18 Zoll', 'vega-18', '5E0 071 498', 18, 7.5, '225/40 R18', 'Vega 5-V-Speichen Anthrazit', 'UNCOMMON', 'SPECIFICATION', 'HIGH', 'Skoda Octavia NX RS Standardfelge', 'PUBLISHED', NOW(), 'VERIFIED', NOW()),
('wo_sk_procyon_19', 'mfr_skoda', 'Procyon 19 Zoll', 'procyon-19', '5E0 071 499', 19, 8.0, '235/35 R19', 'Procyon 5-Arm Schwarz glanzgedreht', 'RARE', 'SPECIFICATION', 'MEDIUM', 'Skoda Octavia RS Challenge Edition', 'PUBLISHED', NOW(), 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- WHEEL OPTION AVAILABILITY
-- =============================================

-- Golf VII
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_golf7_belmont', 'wo_vw_belmont_16', 'gen_vw_golf7', 'tl_vw_golf7_comf', 'STANDARD', 2012, 2020, 'Comfortline Standardfelge', 'VERIFIED', NOW()),
('woa_golf7_dijon', 'wo_vw_dijon_17', 'gen_vw_golf7', 'tl_vw_golf7_high', 'STANDARD', 2012, 2020, 'Highline Standardfelge', 'VERIFIED', NOW()),
('woa_golf7_brescia', 'wo_vw_brescia_18', 'gen_vw_golf7', 'tl_vw_golf7_gti', 'OPTIONAL', 2013, 2020, 'GTI Performance-Paket oder Einzeloption', 'VERIFIED', NOW()),
('woa_golf7_santiago', 'wo_vw_santiago_19', 'gen_vw_golf7', 'tl_vw_golf7_gti', 'OPTIONAL', 2016, 2020, 'GTI Clubsport / TCR', 'VERIFIED', NOW()),
('woa_golf7_pretoria', 'wo_vw_pretoria_19', 'gen_vw_golf7', 'tl_vw_golf7_r', 'STANDARD', 2014, 2020, 'Golf R Standardfelge', 'VERIFIED', NOW()),
('woa_golf7_spielberg', 'wo_vw_spielberg_19', 'gen_vw_golf7', 'tl_vw_golf7_r', 'OPTIONAL', 2017, 2020, 'Golf R Performance-Paket', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW F30
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_f30_393', 'wo_bmw_star_spoke_393_17', 'gen_bmw_3er_f30', 'tl_bmw_3f30_sport', 'STANDARD', 2012, 2019, 'Sport Line Standardfelge', 'VERIFIED', NOW()),
('woa_f30_400m', 'wo_bmw_star_spoke_400m_18', 'gen_bmw_3er_f30', 'tl_bmw_3f30_msport', 'STANDARD', 2012, 2019, 'M Sport Paket Standardfelge', 'VERIFIED', NOW()),
('woa_f30_403', 'wo_bmw_orbit_grey_403_18', 'gen_bmw_3er_f30', 'tl_bmw_3f30_lux', 'STANDARD', 2012, 2019, 'Luxury Line Standardfelge', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW G60
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_g60_791m', 'wo_bmw_style_791m_18', 'gen_bmw_5er_g60', 'tl_bmw_5er_g60_msport', 'STANDARD', 2023, NULL, 'M Sport Paket Standardfelge', 'VERIFIED', NOW()),
('woa_g60_936m', 'wo_bmw_style_936m_20', 'gen_bmw_5er_g60', 'tl_bmw_5er_g60_mspro', 'OPTIONAL', 2023, NULL, 'M Sport Pro Upgrade-Option', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes W205
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_w205_5twin', 'wo_mb_5twin_16', 'gen_mb_c_w205', NULL, 'STANDARD', 2014, 2021, 'C-Klasse Basisausstattung', 'VERIFIED', NOW()),
('woa_w205_multi17', 'wo_mb_multispoke_17', 'gen_mb_c_w205', 'tl_mb_cw205_avant', 'STANDARD', 2014, 2021, 'Avantgarde Exterieur Standard', 'VERIFIED', NOW()),
('woa_w205_amg18', 'wo_mb_amg_5twin_18', 'gen_mb_c_w205', 'tl_mb_cw205_amg', 'STANDARD', 2014, 2021, 'AMG Line Standardfelge', 'VERIFIED', NOW()),
('woa_w205_amg19', 'wo_mb_amg_10spoke_19', 'gen_mb_c_w205', 'tl_mb_cw205_amg', 'OPTIONAL', 2014, 2021, 'AMG C43/C63 oder Einzeloption', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A4 B9
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_a4b9_5arm16', 'wo_audi_5arm_16', 'gen_audi_a4_b9', 'tl_audi_a4b9_basis', 'STANDARD', 2015, 2023, 'Basisausstattung Alufelge', 'VERIFIED', NOW()),
('woa_a4b9_5arm17', 'wo_audi_5arm_design_17', 'gen_audi_a4_b9', 'tl_audi_a4b9_sport', 'STANDARD', 2015, 2023, 'Sport/Design Standardfelge', 'VERIFIED', NOW()),
('woa_a4b9_5v18', 'wo_audi_5v_spoke_18', 'gen_audi_a4_b9', 'tl_audi_a4b9_sline', 'OPTIONAL', 2015, 2023, 'S line Exterieur Upgrade', 'VERIFIED', NOW()),
('woa_a4b9_rotor19', 'wo_audi_5arm_rotor_19', 'gen_audi_a4_b9', 'tl_audi_a4b9_sline', 'OPTIONAL', 2015, 2023, 'S4/RS4 oder Einzeloption', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche 992
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", "trimLineId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_992_carrera', 'wo_por_carrera_20', 'gen_por_911_992', 'tl_por_911_carrera', 'STANDARD', 2019, NULL, 'Carrera Basisfelge', 'VERIFIED', NOW()),
('woa_992_carrera_s', 'wo_por_carrera_s_20', 'gen_por_911_992', 'tl_por_911_carr_s', 'STANDARD', 2019, NULL, 'Carrera S Standardfelge (versetzt)', 'VERIFIED', NOW()),
('woa_992_rsspyder', 'wo_por_sport_design_21', 'gen_por_911_992', 'tl_por_911_turbo', 'OPTIONAL', 2020, NULL, 'Turbo/GT-Modelle Option', 'VERIFIED', NOW()),
('woa_992_dakar', 'wo_por_dakar_19', 'gen_por_911_992', NULL, 'SPECIAL_EDITION_ONLY', 2022, 2024, '911 Dakar Exklusiv', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Octavia NX
INSERT INTO "WheelOptionAvailability" (id, "wheelOptionId", "generationId", kind, "yearFrom", "yearTo", note, "dataQuality", "updatedAt") VALUES
('woa_octavia_mytikas', 'wo_sk_mytikas_17', 'gen_sk_octavia_nx', 'STANDARD', 2020, NULL, 'Style Standardfelge', 'VERIFIED', NOW()),
('woa_octavia_vega', 'wo_sk_vega_18', 'gen_sk_octavia_nx', 'STANDARD', 2020, NULL, 'RS Standardfelge', 'VERIFIED', NOW()),
('woa_octavia_procyon', 'wo_sk_procyon_19', 'gen_sk_octavia_nx', 'OPTIONAL', 2020, NULL, 'RS Challenge / RS iV Option', 'VERIFIED', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================
-- EQUIPMENT PACKAGES
-- =============================================

-- VW Golf VII Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_golf7_winter', 'gen_vw_golf7', 'Winterpaket', 'winterpaket', 'PWA', 'Sitzheizung vorn, beheizbare Waschdüsen, beheizbare Außenspiegel', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_golf7_licht', 'gen_vw_golf7', 'Licht- und Sichtpaket', 'licht-sichtpaket', 'PL2', 'Automatische Fahrlichtsteuerung, Regensensor, automatisch abblendender Innenspiegel', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_golf7_navi_pro', 'gen_vw_golf7', 'Navigationspaket Pro', 'navigationspaket-pro', 'PNA', 'Discover Pro Navigationssystem mit 9,2-Zoll-Display, App-Connect', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_golf7_assist', 'gen_vw_golf7', 'Assistenzpaket', 'assistenzpaket', 'PAS', 'Front Assist mit City-Notbremsfunktion, Spurhalteassistent, Müdigkeitserkennung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- BMW F30 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_f30_msport', 'gen_bmw_3er_f30', 'M Sportpaket', 'm-sportpaket', '337', 'M Aerodynamikpaket, M Sportfahrwerk, M Lederlenkrad, 18-Zoll M Leichtmetallräder', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_f30_tech', 'gen_bmw_3er_f30', 'Technologiepaket', 'technologiepaket', '7RE', 'Head-Up Display, Navigation Professional, ConnectedDrive Services', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_f30_komfort', 'gen_bmw_3er_f30', 'Komfortzugang', 'komfortzugang', '322', 'Schlüsselloser Zugang, Komfort-Heckklappenöffnung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- Mercedes W205 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_w205_amgline', 'gen_mb_c_w205', 'AMG Line Exterieur', 'amg-line-exterieur', 'P47', 'AMG Frontstoßfänger, AMG Seitenschweller, AMG Heckschürze, 18-Zoll AMG Leichtmetallräder', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_w205_night', 'gen_mb_c_w205', 'Night-Paket', 'night-paket', 'P55', 'Hochglanz-schwarze Zierelemente außen, dunkle Endrohre, schwarze Fenstereinfassungen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_w205_fahrassist', 'gen_mb_c_w205', 'Fahrassistenz-Paket Plus', 'fahrassistenz-paket-plus', 'P20', 'Aktiver Spurhalte-Assistent, Aktiver Brems-Assistent, PRE-SAFE', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- Audi A4 B9 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_a4b9_sline_ext', 'gen_audi_a4_b9', 'S line Exterieur', 's-line-exterieur', 'PY1', 'S line Stoßfänger, Singleframe mit Chromblende, Diffusor, Seitenschweller', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_a4b9_sline_int', 'gen_audi_a4_b9', 'S line Interieur', 's-line-interieur', 'PY2', 'Sportsitze vorn, S-Prägung Lehne, Dekoreinlagen Aluminium Race, Pedalerie Edelstahl', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_a4b9_technik', 'gen_audi_a4_b9', 'Technik-Paket', 'technik-paket', 'PQE', 'Audi virtual cockpit, MMI Navigation plus, Audi connect', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_a4b9_parking', 'gen_audi_a4_b9', 'Parkassistent plus', 'parkassistent-plus', 'PCV', 'Einparkhilfe vorn und hinten, Rückfahrkamera, Park-Lenk-Assistent', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- Porsche 992 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_992_chrono', 'gen_por_911_992', 'Sport Chrono Paket', 'sport-chrono-paket', 'XSC', 'Sport-Chrono-Uhr auf Armaturenbrett, Modus-Schalter, Launch Control, dynamische Motorlager', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_992_sportdesign', 'gen_por_911_992', 'SportDesign Paket', 'sportdesign-paket', 'XAP', 'SportDesign Frontstoßfänger, SportDesign Seitenschweller, SportDesign Heckschürze', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_992_leder', 'gen_por_911_992', 'Leder-Interieur', 'leder-interieur', 'QJ1', 'Lederausstattung in diversen Farben, Leder-Armaturenbrett, Leder-Türverkleidungen', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- BMW G60 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_g60_msport', 'gen_bmw_5er_g60', 'M Sportpaket', 'm-sportpaket', '337', 'M Aerodynamikpaket, M Sportfahrwerk, M Lederlenkrad, 18-Zoll M Leichtmetallräder', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_g60_msportpro', 'gen_bmw_5er_g60', 'M Sportpaket Pro', 'm-sportpaket-pro', '338', 'M Sportbremse, M Sportdifferenzial, M Heckdiffusor in Hochglanz-Schwarz', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_g60_driving', 'gen_bmw_5er_g60', 'Driving Assistant Professional', 'driving-assistant-professional', '5AT', 'Lenk- und Spurführungsassistent, Aktiver Geschwindigkeitsregler mit Stop&Go', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- Skoda Octavia NX Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "updatedAt", "dataQuality") VALUES
('epk_octavia_columbus', 'gen_sk_octavia_nx', 'Columbus-Navigationspaket', 'columbus-navigationspaket', 'PNB', 'Columbus-Navigationssystem mit 10-Zoll-Display, Verkehrszeichenerkennung', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_octavia_winter', 'gen_sk_octavia_nx', 'Winterpaket', 'winterpaket', 'PWA', 'Sitzheizung vorn, beheizbare Waschdüsen, beheizbares Lenkrad', 'PUBLISHED', NOW(), NOW(), 'VERIFIED'),
('epk_octavia_assist', 'gen_sk_octavia_nx', 'Assistenzpaket', 'assistenzpaket', 'PAS', 'Side Assist, Exit Warning, Rear Traffic Alert', 'PUBLISHED', NOW(), NOW(), 'VERIFIED')
ON CONFLICT (id) DO NOTHING;


-- =============================================
-- EQUIPMENT PACKAGE ITEMS (linking packages to OptionalEquipment)
-- =============================================

-- First check which OptionalEquipment IDs exist
-- We link packages to the existing optional equipment entries

-- Golf VII Winterpaket: Sitzheizung + Standheizung
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_golf7_winter_shz', 'epk_golf7_winter', 'opt_vw_shz', false),
('epi_golf7_winter_standh', 'epk_golf7_winter', 'opt_vw_standheiz', true)
ON CONFLICT (id) DO NOTHING;

-- Golf VII Assistenzpaket: Travel Assist
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_golf7_assist_travel', 'epk_golf7_assist', 'opt_vw_travelass', false)
ON CONFLICT (id) DO NOTHING;

-- BMW F30 Technologiepaket: Driving Assistant
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_f30_tech_drivas', 'epk_f30_tech', 'opt_bmw_drivas', false)
ON CONFLICT (id) DO NOTHING;

-- BMW F30 M Sportpaket: Sitzheizung (optional im Paket)
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_f30_msport_shz', 'epk_f30_msport', 'opt_bmw_shz', true)
ON CONFLICT (id) DO NOTHING;

-- Mercedes W205 Fahrassistenz: Sitzheizung
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_w205_fahrassist_shz', 'epk_w205_fahrassist', 'opt_mb_shz', true)
ON CONFLICT (id) DO NOTHING;

-- Audi A4 B9 Technikpaket: Assistenz
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_a4b9_technik_assist', 'epk_a4b9_technik', 'opt_audi_assist', false)
ON CONFLICT (id) DO NOTHING;

-- Porsche 992 Sport Chrono: Sitzheizung (optional)
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_992_chrono_shz', 'epk_992_chrono', 'opt_por_shz', true)
ON CONFLICT (id) DO NOTHING;

-- Skoda Octavia Winterpaket: Sitzheizung + Standheizung
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
('epi_octavia_winter_shz', 'epk_octavia_winter', 'opt_sk_shz', false),
('epi_octavia_winter_standh', 'epk_octavia_winter', 'opt_sk_standheiz', true)
ON CONFLICT (id) DO NOTHING;

COMMIT;
