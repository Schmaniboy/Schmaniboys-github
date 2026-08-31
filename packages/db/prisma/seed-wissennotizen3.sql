-- Seed: KnowledgeNote Runde 3 — Weitere populaere Generationen
-- Quelle: ADAC, Fachpresse, Herstellerinformationen, TUeV-Reports
-- Nur oeffentlich dokumentierte, belegbare Informationen

BEGIN;

-- VW Polo VI (AW)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_polo_aw_alltag', 'gen_vw_polo_aw', 'EVERYDAY_USE', 'Kompakt und stadttauglich', 'Der Polo VI bietet fuer seine Klasse ein ueberraschend erwachsenes Fahrverhalten. Die Uebersichtlichkeit ist gut, der Wendekreis kompakt. Das Platzangebot reicht fuer den taeglichen Pendlerverkehr, im Fond wird es bei groesseren Personen aber eng.', 'ADAC Autotest, Auto Motor Sport Dauertest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_polo_aw_zuver', 'gen_vw_polo_aw', 'RELIABILITY', 'Solide Zuverlaessigkeit mit TSI-Einschraenkung', 'Der Polo VI zeigt in der ADAC-Pannenstatistik eine gute Zuverlaessigkeit. Die MPI-Saugmotoren (1.0 MPI) sind besonders robust. Bei den TSI-Turbomotoren gibt es vereinzelt Berichte ueber erhoehten Oelverbrauch bei fruehen Baujahren.', 'ADAC Pannenstatistik 2023, TUeV-Report', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_polo_aw_vorteil', 'gen_vw_polo_aw', 'ADVANTAGE', 'Erwachsenes Fahrgefuehl fuer einen Kleinwagen', 'Der Polo faehrt sich deutlich reifer als die meisten Wettbewerber seiner Klasse. Gute Verarbeitung, ruhiges Fahrwerk, solide Materialien im Innenraum. Gutes Raumangebot im Kofferraum (351 Liter).', 'Auto Motor Sport Vergleichstest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_polo_aw_nachteil', 'gen_vw_polo_aw', 'DISADVANTAGE', 'Hoher Preis und Ausstattungsbereinigung', 'Fuer einen Kleinwagen ist der Polo preislich ambitioniert. Die Basisausstattung wurde mit dem Facelift 2021 bereinigt — viele Features nur noch gegen Aufpreis. Kein adaptives Fahrwerk verfuegbar.', 'ADAC Autotest, Autobild', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- VW T-Roc (A11)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_troc_alltag', 'gen_vw_troc_a1', 'EVERYDAY_USE', 'Praktisches Kompakt-SUV', 'Der T-Roc bietet eine erhoehte Sitzposition und gute Uebersichtlichkeit. Der Kofferraum fasst 392 Liter, die Rueckbank laesst sich umklappen. Fuer Familien mit kleinen Kindern ausreichend, fuer groessere Familien eher knapp.', 'ADAC Autotest, Auto Motor Sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_troc_kauf', 'gen_vw_troc_a1', 'BUYING_ADVICE', 'Empfehlung Style mit 1.5 TSI', 'Die Ausstattungslinie Style bietet das beste Preis-Leistungs-Verhaeltnis. Der 1.5 TSI mit 150 PS ist die ideale Motorisierung — genuegend Leistung bei akzeptablem Verbrauch. DSG empfehlenswert fuer Vielfahrer.', 'ADAC Kaufberatung, Auto Motor Sport', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW()),
('kn_troc_wert', 'gen_vw_troc_a1', 'RESALE_VALUE', 'Stabile Restwerte im SUV-Segment', 'Der T-Roc haelt seinen Wert gut — die hohe Nachfrage im Kompakt-SUV-Segment stuetzt die Restwerte. Besonders gefragt auf dem Gebrauchtwagenmarkt sind Style und R-Line mit DSG.', 'DAT Restwertprognose, Schwacke', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes C-Klasse W206
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_w206_alltag', 'gen_mb_c_w206', 'EVERYDAY_USE', 'Komfortabel und technisch hochwertig', 'Die W206 C-Klasse bietet mit dem neuen Innenraumkonzept und MBUX der zweiten Generation ein deutlich moderneres Erlebnis als der Vorgaenger. Der Komfort ist hoch, die Assistenzsysteme arbeiten zuverlaessig.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_w206_vorteil', 'gen_mb_c_w206', 'ADVANTAGE', 'Neue Hinterachslenkung als Option', 'Als erstes Modell der Mittelklasse bietet die W206 eine optionale Hinterachslenkung. Diese verbessert die Wendigkeit im Stadtverkehr deutlich und erhoecht die Stabilitaet bei hohen Geschwindigkeiten.', 'Mercedes-Benz Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_w206_kauf', 'gen_mb_c_w206', 'BUYING_ADVICE', 'C 200 mit Avantgarde-Ausstattung empfohlen', 'Der C 200 (1.5 Vierzylinder-Turbo mit Mild-Hybrid) bietet ausreichend Leistung bei vernuenftigem Verbrauch. Die Avantgarde-Line hat die beste Serienausstattung. MBUX Augmented Reality Navigation lohnt sich als Sonderausstattung.', 'ADAC Kaufberatung', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes CLA C118
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_c118_design', 'gen_mb_cla_c118', 'ADVANTAGE', 'Stilvolles Coupe-Design in der Kompaktklasse', 'Der CLA verbindet das Design eines viertuerigen Coupes mit der Technik der Kompaktklasse. Die flache Dachlinie und die rahmenlosen Tueren setzen ihn optisch deutlich vom Wettbewerb ab.', 'Mercedes-Benz Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_c118_nachteil', 'gen_mb_cla_c118', 'DISADVANTAGE', 'Eingeschraenkte Kopffreiheit im Fond', 'Das Coupe-Design hat seinen Preis: Im Fond ist die Kopffreiheit fuer Personen ueber 1,80 m deutlich eingeschraenkt. Auch der Ein- und Ausstieg hinten ist durch die abfallende Dachlinie erschwert.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_c118_langstrecke', 'gen_mb_cla_c118', 'LONG_DISTANCE', 'Guter Langstreckenkomfort trotz kompakter Basis', 'Der CLA eignet sich dank guter Sitze, niedriger Windgeraeusche und adaptivem Tempomat (ab AMG Line) gut fuer die Langstrecke. Der Komfortvorteil der adaptiven Daempfer (bei AMG Line 35/45) ist spuerbar.', 'auto motor und sport Dauertest', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Mercedes S-Klasse W223
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_w223_technik', 'gen_mb_s_w223', 'ADVANTAGE', 'Technologische Speerspitze von Mercedes', 'Die W223 setzt Massstaebe bei Infotainment (OLED-Display, MBUX), Fahrkomfort (E-ACTIVE BODY CONTROL) und Sicherheit (Level 3 autonomes Fahren mit DRIVE PILOT als weltweit erstes Auto).', 'Mercedes-Benz Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_w223_langstrecke', 'gen_mb_s_w223', 'LONG_DISTANCE', 'Referenz fuer Langstreckenkomfort', 'Die S-Klasse ist nach wie vor die Referenz fuer Langstreckenkomfort. Die Sitze (optional mit Massagefunktion), die Geraeuschkapselung und das Federungsverhalten sind klassenuebergreifend fuehrend.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_w223_wert', 'gen_mb_s_w223', 'RESALE_VALUE', 'Hoher Wertverlust in den ersten drei Jahren', 'Wie bei allen Luxuslimousinen ist der absolute Wertverlust der S-Klasse hoch. In den ersten drei Jahren verliert sie typischerweise 40-50 Prozent des Neupreises, stabilisiert sich dann aber.', 'DAT Restwertprognose, Schwacke', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er G30
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_g30_langstrecke', 'gen_bmw_5er_g30', 'LONG_DISTANCE', 'Ausgewogener Business-Reisewagen', 'Der G30 5er verbindet sportliches Handling mit hohem Langstreckenkomfort. Der Touring (G31) bietet 570 Liter Kofferraum. Die Luftfederung an der Hinterachse (optional) verbessert den Komfort deutlich.', 'ADAC Autotest, auto motor und sport', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_g30_zuver', 'gen_bmw_5er_g30', 'RELIABILITY', 'Gute Zuverlaessigkeit mit Einschraenkungen', 'Der G30 schneidet im TUeV-Report gut ab, insbesondere die Diesel-Motoren (B47/B57) gelten als robust. Schwachstellen finden sich bei der Elektronik und den Assistenzsystemen frueherer Baujahre.', 'TUeV-Report 2024, ADAC Pannenstatistik', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_g30_kauf', 'gen_bmw_5er_g30', 'BUYING_ADVICE', '520d als Gebrauchtwagen empfohlen', 'Als Gebrauchtwagen ist der 520d (B47) die solideste Wahl — sparsam, zuverlaessig und mit gutem Wiederverkaufswert. Sport Line oder Luxury Line mit Lederausstattung halten den Wert am besten.', 'DAT Restwertprognose, ADAC Kaufberatung', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BMW 5er G60
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_g60_technik', 'gen_bmw_5er_g60', 'ADVANTAGE', 'Technologisch groesster Generationensprung', 'Der G60 markiert den groessten technischen Sprung in der 5er-Geschichte: Curved Display, neues iDrive, Level 2+ Assistenzsysteme, und erstmals rein elektrischer Antrieb (i5). Das Platzangebot ist grosszuegiger als beim Vorgaenger.', 'BMW Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_g60_nachteil', 'gen_bmw_5er_g60', 'DISADVANTAGE', 'Deutliche Groessen- und Gewichtszunahme', 'Der G60 ist um 10 cm laenger und bis zu 200 kg schwerer als der Vorgaenger G30. Das macht sich in engen Parkhaeusern und bei der Agilitaet bemerkbar. Das Design polarisiert staerker als beim Vorgaenger.', 'auto motor und sport Vergleichstest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_g60_alltag', 'gen_bmw_5er_g60', 'EVERYDAY_USE', 'Komfortabel im Alltag, aber sehr gross', 'Im Alltag ueberzeugt der G60 mit exzellentem Komfort und modernster Technik. Die Groesse kann in der Stadt aber zum Nachteil werden. Der elektrische i5 ist fuer Pendler besonders attraktiv.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi A6 C8
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_a6_c8_langstr', 'gen_audi_a6_c8', 'LONG_DISTANCE', 'Hervorragender Langstreckenkomfort', 'Der A6 C8 ist ein ausgezeichneter Langstreckenreisewagen. Die Sitze sind langstreckentauglich, die Geraeuschkapselung gut, und der Avant bietet 565 Liter Kofferraum. Mit adaptiver Luftfederung wird der Komfort nochmals gesteigert.', 'ADAC Autotest, auto motor und sport Dauertest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_a6_c8_vorteil', 'gen_audi_a6_c8', 'ADVANTAGE', 'Hochwertige Verarbeitungsqualitaet', 'Die Verarbeitungsqualitaet des A6 C8 ist in der Oberklasse-Mittelklasse fuehrend. Das Touch-Response-System mit haptischem Feedback setzt sich von konventionellen Touchscreens ab. Die Materialien im Innenraum sind durchweg hochwertig.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_a6_c8_nachteil', 'gen_audi_a6_c8', 'DISADVANTAGE', 'Komplexe Bedienung mit drei Touchscreens', 'Das Dual-Touchscreen-Konzept (plus virtuelles Cockpit) erfordert Eingewoehnung. Haeufig genutzte Klimafunktionen liegen auf dem unteren Display und erfordern Blickabwendung. Das System ist leistungsfaehig, aber nicht intuitiv.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Audi Q7 4M
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_q7_familie', 'gen_audi_q7_4m', 'EVERYDAY_USE', 'Grosszuegiges Familien-SUV', 'Der Q7 bietet ein sehr geraeumiges Platzangebot — auch in der optionalen dritten Sitzreihe. Der Kofferraum fasst 770 Liter (5-Sitzer). Die erhoehte Sitzposition und die gute Uebersichtlichkeit machen ihn alltagstauglich.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_q7_anhaenger', 'gen_audi_q7_4m', 'TOWING', 'Starker Zugwagen mit bis zu 3,5 Tonnen', 'Der Q7 darf bis zu 3.500 kg anhaengen (gebremmst). Besonders die V6-Diesel (3.0 TDI) sind hier empfehlenswert. Die Luftfederung kompensiert die Hecklast gut, der Anhaengerassistent erleichtert das Rangieren.', 'Audi Pressemitteilung, Camping-Fachpresse', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_q7_unterhalt', 'gen_audi_q7_4m', 'DISADVANTAGE', 'Hohe Unterhaltskosten', 'Als grosses Premium-SUV hat der Q7 hohe Unterhaltskosten: Versicherung, Kraftstoff und Wartung liegen deutlich ueber dem Segment-Durchschnitt. Die Luftfederung ist bei Defekt ein teures Ersatzteil.', 'ADAC Kostenrechnung, Schwacke', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Opel Astra L
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_astra_l_design', 'gen_opel_astra_l', 'ADVANTAGE', 'Frisches Design und Pure Panel', 'Der Astra L bricht mit dem Vorgaenger-Design und bringt das Bold-und-Pure-Design von Opel ueberzeugend in die Kompaktklasse. Das Pure Panel mit zwei grossen Bildschirmen wertet den Innenraum deutlich auf.', 'Opel Pressemitteilung, auto motor und sport', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_astra_l_phev', 'gen_opel_astra_l', 'EVERYDAY_USE', 'PHEV-Version fuer Pendler interessant', 'Der Astra Hybrid (PHEV) mit 60 km elektrischer Reichweite ist fuer Pendler attraktiv. Im reinen Elektrobetrieb ist er leise und sparsam. Die volle Batterie reicht fuer die meisten Arbeitswege.', 'ADAC Autotest', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Peugeot 208 II (P21)
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_208_design', 'gen_208_2', 'ADVANTAGE', 'Ausdrucksstarkes Design im Segment', 'Der 208 II hebt sich durch sein expressives Design und das i-Cockpit mit dem kleinen Lenkrad und den hochgesetzten Instrumenten deutlich vom Wettbewerb ab. Auch als e-208 rein elektrisch verfuegbar.', 'Peugeot Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_208_nachteil', 'gen_208_2', 'DISADVANTAGE', 'Kleiner Kofferraum und begrenzte Ruecksitze', 'Der 208 II bietet nur 311 Liter Kofferraum (265 Liter beim e-208). Die hintere Sitzreihe ist fuer Erwachsene bei laengeren Fahrten zu eng. Das i-Cockpit-Konzept passt nicht fuer alle Koerpergroessen.', 'ADAC Autotest, Autobild', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_208_stadt', 'gen_208_2', 'CITY_USE', 'Idealer Stadtwagen', 'Mit 4,05 m Laenge, gutem Wendekreis und optionaler Rueckfahrkamera ist der 208 ein idealer Stadtwagen. Die Uebersichtlichkeit ist gut. Besonders der e-208 macht im Stadtverkehr dank lautlosem Antrieb Freude.', 'ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ford Fiesta Mk8
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_fiesta8_fahrspass', 'gen_ford_fiesta_mk8', 'ADVANTAGE', 'Bester Fahrspass in der Kleinwagenklasse', 'Der Fiesta Mk8 gilt als der fahrdynamische Benchmark in seinem Segment. Das agile Fahrwerk, die praezise Lenkung und der kraeftige 1.0 EcoBoost machen ihn zum Fahrerfreund. Besonders der ST ist legendaer.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_fiesta8_nachteil', 'gen_ford_fiesta_mk8', 'DISADVANTAGE', 'Produktion eingestellt — nur noch gebraucht', 'Ford hat die Produktion des Fiesta im Juli 2023 eingestellt. Neufahrzeuge sind nicht mehr erhaeltlich. Die Ersatzteilversorgung ist aber langfristig gesichert.', 'Ford Pressemitteilung', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_fiesta8_zuver', 'gen_ford_fiesta_mk8', 'RELIABILITY', 'Gemischte Zuverlaessigkeit', 'Im TUeV-Report schneidet der Fiesta Mk8 durchwachsen ab. Waehrend der 1.0 EcoBoost Motor zuverlaessig ist, gibt es Schwaechen bei der Elektronik und dem SYNC-Infotainment. Die Kupplungsprobleme der fruehen Baujahre sind bekannt.', 'TUeV-Report 2024, ADAC Pannenstatistik', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Toyota Corolla E210
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_corolla_zuver', 'gen_toy_corolla_e210', 'RELIABILITY', 'Hervorragende Zuverlaessigkeit', 'Der Corolla E210 setzt die Toyota-Tradition der hohen Zuverlaessigkeit fort. In der ADAC-Pannenstatistik gehoert er zu den Besten seiner Klasse. Der Hybrid-Antrieb hat sich ueber Millionen Fahrzeuge bewaehrt.', 'ADAC Pannenstatistik, TUeV-Report 2024', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_corolla_hybrid', 'gen_toy_corolla_e210', 'ADVANTAGE', 'Bewaehrter Hybrid ohne Steckdose', 'Der Vollhybrid-Antrieb benoetigt keine externe Ladeinfrastruktur. Er laed sich automatisch durch Rekuperation und den Verbrennungsmotor. Im Stadtverkehr faehrt er haeufig rein elektrisch. Verbrauch im Alltag oft unter 5 l/100 km.', 'Toyota Pressemitteilung, ADAC Autotest', 'SPECIFICATION', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_corolla_wert', 'gen_toy_corolla_e210', 'RESALE_VALUE', 'Stabile Restwerte dank hoher Nachfrage', 'Der Corolla haelt seinen Wert ueberdurchschnittlich gut. Die hohe Zuverlaessigkeit und die wachsende Hybrid-Nachfrage stuetzen die Restwerte. Als Gebrauchtwagen ist er stark nachgefragt.', 'DAT Restwertprognose, Schwacke', 'ASSESSMENT', 'MEDIUM', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Porsche Macan 95B
INSERT INTO "KnowledgeNote" (id, "generationId", topic, heading, body, "dataBasis", "evidenceType", confidence, status, "publishedAt", "updatedAt") VALUES
('kn_macan_fahrdyn', 'gen_por_macan_95b', 'ADVANTAGE', 'Sportlichstes SUV seiner Klasse', 'Der Macan gilt als das fahrdynamisch beste SUV im Kompakt-Premium-Segment. Die Porsche-typische Lenkung, das ausgewogene Fahrwerk und die kraftvollen Motoren machen ihn zum Sportler unter den SUVs.', 'auto motor und sport, ADAC Autotest', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_macan_unterhalt', 'gen_por_macan_95b', 'DISADVANTAGE', 'Porsche-typisch hohe Unterhaltskosten', 'Wartung, Versicherung und Verschleissteile liegen deutlich ueber dem Segment. Die Bremsscheiben und Reifen sind kostspielig. Optionale Ausstattungen wie PASM oder Sportchrono treiben den Neupreis.', 'ADAC Kostenrechnung', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW()),
('kn_macan_wert', 'gen_por_macan_95b', 'RESALE_VALUE', 'Exzellente Wertstabilitaet', 'Der Macan haelt seinen Wert besser als fast alle Wettbewerber. Porsche-SUVs sind auf dem Gebrauchtwagenmarkt stark nachgefragt. Besonders der Macan S und GTS halten den Wert hervorragend.', 'Schwacke, DAT Restwertprognose', 'ASSESSMENT', 'HIGH', 'PUBLISHED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
