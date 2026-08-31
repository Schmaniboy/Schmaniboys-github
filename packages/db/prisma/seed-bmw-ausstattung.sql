-- =============================================================================
-- BMW Sonderausstattung und Pakete fuer 3er (alle Generationen)
-- Quellen: BMW Preislisten, BMW AG Ausstattungskatalog
-- =============================================================================

BEGIN;

-- =============================================================================
-- SONDERAUSSTATTUNG (OptionalEquipment) — herstellerweit fuer BMW
-- =============================================================================

INSERT INTO "OptionalEquipment" (id, "manufacturerId", name, slug, "optionCode", category, area, description, "howToIdentify", rarity, "purchaseRelevance", "resaleRelevance", status, "publishedAt", "createdAt", "updatedAt") VALUES
  -- Licht und Sicht
  ('oe_bmw_xenon',       'mfr_bmw', 'Xenon-Scheinwerfer',         'xenon',          'S522A', 'Licht',         'EXTERIOR', 'Bi-Xenon mit automatischer Leuchtweiteregulierung. Deutlich bessere Ausleuchtung als Halogen.', 'Xenon-Brenner im Scheinwerfer sichtbar, Waschanlage fuer Scheinwerfer vorhanden.', 'COMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_led',         'mfr_bmw', 'LED-Scheinwerfer',           'led-scheinwerfer','S552A', 'Licht',         'EXTERIOR', 'Voll-LED mit adaptivem Kurvenlicht. Ab G20 Serie, davor Sonderausstattung.', 'LED-Tagfahrlichtleiste und Blinker im Scheinwerfer integriert.', 'COMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_laser',       'mfr_bmw', 'Laserlicht',                 'laserlicht',      'S554A', 'Licht',         'EXTERIOR', 'Laserlight mit bis zu 600m Reichweite. Blaue Akzente in den Scheinwerfern.', 'Blaues X im Scheinwerfer bei eingeschaltetem Fernlicht.', 'RARE', 'MEDIUM', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Komfort Sitze
  ('oe_bmw_sitzheizung', 'mfr_bmw', 'Sitzheizung vorne',          'sitzheizung',     'S494A', 'Komfort',       'INTERIOR', 'Dreistufige Sitzheizung fuer Fahrer- und Beifahrersitz.', 'Taste mit Sitzheizungssymbol in der Mittelkonsole oder Klimabedienung.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_sitzheizung_h','mfr_bmw','Sitzheizung hinten',         'sitzheizung-hinten','S496A','Komfort',       'INTERIOR', 'Dreistufige Sitzheizung fuer die aeusseren Fondplaetze.', 'Tasten in der hinteren Mittelarmlehne.', 'UNCOMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_sportsitze',  'mfr_bmw', 'Sportsitze vorne',           'sportsitze',      'S481A', 'Komfort',       'INTERIOR', 'Sportsitze mit erhoehtem Seitenhalt, manuell verstellbar.', 'Deutlich staerkere Seitenwangen als Standardsitze.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_komfortsitze','mfr_bmw', 'Komfortsitze vorne',         'komfortsitze',    'S456A', 'Komfort',       'INTERIOR', 'Breitere Sitzflaeche mit weicherer Polsterung. Eher fuer laengere Strecken.', 'Breitere, flachere Sitzwangen als Sportsitze.', 'UNCOMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_elektro_sitze','mfr_bmw','Elektrische Sitzverstellung', 'elektrische-sitze','S459A', 'Komfort',       'INTERIOR', 'Elektrisch verstellbare Vordersitze mit Memory fuer Fahrerseite.', 'Verstellschalter an der Sitzaußenseite statt Hebel.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_lordose',     'mfr_bmw', 'Lordosenstuetze',            'lordosenstuetze', 'S488A', 'Komfort',       'INTERIOR', 'Elektrisch verstellbare Lendenwirbelunterstuetzung in den Vordersitzen.', 'Zusaetzlicher Schalter an der Sitzverstellung.', 'UNCOMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Leder
  ('oe_bmw_leder_dakota','mfr_bmw', 'Lederausstattung Dakota',    'leder-dakota',    'S248A', 'Interieur',     'INTERIOR', 'Vollleder Dakota mit glattem Charakter. Standard bei Luxury Line, sonst Aufpreis.', 'Glatte Lederoberflaeche, Ledergeruch, Naehte sichtbar.', 'COMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_leder_vernasca','mfr_bmw','Lederausstattung Vernasca', 'leder-vernasca',  'S249A', 'Interieur',     'INTERIOR', 'Vernasca-Leder mit perforierter Oberflaeche. Ab G20 verfuegbar.', 'Perforierte Sitzflaeche, weicherer Griff als Dakota.', 'COMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_leder_merino','mfr_bmw', 'Leder Merino erweitert',     'leder-merino',    'S250A', 'Interieur',     'INTERIOR', 'Vollleder Merino mit besonders weicher Haptik. Nur bei M3 und Individual.', 'Sehr weiches, feinnarbiges Leder, oft mit Kontrastnaehten.', 'RARE', 'MEDIUM', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Klima
  ('oe_bmw_klima_auto',  'mfr_bmw', 'Klimaautomatik 2-Zonen',     'klimaautomatik',  'S534A', 'Komfort',       'INTERIOR', 'Automatische 2-Zonen-Klimaanlage mit getrennter Temperaturregelung.', 'Zwei Temperaturregler statt einem, AUTO-Taste.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_klima_4zone', 'mfr_bmw', 'Klimaautomatik 4-Zonen',     'klimaautomatik-4-zonen','S536A','Komfort',  'INTERIOR', '4-Zonen-Klimaanlage mit separater Fondregelung.', 'Bedienelemente fuer Fond in der hinteren Mittelkonsole.', 'UNCOMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Dach
  ('oe_bmw_panorama',    'mfr_bmw', 'Panorama-Glasdach',          'panorama-glasdach','S402A', 'Komfort',       'EXTERIOR', 'Zweiteiliges Panorama-Glasdach mit elektrischem Schiebedach vorne und festem Glaselement hinten.', 'Grossflaechige Glasflaeche auf dem Dach sichtbar, Schiebedachschalter im Dachhimmel.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_schiebedach', 'mfr_bmw', 'Schiebedach elektrisch',     'schiebedach',     'S403A', 'Komfort',       'EXTERIOR', 'Elektrisches Glas-Schiebe-Hubdach.', 'Schalter im Dachhimmel, Dachantenne leicht versetzt.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Infotainment / Navigation
  ('oe_bmw_navi_pro',    'mfr_bmw', 'Navigationssystem Professional','navi-professional','S609A','Infotainment', 'INFOTAINMENT', 'BMW Navigation Professional mit Echtzeitverkehrsinformationen und 3D-Karten.', 'Grosser Bildschirm (ab 8.8 Zoll), iDrive Controller mit Touchpad.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_hifi',        'mfr_bmw', 'HiFi Lautsprechersystem',    'hifi',            'S676A', 'Sound',         'INFOTAINMENT', 'HiFi-System mit mehr Lautsprechern und hoeherem Verstaerker als Basis.', 'Hochtoner in den Spiegelecken, mehr Lautsprecher in den Tueren.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_harman',      'mfr_bmw', 'Harman Kardon Surround',     'harman-kardon',   'S688A', 'Sound',         'INFOTAINMENT', 'Harman Kardon Surround Sound System mit 16 Lautsprechern und 464 Watt.', 'Harman Kardon Logo auf den Lautsprecherabdeckungen.', 'UNCOMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_headup',      'mfr_bmw', 'Head-Up Display',            'head-up-display', 'S610A', 'Infotainment',  'INFOTAINMENT', 'Projektion von Geschwindigkeit, Navigation und Warnungen in die Windschutzscheibe.', 'Projektionsflaeche in der Windschutzscheibe ueber dem Lenkrad sichtbar.', 'UNCOMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Fahrdynamik
  ('oe_bmw_adaptiv_fw',  'mfr_bmw', 'Adaptives Fahrwerk',         'adaptives-fahrwerk','S223A','Fahrwerk',     'EXTERIOR', 'Elektronisch geregelte Stossdaempfer mit Comfort-, Sport- und Sport+-Modus.', 'Fahrwerkstaste in der Mittelkonsole (Drivemode-Schalter).', 'UNCOMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_m_diff',      'mfr_bmw', 'Aktives M Sperrdifferential','m-sperrdifferential','S2VBA','Fahrwerk',    'EXTERIOR', 'Elektronisch geregeltes Sperrdifferential an der Hinterachse.', 'Nur bei M- und M-Performance-Modellen. Kein sichtbares Erkennungsmerkmal von aussen.', 'RARE', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_m_bremse',    'mfr_bmw', 'M Sportbremse',              'm-sportbremse',   'S2VHA', 'Fahrwerk',      'EXTERIOR', 'Groessere Bremsscheiben mit blau oder rot lackierten Saetteln und M-Logo.', 'Farbig lackierte Bremssaettel hinter den Felgen sichtbar.', 'UNCOMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Parken / Assistenz
  ('oe_bmw_pdc_h',       'mfr_bmw', 'Park Distance Control hinten','pdc-hinten',     'S508A', 'Assistenz',     'EXTERIOR', 'Ultraschall-Einparkhilfe hinten mit akustischer Warnung.', 'Runde Sensoren in der hinteren Stossstange.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_pdc_vh',      'mfr_bmw', 'Park Distance Control vorne + hinten','pdc-vorne-hinten','S5DMA','Assistenz','EXTERIOR', 'Ultraschall-Einparkhilfe vorne und hinten.', 'Runde Sensoren in beiden Stossstangen.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_rueckfahr',   'mfr_bmw', 'Rueckfahrkamera',            'rueckfahrkamera', 'S3AGA', 'Assistenz',     'EXTERIOR', 'Kamera am Heck mit Hilfslinien im iDrive-Display.', 'Kleine Kameralinse ueber dem Kennzeichen oder im Kofferraumgriff.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_parkassist',  'mfr_bmw', 'Parking Assistant',          'parking-assistant','S5DPA', 'Assistenz',     'EXTERIOR', 'Automatisches Einparken laengs und quer mit Ultraschall.', 'Park-Taste neben dem Schalthebel.', 'UNCOMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_surround',    'mfr_bmw', 'Surround View',              'surround-view',   'S5DLA', 'Assistenz',     'EXTERIOR', '360-Grad-Kamerasystem mit Vogelperspektive im Display.', 'Kameras in Aussenspiegel, Front und Heck.', 'UNCOMMON', 'MEDIUM', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Fahrassistenz
  ('oe_bmw_tempomat',    'mfr_bmw', 'Tempomat mit Bremsfunktion', 'tempomat',        'S544A', 'Assistenz',     'INTERIOR', 'Geschwindigkeitsregelung mit automatischer Bremsung.', 'Tempomathebel am Lenkrad.', 'COMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_acc',         'mfr_bmw', 'Active Cruise Control',      'active-cruise-control','S5DFA','Assistenz',  'EXTERIOR', 'Abstandsregeltempomat mit Stop-and-Go-Funktion.', 'Radarsensor hinter der vorderen Niere, ACC-Taste am Lenkrad.', 'UNCOMMON', 'HIGH', 'HIGH', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_spurassist',  'mfr_bmw', 'Spurverlassenswarnung',      'spurverlassenswarnung','S5ACA','Assistenz',  'EXTERIOR', 'Warnung bei unbeabsichtigtem Verlassen der Fahrspur durch Lenkradvibration.', 'Kamera an der Windschutzscheibe, Taste zum Deaktivieren.', 'COMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Multimedia
  ('oe_bmw_wireless_cp', 'mfr_bmw', 'Wireless Apple CarPlay',     'wireless-carplay','S6CPA', 'Infotainment',  'INFOTAINMENT', 'Kabellose Apple CarPlay Integration ins iDrive-System.', 'CarPlay-Symbol im iDrive-Menu.', 'COMMON', 'HIGH', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_wireless_ch', 'mfr_bmw', 'Kabelloses Laden',           'kabelloses-laden','S6NRA', 'Infotainment',  'INTERIOR', 'Induktive Ladeflaeche fuer Qi-faehige Smartphones in der Mittelkonsole.', 'Ladeflaeche mit Symbol in der Mittelkonsole.', 'COMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Aussen
  ('oe_bmw_anh_kupp',    'mfr_bmw', 'Anhaengerkupplung schwenkbar','anhaengerkupplung','S3ACA','Praktisch',     'EXTERIOR', 'Elektrisch schwenkbare Anhaengerkupplung, werksseitig verbaut.', 'Taste im Kofferraum zum Ausschwenken, Steckdose am Heck.', 'UNCOMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_shadow_line', 'mfr_bmw', 'Shadowline Exterieur',       'shadowline',      'S760A', 'Design',        'EXTERIOR', 'Hochglanz-Schwarz fuer Fensterrahmen, Niere und Auspuffblenden.', 'Schwarze statt verchromte Zierleisten.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_m_fahrwerk',  'mfr_bmw', 'M Sportfahrwerk',            'm-sportfahrwerk', 'S704A', 'Fahrwerk',      'EXTERIOR', 'Sportlich abgestimmtes Fahrwerk, 10mm tiefergelegt gegenueber Serie.', 'Tiefere Fahrzeuglage, hoehere Federrate spuerbar.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW()),

  -- Gepaeck / Praktisch
  ('oe_bmw_durchlade',   'mfr_bmw', 'Durchladesystem',            'durchladesystem', 'S423A', 'Praktisch',     'INTERIOR', 'Geteilte Ruecksitzlehne (40:20:40) zum Umklappen.', 'Hebel an der Ruecksitzlehne zum Umklappen.', 'COMMON', 'MEDIUM', 'LOW', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oe_bmw_el_heckkl',   'mfr_bmw', 'Elektrische Heckklappe',     'elektrische-heckklappe','S316A','Komfort',   'EXTERIOR', 'Elektrisch oeffnende und schliessende Heckklappe mit Komfortzugang.', 'Taste am Kofferraumdeckel und im Fahrzeug.', 'COMMON', 'MEDIUM', 'MEDIUM', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- AUSSTATTUNGSPAKETE
-- =============================================================================

-- G20 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('pkg_g20_msport',     'gen_bmw_3er_g20', 'M Sportpaket',           'm-sportpaket',     'P337A', 'M Aerodynamikpaket, M Sportfahrwerk, M Lederlenkrad, M Bremsen, 18-Zoll M Doppelspeiche, Shadowline Exterieur.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_g20_msport_pro', 'gen_bmw_3er_g20', 'M Sport Pro',            'm-sport-pro',      'P33BA', 'M Sportpaket plus M Heckdiffusor, M Sportabgasanlage, 19-Zoll M Felgen, erweiterte Shadow Line, M Sperrdifferential.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_g20_business',   'gen_bmw_3er_g20', 'Business Paket',         'business-paket',   'ZBP',   'Navigation Professional, Tempomat mit Bremsfunktion, Sitzheizung vorne, Licht- und Regensensor.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_g20_innovation', 'gen_bmw_3er_g20', 'Innovationspaket',       'innovationspaket', 'ZIN',   'Head-Up Display, Wireless Charging, Parking Assistant Plus, Driving Assistant Professional.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_g20_comfort',    'gen_bmw_3er_g20', 'Komfortpaket',           'komfortpaket',     'ZKP',   'Elektrische Sitzverstellung mit Memory, Lordosenstuetze, Durchladesystem, elektrische Heckklappe.', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- F30 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('pkg_f30_msport',     'gen_bmw_3er_f30', 'M Sportpaket',           'm-sportpaket',     'P337A', 'M Aerodynamikpaket, M Sportfahrwerk, M Lederlenkrad, 18-Zoll M Doppelspeiche, Shadowline.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_f30_business',   'gen_bmw_3er_f30', 'Business Paket',         'business-paket',   'ZBP',   'Navigation Professional, Freisprecheinrichtung, Sitzheizung vorne.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_f30_comfort',    'gen_bmw_3er_f30', 'Komfortpaket',           'komfortpaket',     'ZKP',   'Elektrische Sitzverstellung, Lordosenstuetze, Durchladesystem.', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E90 Pakete
INSERT INTO "EquipmentPackage" (id, "generationId", name, slug, "packageCode", description, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('pkg_e90_msport',     'gen_bmw_3er_e90', 'M Sportpaket',           'm-sportpaket',     'P337A', 'M Aerodynamikpaket, M Sportfahrwerk 10mm tiefer, M Lederlenkrad, 18-Zoll M Felgen, Shadowline.', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('pkg_e90_business',   'gen_bmw_3er_e90', 'Business Paket',         'business-paket',   'ZBP',   'Navigation, Freisprecheinrichtung Bluetooth, Sitzheizung vorne.', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- OPTION AVAILABILITY — Welche Ausstattung in welcher Generation verfuegbar war
-- =============================================================================

-- G20 Verfuegbarkeit
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, status, "publishedAt", "createdAt", "updatedAt") VALUES
  -- Serie (STANDARD)
  ('oa_g20_led',          'oe_bmw_led',          'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_klima',        'oe_bmw_klima_auto',   'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_pdc_h',        'oe_bmw_pdc_h',        'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_sportsitze',   'oe_bmw_sportsitze',   'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_tempomat',     'oe_bmw_tempomat',     'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_spur',         'oe_bmw_spurassist',   'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_durchlade',    'oe_bmw_durchlade',    'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_carplay',      'oe_bmw_wireless_cp',  'gen_bmw_3er_g20', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  -- Sonderausstattung (OPTIONAL)
  ('oa_g20_laser',        'oe_bmw_laser',        'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_sitzh',        'oe_bmw_sitzheizung',  'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_sitzh_h',      'oe_bmw_sitzheizung_h','gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_elsi',         'oe_bmw_elektro_sitze','gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_lordose',      'oe_bmw_lordose',      'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_vernasca',     'oe_bmw_leder_vernasca','gen_bmw_3er_g20','OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_panorama',     'oe_bmw_panorama',     'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_navi',         'oe_bmw_navi_pro',     'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_hifi',         'oe_bmw_hifi',         'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_harman',       'oe_bmw_harman',       'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_headup',       'oe_bmw_headup',       'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_adaptfw',      'oe_bmw_adaptiv_fw',   'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_pdc_vh',       'oe_bmw_pdc_vh',       'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_rk',           'oe_bmw_rueckfahr',    'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_parkas',       'oe_bmw_parkassist',   'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_surround',     'oe_bmw_surround',     'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_acc',          'oe_bmw_acc',          'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_wireless_ch',  'oe_bmw_wireless_ch',  'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_anh',          'oe_bmw_anh_kupp',     'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_shadow',       'oe_bmw_shadow_line',  'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_elh',          'oe_bmw_el_heckkl',    'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_klima4',       'oe_bmw_klima_4zone',  'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_m_fw',         'oe_bmw_m_fahrwerk',   'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_g20_m_bremse',     'oe_bmw_m_bremse',     'gen_bmw_3er_g20', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- F30 Verfuegbarkeit
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('oa_f30_klima',        'oe_bmw_klima_auto',   'gen_bmw_3er_f30', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_spur',         'oe_bmw_spurassist',   'gen_bmw_3er_f30', 'STANDARD', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_xenon',        'oe_bmw_xenon',        'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_led',          'oe_bmw_led',          'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_sitzh',        'oe_bmw_sitzheizung',  'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_sport',        'oe_bmw_sportsitze',   'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_elsi',         'oe_bmw_elektro_sitze','gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_dakota',       'oe_bmw_leder_dakota', 'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_panorama',     'oe_bmw_panorama',     'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_navi',         'oe_bmw_navi_pro',     'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_harman',       'oe_bmw_harman',       'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_headup',       'oe_bmw_headup',       'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_adaptfw',      'oe_bmw_adaptiv_fw',   'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_pdc_h',        'oe_bmw_pdc_h',        'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_pdc_vh',       'oe_bmw_pdc_vh',       'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_rk',           'oe_bmw_rueckfahr',    'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_acc',          'oe_bmw_acc',          'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_shadow',       'oe_bmw_shadow_line',  'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_anh',          'oe_bmw_anh_kupp',     'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_elh',          'oe_bmw_el_heckkl',    'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_m_fw',         'oe_bmw_m_fahrwerk',   'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_f30_tempomat',     'oe_bmw_tempomat',     'gen_bmw_3er_f30', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E90 Verfuegbarkeit
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('oa_e90_xenon',        'oe_bmw_xenon',        'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_sitzh',        'oe_bmw_sitzheizung',  'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_sport',        'oe_bmw_sportsitze',   'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_elsi',         'oe_bmw_elektro_sitze','gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_dakota',       'oe_bmw_leder_dakota', 'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_panorama',     'oe_bmw_panorama',     'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_schiebe',      'oe_bmw_schiebedach',  'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_navi',         'oe_bmw_navi_pro',     'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_hifi',         'oe_bmw_hifi',         'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_harman',       'oe_bmw_harman',       'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_headup',       'oe_bmw_headup',       'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_adaptfw',      'oe_bmw_adaptiv_fw',   'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_pdc_h',        'oe_bmw_pdc_h',        'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_pdc_vh',       'oe_bmw_pdc_vh',       'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_acc',          'oe_bmw_acc',          'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_shadow',       'oe_bmw_shadow_line',  'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_anh',          'oe_bmw_anh_kupp',     'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_klima',        'oe_bmw_klima_auto',   'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_m_fw',         'oe_bmw_m_fahrwerk',   'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e90_durchlade',    'oe_bmw_durchlade',    'gen_bmw_3er_e90', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E46 Verfuegbarkeit
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('oa_e46_xenon',        'oe_bmw_xenon',        'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_sitzh',        'oe_bmw_sitzheizung',  'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_sport',        'oe_bmw_sportsitze',   'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_elsi',         'oe_bmw_elektro_sitze','gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_dakota',       'oe_bmw_leder_dakota', 'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_schiebe',      'oe_bmw_schiebedach',  'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_navi',         'oe_bmw_navi_pro',     'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_pdc_h',        'oe_bmw_pdc_h',        'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_klima',        'oe_bmw_klima_auto',   'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_shadow',       'oe_bmw_shadow_line',  'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_m_fw',         'oe_bmw_m_fahrwerk',   'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e46_anh',          'oe_bmw_anh_kupp',     'gen_bmw_3er_e46', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- E36 Verfuegbarkeit
INSERT INTO "OptionAvailability" (id, "optionId", "generationId", kind, status, "publishedAt", "createdAt", "updatedAt") VALUES
  ('oa_e36_sitzh',        'oe_bmw_sitzheizung',  'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_sport',        'oe_bmw_sportsitze',   'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_dakota',       'oe_bmw_leder_dakota', 'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_schiebe',      'oe_bmw_schiebedach',  'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_klima',        'oe_bmw_klima_auto',   'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_m_fw',         'oe_bmw_m_fahrwerk',   'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW()),
  ('oa_e36_anh',          'oe_bmw_anh_kupp',     'gen_bmw_3er_e36', 'OPTIONAL', 'PUBLISHED', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- PAKET-INHALTE (EquipmentPackageItem)
-- =============================================================================

-- G20 M Sportpaket Inhalte
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
  ('epi_g20_ms_fw',    'pkg_g20_msport', 'oe_bmw_m_fahrwerk',  false),
  ('epi_g20_ms_shadow','pkg_g20_msport', 'oe_bmw_shadow_line', false),
  ('epi_g20_ms_bremse','pkg_g20_msport', 'oe_bmw_m_bremse',    false),
  ('epi_g20_ms_sport', 'pkg_g20_msport', 'oe_bmw_sportsitze',  false)
ON CONFLICT ON CONSTRAINT "EquipmentPackageItem_packageId_optionId_key" DO NOTHING;

-- G20 Komfortpaket Inhalte
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
  ('epi_g20_ko_elsi',  'pkg_g20_comfort','oe_bmw_elektro_sitze',false),
  ('epi_g20_ko_lord',  'pkg_g20_comfort','oe_bmw_lordose',      false),
  ('epi_g20_ko_durch', 'pkg_g20_comfort','oe_bmw_durchlade',    false),
  ('epi_g20_ko_heck',  'pkg_g20_comfort','oe_bmw_el_heckkl',    false)
ON CONFLICT ON CONSTRAINT "EquipmentPackageItem_packageId_optionId_key" DO NOTHING;

-- G20 Business Paket Inhalte
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
  ('epi_g20_bu_navi',  'pkg_g20_business','oe_bmw_navi_pro',    false),
  ('epi_g20_bu_tempo', 'pkg_g20_business','oe_bmw_tempomat',    false),
  ('epi_g20_bu_sitz',  'pkg_g20_business','oe_bmw_sitzheizung', false)
ON CONFLICT ON CONSTRAINT "EquipmentPackageItem_packageId_optionId_key" DO NOTHING;

-- G20 Innovationspaket Inhalte
INSERT INTO "EquipmentPackageItem" (id, "packageId", "optionId", optional) VALUES
  ('epi_g20_in_hud',   'pkg_g20_innovation','oe_bmw_headup',       false),
  ('epi_g20_in_wch',   'pkg_g20_innovation','oe_bmw_wireless_ch',  false),
  ('epi_g20_in_park',  'pkg_g20_innovation','oe_bmw_parkassist',   false)
ON CONFLICT ON CONSTRAINT "EquipmentPackageItem_packageId_optionId_key" DO NOTHING;

COMMIT;
