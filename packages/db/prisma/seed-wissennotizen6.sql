-- Seed: KnowledgeNote Runde 6 — Finale: Restliche Generationen
-- Quelle: ADAC, Fachpresse, Herstellerinformationen

BEGIN;

-- BMW 3er E90
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_e90_kauf', 'gen_bmw_3er_e90', 'BUYING_ADVICE', 'Gebrauchtkauf-Hinweise BMW E90', 'Beim E90-Kauf ist die Steuerketten-Historie beim N47-Diesel entscheidend. Sparsame und ausreichend motorisierte 320d und 318d sind die meistverkauften Varianten. Serviceheft-Luecken sind ein Warnsignal.', 'ADAC Pannenstatistik, TUeV-Report', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_e90_zuverl', 'gen_bmw_3er_e90', 'RELIABILITY', 'Zuverlaessigkeit nach Motor und Baujahr', 'Die Benziner (N52, N53) gelten als deutlich zuverlaessiger als die N47-Diesel. Ab Baujahr 2011 wurde die Steuerkettenproblematik beim N47 entschaerft. Der 325i/330i mit N52 ist ein solider Langlaeufer.', 'TUeV-Report, ADAC Pannenstatistik', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 2er Active Tourer U06
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_u06_alltag', 'gen_bmw_2er_u06', 'EVERYDAY_USE', 'Praktischer Familien-BMW', 'Der 2er Active Tourer U06 bietet dank Frontantriebsplattform ein klassenueberragendes Raumangebot. Der Kofferraum fasst 470 Liter, die verschiebbare Rueckbank ist praktisch. Auch als PHEV und Allrad verfuegbar.', 'BMW Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_u06_vorteil', 'gen_bmw_2er_u06', 'ADVANTAGE', 'Grosser Technologiesprung', 'Der U06 bringt Curved Display, iDrive 9 und erstmals Head-up-Display in die Kompaktklasse bei BMW. Die Verarbeitung ist deutlich hochwertiger als beim Vorgaenger F45.', 'BMW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Leaf II (ZE1)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_leaf2_alltag', 'gen_leaf_2', 'EVERYDAY_USE', 'Bewaehrtes Elektroauto fuer den Alltag', 'Der Leaf II bietet bis zu 385 km WLTP-Reichweite (62-kWh-Version). Im Alltag reichen 250-300 km. Der e-Pedal-Modus ermoeglicht Einpedal-Fahren in der Stadt. Der Kofferraum fasst 435 Liter.', 'ADAC Autotest, Nissan Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_leaf2_nachteil', 'gen_leaf_2', 'DISADVANTAGE', 'Fehlende aktive Batteriekuehlung', 'Der Leaf II hat nur passive Batteriekuehlung — bei haeufigem Schnellladen und in heissen Regionen degradiert die Batterie schneller als bei Wettbewerbern mit aktiver Thermomanagement-Loesung.', 'ADAC Autotest, Fachpresse', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Juke II (F16)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_juke2_design', 'gen_juke_2', 'ADVANTAGE', 'Eigenstaendiges Design mit mehr Platz', 'Der Juke II behaelt den polarisierenden Stil des Vorgaengers, bietet aber deutlich mehr Platz. Der Kofferraum wuchs auf 422 Liter. Das Interieur ist hochwertiger als beim Vorgaenger.', 'Nissan Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_juke2_stadt', 'gen_juke_2', 'CITY_USE', 'Kompaktes City-SUV', 'Mit 4,21 m Laenge ist der Juke II sehr kompakt und wendig. Die erhoehte Sitzposition bietet gute Uebersicht. Der 1.0 DIG-T mit 114 PS ist ausreichend motorisiert fuer den Stadtverkehr.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan X-Trail IV (T33)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_xtrail4_familie', 'gen_xtrail_4', 'EVERYDAY_USE', '7-Sitzer fuer Familien', 'Der X-Trail IV bietet optional sieben Sitzplaetze. Der Kofferraum fasst 585 Liter (5-Sitzer). Das e-POWER-System kombiniert Benzinmotor als Generator mit Elektroantrieb fuer ein rein elektrisches Fahrgefuehl.', 'Nissan Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_xtrail4_vorteil', 'gen_xtrail_4', 'ADVANTAGE', 'Innovatives e-POWER Antriebskonzept', 'Das e-POWER-System ist ein Serienhybrid: Der Benzinmotor treibt nur einen Generator an, die Raeder werden ausschliesslich elektrisch angetrieben. Das Fahrgefuehl aehnelt einem reinen Elektroauto ohne Reichweitenangst.', 'Nissan Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Ariya
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ariya_langstr', 'gen_ariya_1', 'LONG_DISTANCE', 'Elektrisches Reiseauto', 'Der Ariya bietet bis zu 533 km WLTP-Reichweite (87-kWh-Batterie). Mit CCS-Schnellladen bis 130 kW und bequemen Sitzen eignet er sich gut fuer die Langstrecke. Der Kofferraum fasst 468 Liter.', 'ADAC Autotest, Nissan Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_ariya_design', 'gen_ariya_1', 'ADVANTAGE', 'Modernes Lounge-Interieur', 'Der Ariya setzt auf ein minimalistisches Interieur mit verschiebbarer Mittelkonsole und flachem Boden. Die haptischen Klimatasten im Holz-Look sind ein Alleinstellungsmerkmal.', 'Nissan Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda3 IV (BP)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_mazda3_design', 'gen_mazda3_4', 'ADVANTAGE', 'Premium-Anspruch in der Kompaktklasse', 'Der Mazda3 BP setzt auf hochwertiges Interieur mit echtem Materialmix. Das Kodo-Design ist zurueckhaltend-elegant. Der Skyactiv-X Motor ist eine technische Besonderheit (SPCCI-Kompressionszuendung).', 'Mazda Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_mazda3_nachteil', 'gen_mazda3_4', 'DISADVANTAGE', 'Eingeschraenkte Sicht nach hinten', 'Die C-Saeule des Mazda3 ist designbedingt sehr breit, die Sicht nach hinten beim Fastback (Fliessheck) eingeschraenkt. Der Kofferraum ist mit 351 Litern kleiner als bei den Wettbewerbern.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda MX-5 IV (ND)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_mx5_fahrspass', 'gen_mx5_4', 'ADVANTAGE', 'Reinster Fahrspass in der Klasse', 'Der MX-5 ND ist mit unter 1.100 kg einer der leichtesten Sportwagen am Markt. Hinterradantrieb, praezise Lenkung und perfekte Gewichtsverteilung machen ihn zur Fahrspass-Referenz.', 'auto motor und sport, Mazda Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_mx5_wert', 'gen_mx5_4', 'RESALE_VALUE', 'Hervorragende Wertstabilitaet', 'Der MX-5 ist als Klassiker der Zukunft sehr wertstabil. Gepflegte Exemplare halten ihren Wert ueberdurchschnittlich gut, besonders die 184-PS-Version und Sondermodelle.', 'Schwacke, DAT Restwertprognose', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-60
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_cx60_technik', 'gen_cx60_1', 'ADVANTAGE', 'Mazdas groesster Technologiesprung', 'Der CX-60 ist Mazdas erstes Modell auf der neuen Hinterradantriebs-Plattform. Als PHEV mit 327 PS Systemleistung und Reihensechszylinder-Diesel ist er technisch ambitioniert.', 'Mazda Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_cx60_kauf', 'gen_cx60_1', 'BUYING_ADVICE', 'Spaetere Baujahre bevorzugen', 'Die fruehen Baujahre 2022/23 hatten Softwareprobleme beim PHEV. Ab Mitte 2023 hat Mazda den Serienstand deutlich verbessert. Beim Gebrauchtkauf auf aktuellen Softwarestand achten.', 'ADAC Autotest, Mazda-Foren', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 2008 II (P24)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_2008_stadt', 'gen_2008_2', 'CITY_USE', 'Kompaktes City-SUV mit Charakter', 'Der 2008 II bietet ein markantes Design mit Loewenklauen-Tagfahrlicht. Das i-Cockpit mit kleinem Lenkrad und hoch positionierten Instrumenten ist gewoehnungsbeduerftig aber sportlich. 434 Liter Kofferraum.', 'ADAC Autotest, Peugeot Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_2008_elektro', 'gen_2008_2', 'ADVANTAGE', 'Auch als rein elektrischer e-2008', 'Der 2008 ist auch als vollelektrischer e-2008 mit bis zu 345 km WLTP-Reichweite verfuegbar. Die identische Optik ohne Kompromisse und der tiefe Schwerpunkt sind Vorteile der CMP-Plattform.', 'Peugeot Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Ibiza KJ
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ibiza_alltag', 'gen_seat_ibiza_kj', 'EVERYDAY_USE', 'Solider Kleinwagen mit VW-Technik', 'Der Ibiza KJ basiert auf der MQB-A0-Plattform und bietet VW-Konzern-Technik zu attraktivem Preis. 355 Liter Kofferraum sind klassenueberragend. Nur als Fuenftuerer verfuegbar.', 'ADAC Autotest, SEAT Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_ibiza_wert', 'gen_seat_ibiza_kj', 'RESALE_VALUE', 'Gutes Preis-Leistungs-Verhaeltnis', 'Der Ibiza bietet VW-Polo-Technik zu niedrigerem Preis. Die Restwerte sind solide, liegen aber etwas unter dem VW Polo. Die FR-Ausstattung ist am beliebtesten.', 'Schwacke, DAT Restwertprognose', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- SEAT Arona
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_arona_alltag', 'gen_arona_1', 'EVERYDAY_USE', 'Ibiza mit SUV-Optik', 'Der Arona ist technisch ein Ibiza mit erhoehter Karosserie. Er bietet die gleiche Technik in SUV-Optik. 400 Liter Kofferraum und die erhoehte Sitzposition machen ihn alltagstauglicher.', 'ADAC Autotest, SEAT Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_arona_vorteil', 'gen_arona_1', 'ADVANTAGE', 'Guenstigstes SUV im VW-Konzern', 'Der Arona ist einer der guenstigsten Einstiege in ein SUV des VW-Konzerns. Trotzdem bietet er moderne Assistenzsysteme und Konnektivitaet. Das Full-Link-System unterstuetzt Apple CarPlay und Android Auto.', 'SEAT Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda Jazz IV (GR)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_jazz4_alltag', 'gen_jazz_4', 'EVERYDAY_USE', 'Raumwunder mit Magic Seats', 'Der Jazz IV bietet dank der Magic Seats ein einzigartiges Raumkonzept: Die Ruecksitze lassen sich hochklappen und schaffen so Platz fuer hohe Gegenstaende. 304 Liter Kofferraum sind gut fuer die Klasse.', 'ADAC Autotest, Honda Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_jazz4_zuverl', 'gen_jazz_4', 'RELIABILITY', 'Honda-typische Zuverlaessigkeit', 'Der Jazz ist traditionell einer der zuverlaessigsten Kleinwagen. Das e:HEV-Hybridsystem arbeitet unauffaellig und effizient. In der ADAC-Pannenstatistik schneidet der Jazz regelmaessig gut ab.', 'ADAC Pannenstatistik', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda CR-V VI
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_crv6_familie', 'gen_crv_6', 'EVERYDAY_USE', 'Geraum iges Familien-SUV', 'Der CR-V VI ist deutlich gewachsen und bietet ein grosszuegiges Raumangebot. Der Kofferraum fasst 587 Liter. Nur noch als e:HEV Vollhybrid oder PHEV erhaeltlich — kein reiner Verbrenner mehr.', 'Honda Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_crv6_vorteil', 'gen_crv_6', 'ADVANTAGE', 'Effizienter Hybridantrieb serienmässig', 'Der CR-V VI kommt ausschliesslich mit Hybridantrieb. Das e:HEV-System bietet niedrigen Verbrauch bei gleichzeitig kraeftigem Antritt. Die PHEV-Version bietet bis zu 80 km elektrische Reichweite.', 'Honda Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda e
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_hondae_design', 'gen_hondae_1', 'ADVANTAGE', 'Retro-Design mit modernem Interieur', 'Der Honda e besticht durch sein ikonisches Retro-Design und ein futuristisches Interieur mit zwei 12,3-Zoll-Displays. Kameras statt Aussenspiegel und Hinterradantrieb sind Alleinstellungsmerkmale.', 'Honda Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_hondae_stadt', 'gen_hondae_1', 'CITY_USE', 'Idealer City-Stromer', 'Der Honda e ist als reiner Stadtwagen konzipiert: Hinterradantrieb fuer einen kleinen Wendekreis, kompakte Abmessungen (3,89 m) und sofort verfuegbares Drehmoment. Produktion wurde 2024 eingestellt.', 'ADAC Autotest, Honda Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Panamera 971 II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_panamera3_langstr', 'gen_por_panamera_3', 'LONG_DISTANCE', 'Gran Turismo der Oberklasse', 'Der neue Panamera setzt Massstaebe bei Langstreckenkomfort und Fahrdynamik. Die aktive Federung (Porsche Active Ride) gleicht Wank- und Nickbewegungen nahezu vollstaendig aus. Bis zu 1.100 PS im Turbo S E-Hybrid.', 'Porsche Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_panamera3_vorteil', 'gen_por_panamera_3', 'ADVANTAGE', 'Neue Active-Ride-Federung', 'Das optionale Porsche Active Ride System ist eine Revolution: 48V-Aktuatoren an jeder Ecke eliminieren Wankbewegungen und koennen das Fahrzeug bei Bedarf sogar aktiv neigen. Erstmals in einem Serienfahrzeug.', 'Porsche Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota GR Supra A90
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_supra_fahrdyn', 'gen_toy_supra_a90', 'ADVANTAGE', 'Echtes Sportwagenkonzept mit BMW-Technik', 'Die GR Supra nutzt BMW-Motoren (B48/B58) und die CLAR-Plattform (mit BMW Z4 geteilt). Der 3.0-Liter-Reihensechszylinder mit 340-387 PS bietet hervorragende Fahrleistungen und klassischen Sportwagencharakter.', 'Toyota Pressemitteilung, auto motor und sport', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_supra_wert', 'gen_toy_supra_a90', 'RESALE_VALUE', 'Sammlerfahrzeug mit hoher Wertstabilitaet', 'Die GR Supra haelt ihren Wert hervorragend — der legendaere Supra-Name und die begrenzte Produktionsdauer sichern hohe Restwerte. Sondermodelle und manuelle Getriebe-Versionen (ab 2022) sind besonders gefragt.', 'Schwacke, mobile.de Marktanalyse', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Panda III (319)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_panda_stadt', 'gen_panda_3', 'CITY_USE', 'Unverwuestlicher Stadtwagen', 'Der Panda III ist mit 3,65 m einer der kompaktesten Kleinwagen am Markt. Leichtgaengige Lenkung, gute Uebersicht und einfache Technik machen ihn zum idealen Stadtauto. Auch als 4x4 und Mild-Hybrid erhaeltlich.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_panda_vorteil', 'gen_panda_3', 'ADVANTAGE', 'Guenstiger Einstieg mit Allrad-Option', 'Der Panda ist einer der guenstigsten Neuwagen mit optionalem Allradantrieb (4x4). Die robuste Technik und der guenstige Unterhalt machen ihn zum rationalen Begleiter.', 'Fiat Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen Berlingo III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_berlingo_alltag', 'gen_berlingo_3', 'EVERYDAY_USE', 'Maximaler Nutzwert fuer Familien', 'Der Berlingo III bietet als Hochdachkombi eines der groessten Raumangebote in seiner Klasse. Bis zu 775 Liter Kofferraum (bei umgeklappter Rueckbank bis 2.126 Liter). Auch als Elektroversion e-Berlingo verfuegbar.', 'ADAC Autotest, Citroen Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_berlingo_vorteil', 'gen_berlingo_3', 'ADVANTAGE', 'Variabler Innenraum mit hohem Nutzwert', 'Schiebtueren hinten, modulare Rueckbank, Dachreling und zahlreiche Ablagen machen den Berlingo zum praktischsten Familienauto seiner Preisklasse. Auf EMP2-Plattform mit bewährter PSA-Technik.', 'Citroen Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C3 III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_c3_komfort', 'gen_c3_3', 'ADVANTAGE', 'Komfort-Kleinwagen mit Charakter', 'Der C3 III setzt auf Komfort statt Sportlichkeit: Die Advanced-Comfort-Sitze und die weiche Federung machen ihn zum gemuetlichsten Kleinwagen. Die Airbumps an den Seiten schuetzen vor Parkremplern.', 'ADAC Autotest, Citroen Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C4 III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_c4_design', 'gen_c4_3', 'ADVANTAGE', 'Eigenstaendiges Crossover-Design', 'Der C4 III bricht mit Konventionen: Coupe-hafte Silhouette auf erhoehter Bodenfreiheit. Die Advanced-Comfort-Federung bietet hervorragenden Fahrkomfort. 380 Liter Kofferraum. Auch als rein elektrischer e-C4.', 'Citroen Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C5 Aircross
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_c5air_komfort', 'gen_c5air_1', 'LONG_DISTANCE', 'Komfortabler Reise-SUV', 'Der C5 Aircross setzt auf maximalen Komfort: Progressive Hydraulic Cushions federn Unebenheiten sanft ab. Drei verschiebbare Einzelsitze im Fond bieten Variabilitaet. 580 Liter Kofferraum.', 'ADAC Autotest, Citroen Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 3 Crossback
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ds3cb_design', 'gen_ds3cb_1', 'ADVANTAGE', 'Premium-Kleinwagen mit Pariser Chic', 'Der DS 3 Crossback setzt auf extravagantes Design mit Rautenmuster und ausfahrbaren Tuergriffe. Die Verarbeitung ist ueberdurchschnittlich fuer die Klasse. Auch als vollelektrischer E-Tense verfuegbar.', 'DS Automobiles Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 4
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ds4_design', 'gen_ds4_2', 'ADVANTAGE', 'Luxurioeses Kompaktfahrzeug', 'Der DS 4 II bietet ein eigenstaendiges Design mit rahmenloser DS-Matrix-LED-Optik und avantgardistischem Interieur. Das Head-up-Display und die Nappa-Leder-Ausstattung setzen Premium-Akzente.', 'DS Automobiles Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 7
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ds7_premium', 'gen_ds7_1', 'ADVANTAGE', 'Franzoesischer Premium-SUV', 'Der DS 7 kombiniert franzoesische Handwerkskunst mit moderner Technik. Uhrmacher-inspirierte Lueftungsdueser, Nappa-Leder und Alcantara praeges das Interieur. Night-Vision-Kamera und Matrix-LED serienmässig.', 'DS Automobiles Pressemitteilung, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- DS 9
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ds9_langstr', 'gen_ds9_1', 'LONG_DISTANCE', 'Franzoesische Reiselimousine', 'Der DS 9 ist eine 4,93 m lange Oberklasse-Limousine mit Fokus auf Komfort. Active Scan Suspension liest die Strasse voraus. Als E-Tense PHEV mit bis zu 360 PS und 58 km elektrischer Reichweite.', 'DS Automobiles Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Ducato III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ducato_nutz', 'gen_ducato_3', 'EVERYDAY_USE', 'Meistverkaufter Transporter Europas', 'Der Ducato III ist die Basis fuer zahlreiche Wohnmobil-Aufbauten und als Transporter in verschiedenen Laengen und Hoehen verfuegbar. Das maximale Ladevolumen betraegt 17 Kubikmeter. Auch als E-Ducato vollelektrisch.', 'Fiat Professional Pressemitteilung, ADAC', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Fiat Tipo II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_tipo_preis', 'gen_tipo_2', 'ADVANTAGE', 'Viel Platz fuer wenig Geld', 'Der Tipo bietet mit 4,53 m Laenge und 440 Litern Kofferraum ein ueberraschend grosszuegiges Raumangebot zu sehr attraktivem Preis. Als Kombi (Station Wagon) sogar 550 Liter.', 'ADAC Autotest, Fiat Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Honda HR-V III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_hrv3_hybrid', 'gen_hrv_3', 'ADVANTAGE', 'Effizienter Vollhybrid serienmässig', 'Der HR-V III kommt in Europa ausschliesslich als e:HEV Vollhybrid. Das System kombiniert zwei Elektromotoren mit einem 1,5-Liter-Benziner und bietet niedrigen Verbrauch bei kraeftigem Antritt. Kein Laden noetig.', 'Honda Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda2 IV
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_mazda2_stadt', 'gen_mazda2_4', 'CITY_USE', 'Agiler Premium-Kleinwagen', 'Der Mazda2 bietet ein hochwertiges Interieur und agile Fahreigenschaften. In Europa als Mazda2 Hybrid auch mit Toyota-Hybridtechnik verfuegbar. Die Verarbeitung liegt ueber dem Klassenschnitt.', 'ADAC Autotest, Mazda Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 5008 II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_5008_familie', 'gen_5008_2', 'EVERYDAY_USE', 'Grossraeumiger 7-Sitzer', 'Der 5008 II bietet sieben vollwertige Sitzplaetze. Drei einzeln verschiebbare und umklappbare Sitze in Reihe zwei erhoehen die Variabilitaet. 780 Liter Kofferraum bei fuenf Sitzen. i-Cockpit serienmässig.', 'ADAC Autotest, Peugeot Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Citroen C4 X
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_c4x_design', 'gen_c4x_1', 'ADVANTAGE', 'Stufenheck-Crossover mit viel Kofferraum', 'Der C4 X kombiniert SUV-Proportionen mit einem Stufenheck und bietet 510 Liter Kofferraum — deutlich mehr als der C4. Die Silhouette ist coupe-haft und eigenstaendig. Auch als rein elektrischer e-C4 X.', 'Citroen Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
