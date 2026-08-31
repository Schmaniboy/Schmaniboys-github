-- Seed: KnowledgeNote Runde 2 — Weitere populaere Generationen
-- Quelle: Oeffentlich dokumentierte Fahrzeugeigenschaften (ADAC, Fachpresse, Herstellerangaben)

BEGIN;

-- Audi A3 8Y
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_a3_8y_adv1', 'gen_audi_a3_8y', 'ADVANTAGE', 'Modernes Infotainment mit virtuellem Cockpit', 'Das digitale Cockpit und MBUX-aehnliche Bedienung bieten eine der modernsten Infotainment-Erfahrungen im Kompaktsegment. Drahtloses Apple CarPlay und Android Auto serienmassig ab 2021.', 'SPECIFICATION', 'HIGH', 'Offizielle Audi-Ausstattungslisten und Fachpresse-Tests bestaetigen dies', 'PUBLISHED', NOW(), NOW()),
('kn_a3_8y_adv2', 'gen_audi_a3_8y', 'ADVANTAGE', 'Gute Verarbeitungsqualitaet', 'Die Verarbeitung im Innenraum liegt deutlich ueber dem Segmentdurchschnitt mit hochwertigen Materialien an den Kontaktstellen. Der Kofferraum fasst 380 Liter (Sportback).', 'ASSESSMENT', 'HIGH', 'Uebereinstimmend in Tests von Auto Motor Sport, ADAC und Autozeitung bewertet', 'PUBLISHED', NOW(), NOW()),
('kn_a3_8y_dis1', 'gen_audi_a3_8y', 'DISADVANTAGE', 'Aufpreispolitik fuer Basisausstattungen', 'Viele als selbstverstaendlich empfundene Features wie LED-Scheinwerfer, Sitzheizung oder Navigationssystem sind nur gegen Aufpreis erhaeltlich. Der Grundpreis wirkt guenstiger, als die Realkosten.', 'ASSESSMENT', 'HIGH', 'Preislisten und Konfigurator-Analysen zeigen hohe Aufpreise', 'PUBLISHED', NOW(), NOW()),
('kn_a3_8y_dis2', 'gen_audi_a3_8y', 'DISADVANTAGE', 'Eingeschraenkte Uebersichtlichkeit', 'Die flache Dachlinle und die hohe Guertellinie schraenken die Sicht nach hinten ein. Einparkhilfe und Rueckfahrkamera sind dringend empfehlenswert.', 'ASSESSMENT', 'MEDIUM', 'Aus Fahrberichten und ADAC-Tests uebereinstimmend berichtet', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 1er F40
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_1er_f40_adv1', 'gen_bmw_1er_f40', 'ADVANTAGE', 'Agiles Fahrverhalten trotz Frontantrieb', 'Trotz des Wechsels auf die UKL-Frontantriebs-Plattform bietet der F40 ein ueberraschend agiles Fahrverhalten mit praeziser Lenkung. Die xDrive-Varianten haben ein ARB-System zur Torque Vectoring.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmend in Fachpresse-Tests gelobt (Auto Motor Sport, sport auto)', 'PUBLISHED', NOW(), NOW()),
('kn_1er_f40_adv2', 'gen_bmw_1er_f40', 'ADVANTAGE', 'Groesseres Platzangebot als Vorgaenger', 'Durch die Frontantriebsarchitektur bietet der F40 deutlich mehr Platz im Fond und Kofferraum (380 Liter) als der heckgetriebene Vorgaenger F20.', 'SPECIFICATION', 'HIGH', 'Technische Daten BMW, Vergleichstests in Fachpresse', 'PUBLISHED', NOW(), NOW()),
('kn_1er_f40_dis1', 'gen_bmw_1er_f40', 'DISADVANTAGE', 'Kein Heckantrieb mehr', 'Traditionelle BMW-Fahrer vermissen den Heckantrieb des Vorgaengers. Der Umstieg auf Frontantrieb (UKL-Plattform) veraendert den Charakter des Fahrzeugs fundamental.', 'ASSESSMENT', 'HIGH', 'Bekannter Kritikpunkt seit Markteinfuehrung, vielfach in Fachpresse diskutiert', 'PUBLISHED', NOW(), NOW()),
('kn_1er_f40_dis2', 'gen_bmw_1er_f40', 'DISADVANTAGE', 'Sportliche Versionen nur als M135i', 'Mit dem Wegfall des M140i mit Reihensechszylinder gibt es nur noch den Vierzylinder-M135i als Spitzenmodell. Weniger differenzierend im Performance-Segment.', 'SPECIFICATION', 'HIGH', 'BMW-Modellprogramm, Vergleich mit Vorgaenger F20 M140i', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X5 G05
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_x5_g05_adv1', 'gen_bmw_x5_g05', 'ADVANTAGE', 'Souveraener Langstreckenkomfort', 'Der X5 G05 bietet eines der besten Komfort-Niveaus im Segment der grossen SUVs. Die optionale Luftfederung und das adaptive Fahrwerk sorgen fuer hervorragendes Ansprechverhalten.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmend in Langstreckentests von ADAC und Auto Motor Sport gelobt', 'PUBLISHED', NOW(), NOW()),
('kn_x5_g05_adv2', 'gen_bmw_x5_g05', 'ADVANTAGE', 'Vielseitiges Motorenprogramm', 'Vom effizienten 25d ueber den kraeftigen 40i bis zum M50i und der Plug-in-Hybrid-Variante xDrive45e — fuer jeden Einsatzzweck gibt es eine passende Motorisierung.', 'SPECIFICATION', 'HIGH', 'BMW-Modellprogramm', 'PUBLISHED', NOW(), NOW()),
('kn_x5_g05_dis1', 'gen_bmw_x5_g05', 'DISADVANTAGE', 'Hohe Unterhaltskosten', 'Versicherung, Wartung und Verschleissteile liegen deutlich ueber dem Durchschnitt. Bremsen und Reifen in grossen Dimensionen sind kostspielig.', 'ASSESSMENT', 'HIGH', 'ADAC-Kostenrechner, Versicherungseinstufung, Ersatzteilpreise', 'PUBLISHED', NOW(), NOW()),
('kn_x5_g05_dis2', 'gen_bmw_x5_g05', 'DISADVANTAGE', 'Hoher Verbrauch bei V8 und M-Modellen', 'Der xDrive50i (V8) und der M50i verbrauchen real 12-15 Liter/100km. Auch der 40i liegt bei 10-12 Liter. Nur der 25d und der PHEV sind sparsamer.', 'ASSESSMENT', 'HIGH', 'Spritmonitor.de Nutzerdaten und Fachpresse-Verbrauchsmessungen', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes A-Klasse W177
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_w177_adv1', 'gen_mb_a_w177', 'ADVANTAGE', 'Bestes Infotainment im Segment', 'Das MBUX-System mit Sprachsteuerung (Hey Mercedes) setzt Massstabe in der Kompaktklasse. Das optionale Widescreen-Cockpit mit zwei 10,25-Zoll-Displays ist klassenuebergreifend beeindruckend.', 'ASSESSMENT', 'HIGH', 'Vielfach als Referenz im Segment bezeichnet (ADAC, Auto Motor Sport, Autocar)', 'PUBLISHED', NOW(), NOW()),
('kn_w177_adv2', 'gen_mb_a_w177', 'ADVANTAGE', 'Aerodynamisch effizient', 'Mit einem cW-Wert von 0,25 (Limousine) ist die A-Klasse eines der aerodynamischsten Serienfahrzeuge. Das bringt Vorteile bei Verbrauch und Windgeraeusche auf der Autobahn.', 'SPECIFICATION', 'HIGH', 'Mercedes-Presseinformation, Windkanal-Messwerte', 'PUBLISHED', NOW(), NOW()),
('kn_w177_dis1', 'gen_mb_a_w177', 'DISADVANTAGE', 'Straffe Federung im Sportfahrwerk', 'Mit dem optionalen Sportfahrwerk oder AMG-Line-Paket kann die A-Klasse auf kurzen Bodenwellen unkomfortabel straff sein. Die Basisabstimmung ist komfortabler.', 'ASSESSMENT', 'MEDIUM', 'Aus Fahrberichten und Nutzerfeedback bekannt', 'PUBLISHED', NOW(), NOW()),
('kn_w177_dis2', 'gen_mb_a_w177', 'DISADVANTAGE', 'Fond- und Kofferraumplatz eingeschraenkt', 'Die sportliche Dachlinie begrenzt die Kopffreiheit im Fond. Der Kofferraum fasst 370 Liter — akzeptabel, aber weniger als bei Golf oder Focus.', 'SPECIFICATION', 'HIGH', 'Technische Daten, Vergleichsmessungen in Fachpresse', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Hyundai IONIQ 5
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_ioniq5_adv1', 'gen_hy_ioniq5_ne', 'ADVANTAGE', 'Ultraschnelles 800V-Laden', 'Mit der 800-Volt-Architektur laedt der IONIQ 5 an HPC-Sauelen von 10% auf 80% in ca. 18 Minuten. Das ist eine der schnellsten Ladezeiten im Markt.', 'SPECIFICATION', 'HIGH', 'Hyundai-Spezifikation, vielfach in Ladetests bestaetigt (ADAC, Autostrom)', 'PUBLISHED', NOW(), NOW()),
('kn_ioniq5_adv2', 'gen_hy_ioniq5_ne', 'ADVANTAGE', 'Grosszuegiger Innenraum dank E-GMP', 'Die dedizierte Elektro-Plattform E-GMP erlaubt einen flachen Boden und einen Radstand von 3.000 mm. Der Innenraum ist groesser als bei vielen Fahrzeugen der naechsthoeheren Klasse.', 'SPECIFICATION', 'HIGH', 'Hyundai-Technikdaten, Vergleichsmessungen', 'PUBLISHED', NOW(), NOW()),
('kn_ioniq5_dis1', 'gen_hy_ioniq5_ne', 'DISADVANTAGE', 'Hoher Verbrauch bei Autobahnfahrten', 'Bei konstant 130 km/h liegt der Verbrauch bei 22-25 kWh/100km, was die reale Autobahnreichweite auf ca. 300 km begrenzt (77,4 kWh Akku).', 'ASSESSMENT', 'HIGH', 'ADAC EcoTest, Spritmonitor.de Nutzerdaten, Fachpresse-Messungen', 'PUBLISHED', NOW(), NOW()),
('kn_ioniq5_dis2', 'gen_hy_ioniq5_ne', 'DISADVANTAGE', 'Eingeschraenkte Software-Updates OTA', 'Im Vergleich zu Tesla sind OTA-Updates begrenzter. Viele Updates erfordern einen Werkstattbesuch. Hyundai hat dies mit neueren Softwarestaenden verbessert.', 'ASSESSMENT', 'MEDIUM', 'Nutzererfahrungen und Vergleichstests', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Taycan Y1A
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_taycan_adv1', 'gen_por_taycan_y1a', 'ADVANTAGE', 'Herausragende Fahrdynamik', 'Der Taycan bietet Porsche-typische Fahrdynamik mit extrem praeziser Lenkung, hervorragender Balance und beeindruckender Bremsleistung. Das 2-Gang-Getriebe an der Hinterachse ist einzigartig.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmend in allen Fachpresse-Tests als Referenz im E-Auto-Segment bezeichnet', 'PUBLISHED', NOW(), NOW()),
('kn_taycan_adv2', 'gen_por_taycan_y1a', 'ADVANTAGE', 'Reproduzierbare Spitzenleistung', 'Anders als viele E-Autos liefert der Taycan seine Spitzenleistung wiederholbar ab — auch nach mehreren Launch-Control-Starts in Folge, dank 800-Volt-Architektur und aktivem Kuehlsystem.', 'SPECIFICATION', 'HIGH', 'Porsche-Technikdaten, Tests von sport auto und Motor Trend', 'PUBLISHED', NOW(), NOW()),
('kn_taycan_dis1', 'gen_por_taycan_y1a', 'DISADVANTAGE', 'Hoher Anschaffungspreis', 'Der Einstiegspreis des Taycan liegt deutlich ueber dem Wettbewerb (Tesla Model S, BMW i4). Die volle Ausstattung kann den Preis leicht verdoppeln.', 'SPECIFICATION', 'HIGH', 'Porsche-Preisliste und Konfigurator', 'PUBLISHED', NOW(), NOW()),
('kn_taycan_dis2', 'gen_por_taycan_y1a', 'DISADVANTAGE', 'Ladeinfrastruktur-Abhaengigkeit', 'Obwohl der Taycan schnell laden kann (270 kW Peak), ist er bei Langstrecken auf HPC-Sauelen angewiesen. An aelteren 50-kW-Saulen dauert das Laden deutlich laenger als erhofft.', 'ASSESSMENT', 'MEDIUM', 'Allgemeiner E-Auto-Sachverhalt, verstaerkt durch die Positionierung als Langstreckenfahrzeug', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Tesla Model Y (ergaenzend — hat schon 0 Notes direkt, aber gen_ts_modely_1 hatte 0 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_modely_adv1', 'gen_ts_modely_1', 'ADVANTAGE', 'OTA-Updates erweitern Funktionsumfang', 'Tesla liefert regelmaessig Over-the-Air-Updates, die neue Funktionen, Leistungssteigerungen und Verbesserungen bringen. Das Fahrzeug wird nach dem Kauf besser statt aelter.', 'SPECIFICATION', 'HIGH', 'Tesla-Update-Historie, oeffentlich dokumentiert', 'PUBLISHED', NOW(), NOW()),
('kn_modely_adv2', 'gen_ts_modely_1', 'ADVANTAGE', 'Niedrige Betriebskosten', 'Stromkosten liegen deutlich unter Benzin/Diesel. Wenige Verschleissteile, kaum Wartung noetig. Versicherung je nach Modell und Region guenstig bis mittel.', 'ASSESSMENT', 'HIGH', 'ADAC-Kostenvergleich, Spritmonitor.de Nutzerdaten', 'PUBLISHED', NOW(), NOW()),
('kn_modely_dis1', 'gen_ts_modely_1', 'DISADVANTAGE', 'Verarbeitungsqualitaet unter Premium-Niveau', 'Spaltmasse, Lackqualitaet und Innenraummaterialien entsprechen nicht dem Premium-Anspruch vergleichbarer Preisklassen. Tesla hat die Qualitaet stetig verbessert, liegt aber hinter BMW, Mercedes und Audi.', 'ASSESSMENT', 'HIGH', 'Vielfach in Fachpresse und Nutzerbewertungen dokumentiert', 'PUBLISHED', NOW(), NOW()),
('kn_modely_dis2', 'gen_ts_modely_1', 'DISADVANTAGE', 'Eingeschraenkter Service und Ersatzteilversorgung', 'Tesla-Servicecenter sind seltener als klassische Markenwerkstaetten. Wartezeiten fuer Termine und Ersatzteile koennen laenger sein als bei etablierten Herstellern.', 'ASSESSMENT', 'MEDIUM', 'ADAC-Pannenhilfe-Erfahrungen, Nutzerfeedback', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Volvo XC40 (ergaenzend — hat schon 2 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_xc40_adv1', 'gen_volvo_xc40_1', 'ADVANTAGE', 'Fuenf Sterne Euro NCAP mit hervorragenden Werten', 'Der XC40 erreicht Spitzenwerte in allen Kategorien des Euro-NCAP-Crashtests. Die aktiven und passiven Sicherheitssysteme von Volvo setzen weiterhin Massstabe im Segment.', 'SPECIFICATION', 'HIGH', 'Euro NCAP Testergebnisse 2018', 'PUBLISHED', NOW(), NOW()),
('kn_xc40_dis1', 'gen_volvo_xc40_1', 'DISADVANTAGE', 'Infotainment-Bedienung gewoehnungsbeduerftig', 'Das Google-basierte Infotainment ab 2022 (Android Automotive OS) bietet keine Apple-CarPlay-Unterstuetzung. Die Bedienung ueber den Touchscreen waehrend der Fahrt ist teilweise umstaendlich.', 'ASSESSMENT', 'MEDIUM', 'Bekannter Kritikpunkt in Fachpresse-Tests, Volvo hat auf Nachfrage Apple CarPlay spaeter nachgeliefert', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia EV6 (ergaenzend — hat schon 2 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_ev6_adv1', 'gen_kia_ev6_cv', 'ADVANTAGE', '800V-Laden und Vehicle-to-Load (V2L)', 'Wie der IONIQ 5 laedt der EV6 mit bis zu 240 kW an HPC-Sauelen. Zusaetzlich kann er ueber V2L externe Geraete mit bis zu 3,6 kW versorgen — ideal fuer Camping oder Baustellen.', 'SPECIFICATION', 'HIGH', 'Kia-Spezifikation, ADAC-Ladetests', 'PUBLISHED', NOW(), NOW()),
('kn_ev6_dis1', 'gen_kia_ev6_cv', 'DISADVANTAGE', 'Eingeschraenkte Anhaengelast', 'Die maximale Anhaengelast liegt bei 1.600 kg (gebremst) — weniger als bei vergleichbar grossen Verbrenner-SUVs. Fuer schwere Anhaenger nicht ideal.', 'SPECIFICATION', 'MEDIUM', 'Kia-Technikdaten, Vergleich mit Segmentwettbewerbern', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Kia Sportage NQ5 (hat 0 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_sportage_adv1', 'gen_kia_sportage_nq5', 'ADVANTAGE', 'Herausragendes Platzangebot', 'Der Sportage NQ5 bietet mit 591 Litern Kofferraumvolumen und grosszuegigem Fond eines der besten Platzangebote im Kompakt-SUV-Segment.', 'SPECIFICATION', 'HIGH', 'Kia-Technikdaten, ADAC-Messwerte', 'PUBLISHED', NOW(), NOW()),
('kn_sportage_adv2', 'gen_kia_sportage_nq5', 'ADVANTAGE', '7 Jahre Herstellergarantie', 'Die branchenweit laengste Herstellergarantie von 7 Jahren/150.000 km gibt Kaeufern Planungssicherheit und erhoht den Wiederverkaufswert.', 'SPECIFICATION', 'HIGH', 'Kia-Garantiebedingungen', 'PUBLISHED', NOW(), NOW()),
('kn_sportage_dis1', 'gen_kia_sportage_nq5', 'DISADVANTAGE', 'Komplexe Infotainment-Bedienung', 'Die Doppelscreen-Anordnung mit Touchbar-Leiste darunter erfordert Eingewoehnung. Manche Funktionen sind in verschachtelten Menues versteckt.', 'ASSESSMENT', 'MEDIUM', 'Aus Fahrberichten und Nutzerfeedback bekannt', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes GLC X254 (hat 0 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_glc_x254_adv1', 'gen_mb_glc_x254', 'ADVANTAGE', 'Neueste MBUX-Generation mit 11,9-Zoll-Display', 'Der GLC X254 erhaelt das gleiche hochwertige MBUX-System wie die S-Klasse mit grossem Hochkant-Zentraldisplay, natuerlicher Sprachsteuerung und Augmented-Reality-Navigation.', 'SPECIFICATION', 'HIGH', 'Mercedes-Presseinformation, Fachpresse-Tests', 'PUBLISHED', NOW(), NOW()),
('kn_glc_x254_dis1', 'gen_mb_glc_x254', 'DISADVANTAGE', 'Hoher Einstiegspreis', 'Der Grundpreis des GLC X254 liegt deutlich ueber dem Vorgaenger und ueber vielen Wettbewerbern wie BMW X3 oder Audi Q5.', 'SPECIFICATION', 'HIGH', 'Mercedes-Preisliste, Wettbewerbsvergleich', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW X3 G01 (hat 0 Notes)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "evidenceType", confidence, reasoning, status, "publishedAt", "updatedAt") VALUES
('kn_x3_g01_adv1', 'gen_bmw_x3_g01', 'ADVANTAGE', 'Sehr gut abgestimmtes Fahrwerk', 'Der X3 G01 bietet ein hervorragend abgestimmtes Fahrwerk, das Komfort und Sportlichkeit kombiniert. Die optionale adaptive Daempfung erweitert den Einsatzbereich nochmals.', 'ASSESSMENT', 'HIGH', 'Uebereinstimmend in Fachpresse-Tests gelobt', 'PUBLISHED', NOW(), NOW()),
('kn_x3_g01_adv2', 'gen_bmw_x3_g01', 'ADVANTAGE', 'Sparsame Dieselversionen', 'Die 20d-Variante mit 190 PS verbraucht real 6-7 Liter/100km und bietet dennoch ausreichend Leistung. Der 30d mit 286 PS ist trotz seiner Kraft noch vergleichsweise sparsam.', 'ASSESSMENT', 'HIGH', 'Spritmonitor.de Nutzerdaten, ADAC EcoTest', 'PUBLISHED', NOW(), NOW()),
('kn_x3_g01_dis1', 'gen_bmw_x3_g01', 'DISADVANTAGE', 'Teure Extras fuer sinnvolle Ausstattung', 'LED-Scheinwerfer, digitales Cockpit, Navigation und Sitzheizung kosten jeweils Aufpreis. Eine sinnvoll ausgestattete Version liegt schnell 10.000+ Euro ueber dem Basispreis.', 'ASSESSMENT', 'HIGH', 'BMW-Konfigurator und Preisliste', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
