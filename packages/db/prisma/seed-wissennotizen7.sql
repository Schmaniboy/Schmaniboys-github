-- Seed: KnowledgeNote Runde 7 — Lueckenfueller: Generationen ohne KnowledgeNote
-- Quelle: ADAC, Fachpresse, Herstellerinformationen

BEGIN;

-- Audi Q5 FY
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_q5_fy_alltag', 'gen_audi_q5_fy', 'EVERYDAY_USE', 'Vielseitiges Mittelklasse-SUV', 'Der Q5 FY bietet ein grosszuegiges Raumangebot mit 520 Litern Kofferraum. Die MLB-evo-Plattform liefert ausgewogene Fahreigenschaften. Auch als Sportback mit coupeartiger Dachlinie verfuegbar.', 'ADAC Autotest, Audi Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_q5_fy_vorteil', 'gen_audi_q5_fy', 'ADVANTAGE', 'Breites Motorenprogramm mit quattro', 'Der Q5 bietet von sparsamen TDI bis zum SQ5 mit 354 PS eine breite Motorenpalette. Quattro-Allradantrieb ist bei den meisten Varianten serienmässig. Auch als TFSI e Plug-in-Hybrid verfuegbar.', 'Audi Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW Z4 G29
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_z4_fahrspass', 'gen_bmw_z4_g29', 'ADVANTAGE', 'Puristischer Roadster mit BMW-Technik', 'Der Z4 G29 teilt die Plattform mit dem Toyota Supra und bietet kraftvolle Reihensechszylinder-Motoren. Das Stoffverdeck spart Gewicht gegenueber einem Klappdach. Praezise Lenkung und Hinterradantrieb.', 'BMW Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_z4_langstr', 'gen_bmw_z4_g29', 'LONG_DISTANCE', 'Komfortabler Langstrecken-Roadster', 'Der Z4 bietet dank gut gedaemmtem Verdeck und bequemen Sitzen ueberraschend guten Langstreckenkomfort fuer einen Roadster. Der Kofferraum fasst 281 Liter — auch bei geschlossenem Verdeck.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CUPRA Formentor
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_formentor_fahrdyn', 'gen_cupra_formentor1', 'ADVANTAGE', 'Sportlichstes SUV im VW-Konzern', 'Der Formentor ist das erste eigenstaendige CUPRA-Modell und bietet als VZ5 mit dem 5-Zylinder-Audi-Motor 390 PS. Die straffere Abstimmung und das sportliche Design setzen ihn deutlich ab.', 'CUPRA Pressemitteilung, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_formentor_alltag', 'gen_cupra_formentor1', 'EVERYDAY_USE', 'Sportlich und alltagstauglich', 'Trotz sportlicher Ausrichtung bietet der Formentor 450 Liter Kofferraum und gutes Platzangebot im Fond. MQB-evo-Technik garantiert Zuverlaessigkeit und guenstige Ersatzteile.', 'ADAC Autotest, CUPRA Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai i30 PD
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_i30_alltag', 'gen_hy_i30_pd', 'EVERYDAY_USE', 'Solider Allrounder mit 5 Jahren Garantie', 'Der i30 PD bietet ein gutes Preis-Leistungs-Verhaeltnis mit umfangreicher Serienausstattung und 5 Jahren Herstellergarantie. 395 Liter Kofferraum (Kombi: 602 Liter). Als N und N Line auch sportlich.', 'ADAC Autotest, Hyundai Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_i30_vorteil', 'gen_hy_i30_pd', 'ADVANTAGE', 'i30 N als Fahrspass-Benchmark', 'Der i30 N hat sich als einer der besten Kompaktsportler etabliert. Mit bis zu 280 PS, elektronischem Sperrdifferenzial und N-Grin-Shift bietet er Fahrspass auf Sportwagen-Niveau.', 'auto motor und sport, sport auto', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Nissan Qashqai III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_qashqai3_alltag', 'gen_qashqai_3', 'EVERYDAY_USE', 'Bewaehrtes Kompakt-SUV', 'Der Qashqai III ist deutlich gewachsen und bietet ein grosszuegiges Raumangebot. 504 Liter Kofferraum sind sehr gut fuer die Klasse. Das e-POWER-System bietet ein elektrisches Fahrgefuehl ohne Laden.', 'ADAC Autotest, Nissan Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_qashqai3_technik', 'gen_qashqai_3', 'ADVANTAGE', 'Innovatives e-POWER Antriebskonzept', 'Der Qashqai III ist in Europa ausschliesslich als Mild-Hybrid oder e-POWER verfuegbar. Das e-POWER-System nutzt den Benzinmotor nur als Generator — die Raeder werden rein elektrisch angetrieben.', 'Nissan Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Renault Clio V
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_clio5_alltag', 'gen_ren_clio5', 'EVERYDAY_USE', 'Premium-Kleinwagen mit viel Platz', 'Der Clio V bietet ein deutlich hochwertigeres Interieur als der Vorgaenger. 391 Liter Kofferraum sind klassenueberragend. Der E-TECH Hybrid reduziert den Verbrauch ohne Steckdose spuerbar.', 'ADAC Autotest, Renault Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_clio5_vorteil', 'gen_ren_clio5', 'ADVANTAGE', 'Bester Kleinwagen-Innenraum seiner Klasse', 'Das Interieur des Clio V setzt mit 9,3-Zoll-Hochkant-Display und hochwertigen Materialien Massstaebe im Kleinwagen-Segment. Die Verarbeitungsqualitaet ist ein deutlicher Sprung zum Vorgaenger.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Skoda Kodiaq NS
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_kodiaq_familie', 'gen_sk_kodiaq_ns', 'EVERYDAY_USE', 'Groesstes Skoda-SUV mit 7 Sitzen', 'Der Kodiaq bietet bis zu sieben Sitzplaetze und 835 Liter Kofferraum (5-Sitzer). Die Simply-Clever-Details und das grosszuegige Raumangebot machen ihn zum idealen Familienauto.', 'ADAC Autotest, Skoda Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_kodiaq_wert', 'gen_sk_kodiaq_ns', 'RESALE_VALUE', 'Gute Wertstabilitaet', 'Der Kodiaq haelt seinen Wert dank hoher Nachfrage im 7-Sitzer-SUV-Segment gut. Die Sportline- und L&K-Ausstattungen sind besonders wertstabil.', 'Schwacke, DAT Restwertprognose', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC60 II
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_xc60_sicherheit', 'gen_volvo_xc60_2', 'ADVANTAGE', 'Sicherheits-Referenz im Mittelklasse-SUV', 'Der XC60 II erhaelt regelmaessig Bestnoten in Sicherheitstests. City Safety, Oncoming Lane Mitigation und Run-off Road Protection sind serienmässig. 5 Sterne Euro NCAP.', 'Volvo Pressemitteilung, Euro NCAP', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_xc60_langstr', 'gen_volvo_xc60_2', 'LONG_DISTANCE', 'Komfortabler Reise-SUV', 'Der XC60 verbindet SUV-Praesenz mit skandinavischem Komfort. Bequeme Sitze, niedriges Gerauschniveau und der grosse Kofferraum (505 Liter) machen ihn zum angenehmen Langstreckenfahrzeug.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Passat B8
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_passat_b8_langstr', 'gen_vw_passat_b8', 'LONG_DISTANCE', 'Die Langstrecken-Referenz der Mittelklasse', 'Der Passat B8 Variant bietet 650 Liter Kofferraum und hervorragenden Langstreckenkomfort. Die DCC-Fahrwerksregelung und die bequemen ergoActive-Sitze machen lange Fahrten ermuedungsfrei.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_passat_b8_zuverl', 'gen_vw_passat_b8', 'RELIABILITY', 'Bewaehnrte MQB-Technik', 'Der Passat B8 basiert auf der MQB-Plattform und nutzt bewaehrte VW-Konzern-Motoren. Die 2.0 TDI-Varianten sind besonders langstreckentauglich und zuverlaessig. In der ADAC-Pannenstatistik unauffaellig.', 'ADAC Pannenstatistik, TUeV-Report', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Passat B9
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_passat_b9_technik', 'gen_vw_passat_b9', 'ADVANTAGE', 'Grosser Technologiesprung', 'Der Passat B9 bringt ein 15-Zoll-Display, IQ.Light HD Matrix-LED und erstmals Travel Assist mit Spurwechselassistent. Nur noch als Variant (Kombi) erhaeltlich — die Limousine entfaellt.', 'VW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_passat_b9_langstr', 'gen_vw_passat_b9', 'LONG_DISTANCE', 'Kombi-Referenz mit 690 Litern', 'Der Passat B9 Variant bietet 690 Liter Kofferraum — Klassenbestwert. DCC Pro Fahrwerksregelung und Head-up-Display mit Augmented Reality machen ihn zum technisch fortschrittlichsten Mittelklasse-Kombi.', 'ADAC Autotest, VW Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW Tiguan III
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_tiguan3_alltag', 'gen_vw_tiguan_3', 'EVERYDAY_USE', 'Deutschlands meistverkauftes SUV neu aufgelegt', 'Der Tiguan III ist gewachsen und bietet ein noch grosszuegigeres Raumangebot. Das 15-Zoll-Display und IQ.Light HD sind ein grosser Generationensprung. Auch als eHybrid PHEV mit bis zu 100 km E-Reichweite.', 'ADAC Autotest, VW Pressemitteilung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_tiguan3_vorteil', 'gen_vw_tiguan_3', 'ADVANTAGE', 'PHEV mit 100 km elektrischer Reichweite', 'Der Tiguan III eHybrid bietet bis zu 100 km rein elektrische Reichweite — ausreichend fuer die meisten Alltagsfahrten. Das MQB-evo-Fahrwerk bietet spuerbar besseren Komfort als der Vorgaenger.', 'VW Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
