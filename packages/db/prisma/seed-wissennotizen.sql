-- seed-wissennotizen.sql
-- KnowledgeNotes: Vorteile, Nachteile, Kaufberatung und Alltagstipps
-- Basiert auf allgemein dokumentierten Fahrzeugeigenschaften (ADAC, TUeV, Fachpresse)

BEGIN;

-- ============================================================
-- BMW 3er F30/F31
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_f30_adv1', 'gen_bmw_3er_f30', 'ADVANTAGE', 'Agiles Fahrwerk', 'Die hinterradgetriebene Plattform bietet hervorragende Fahrdynamik. Praezise Lenkung und ausgewogene Gewichtsverteilung machen den F30 zum Massstab in der Mittelklasse.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmende Bewertungen von auto motor und sport, AMS, sport auto seit 2012', 'PUBLISHED', NOW(), NOW()),
('kn_f30_dis1', 'gen_bmw_3er_f30', 'DISADVANTAGE', 'Hohe Unterhaltskosten', 'Ersatzteile und Werkstattkosten liegen deutlich ueber dem Klassenschnitt. Besonders Bremsanlage, Fahrwerk und Elektronik-Reparaturen sind kostspielig.', 'ASSESSMENT', 'HIGH', 'ADAC-Kostenvergleich Mittelklasse, Schwacke-Unterhaltskosten', 'PUBLISHED', NOW(), NOW()),
('kn_f30_buy1', 'gen_bmw_3er_f30', 'BUYING_ADVICE', 'Auf Steuerkette und Oelverbrauch achten', 'Beim N20-Motor unbedingt auf Steuerkettengeraeusche pruefen. Oelstandskontrolle und lueckenlose Wartungshistorie sind Pflicht bei Gebrauchtfahrzeugen ab 2012-2015.', 'ASSESSMENT', 'HIGH', 'Bekannte Problemstelle des N20/N26, ADAC-Pannenstatistik', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- BMW 3er G20/G21
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_g20_adv1', 'gen_bmw_3er_g20', 'ADVANTAGE', 'Deutlich modernere Technik', 'Gegenueber dem F30 grosser Sprung bei Assistenzsystemen, Infotainment und Motoreneffizienz. Der B48 ist wesentlich zuverlaessiger als der N20-Vorgaenger.', 'ASSESSMENT', 'HIGH', 'Vergleichstests Fachpresse, TUeV-Report 2024', 'PUBLISHED', NOW(), NOW()),
('kn_g20_dis1', 'gen_bmw_3er_g20', 'DISADVANTAGE', 'Bedienkomplexitaet', 'Das iDrive-System ab 2022 (OS8) setzt stark auf Touchscreen. Viele Funktionen, die beim F30 noch per Taste erreichbar waren, erfordern nun Menue-Navigation.', 'ASSESSMENT', 'MEDIUM', 'Nutzerfeedback, Vergleich der Bedienkonzepte F30 vs. G20 LCI', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VW Golf VII
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_golf7_adv1', 'gen_vw_golf7', 'ADVANTAGE', 'Riesiges Ersatzteilangebot', 'Als meistverkauftes Auto Europas profitiert der Golf VII von breiter Teileversorgung. Freie Werkstaetten kennen das Modell, Ersatzteile sind guenstig und sofort verfuegbar.', 'SPECIFICATION', 'HIGH', 'Marktdaten KBA, Schwacke-Ersatzteilpreise', 'PUBLISHED', NOW(), NOW()),
('kn_golf7_dis1', 'gen_vw_golf7', 'DISADVANTAGE', 'DSG-Getriebe anfaellig', 'Das DQ200-Doppelkupplungsgetriebe (7-Gang trocken) zeigt bei vielen Exemplaren Ruckeln und Schaltstoesse, besonders bei niedrigem Tempo und im Stadtverkehr.', 'MARKET_SIGNAL', 'HIGH', 'Millionenfach dokumentiert, VW hat mehrfach Kulanz-Aktionen durchgefuehrt', 'PUBLISHED', NOW(), NOW()),
('kn_golf7_buy1', 'gen_vw_golf7', 'BUYING_ADVICE', '1.5 TSI ab 2017 bevorzugen', 'Der 1.5 TSI (EA211 evo) ist gegenueber dem aelteren 1.4 TSI sparsamer und zuverlaessiger. In Kombination mit Handschaltung bietet er das beste Verhaeltnis aus Kosten und Zuverlaessigkeit.', 'ASSESSMENT', 'MEDIUM', 'Vergleich Motorisierungen in TUeV-Report und ADAC-Pannenstatistik', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VW Golf VIII
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_golf8_adv1', 'gen_vw_golf8', 'ADVANTAGE', 'Effiziente Mild-Hybrid-Antriebe', 'Die eTSI-Motoren mit 48V-Mildhybrid bieten spuerbar niedrigeren Verbrauch im Stadtverkehr gegenueber dem Vorgaenger, ohne Einschraenkungen im Alltag.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben und unabhaengige Verbrauchsmessungen', 'PUBLISHED', NOW(), NOW()),
('kn_golf8_dis1', 'gen_vw_golf8', 'DISADVANTAGE', 'Bedienkonzept umstritten', 'Der Verzicht auf physische Tasten fuer Klimaanlage und Lautstaerke zugunsten von Touch-Slidern wird von vielen Nutzern als Rueckschritt empfunden. Ablenkungspotenzial im Verkehr.', 'MARKET_SIGNAL', 'HIGH', 'Zahlreiche Testberichte, Euro-NCAP-Kritik am Bedienkonzept', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Mercedes C-Klasse W205
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_w205_adv1', 'gen_mb_c_w205', 'ADVANTAGE', 'Hochwertiges Interieur', 'Das Interieur setzt mit Echtholz, Aluminium und verarbeitetem Leder Massstaebe in der Mittelklasse. Materialqualitaet und Verarbeitung auf S-Klasse-Niveau.', 'ASSESSMENT', 'HIGH', 'Vergleichstests auto motor und sport, ADAC', 'PUBLISHED', NOW(), NOW()),
('kn_w205_dis1', 'gen_mb_c_w205', 'DISADVANTAGE', 'Rostanfaelligkeit', 'An Radlaeufen und Schwellern kann fruehe Korrosion auftreten. Besonders bei Fahrzeugen ohne Hohlraumversiegelung und in Regionen mit Streusalzbelastung.', 'MARKET_SIGNAL', 'MEDIUM', 'ADAC-Maengelstatistik, Nutzerforen', 'PUBLISHED', NOW(), NOW()),
('kn_w205_buy1', 'gen_mb_c_w205', 'BUYING_ADVICE', 'Auf Lenkungsspiel pruefen', 'Die Lenkung zeigt bei aelteren Exemplaren manchmal erhoehtes Spiel. Bei der Probefahrt auf exaktes Geradeauslauf-Verhalten und Lenkungsgeraeusche achten.', 'ASSESSMENT', 'MEDIUM', 'Bekannte Schwachstelle, TUeV-Maengelberichte', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Audi A4 B9
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_a4b9_adv1', 'gen_audi_a4_b9', 'ADVANTAGE', 'Exzellente Verarbeitung', 'Die Spaltmasse und Materialauswahl im Innenraum setzen Massstaebe. Virtual Cockpit und Verarbeitungsqualitaet gehoeren zu den besten der Klasse.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmende Bewertungen in Fachpresse und Langzeittests', 'PUBLISHED', NOW(), NOW()),
('kn_a4b9_dis1', 'gen_audi_a4_b9', 'DISADVANTAGE', 'Erhoehter Oelverbrauch 2.0 TFSI', 'Der 2.0 TFSI zeigt bei manchen Exemplaren erhoehten Oelverbrauch, besonders bei sportlicher Fahrweise. Regelmaessige Oelstandskontrolle empfohlen.', 'MARKET_SIGNAL', 'MEDIUM', 'ADAC-Pannenstatistik, Erfahrungsberichte Halter', 'PUBLISHED', NOW(), NOW()),
('kn_a4b9_ev1', 'gen_audi_a4_b9', 'EVERYDAY_USE', 'Hervorragender Langstreckenkomfort', 'Dank niedriger Windgeraeussche, progressiver Lenkung und optionaler Luftfederung (Avant) ist der A4 B9 ein ausgezeichnetes Langstreckenfahrzeug.', 'ASSESSMENT', 'HIGH', 'Langzeittests auto motor und sport, ADAC Autotest', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Ford Kuga III
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_kuga3_adv1', 'gen_ford_kuga_mk3', 'ADVANTAGE', 'Grosszuegiges Platzangebot', 'Mit einem der groessten Kofferraeume im Kompakt-SUV-Segment und variabler Rueckbank bietet der Kuga III viel Praxisnutzen fuer Familien.', 'SPECIFICATION', 'HIGH', 'Messwerte ADAC, Vergleichstests SUV-Segment', 'PUBLISHED', NOW(), NOW()),
('kn_kuga3_dis1', 'gen_ford_kuga_mk3', 'DISADVANTAGE', 'PHEV-Rueckruf wegen Brandgefahr', 'Die PHEV-Version wurde 2021 wegen moeglicher Ueberhitzung der Hochvoltbatterie zurueckgerufen. Ford hat die betroffenen Batterien getauscht, aber der Vorfall belastet den Wiederverkaufswert.', 'SPECIFICATION', 'HIGH', 'Offizieller Rueckruf Ford, KBA-Rueckrufdatenbank', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Hyundai Tucson NX4
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_nx4_adv1', 'gen_hy_tucson_nx4', 'ADVANTAGE', 'Umfangreiche Serienausstattung', 'Bereits in der Basisversion sind LED-Scheinwerfer, digitales Cockpit, Klimaautomatik und zahlreiche Assistenzsysteme serienmaeassig verbaut. Gutes Preis-Leistungs-Verhaeltnis.', 'SPECIFICATION', 'HIGH', 'Ausstattungsvergleich mit Wettbewerbern im ADAC Autotest', 'PUBLISHED', NOW(), NOW()),
('kn_nx4_dis1', 'gen_hy_tucson_nx4', 'DISADVANTAGE', 'DCT-Getriebe mit Anfahrschwaeeche', 'Das 7-Gang-Doppelkupplungsgetriebe zeigt bei manchen Fahrern Anfahrschwaeche und Unsicherheiten im Kriechgang. Fuer Stadtverkehr mit viel Stop-and-Go kann das stoerend sein.', 'MARKET_SIGNAL', 'MEDIUM', 'Nutzerfeedback, Vergleich mit Wandlerautomatik der Konkurrenz', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Toyota RAV4 XA50
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_rav4_adv1', 'gen_toy_rav4_xa50', 'ADVANTAGE', 'Bewaehrter Hybridantrieb', 'Toyotas Hybrid-System gilt als eines der zuverlaessigsten am Markt. Niedrige Verbrauchswerte im Realverbrauch, kaum wartungsbeduerftig, Batterie haelt in der Regel ein Autoleben lang.', 'ASSESSMENT', 'HIGH', 'ADAC-Pannenstatistik, TUeV-Report, Toyota-Langzeiterfahrung seit Prius', 'PUBLISHED', NOW(), NOW()),
('kn_rav4_dis1', 'gen_toy_rav4_xa50', 'DISADVANTAGE', 'CVT-Geraeuschentwicklung', 'Das stufenlose Getriebe (CVT) erzeugt bei starker Beschleunigung ein deutlich hoerbares Aufheulen des Motors. Fuer sportliches Fahren nicht ideal.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmende Testberichte, systembedingt bei CVT-Getrieben', 'PUBLISHED', NOW(), NOW()),
('kn_rav4_rel1', 'gen_toy_rav4_xa50', 'RELIABILITY', 'Ueberdurchschnittliche Zuverlaessigkeit', 'Der RAV4 Hybrid belegt in TUeV-Report und ADAC-Pannenstatistik regelmaessig vordere Plaetze. Die Ausfallrate liegt deutlich unter dem Klassenschnitt.', 'ASSESSMENT', 'HIGH', 'TUeV-Report 2023/2024, ADAC-Pannenstatistik', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Skoda Octavia NX
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_octavia_adv1', 'gen_sk_octavia_nx', 'ADVANTAGE', 'Groesstes Platzangebot der Klasse', 'Der Octavia Combi bietet mit 640 Litern Kofferraumvolumen mehr Platz als viele Mittelklasse-Kombis. Beinfreiheit hinten auf Oberklasse-Niveau.', 'SPECIFICATION', 'HIGH', 'ADAC-Messwerte, Vergleich mit Golf Variant, Focus Turnier', 'PUBLISHED', NOW(), NOW()),
('kn_octavia_dis1', 'gen_sk_octavia_nx', 'DISADVANTAGE', 'Softwareprobleme beim Infotainment', 'In den ersten Baujahren kam es zu Software-Haengern, Verbindungsabbruechen bei Android Auto/Apple CarPlay und langsamer Systemreaktion. Updates haben die Situation verbessert.', 'MARKET_SIGNAL', 'MEDIUM', 'MQB-evo-Plattform-uebergreifendes Problem, VW-Konzern-Software', 'PUBLISHED', NOW(), NOW()),
('kn_octavia_rv1', 'gen_sk_octavia_nx', 'RESALE_VALUE', 'Stabiler Wiederverkaufswert', 'Dank hoher Beliebtheit als Familien- und Firmenwagen haelt der Octavia seinen Wert gut. Besonders der Combi mit DSG und 1.5 TSI ist gefragt.', 'MARKET_SIGNAL', 'HIGH', 'Schwacke-Restwertprognose, DAT-Marktbeobachtung', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Tesla Model 3 Highland
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_m3h_adv1', 'gen_ts_model3_hr', 'ADVANTAGE', 'Herausragende Effizienz', 'Der Model 3 Highland gehoert zu den effizientesten Elektrofahrzeugen am Markt. Reale Reichweiten von 450+ km sind im Alltag erreichbar.', 'SPECIFICATION', 'HIGH', 'ADAC-Ecotest, Herstellerangaben WLTP, unabhaengige Messungen', 'PUBLISHED', NOW(), NOW()),
('kn_m3h_dis1', 'gen_ts_model3_hr', 'DISADVANTAGE', 'Service-Infrastruktur duenn', 'Tesla verfuegt in Deutschland ueber weniger Servicezentren als etablierte Hersteller. Wartezeiten fuer Termine koennen laenger ausfallen, Mobile Service deckt nicht alles ab.', 'MARKET_SIGNAL', 'MEDIUM', 'Vergleich Service-Netzwerk Tesla vs. BMW/Mercedes/VW', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Porsche Cayenne E3
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_caye3_adv1', 'gen_por_cayenne_e3', 'ADVANTAGE', 'Sportwagen-Dynamik im SUV', 'Der Cayenne verbindet SUV-Nutzwert mit Sportwagen-Handling. Aktive Wankstabilisierung und Hinterachslenkung machen ihn zum dynamischsten Fahrzeug seiner Klasse.', 'ASSESSMENT', 'HIGH', 'Vergleichstests sport auto, auto motor und sport', 'PUBLISHED', NOW(), NOW()),
('kn_caye3_dis1', 'gen_por_cayenne_e3', 'DISADVANTAGE', 'Sehr hohe Unterhaltskosten', 'Versicherung, Wartung und Verschleissteile liegen weit ueber dem Segment-Durchschnitt. Bremsen, Reifen und Inspektion koennen schnell vierstellige Betraege erreichen.', 'SPECIFICATION', 'HIGH', 'ADAC-Unterhaltskostenvergleich, Schwacke', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Opel Corsa F
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_corsaf_adv1', 'gen_opel_corsa_f', 'ADVANTAGE', 'Elektrische Variante ohne Aufpreis-Optik', 'Der Corsa-e sieht identisch aus wie die Verbrenner-Version. Elektromobilitaet ohne Exoten-Status, alltagstaugliche 340 km WLTP-Reichweite.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, ADAC-Ecotest', 'PUBLISHED', NOW(), NOW()),
('kn_corsaf_ev1', 'gen_opel_corsa_f', 'EVERYDAY_USE', 'Kompakte Masse fuer die Stadt', 'Mit 4,06 m Laenge ist der Corsa F ideal fuer Stadtverkehr und enge Parkluecken. Die Uebersichtlichkeit ist gut, Wendekreis klassentypisch.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, Praxiserfahrung', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Renault Captur II
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_captur2_adv1', 'gen_ren_captur2', 'ADVANTAGE', 'Verschiebbare Rueckbank', 'Die um 16 cm laengsverschiebbare Rueckbank ist ein Alleinstellungsmerkmal. Je nach Bedarf mehr Kofferraum oder mehr Beinfreiheit hinten.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, einzigartiges Feature im Segment', 'PUBLISHED', NOW(), NOW()),
('kn_captur2_dis1', 'gen_ren_captur2', 'DISADVANTAGE', 'Hartplastik im unteren Innenraum', 'Unterhalb der Guertellinie dominiert Hartplastik. Im direkten Vergleich mit VW T-Cross oder Skoda Kamiq wirkt der Innenraum weniger wertig.', 'ASSESSMENT', 'MEDIUM', 'Vergleichstests Kleinwagen-SUV, ADAC Autotest', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Honda Civic XI
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_civic11_adv1', 'gen_civic_11', 'ADVANTAGE', 'Herausragender e:HEV-Hybridantrieb', 'Der Honda e:HEV kombiniert Effizienz mit sportlichem Ansprechverhalten. Im Stadtverkehr faehrt der Civic ueberwiegend elektrisch, auf der Autobahn uebernimmt der Verbrenner direkt.', 'ASSESSMENT', 'HIGH', 'Vergleichstests, eigenstaendiges Hybrid-Konzept gegenueber Toyota', 'PUBLISHED', NOW(), NOW()),
('kn_civic11_dis1', 'gen_civic_11', 'DISADVANTAGE', 'Eingeschraenktes Haendlernetz', 'Honda hat in Deutschland ein vergleichsweise duennes Haendlernetz. Werkstatttermine und Ersatzteilversorgung koennen regional schwieriger sein als bei VW oder BMW.', 'MARKET_SIGNAL', 'MEDIUM', 'Vergleich Haendlerdichte Honda vs. VW/BMW/Mercedes', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Volvo XC40
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_xc40_adv1', 'gen_volvo_xc40_1', 'ADVANTAGE', 'Fuenf Sterne Euro NCAP mit Bestnoten', 'Der XC40 erreichte im Euro-NCAP-Crashtest eine der hoechsten Gesamtwertungen seiner Klasse. Besonders bei Fussgaengerschutz und Assistenzsystemen herausragend.', 'SPECIFICATION', 'HIGH', 'Euro-NCAP-Testergebnis, offizielle Bewertung', 'PUBLISHED', NOW(), NOW()),
('kn_xc40_dis1', 'gen_volvo_xc40_1', 'DISADVANTAGE', 'Kofferraum kleiner als Wettbewerb', 'Mit 452 Litern bietet der XC40 weniger Kofferraum als BMW X1, Audi Q3 oder Mercedes GLA. Die hohe Ladekante erschwert das Beladen zusaetzlich.', 'SPECIFICATION', 'MEDIUM', 'ADAC-Messwerte, Vergleich Kompakt-SUV-Segment', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Ford Focus Mk4
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_focusmk4_adv1', 'gen_ford_focus_mk4', 'ADVANTAGE', 'Bestes Fahrwerk der Kompaktklasse', 'Der Focus Mk4 gilt in der Fachpresse als fahrdynamisch bestes Auto seiner Klasse. Praezise Lenkung, guter Federungskomfort, hervorragendes Kurvenverhalten.', 'ASSESSMENT', 'HIGH', 'auto motor und sport Best Cars, Vergleichstests Kompaktklasse', 'PUBLISHED', NOW(), NOW()),
('kn_focusmk4_dis1', 'gen_ford_focus_mk4', 'DISADVANTAGE', 'Auslaufendes Modell ab 2025', 'Ford hat das Produktionsende des Focus angekuendigt. Langfristig koennte die Ersatzteilversorgung schwieriger und die Werkstattkompetenz geringer werden.', 'SPECIFICATION', 'HIGH', 'Offizielle Ford-Ankuendigung Produktionsende Saarlouis', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Dacia Sandero III
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_sandero3_adv1', 'gen_dacia_sandero3', 'ADVANTAGE', 'Guenstigstes Neufahrzeug am Markt', 'Der Sandero bietet ein unschlagbares Preis-Leistungs-Verhaeltnis. Moderne CMF-B-Plattform (wie Renault Clio V), LED-Licht und Smartphone-Integration ab Basisversion.', 'SPECIFICATION', 'HIGH', 'Preisvergleich Neuwagen, gemeinsame Plattform mit Renault Clio V', 'PUBLISHED', NOW(), NOW()),
('kn_sandero3_dis1', 'gen_dacia_sandero3', 'DISADVANTAGE', 'Eingeschraenkte Sicherheitsausstattung Basis', 'In der Basisversion fehlen einige Assistenzsysteme, die bei Wettbewerbern Standard sind. Euro-NCAP vergibt nur 2 Sterne fuer die Einstiegsversion.', 'SPECIFICATION', 'HIGH', 'Euro-NCAP-Testergebnis, Ausstattungsvergleich', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VW Tiguan AD
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_tigad_adv1', 'gen_vw_tiguan_ad', 'ADVANTAGE', 'Meistverkauftes SUV Europas', 'Hohe Verbreitung bedeutet gute Ersatzteilversorgung, breites Zubehoer-Angebot und stabilen Wiederverkaufswert. Jede Werkstatt kennt das Fahrzeug.', 'MARKET_SIGNAL', 'HIGH', 'KBA-Zulassungszahlen, Schwacke-Restwertprognose', 'PUBLISHED', NOW(), NOW()),
('kn_tigad_dis1', 'gen_vw_tiguan_ad', 'DISADVANTAGE', 'Wasserpumpe als Schwachstelle', 'Die Wasserpumpe am EA888-Motor neigt zu Undichtigkeiten. Bei Gebrauchtfahrzeugen auf Kuehlmittelverlust und feuchte Stellen am Motor achten.', 'MARKET_SIGNAL', 'MEDIUM', 'ADAC-Pannenstatistik, bekannte EA888-Schwachstelle', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Mazda CX-5 KF
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_cx5_adv1', 'gen_cx5_2', 'ADVANTAGE', 'Hochwertiges Interieur ohne Aufpreis', 'Mazda positioniert sich premium, ohne Premium-Preise zu verlangen. Materialqualitaet, Verarbeitung und Haptik im Innenraum liegen ueber dem Klassenschnitt.', 'ASSESSMENT', 'HIGH', 'Vergleichstests Kompakt-SUV, ADAC Autotest', 'PUBLISHED', NOW(), NOW()),
('kn_cx5_dis1', 'gen_cx5_2', 'DISADVANTAGE', 'Kein Hybrid oder Elektro-Option', 'Im Gegensatz zu Toyota RAV4 oder Ford Kuga bietet der CX-5 keinen Hybridantrieb. Nur klassische Benziner und Diesel, was fuer Dienstwagenfahrer steuerlich nachteilig sein kann.', 'SPECIFICATION', 'HIGH', 'Motorenpalette Mazda CX-5, Vergleich mit Wettbewerbern', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Peugeot 3008 II
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_3008_adv1', 'gen_3008_2', 'ADVANTAGE', 'Aussergewoehnliches i-Cockpit', 'Das kleine Lenkrad in Kombination mit dem hochgesetzten Instrumententraeger bietet ein einzigartiges Fahrgefuehl. Nach Eingewoehnung bevorzugen es viele Fahrer.', 'ASSESSMENT', 'MEDIUM', 'Testberichte, polarisierendes aber innovatives Bedienkonzept', 'PUBLISHED', NOW(), NOW()),
('kn_3008_dis1', 'gen_3008_2', 'DISADVANTAGE', 'EAT8-Automatik nicht immer feinfuehlig', 'Das 8-Gang-Automatikgetriebe schaltet bei niedrigem Tempo manchmal unentschlossen und kann bei Rangiermanoevern rucken.', 'MARKET_SIGNAL', 'MEDIUM', 'Nutzerfeedback, Vergleich mit ZF-8HP bei BMW/Mercedes', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Kia EV6
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_ev6_adv1', 'gen_kia_ev6_cv', 'ADVANTAGE', 'Ultraschnelles 800V-Laden', 'Mit 800V-Architektur laedt der EV6 an entsprechenden Sauelen in 18 Minuten von 10 auf 80 Prozent. Damit ist er fuer Langstrecken mit Ladestopps sehr gut geeignet.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, unabhaengige Lademessungen ADAC', 'PUBLISHED', NOW(), NOW()),
('kn_ev6_dis1', 'gen_kia_ev6_cv', 'DISADVANTAGE', 'Hoher Verbrauch auf der Autobahn', 'Bei konstant hohen Geschwindigkeiten (130+ km/h) steigt der Verbrauch ueberproportional. Reale Autobahnreichweite kann 30-40% unter dem WLTP-Wert liegen.', 'ASSESSMENT', 'MEDIUM', 'ADAC-Ecotest, Verbrauchsmessungen bei hoeheren Geschwindigkeiten', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- MINI Cooper F56
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_f56_adv1', 'gen_mini_cooper_f56', 'ADVANTAGE', 'Go-Kart-Feeling', 'Der MINI Cooper lebt seinen Markenkern: Direktes Einlenkverhalten, straffes Fahrwerk und kompakte Abmessungen machen ihn zum spassigsten Kleinwagen am Markt.', 'ASSESSMENT', 'HIGH', 'Einhellige Bewertung Fachpresse, Markenkern seit 1959', 'PUBLISHED', NOW(), NOW()),
('kn_f56_dis1', 'gen_mini_cooper_f56', 'DISADVANTAGE', 'BMW-Preise im Kleinwagen', 'Sowohl Anschaffung als auch Unterhalt liegen deutlich ueber vergleichbaren Kleinwagen. Ersatzteile auf BMW-Preisniveau, nicht auf Kleinwagen-Niveau.', 'SPECIFICATION', 'HIGH', 'ADAC-Unterhaltskostenvergleich, Schwacke', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- VW ID.3 E11
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_id3_adv1', 'gen_vw_id3_e1', 'ADVANTAGE', 'Grosser Wendekreis-Vorteil', 'Dank Hinterradantrieb und fehlender Antriebswellen vorn bietet der ID.3 einen extrem kleinen Wendekreis von nur 10,2 m. Ideal fuer die Stadt.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, konzeptbedingter Vorteil', 'PUBLISHED', NOW(), NOW()),
('kn_id3_dis1', 'gen_vw_id3_e1', 'DISADVANTAGE', 'Softwareprobleme in fruehen Baujahren', 'Die ersten Auslieferungen ab 2020 litten unter Softwarefehlern: unzuverlaessiges OTA-Update, Infotainment-Abstuerze, fehlerhafte Ladesteuerung. Ab 2023 deutlich verbessert.', 'MARKET_SIGNAL', 'HIGH', 'Medienberichte, VW-eigene Eingestaendnisse zur Software', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Fiat 500e
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_500e_adv1', 'gen_500e_1', 'ADVANTAGE', 'Italienisches Design als Alleinstellungsmerkmal', 'Der Fiat 500e verbindet Retro-Charme mit modernem Elektroantrieb. In der Stadt ein Hingucker, der Lifestyle-Faktor ist hoeher als bei jedem Wettbewerber.', 'ASSESSMENT', 'HIGH', 'Designpreise, hohe Markenbekanntheit', 'PUBLISHED', NOW(), NOW()),
('kn_500e_ev1', 'gen_500e_1', 'CITY_USE', 'Perfektes Stadtauto', 'Mit 3,63 m Laenge, 320 km WLTP-Reichweite und One-Pedal-Driving ist der 500e ideal fuer den reinen Stadtbetrieb dimensioniert.', 'SPECIFICATION', 'HIGH', 'Herstellerangaben, Abmessungen', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Toyota Yaris XP210
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_yaris_adv1', 'gen_toy_yaris_xp210', 'ADVANTAGE', 'Extrem niedriger Realverbrauch', 'Der Yaris Hybrid erreicht im Stadtverkehr reale Verbrauchswerte von 3,5-4,0 l/100 km. Er ist das sparsamste Nicht-Elektrofahrzeug seiner Klasse.', 'ASSESSMENT', 'HIGH', 'ADAC-Ecotest, Spritmonitor-Daten', 'PUBLISHED', NOW(), NOW()),
('kn_yaris_dis1', 'gen_toy_yaris_xp210', 'DISADVANTAGE', 'Eingeschraenkter Kofferraum', 'Die Hybridbatterie unter dem Kofferraum reduziert das Ladevolumen auf nur 286 Liter. Fuer groessere Einkaeufe oder Urlaubsgepaeck wird es eng.', 'SPECIFICATION', 'HIGH', 'ADAC-Messwerte, Vergleich mit Polo, Corsa', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Porsche 911 992
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_992_adv1', 'gen_por_911_992', 'ADVANTAGE', 'Klassenloser Alltags-Sportwagen', 'Der 992 ist schneller denn je und gleichzeitig komfortabler. Er laesst sich problemlos taeglich fahren, bietet einen brauchbaren Kofferraum vorn und gute Uebersichtlichkeit.', 'ASSESSMENT', 'HIGH', 'Langzeittests sport auto, auto motor und sport', 'PUBLISHED', NOW(), NOW()),
('kn_992_rv1', 'gen_por_911_992', 'RESALE_VALUE', 'Herausragende Wertstabilitaet', 'Der 911 verliert prozentual weniger an Wert als fast jedes andere Serienauto. Besonders gefragte Versionen (GT3, Sport Classic) koennen sogar im Wert steigen.', 'MARKET_SIGNAL', 'HIGH', 'Schwacke-Restwertprognose, Marktbeobachtung Classic Data', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Mercedes E-Klasse W213
-- ============================================================
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_w213_adv1', 'gen_mb_e_w213', 'ADVANTAGE', 'Bester Langstreckenkomfort der Klasse', 'Die E-Klasse W213 ist der Inbegriff des Langstrecken-Komforts: Leise, bequem, mit hervorragender Klimaanlage und guter Geraeuschaaemmung.', 'ASSESSMENT', 'HIGH', 'Langzeittests, Vergleichstests Oberklasse', 'PUBLISHED', NOW(), NOW()),
('kn_w213_long1', 'gen_mb_e_w213', 'LONG_DISTANCE', 'Ideal fuer Vielfahrer', 'Dieselmotoren mit niedrigem Autobahn-Verbrauch, grosser Tank und MBUX mit Online-Navigation machen die W213 zur idealen Wahl fuer Pendler und Vielfahrer.', 'ASSESSMENT', 'HIGH', 'Praxisberichte, Firmenwagen-Rankings', 'PUBLISHED', NOW(), NOW()) ON CONFLICT DO NOTHING;

COMMIT;
