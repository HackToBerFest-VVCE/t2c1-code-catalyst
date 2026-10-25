export type CityAttraction = {
  id: string;
  name: string;
  category: string;
  duration: string;
  costDisplay: string;
  costUSD: number;
  img: string;
  bestTime: string;
  tip: string;
  crowdRating: "Peaceful" | "Moderate" | "High";
};

export type TransitOption = {
  name: string;
  type: "metro" | "train" | "bus" | "auto" | "ferry" | "bike" | "tram";
  cost: string;
  tip: string;
};

export type CityTransitInfo = {
  recommendedPass: string;
  passTypeBadge: string;
  passPrice: string;
  passPriceUSD: number;
  passValidity: string;
  howToUse: string;
  operatorCode: string;
  options: TransitOption[];
};

export type CuratedCity = {
  id: string;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  heroImg: string;
  thumbs: string[];
  durationDays: number;
  avgDailyBudgetUSD: number;
  attractions: CityAttraction[];
  transit: CityTransitInfo;
};

export const CURATED_CITIES: Record<string, CuratedCity> = {
  mysuru: {
    id: "mysuru",
    name: "Mysuru",
    country: "India",
    flag: "🇮🇳",
    tagline: "Palaces of light, sandalwood heritage, and Karnataka's royal cultural heartland.",
    heroImg: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 45,
    attractions: [
      {
        id: "mysore-palace",
        name: "Mysore Palace (Amba Vilas)",
        category: "Royal Heritage",
        duration: "2.5 hours",
        costDisplay: "₹100 ($1.05)",
        costUSD: 1.05,
        img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:30 AM (Opening slot before school & tour bus arrival)",
        tip: "Remove shoes at the Varaha Gate counter. Sunday evening 7 PM illumination has 97,000 bulbs.",
        crowdRating: "High",
      },
      {
        id: "chamundi-hill",
        name: "Chamundi Hill & Monolithic Nandi",
        category: "Spiritual & Panorama",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:30 AM (Sunrise over Mysuru cityscape)",
        tip: "Walk halfway down the 1,000 stone steps to see the 5-metre monolithic Nandi Bull carved in 1659.",
        crowdRating: "Moderate",
      },
      {
        id: "devaraja-market",
        name: "Devaraja Century Spice & Flower Market",
        category: "Local Culture & Flavors",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM or 04:30 PM (Vibrant floral auction colors)",
        tip: "Buy authentic Mysore Sandalwood oil from Government Emporiums; bargain respectfully for jasmine garlands.",
        crowdRating: "High",
      },
      {
        id: "brindavan-gardens",
        name: "Brindavan Gardens & Musical Fountains",
        category: "Lakes & Landscaping",
        duration: "2 hours",
        costDisplay: "₹50 ($0.55)",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:00 PM (Sunset & synchronised musical fountain show)",
        tip: "Located 18 km out at Krishnarajasagara Dam. Book return auto in advance to avoid surge.",
        crowdRating: "Moderate",
      },
      {
        id: "philomenas-cathedral",
        name: "St. Philomena's Neo-Gothic Cathedral",
        category: "Architecture & History",
        duration: "1 hour",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "02:30 PM (Quiet afternoon stained-glass reflections)",
        tip: "Features twin 175-foot spires modeled after Germany's Cologne Cathedral and crypt with holy relics.",
        crowdRating: "Peaceful",
      },
      {
        id: "somnathpur-temple",
        name: "Somnathpur Keshava Hoysala Temple",
        category: "UNESCO World Heritage",
        duration: "2 hours",
        costDisplay: "₹25 ($0.30)",
        costUSD: 0.30,
        img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "10:00 AM (Serene village setting 35km from city)",
        tip: "13th-century soapstone carvings depicting the Ramayana and Mahabharata with microscopic detail.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "KSRTC Mysuru City Bus Daily Day Pass & Pre-paid Auto Stands",
      passTypeBadge: "Karnataka State Road Transport (KSRTC City Pass)",
      passPrice: "₹70 / full-day unlimited bus pass (approx. $0.75)",
      passPriceUSD: 0.75,
      passValidity: "Unlimited travel on all green and red KSRTC city Volvo & ordinary buses for 24 hours.",
      howToUse: "Purchase directly from conductor on any KSRTC city bus or at Sub-Urban Bus Stand. Keep receipt on your phone clipboard.",
      operatorCode: "KSRTC-MYS-PASS",
      options: [
        { name: "KSRTC Electric & City Bus Line 201/303", type: "bus", cost: "₹15–₹30 / hop", tip: "Connects Railway Station, Palace, and Chamundi foothills every 10 mins." },
        { name: "Pre-paid Government Auto Stands", type: "auto", cost: "₹30 flagfall + ₹15/km", tip: "Use prepaid booth counters at Mysuru Railway Station & Gandhi Square to bypass haggling." },
        { name: "Trin Trin Smart Public Bicycle Share", type: "bike", cost: "₹50 / day registration", tip: "Automated docking hubs at Palace, Kukkarahalli Lake, and University campus." },
      ],
    },
  },

  jaipur: {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    flag: "🇮🇳",
    tagline: "The Pink City — Rajput royal forts, desert stone architecture, and heritage bazaars.",
    heroImg: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 55,
    attractions: [
      {
        id: "amber-fort",
        name: "Amer Fort & Sheesh Mahal (Mirror Palace)",
        category: "Royal Fortresses",
        duration: "3 hours",
        costDisplay: "₹100 ($1.05)",
        costUSD: 1.05,
        img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:30 AM (Cool morning before desert heat & jeep crowds)",
        tip: "Walk up the stone ramp or hire electric shuttle. The Belgian glass inlay in Sheesh Mahal reflects single candle light into thousands.",
        crowdRating: "High",
      },
      {
        id: "hawa-mahal",
        name: "Hawa Mahal (Palace of the Winds)",
        category: "Architecture Icon",
        duration: "1 hour",
        costDisplay: "₹50 ($0.55)",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Morning sunlight illuminates pink sandstone facade)",
        tip: "Cross the street to Wind View Café on opposite terrace for the unobstructed postcard photo.",
        crowdRating: "High",
      },
      {
        id: "city-palace",
        name: "Jaipur City Palace & Chandra Mahal",
        category: "Living Royal Residence",
        duration: "2 hours",
        costDisplay: "₹300 ($3.20)",
        costUSD: 3.20,
        img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM (View Peacock Gate inner courtyard)",
        tip: "Still the home of Jaipur's Maharaja. See the two giant silver vessels (Gangajalis) recorded in Guinness Book.",
        crowdRating: "Moderate",
      },
      {
        id: "jantar-mantar",
        name: "Jantar Mantar Astronomical Observatory",
        category: "UNESCO Science & Heritage",
        duration: "1.5 hours",
        costDisplay: "₹50 ($0.55)",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "12:00 PM (Noon gives the most precise sundial shadow readings)",
        tip: "World's largest stone sundial, measuring time to within two seconds accuracy without modern instruments.",
        crowdRating: "Moderate",
      },
      {
        id: "nahargarh-fort",
        name: "Nahargarh Fort Ridge Sunset Point",
        category: "Panorama & Sunset",
        duration: "2 hours",
        costDisplay: "₹50 ($0.55)",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:15 PM (Golden hour over entire Pink City horizon)",
        tip: "Perched on Aravalli hills. Enjoy a beverage at Padao open-air restaurant while the city lights twinkle on.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Jaipur Metro Rail Smart Card & RTDC Composite Tourism Pass",
      passTypeBadge: "Jaipur Metro Pink Line + Composite City Pass",
      passPrice: "₹100 / Smart Card (or ₹400 for 2-day Composite Monument Pass)",
      passPriceUSD: 4.25,
      passValidity: "Covers Amber Fort, Hawa Mahal, Jantar Mantar, Nahargarh, plus Metro Line 1 rides.",
      howToUse: "Show digital barcode voucher at entrance turnstiles. Eliminates standing in 4 separate ticket queues.",
      operatorCode: "JMRC-JAIPUR-PASS",
      options: [
        { name: "Jaipur Metro (Pink Line Mansarovar to Badi Chaupar)", type: "metro", cost: "₹10–₹25 / hop", tip: "Badi Chaupar station drops you directly 200m from Hawa Mahal." },
        { name: "JCTSL Low Floor AC Buses (Routes 1, 2, 9)", type: "bus", cost: "₹20–₹40 / trip", tip: "Frequent connections from Ajmeri Gate to Amer Fort." },
        { name: "App-based E-Rickshaws & Ubers", type: "auto", cost: "₹50–₹120 / short run", tip: "Opt for fixed-rate app rides inside the walled pink bazaar alleys." },
      ],
    },
  },

  paris: {
    id: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    tagline: "The City of Light — Haussmann boulevards, world masterpieces, and bohemian riverbanks.",
    heroImg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 5,
    avgDailyBudgetUSD: 140,
    attractions: [
      {
        id: "eiffel-tower",
        name: "Eiffel Tower & Champ de Mars",
        category: "Iconic Landmark",
        duration: "2.5 hours",
        costDisplay: "€29 ($32.50)",
        costUSD: 32.50,
        img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:45 AM or 09:30 PM (Golden beacon sparkle at top of each hour)",
        tip: "Book Summit elevator ticket 60 days in advance online. For zero queue, walk the stairs to Level 2.",
        crowdRating: "High",
      },
      {
        id: "louvre-museum",
        name: "Louvre Museum & Glass Pyramid",
        category: "Fine Arts & Antiquities",
        duration: "3.5 hours",
        costDisplay: "€22 ($24.60)",
        costUSD: 24.60,
        img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Wednesday or Friday late openings until 21:45)",
        tip: "Enter via Carrousel du Louvre underground entrance to bypass the long exterior pyramid line.",
        crowdRating: "High",
      },
      {
        id: "montmartre",
        name: "Montmartre & Sacré-Cœur Basilica",
        category: "Bohemian Village & Views",
        duration: "2.5 hours",
        costDisplay: "Free Entry (Dome €8)",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:00 AM (Quiet cobblestones of Place du Tertre before portrait stalls)",
        tip: "Use the Montmartre Funicular (covered by standard metro ticket) instead of climbing the 300 stairs.",
        crowdRating: "Moderate",
      },
      {
        id: "sainte-chapelle",
        name: "Sainte-Chapelle Stained Glass Jewel",
        category: "Gothic Masterpiece",
        duration: "1.5 hours",
        costDisplay: "€13 ($14.50)",
        costUSD: 14.50,
        img: "https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:30 AM (Sunlight streams directly through 1,113 13th-century stained glass panes)",
        tip: "Combined ticket with Conciergerie saves €6. Stricter airport-style security since it's on Justice Palace grounds.",
        crowdRating: "Moderate",
      },
      {
        id: "seine-cruise",
        name: "Seine Sunset Vedettes Cruise",
        category: "River Panorama",
        duration: "1.2 hours",
        costDisplay: "€17 ($19.00)",
        costUSD: 19.00,
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 PM (Departs Pont Neuf as monuments illuminate)",
        tip: "Sit on upper open deck starboard (right) side for prime views of Notre-Dame and Musée d'Orsay.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "RATP Navigo Easy Pass & Paris Visite (Zones 1–3)",
      passTypeBadge: "Official Île-de-France Mobilités / RATP Card",
      passPrice: "€2.15 / ride (or €8.65 Navigo Jour daily cap)",
      passPriceUSD: 9.60,
      passValidity: "Unlimited rides on all 16 Paris Metro lines, RER inside city limits, buses, and trams.",
      howToUse: "Tap contactless Navigo card or Apple/Google Wallet at turnstiles. Seamless 90-min transfers between metro & RER.",
      operatorCode: "RATP-PARIS-NAVIGO",
      options: [
        { name: "Paris Metro (Lines 1 & 4 Automatics)", type: "metro", cost: "€2.15 / ticket", tip: "Line 1 is fully automated and runs right along Champs-Élysées, Concorde, and Louvre." },
        { name: "RER Line C (Château de Versailles & Eiffel)", type: "train", cost: "€4.15 / suburban", tip: "Fastest route south along the riverbank." },
        { name: "Batobus Hop-on Hop-off River Shuttle", type: "ferry", cost: "€20 / 24-hr day pass", tip: "9 stops right beside the major riverfront museums." },
      ],
    },
  },

  tokyo: {
    id: "tokyo",
    name: "Japan (Tokyo & Kyoto)",
    country: "Japan",
    flag: "🇯🇵",
    tagline: "Ultra-modern neon districts, centuries of Zen shrines, bullet trains, and Michelin gastronomy.",
    heroImg: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 7,
    avgDailyBudgetUSD: 120,
    attractions: [
      {
        id: "senso-ji",
        name: "Senso-ji Temple & Nakamise Dori",
        category: "Ancient Heritage",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:00 AM (Quiet morning atmosphere before souvenir shops crowd)",
        tip: "Draw an Omikuji fortune for ¥100. If bad luck, tie it to the pine racks so evil spirits stay behind.",
        crowdRating: "High",
      },
      {
        id: "shibuya-sky",
        name: "Shibuya Sky Rooftop & Scramble Crossing",
        category: "Neon & City Views",
        duration: "2 hours",
        costDisplay: "¥2,200 ($14.20)",
        costUSD: 14.20,
        img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:00 PM (Watch Shibuya transition from sunset to glittering neon)",
        tip: "Book sunset slot precisely 28 days ahead at 00:00 JST. Lockers are mandatory on the open-air roof.",
        crowdRating: "High",
      },
      {
        id: "meiji-shrine",
        name: "Meiji Jingu Shrine & Forest Path",
        category: "Zen Serenity",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:30 AM (Birdsong through 170,000 evergreen trees)",
        tip: "Bow once at the giant 1,500-year-old cedar Torii gate before walking down the gravel path.",
        crowdRating: "Peaceful",
      },
      {
        id: "teamlab-planets",
        name: "teamLab Planets Immersive Digital Art",
        category: "Futuristic Art",
        duration: "2.5 hours",
        costDisplay: "¥3,800 ($24.50)",
        costUSD: 24.50,
        img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "10:00 AM or 19:30 PM (Evening quieter)",
        tip: "You will wade through knee-deep water installations. Wear shorts or pants that roll up easily.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Tokyo Subway 72-Hour Pass + Welcome Suica / Pasmo IC Card",
      passTypeBadge: "Tokyo Metro & Toei Subway Tourist Pass",
      passPrice: "¥1,500 for 72 hours unlimited (approx. $9.80)",
      passPriceUSD: 9.80,
      passValidity: "Unlimited rides on all 13 Tokyo Metro and Toei subway lines covering 250+ stations.",
      howToUse: "Insert ticket at subway gates or add digital Suica to Apple Wallet. Tap at JR Yamanote loop gates.",
      operatorCode: "JR-TOKYO-SUBWAY-72H",
      options: [
        { name: "JR Yamanote Loop Line", type: "train", cost: "¥160–¥210 / ride", tip: "Circles Tokyo clockwise/counterclockwise, connecting Shibuya, Shinjuku, and Tokyo Station." },
        { name: "Tokyo Metro Ginza & Hibiya Lines", type: "metro", cost: "Included in 72h pass", tip: "Fastest underground link between Asakusa, Ginza, and Roppongi." },
        { name: "Tokaido Shinkansen (Bullet Train)", type: "train", cost: "¥13,320 (Tokyo to Kyoto)", tip: "Runs at 285 km/h, reaches Kyoto in 2h 15m. Reserve Mt. Fuji side (Seat E)." },
      ],
    },
  },

  goa: {
    id: "goa",
    name: "Goa",
    country: "India",
    flag: "🇮🇳",
    tagline: "Sun-drenched Arabian coastline, UNESCO colonial churches, and Konkan seafood.",
    heroImg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 5,
    avgDailyBudgetUSD: 50,
    attractions: [
      {
        id: "bom-jesus",
        name: "Basilica of Bom Jesus (Old Goa)",
        category: "UNESCO Baroque Heritage",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Serene morning before tour buses arrive)",
        tip: "16th-century unplastered red laterite facade housing the sacred relics of St. Francis Xavier.",
        crowdRating: "Moderate",
      },
      {
        id: "dudhsagar-falls",
        name: "Dudhsagar 4-Tier Waterfalls Safari",
        category: "Nature & Wilderness",
        duration: "4.5 hours",
        costDisplay: "₹500 ($5.30)",
        costUSD: 5.30,
        img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Catch the jungle jeep departure from Kulem)",
        tip: "Life jackets are mandatory for swimming in the crystal natural pool at the base of the falls.",
        crowdRating: "Moderate",
      },
      {
        id: "fontainhas",
        name: "Fontainhas Latin Quarter Heritage Walk",
        category: "Portuguese Architecture",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "04:30 PM (Soft golden sunlight on pastel yellow and blue villas)",
        tip: "Stop at Panjim's 31st January Bakery for warm Portuguese egg tarts (Pastéis de Nata).",
        crowdRating: "Peaceful",
      },
      {
        id: "palolem-beach",
        name: "Palolem Beach & Butterfly Island Kayak",
        category: "Crescent Beach & Water",
        duration: "3 hours",
        costDisplay: "₹300 ($3.20)",
        costUSD: 3.20,
        img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "04:00 PM (Gentle waves and dolphin sightings by kayak)",
        tip: "Protected bay with no rip tides; ideal for paddleboarding and quiet sunset dinners on sand.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "GoaMiles App Registered Cabs & Kadamba AC Airport Express",
      passTypeBadge: "Goa Tourism Development (GTDC Verified Transit)",
      passPrice: "₹150 for airport express shuttle / ₹350–₹500 scooty rental/day",
      passPriceUSD: 5.50,
      passValidity: "Government regulated fixed rates across North & South Goa zones.",
      howToUse: "Book via GoaMiles app or pay counter at Dabolim/Mopa airport arrivals. Avoid unregulated pirate cabs.",
      operatorCode: "GTDC-GOA-TRANSIT",
      options: [
        { name: "Self-Drive Geared / Non-Geared Scooter", type: "bike", cost: "₹350–₹500 / 24 hrs", tip: "Most flexible way to hop between Anjuna, Vagator, and Morjim." },
        { name: "Kadamba Transport AC Electric Shuttle", type: "bus", cost: "₹100–₹150 / ride", tip: "Runs directly from Mopa (GOX) and Dabolim airports to Panaji & Calangute." },
        { name: "River Ferries (Betim to Panjim / Querim to Tiracol)", type: "ferry", cost: "Free for passengers / ₹10 for bikes", tip: "Scenic river crossing without traffic." },
      ],
    },
  },

  kerala: {
    id: "kerala",
    name: "Kerala",
    country: "India",
    flag: "🇮🇳",
    tagline: "God's Own Country — emerald backwater canals, misty tea hills, and Kathakali lore.",
    heroImg: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 6,
    avgDailyBudgetUSD: 60,
    attractions: [
      {
        id: "alleppey-backwaters",
        name: "Alleppey Backwaters Shikara Cruise",
        category: "Canals & Waterways",
        duration: "3 hours",
        costDisplay: "₹800 ($8.50)",
        costUSD: 8.50,
        img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:45 AM (Mist lifting over paddy fields and lotus blooms)",
        tip: "Shikaras navigate narrow village canals that large motorized houseboats cannot reach.",
        crowdRating: "Peaceful",
      },
      {
        id: "munnar-tea",
        name: "Munnar Kolukkumalai Organic Tea Estate",
        category: "Cloud Hills & Tea",
        duration: "3.5 hours",
        costDisplay: "₹150 ($1.60)",
        costUSD: 1.60,
        img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:30 AM (Watch morning pluckers collect fresh two leaves & bud)",
        tip: "World's highest tea plantation at 7,900 feet with orthodox factory tea-tasting sessions.",
        crowdRating: "Peaceful",
      },
      {
        id: "fort-kochi-nets",
        name: "Fort Kochi Chinese Fishing Nets & Jew Town",
        category: "Maritime & Heritage",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:30 PM (Silhouetted wooden cantilever nets against ocean sunset)",
        tip: "Walk past the 1568 Paradesi Synagogue and antique spice godowns on Jew Street.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Kochi Water Metro Smart Card & SWTD Public Canal Ferry",
      passTypeBadge: "Asia's First Integrated Electric Water Metro",
      passPrice: "₹20–₹40 per boat ride / ₹100 Day Pass",
      passPriceUSD: 1.10,
      passValidity: "Air-conditioned battery electric catamarans across 10 island routes in Kochi.",
      howToUse: "Tap QR ticket from Kochi1 App or smart card at terminal turnstiles.",
      operatorCode: "KMRL-WATER-METRO",
      options: [
        { name: "Kochi Electric Water Metro", type: "ferry", cost: "₹20–₹40 / trip", tip: "Zero pollution, panoramic glass windows connecting High Court to Vypeen Island." },
        { name: "State Water Transport (SWTD) Canal Ferry", type: "ferry", cost: "₹15 / scenic route", tip: "Authentic local ferry linking Alleppey to Kottayam through deep backwaters." },
        { name: "KSRTC Low-Floor Green Bus", type: "bus", cost: "₹40–₹120", tip: "Scenic highway climb through rubber and spice plantations to Munnar." },
      ],
    },
  },

  varanasi: {
    id: "varanasi",
    name: "Varanasi",
    country: "India",
    flag: "🇮🇳",
    tagline: "The eternal holy city of light, Ganges river ghats, and spiritual transcendence.",
    heroImg: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 40,
    attractions: [
      {
        id: "ganga-aarti",
        name: "Dashashwamedh Ghat Evening Maha Aarti",
        category: "Sacred Rituals",
        duration: "1.5 hours",
        costDisplay: "Free (Boat seat ₹150)",
        costUSD: 1.60,
        img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:15 PM (Seven priests chant in unison with multi-tiered brass oil lamps)",
        tip: "Hire a wooden rowing boat 30 mins before sunset to watch the flaming lamps reflected on water.",
        crowdRating: "High",
      },
      {
        id: "dawn-boat-ride",
        name: "Assi to Manikarnika Dawn Wooden Boat Ride",
        category: "Spiritual Panorama",
        duration: "2 hours",
        costDisplay: "₹300 ($3.20)",
        costUSD: 3.20,
        img: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:30 AM (Sun rising over opposite sandbank, illuminating 84 river ghats)",
        tip: "Opt for a hand-rowed boat instead of diesel engine for silent, peaceful morning contemplation.",
        crowdRating: "Moderate",
      },
      {
        id: "kashi-vishwanath",
        name: "Kashi Vishwanath Corridor & Golden Spire",
        category: "Ancient Temple",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:00 AM (Early Sugam Darshan slot to bypass main alley queue)",
        tip: "Mobile phones and leather belts must be deposited at the official temple lockers in the new corridor.",
        crowdRating: "High",
      },
      {
        id: "sarnath-stupas",
        name: "Sarnath Dhamek Stupa & Deer Park",
        category: "Buddhist Heritage",
        duration: "2.5 hours",
        costDisplay: "₹25 ($0.30)",
        costUSD: 0.30,
        img: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "10:30 AM (Where Lord Buddha delivered his first sermon 2,500 years ago)",
        tip: "Visit the nearby Sarnath Archaeological Museum to see the original Ashoka Lion Capital (India's national emblem).",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Varanasi E-Rickshaw Smart Fare & Ganges Electric Catamaran Boat",
      passTypeBadge: "Varanasi Smart City Heritage Transit",
      passPrice: "₹20 per shared E-Rickshaw hop / ₹100 Alaknanda Cruise hop",
      passPriceUSD: 1.20,
      passValidity: "Eco-friendly battery vehicles permitted inside the Old City pedestrian ring.",
      howToUse: "Hop on at Godowlia Chowk or Assi Ghat. Pay UPI or exact cash to the licensed driver.",
      operatorCode: "VNS-GANGES-TRANSIT",
      options: [
        { name: "Silent Electric Rickshaws (E-Autos)", type: "auto", cost: "₹15–₹30 / shared hop", tip: "Navigates narrow paved streets where cars and taxis are strictly banned." },
        { name: "Alaknanda Electric River Catamaran", type: "ferry", cost: "₹150–₹350 / cruise", tip: "Air-conditioned double-decker boat navigating all 84 ghats from Ravidas Ghat to Rajghat." },
        { name: "Heritage Walking Route", type: "bike", cost: "Free", tip: "Continuous 6.8 km riverside stone promenade connecting all historic ghats." },
      ],
    },
  },

  dubai: {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    tagline: "Sky-high architectural marvels, Arabian desert luxury, and futuristic innovation.",
    heroImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 160,
    attractions: [
      {
        id: "burj-khalifa",
        name: "Burj Khalifa At The Top (Level 124 & 125)",
        category: "World's Tallest Wonder",
        duration: "2 hours",
        costDisplay: "AED 179 ($48.70)",
        costUSD: 48.70,
        img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "10:00 AM or 17:30 PM (Sunset over the Arabian Gulf horizon)",
        tip: "Enter through Dubai Mall Lower Ground level. Pre-book slot online to avoid AED 300 walk-up fee.",
        crowdRating: "High",
      },
      {
        id: "museum-of-future",
        name: "Museum of the Future",
        category: "Futuristic Wonder",
        duration: "2.5 hours",
        costDisplay: "AED 149 ($40.50)",
        costUSD: 40.50,
        img: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM (Tickets sell out 3 weeks in advance)",
        tip: "The stainless steel facade features Arabic calligraphy poetry by Sheikh Mohammed bin Rashid.",
        crowdRating: "High",
      },
      {
        id: "dubai-creek-abra",
        name: "Old Dubai Creek & Gold Souk by Traditional Abra",
        category: "Heritage & Gold Bazaar",
        duration: "2 hours",
        costDisplay: "AED 1 ($0.27)",
        costUSD: 0.27,
        img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "04:30 PM (Cool sea breeze across water to spice and perfume alleys)",
        tip: "Wooden motorized water taxis (Abras) cost exactly 1 Dirham coin paid directly to the captain.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "RTA Dubai Silver Nol Card (Metro Red & Green Lines + Tram)",
      passTypeBadge: "Roads and Transport Authority (RTA Silver Nol)",
      passPrice: "AED 25 (includes AED 19 e-purse balance)",
      passPriceUSD: 6.80,
      passValidity: "Covers all driverless Dubai Metro lines, Dubai Tram along Marina, and city public buses.",
      howToUse: "Tap Nol Card on turnstile readers upon entry and exit. Minimum AED 7.50 balance required to enter.",
      operatorCode: "RTA-DUBAI-NOL",
      options: [
        { name: "Dubai Driverless Metro (Red Line)", type: "metro", cost: "AED 3–AED 7.50 / zone", tip: "Connects DXB Airport Terminal 1 & 3 directly to Burj Khalifa, Dubai Marina, and Mall of Emirates." },
        { name: "Dubai Marina Tram", type: "tram", cost: "AED 3 / flat fare", tip: "Connects Metro Station to JBR beach and Palm Jumeirah Monorail." },
        { name: "Traditional Wooden Abra", type: "ferry", cost: "AED 1 / crossing", tip: "Crosses between Bur Dubai and Deira spice souk in 5 minutes." },
      ],
    },
  },

  switzerland: {
    id: "switzerland",
    name: "Switzerland (Zurich & Lucerne)",
    country: "Switzerland",
    flag: "🇨🇭",
    tagline: "Pristine Alpine peaks, crystal-clear glacial lakes, and world-renowned precision rail.",
    heroImg: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 6,
    avgDailyBudgetUSD: 190,
    attractions: [
      {
        id: "jungfraujoch",
        name: "Jungfraujoch — Top of Europe Cogwheel Train",
        category: "Alpine Glacier Summit",
        duration: "4 hours",
        costDisplay: "CHF 190 ($215.00)",
        costUSD: 215.00,
        img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:30 AM (Clear morning skies before afternoon cloud cover)",
        tip: "Ride the Eiger Express tricable gondola from Grindelwald Terminal to save 47 minutes.",
        crowdRating: "Moderate",
      },
      {
        id: "lucerne-bridge",
        name: "Lucerne Chapel Bridge & Lake Steamboat",
        category: "Medieval Wonder",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "10:00 AM (Swan feeding along the wooden 1333 covered bridge)",
        tip: "Look up at the triangular 17th-century ceiling paintings depicting Swiss history.",
        crowdRating: "Moderate",
      },
      {
        id: "matterhorn-view",
        name: "Gornergrat Panorama View of Matterhorn",
        category: "Iconic Mountain Peak",
        duration: "3 hours",
        costDisplay: "CHF 92 ($104.00)",
        costUSD: 104.00,
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Crisp mirror reflection in Riffelsee alpine lake)",
        tip: "Get off at Rotenboden station and walk 10 minutes to the lake shore for the iconic Toblerone shot.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Swiss Travel Pass (SBB CFF FFS All-in-One)",
      passTypeBadge: "Federal Swiss Federal Railways (SBB All-Access)",
      passPrice: "CHF 232 for 3 Days Unlimited (approx. $260.00)",
      passPriceUSD: 260.00,
      passValidity: "Unlimited travel on all Swiss trains, panoramic alpine routes, postal buses, and lake steamers + free entry to 500 museums.",
      howToUse: "Add digital PDF pass to SBB Mobile App or Apple Wallet. Show QR code to train ticket controller when requested.",
      operatorCode: "SBB-CFF-FFS-SWISS-PASS",
      options: [
        { name: "SBB InterCity Express Rail", type: "train", cost: "Included in Swiss Pass", tip: "Swiss trains run with 98.7% on-time precision; luggage racks above and between seats." },
        { name: "Lake Lucerne Historical Steamer Boat", type: "ferry", cost: "Included in Swiss Pass", tip: "Historic paddle steamer connecting Lucerne city to Fluelen and Mount Rigi cogwheel." },
        { name: "Yellow PostBus Alpine Routes", type: "bus", cost: "Included in Swiss Pass", tip: "Navigates dramatic hairpin alpine mountain passes with classic triple-tone horn." },
      ],
    },
  },

  delhi: {
    id: "delhi",
    name: "Delhi",
    country: "India",
    flag: "🇮🇳",
    tagline: "Imperial Mughal heritage, monumental ceremonial boulevards, and legendary culinary alleys.",
    heroImg: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 45,
    attractions: [
      {
        id: "india-gate",
        name: "India Gate & Kartavya Path Grand Promenade",
        category: "National Memorial",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:00 PM (Cool evening lighting & illuminated fountains)",
        tip: "Walk along the newly renovated Central Vista Kartavya Path leading up to Rashtrapati Bhavan.",
        crowdRating: "High",
      },
      {
        id: "qutub-minar",
        name: "Qutub Minar Complex & Iron Pillar",
        category: "UNESCO World Heritage",
        duration: "2 hours",
        costDisplay: "₹40 ($0.45)",
        costUSD: 0.45,
        img: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Early entry to view the 73m red sandstone fluted minaret)",
        tip: "Inspect the rust-resistant 4th-century Gupta Iron Pillar standing in the courtyard.",
        crowdRating: "Moderate",
      },
      {
        id: "humayuns-tomb",
        name: "Humayun's Garden Tomb",
        category: "Mughal Architecture",
        duration: "2 hours",
        costDisplay: "₹40 ($0.45)",
        costUSD: 0.45,
        img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "03:30 PM (Soft sunlight on Persian red sandstone dome)",
        tip: "The architectural inspiration for the Taj Mahal, set in symmetrical four-quadrant charbagh water gardens.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Delhi Metro (DMRC) Tourist Smart Card",
      passTypeBadge: "Delhi Metro Rail Corporation (DMRC Smart Pass)",
      passPrice: "₹200 for 1-Day Unlimited Pass (includes ₹50 refundable deposit)",
      passPriceUSD: 2.15,
      passValidity: "Unlimited travel on all 12 Delhi Metro lines covering 288 stations across Delhi NCR.",
      howToUse: "Tap contactless card at station turnstiles. Eliminates all ticket counter queues.",
      operatorCode: "DMRC-DELHI-PASS",
      options: [
        { name: "Delhi Metro Yellow Line (Old Delhi to Qutub)", type: "metro", cost: "₹10–₹60 / ride", tip: "Fastest underground link from Chandni Chowk to Central Secretariats." },
        { name: "Prepaid Auto Booths & App Autos", type: "auto", cost: "₹30 base + ₹11/km", tip: "Always use official booth at Railway Station or app to bypass street touts." },
      ],
    },
  },

  rome: {
    id: "rome",
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    tagline: "The Eternal City — Colosseum amphitheater, Vatican treasures, and Renaissance piazzas.",
    heroImg: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 130,
    attractions: [
      {
        id: "colosseum",
        name: "Colosseum & Roman Forum",
        category: "Ancient Antiquity",
        duration: "3 hours",
        costDisplay: "€18 ($19.50)",
        costUSD: 19.50,
        img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:30 AM (Opening slot before midday sun & tour crowds)",
        tip: "Pre-book mandatory timed slot online. Ticket also includes Palatine Hill where emperors lived.",
        crowdRating: "High",
      },
      {
        id: "trevi-fountain",
        name: "Trevi Fountain (Fontana di Trevi)",
        category: "Baroque Masterpiece",
        duration: "1 hour",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:00 AM or 10:30 PM (Empty marble basin illuminated in night serenity)",
        tip: "Toss a coin over your left shoulder with your right hand to guarantee your return to Rome.",
        crowdRating: "High",
      },
      {
        id: "pantheon",
        name: "Pantheon & Piazza Navona",
        category: "Architectural Wonder",
        duration: "1.5 hours",
        costDisplay: "€5 ($5.50)",
        costUSD: 5.50,
        img: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:30 AM (Sunlight shaft shines directly through the 9m open oculus in the dome)",
        tip: "The largest unreinforced concrete dome in the world, standing intact for over 1,900 years.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "ATAC Roma 72-Hour Tourist Transit Pass",
      passTypeBadge: "Azienda per la Mobilità (ATAC Roma Pass)",
      passPrice: "€18 for 72 Hours Unlimited",
      passPriceUSD: 19.50,
      passValidity: "Unlimited travel on Rome Metro Lines A & B, city trams, and all ATAC buses.",
      howToUse: "Validate ticket on your first bus/tram boarding or tap at metro turnstiles.",
      operatorCode: "ATAC-ROMA-PASS",
      options: [
        { name: "Rome Metro (Line A Battistini–Anagnina)", type: "metro", cost: "€1.50 / single 100m", tip: "Connects Termini, Spanish Steps, and Ottaviano (Vatican)." },
        { name: "ATAC Tram Lines 3 & 8", type: "tram", cost: "Included in pass", tip: "Scenic street-level transit through Trastevere and historic centers." },
      ],
    },
  },

  bali: {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    tagline: "Island of the Gods — sacred volcanic water temples, emerald rice terraces, and cliffside sunsets.",
    heroImg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 6,
    avgDailyBudgetUSD: 55,
    attractions: [
      {
        id: "ulun-danu",
        name: "Ulun Danu Beratan Lake Temple",
        category: "Sacred Water Shrine",
        duration: "2 hours",
        costDisplay: "IDR 75,000 ($4.80)",
        costUSD: 4.80,
        img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:00 AM (Mist floating above mirror lake surface)",
        tip: "12-tiered thatched meru tower floating on mountain caldera lake Bedugul.",
        crowdRating: "Moderate",
      },
      {
        id: "tegallalang-rice",
        name: "Tegallalang Emerald Rice Terraces",
        category: "Subak UNESCO Landscapes",
        duration: "2.5 hours",
        costDisplay: "IDR 25,000 ($1.60)",
        costUSD: 1.60,
        img: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Morning sun rays through palm leaves)",
        tip: "Traditional 9th-century Balinese cooperative subak water irrigation canal system.",
        crowdRating: "High",
      },
      {
        id: "uluwatu-cliff",
        name: "Uluwatu Sunset Temple & Kecak Fire Dance",
        category: "Ocean Cliff Ritual",
        duration: "3 hours",
        costDisplay: "IDR 150,000 ($9.50)",
        costUSD: 9.50,
        img: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:15 PM (Purchase amphitheater fire dance ticket before 5 PM)",
        tip: "Perched on a 70m sheer limestone drop above crashing Indian Ocean waves.",
        crowdRating: "High",
      },
    ],
    transit: {
      recommendedPass: "Bluebird Verified App & Kura-Kura Tourist Shuttle",
      passTypeBadge: "Bali Verified Tourist Transit",
      passPrice: "IDR 100,000 / Day Pass (approx. $6.40)",
      passPriceUSD: 6.40,
      passValidity: "Regulated meter taxis & tourist shuttle loops linking Kuta, Seminyak, Sanur, and Ubud.",
      howToUse: "Book metered rides via MyBluebird app to guarantee transparent official fares.",
      operatorCode: "BALI-BLUEBIRD-TRANSIT",
      options: [
        { name: "Bluebird Metered Taxis", type: "auto", cost: "IDR 7,500 base + meter", tip: "Refuse unmetered street drivers; look for official Bluebird bird logo on roof." },
        { name: "Kura-Kura Air-Conditioned Shuttle Bus", type: "bus", cost: "IDR 20,000–IDR 80,000", tip: "Connects major beach hotels with central Ubud cultural hub." },
      ],
    },
  },

  greece: {
    id: "greece",
    name: "Greece (Santorini & Athens)",
    country: "Greece",
    flag: "🇬🇷",
    tagline: "Whitewashed Aegean cliff villages, cobalt-blue domes, and classical Parthenon antiquity.",
    heroImg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 6,
    avgDailyBudgetUSD: 140,
    attractions: [
      {
        id: "oia-santorini",
        name: "Oia Caldera & Blue-Domed Churches",
        category: "Cycladic Island Icon",
        duration: "2.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Empty marble alleys before cruise tender ships dock)",
        tip: "Walk the paved cliff path to Byzantine Castle ruins for the panoramic sunset view.",
        crowdRating: "High",
      },
      {
        id: "acropolis-athens",
        name: "Acropolis of Athens & The Parthenon",
        category: "Ancient Classical Citadel",
        duration: "3 hours",
        costDisplay: "€20 ($22.00)",
        costUSD: 22.00,
        img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:00 AM (First admission slot avoids Mediterranean summer heat)",
        tip: "Enter via the South Slope entrance near Acropolis Museum to avoid tour bus queues at the main gate.",
        crowdRating: "High",
      },
      {
        id: "navagio-bay",
        name: "Navagio Shipwreck & Crystal Bay Cruise",
        category: "Secluded White Cove",
        duration: "3 hours",
        costDisplay: "€30 ($33.00)",
        costUSD: 33.00,
        img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM (Sunlight directly illuminates the electric-blue water)",
        tip: "Accessible only by boat; view the dramatic 200m limestone cliffs from the sea.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Athens Urban Transport (OASA) 3-Day Tourist Ticket",
      passTypeBadge: "Athens Public Transit (OASA 3-Day Pass)",
      passPrice: "€20 for 3 Days (includes roundtrip Airport Metro)",
      passPriceUSD: 22.00,
      passValidity: "Unlimited travel on Athens Metro (Lines 1-3), city buses, and coastal tram lines.",
      howToUse: "Tap paper Athena ticket at electronic gates upon each entry and exit.",
      operatorCode: "OASA-ATHENS-PASS",
      options: [
        { name: "Athens Metro Line 3 (Blue Line)", type: "metro", cost: "Included in pass", tip: "Direct 40-minute connection from Athens Airport to Syntagma & Monastiraki." },
        { name: "KTEL Santorini Island Buses", type: "bus", cost: "€1.80–€2.50 / trip", tip: "Air-conditioned coaches connecting Fira central station to Oia every 20 mins." },
      ],
    },
  },

  maldives: {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    flag: "🇲🇻",
    tagline: "Infinite turquoise lagoons, private overwater villas, and bioluminescent coral atolls.",
    heroImg: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 5,
    avgDailyBudgetUSD: 280,
    attractions: [
      {
        id: "overwater-villas",
        name: "Private Lagoon Overwater Villa Retreat",
        category: "Tropical Luxury",
        duration: "Flexible",
        costDisplay: "Included in Resort",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "All Day (Direct wooden ladder descent into 28°C crystal water)",
        tip: "Select a sunset-facing villa for unobstructed views over the Indian Ocean horizon.",
        crowdRating: "Peaceful",
      },
      {
        id: "coral-reef-snorkel",
        name: "Baa Atoll UNESCO Biosphere Manta Ray Snorkel",
        category: "Marine Wilderness",
        duration: "3 hours",
        costDisplay: "$65 ($65.00)",
        costUSD: 65.00,
        img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:30 AM (Manta ray and sea turtle feeding times)",
        tip: "Hanifaru Bay is world famous for congregation of hundreds of gentle manta rays.",
        crowdRating: "Peaceful",
      },
      {
        id: "private-sandbank",
        name: "Solitary Sandbank Island Excursion",
        category: "Secluded Nature",
        duration: "2.5 hours",
        costDisplay: "$45 ($45.00)",
        costUSD: 45.00,
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "04:30 PM (Golden hour surrounded by infinite 360° turquoise water)",
        tip: "Speedboat drops you on an uninhabited strip of pure white coral sand.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "MTCC Public Atoll Ferry & Speedboat Transfer",
      passTypeBadge: "Maldives Transport & Contracting (MTCC Ferry)",
      passPrice: "$2–$5 for public ferry / $35 shared speedboats",
      passPriceUSD: 35.00,
      passValidity: "Covers local island networks between Malé, Maafushi, Gulhi, and Thulusdhoo.",
      howToUse: "Board at Malé Jetty terminal or arrange pre-paid speedboat transfer from Velana Airport.",
      operatorCode: "MTCC-MALDIVES-SPEEDBOAT",
      options: [
        { name: "MTCC Government Island Ferry", type: "ferry", cost: "$2–$4 / trip", tip: "Authentic local wooden dhoni boat cruising leisurely through crystal atolls." },
        { name: "Scheduled Shared Speedboat", type: "ferry", cost: "$25–$35 / person", tip: "Reaches resort and guesthouse islands in 30 minutes from airport." },
      ],
    },
  },
};

// Fallback smart generator for any city in the world
export function getCuratedCityData(cityName: string, fallbackHero?: string): CuratedCity {
  const key = cityName.toLowerCase().trim();
  if (CURATED_CITIES[key]) {
    return CURATED_CITIES[key];
  }

  // Check partial match
  const foundKey = Object.keys(CURATED_CITIES).find(k => key.includes(k) || k.includes(key));
  if (foundKey) {
    return CURATED_CITIES[foundKey];
  }

  // Dynamic high-precision generator for any real city entered by user
  const cleanName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const hero = fallbackHero || "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=92&dpr=2";

  return {
    id: key.replace(/\s+/g, "-"),
    name: cleanName,
    country: "Featured Destination",
    flag: "🌍",
    tagline: `Curated iconic highlights, smart transit passes, and verified itineraries for ${cleanName}.`,
    heroImg: hero,
    thumbs: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 85,
    attractions: [
      {
        id: `${cleanName.toLowerCase()}-old-town`,
        name: `${cleanName} Historic Old Town & Heritage Promenade`,
        category: "Cultural Heritage",
        duration: "2.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Quiet morning light, optimal photography)",
        tip: "Start at the central heritage square. Pedestrian avenues feature historic architecture and local artisanal shops.",
        crowdRating: "Moderate",
      },
      {
        id: `${cleanName.toLowerCase()}-landmark`,
        name: `${cleanName} National Monument & Panoramic Observation Point`,
        category: "Iconic Landmark",
        duration: "2 hours",
        costDisplay: "$15 ($15.00)",
        costUSD: 15.00,
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:15 PM (Golden hour view over the entire horizon)",
        tip: "Pre-book admission ticket online to skip the main ticket counter line.",
        crowdRating: "High",
      },
      {
        id: `${cleanName.toLowerCase()}-market`,
        name: `${cleanName} Grand Artisanal Food & Spice Market`,
        category: "Gastronomy & Local Flavors",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "12:30 PM (Lunch hour sampling of regional specialties)",
        tip: "Look for stalls with long queues of locals — best indicator of authentic taste and hygiene.",
        crowdRating: "High",
      },
      {
        id: `${cleanName.toLowerCase()}-gardens`,
        name: `${cleanName} Botanical Gardens & Waterfront Sanctuary`,
        category: "Nature & Tranquility",
        duration: "2 hours",
        costDisplay: "$5 ($5.00)",
        costUSD: 5.00,
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "03:30 PM (Peaceful afternoon stroll away from busy vehicle avenues)",
        tip: "Rent a city bicycle or find a shaded bench along the water for a relaxing break.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: `${cleanName} Regional Multi-Day Transit Card`,
      passTypeBadge: `${cleanName} Metropolitan Transit Pass`,
      passPrice: "$12 / 24-Hour Unlimited Pass",
      passPriceUSD: 12.00,
      passValidity: `Unlimited travel across all local metro lines, trams, and central buses in ${cleanName}.`,
      howToUse: "Tap contactless card or smartphone QR at station entry turnstiles. Valid for 24 hours from first tap.",
      operatorCode: `${cleanName.toUpperCase().slice(0, 3)}-TRANSIT-PASS`,
      options: [
        { name: `${cleanName} City Rapid Transit (Metro/Tram)`, type: "metro", cost: "$2.50 / single ride", tip: "Fastest way to traverse between the city center and outer heritage districts." },
        { name: "Verified Registered Cabs & Rideshare", type: "auto", cost: "Metered standard rates", tip: "Use official taxi stands or verified apps to guarantee fair meter pricing." },
        { name: "Public Bike Share Program", type: "bike", cost: "$5 / day pass", tip: "Dedicated lanes make cycling safe and scenic around waterfront areas." },
      ],
    },
  };
}

export interface HelplineContact {
  label: string;
  number: string;
  color: string;
}

export function getCityHelplines(cityName: string, country: string): HelplineContact[] {
  const norm = (cityName + " " + country).toLowerCase();

  if (norm.includes("france") || norm.includes("paris")) {
    return [
      { label: "European Emergency", number: "112", color: "var(--yellow)" },
      { label: "Police Secours", number: "17", color: "#5585E0" },
      { label: "Ambulance (SAMU)", number: "15", color: "#E05555" },
      { label: "Paris Tourist Police", number: "+33 1 53 71 53 71", color: "#14F195" },
      { label: "Fire Brigade (Pompiers)", number: "18", color: "#E07030" },
      { label: "SOS Médecins (24/7 Doctor)", number: "36 24", color: "#9B59B6" },
    ];
  }

  if (norm.includes("japan") || norm.includes("tokyo")) {
    return [
      { label: "Police (Incident & Lost Items)", number: "110", color: "#5585E0" },
      { label: "Ambulance & Fire Service", number: "119", color: "#E05555" },
      { label: "Japan Visitor Tourist Helpline", number: "0570-000-911", color: "var(--yellow)" },
      { label: "Tokyo Metropolitan Police English", number: "03-3501-0110", color: "#14F195" },
      { label: "Emergency Doctor (Himawari)", number: "03-5272-0303", color: "#9B59B6" },
      { label: "Disaster Preparedness Line", number: "171", color: "#E07030" },
    ];
  }

  if (norm.includes("emirates") || norm.includes("uae") || norm.includes("dubai")) {
    return [
      { label: "Dubai Police Emergency", number: "999", color: "#5585E0" },
      { label: "Ambulance Service", number: "998", color: "#E05555" },
      { label: "Dubai Tourist Police (24/7)", number: "901", color: "var(--yellow)" },
      { label: "Civil Defense / Fire", number: "997", color: "#E07030" },
      { label: "Coast Guard / Marine Emergency", number: "996", color: "#14F195" },
      { label: "RTA Public Transit Inquiries", number: "800 90 90", color: "#9B59B6" },
    ];
  }

  if (norm.includes("switzerland")) {
    return [
      { label: "General European Emergency", number: "112", color: "var(--yellow)" },
      { label: "Swiss Police", number: "117", color: "#5585E0" },
      { label: "Swiss Ambulance Service", number: "144", color: "#E05555" },
      { label: "Rega Alpine Air Rescue", number: "1414", color: "#E07030" },
      { label: "Tox Info Swiss (Poison/Medical)", number: "145", color: "#9B59B6" },
      { label: "Swiss Fire Brigade", number: "118", color: "#14F195" },
    ];
  }

  if (norm.includes("italy") || norm.includes("rome")) {
    return [
      { label: "European Emergency", number: "112", color: "var(--yellow)" },
      { label: "State Police (Carabinieri)", number: "113", color: "#5585E0" },
      { label: "Ambulance (Pronto Soccorso)", number: "118", color: "#E05555" },
      { label: "Fire (Vigili del Fuoco)", number: "115", color: "#E07030" },
      { label: "Rome City Tourist Call Center", number: "060608", color: "#14F195" },
      { label: "Roadside Assistance (ACI)", number: "803 116", color: "#9B59B6" },
    ];
  }

  if (norm.includes("indonesia") || norm.includes("bali")) {
    return [
      { label: "National Emergency Line", number: "112", color: "var(--yellow)" },
      { label: "Police (Polisi)", number: "110", color: "#5585E0" },
      { label: "Ambulance Service", number: "118", color: "#E05555" },
      { label: "Bali Tourist Police Unit", number: "(0361) 754599", color: "#14F195" },
      { label: "Search & Rescue (BASARNAS)", number: "115", color: "#E07030" },
      { label: "Fire Department", number: "113", color: "#9B59B6" },
    ];
  }

  if (norm.includes("greece")) {
    return [
      { label: "European Emergency Line", number: "112", color: "var(--yellow)" },
      { label: "Greek Police", number: "100", color: "#5585E0" },
      { label: "Tourist Police (English/Greek)", number: "1571", color: "var(--yellow)" },
      { label: "National Ambulance (EKAV)", number: "166", color: "#E05555" },
      { label: "Coast Guard / Island Marine Rescue", number: "108", color: "#14F195" },
      { label: "Fire Service", number: "199", color: "#E07030" },
    ];
  }

  if (norm.includes("maldives")) {
    return [
      { label: "Maldives Police Service", number: "119", color: "#5585E0" },
      { label: "Medical Emergency & Ambulance", number: "102", color: "#E05555" },
      { label: "Maldives Tourist Police Unit", number: "+960 979 0070", color: "var(--yellow)" },
      { label: "MNDF Coast Guard (Atoll Emergencies)", number: "191", color: "#14F195" },
      { label: "Fire & Rescue Service", number: "118", color: "#E07030" },
      { label: "Velana Int'l Airport Operations", number: "+960 332 3506", color: "#9B59B6" },
    ];
  }

  // India & Default Regional Numbers
  return [
    { label: "National Emergency / Police", number: "112 / 100", color: "#5585E0" },
    { label: "Ambulance", number: "108", color: "#E05555" },
    { label: "Incredible India Tourist Helpline", number: "1363 / 1800-11-1363", color: "var(--yellow)" },
    { label: "Women's Helpline (24/7)", number: "181", color: "#9B59B6" },
    { label: "Fire Emergency", number: "101", color: "#E07030" },
    { label: "National Highway Accident Line", number: "1033", color: "#14F195" },
  ];
}

export interface ReferenceRateItem {
  service: string;
  rate: string;
}

export function getCityReferenceRates(cityName: string, country: string): ReferenceRateItem[] {
  const norm = (cityName + " " + country).toLowerCase();

  if (norm.includes("france") || norm.includes("paris")) {
    return [
      { service: "Metro / RER single ticket", rate: "€2.15 (~$2.30)" },
      { service: "Airport taxi flat rate (Right Bank)", rate: "€56 flat" },
      { service: "Airport taxi flat rate (Left Bank)", rate: "€65 flat" },
      { service: "Louvre Museum general admission", rate: "€22" },
      { service: "Bistro 2-course lunch menu", rate: "€16–€24" },
      { service: "Café espresso at bar counter", rate: "€2.00–€2.60" },
    ];
  }

  if (norm.includes("japan") || norm.includes("tokyo")) {
    return [
      { service: "Tokyo Subway 24-hr unlimited ticket", rate: "¥800 (~$5.30)" },
      { service: "Narita Express to Tokyo Station", rate: "¥3,070" },
      { service: "Ramen bowl + gyoza lunch", rate: "¥900–¥1,350" },
      { service: "Capsule / Business hotel room", rate: "¥6,500–¥11,000" },
      { service: "Shinjuku Gyoen / Garden entry", rate: "¥500" },
      { service: "Convenience store onigiri & green tea", rate: "¥300" },
    ];
  }

  if (norm.includes("emirates") || norm.includes("uae") || norm.includes("dubai")) {
    return [
      { service: "Dubai Metro single (Zone 1–2)", rate: "AED 4.00–6.00" },
      { service: "RTA Taxi flag-down fare", rate: "AED 12 + 2.19/km" },
      { service: "Burj Khalifa At the Top (L124)", rate: "AED 179" },
      { service: "Traditional Abra Creek crossing", rate: "AED 1.00" },
      { service: "Shawarma wrap at Al Mallah", rate: "AED 12–18" },
      { service: "Shared desert safari + BBQ dinner", rate: "AED 120–160" },
    ];
  }

  if (norm.includes("switzerland")) {
    return [
      { service: "Swiss Travel Pass (daily flex)", rate: "CHF 75" },
      { service: "SBB InterCity regional hop", rate: "CHF 14–32" },
      { service: "Traditional cheese fondue meal", rate: "CHF 29–38" },
      { service: "Mountain gondola / cogwheel ticket", rate: "CHF 45–85" },
      { service: "Mid-range alpine hotel room", rate: "CHF 160–280" },
      { service: "Espresso & croissant at bakery", rate: "CHF 7.50" },
    ];
  }

  if (norm.includes("italy") || norm.includes("rome")) {
    return [
      { service: "ATAC 100-minute bus/metro ticket", rate: "€1.50" },
      { service: "Fiumicino airport taxi flat rate", rate: "€55 flat" },
      { service: "Colosseum + Roman Forum ticket", rate: "€18" },
      { service: "Trattoria cacio e pepe pasta", rate: "€12–€16" },
      { service: "Espresso at the counter", rate: "€1.20–€1.60" },
      { service: "Artisanal gelato (2 flavors)", rate: "€3.00–€4.00" },
    ];
  }

  if (norm.includes("indonesia") || norm.includes("bali")) {
    return [
      { service: "Scooter rental (daily rate)", rate: "IDR 75,000–95,000 (~$5–$6)" },
      { service: "Private car with driver (full day)", rate: "IDR 600,000–750,000" },
      { service: "Local Warung Nasi Campur meal", rate: "IDR 25,000–40,000" },
      { service: "Beachfront villa room (mid-range)", rate: "IDR 550,000–950,000" },
      { service: "Uluwatu Temple entry + Kecak dance", rate: "IDR 50,000 + 150,000" },
      { service: "Traditional 1-hour Balinese massage", rate: "IDR 120,000–160,000" },
    ];
  }

  if (norm.includes("greece")) {
    return [
      { service: "Athens Metro 90-minute pass", rate: "€1.20" },
      { service: "High-speed island ferry (standard)", rate: "€45–€70" },
      { service: "Acropolis & Parthenon entry", rate: "€20" },
      { service: "Traditional gyro pita wrap", rate: "€3.80–€4.80" },
      { service: "Seaside taverna fresh seafood meal", rate: "€22–€36" },
      { service: "Freddo espresso at café", rate: "€3.50" },
    ];
  }

  if (norm.includes("maldives")) {
    return [
      { service: "MTCC Public Atoll Ferry ticket", rate: "$2.00–$4.00" },
      { service: "Airport to Maafushi Speedboat", rate: "$25.00 flat" },
      { service: "Local island guesthouse room", rate: "$65–$120 / night" },
      { service: "Fresh grilled reef fish meal", rate: "$12–$20" },
      { service: "Guided coral reef snorkeling tour", rate: "$35–$50" },
      { service: "Short-eats (Hedhika) snack pack", rate: "$1.50" },
    ];
  }

  // India defaults
  return [
    { service: "Auto-rickshaw (short hop)", rate: "₹50–120" },
    { service: "City taxi / cab (10km)", rate: "₹150–280" },
    { service: "Tour guide (half-day licensed)", rate: "₹400–800" },
    { service: "Hotel room (clean budget)", rate: "₹800–1,500" },
    { service: "Hotel room (heritage / 3-4 star)", rate: "₹2,000–4,500" },
    { service: "Monument entry ticket", rate: "₹25–200" },
  ];
}

