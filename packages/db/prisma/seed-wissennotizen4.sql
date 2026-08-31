-- Seed: KnowledgeNote Runde 4 — Weitere populaere Generationen
-- Quelle: ADAC, Fachpresse, Herstellerinformationen, TUeV-Reports

BEGIN;

-- SEAT Leon IV (KL)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_leon4_fahrdyn', 'gen_seat_leon4', 'ADVANTAGE', 'Sportlichster Kompaktwagen im VW-Konzern', 'Der Leon IV basiert auf der gleichen MQB-evo-Plattform wie der Golf 8, bietet aber ein strafferes Fahrwerk und eine direktere Abstimmung. Besonders der Sportstourer (Kombi) ueberzeugt als praktischer Allrounder mit sportlichem Charakter.', 'SEAT Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_leon4_preis', 'gen_seat_leon4', 'BUYING_ADVICE', 'Guenstigere Golf-Alternative', 'Der Leon bietet nahezu die gleiche Technik wie der VW Golf 8, ist aber spuerbar guenstiger. Die FR-Ausstattung bietet das beste Preis-Leistungs-Verhaeltnis. DSG und 1.5 TSI sind die beliebteste Kombination.', 'ADAC Kaufberatung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Fabia IV (PJ)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_fabia4_platz', 'gen_sk_fabia_pj', 'ADVANTAGE', 'Grosszuegiges Platzangebot fuer einen Kleinwagen', 'Der Fabia IV ist auf MQB-A0-Plattform deutlich gewachsen und bietet mit 380 Litern den groessten Kofferraum seiner Klasse. Auch im Fond ist das Raumangebot fuer die Fahrzeugklasse ueberdurchschnittlich.', 'Skoda Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_fabia4_alltag', 'gen_sk_fabia_pj', 'EVERYDAY_USE', 'Praktischer Alltagsbegleiter', 'Simply-Clever-Details wie Regenschirmfach in der Tuer, Eiskratzer in der Tankdeckelklappe und zahlreiche Ablagen machen den Fabia zum durchdachten Alltagsauto. Die Uebersichtlichkeit ist gut.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Superb III (3V)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_superb_platz', 'gen_sk_superb_3v', 'ADVANTAGE', 'Raumangebot auf Oberklasse-Niveau', 'Der Superb III bietet mit 625 Litern (Limousine) bzw. 660 Litern (Combi) ein Raumangebot, das viele Oberklasse-Fahrzeuge uebertrifft. Die Beinfreiheit im Fond ist klassenueberragend.', 'Skoda Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_superb_preis', 'gen_sk_superb_3v', 'BUYING_ADVICE', 'Premium-Raumangebot zum Mittelklasse-Preis', 'Der Superb bietet das beste Preis-Raumangebot-Verhaeltnis auf dem Markt. Die Style-Ausstattung mit 2.0 TDI und DSG ist fuer Vielfahrer die optimale Wahl. Columbus-Infotainment empfehlenswert.', 'ADAC Kaufberatung, Schwacke', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_superb_langstr', 'gen_sk_superb_3v', 'LONG_DISTANCE', 'Ausgezeichneter Langstreckenkomfort', 'Der Superb ist ein hervorragender Reisewagen: bequeme Sitze, gute Geraeuschkapselung und ein grosszuegiger Kofferraum. Die adaptiven Daempfer (DCC) verbessern den Komfort deutlich.', 'auto motor und sport Dauertest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW ID.4 (E21)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_id4_alltag', 'gen_vw_id4_e2', 'EVERYDAY_USE', 'Geraemiges Elektro-SUV fuer Familien', 'Der ID.4 bietet ein grosszuegiges Raumangebot dank der Elektro-Plattform (MEB). Der Kofferraum fasst 543 Liter. Die erhoehte Sitzposition und die gute Uebersichtlichkeit machen ihn familienfreundlich.', 'ADAC Autotest, VW Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_id4_nachteil', 'gen_vw_id4_e2', 'DISADVANTAGE', 'Software-Qualitaet war Schwachpunkt', 'Die Infotainment-Software war bei Markteinfuehrung fehleranfaellig und langsam. VW hat seither zahlreiche OTA-Updates nachgeliefert, die Situation hat sich ab Software-Version 3.x deutlich verbessert.', 'ADAC Pannenstatistik, VW-Foren', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_id4_reichweite', 'gen_vw_id4_e2', 'LONG_DISTANCE', 'Langstrecke mit Einschraenkungen', 'Der ID.4 Pro S (77 kWh) schafft im Alltag 350-400 km Reichweite. Die Ladeleistung von bis zu 135 kW ist ordentlich, aber nicht klassenueberragend. Die Routenplanung im Navi beruecksichtigt Ladesaeulen.', 'ADAC EcoTest, VW Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Touran (5T)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_touran_familie', 'gen_vw_touran_5t', 'EVERYDAY_USE', 'Idealer Familien-Van', 'Der Touran ist einer der besten Familien-Vans: flexibles Sitzsystem mit drei einzeln verschiebbaren Sitzen im Fond, optionale dritte Sitzreihe (7-Sitzer), und 834 Liter Kofferraum im 5-Sitzer.', 'ADAC Autotest, VW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_touran_nachteil', 'gen_vw_touran_5t', 'DISADVANTAGE', 'Auslaufmodell ohne direkten Nachfolger', 'VW hat den Touran 2024 ohne direkten Nachfolger eingestellt. Neufahrzeuge sind nur noch aus Restbestaenden verfuegbar. Die Ersatzteilversorgung ist langfristig gesichert.', 'VW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai Kona (SZ)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_kona_design', 'gen_hy_kona_sz', 'ADVANTAGE', 'Eigenstaendiges Design im B-SUV-Segment', 'Der Kona hebt sich durch sein markantes Design mit geteilten Scheinwerfern deutlich vom Wettbewerb ab. Auch als reiner Elektro-Kona mit bis zu 484 km Reichweite (WLTP) verfuegbar.', 'Hyundai Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_kona_stadt', 'gen_hy_kona_sz', 'CITY_USE', 'Kompakter Stadtfluechter', 'Mit 4,18 m Laenge ist der Kona kompakt genug fuer die Stadt. Die erhoehte Sitzposition gibt gute Uebersicht. Der Wendekreis ist mit 10,6 m akzeptabel. Einparksensoren und Rueckfahrkamera ab mittlerer Ausstattung.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai i20 (BC3)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_i20_ausstattung', 'gen_hy_i20_bc3', 'ADVANTAGE', 'Umfangreiche Serienausstattung', 'Der i20 bietet bereits in der Basis eine umfangreiche Ausstattung mit LED-Scheinwerfern, Digitalcockpit und modernen Assistenzsystemen. Das Preis-Leistungs-Verhaeltnis ist fuer die Klasse fuehrend.', 'Hyundai Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_i20_n', 'gen_hy_i20_bc3', 'TUNING_POTENTIAL', 'i20 N als sportliche Speerspitze', 'Der i20 N mit 204 PS, Sperrdifferenzial und Sportfahrwerk ist einer der besten Hot Hatches seiner Klasse. Die N-Performance-Abgasanlage und der Rev-Matching-Modus bieten echten Fahrspass.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Ceed (CD)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_ceed_garantie', 'gen_kia_ceed_cd', 'ADVANTAGE', '7-Jahre-Garantie als Alleinstellungsmerkmal', 'Die 7-Jahre/150.000-km-Herstellergarantie von Kia ist in Europa einzigartig und ein starkes Argument beim Kauf. Sie umfasst Motor, Getriebe, Fahrwerk und alle wesentlichen Bauteile.', 'Kia Deutschland Garantiebedingungen', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_ceed_kauf', 'gen_kia_ceed_cd', 'BUYING_ADVICE', 'Spirit-Ausstattung empfohlen', 'Die Spirit-Ausstattung bietet das beste Preis-Leistungs-Verhaeltnis: Navigation, Sitzheizung, LED-Scheinwerfer und Einparkhilfe sind enthalten. Der 1.5 T-GDi mit 160 PS ist die empfehlenswerteste Motorisierung.', 'ADAC Kaufberatung', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Niro (DE3)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_niro2_vielseitig', 'gen_kia_niro_de3', 'ADVANTAGE', 'Drei Antriebsvarianten in einem Modell', 'Der Niro II ist als Hybrid, Plug-in-Hybrid und rein elektrisch (EV) erhaeltlich. Das gibt Kaeufern maximale Flexibilitaet bei der Wahl des passenden Antriebs. Alle Varianten teilen das gleiche Design und Raumangebot.', 'Kia Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_niro2_nachhaltig', 'gen_kia_niro_de3', 'ADVANTAGE', 'Nachhaltige Materialien im Innenraum', 'Der Niro II setzt auf recycelte PET-Flaschen fuer Sitzbezuege und Tuerverkleidungen. Kia betont bei diesem Modell besonders den Nachhaltigkeitsaspekt, auch bei der Produktion.', 'Kia Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Dacia Duster III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_duster3_preis', 'gen_dacia_duster3', 'ADVANTAGE', 'Guenstigstes SUV auf dem Markt', 'Der Duster III bleibt Dacias Preisbrecher: Er bietet ein vollwertiges SUV mit modernem Design zu einem Einstiegspreis, der deutlich unter der Konkurrenz liegt. LPG-Option (TCe 100 ECO-G) senkt die Kraftstoffkosten weiter.', 'Dacia Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_duster3_offroad', 'gen_dacia_duster3', 'ADVANTAGE', 'Echte Gelaendekompetenz im Segment', 'Der Duster ist einer der wenigen Kompakt-SUVs mit echtem Allradantrieb und Unterfahrschutz. Die Bodenfreiheit von 217 mm und der Terrain-Control-Modus machen ihn offroad-tauglicher als die Konkurrenz.', 'Dacia Pressemitteilung, Autobild Offroad-Test', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Mokka II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_mokka2_design', 'gen_opel_mokka_2', 'ADVANTAGE', 'Markantes Bold-und-Pure-Design', 'Der Mokka II markiert den Designwandel bei Opel. Die Vizor-Front und das Bold-und-Pure-Design setzen ihn deutlich vom Vorgaenger und der Konkurrenz ab. Auch als rein elektrischer Mokka-e verfuegbar.', 'Opel Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_mokka2_nachteil', 'gen_opel_mokka_2', 'DISADVANTAGE', 'Eingeschraenktes Raumangebot', 'Der Mokka II ist mit 4,15 m Laenge kompakt, was sich im Fond und Kofferraum (350 Liter) bemerkbar macht. Die nach hinten abfallende Dachlinie schraenkt die Kopffreiheit im Fond ein.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 308 III (P51)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_308_design', 'gen_308_3', 'ADVANTAGE', 'Neues Peugeot-Design auf hohem Niveau', 'Der 308 III zeigt das neue Peugeot-Markengesicht mit Loewenklauen-LED und dem neuen Loewenemblem. Das Design hebt sich deutlich vom konservativen Vorgaenger ab und wirkt eigenstaendig.', 'Peugeot Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_308_phev', 'gen_308_3', 'EVERYDAY_USE', 'PHEV mit 60 km elektrischer Reichweite', 'Die Plug-in-Hybrid-Version bietet 60 km rein elektrische Reichweite (WLTP), was fuer die meisten Pendlerstrecken ausreicht. Im reinen Elektrobetrieb ist der 308 angenehm leise und sparsam.', 'ADAC Autotest, Peugeot Pressemitteilung', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Megane E-Tech
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_megane_ev_openr', 'gen_ren_megane_ev', 'ADVANTAGE', 'Google-basiertes Infotainment', 'Der Megane E-Tech nutzt als erstes Renault-Modell Android Automotive mit Google Maps, Google Assistant und Play Store als natives System. Die Bedienung ist intuitiv und die Kartendaten stets aktuell.', 'Renault Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_megane_ev_design', 'gen_ren_megane_ev', 'ADVANTAGE', 'Kompaktestes Elektro-Crossover', 'Mit nur 4,20 m Laenge und einer Hoehe von 1,50 m ist der Megane E-Tech eines der kompaktesten Elektrofahrzeuge. Die flache Batterie ermoeglicht eine niedrige Silhouette trotz SUV-Charakter.', 'Renault Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Puma
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_puma_megabox', 'gen_ford_puma_1', 'ADVANTAGE', 'MegaBox als praktisches Alleinstellungsmerkmal', 'Die MegaBox im Kofferraumboden ist ein 80-Liter-Fach mit Ablaufstopfen — ideal fuer schlammige Stiefel, nasse Regenjacken oder sperrige Gegenstaende. Ein einzigartiges Feature in der Klasse.', 'Ford Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_puma_fahrdyn', 'gen_ford_puma_1', 'ADVANTAGE', 'Agiles Fahrverhalten im B-SUV-Segment', 'Der Puma faehrt sich fuer ein kleines SUV bemerkenswert agil. Das Fahrwerk ist straff, aber komfortabel abgestimmt. Der 1.0 EcoBoost mit 125 PS bietet genuegend Leistung fuer sportliches Fahren.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mazda CX-30 (DM)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_cx30_verarbeit', 'gen_cx30_1', 'ADVANTAGE', 'Premium-Verarbeitungsqualitaet', 'Der CX-30 ueberrascht mit einer Verarbeitungsqualitaet, die deutlich ueber der Klasse liegt. Weiche Materialien, praezise Passungen und ein aufgeraemtes Design machen den Innenraum hochwertig.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_cx30_skyactx', 'gen_cx30_1', 'ADVANTAGE', 'Skyactiv-X als innovative Motorentechnik', 'Der optionale Skyactiv-X Motor (e-Skyactiv X) kombiniert Otto- und Diesel-Verbrennungsprinzip. Er bietet gute Effizienz bei gleichzeitig ansprechendem Drehmoment. Eine weltweit einzigartige Technologie.', 'Mazda Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
