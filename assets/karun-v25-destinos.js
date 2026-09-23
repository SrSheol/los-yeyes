/* ============================================================
   Karún Travel Group — v25 DESTINOS «Postales del Este»
   · Stage (featured place, tide-wipe photo change, live tarifario facts,
     mini coast locator) + postcard rail + detail sheet ("ficha").
   · Remount-safe: renders only inside the empty React host
     <div data-k25-dest></div> and a body-level #k25-dd-root.
   · prefers-reduced-motion: no autoplay, no tide wipe, no Ken Burns.
   · Photos: assets/destinations/<slug>/k25-*.jpg — credits in
     assets/CREDITS.md and on every photo (CC BY / BY-SA / CC0 / PDM).
   ============================================================ */
(function () {
  "use strict";
  /* ------------------------------------------------------------------
     DATA — 10 destinations along Karún's real corridor.
     zones[] are tarifario zone ids (assets/tarifario.json); zones[0] is the
     one the "Tarifas de la zona" button filters. Hotels / "desde" are read
     live from window.KRN_TARIFARIO — nothing here is a price.
     ll = [lon, lat] for the mini coast locator.
     ------------------------------------------------------------------ */
  var PHOTOS = {"puj":[["k25-1.jpg",1600,1200,"Studio Sarah Lou","CC BY 2.0","https://www.flickr.com/photos/sackerman519/13969866971/"],["k25-2.jpg",1600,1200,"Reg Natarajan","CC BY 2.0","https://www.flickr.com/photos/regnatarajan/24598751964/"],["k25-3.jpg",1600,1066,"Anna Rubaylova","CC BY 2.0","https://www.flickr.com/photos/switch-twitch/8021199803/"],["k25-4.jpg",1600,1063,"Studio Sarah Lou","CC BY 2.0","https://www.flickr.com/photos/sackerman519/4528607600/"]],"bavaro":[["k25-1.jpg",1600,1067,"alyssaBLACK","CC BY-SA 2.0","https://www.flickr.com/photos/91997239@N08/15192131533"],["k25-2.jpg",1600,1066,"Andrei-Daniel Nicolae","CC BY 2.0","https://www.flickr.com/photos/90733161@N05/8364235931"],["k25-3.jpg",1600,1200,"Andreas Volkmer","CC BY 2.5","https://commons.wikimedia.org/w/index.php?curid=615189"]],"cap-cana":[["k25-1.jpg",1600,900,"Mary Mark Ockerbloom","CC0 1.0","https://commons.wikimedia.org/w/index.php?curid=146216573"],["k25-2.jpg",1600,1200,"ashleigh w","CC BY 2.0","https://www.flickr.com/photos/124697123@N07/14007201177/"],["k25-3.jpg",1600,1200,"ashleigh w","CC BY 2.0","https://www.flickr.com/photos/124697123@N07/14193517855/"],["k25-4.jpg",1600,867,"Sigurdur Josuason","Public Domain Mark","https://www.flickr.com/photos/josuason/30895580977/"]],"uvero-alto":[["k25-1.jpg",1600,1066,"Ted Murphy","CC BY 2.0","https://www.flickr.com/photos/tedmurphy/3897251229/"],["k25-2.jpg",1600,1066,"Ted Murphy","CC BY 2.0","https://www.flickr.com/photos/tedmurphy/3898072154/"],["k25-3.jpg",1600,1066,"Ted Murphy","CC BY 2.0","https://www.flickr.com/photos/tedmurphy/3898046106/"]],"macao":[["k25-1.jpg",1600,900,"etireno","CC BY 2.0","https://www.flickr.com/photos/29933609@N00/1464742641"],["k25-2.jpg",1600,1063,"bogdix","CC BY 2.0","https://www.flickr.com/photos/40391322@N00/3965529008"],["k25-3.jpg",1600,900,"etireno","CC BY 2.0","https://www.flickr.com/photos/29933609@N00/1464741061"],["k25-4.jpg",1600,1200,"rmariuzzo","CC BY 2.0","https://www.flickr.com/photos/63027933@N00/9927435183"]],"bayahibe":[["k25-1.jpg",1600,1063,"robertofaccenda.it","CC BY-SA 2.0","https://www.flickr.com/photos/14057446@N03/7014405797"],["k25-2.jpg",1600,900,"Traveller-Reini","CC BY-SA 2.0","https://www.flickr.com/photos/129472585@N03/16203165394"],["k25-3.jpg",1600,900,"Traveller-Reini","CC BY-SA 2.0","https://www.flickr.com/photos/129472585@N03/16205579493"],["k25-4.jpg",1600,900,"Traveller-Reini","CC BY-SA 2.0","https://www.flickr.com/photos/129472585@N03/16639402539"]],"saona":[["k25-1.jpg",1600,1064,"bruce_bruce948","CC BY 2.0","https://www.flickr.com/photos/9254698@N04/6659857715"],["k25-2.jpg",1600,1067,"Danu Widjajanto","CC BY-SA 4.0","https://commons.wikimedia.org/w/index.php?curid=103834701"],["k25-3.jpg",1600,1034,"bruce_bruce948","CC BY 2.0","https://www.flickr.com/photos/9254698@N04/6659832149"],["k25-4.jpg",1600,1062,"bruce_bruce948","CC BY 2.0","https://www.flickr.com/photos/9254698@N04/6659829523"],["k25-5.jpg",1600,1066,"Andrei-Daniel Nicolae","CC BY 2.0","https://www.flickr.com/photos/90733161@N05/8364331885"]],"la-romana":[["k25-1.jpg",1600,1200,"puroticorico","CC BY 2.0","https://www.flickr.com/photos/10058483@N00/2128173624"],["k25-2.jpg",1600,1200,"puroticorico","CC BY 2.0","https://www.flickr.com/photos/10058483@N00/2128179408"],["k25-3.jpg",1600,1200,"puroticorico","CC BY 2.0","https://www.flickr.com/photos/10058483@N00/2127397017"],["k25-4.jpg",1600,1200,"puroticorico","CC BY 2.0","https://www.flickr.com/photos/10058483@N00/2128174046"]],"boca-chica":[["k25-1.jpg",1024,768,"David Stanley","CC BY 2.0","https://www.flickr.com/photos/davidstanleytravel/32686059893/"],["k25-2.jpg",1024,768,"David Stanley","CC BY 2.0","https://www.flickr.com/photos/davidstanleytravel/33347197412/"],["k25-3.jpg",1600,871,"PressureNet","CC BY 2.0","https://www.flickr.com/photos/pressurenet/14359949534/"]],"santo-domingo":[["k25-1.jpg",1600,1066,"Mario Duran-Ortiz","CC BY-SA 2.0","https://www.flickr.com/photos/30998987@N03/38257209181/"],["k25-2.jpg",1600,1053,"Mario Duran-Ortiz","CC BY-SA 2.0","https://www.flickr.com/photos/30998987@N03/24386055548/"],["k25-3.jpg",1600,1066,"Mario Duran-Ortiz","CC BY-SA 2.0","https://www.flickr.com/photos/30998987@N03/38202357756/"],["k25-4.jpg",1600,1066,"Mario Duran-Ortiz","CC BY-SA 2.0","https://www.flickr.com/photos/30998987@N03/37547026934/"]]};

  var REGIONS = {
    coco:    { es: "Costa del Coco", en: "Coconut Coast", fr: "Côte des Cocotiers", de: "Kokosküste", pt: "Costa do Coco", it: "Costa del Cocco", ru: "Кокосовый берег", zh: "椰子海岸", nl: "Kokoskust", pl: "Wybrzeże Kokosowe" },
    sur:     { es: "Sur caribeño", en: "Caribbean south", fr: "Sud caraïbe", de: "Karibischer Süden", pt: "Sul caribenho", it: "Sud caraibico", ru: "Карибский юг", zh: "加勒比南岸", nl: "Caribisch zuiden", pl: "Karaibskie południe" },
    capital: { es: "Rumbo a la capital", en: "Toward the capital", fr: "Vers la capitale", de: "Richtung Hauptstadt", pt: "Rumo à capital", it: "Verso la capitale", ru: "К столице", zh: "前往首都", nl: "Richting hoofdstad", pl: "W stronę stolicy" }
  };

  var DEST = [
    { slug: "puj", region: "coco", origin: "PUJ", zones: ["punta-cana"], time: "24/7", ll: [-68.363, 18.567], airport: true, focus: "38% 60%",
      es: { name: "Punta Cana (PUJ)", short: "Punta Cana", tag: "Aquí empieza todo", time: "llegadas, cualquier vuelo",
        lede: "El aeropuerto de techos de cana donde arrancan casi todas las vacaciones del Este. Sales de migración, ves tu nombre en el letrero y en minutos vas camino a la playa.",
        items: ["Terminales abiertas bajo techos de palma cana", "Recepción con letrero y ayuda con las maletas", "Monitoreo de vuelo: si te retrasas, esperamos", "Salidas 24/7 a todas las zonas hoteleras"],
        why: "Del aeropuerto a tu lobby, privado y a precio fijo. La zona Punta Cana (Westin, Club Med, Tortuga Bay) queda a 10–20 min." },
      en: { name: "Punta Cana (PUJ)", short: "Punta Cana", tag: "Where it all begins", time: "arrivals, any flight",
        lede: "The palm-thatched airport where almost every east-coast holiday begins. Clear immigration, spot your name on the sign, and minutes later you are heading for the beach.",
        items: ["Open-air terminals under cana-palm roofs", "Name-sign welcome and help with your bags", "Flight tracking — if you are late, we wait", "24/7 departures to every hotel zone"],
        why: "Airport to lobby, private and fixed-price. The Punta Cana zone (Westin, Club Med, Tortuga Bay) is 10–20 min away." } },

    { slug: "bavaro", region: "coco", origin: "PUJ", zones: ["bavaro", "arena-gorda"], time: "20–35 min", ll: [-68.44, 18.69], focus: "70% 50%",
      es: { name: "Bávaro", tag: "Arena blanca, cero prisas", time: "desde PUJ",
        lede: "La playa larga de arena blanca que todos imaginan al decir «Punta Cana»: cocoteros, arrecife cerca de la orilla y una fila de resorts todo incluido frente al mar.",
        items: ["Kilómetros de playa para caminar al amanecer", "Beach clubs, golf y plazas comerciales", "Snorkel y catamaranes desde la misma arena", "Traslados entre hoteles para cenas y spa"],
        why: "Corredor costero directo desde PUJ; te dejamos en el lobby, incluida la zona Arena Gorda." },
      en: { name: "Bávaro", tag: "White sand, zero rush", time: "from PUJ",
        lede: "The long white-sand beach everyone pictures when they say “Punta Cana”: coconut palms, a reef just offshore and a row of all-inclusive resorts facing the sea.",
        items: ["Miles of beach to walk at sunrise", "Beach clubs, golf and shopping plazas", "Snorkel and catamaran trips right off the sand", "Hotel-to-hotel rides for dinners and spa"],
        why: "A straight coastal run from PUJ; we drop you at the lobby, Arena Gorda included." } },

    { slug: "cap-cana", region: "coco", origin: "PUJ", zones: ["cap-cana"], time: "15–30 min", ll: [-68.41, 18.46], focus: "50% 50%",
      es: { name: "Cap Cana", tag: "Marina, golf y calma", time: "desde PUJ",
        lede: "Justo al sur del aeropuerto: un enclave con marina, playa Juanillo, golf frente al mar y villas privadas. Traslados cortos y panorámicos.",
        items: ["Playa Juanillo: agua clara y tranquila", "Marina con restaurantes y pesca deportiva", "Golf frente al mar en Punta Espada", "Conocemos accesos y direcciones de villas"],
        why: "El trayecto más corto desde PUJ. Pasamos los controles de acceso y llegamos hasta la puerta de tu villa o resort." },
      en: { name: "Cap Cana", tag: "Marina, golf and calm", time: "from PUJ",
        lede: "Just south of the airport: a gated enclave with a marina, Juanillo beach, oceanfront golf and private villas. Short, scenic transfers.",
        items: ["Juanillo beach: clear, calm water", "Marina dining and sport fishing", "Oceanfront golf at Punta Espada", "We know the gates and villa addresses"],
        why: "The shortest ride from PUJ. We handle the gatehouses and pull up at your villa or resort door." } },

    { slug: "macao", region: "coco", origin: "PUJ", zones: ["macao"], time: "30–40 min", ll: [-68.535, 18.77], focus: "45% 55%",
      es: { name: "Playa Macao", tag: "La playa salvaje", time: "desde PUJ",
        lede: "Una bahía abierta entre acantilados, con olas para surfear, palmeras hasta la arena y casi nada construido. La escapada para ver la costa como era.",
        items: ["Clases de surf para principiantes", "Paseos en buggy y a caballo por la zona", "Pescado frito en los ranchitos de playa", "Acantilados y miradores en ambos extremos"],
        why: "Ideal como salida de medio día desde Bávaro o traslado a Dreams Macao Beach. Esperamos o volvemos por ti a la hora pactada." },
      en: { name: "Macao Beach", tag: "The wild one", time: "from PUJ",
        lede: "An open bay between cliffs, with surfable waves, palms down to the sand and almost nothing built. The escape to see the coast as it used to be.",
        items: ["Beginner surf lessons", "Buggy and horseback rides nearby", "Fried fish at the beach shacks", "Cliffs and lookouts at both ends"],
        why: "A great half-day outing from Bávaro, or your transfer to Dreams Macao Beach. We wait, or come back at the agreed time." } },

    { slug: "uvero-alto", region: "coco", origin: "PUJ", zones: ["uvero-alto"], time: "40–60 min", ll: [-68.60, 18.81], focus: "55% 55%",
      es: { name: "Uvero Alto", tag: "Donde el mapa se calma", time: "desde PUJ",
        lede: "El extremo norte de la costa: playas largas y poco transitadas, cocoteros densos y resorts amplios pensados para desconectar.",
        items: ["Playas amplias y tranquilas", "Resorts solo adultos y para familias", "Cerca de Macao y del camino a Miches", "Carretera costera escénica desde PUJ"],
        why: "El trayecto más largo del corredor, en van privada con aire y agua fría: llegas descansado, no apretado en un shuttle." },
      en: { name: "Uvero Alto", tag: "Where the map goes quiet", time: "from PUJ",
        lede: "The northern end of the coast: long, uncrowded beaches, dense coconut groves and spacious resorts built for switching off.",
        items: ["Wide, peaceful beaches", "Adults-only and family resorts", "Close to Macao and the road to Miches", "A scenic coastal drive from PUJ"],
        why: "The longest run on the corridor, in a private air-conditioned van with cold water — you arrive rested, not squeezed into a shuttle." } },

    { slug: "la-romana", region: "sur", origin: "PUJ", zones: ["la-romana", "playa-nueva-romana"], time: "60–75 min", ll: [-68.96, 18.42], focus: "50% 45%",
      es: { name: "La Romana", tag: "Piedra, río y golf", time: "desde PUJ",
        lede: "Casa de Campo y Altos de Chavón: una villa de piedra de estilo mediterráneo sobre el cañón del río Chavón, con anfiteatro, galerías y vistas de postal.",
        items: ["Altos de Chavón y la iglesia de San Estanislao", "Mirador sobre el río Chavón", "Golf de campeonato en Casa de Campo", "Marina y playa Minitas"],
        why: "Autopista del Coral desde PUJ o SDQ; también conectamos con Playa Nueva Romana." },
      en: { name: "La Romana", tag: "Stone, river and golf", time: "from PUJ",
        lede: "Casa de Campo and Altos de Chavón: a Mediterranean-style stone village above the Chavón river canyon, with an amphitheatre, galleries and postcard views.",
        items: ["Altos de Chavón and St. Stanislaus church", "Lookout over the Chavón river", "Championship golf at Casa de Campo", "The marina and Minitas beach"],
        why: "Coral Highway from PUJ or SDQ; we also serve Playa Nueva Romana." } },

    { slug: "bayahibe", region: "sur", origin: "PUJ", zones: ["bayahibe"], time: "75–90 min", ll: [-68.84, 18.37], focus: "30% 55%",
      es: { name: "Bayahibe", tag: "Agua mansa del Caribe", time: "desde PUJ",
        lede: "Un pueblo pesquero de agua mansa y cristalina en la costa sur, puerta al Parque Nacional Cotubanamá (del Este) y punto de salida de las lanchas a Saona.",
        items: ["Playa Dominicus y su faro de rayas", "Buceo y snorkel en arrecifes protegidos", "Lanchas y catamaranes a Saona y Catalina", "Atardeceres sobre el mar"],
        why: "Cubrimos resorts de Dominicus y el pueblo. Si vas a Saona, coordinamos la hora con tu lancha." },
      en: { name: "Bayahibe", tag: "Calm Caribbean water", time: "from PUJ",
        lede: "A fishing village on the calm, glass-clear south coast, gateway to Cotubanamá (East) National Park and the departure point for boats to Saona.",
        items: ["Dominicus beach and its striped lighthouse", "Diving and snorkelling on protected reefs", "Boats and catamarans to Saona and Catalina", "Sunsets over the sea"],
        why: "We serve the Dominicus resorts and the village. Heading to Saona? We time the ride to your boat." } },

    { slug: "saona", region: "sur", origin: "PUJ", zones: ["bayahibe"], time: "75–90 min", ll: [-68.76, 18.16], island: true, focus: "50% 50%",
      es: { name: "Isla Saona", tag: "La piscina natural", time: "al muelle de Bayahibe",
        lede: "La excursión clásica: una isla dentro del parque nacional, con playas de cocoteros, bancos de arena en agua turquesa y la famosa piscina natural.",
        items: ["Piscina natural con estrellas de mar (solo mirar)", "Playas de postal a la sombra de palmas", "Catamarán y lancha rápida, según tu tour", "Te llevamos al muelle y te esperamos al volver"],
        why: "Karún hace el tramo por tierra: resort → muelle de Bayahibe → resort. La lancha la reservas con tu operador; nosotros cuadramos horarios." },
      en: { name: "Saona Island", tag: "The natural pool", time: "to the Bayahibe dock",
        lede: "The classic day trip: an island inside the national park, with palm-lined beaches, turquoise sandbars and the famous natural pool.",
        items: ["Natural pool with starfish (look, don’t lift)", "Postcard beaches in the palm shade", "Catamaran and speedboat, depending on your tour", "We drive you to the dock and wait for your return"],
        why: "Karún covers the land leg: resort → Bayahibe dock → resort. You book the boat with your tour operator; we match the timing." } },

    { slug: "boca-chica", region: "capital", origin: "SDQ", zones: ["boca-chica"], time: "10–20 min", ll: [-69.61, 18.445], focus: "50% 55%",
      es: { name: "Boca Chica", tag: "La laguna de la capital", time: "desde SDQ",
        lede: "Una bahía protegida por arrecife, de agua baja y tranquila, a minutos del aeropuerto Las Américas (SDQ). Ambiente local, pescado frito y un último chapuzón antes del vuelo.",
        items: ["Agua baja y tranquila, ideal con niños", "Restaurantes con mesas sobre el agua", "Kayak y paddle en la laguna", "Parada perfecta en conexiones por SDQ"],
        why: "El traslado más corto desde SDQ. También lo combinamos con escalas largas: aeropuerto → playa → aeropuerto." },
      en: { name: "Boca Chica", tag: "The capital’s lagoon beach", time: "from SDQ",
        lede: "A reef-sheltered bay with shallow, calm water, minutes from Las Américas airport (SDQ). Local vibe, fried fish and one last swim before your flight.",
        items: ["Shallow, calm water — great with kids", "Restaurants with tables over the water", "Kayak and paddleboard on the lagoon", "A perfect stop on SDQ connections"],
        why: "The shortest ride from SDQ. We also do long layovers: airport → beach → airport." } },

    { slug: "santo-domingo", region: "capital", origin: "SDQ", zones: ["santo-domingo"], time: "30–45 min", ll: [-69.89, 18.47], focus: "40% 55%",
      es: { name: "Santo Domingo", tag: "La Primada de América", time: "desde SDQ",
        lede: "La Ciudad Colonial, patrimonio UNESCO: calles de piedra, la primera catedral de América, la Fortaleza Ozama y el malecón frente al Caribe.",
        items: ["Catedral Primada y Parque Colón", "Fortaleza Ozama y Calle Las Damas", "Calle El Conde: cafés, tiendas y música", "Desde el corredor de Punta Cana: 2½–3 h"],
        why: "Traslados SDQ ⇄ hoteles de la ciudad y viajes largos privados Punta Cana ⇄ capital, con paradas si las pides." },
      en: { name: "Santo Domingo", tag: "The Americas’ first city", time: "from SDQ",
        lede: "The UNESCO-listed Colonial City: stone streets, the first cathedral in the Americas, Ozama Fortress and the seafront Malecón.",
        items: ["Primada Cathedral and Parque Colón", "Ozama Fortress and Calle Las Damas", "Calle El Conde: cafés, shops and music", "From the Punta Cana corridor: 2½–3 h"],
        why: "SDQ ⇄ city hotels and long private runs Punta Cana ⇄ capital, with stops if you ask." } }
  ];

  /* Other site languages: name + tagline + 2–3 short paragraphs (the
     core five keep the v22 translations). The ES/EN build is the reference. */
  var MORE = {
    puj: {
      fr: ["Punta Cana (PUJ)", "Tout commence ici"], de: ["Punta Cana (PUJ)", "Hier beginnt alles"], pt: ["Punta Cana (PUJ)", "Tudo começa aqui"], it: ["Punta Cana (PUJ)", "Qui inizia tutto"],
      ru: ["Пунта-Кана (PUJ)", "Здесь всё начинается"], zh: ["蓬塔卡纳 (PUJ)", "一切从这里开始"], nl: ["Punta Cana (PUJ)", "Hier begint alles"], pl: ["Punta Cana (PUJ)", "Tu wszystko się zaczyna"] },
    bavaro: {
      fr: ["Bávaro", "Sable blanc, zéro stress"], de: ["Bávaro", "Weißer Sand, keine Eile"], pt: ["Bávaro", "Areia branca, zero pressa"], it: ["Bávaro", "Sabbia bianca, zero fretta"],
      ru: ["Баваро", "Белый песок, никакой спешки"], zh: ["巴瓦罗", "白沙，不赶时间"], nl: ["Bávaro", "Wit zand, geen haast"], pl: ["Bávaro", "Biały piasek, zero pośpiechu"] },
    "cap-cana": {
      fr: ["Cap Cana", "Marina, golf et calme"], de: ["Cap Cana", "Marina, Golf und Ruhe"], pt: ["Cap Cana", "Marina, golfe e calma"], it: ["Cap Cana", "Marina, golf e calma"],
      ru: ["Кап-Кана", "Марина, гольф и покой"], zh: ["卡普卡纳", "码头、高尔夫与宁静"], nl: ["Cap Cana", "Jachthaven, golf en rust"], pl: ["Cap Cana", "Marina, golf i spokój"] },
    saona: {
      fr: ["Île Saona", "La piscine naturelle"], de: ["Insel Saona", "Der Naturpool"], pt: ["Ilha Saona", "A piscina natural"], it: ["Isola Saona", "La piscina naturale"],
      ru: ["Остров Саона", "Природный бассейн"], zh: ["萨奥纳岛", "天然泳池"], nl: ["Saona-eiland", "Het natuurlijke zwembad"], pl: ["Wyspa Saona", "Naturalny basen"] },
    "santo-domingo": {
      fr: ["Saint-Domingue", "La première ville des Amériques"], de: ["Santo Domingo", "Die erste Stadt Amerikas"], pt: ["Santo Domingo", "A primeira cidade das Américas"], it: ["Santo Domingo", "La prima città delle Americhe"],
      ru: ["Санто-Доминго", "Первый город Америки"], zh: ["圣多明各", "美洲第一城"], nl: ["Santo Domingo", "De eerste stad van Amerika"], pl: ["Santo Domingo", "Pierwsze miasto Ameryk"] },
    macao: {
      fr: ["Plage de Macao", "La sauvage", ["Une baie ouverte entre des falaises, avec des vagues pour surfer, des palmiers jusqu’au sable et presque aucune construction.", "Idéale pour une demi-journée depuis Bávaro ou un transfert vers Dreams Macao Beach : nous attendons ou revenons à l’heure convenue."]],
      de: ["Playa Macao", "Die Wilde", ["Eine offene Bucht zwischen Klippen, mit Surfwellen, Palmen bis zum Sand und fast ohne Bebauung.", "Ideal als Halbtagesausflug ab Bávaro oder als Transfer zum Dreams Macao Beach — wir warten oder holen Sie zur vereinbarten Zeit ab."]],
      pt: ["Praia Macao", "A selvagem", ["Uma baía aberta entre falésias, com ondas para surfar, coqueiros até a areia e quase nada construído.", "Ótima para meio dia saindo de Bávaro ou traslado ao Dreams Macao Beach — esperamos ou voltamos no horário combinado."]],
      it: ["Spiaggia Macao", "La selvaggia", ["Una baia aperta tra le scogliere, con onde da surf, palme fino alla sabbia e quasi nulla di costruito.", "Perfetta per mezza giornata da Bávaro o per il transfer al Dreams Macao Beach: aspettiamo o torniamo all’ora concordata."]],
      ru: ["Пляж Макао", "Дикий пляж", ["Открытая бухта между скалами: волны для серфинга, пальмы до самого песка и почти никакой застройки.", "Идеально на полдня из Баваро или как трансфер в Dreams Macao Beach — ждём или возвращаемся в оговорённое время."]],
      zh: ["马考海滩", "原生态海滩", ["悬崖之间的开阔海湾，有适合冲浪的浪、一直长到沙滩的棕榈树，几乎没有建筑。", "适合从巴瓦罗出发的半日游，或送往 Dreams Macao Beach——我们可以等候，也可按约定时间回来接您。"]],
      nl: ["Playa Macao", "De wilde", ["Een open baai tussen kliffen, met surfgolven, palmen tot op het zand en bijna geen bebouwing.", "Ideaal als halve dag vanuit Bávaro of als transfer naar Dreams Macao Beach — we wachten of komen op de afgesproken tijd terug."]],
      pl: ["Plaża Macao", "Dzika plaża", ["Otwarta zatoka między klifami, z falami do surfowania, palmami aż do piasku i prawie bez zabudowy.", "Idealna na pół dnia z Bávaro lub jako transfer do Dreams Macao Beach — czekamy albo wracamy o umówionej godzinie."]] },
    "uvero-alto": {
      fr: ["Uvero Alto", "Là où la carte s’apaise", ["L’extrémité nord de la côte : longues plages peu fréquentées, cocoteraies denses et grands resorts pensés pour décrocher.", "Le trajet le plus long du corridor, en van privé climatisé avec eau fraîche : vous arrivez reposé."]],
      de: ["Uvero Alto", "Wo die Karte zur Ruhe kommt", ["Das Nordende der Küste: lange, ruhige Strände, dichte Kokoshaine und weitläufige Resorts zum Abschalten.", "Die längste Strecke im Korridor, im privaten klimatisierten Van mit kaltem Wasser — Sie kommen erholt an."]],
      pt: ["Uvero Alto", "Onde o mapa se acalma", ["O extremo norte da costa: praias longas e pouco movimentadas, coqueirais densos e resorts amplos para desligar.", "O trajeto mais longo do corredor, em van privada com ar e água gelada — você chega descansado."]],
      it: ["Uvero Alto", "Dove la mappa si calma", ["L’estremità nord della costa: spiagge lunghe e poco affollate, fitti palmeti e resort spaziosi per staccare.", "Il tragitto più lungo del corridoio, in van privato climatizzato con acqua fresca: arrivi riposato."]],
      ru: ["Уверо-Альто", "Там, где карта затихает", ["Северная окраина побережья: длинные малолюдные пляжи, густые кокосовые рощи и просторные курорты для отдыха от всего.", "Самый длинный маршрут коридора — в частном минивэне с кондиционером и холодной водой: приезжаете отдохнувшими."]],
      zh: ["乌韦罗阿尔托", "地图安静下来的地方", ["海岸的最北端：漫长而人少的海滩、茂密的椰林和适合放空的宽敞度假村。", "走廊上最长的路程，乘坐带空调和冰水的私人专车——抵达时依然精神饱满。"]],
      nl: ["Uvero Alto", "Waar de kaart stil wordt", ["Het noordelijkste stuk kust: lange, rustige stranden, dichte kokosbossen en ruime resorts om te onthaasten.", "De langste rit van de corridor, in een privébusje met airco en koud water — je komt uitgerust aan."]],
      pl: ["Uvero Alto", "Tam, gdzie mapa się uspokaja", ["Północny kraniec wybrzeża: długie, spokojne plaże, gęste gaje kokosowe i przestronne resorty do odpoczynku.", "Najdłuższa trasa korytarza, prywatnym vanem z klimatyzacją i zimną wodą — docierasz wypoczęty."]] },
    "la-romana": {
      fr: ["La Romana", "Pierre, rivière et golf", ["Casa de Campo et Altos de Chavón : un village de pierre de style méditerranéen au-dessus du canyon du Chavón, avec amphithéâtre et galeries.", "Par l’autoroute du Corail depuis PUJ ou SDQ ; nous desservons aussi Playa Nueva Romana."]],
      de: ["La Romana", "Stein, Fluss und Golf", ["Casa de Campo und Altos de Chavón: ein mediterranes Steindorf über dem Canyon des Río Chavón, mit Amphitheater und Galerien.", "Über die Autopista del Coral ab PUJ oder SDQ; auch Playa Nueva Romana."]],
      pt: ["La Romana", "Pedra, rio e golfe", ["Casa de Campo e Altos de Chavón: uma vila de pedra em estilo mediterrâneo sobre o cânion do rio Chavón, com anfiteatro e galerias.", "Pela Autopista del Coral desde PUJ ou SDQ; também atendemos Playa Nueva Romana."]],
      it: ["La Romana", "Pietra, fiume e golf", ["Casa de Campo e Altos de Chavón: un borgo di pietra in stile mediterraneo sopra il canyon del fiume Chavón, con anfiteatro e gallerie.", "Autopista del Coral da PUJ o SDQ; serviamo anche Playa Nueva Romana."]],
      ru: ["Ла-Романа", "Камень, река и гольф", ["Каса-де-Кампо и Альтос-де-Чавон: каменная деревня в средиземноморском стиле над каньоном реки Чавон, с амфитеатром и галереями.", "По трассе Autopista del Coral из PUJ или SDQ; также Плайя-Нуэва-Романа."]],
      zh: ["拉罗马纳", "石头、河流与高尔夫", ["田园之家与阿尔托斯德查冯：查冯河峡谷上方的地中海风格石头村落，有露天剧场和画廊。", "经珊瑚高速从 PUJ 或 SDQ 出发；也可前往 Playa Nueva Romana。"]],
      nl: ["La Romana", "Steen, rivier en golf", ["Casa de Campo en Altos de Chavón: een mediterraan stenen dorp boven de kloof van de Chavón-rivier, met amfitheater en galerieën.", "Via de Autopista del Coral vanaf PUJ of SDQ; ook naar Playa Nueva Romana."]],
      pl: ["La Romana", "Kamień, rzeka i golf", ["Casa de Campo i Altos de Chavón: kamienna wioska w stylu śródziemnomorskim nad kanionem rzeki Chavón, z amfiteatrem i galeriami.", "Autostradą Coral z PUJ lub SDQ; obsługujemy też Playa Nueva Romana."]] },
    bayahibe: {
      fr: ["Bayahibe", "L’eau calme des Caraïbes", ["Un village de pêcheurs aux eaux calmes et cristallines sur la côte sud, porte du parc national Cotubanamá et point de départ des bateaux pour Saona.", "Nous desservons les resorts de Dominicus et le village ; pour Saona, nous calons l’heure sur votre bateau."]],
      de: ["Bayahibe", "Ruhiges Karibikwasser", ["Ein Fischerdorf mit ruhigem, glasklarem Wasser an der Südküste, Tor zum Nationalpark Cotubanamá und Abfahrtsort der Boote nach Saona.", "Wir fahren die Dominicus-Resorts und das Dorf an; für Saona stimmen wir die Zeit auf Ihr Boot ab."]],
      pt: ["Bayahibe", "Água mansa do Caribe", ["Uma vila de pescadores de água mansa e cristalina na costa sul, porta do Parque Nacional Cotubanamá e ponto de saída dos barcos para Saona.", "Atendemos os resorts de Dominicus e a vila; para Saona, ajustamos o horário ao seu barco."]],
      it: ["Bayahibe", "Acqua calma dei Caraibi", ["Un villaggio di pescatori dall’acqua calma e cristallina sulla costa sud, porta del Parco Nazionale Cotubanamá e punto di partenza delle barche per Saona.", "Serviamo i resort di Dominicus e il paese; per Saona sincronizziamo l’orario con la tua barca."]],
      ru: ["Байяибе", "Спокойное Карибское море", ["Рыбацкая деревня с тихой прозрачной водой на южном берегу, ворота в национальный парк Котубанама и точка отправления лодок на Саону.", "Возим в отели Доминикуса и в деревню; для Саоны подстраиваем время под вашу лодку."]],
      zh: ["巴亚希贝", "平静的加勒比海", ["南岸一座海水平静清澈的渔村，是科图巴纳马国家公园的门户，也是前往萨奥纳岛的船只出发点。", "我们服务多米尼库斯各度假村和村镇；去萨奥纳的话，我们按您的船期安排时间。"]],
      nl: ["Bayahibe", "Kalm Caribisch water", ["Een vissersdorp met kalm, glashelder water aan de zuidkust, toegangspoort tot nationaal park Cotubanamá en vertrekpunt van de boten naar Saona.", "We rijden naar de Dominicus-resorts en het dorp; voor Saona stemmen we de tijd af op je boot."]],
      pl: ["Bayahibe", "Spokojne Karaiby", ["Wioska rybacka ze spokojną, krystaliczną wodą na południowym wybrzeżu, brama do parku narodowego Cotubanamá i port łodzi na Saonę.", "Obsługujemy resorty Dominicus i wioskę; na Saonę dopasowujemy godzinę do Twojej łodzi."]] },
    "boca-chica": {
      fr: ["Boca Chica", "Le lagon de la capitale", ["Une baie protégée par le récif, aux eaux basses et calmes, à quelques minutes de l’aéroport Las Américas (SDQ).", "Le trajet le plus court depuis SDQ — parfait aussi pour une longue escale : aéroport → plage → aéroport."]],
      de: ["Boca Chica", "Die Lagune der Hauptstadt", ["Eine vom Riff geschützte Bucht mit flachem, ruhigem Wasser, wenige Minuten vom Flughafen Las Américas (SDQ).", "Die kürzeste Fahrt ab SDQ — auch ideal bei langem Umstieg: Flughafen → Strand → Flughafen."]],
      pt: ["Boca Chica", "A lagoa da capital", ["Uma baía protegida por recife, de água rasa e calma, a minutos do aeroporto Las Américas (SDQ).", "O traslado mais curto desde SDQ — ótimo também em conexões longas: aeroporto → praia → aeroporto."]],
      it: ["Boca Chica", "La laguna della capitale", ["Una baia protetta dalla barriera corallina, con acqua bassa e calma, a pochi minuti dall’aeroporto Las Américas (SDQ).", "Il transfer più breve da SDQ — ottimo anche per lunghi scali: aeroporto → spiaggia → aeroporto."]],
      ru: ["Бока-Чика", "Лагуна столицы", ["Бухта под защитой рифа с мелкой спокойной водой, в нескольких минутах от аэропорта Лас-Америкас (SDQ).", "Самый короткий трансфер из SDQ — удобно и при долгой пересадке: аэропорт → пляж → аэропорт."]],
      zh: ["博卡奇卡", "首都的泻湖海滩", ["珊瑚礁环抱的海湾，海水浅而平静，距拉斯阿梅里卡斯机场（SDQ）仅几分钟。", "从 SDQ 出发最短的接送——长时间转机也很合适：机场 → 海滩 → 机场。"]],
      nl: ["Boca Chica", "De lagune van de hoofdstad", ["Een door rif beschutte baai met ondiep, kalm water, op enkele minuten van luchthaven Las Américas (SDQ).", "De kortste rit vanaf SDQ — ook ideaal bij een lange overstap: luchthaven → strand → luchthaven."]],
      pl: ["Boca Chica", "Laguna stolicy", ["Zatoka osłonięta rafą, z płytką i spokojną wodą, kilka minut od lotniska Las Américas (SDQ).", "Najkrótszy transfer z SDQ — świetny też przy długiej przesiadce: lotnisko → plaża → lotnisko."]] }
  };
  var OLD_PARAS = {"puj":{"fr":["L’aéroport international de Punta Cana (PUJ) est la principale porte d’entrée de la côte est de la République dominicaine. La plupart des séjours en resort commencent et se terminent ici.","Karún vous accueille à l’arrivée avec une pancarte à votre nom, aide avec les bagages et vous conduit en privé vers Bávaro, Cap Cana, Uvero Alto et d’autres zones hôtelières — sans navette partagée ni marchandage.","Idéal pour les premières visites, les familles avec bagages, les arrivées tardives et quiconque veut un transfert à prix fixe qui attend à l’atterrissage."],"de":["Der Flughafen Punta Cana (PUJ) ist das Haupttor zur Ostküste der Dominikanischen Republik. Die meisten Resort-Aufenthalte beginnen und enden hier.","Karún empfängt Sie an den Ankünften mit Namensschild, hilft mit dem Gepäck und fährt Sie privat nach Bávaro, Cap Cana, Uvero Alto und andere Hotelzonen — ohne Sammelshuttle oder Feilschen.","Ideal für Erstbesucher, Familien mit Gepäck, späte Ankünfte und alle, die einen Transfer zum Festpreis beim Landen erwarten."],"pt":["O Aeroporto Internacional de Punta Cana (PUJ) é a principal porta de entrada da costa leste da República Dominicana. A maioria das estadias em resorts começa e termina aqui.","A Karún recebe você na chegada com placa com o seu nome, ajuda com as malas e leva em privado a Bávaro, Cap Cana, Uvero Alto e outras zonas hoteleiras — sem transfers partilhados nem negociação na calçada.","Ideal para primeira visita, famílias com bagagem, chegadas noturnas e quem quer um traslado a preço fixo à espera no desembarque."],"it":["L’aeroporto internazionale di Punta Cana (PUJ) è la porta principale della costa est della Repubblica Dominicana. La maggior parte dei soggiorni in resort inizia e finisce qui.","Karún ti accoglie agli arrivi con cartello a nome tuo, aiuta con i bagagli e ti porta in privato a Bávaro, Cap Cana, Uvero Alto e altre zone alberghiere — senza shuttle condivisi né trattative.","Ideale per chi arriva la prima volta, famiglie con valigie, arrivi notturni e chi vuole un transfer a prezzo fisso ad aspettare all’atterraggio."],"ru":["Международный аэропорт Пунта-Каны (PUJ) — главный въезд на восточное побережье Доминиканской Республики. Большинство курортных поездок начинаются и заканчиваются здесь.","Karún встречает вас в зоне прилёта с табличкой, помогает с багажом и везёт частным трансфером в Баваро, Кап-Кану, Уверо-Альто и другие зоны отелей — без общих шаттлов и торга у выхода.","Удобно для первого визита, семей с чемоданами, ночных прилётов и всех, кто хочет фиксированную цену и машину сразу после посадки."],"zh":["蓬塔卡纳国际机场（PUJ）是前往多米尼加共和国东海岸的主要门户。多数度假村行程都从这里开始和结束。","Karún 在到达厅举名牌迎接、协助行李，并专车送往巴瓦罗、卡普卡纳、乌韦罗阿尔托等酒店区——无拼车、无路边议价。","适合初次到访、带行李的家庭、夜间抵达，以及希望落地即有固定价格专车等候的旅客。"],"nl":["Punta Cana International Airport (PUJ) is de belangrijkste toegangspoort tot de oostkust van de Dominicaanse Republiek. De meeste resortverblijven beginnen en eindigen hier.","Karún ontvangt je bij aankomst met een naambord, helpt met bagage en brengt je privé naar Bávaro, Cap Cana, Uvero Alto en andere hotelzones — geen gedeelde shuttles of afdingen.","Ideaal voor eerste bezoekers, gezinnen met koffers, late landingen en iedereen die een vaste prijs en een wachtende rit wil."],"pl":["Międzynarodowe lotnisko Punta Cana (PUJ) to główna brama na wschodnie wybrzeże Dominikany. Większość pobytów w resortach zaczyna się i kończy tutaj.","Karún wita Cię na przylotach z tabliczką, pomaga z bagażem i wiezie prywatnie do Bávaro, Cap Cana, Uvero Alto i innych stref hotelowych — bez wspólnych shuttle’i i targowania.","Idealne na pierwszą wizytę, rodziny z walizkami, nocne przyloty i każdego, kto chce stałą cenę i transfer czekający po lądowaniu."]},"bavaro":{"fr":["Bávaro est la longue bande de resorts tout compris, beach clubs et centres commerciaux que la plupart des voyageurs imaginent en disant « Punta Cana ».","Depuis PUJ, c’est un court trajet privé le long du corridor côtier. Nous vous déposons au lobby de votre hôtel et pouvons aussi vous déplacer entre établissements pour dîners, spas ou sorties.","Sable blanc, mer chaude des Caraïbes et soirées animées — avec un van climatisé et de la place pour les bagages de toute la famille."],"de":["Bávaro ist der lange Strandstreifen aus All-inclusive-Resorts, Beach Clubs und Einkaufszentren, den die meisten mit „Punta Cana“ verbinden.","Von PUJ ist es eine kurze Privatfahrt entlang des Küstenkorridors. Wir bringen Sie zur Hotellobby und auch zwischen Häusern zu Abendessen, Spas oder Nightlife.","Weißer Sand, warmes Karibikwasser und lebendige Abende — mit kühlem Van und Platz für das Gepäck der ganzen Familie."],"pt":["Bávaro é a longa faixa de resorts all-inclusive, beach clubs e shoppings que a maioria imagina ao dizer “Punta Cana”.","Desde PUJ é um traslado privado curto pelo corredor costeiro. Deixamos você no lobby do hotel e também movemos entre propriedades para jantares, spas ou vida noturna.","Areia branca, mar quente do Caribe e noites animadas — com van fresca e espaço para as malas de toda a família."],"it":["Bávaro è la lunga fascia di resort all-inclusive, beach club e centri commerciali che la maggior parte immagina dicendo “Punta Cana”.","Da PUJ è un breve transfer privato lungo il corridoio costiero. Ti lasciamo in lobby e possiamo spostarti tra strutture per cene, spa o nightlife.","Sabbia bianca, mare caldo caraibico e serate vivaci — con van fresca e spazio per i bagagli di tutta la famiglia."],"ru":["Баваро — длинная береговая полоса all-inclusive курортов, бич-клубов и торговых площадок, которую чаще всего имеют в виду, говоря «Пунта-Кана».","От PUJ это короткий частный трансфер вдоль побережья. Мы довезём до лобби отеля и между объектами на ужин, в спа или на вечерние развлечения.","Белый песок, тёплое Карибское море и живая ночная жизнь — в прохладном минивэне с местом для багажа всей семьи."],"zh":["巴瓦罗是绵延的一线海滨全包度假村、海滩俱乐部和购物广场，多数人口中的“蓬塔卡纳”指的就是这里。","从 PUJ 沿海岸走廊专车很快抵达。我们送到酒店大堂，也可在各酒店间接送用餐、水疗或夜生活。","白沙、温暖的加勒比海水与热闹的夜晚——专车空调充足，放得下全家行李。"],"nl":["Bávaro is de lange strandstrook van all-inclusive resorts, beachclubs en winkelpleinen die de meeste mensen bedoelen met “Punta Cana”.","Vanaf PUJ is het een korte privérit langs de kustcorridor. We zetten je af bij de hotellobby en rijden ook tussen locaties voor diner, spa of uitgaan.","Wit zand, warm Caribisch water en levendige avonden — met een koele van en ruimte voor de bagage van het hele gezin."],"pl":["Bávaro to długi pas all-inclusive resortów, beach clubów i galerii, który większość ma na myśli mówiąc „Punta Cana”.","Z PUJ to krótki prywatny transfer wzdłuż korytarza nadmorskiego. Podwozimy do lobby hotelu i między obiektami na kolacje, spa czy nocne wyjścia.","Biały piasek, ciepłe karaibskie morze i żywe wieczory — w chłodnym vanie z miejscem na bagaż całej rodziny."]},"cap-cana":{"fr":["Cap Cana se trouve juste au sud de l’aéroport : une enclave avec marina, golfs, resorts de luxe et villas privées.","Les transferts y sont courts et agréables. Nous connaissons les accès resorts et adresses de villas pour éviter les taxis après un long vol.","Apprécié des couples, groupes de golf et voyageurs à la marina ou à Punta Espada qui veulent une arrivée calme porte-à-porte."],"de":["Cap Cana liegt direkt südlich vom Flughafen: ein Areal mit Marina, Golfplätzen, Luxusresorts und privaten Villen.","Transfers sind kurz und ruhig. Wir kennen Resort-Zufahrten und Villenadressen — kein Taxi-Stress nach dem Flug.","Beliebt bei Paaren, Golfgruppen und Gästen an der Marina oder Punta Espada, die eine ruhige Tür-zu-Tür-Ankunft wollen."],"pt":["Cap Cana fica logo a sul do aeroporto: um enclave com marina, golfe, resorts de luxo e villas privadas.","Os traslados são curtos e agradáveis. Conhecemos acessos de resorts e endereços de villas para não improvisar táxis após um voo longo.","Popular entre casais, grupos de golfe e quem fica na marina ou em Punta Espada e quer uma chegada calma porta a porta."],"it":["Cap Cana è subito a sud dell’aeroporto: un’enclave con marina, golf, resort di lusso e ville private.","I transfer sono brevi e panoramici. Conosciamo accessi ai resort e indirizzi delle ville così non cerchi taxi dopo un volo lungo.","Ammata da coppie, gruppi golf e chi soggiorna in marina o a Punta Espada e vuole un arrivo tranquillo porta a porta."],"ru":["Кап-Кана — сразу к югу от аэропорта: закрытая зона с мариной, гольфом, люксовыми курортами и частными виллами.","Трансферы короткие и спокойные. Мы знаем въезды на курорты и адреса вилл — без поиска такси после долгого перелёта.","Популярно у пар, гольф-групп и гостей марины или Пунта-Эспады, которым нужна спокойная доставка «от двери до двери»."],"zh":["卡普卡纳就在机场南侧：封闭社区，含码头、高尔夫、高端度假村与私人别墅。","车程短、风景好。我们熟悉度假村门禁与别墅地址，长途飞行后无需再找出租车。","适合情侣、高尔夫团体，以及住在码头或 Punta Espada 一带、希望安静门到门抵达的旅客。"],"nl":["Cap Cana ligt net ten zuiden van de luchthaven: een enclave met jachthaven, golfbanen, luxe resorts en privévilla’s.","Transfers zijn kort en rustig. We kennen resortpoorten en villa-adressen zodat je na een lange vlucht geen taxi’s hoeft te regelen.","Populair bij stellen, golfgroepen en gasten bij de marina of Punta Espada die een rustige deur-tot-deur aankomst willen."],"pl":["Cap Cana leży tuż na południe od lotniska: enklawa z mariną, polem golfowym, luksusowymi resortami i prywatnymi willami.","Transfery są krótkie i spokojne. Znamy bramy resortów i adresy willi — bez szukania taksówek po długim locie.","Popularne wśród par, grup golfowych i gości mariny lub Punta Espada, którzy chcą spokojnego drzwi-do-drzwi."]},"saona":{"fr":["Isla Saona est l’escapade classique à la journée depuis Punta Cana : plages de sable fin, ombre des palmiers et la célèbre piscine naturelle en eaux turquoise.","Nous assurons le transfert terrestre de votre resort au point d’embarquement sur la côte sud (souvent Bayahibe / quais proches) pour que la journée commence à l’heure avec le bateau groupe ou privé réservé.","Prenez une crème reef-safe, un peu d’espèces pour les collations à terre, et prévoyez une longue journée au soleil — nous coordonnons aller-retour pour ne pas rester sans transport après le bateau."],"de":["Isla Saona ist der klassische Tagesausflug aus der Region Punta Cana: feine Strände, Palmenschatten und der berühmte Naturpool im türkisen Flachwasser.","Wir übernehmen den Landtransfer vom Resort zum Einschiffungspunkt an der Südküste (meist Bayahibe / nahe Docks), damit Ihr Tag pünktlich mit dem gebuchten Gruppen- oder Privatboot startet.","Riffsichere Sonnencreme, Bargeld für Snacks an Land und ein langer Sonnentag — wir koordinieren Hin- und Rückfahrt, damit Sie nach dem Boot nicht ohne Transfer dastehen."],"pt":["Isla Saona é a escapada clássica de dia inteiro a partir da zona de Punta Cana: praias de areia fina, sombra de palmeiras e a famosa piscina natural em águas turquesa.","Cuidamos do traslado terrestre do resort até o ponto de embarque na costa sul (normalmente Bayahibe / cais próximos) para o dia começar a horas com o barco de grupo ou privado que reservou.","Leve protetor reef-safe, dinheiro para snacks em terra e prepare-se para um dia longo de sol — coordenamos ida e volta para não ficar sem transporte após o barco."],"it":["Isla Saona è la classica fuga di un giorno dall’area di Punta Cana: spiagge finissime, ombra di palme e la famosa piscina naturale in acque turchesi.","Gestiamo il transfer via terra dal resort al punto di imbarco sulla costa sud (di solito Bayahibe / moli vicini) così la giornata parte in orario con la barca di gruppo o privata prenotata.","Porta crema reef-safe, contanti per snack a terra e aspetta una lunga giornata di sole — coordiniamo andata e ritorno così non resti senza trasporto dopo la barca."],"ru":["Остров Саона — классический полный день из зоны Пунта-Каны: песок, пальмы и знаменитый природный бассейн в бирюзовой мели.","Мы делаем наземный трансфер от отеля до точки посадки на южном побережье (обычно Баяибе / ближайшие причалы), чтобы день начался вовремя с групповым или частным катером.","Возьмите reef-safe крем, наличные на перекусы на берегу и готовьтесь к длинному солнечному дню — согласуем туда и обратно, чтобы после катера не остаться без машины."],"zh":["萨奥纳岛是蓬塔卡纳一带经典的全日行程：细沙滩、棕榈树荫，以及碧蓝浅水中的天然泳池。","我们负责从度假村到南岸登船点（通常是 Bayahibe / 附近码头）的陆路接送，让您按预订的拼船或包船准时出发。","请带珊瑚友好防晒、岸上零食现金，并预留充足日照时间——我们协调往返，避免下船后无车可乘。"],"nl":["Isla Saona is de klassieke dagtrip vanuit de regio Punta Cana: fijne stranden, palmenschaduw en het beroemde natuurlijke zwembad in turquoise ondiep water.","Wij regelen de landtransfer van je resort naar het inschepingspunt aan de zuidkust (vaak Bayahibe / nabije steigers) zodat de dag op tijd start met de groeps- of privéboot die je boekte.","Neem reef-safe zonnebrand, cash voor snacks aan land en reken op een lange zonnige dag — we coördineren heen en terug zodat je na de boot niet zonder rit zit."],"pl":["Isla Saona to klasyczna całodniowa wycieczka z okolic Punta Cana: drobny piasek, cień palm i słynny naturalny basen w turkusowej mieliźnie.","Zapewniamy transfer lądowy z resortu do punktu zaokrętowania na południowym wybrzeżu (zwykle Bayahibe / pobliskie keje), by dzień zaczął się na czas z zarezerwowaną łodzią grupową lub prywatną.","Weź krem reef-safe, gotówkę na przekąski na lądzie i nastaw się na długi słoneczny dzień — koordynujemy dojazd i powrót, by po łodzi nie zostać bez transportu."]},"santo-domingo":{"fr":["Saint-Domingue est la capitale : la Zone coloniale (vieille ville UNESCO), musées, restaurants et l’aéroport international Las Américas (SDQ).","Depuis le corridor Punta Cana / Bávaro, le trajet dure en général 2½–3 heures sur autoroute. Nous proposons des transferts privés point à point vers hôtels en ville, correspondances cruise et vols à SDQ.","Confortable pour familles et groupes qui ne veulent pas louer de voiture — clim puissante, place pour les bagages et un chauffeur qui connaît les approches de la capitale."],"de":["Santo Domingo ist die Hauptstadt: die Kolonialzone (UNESCO-Altstadt), Museen, Restaurants und der Flughafen Las Américas (SDQ).","Vom Korridor Punta Cana / Bávaro dauert die Fahrt typisch 2½–3 Stunden auf der Autobahn. Wir fahren private Punkt-zu-Punkt-Transfers zu Stadthotels, Kreuzfahrtanschlüssen und SDQ-Flügen.","Bequem für Familien und Gruppen ohne Mietwagen — starke Klimaanlage, Gepäckraum und ein Fahrer, der die Zufahrten zur Hauptstadt kennt."],"pt":["Santo Domingo é a capital: a Zona Colonial (cidade antiga UNESCO), museus, gastronomia e o Aeroporto Internacional Las Américas (SDQ).","Do corredor Punta Cana / Bávaro a viagem costuma levar cerca de 2½–3 horas pela autoestrada. Fazemos traslados privados ponto a ponto para hotéis na cidade, conexões de cruzeiro e voos em SDQ.","Confortável para famílias e grupos que preferem não alugar carro — ar forte, espaço para malas e motorista que conhece os acessos à capital."],"it":["Santo Domingo è la capitale: la Zona Coloniale (città antica UNESCO), musei, ristoranti e l’aeroporto internazionale Las Américas (SDQ).","Dal corridoio Punta Cana / Bávaro il viaggio dura in genere 2½–3 ore in autostrada. Facciamo transfer privati punto a punto verso hotel in città, collegamenti crociera e voli a SDQ.","Comodo per famiglie e gruppi che non vogliono noleggiare auto — aria potente, spazio bagagli e un autista che conosce gli accessi alla capitale."],"ru":["Санто-Доминго — столица: Колониальная зона (старый город ЮНЕСКО), музеи, рестораны и аэропорт Лас-Америкас (SDQ).","От коридора Пунта-Кана / Баваро обычно 2½–3 часа по трассе. Мы делаем частные трансферы «точка–точка» к городским отелям, круизным стыковкам и рейсам SDQ.","Удобно семьям и группам без аренды авто — сильный кондиционер, место под багаж и водитель, знающий подъезды к столице."],"zh":["圣多明各是首都：殖民区（联合国教科文组织古城）、博物馆、餐饮，以及拉斯阿梅里卡斯国际机场（SDQ）。","从蓬塔卡纳 / 巴瓦罗走廊沿高速通常约 2½–3 小时。我们提供到市区酒店、邮轮衔接和 SDQ 航班的点对点专车。","适合不想租车的家庭与团体——强劲空调、充足行李空间，司机熟悉首都进出路线。"],"nl":["Santo Domingo is de hoofdstad: de Koloniale Zone (UNESCO-oude stad), musea, restaurants en Las Américas International Airport (SDQ).","Vanaf de corridor Punta Cana / Bávaro duurt de rit meestal zo’n 2½–3 uur over de snelweg. We rijden privé point-to-point naar stadshotels, cruise-aansluitingen en SDQ-vluchten.","Comfortabel voor gezinnen en groepen die geen auto willen huren — sterke airco, bagageruimte en een chauffeur die de toegangen tot de hoofdstad kent."],"pl":["Santo Domingo to stolica: Zona Colonial (starówka UNESCO), muzea, gastronomia i lotnisko Las Américas (SDQ).","Z korytarza Punta Cana / Bávaro dojazd zajmuje zwykle ok. 2½–3 godzin autostradą. Robimy prywatne transfery punkt–punkt do hoteli w mieście, połączeń wycieczkowców i lotów SDQ.","Wygodne dla rodzin i grup bez wynajmu auta — mocne A/C, miejsce na bagaż i kierowca, który zna dojazdy do stolicy."]}};

  var UI = {
    es: { explore: "Explorar {n}", open: "Ver ficha", rates: "Tarifas de la zona", book: "Reservar este traslado", from: "desde", perLeg: "por vía · por vehículo", hotels: "hoteles en el tarifario", hotelsIn: "hoteles en zona {z}", expect: "Qué te espera", transfer: "Tu traslado con Karún", prev: "Anterior", next: "Siguiente", close: "Cerrar", photoOf: "Foto {i} de {n}", pause: "Pausar recorrido", play: "Reanudar recorrido", jump: "Ir a", sample: "En el tarifario", more: "+{n} más", approx: "tiempo aprox. por carretera", dayTrip: "Día completo", dayTripSub: "salida temprano", airport: "Aeropuerto", dock: "Muelle", boat: "lancha", photo: "Foto", place: "Destino", of: "de", rateNote: "Tarifa oficial Karún · 1 vía, clase más económica", hint: "Desliza o toca una postal para ver su ficha", route: "Ruta", stageLabel: "Destino destacado", galleryLabel: "Galería de fotos" },
    en: { explore: "Explore {n}", open: "See details", rates: "Zone rates", book: "Book this transfer", from: "from", perLeg: "one way · per vehicle", hotels: "hotels on the rate sheet", hotelsIn: "hotels in {z} zone", expect: "What to expect", transfer: "Your Karún transfer", prev: "Previous", next: "Next", close: "Close", photoOf: "Photo {i} of {n}", pause: "Pause tour", play: "Resume tour", jump: "Go to", sample: "On the rate sheet", more: "+{n} more", approx: "approx. drive time", dayTrip: "Full day", dayTripSub: "early start", airport: "Airport", dock: "Dock", boat: "boat", photo: "Photo", place: "Destination", of: "of", rateNote: "Official Karún rate · one way, lowest class", hint: "Swipe, or tap a postcard for details", route: "Route", stageLabel: "Featured destination", galleryLabel: "Photo gallery" },
    fr: { explore: "Découvrir {n}", open: "Voir la fiche", rates: "Tarifs de la zone", book: "Réserver ce transfert", from: "dès", perLeg: "aller simple · par véhicule", hotels: "hôtels au tarif", hotelsIn: "hôtels zone {z}", expect: "Ce qui vous attend", transfer: "Votre transfert Karún", prev: "Précédent", next: "Suivant", close: "Fermer", photoOf: "Photo {i} sur {n}", pause: "Mettre en pause", play: "Reprendre", jump: "Aller à", sample: "Au tarif", more: "+{n} autres", approx: "durée approx. en voiture", dayTrip: "Journée", dayTripSub: "départ tôt", airport: "Aéroport", dock: "Quai", boat: "bateau", photo: "Photo", place: "Destination", of: "sur", rateNote: "Tarif officiel Karún · aller simple, classe la moins chère", hint: "Balayez ou touchez une carte postale", route: "Itinéraire", stageLabel: "Destination à la une", galleryLabel: "Galerie photos" },
    de: { explore: "{n} entdecken", open: "Details", rates: "Zonenpreise", book: "Diesen Transfer buchen", from: "ab", perLeg: "einfach · pro Fahrzeug", hotels: "Hotels in der Preisliste", hotelsIn: "Hotels in Zone {z}", expect: "Was Sie erwartet", transfer: "Ihr Karún-Transfer", prev: "Zurück", next: "Weiter", close: "Schließen", photoOf: "Foto {i} von {n}", pause: "Tour pausieren", play: "Tour fortsetzen", jump: "Gehe zu", sample: "In der Preisliste", more: "+{n} weitere", approx: "ca. Fahrzeit", dayTrip: "Ganzer Tag", dayTripSub: "früher Start", airport: "Flughafen", dock: "Anleger", boat: "Boot", photo: "Foto", place: "Ziel", of: "von", rateNote: "Offizieller Karún-Preis · einfach, günstigste Klasse", hint: "Wischen oder Postkarte antippen", route: "Route", stageLabel: "Ausgewähltes Ziel", galleryLabel: "Fotogalerie" },
    pt: { explore: "Explorar {n}", open: "Ver ficha", rates: "Tarifas da zona", book: "Reservar este traslado", from: "desde", perLeg: "por trecho · por veículo", hotels: "hotéis no tarifário", hotelsIn: "hotéis na zona {z}", expect: "O que esperar", transfer: "Seu traslado Karún", prev: "Anterior", next: "Próximo", close: "Fechar", photoOf: "Foto {i} de {n}", pause: "Pausar", play: "Retomar", jump: "Ir para", sample: "No tarifário", more: "+{n} mais", approx: "tempo aprox. de estrada", dayTrip: "Dia inteiro", dayTripSub: "saída cedo", airport: "Aeroporto", dock: "Cais", boat: "barco", photo: "Foto", place: "Destino", of: "de", rateNote: "Tarifa oficial Karún · 1 trecho, classe mais econômica", hint: "Deslize ou toque num postal", route: "Rota", stageLabel: "Destino em destaque", galleryLabel: "Galeria de fotos" },
    it: { explore: "Scopri {n}", open: "Vedi scheda", rates: "Tariffe della zona", book: "Prenota questo transfer", from: "da", perLeg: "solo andata · per veicolo", hotels: "hotel nel tariffario", hotelsIn: "hotel zona {z}", expect: "Cosa ti aspetta", transfer: "Il tuo transfer Karún", prev: "Precedente", next: "Successivo", close: "Chiudi", photoOf: "Foto {i} di {n}", pause: "Metti in pausa", play: "Riprendi", jump: "Vai a", sample: "Nel tariffario", more: "+{n} altri", approx: "tempo indicativo su strada", dayTrip: "Giornata intera", dayTripSub: "partenza presto", airport: "Aeroporto", dock: "Molo", boat: "barca", photo: "Foto", place: "Destinazione", of: "di", rateNote: "Tariffa ufficiale Karún · solo andata, classe più economica", hint: "Scorri o tocca una cartolina", route: "Percorso", stageLabel: "Destinazione in evidenza", galleryLabel: "Galleria foto" },
    ru: { explore: "Открыть: {n}", open: "Подробнее", rates: "Тарифы зоны", book: "Забронировать трансфер", from: "от", perLeg: "в одну сторону · за авто", hotels: "отелей в тарифе", hotelsIn: "отелей в зоне {z}", expect: "Что вас ждёт", transfer: "Ваш трансфер Karún", prev: "Назад", next: "Далее", close: "Закрыть", photoOf: "Фото {i} из {n}", pause: "Пауза", play: "Продолжить", jump: "Перейти", sample: "В тарифе", more: "ещё {n}", approx: "примерное время в пути", dayTrip: "Весь день", dayTripSub: "ранний выезд", airport: "Аэропорт", dock: "Причал", boat: "лодка", photo: "Фото", place: "Направление", of: "из", rateNote: "Официальный тариф Karún · в одну сторону, самый доступный класс", hint: "Листайте или нажмите на открытку", route: "Маршрут", stageLabel: "Избранное направление", galleryLabel: "Фотогалерея" },
    zh: { explore: "探索{n}", open: "查看详情", rates: "区域价格", book: "预订此接送", from: "起", perLeg: "单程 · 每车", hotels: "家酒店在价目表中", hotelsIn: "家酒店（{z}区）", expect: "精彩亮点", transfer: "您的 Karún 接送", prev: "上一个", next: "下一个", close: "关闭", photoOf: "第 {i} 张，共 {n} 张", pause: "暂停", play: "继续", jump: "前往", sample: "价目表中的酒店", more: "另有 {n} 家", approx: "约计车程", dayTrip: "全天", dayTripSub: "早出发", airport: "机场", dock: "码头", boat: "船", photo: "照片", place: "目的地", of: "/", rateNote: "Karún 官方价格 · 单程，最经济车型", hint: "滑动或点击明信片查看详情", route: "路线", stageLabel: "精选目的地", galleryLabel: "照片集" },
    nl: { explore: "Ontdek {n}", open: "Bekijk details", rates: "Tarieven zone", book: "Boek deze transfer", from: "vanaf", perLeg: "enkele reis · per voertuig", hotels: "hotels op de tarieflijst", hotelsIn: "hotels in zone {z}", expect: "Wat je kunt verwachten", transfer: "Jouw Karún-transfer", prev: "Vorige", next: "Volgende", close: "Sluiten", photoOf: "Foto {i} van {n}", pause: "Pauzeren", play: "Hervatten", jump: "Ga naar", sample: "Op de tarieflijst", more: "+{n} meer", approx: "geschatte rijtijd", dayTrip: "Hele dag", dayTripSub: "vroeg vertrek", airport: "Luchthaven", dock: "Steiger", boat: "boot", photo: "Foto", place: "Bestemming", of: "van", rateNote: "Officieel Karún-tarief · enkele reis, voordeligste klasse", hint: "Swipe of tik op een ansichtkaart", route: "Route", stageLabel: "Uitgelichte bestemming", galleryLabel: "Fotogalerij" },
    pl: { explore: "Odkryj: {n}", open: "Szczegóły", rates: "Ceny strefy", book: "Zarezerwuj transfer", from: "od", perLeg: "w jedną stronę · za pojazd", hotels: "hoteli w cenniku", hotelsIn: "hoteli w strefie {z}", expect: "Co Cię czeka", transfer: "Twój transfer Karún", prev: "Poprzedni", next: "Następny", close: "Zamknij", photoOf: "Zdjęcie {i} z {n}", pause: "Wstrzymaj", play: "Wznów", jump: "Przejdź do", sample: "W cenniku", more: "+{n} więcej", approx: "przybliżony czas jazdy", dayTrip: "Cały dzień", dayTripSub: "wczesny start", airport: "Lotnisko", dock: "Przystań", boat: "łódź", photo: "Zdjęcie", place: "Cel", of: "z", rateNote: "Oficjalna cena Karún · w jedną stronę, najtańsza klasa", hint: "Przesuń lub dotknij pocztówki", route: "Trasa", stageLabel: "Wyróżniony cel", galleryLabel: "Galeria zdjęć" }
  };
  var TIME_UNITS = { ru: { min: "мин", h: "ч" }, zh: { min: "分钟", h: "小时" } };
  var TIME_NOTE = {
    fr: { PUJ: "depuis PUJ", SDQ: "depuis SDQ", dock: "au quai de Bayahibe", air: "arrivées, tout vol" },
    de: { PUJ: "ab PUJ", SDQ: "ab SDQ", dock: "zum Anleger Bayahibe", air: "Ankünfte, jeder Flug" },
    pt: { PUJ: "desde PUJ", SDQ: "desde SDQ", dock: "ao cais de Bayahibe", air: "chegadas, qualquer voo" },
    it: { PUJ: "da PUJ", SDQ: "da SDQ", dock: "al molo di Bayahibe", air: "arrivi, ogni volo" },
    ru: { PUJ: "из PUJ", SDQ: "из SDQ", dock: "до причала Байяибе", air: "прилёты, любой рейс" },
    zh: { PUJ: "自 PUJ", SDQ: "自 SDQ", dock: "至巴亚希贝码头", air: "任何航班接机" },
    nl: { PUJ: "vanaf PUJ", SDQ: "vanaf SDQ", dock: "naar steiger Bayahibe", air: "aankomsten, elke vlucht" },
    pl: { PUJ: "z PUJ", SDQ: "z SDQ", dock: "do przystani Bayahibe", air: "przyloty, każdy lot" }
  };

  /* ------------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------------ */
  var D = document, W = window, HTML = D.documentElement;
  var RM = false;
  try { RM = W.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var ROOT = "assets/destinations/";
  var N = DEST.length;

  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fill(t, o) { return String(t).replace(/\{(\w)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function lang() {
    var l = $("#dc-root .lm[data-lang]") || $(".lm[data-lang]:not(#k25-dd-root)");
    var v = (l && l.getAttribute("data-lang")) || "es";
    return UI[v] ? v : "en";
  }
  function ui() { return UI[lang()] || UI.en; }
  function rich(l) { return l === "es" || l === "en"; }
  function fmtTime(s, l) {
    var u = TIME_UNITS[l];
    var out = String(s);
    if (u) out = out.replace(/\bmin\b/, u.min).replace(/\bh\b/, u.h);
    if (l !== "en" && l !== "zh") out = out.replace(/(\d)\.(\d)/g, "$1,$2");
    return out;
  }
  function copyOf(d, l) {
    l = l || lang();
    if (rich(l)) {
      var c = d[l];
      return { name: c.name, short: c.short || c.name, tag: c.tag, lede: c.lede, items: c.items, why: c.why, paras: null, timeNote: c.time };
    }
    var m = (MORE[d.slug] || {})[l];
    var en = d.en;
    if (!m) return copyOf(d, "en");
    var paras = m[2] || (OLD_PARAS[d.slug] && OLD_PARAS[d.slug][l]) || [en.lede];
    var tn = TIME_NOTE[l] || {};
    var note = d.airport ? tn.air : (d.island ? tn.dock : tn[d.origin]);
    return { name: m[0], short: m[0].replace(/\s*\(PUJ\)$/, ""), tag: m[1], lede: paras[0], items: null, why: paras.slice(1).join(" "), paras: paras, timeNote: note || en.time };
  }
  function photos(d) {
    return (PHOTOS[d.slug] || []).map(function (p) {
      return { src: ROOT + d.slug + "/" + p[0], w: p[1], h: p[2], author: p[3], license: p[4], page: p[5] };
    });
  }
  function usd(n) { return "US$" + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)); }

  /* tarifario facts (live, never hard-coded) */
  var tarCache = {};
  function tariff(d) {
    if (tarCache[d.slug]) return tarCache[d.slug];
    var T = W.KRN_TARIFARIO; if (!T || !T.origins) return null;
    var og = null;
    T.origins.forEach(function (o) { if (o.id === d.origin) og = o; });
    if (!og) return null;
    var zs = og.zones.filter(function (z) { return d.zones.indexOf(z.id) >= 0; });
    if (!zs.length) return null;
    var hotels = [], min = Infinity;
    zs.forEach(function (z) {
      z.hotels.forEach(function (h) {
        hotels.push(h.name);
        Object.keys(h.fares || {}).forEach(function (k) { var v = +h.fares[k]; if (v > 0 && v < min) min = v; });
      });
    });
    var first = zs.filter(function (z) { return z.id === d.zones[0]; })[0] || zs[0];
    var r = { count: hotels.length, from: isFinite(min) ? min : null, names: hotels, zone: first.name, zoneId: first.id, zoneNames: zs.map(function (z) { return z.name; }) };
    tarCache[d.slug] = r;
    return r;
  }

  /* ------------------------------------------------------------------
     MINI COAST LOCATOR — simplified east-of-Hispaniola coastline
     projected from real lon/lat (stylised, not a navigation map).
     ------------------------------------------------------------------ */
  var LOC_W = 320, LOC_H = 200;
  function proj(ll) { return [((ll[0] + 70.05) / 1.80) * LOC_W, ((19.10 - ll[1]) / 1.06) * LOC_H]; }
  var COAST = [[-70.05, 18.40], [-69.97, 18.43], [-69.90, 18.465], [-69.80, 18.462], [-69.70, 18.44], [-69.645, 18.415], [-69.61, 18.44], [-69.50, 18.425], [-69.43, 18.42], [-69.30, 18.445], [-69.20, 18.43], [-69.10, 18.40], [-68.97, 18.405], [-68.92, 18.385], [-68.84, 18.36], [-68.83, 18.30], [-68.87, 18.25], [-68.80, 18.235], [-68.70, 18.25], [-68.62, 18.30], [-68.60, 18.37], [-68.52, 18.40], [-68.45, 18.43], [-68.40, 18.46], [-68.36, 18.51], [-68.33, 18.56], [-68.32, 18.61], [-68.37, 18.645], [-68.43, 18.69], [-68.47, 18.73], [-68.53, 18.77], [-68.60, 18.81], [-68.70, 18.87], [-68.85, 18.93], [-69.04, 18.98], [-69.20, 19.02], [-69.39, 19.07], [-69.42, 19.10], [-70.05, 19.10]];
  var SAONA = [[-68.93, 18.20], [-68.85, 18.215], [-68.75, 18.205], [-68.62, 18.19], [-68.57, 18.16], [-68.62, 18.125], [-68.75, 18.11], [-68.87, 18.135], [-68.93, 18.17]];
  var AIR = { PUJ: [-68.363, 18.567], SDQ: [-69.67, 18.43] };
  function poly(pts) { return pts.map(function (p, i) { var q = proj(p); return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join("") + "Z"; }
  function curve(a, b, bend) {
    var p = proj(a), q = proj(b), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    var dx = q[0] - p[0], dy = q[1] - p[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = (bend == null ? 0.22 : bend) * len;
    var cx = mx + (-dy / len) * k, cy = my + (dx / len) * k;
    return "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + q[0].toFixed(1) + " " + q[1].toFixed(1);
  }
  function locatorSvg() {
    var dots = DEST.map(function (d, i) {
      var q = proj(d.ll);
      return '<g class="k25-lm" data-i="' + i + '" transform="translate(' + q[0].toFixed(1) + " " + q[1].toFixed(1) + ')"><circle class="r" r="9"/><circle class="d" r="3.2"/></g>';
    }).join("");
    var air = Object.keys(AIR).map(function (k) {
      var q = proj(AIR[k]);
      var off = k === "PUJ" ? [-30, -14] : [0, 17];
      return '<g class="k25-la" data-air="' + k + '" transform="translate(' + q[0].toFixed(1) + " " + q[1].toFixed(1) + ')"><circle class="ad" r="4.4"/><g transform="translate(' + off[0] + " " + off[1] + ')"><rect x="-14" y="-7.5" width="28" height="15" rx="7.5"/><text y="3.4" text-anchor="middle">' + k + "</text></g></g>";
    }).join("");
    return '<svg viewBox="0 0 ' + LOC_W + " " + LOC_H + '" preserveAspectRatio="xMidYMid meet" focusable="false">' +
      '<defs><pattern id="k25-sea" width="18" height="10" patternUnits="userSpaceOnUse"><path d="M0 6 Q4.5 2 9 6 T18 6" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1"/></pattern></defs>' +
      '<rect width="' + LOC_W + '" height="' + LOC_H + '" fill="url(#k25-sea)"/>' +
      '<path class="k25-l-foam" d="' + poly(COAST) + '"/><path class="k25-l-land" d="' + poly(COAST) + '"/>' +
      '<path class="k25-l-foam" d="' + poly(SAONA) + '"/><path class="k25-l-land" d="' + poly(SAONA) + '"/>' +
      '<path class="k25-l-route" data-k25-route d=""/><path class="k25-l-boat" data-k25-boat d=""/>' +
      '<text class="k25-l-sea" x="252" y="36">Atlántico</text><text class="k25-l-sea" x="30" y="186">Caribe</text>' +
      air + dots +
      '<g class="k25-l-van" data-k25-van><circle r="4.2"/></g></svg>';
  }

  /* inline icons */
  var ICON = {
    palm: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c0-5 .6-8.4 2-11"/><path d="M14 10c-2.6-2.4-6-2.7-9-1.2 2.7.2 4.9 1 6.6 2.4"/><path d="M14 10c1.3-3.1 4.3-4.4 7.4-4-2.3.9-3.9 2.3-5 4.2"/><path d="M14 10c3 .1 5.5 1.9 6.4 4.8-1.6-1.6-3.6-2.5-5.8-2.7"/><path d="M14 10c-1.2-2.6-1-5.4.6-7.6-.3 2.2.1 4.3 1 6.3"/><path d="M6 21h12"/></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    van: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16V8a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v4h-2"/><path d="M3 16h2"/><path d="M9 16h6"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/><path d="M14 6v4h4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V9l7.5 4.5v2L13.5 13v4.5l2.5 2V21L12 20l-4 1v-1.5l2.5-2V13L3 15.5v-2L10.5 9z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>'
  };
  var ITEM_ICONS = ["palm", "wave", "sun", "pin"];

  /* ------------------------------------------------------------------
     STAGE + POSTCARD RAIL (lives inside the empty React host
     <div data-k25-dest></div> — React never renders children there)
     ------------------------------------------------------------------ */
  var S = { host: null, i: 0, lang: null, playing: !RM, userPaused: false, inView: false, timer: 0, t0: 0, dwell: 7000, hover: false, loaded: {} };

  function waveSvg(cls, color) {
    return '<svg class="' + cls + '" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path class="a" d="M0 42 C 180 12 360 70 540 44 S 900 8 1080 40 S 1320 70 1440 38 V90 H0Z"/>' +
      '<path class="b" d="M0 58 C 200 30 380 84 600 60 S 960 28 1160 56 S 1360 80 1440 60 V90 H0Z"' + (color ? ' fill="' + color + '"' : "") + "/>" +
      '<path class="f" d="M0 58 C 200 30 380 84 600 60 S 960 28 1160 56 S 1360 80 1440 60" fill="none"/></svg>';
  }

  function cardMeta(d, l, u) {
    if (d.airport) return d.time + " · " + u.airport;
    if (d.island) return u.dayTrip + " · " + u.boat;
    return fmtTime(d.time, l) + " · " + d.origin;
  }
  function railStep(dir) {
    var h = S.host; var rail = h && $("[data-k25-rail]", h); if (!rail) return;
    var by = Math.max(200, rail.clientWidth * 0.7) * dir;
    try { rail.scrollBy({ left: by, behavior: RM ? "auto" : "smooth" }); } catch (e) { rail.scrollLeft += by; }
  }
  function syncRailArrows() {
    var h = S.host; var rail = h && $("[data-k25-rail]", h); if (!rail) return;
    var a = $('[data-k25-rstep="-1"]', h), b = $('[data-k25-rstep="1"]', h);
    if (a) a.disabled = rail.scrollLeft <= 4;
    if (b) b.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
  }
  function shell() {
    var u = ui();
    var chips = Object.keys(REGIONS).map(function (k) {
      var cnt = DEST.filter(function (d) { return d.region === k; }).length;
      return '<button type="button" class="k25-reg" data-k25-reg="' + k + '"><i aria-hidden="true"></i><span>' + esc(REGIONS[k][lang()] || REGIONS[k].en) + "</span><b>" + cnt + "</b></button>";
    }).join("");
    var cards = DEST.map(function (d, i) {
      var c = copyOf(d), l = lang();
      return '<div class="k25-cardcell" role="listitem"><button type="button" class="k25-card" data-k25-card="' + i + '" data-region="' + d.region + '" aria-haspopup="dialog" aria-label="' + esc(c.name + " — " + u.open) + '">' +
        '<span class="k25-card-img"><img src="' + ROOT + d.slug + '/k25-card.jpg" alt="" loading="lazy" decoding="async" width="720" height="480" style="object-position:' + d.focus + '"></span>' +
        '<span class="k25-card-stamp" aria-hidden="true"><span>Nº</span>' + pad(i + 1) + "</span>" +
        '<span class="k25-card-cap"><span class="k25-card-name">' + esc(c.short) + '</span><span class="k25-card-meta">' + esc(cardMeta(d, l, u)) + "</span></span>" +
        '<span class="k25-card-go" aria-hidden="true">' + ICON.arrow + "</span></button></div>";
    }).join("");
    return '<div class="k25-stage" data-k25-stage role="group" aria-roledescription="carousel" aria-label="' + esc(u.stageLabel) + '">' +
      '<div class="k25-st-media" data-k25-media></div>' +
      '<div class="k25-st-shade" aria-hidden="true"></div>' +
      '<div class="k25-st-top"><span class="k25-st-chip"><i aria-hidden="true"></i><span data-k25-regname></span></span>' +
      '<button type="button" class="k25-st-play" data-k25-play aria-pressed="false"></button></div>' +
      '<div class="k25-st-copy" data-k25-copy></div>' +
      '<figure class="k25-loc" aria-hidden="true">' + locatorSvg() + '<figcaption data-k25-loccap></figcaption></figure>' +
      '<div class="k25-st-nav"><button type="button" class="k25-st-arrow" data-k25-step="-1" aria-label="' + esc(u.prev) + '">' + ICON.left + "</button>" +
      '<div class="k25-st-count" aria-hidden="true"><b data-k25-now>01</b><span>/ ' + pad(N) + '</span><i><em data-k25-bar></em></i></div>' +
      '<button type="button" class="k25-st-arrow" data-k25-step="1" aria-label="' + esc(u.next) + '">' + ICON.right + "</button></div>" +
      '<a class="k25-st-credit" data-k25-credit target="_blank" rel="noopener noreferrer"></a>' +
      waveSvg("k25-st-tide") +
      '<p class="k25-sr" aria-live="polite" data-k25-live></p>' +
      "</div>" +
      '<div class="k25-rail-wrap"><div class="k25-regs" role="group" aria-label="' + esc(u.jump) + '">' + chips + "</div>" +
      '<div class="k25-rail-arrows"><button type="button" class="k25-rail-arrow" data-k25-rstep="-1" aria-label="' + esc(u.prev) + '">' + ICON.left + '</button><button type="button" class="k25-rail-arrow" data-k25-rstep="1" aria-label="' + esc(u.next) + '">' + ICON.right + "</button></div>" +
      '<div class="k25-rail" data-k25-rail role="list">' + cards + "</div>" +
      '<p class="k25-hint">' + esc(u.hint) + "</p></div>";
  }

  function factsHtml(d, c, u, l, cls) {
    var t = tariff(d);
    var f1 = '<li><b>' + esc(fmtTime(d.time, l)) + "</b><small>" + esc(c.timeNote) + "</small></li>";
    var f2 = d.island
      ? '<li><b>' + esc(u.dayTrip) + "</b><small>" + esc(u.dayTripSub) + "</small></li>"
      : (t ? '<li><b>' + t.count + "</b><small>" + esc(d.zones.length > 1 ? u.hotels : fill(u.hotelsIn, { z: t.zone })) + "</small></li>" : "");
    var f3 = t && t.from != null ? '<li class="k25-f-price"><b><small>' + esc(u.from) + "</small>" + usd(t.from) + "</b><small>" + esc(u.perLeg) + "</small></li>" : "";
    return '<ul class="' + cls + '">' + f1 + f2 + f3 + "</ul>";
  }

  function splitWords(s) {
    return String(s).split(/\s+/).map(function (w, i) { return '<span class="w" style="--d:' + i + '"><span>' + esc(w) + "</span></span>"; }).join(" ");
  }

  function renderCopy(animate) {
    var h = S.host; if (!h) return;
    var d = DEST[S.i], l = lang(), u = ui(), c = copyOf(d, l);
    var box = $("[data-k25-copy]", h); if (!box) return;
    box.innerHTML =
      '<p class="k25-st-tag">' + esc(c.tag) + "</p>" +
      '<h3 class="k25-st-title">' + splitWords(c.short) + "</h3>" +
      '<p class="k25-st-lede">' + esc(c.lede) + "</p>" +
      factsHtml(d, c, u, l, "k25-facts") +
      '<div class="k25-st-cta"><button type="button" class="k25-btn k25-btn-sand" data-k25-open="' + S.i + '" aria-haspopup="dialog">' + esc(fill(u.explore, { n: c.short })) + ICON.arrow + "</button>" +
      '<button type="button" class="k25-btn k25-btn-glass" data-k25-rates="' + S.i + '">' + esc(u.rates) + "</button></div>";
    box.classList.remove("is-in"); void box.offsetWidth;
    if (animate && !RM) box.classList.add("is-in");
    var rn = $("[data-k25-regname]", h); if (rn) rn.textContent = (REGIONS[d.region][l] || REGIONS[d.region].en) + " · " + pad(S.i + 1) + " / " + pad(N);
    var now = $("[data-k25-now]", h); if (now) now.textContent = pad(S.i + 1);
    var live = $("[data-k25-live]", h); if (live) live.textContent = pad(S.i + 1) + " " + u.of + " " + N + ": " + c.name;
    var ph = photos(d)[0], cr = $("[data-k25-credit]", h);
    if (cr && ph) { cr.href = ph.page; cr.textContent = u.photo + ": " + ph.author + " · " + ph.license; }
    h.setAttribute("data-k25-slug", d.slug);
    h.style.setProperty("--k25-focus", d.focus);
    // rail + chips state
    $$("[data-k25-card]", h).forEach(function (b) { var on = +b.getAttribute("data-k25-card") === S.i; b.classList.toggle("is-on", on); if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    $$("[data-k25-reg]", h).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k25-reg") === d.region ? "true" : "false"); });
    renderLocator();
  }

  function renderLocator() {
    var h = S.host; if (!h) return;
    var d = DEST[S.i], l = lang(), u = ui();
    $$(".k25-lm", h).forEach(function (g) { g.classList.toggle("is-on", +g.getAttribute("data-i") === S.i); });
    $$(".k25-la", h).forEach(function (g) { g.classList.toggle("is-on", g.getAttribute("data-air") === d.origin); });
    var route = $("[data-k25-route]", h), boat = $("[data-k25-boat]", h), van = $("[data-k25-van]", h);
    var from = AIR[d.origin];
    var to = d.island ? DEST.filter(function (x) { return x.slug === "bayahibe"; })[0].ll : d.ll;
    var dPath = d.airport ? "" : curve(from, to, d.origin === "SDQ" ? -0.3 : 0.24);
    if (route) {
      route.setAttribute("d", dPath);
      if (!RM && dPath) {
        try { var len = route.getTotalLength(); route.style.strokeDasharray = len + " " + len; route.style.strokeDashoffset = len; void route.getBoundingClientRect(); route.style.transition = "stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)"; route.style.strokeDashoffset = "0"; } catch (e) {}
      } else { route.style.strokeDasharray = ""; route.style.strokeDashoffset = ""; }
    }
    if (boat) boat.setAttribute("d", d.island ? curve(to, d.ll, 0.35) : "");
    if (van) {
      var end = proj(d.airport ? from : d.ll);
      van.setAttribute("transform", "translate(" + end[0].toFixed(1) + " " + end[1].toFixed(1) + ")");
    }
    var cap = $("[data-k25-loccap]", h);
    if (cap) cap.innerHTML = d.airport ? '<span class="pl">' + ICON.plane + "</span>" + esc(u.airport) + " · PUJ" :
      '<span class="pl">' + ICON.plane + "</span>" + esc(d.origin) + ' <i aria-hidden="true">→</i> ' + esc(copyOf(d, l).short) + (d.island ? ' <em>(' + esc(u.boat) + ")</em>" : "");
  }

  function renderMedia(dir, animate) {
    var h = S.host; if (!h) return;
    var box = $("[data-k25-media]", h); if (!box) return;
    var d = DEST[S.i], ph = photos(d)[0];
    var layer = D.createElement("div");
    layer.className = "k25-st-layer";
    var img = D.createElement("img");
    img.src = ph.src; img.alt = ""; img.decoding = "async"; img.draggable = false;
    img.style.objectPosition = d.focus;
    layer.appendChild(img);
    var old = $$(".k25-st-layer", box);
    if (animate && !RM) {
      layer.classList.add("is-enter"); layer.style.setProperty("--dir", dir < 0 ? "-1" : "1");
      var go = function () {
        box.appendChild(layer);
        setTimeout(function () { old.forEach(function (o) { if (o.parentNode === box) box.removeChild(o); }); layer.classList.remove("is-enter"); }, 1250);
      };
      if (img.complete) go(); else { var done = false; var f = function () { if (done) return; done = true; go(); }; img.onload = f; img.onerror = f; setTimeout(f, 900); }
    } else {
      old.forEach(function (o) { box.removeChild(o); });
      box.appendChild(layer);
    }
    // preload neighbour
    var nx = DEST[(S.i + 1) % N]; var pre = new Image(); pre.src = ROOT + nx.slug + "/" + PHOTOS[nx.slug][0][0];
  }

  function scrollRailTo(i, smooth) {
    var h = S.host; if (!h) return;
    var rail = $("[data-k25-rail]", h), card = $('[data-k25-card="' + i + '"]', h);
    if (!rail || !card) return;
    var cell = card.parentNode;
    var target = cell.offsetLeft - (rail.clientWidth - cell.clientWidth) / 2;
    try { rail.scrollTo({ left: Math.max(0, target), behavior: smooth && !RM ? "smooth" : "auto" }); } catch (e) { rail.scrollLeft = Math.max(0, target); }
  }

  function select(i, opts) {
    opts = opts || {};
    var prev = S.i;
    S.i = ((i % N) + N) % N;
    if (prev === S.i && !opts.force) return;
    var dir = opts.dir || (S.i > prev ? 1 : -1);
    renderMedia(dir, !opts.instant);
    renderCopy(!opts.instant);
    if (!opts.noRail) scrollRailTo(S.i, true);
    restartTimer();
  }

  /* autoplay tour — only while visible, never with reduced motion, pausable */
  function canPlay() { return !RM && S.playing && !S.userPaused && S.inView && !S.hover && !DD.open && !D.hidden; }
  function restartTimer() {
    clearTimeout(S.timer);
    var h = S.host; var bar = h && $("[data-k25-bar]", h);
    if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    if (h) h.classList.toggle("is-playing", canPlay());
    if (!canPlay()) return;
    S.timer = setTimeout(function () { if (canPlay()) select(S.i + 1, { dir: 1 }); }, S.dwell);
  }
  function syncPlayBtn() {
    var h = S.host; var b = h && $("[data-k25-play]", h); if (!b) return;
    var u = ui(), on = !S.userPaused && !RM;
    b.hidden = RM;
    b.setAttribute("aria-pressed", on ? "false" : "true");
    b.setAttribute("aria-label", on ? u.pause : u.play);
    b.innerHTML = (on ? ICON.pause : ICON.play) + '<span>' + esc(on ? u.pause : u.play) + "</span>";
  }

  function mount(host) {
    S.host = host;
    S.lang = lang();
    host.innerHTML = shell();
    host.setAttribute("data-k25-on", "1");
    if (RM) host.classList.add("k25-rm");
    renderMedia(1, false);
    renderCopy(false);
    syncPlayBtn();
    bindHost(host);
    setTimeout(function () { scrollRailTo(S.i, false); syncRailArrows(); }, 60);
    observeView(host);
    restartTimer();
    onScroll();
  }

  function relang() {
    if (!S.host) return;
    var l = lang(); if (l === S.lang) return;
    S.lang = l;
    var keep = S.i;
    S.host.innerHTML = shell();
    S.i = keep;
    renderMedia(1, false); renderCopy(false); syncPlayBtn();
    setTimeout(function () { scrollRailTo(S.i, false); }, 30);
    if (DD.open) ddRender(DD.i, false);
  }

  function bindHost(host) {
    if (host._k25bound) return;
    host._k25bound = true;
    host.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.closest) return;
      var card = t.closest("[data-k25-card]");
      if (card) { var ci = +card.getAttribute("data-k25-card"); S.userPaused = S.userPaused || false; select(ci, { noRail: false }); openDD(ci, card); return; }
      var op = t.closest("[data-k25-open]");
      if (op) { openDD(+op.getAttribute("data-k25-open"), op); return; }
      var rt = t.closest("[data-k25-rates]");
      if (rt) { goRates(DEST[+rt.getAttribute("data-k25-rates")]); return; }
      var st = t.closest("[data-k25-step]");
      if (st) { S.userPaused = true; syncPlayBtn(); select(S.i + (+st.getAttribute("data-k25-step")), { dir: +st.getAttribute("data-k25-step") }); return; }
      var rs = t.closest("[data-k25-rstep]");
      if (rs) { railStep(+rs.getAttribute("data-k25-rstep")); return; }
      var pl = t.closest("[data-k25-play]");
      if (pl) { S.userPaused = !S.userPaused; syncPlayBtn(); restartTimer(); return; }
      var rg = t.closest("[data-k25-reg]");
      if (rg) {
        var k = rg.getAttribute("data-k25-reg"), idx = 0;
        for (var j = 0; j < N; j++) if (DEST[j].region === k) { idx = j; break; }
        S.userPaused = true; syncPlayBtn();
        select(idx, { force: true });
        return;
      }
      var media = t.closest(".k25-st-media,.k25-st-shade");
      if (media) openDD(S.i, null);
    });
    var rsT = 0;
    host.addEventListener("scroll", function () { clearTimeout(rsT); rsT = setTimeout(syncRailArrows, 80); }, true);
    host.addEventListener("keydown", function (e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest("[data-k25-stage]")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (t.tagName === "A") return;
        e.preventDefault(); S.userPaused = true; syncPlayBtn();
        select(S.i + (e.key === "ArrowRight" ? 1 : -1), { dir: e.key === "ArrowRight" ? 1 : -1 });
      }
    });
    // hover / focus pause (resumes on leave)
    host.addEventListener("mouseover", function (e) { var st = e.target.closest && e.target.closest("[data-k25-stage]"); var was = S.hover; S.hover = !!st; if (was !== S.hover) restartTimer(); });
    host.addEventListener("mouseleave", function () { if (S.hover) { S.hover = false; restartTimer(); } });
    host.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest("[data-k25-stage]")) { S.hover = true; restartTimer(); } });
    host.addEventListener("focusout", function (e) { if (!e.relatedTarget || !(e.relatedTarget.closest && e.relatedTarget.closest("[data-k25-stage]"))) { S.hover = false; restartTimer(); } });
    // swipe on the stage
    var sx = 0, sy = 0, sw = false;
    host.addEventListener("touchstart", function (e) {
      var st = e.target.closest && e.target.closest("[data-k25-stage]"); if (!st || e.target.closest(".k25-st-cta,.k25-st-nav")) { sw = false; return; }
      sw = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    host.addEventListener("touchend", function (e) {
      if (!sw) return; sw = false;
      var t = e.changedTouches && e.changedTouches[0]; if (!t) return;
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { S.userPaused = true; syncPlayBtn(); select(S.i + (dx < 0 ? 1 : -1), { dir: dx < 0 ? 1 : -1 }); }
    }, { passive: true });
  }

  var io = null;
  function observeView(host) {
    if (!("IntersectionObserver" in W)) { S.inView = true; return; }
    if (io) try { io.disconnect(); } catch (e) {}
    var st = $("[data-k25-stage]", host); if (!st) return;
    io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { S.inView = x.isIntersecting && x.intersectionRatio > 0.35; });
      restartTimer();
    }, { threshold: [0, 0.35, 0.6] });
    io.observe(st);
  }

  /* scroll-linked arrival: the stage frame opens up as it scrolls in */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = S.host; if (!h || RM) return;
      var st = $("[data-k25-stage]", h); if (!st) return;
      var r = st.getBoundingClientRect(), vh = W.innerHeight || HTML.clientHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = clamp((vh - r.top) / (vh * 0.75), 0, 1);
      st.style.setProperty("--k25-in", p.toFixed(3));
      var par = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
      st.style.setProperty("--k25-par", par.toFixed(3));
    });
  }

  /* rates / booking bridges (reuse the live tarifario UI — no fork) */
  function goRates(d) {
    closeDD(true);
    var t = tariff(d);
    var og = $('[data-krn-rateorigin="' + d.origin + '"]');
    if (og && og.getAttribute("aria-pressed") !== "true") og.click();
    setTimeout(function () {
      var sel = D.getElementById("krn-zone-filter");
      if (sel && t) { sel.value = t.zoneId; sel.dispatchEvent(new Event("change", { bubbles: true })); }
      var rs = D.getElementById("rates-search");
      if (rs) rs.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });
    }, 60);
  }
  function goBook() {
    closeDD(true);
    setTimeout(function () { var el = D.getElementById("reservar"); if (el) el.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }, 40);
  }

  /* ------------------------------------------------------------------
     DETAIL SHEET ("ficha") — body-level host, outside React.
     Centered island on every size; page scroll locked while open.
     ------------------------------------------------------------------ */
  var DD = { open: false, i: 0, g: 0, len: 0, timer: 0, paused: false, ret: null, lock: null, root: null };

  function ddRoot() {
    var r = D.getElementById("k25-dd-root");
    if (r) return (DD.root = r);
    r = D.createElement("div");
    r.id = "k25-dd-root";
    r.className = "k25-dd";
    r.setAttribute("data-open", "false");
    r.hidden = true;
    r.innerHTML =
      '<div class="k25-dd-back" data-k25-x></div>' +
      '<div class="k25-dd-sheet" role="dialog" aria-modal="true" aria-labelledby="k25-dd-title" tabindex="-1">' +
      '<button type="button" class="k25-dd-x" data-k25-x>' + ICON.x + "</button>" +
      '<div class="k25-dd-gal" data-k25-gal role="group" aria-roledescription="carousel">' +
      '<div class="k25-dd-slides" data-k25-slides></div><div class="k25-dd-gshade" aria-hidden="true"></div>' +
      '<button type="button" class="k25-dd-garrow l" data-k25-g="-1">' + ICON.left + '</button><button type="button" class="k25-dd-garrow r" data-k25-g="1">' + ICON.right + "</button>" +
      '<div class="k25-dd-gfoot"><div class="k25-dd-dots" data-k25-dots></div><a class="k25-dd-credit" data-k25-dcredit target="_blank" rel="noopener noreferrer"></a></div>' +
      '<div class="k25-dd-prog" aria-hidden="true"><span data-k25-gbar></span></div>' +
      waveSvg("k25-dd-tide") + "</div>" +
      '<div class="k25-dd-body" data-k25-body></div></div>';
    D.body.appendChild(r);
    DD.root = r;
    bindDD(r);
    return r;
  }

  function ddRender(i, animate) {
    var r = ddRoot(), d = DEST[i], l = lang(), u = ui(), c = copyOf(d, l), t = tariff(d), ph = photos(d);
    DD.i = i; DD.len = ph.length; DD.g = 0;
    r.setAttribute("data-lang", l);
    r.setAttribute("data-k25-slug", d.slug);
    $(".k25-dd-x", r).setAttribute("aria-label", u.close);
    $('[data-k25-g="-1"]', r).setAttribute("aria-label", u.prev);
    $('[data-k25-g="1"]', r).setAttribute("aria-label", u.next);
    $("[data-k25-gal]", r).setAttribute("aria-label", u.galleryLabel + " — " + c.name);
    var slides = $("[data-k25-slides]", r), dots = $("[data-k25-dots]", r);
    slides.innerHTML = ph.map(function (p, k) {
      return '<figure class="k25-dd-slide' + (k === 0 ? " is-on" : "") + '" aria-hidden="' + (k === 0 ? "false" : "true") + '"><img src="' + p.src + '" alt="' + esc(c.name + " — " + fill(u.photoOf, { i: k + 1, n: ph.length })) + '" decoding="async" draggable="false" width="' + p.w + '" height="' + p.h + '"' + (k > 1 ? ' loading="lazy"' : "") + "></figure>";
    }).join("");
    dots.innerHTML = ph.map(function (p, k) {
      return '<button type="button" data-k25-dot="' + k + '" aria-label="' + esc(fill(u.photoOf, { i: k + 1, n: ph.length })) + '"' + (k === 0 ? ' aria-current="true"' : "") + "><img src=\"" + ROOT + d.slug + "/" + (k === 0 ? "k25-card.jpg" : PHOTOS[d.slug][k][0]) + '" alt="" loading="lazy" decoding="async"></button>';
    }).join("");
    var body = $("[data-k25-body]", r);
    var lis = c.items ? c.items.map(function (it, k) { return "<li>" + ICON[ITEM_ICONS[k % ITEM_ICONS.length]] + "<span>" + esc(it) + "</span></li>"; }).join("") : "";
    var hotels = "";
    if (t && !d.airport && t.names.length) {
      var show = t.names.slice(0, 3).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
      var more = t.names.length > 3 ? '<li class="more">' + esc(fill(u.more, { n: t.names.length - 3 })) + "</li>" : "";
      hotels = '<div class="k25-dd-hotels"><small>' + esc(u.sample) + (d.island ? " · " + esc(t.zone) : "") + "</small><ul>" + show + more + "</ul></div>";
    } else if (t && d.airport) {
      hotels = '<div class="k25-dd-hotels"><small>' + esc(u.sample) + " · " + esc(t.zone) + "</small><ul>" + t.names.slice(0, 4).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>";
    }
    var prev = DEST[(i - 1 + N) % N], next = DEST[(i + 1) % N];
    var destLbl = d.airport ? (l === "es" ? "Tu hotel" : (l === "en" ? "Your hotel" : copyOf(d, l).short)) : (d.island ? u.dock + " Bayahibe" : c.short);
    body.innerHTML =
      '<p class="k25-dd-kick"><span>' + pad(i + 1) + " / " + pad(N) + "</span>" + esc(REGIONS[d.region][l] || REGIONS[d.region].en) + "</p>" +
      '<h2 id="k25-dd-title" class="k25-dd-title">' + esc(c.name) + "</h2>" +
      '<p class="k25-dd-tag">' + esc(c.tag) + "</p>" +
      '<p class="k25-dd-lede">' + esc(c.lede) + "</p>" +
      (lis ? '<h3 class="k25-dd-h">' + esc(u.expect) + '</h3><ul class="k25-dd-list">' + lis + "</ul>" : "") +
      '<section class="k25-dd-ride" aria-label="' + esc(u.transfer) + '">' +
      '<h3 class="k25-dd-h">' + ICON.van + esc(u.transfer) + "</h3>" +
      '<div class="k25-dd-route"><span class="o">' + ICON.plane + esc(d.origin) + '</span><i aria-hidden="true"><em></em></i><span class="d">' + esc(destLbl) + "</span></div>" +
      factsHtml(d, c, u, l, "k25-dd-facts") +
      (c.why ? '<p class="k25-dd-why">' + esc(c.why) + "</p>" : "") +
      hotels +
      (t && t.from != null ? '<p class="k25-dd-note">' + esc(u.rateNote) + " · " + esc(u.approx) + "</p>" : "") +
      "</section>" +
      '<div class="k25-dd-cta"><button type="button" class="k25-btn k25-btn-teal" data-k25-book>' + esc(u.book) + ICON.arrow + '</button><button type="button" class="k25-btn k25-btn-line" data-k25-rates="' + i + '">' + esc(u.rates) + "</button></div>" +
      '<nav class="k25-dd-pn" aria-label="' + esc(u.place) + '"><button type="button" data-k25-go="' + ((i - 1 + N) % N) + '"><small>' + ICON.left + esc(u.prev) + "</small><b>" + esc(copyOf(prev, l).short) + '</b></button><button type="button" data-k25-go="' + ((i + 1) % N) + '"><small>' + esc(u.next) + ICON.right + "</small><b>" + esc(copyOf(next, l).short) + "</b></button></nav>";
    body.scrollTop = 0;
    ddSync(true);
    if (animate && !RM) { var sh = $(".k25-dd-sheet", r); sh.classList.remove("is-swap"); void sh.offsetWidth; sh.classList.add("is-swap"); }
  }

  function ddSync(reset) {
    var r = DD.root; if (!r) return;
    var d = DEST[DD.i], ph = photos(d)[DD.g];
    $$(".k25-dd-slide", r).forEach(function (s, k) {
      var on = k === DD.g;
      if (reset && on) { s.classList.remove("is-on"); void s.offsetWidth; }
      s.classList.toggle("is-on", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    $$("[data-k25-dot]", r).forEach(function (b, k) { if (k === DD.g) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    var cr = $("[data-k25-dcredit]", r);
    if (cr && ph) { cr.href = ph.page; cr.textContent = ui().photo + ": " + ph.author + " · " + ph.license; }
    ddArm();
  }
  function ddGo(k, user) {
    if (!DD.len) return;
    DD.g = ((k % DD.len) + DD.len) % DD.len;
    if (user) DD.paused = DD.paused; // keep state
    ddSync(true);
  }
  function ddArm() {
    clearTimeout(DD.timer);
    var r = DD.root; if (!r) return;
    var bar = $("[data-k25-gbar]", r);
    if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    var on = DD.open && !DD.paused && !RM && DD.len > 1 && !D.hidden;
    r.classList.toggle("is-auto", on);
    if (!on) return;
    DD.timer = setTimeout(function () { ddGo(DD.g + 1); }, 4600);
  }

  /* scroll lock — overflow on <html>/<body> + wheel/touch guard outside the sheet body */
  function scrollArea(target) {
    var r = DD.root; if (!r || !target || !target.closest) return null;
    var a = target.closest(".k25-dd-body,.k25-dd-dots");
    return a && r.contains(a) ? a : null;
  }
  function lock() {
    if (DD.lock) return;
    var body = D.body;
    var sbw = Math.max(0, W.innerWidth - HTML.clientWidth);
    var st = { y: W.scrollY || HTML.scrollTop || 0, ho: HTML.style.overflow, bo: body.style.overflow, bp: body.style.paddingRight, touch: null };
    var onWheel = function (e) {
      var a = scrollArea(e.target);
      if (!a) { e.preventDefault(); return; }
      if (a.classList.contains("k25-dd-dots")) return;
      var max = a.scrollHeight - a.clientHeight;
      if (max <= 0 || (e.deltaY < 0 && a.scrollTop <= 0) || (e.deltaY > 0 && a.scrollTop >= max - 1)) e.preventDefault();
    };
    var onTS = function (e) { var t = e.touches && e.touches[0]; st.touch = t ? { a: scrollArea(e.target), x: t.clientX, y: t.clientY } : null; };
    var onTM = function (e) {
      var s = st.touch, t = e.touches && e.touches[0];
      if (!s || !t || !s.a) { e.preventDefault(); return; }
      if (s.a.classList.contains("k25-dd-dots")) return;
      var dy = t.clientY - s.y, dx = t.clientX - s.x;
      if (Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); return; }
      var max = s.a.scrollHeight - s.a.clientHeight;
      if (max <= 0 || (dy > 0 && s.a.scrollTop <= 0) || (dy < 0 && s.a.scrollTop >= max - 1)) e.preventDefault();
    };
    var onKey = function (e) {
      var k = e.key;
      if (["PageDown", "PageUp", "Home", "End", " ", "ArrowDown", "ArrowUp"].indexOf(k) < 0) return;
      if (scrollArea(e.target)) return;
      if (e.target && /^(BUTTON|A)$/.test(e.target.tagName) && k === " ") return;
      e.preventDefault();
    };
    HTML.classList.add("k25-lock");
    HTML.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (sbw) body.style.paddingRight = sbw + "px";
    HTML.style.setProperty("--k25-sbw", sbw + "px");
    D.addEventListener("wheel", onWheel, { capture: true, passive: false });
    D.addEventListener("touchstart", onTS, { capture: true, passive: true });
    D.addEventListener("touchmove", onTM, { capture: true, passive: false });
    D.addEventListener("keydown", onKey, true);
    st.h = { onWheel: onWheel, onTS: onTS, onTM: onTM, onKey: onKey };
    DD.lock = st;
  }
  function unlock() {
    var st = DD.lock; if (!st) return;
    D.removeEventListener("wheel", st.h.onWheel, true);
    D.removeEventListener("touchstart", st.h.onTS, true);
    D.removeEventListener("touchmove", st.h.onTM, true);
    D.removeEventListener("keydown", st.h.onKey, true);
    HTML.classList.remove("k25-lock");
    HTML.style.overflow = st.ho; D.body.style.overflow = st.bo; D.body.style.paddingRight = st.bp;
    HTML.style.removeProperty("--k25-sbw");
    if (Math.abs((W.scrollY || 0) - st.y) > 2) W.scrollTo(0, st.y);
    DD.lock = null;
  }

  function openDD(i, from) {
    var r = ddRoot();
    DD.ret = from || D.activeElement;
    DD.paused = false;
    ddRender(i, false);
    if (S.i !== i) select(i, { instant: true });
    r.hidden = false;
    lock();
    DD.open = true;
    restartTimer();
    // origin of the zoom: the clicked card
    try {
      if (from && from.getBoundingClientRect && !RM) {
        var b = from.getBoundingClientRect();
        r.style.setProperty("--k25-ox", Math.round(b.left + b.width / 2) + "px");
        r.style.setProperty("--k25-oy", Math.round(b.top + b.height / 2) + "px");
      } else { r.style.setProperty("--k25-ox", "50vw"); r.style.setProperty("--k25-oy", "60vh"); }
    } catch (e) {}
    void r.offsetWidth;
    r.setAttribute("data-open", "true");
    ddArm();
    setTimeout(function () { try { $(".k25-dd-sheet", r).focus({ preventScroll: true }); } catch (e) {} }, 40);
  }
  function closeDD(silent) {
    if (!DD.open) return;
    var r = DD.root;
    DD.open = false;
    clearTimeout(DD.timer);
    r.setAttribute("data-open", "false");
    unlock();
    setTimeout(function () { if (!DD.open) r.hidden = true; }, RM ? 0 : 320);
    var ret = DD.ret; DD.ret = null;
    if (!silent && ret && ret.focus && D.contains(ret)) { try { ret.focus({ preventScroll: true }); } catch (e) {} }
    restartTimer();
  }

  function bindDD(r) {
    r.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.closest) return;
      if (t.closest("[data-k25-x]")) { e.preventDefault(); closeDD(); return; }
      var g = t.closest("[data-k25-g]"); if (g) { DD.paused = true; ddGo(DD.g + (+g.getAttribute("data-k25-g")), true); return; }
      var dot = t.closest("[data-k25-dot]"); if (dot) { DD.paused = true; ddGo(+dot.getAttribute("data-k25-dot"), true); return; }
      var go = t.closest("[data-k25-go]"); if (go) { var ni = +go.getAttribute("data-k25-go"); ddRender(ni, true); select(ni, { instant: true }); ddArm(); return; }
      if (t.closest("[data-k25-book]")) { goBook(); return; }
      var rt = t.closest("[data-k25-rates]"); if (rt) { goRates(DEST[+rt.getAttribute("data-k25-rates")]); return; }
    });
    var gal = $("[data-k25-gal]", r);
    gal.addEventListener("mouseenter", function () { DD.hoverPause = true; clearTimeout(DD.timer); r.classList.add("is-hold"); });
    gal.addEventListener("mouseleave", function () { DD.hoverPause = false; r.classList.remove("is-hold"); ddArm(); });
    var gx = 0, gy = 0, gs = false;
    gal.addEventListener("touchstart", function (e) { if (e.target.closest("a,button")) { gs = false; return; } gs = true; gx = e.touches[0].clientX; gy = e.touches[0].clientY; }, { passive: true });
    gal.addEventListener("touchend", function (e) {
      if (!gs) return; gs = false;
      var t = e.changedTouches && e.changedTouches[0]; if (!t) return;
      var dx = t.clientX - gx, dy = t.clientY - gy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { DD.paused = true; ddGo(DD.g + (dx < 0 ? 1 : -1), true); }
    }, { passive: true });
    D.addEventListener("keydown", function (e) {
      if (!DD.open) return;
      if (e.key === "Escape") { e.preventDefault(); closeDD(); return; }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var tg = e.target; if (tg && /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName)) return;
        e.preventDefault(); DD.paused = true; ddGo(DD.g + (e.key === "ArrowRight" ? 1 : -1), true); return;
      }
      if (e.key === "Tab") {
        var f = $$('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])', $(".k25-dd-sheet", r)).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && (D.activeElement === a || D.activeElement === $(".k25-dd-sheet", r))) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     LIFECYCLE — remount-safe: find the (possibly re-created) empty host,
     re-render on language change, never touch React-owned nodes.
     ------------------------------------------------------------------ */
  /* Only ever touch the host React rendered (inside #dc-root). The raw <x-dc> template is read by
     support.js as innerHTML — mutating it before the runtime parses it would hand our nodes to React
     and crash later reconciliation (removeChild). */
  function findHost() {
    var hs = $$("[data-k25-dest]");
    for (var k = 0; k < hs.length; k++) {
      var h = hs[k];
      if (h.closest && !h.closest("x-dc") && h.closest("#dc-root")) return h;
    }
    return null;
  }
  function check() {
    var h = findHost();
    if (!h) return;
    if (h !== S.host || h.getAttribute("data-k25-on") !== "1" || !h.firstChild) { mount(h); return; }
    relang();
  }
  function boot() {
    W.addEventListener("scroll", onScroll, { passive: true });
    W.addEventListener("resize", function () { onScroll(); scrollRailTo(S.i, false); });
    D.addEventListener("visibilitychange", function () { restartTimer(); ddArm(); });
    try {
      var mo = new MutationObserver(function (list) {
        for (var k = 0; k < list.length; k++) {
          var m = list[k];
          if (m.type === "attributes" && m.attributeName === "data-lang" && m.target.id !== "k25-dd-root") { setTimeout(check, 60); return; }
        }
      });
      mo.observe(D.body, { subtree: true, attributes: true, attributeFilter: ["data-lang"] });
    } catch (e) {}
    var n = 0;
    (function wait() {
      if (findHost()) { setTimeout(check, 250); return; }
      if (++n < 600) setTimeout(wait, 50);
    })();
    setInterval(check, 900);
  }

  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", boot); else boot();

  W.K25Dest = { open: function (slug) { for (var i = 0; i < N; i++) if (DEST[i].slug === slug) return openDD(i, null); }, close: function () { closeDD(); }, select: function (i) { select(i, { force: true }); }, data: DEST };
})();
