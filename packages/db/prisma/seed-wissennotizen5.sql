-- Seed: KnowledgeNote Runde 5 — Restliche populaere Generationen
-- Quelle: ADAC, Fachpresse, Herstellerinformationen

BEGIN;

-- Mercedes GLA H247
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_h247_stadt', 'gen_mb_gla_h247', 'CITY_USE', 'Kompaktes Premium-SUV fuer die Stadt', 'Der GLA H247 ist mit 4,41 m Laenge kompakter als viele Wettbewerber. Die erhoehte Sitzposition bietet gute Uebersicht. Einparksensoren und 360-Grad-Kamera (optional) erleichtern das Manoevrieren.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_h247_nachteil', 'gen_mb_gla_h247', 'DISADVANTAGE', 'Eingeschraenkter Kofferraum', 'Mit 435 Litern bietet der GLA weniger Kofferraum als sein Vorgaenger und weniger als einige Wettbewerber. Die Ladehoehe ist durch die kompakte Bauform begrenzt.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes GLE V167
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_v167_langstr', 'gen_mb_gle_v167', 'LONG_DISTANCE', 'Erstklassiger Langstreckenkomfort', 'Der GLE verbindet SUV-Praesenz mit Mercedes-typischem Langstreckenkomfort. Mit AIRMATIC-Luftfederung, exzellenten Sitzen und umfassenden Assistenzsystemen ist er ein hervorragender Reisewagen.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_v167_anhaenger', 'gen_mb_gle_v167', 'TOWING', 'Starker Zugwagen mit bis zu 3,5 Tonnen', 'Der GLE darf bis zu 3.500 kg anhaengen. Die Luftfederung kompensiert die Hecklast gut. Der Anhaengerassistent erleichtert das Rangieren erheblich. Besonders die Diesel-Varianten sind als Zugwagen empfehlenswert.', 'Mercedes-Benz Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes E-Klasse W214
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_w214_technik', 'gen_mb_e_w214', 'ADVANTAGE', 'Groesster Technologiesprung der E-Klasse', 'Die W214 bringt den optionalen Superscreen (drei Displays in einer Front), MBUX 3.0 und als erstes Mercedes-Modell dieser Klasse automatisiertes Fahren Level 2+ serienmässig.', 'Mercedes-Benz Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_w214_langstr', 'gen_mb_e_w214', 'LONG_DISTANCE', 'Referenz fuer Business-Reisende', 'Die E-Klasse bleibt die Referenz fuer geschaeftliches Reisen: exzellente Sitze, hervorragende Geraeuschkapselung, und der T-Modell (Kombi) bietet 615 Liter Kofferraum.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X1 U11
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_u11_alltag', 'gen_bmw_x1_u11', 'EVERYDAY_USE', 'Vielseitiges Kompakt-SUV', 'Der X1 U11 ist gegenueber dem Vorgaenger deutlich gewachsen und bietet ein grosszuegiges Raumangebot. Der Kofferraum fasst 540 Liter. Erstmals auch als rein elektrischer iX1 verfuegbar.', 'ADAC Autotest, BMW Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_u11_vorteil', 'gen_bmw_x1_u11', 'ADVANTAGE', 'Grosser Generationensprung', 'Der U11 markiert einen grossen Sprung: Curved Display, iDrive 9, deutlich mehr Platz und erstmals Elektroantrieb (iX1). Das Raumangebot ist dank Frontantriebsplattform klassenueberragend.', 'BMW Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 4er G22
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_g22_design', 'gen_bmw_4er_g22', 'ADVANTAGE', 'Eigenstaendiges Coupe-Design', 'Der 4er Coupe grenzt sich durch die grosse Niere optisch klar vom 3er ab. Das flache Dach und die breiten Schultern erzeugen eine athletische Silhouette. Auch als Gran Coupe und M4 verfuegbar.', 'BMW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_g22_nachteil', 'gen_bmw_4er_g22', 'DISADVANTAGE', 'Polarisierendes Frontdesign', 'Die grosse Niere des G22 polarisiert wie kaum ein anderes BMW-Designelement. Die Praezision des Designs ist unbestritten, aber die Akzeptanz ist geteilt — was den Wiederverkauf beeinflussen kann.', 'auto motor und sport, Autobild', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A5 F5
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_a5_f5_design', 'gen_audi_a5_f5', 'ADVANTAGE', 'Elegantes Coupe-Design mit praktischem Sportback', 'Der A5 F5 bietet als Sportback die Eleganz eines Coupes mit der Praktikabilitaet eines Fliessheck. 465 Liter Kofferraum und eine grosse Ladeöffnung machen ihn alltagstauglicher als ein klassisches Coupe.', 'Audi Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_a5_f5_langstr', 'gen_audi_a5_f5', 'LONG_DISTANCE', 'Guter Langstreckenkomfort', 'Der A5 eignet sich dank bequemer Sitze und guter Geraeuschkapselung gut fuer die Langstrecke. Die adaptiven Daempfer (optional) verbessern den Komfort deutlich.', 'auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Q3 F3
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_q3_f3_alltag', 'gen_audi_q3_f3', 'EVERYDAY_USE', 'Kompaktes Premium-SUV fuer den Alltag', 'Der Q3 F3 bietet eine gute Kombination aus erhoehter Sitzposition, kompakten Abmessungen und Premium-Interieur. Der Kofferraum fasst 530 Liter. Auch als sportlicher Q3 Sportback verfuegbar.', 'ADAC Autotest, Audi Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_q3_f3_wert', 'gen_audi_q3_f3', 'RESALE_VALUE', 'Gute Wertstabilitaet im Segment', 'Der Q3 haelt seinen Wert dank hoher Nachfrage im Premium-Kompakt-SUV-Segment gut. Die S line Ausstattung ist besonders wertstabil.', 'DAT Restwertprognose, Schwacke', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi e-tron GT J1
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_etgt_performance', 'gen_audi_etron_j1', 'ADVANTAGE', 'Porsche-Taycan-Technik mit Audi-Design', 'Der e-tron GT teilt die J1-Plattform mit dem Porsche Taycan und bietet vergleichbare Leistung zu einem niedrigeren Preis. Der RS e-tron GT mit 646 PS beschleunigt in 3,3 Sekunden auf 100 km/h.', 'Audi Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_etgt_langstr', 'gen_audi_etron_j1', 'LONG_DISTANCE', 'Gran Turismo auch elektrisch', 'Der e-tron GT eignet sich mit bis zu 488 km Reichweite (WLTP) und Ladeleistungen von bis zu 270 kW gut fuer die Langstrecke. Die bequemen Sitze und die gute Geraeuschkapselung unterstuetzen das GT-Konzept.', 'ADAC Autotest, Audi Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CUPRA Born
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_born_fahrdyn', 'gen_cupra_born1', 'ADVANTAGE', 'Sportlichster MEB-Elektrowagen', 'Der CUPRA Born ist die sportlichste Interpretation der VW-Konzern MEB-Plattform. Straffere Fahrwerksabstimmung, Sportschalensitze und das CUPRA-Design setzen ihn deutlich vom VW ID.3 ab.', 'CUPRA Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_born_stadt', 'gen_cupra_born1', 'CITY_USE', 'Idealer elektrischer Stadtwagen', 'Mit 4,32 m Laenge ist der Born kompakt genug fuer die Stadt. Die sofort verfuegbare Drehmomentabgabe macht ihn agil im Stadtverkehr. Reichweite bis 424 km (WLTP) mit der 77-kWh-Batterie.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- MINI Countryman F60
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_f60_alltag', 'gen_mini_country_f60', 'EVERYDAY_USE', 'Grosszuegigster MINI fuer Familien', 'Der Countryman F60 ist der groesste und praktischste MINI. Mit 450 Litern Kofferraum und gutem Raumangebot im Fond eignet er sich fuer kleine Familien. Auch als Plug-in-Hybrid (Cooper S E ALL4) verfuegbar.', 'ADAC Autotest, MINI Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_f60_fahrspass', 'gen_mini_country_f60', 'ADVANTAGE', 'MINI-typischer Fahrspass im SUV-Format', 'Der Countryman behaelt den MINI-typischen Fahrspass trotz SUV-Proportionen. Das Go-Kart-Feeling ist weniger ausgepraegt als beim 3-Tuerer, aber immer noch spuerbar. ALL4-Allradantrieb verfuegbar.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC90 II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_xc90_sicherheit', 'gen_volvo_xc90_2', 'ADVANTAGE', 'Sicherheits-Benchmark im SUV-Segment', 'Der XC90 II setzt Massstaebe bei der Sicherheit: 5 Sterne Euro NCAP, City Safety mit automatischer Notbremsung, und die Vision, dass kein Insasse in einem neuen Volvo toedlich verungluecken soll.', 'Volvo Pressemitteilung, Euro NCAP', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_xc90_7sitzer', 'gen_volvo_xc90_2', 'EVERYDAY_USE', 'Premium-7-Sitzer mit skandinavischem Design', 'Der XC90 bietet serienmässig sieben Sitzplaetze. Auch die dritte Reihe ist fuer Kinder gut nutzbar. Der Kofferraum fasst 451 Liter (7-Sitzer) bis 1.816 Liter bei umgeklappten Sitzen.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo V60 II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_v60_langstr', 'gen_v60_2', 'LONG_DISTANCE', 'Komfortabler skandinavischer Kombi', 'Der V60 II bietet einen der komfortabelsten Innenraeume im Mittelklasse-Kombi-Segment. Die Sitze sind langstreckentauglich, das Gerauschniveau niedrig. 529 Liter Kofferraum bieten genuegend Platz.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_v60_design', 'gen_v60_2', 'ADVANTAGE', 'Eigenstaendiges skandinavisches Design', 'Der V60 setzt auf Volvos eigenstaendige Designsprache mit Thors-Hammer-Tagfahrlichtern und klarer skandinavischer Innenraumgestaltung. Das Design altert langsamer als bei vielen Wettbewerbern.', 'Volvo Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model S Plaid
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_models_performance', 'gen_ts_models_p', 'ADVANTAGE', 'Extremste Beschleunigung einer Serienlimousine', 'Der Model S Plaid beschleunigt mit drei Motoren und 1.020 PS in unter 2,1 Sekunden auf 100 km/h. Er ist damit die schnellste Serienlimousine der Welt. Die Reichweite betraegt bis zu 600 km (WLTP).', 'Tesla Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_models_nachteil', 'gen_ts_models_p', 'DISADVANTAGE', 'Yoke-Lenkrad und Touch-only-Bedienung', 'Das optionale Yoke-Lenkrad und die vollstaendige Touch-Bedienung (keine physischen Hebel) sind kontrovers. Insbesondere die fehlenden Blinkerhebel und Scheibenwischer-Hebel erfordern Eingewoehnung.', 'ADAC Autotest, Autobild', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
