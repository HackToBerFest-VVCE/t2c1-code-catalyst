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
    ],
    transit: {
      recommendedPass: "KSRTC Mysuru Sarige Daily Smart Pass",
      passTypeBadge: "Mysuru Urban Bus Commuter Pass",
      passPrice: "₹70 / Day (~$0.75)",
      passPriceUSD: 0.75,
      passValidity: "Unlimited travel across all green and red city buses in Mysuru metropolitan zone for 24 hours.",
      howToUse: "Purchase directly from any KSRTC conductor on boarding. Show physical ticket card upon conductor inspections.",
      operatorCode: "MYS-KSRTC-DAILY-01",
      options: [
        { name: "KSRTC Electric City Bus (Mitti / Vayu)", type: "bus", cost: "₹15–₹35 / ride", tip: "Frequent air-conditioned and non-AC buses connecting Palace, Chamundi Hills, and Railway Station." },
        { name: "Metered Green-Yellow Auto Rickshaw", type: "auto", cost: "₹30 flag down + ₹16/km", tip: "Demand meter running; prepaid auto booths available at Mysuru Junction railway station." },
        { name: "Trin Trin Public Bicycle Share", type: "bike", cost: "₹5 / hour", tip: "Automated docking hubs across city heritage zone; requires quick registration." },
      ],
    },
  },

  jaipur: {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    flag: "🇮🇳",
    tagline: "The Pink City — Rajput royal citadels, Sheesh Mahal mirrors, and artisan bazaars.",
    heroImg: "/images/destination-jaipur.jpg",
    thumbs: [
      "/images/destination-jaipur.jpg",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 55,
    attractions: [
      {
        id: "amer-fort",
        name: "Amer Fort & Maota Lake",
        category: "UNESCO Hill Fort",
        duration: "3.5 hours",
        costDisplay: "₹100 Indian / ₹550 Foreign",
        costUSD: 1.10,
        img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:30 AM (Beats afternoon desert heat and tour groups)",
        tip: "Take the 4x4 jeep or walk the stone rampart instead of elephants. The Sheesh Mahal ceiling mirrors glow with a single match.",
        crowdRating: "High",
      },
      {
        id: "hawa-mahal",
        name: "Hawa Mahal (Palace of Winds)",
        category: "Rajput Architecture",
        duration: "1.5 hours",
        costDisplay: "₹50 Indian / ₹200 Foreign",
        costUSD: 0.55,
        img: "/images/destination-jaipur.jpg",
        bestTime: "09:00 AM (Morning sunlight illuminates pink sandstone facade)",
        tip: "Cross the street to Wind View Café for the quintessential facade photo with tea.",
        crowdRating: "High",
      },
      {
        id: "city-palace-jaipur",
        name: "Jaipur City Palace & Chandra Mahal",
        category: "Royal Residence",
        duration: "2 hours",
        costDisplay: "₹200 Indian / ₹700 Foreign",
        costUSD: 2.10,
        img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "02:00 PM (Museum galleries provide cool indoor sanctuary)",
        tip: "Don't miss the 4 Peacock Courtyard gates representing the four seasons.",
        crowdRating: "Moderate",
      },
      {
        id: "jantar-mantar",
        name: "Jantar Mantar Astronomical Observatory",
        category: "UNESCO Science Heritage",
        duration: "1.5 hours",
        costDisplay: "₹50 Indian / ₹200 Foreign",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "12:00 PM (Shadows fall exact on world's largest stone sundial)",
        tip: "Hire an ASI certified guide; without explanation the massive geometric instruments look like modern sculptures.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Jaipur Metro Rail Tourist Smart Card",
      passTypeBadge: "JMRC Unlimited Tourist Travel Card",
      passPrice: "₹100 / 1-Day Unlimited Pass",
      passPriceUSD: 1.10,
      passValidity: "Unlimited rides on Jaipur Metro Pink Line from Mansarovar to Badi Chaupar (directly facing Hawa Mahal).",
      howToUse: "Buy at Badi Chaupar or Railway Station JMRC counter. Tap at turnstiles. Return refundable deposit at trip end.",
      operatorCode: "JMRC-JAIPUR-METRO",
      options: [
        { name: "Jaipur Metro Pink Line", type: "metro", cost: "₹6–₹22 / token", tip: "Air-conditioned fast line straight into the historic Walled Pink City core." },
        { name: "E-Rickshaws inside Walled City", type: "auto", cost: "₹20–₹50 / hop", tip: "Silent zero-emission rickshaws navigating narrow Johari and Bapu Bazaars." },
      ],
    },
  },

  goa: {
    id: "goa",
    name: "Goa",
    country: "India",
    flag: "🇮🇳",
    tagline: "Golden Konkan shores, UNESCO baroque churches, and vibrant coastal culture.",
    heroImg: "/images/destination-goa.jpg",
    thumbs: [
      "/images/destination-goa.jpg",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 50,
    attractions: [
      {
        id: "bom-jesus",
        name: "Basilica of Bom Jesus (Old Goa)",
        category: "UNESCO World Heritage",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Quiet prayer atmosphere before tour coaches arrive)",
        tip: "Houses the sacred mortal remains of St. Francis Xavier in a silver casket made by 17th-century Florentine sculptors.",
        crowdRating: "Moderate",
      },
      {
        id: "palolem-beach",
        name: "Palolem Crescent Beach & Butterfly Cove",
        category: "Coastal Sanctuary",
        duration: "4 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "/images/destination-goa.jpg",
        bestTime: "04:30 PM (Golden sunset, gentle swimming waters, and dolphin spotting)",
        tip: "South Goa's calmest swimming bay with natural headlands keeping waves gentle. Rent a transparent sea kayak.",
        crowdRating: "Moderate",
      },
      {
        id: "fontainhas",
        name: "Fontainhas Latin Quarter Heritage Walk",
        category: "Colonial Architecture",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:00 AM (Best pastel lighting on Portuguese-era yellow and blue villas)",
        tip: "Asia's only surviving Latin quarter. Stop at 31st January Bakery for warm Bebinca cake.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Kadamba Transport Corporation (KTC) Goa Pass",
      passTypeBadge: "Goa KTC Inter-City Bus Pass",
      passPrice: "₹120 / Day Pass",
      passPriceUSD: 1.25,
      passValidity: "Unlimited rides on AC electric buses between Panaji, Margao, Mapusa, Vasco, and coastal routes.",
      howToUse: "Issued at Panaji KTC bus terminal or via GoaMiles / KTC app.",
      operatorCode: "KTC-GOA-COASTAL",
      options: [
        { name: "Government Ferry River Crossings", type: "ferry", cost: "Free for pedestrians", tip: "Cross Mandovi and Zuari rivers leisurely with vehicle & foot passenger decks." },
        { name: "Two-Wheeler Scooter Self-Rental", type: "bike", cost: "₹350–₹500 / day", tip: "Ensure valid driving license; helmet strictly mandatory across all Goa highways." },
      ],
    },
  },

  delhi: {
    id: "delhi",
    name: "Delhi",
    country: "India",
    flag: "🇮🇳",
    tagline: "Imperial Mughal citadels, leafy Lutyens avenues, and culinary corridors.",
    heroImg: "/images/destination-delhi.jpg",
    thumbs: [
      "/images/destination-delhi.jpg",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1592635196078-9fe32a2608b6?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 45,
    attractions: [
      {
        id: "humayuns-tomb",
        name: "Humayun's Tomb & Charbagh Gardens",
        category: "UNESCO Mughal Heritage",
        duration: "2 hours",
        costDisplay: "₹40 Indian / ₹600 Foreign",
        costUSD: 0.45,
        img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Morning mist over red sandstone and Persian water canals)",
        tip: "Architectural predecessor to the Taj Mahal. Enter via Isa Khan's octagonal tomb enclosure first.",
        crowdRating: "Moderate",
      },
      {
        id: "qutub-minar",
        name: "Qutub Minar & Iron Pillar of Delhi",
        category: "UNESCO 12th-Century Minaret",
        duration: "2 hours",
        costDisplay: "₹40 Indian / ₹600 Foreign",
        costUSD: 0.45,
        img: "/images/destination-delhi.jpg",
        bestTime: "04:30 PM (Evening golden floodlights highlight sandstone calligraphy)",
        tip: "Examine the 1,600-year-old rust-resistant metallurgical iron pillar standing in the courtyard.",
        crowdRating: "High",
      },
      {
        id: "chandni-chowk",
        name: "Old Delhi Chandni Chowk & Jama Masjid",
        category: "Historic Bazaar & Street Food",
        duration: "3 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1592635196078-9fe32a2608b6?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM (Street food stalls freshly steaming parathas & jalebis)",
        tip: "Take a cycle-rickshaw through Khari Baoli, Asia's largest wholesale spice market.",
        crowdRating: "High",
      },
    ],
    transit: {
      recommendedPass: "Delhi Metro (DMRC) Tourist Smart Card",
      passTypeBadge: "DMRC 1-Day & 3-Day Unlimited Card",
      passPrice: "₹200 (1-Day) / ₹500 (3-Day)",
      passPriceUSD: 2.10,
      passValidity: "Unlimited rides on all 12 Delhi Metro lines, including Airport Express line.",
      howToUse: "Buy at any DMRC Customer Care center. Tap contactless card at AFC gates. ₹50 refundable security deposit included.",
      operatorCode: "DMRC-CAPITAL-METRO",
      options: [
        { name: "Delhi Metro Airport Express Line", type: "metro", cost: "₹60 / ride", tip: "Reaches New Delhi Railway Station from IGI Airport in 19 minutes with airline check-in counters." },
        { name: "Electric Feeder Buses", type: "bus", cost: "₹10 / ride", tip: "Connects metro stations directly to monuments like Qutub Minar and Lotus Temple." },
      ],
    },
  },

  kerala: {
    id: "kerala",
    name: "Kerala",
    country: "India",
    flag: "🇮🇳",
    tagline: "Emerald backwaters, private houseboats, spice hills, and Kathakali lore.",
    heroImg: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 4,
    avgDailyBudgetUSD: 50,
    attractions: [
      {
        id: "alleppey-backwaters",
        name: "Alleppey (Alappuzha) Backwater Cruise",
        category: "Scenic Waterways",
        duration: "4 hours",
        costDisplay: "₹150 SWTD / ₹4,500 Private Houseboat",
        costUSD: 1.60,
        img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM (Serene drifting past paddy fields and duck farms)",
        tip: "Government SWTD water ferries operate hourly between Alleppey and Kottayam for authentic local transit.",
        crowdRating: "Moderate",
      },
      {
        id: "fort-kochi",
        name: "Fort Kochi Chinese Fishing Nets & Mattancherry",
        category: "Maritime History",
        duration: "3 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:00 PM (Silhouetted cantilevered fishing nets against sunset)",
        tip: "Visit the Paradesi Synagogue (1568) in Jew Town and the Dutch Palace with Ramayana murals.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Kochi Water Metro & Kochi1 Card",
      passTypeBadge: "Kochi Water Metro Integrated Pass",
      passPrice: "₹100 / Day Pass",
      passPriceUSD: 1.10,
      passValidity: "Seamless integration across Kochi Metro rail and electric battery-powered Water Metro boats.",
      howToUse: "Issued at High Court Water Metro Terminal. Tap QR at turnstiles.",
      operatorCode: "KMRL-WATER-METRO",
      options: [
        { name: "Electric Water Metro Catamaran", type: "ferry", cost: "₹20–₹40 / trip", tip: "World's largest electric water transit network connecting mainland to island hubs." },
        { name: "KSRTC Swift Non-AC & AC Buses", type: "bus", cost: "₹20–₹60 / ride", tip: "Connects Kochi airport and railway stations directly to Fort Kochi and Alleppey." },
      ],
    },
  },

  varanasi: {
    id: "varanasi",
    name: "Varanasi",
    country: "India",
    flag: "🇮🇳",
    tagline: "Sacred Ganges morning aarti, centuries-old stone ghats, and spiritual transcendence.",
    heroImg: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 35,
    attractions: [
      {
        id: "dashashwamedh-aarti",
        name: "Dashashwamedh Ghat Grand Evening Ganga Aarti",
        category: "Spiritual Ceremony",
        duration: "1.5 hours",
        costDisplay: "Free Entry / ₹200 Boat Seat",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:15 PM (Arrive 45 mins early for steps seat or hire shared boat)",
        tip: "Seven priests perform synchronised Vedic chants with multi-tiered brass oil lamps facing mother Ganga.",
        crowdRating: "High",
      },
      {
        id: "subah-e-banaras",
        name: "Assi Ghat Sunrise Boat Cruise (Subah-e-Banaras)",
        category: "Sunrise & Ghats",
        duration: "2 hours",
        costDisplay: "₹300–₹500 / wooden boat",
        costUSD: 3.50,
        img: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:30 AM (First dawn rays illuminate 84 ghats from Assi to Manikarnika)",
        tip: "Rowing wooden boats provide silent, atmospheric views of morning yoga, bathers, and temple bells.",
        crowdRating: "Moderate",
      },
      {
        id: "sarnath-stupas",
        name: "Sarnath Dhamek Stupa & Deer Park",
        category: "Buddhist Heritage",
        duration: "2.5 hours",
        costDisplay: "₹25 Indian / ₹300 Foreign",
        costUSD: 0.30,
        img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Peaceful monastic gardens 10 km north of Varanasi)",
        tip: "Site where Lord Buddha delivered his first sermon. The Archaeological Museum houses the Ashoka Lion Capital.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Varanasi Smart Electric City Bus Pass",
      passTypeBadge: "UPSRTC Varanasi City Bus Pass",
      passPrice: "₹80 / Day Pass",
      passPriceUSD: 0.85,
      passValidity: "Unlimited travel on air-conditioned electric buses between Varanasi Junction, Cantt, BHU, and Sarnath.",
      howToUse: "Purchase via Chalo App or conductor on board. Show valid mobile pass.",
      operatorCode: "VNS-UPSRTC-EV",
      options: [
        { name: "Hand-Rowed Wooden Ghat Boats", type: "ferry", cost: "₹200–₹400 / hour", tip: "The traditional way to traverse the 84 ghats along the crescent Ganga bend." },
        { name: "Pedal & Electric Rickshaws", type: "auto", cost: "₹20–₹50 / hop", tip: "Navigates narrow galis (lanes) of Godowlia and Thatheri Bazar where cars cannot enter." },
      ],
    },
  },

  agra: {
    id: "agra",
    name: "Agra",
    country: "India",
    flag: "🇮🇳",
    tagline: "The Taj Mahal, monumental Agra Fort, and Mughal architectural grandeur.",
    heroImg: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 2,
    avgDailyBudgetUSD: 40,
    attractions: [
      {
        id: "taj-mahal",
        name: "Taj Mahal (Mausoleum of Love)",
        category: "UNESCO World Wonder",
        duration: "3 hours",
        costDisplay: "₹50 Indian / ₹1,100 Foreign",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:00 AM (Sunrise slot opens with soft pink marble tones and zero crowds)",
        tip: "Closed on Fridays. Enter via the East Gate. Security prohibits tripods, food, and lighters.",
        crowdRating: "High",
      },
      {
        id: "agra-fort",
        name: "Agra Red Fort & Musamman Burj",
        category: "UNESCO Mughal Citadel",
        duration: "2 hours",
        costDisplay: "₹50 Indian / ₹650 Foreign",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "03:30 PM (Late afternoon light streams through marble pavilions)",
        tip: "Stand at Musamman Burj where Emperor Shah Jahan gazed at the Taj Mahal during his final years of confinement.",
        crowdRating: "Moderate",
      },
      {
        id: "mehtab-bagh",
        name: "Mehtab Bagh (Moonlight Garden Viewpoint)",
        category: "Mughal Gardens",
        duration: "1.5 hours",
        costDisplay: "₹25 Indian / ₹300 Foreign",
        costUSD: 0.30,
        img: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:15 PM (Sunset across Yamuna river behind Taj Mahal)",
        tip: "Directly opposite the Taj Mahal across the river; the ultimate unobstructed golden hour photography spot.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Agra Metro Smart Rail Pass",
      passTypeBadge: "Agra Metro Priority Corridor Pass",
      passPrice: "₹60 / Day Card",
      passPriceUSD: 0.65,
      passValidity: "Unlimited travel on the newly opened Agra Metro Priority Line connecting Taj Mahal East Gate directly to Jama Masjid.",
      howToUse: "Tap at Taj East Gate or Agra Fort metro stations. Automatic entry via QR or metro card.",
      operatorCode: "UPMRC-AGRA-METRO",
      options: [
        { name: "Agra Metro Priority Line", type: "metro", cost: "₹10–₹30 / ride", tip: "State-of-the-art air-conditioned line stopping right at Taj Mahal East Gate." },
        { name: "Pollution-Free Battery Golf Carts", type: "auto", cost: "₹10 / person", tip: "Mandatory transit in the 500m eco-sensitive Taj Trapezium Zone where combustion vehicles are barred." },
      ],
    },
  },

  mumbai: {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    flag: "🇮🇳",
    tagline: "The City of Dreams — Victorian Gothic architecture, Marine Drive promenades, and coastal pulse.",
    heroImg: "/images/destination-bangalore.jpg",
    thumbs: [
      "/images/destination-bangalore.jpg",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 50,
    attractions: [
      {
        id: "gateway-of-india",
        name: "Gateway of India & Taj Mahal Palace Hotel",
        category: "Colonial Landmark",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "/images/destination-bangalore.jpg",
        bestTime: "07:00 AM (Cool Arabian Sea breeze and pigeon flocks before crowds arrive)",
        tip: "Historic 1924 basalt archway commemorating King George V's landing. Grab a cold brew at the iconic Taj hotel lobby.",
        crowdRating: "High",
      },
      {
        id: "marine-drive",
        name: "Marine Drive (The Queen's Necklace)",
        category: "Seaside Promenade",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:00 PM (Sunset over Arabian Sea as streetlights illuminate the crescent necklace)",
        tip: "Sit along the promenade tetrapods; enjoy roasted bhutta (corn) from local vendors.",
        crowdRating: "Moderate",
      },
      {
        id: "elephanta-caves",
        name: "Elephanta Island Rock-Cut Caves",
        category: "UNESCO 5th-Century Caves",
        duration: "4 hours",
        costDisplay: "₹40 Indian / ₹600 Foreign + ₹260 Ferry",
        costUSD: 3.20,
        img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "09:00 AM (Take the first ferry from Gateway of India)",
        tip: "Features the magnificent 20-foot three-headed Shiva Trimurti sculpture carved from solid basalt.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Mumbai Chalo Smart Card & Maha Metro Pass",
      passTypeBadge: "Mumbai Chalo Integrated Transit Card",
      passPrice: "₹150 / Day Pass",
      passPriceUSD: 1.60,
      passValidity: "Covers unlimited travel on BEST buses and discounts across Mumbai Suburban Trains and Metro Lines 1, 2A & 7.",
      howToUse: "Available at BEST depots and Suburban Railway Booking counters. Tap on bus or gate readers.",
      operatorCode: "MUM-BEST-CHALO",
      options: [
        { name: "BEST Electric AC Double-Decker Buses", type: "bus", cost: "₹6–₹25 / trip", tip: "Iconic red double-deckers modernized into silent, air-conditioned electric cruisers." },
        { name: "Mumbai Local Suburban Railway", type: "train", cost: "₹5–₹15 / ticket", tip: "Lifeline of Mumbai carrying 7.5 million daily commuters. Avoid peak rush hours 8–10 AM & 5–8 PM." },
      ],
    },
  },

  hampi: {
    id: "hampi",
    name: "Hampi",
    country: "India",
    flag: "🇮🇳",
    tagline: "UNESCO Vijayanagara boulder empire, monolithic chariot temples, and Tungabhadra waters.",
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010e42f9b88?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1600100397608-f010e42f9b88?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 35,
    attractions: [
      {
        id: "vittala-temple",
        name: "Vijaya Vittala Temple & Stone Chariot",
        category: "UNESCO Architectural Wonder",
        duration: "2.5 hours",
        costDisplay: "₹40 Indian / ₹600 Foreign",
        costUSD: 0.45,
        img: "https://images.unsplash.com/photo-1600100397608-f010e42f9b88?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "08:00 AM (Early morning illuminates the granite wheels of the iconic Stone Chariot)",
        tip: "Features 56 musical pillars that produce musical notes when struck (now cordoned for preservation).",
        crowdRating: "Moderate",
      },
      {
        id: "virupaksha-temple",
        name: "Virupaksha 7th-Century Living Temple",
        category: "Sacred Heritage",
        duration: "1.5 hours",
        costDisplay: "₹25 entry",
        costUSD: 0.28,
        img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "07:30 AM (Receive a blessing from Lakshmi the temple elephant)",
        tip: "Unbroken worship since the 7th century AD with an inverted pinhole camera shadow of the 160-foot gopuram inside.",
        crowdRating: "High",
      },
      {
        id: "matanga-hill",
        name: "Matanga Hill 360° Sunrise Summit",
        category: "Sunrise & Panorama",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:45 AM (Climb 20 mins before sunrise with flashlight)",
        tip: "Highest elevation in central Hampi offering panoramic views over boulder fields and temple ruins.",
        crowdRating: "Moderate",
      },
    ],
    transit: {
      recommendedPass: "Hampi Heritage Coracle & Bicycle Pass",
      passTypeBadge: "Hampi Eco-Heritage Explorer Pass",
      passPrice: "₹150 / Day",
      passPriceUSD: 1.60,
      passValidity: "Covers cycle rental across archaeological ruins and traditional round coracle boat river crossings.",
      howToUse: "Rent at Hampi Bazaar near Virupaksha temple.",
      operatorCode: "HMP-ECO-TRANSIT",
      options: [
        { name: "Traditional Bamboo Coracle Boat", type: "ferry", cost: "₹50 / crossing", tip: "Circular woven boats navigating Tungabhadra River between Hampi and Anegundi Hippie Island." },
        { name: "Geared Mountain Bicycle", type: "bike", cost: "₹100–₹150 / day", tip: "The best, quietest way to explore the 26 square kilometer boulder empire." },
      ],
    },
  },

  ladakh: {
    id: "ladakh",
    name: "Ladakh",
    country: "India",
    flag: "🇮🇳",
    tagline: "High-altitude Himalayan moonscapes, azure Pangong waters, and sacred cliffside gompas.",
    heroImg: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 5,
    avgDailyBudgetUSD: 70,
    attractions: [
      {
        id: "pangong-lake",
        name: "Pangong Tso High-Altitude Lake (14,270 ft)",
        category: "Himalayan Lake",
        duration: "Full Day",
        costDisplay: "Inner Line Permit Required (₹400)",
        costUSD: 4.50,
        img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:00 AM – 03:00 PM (Shifts through 7 shades of turquoise, cobalt, and indigo)",
        tip: "134 km long saltwater lake extending into Tibet. Stay overnight in eco-camps for stargazing.",
        crowdRating: "Moderate",
      },
      {
        id: "thiksey-monastery",
        name: "Thiksey Monastery (Mini Potala Palace)",
        category: "Tibetan Buddhist Gompa",
        duration: "2 hours",
        costDisplay: "₹50 entry",
        costUSD: 0.55,
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "06:30 AM (Attend morning monk prayer chants with conch horns)",
        tip: "Houses a breathtaking 49-foot two-story statue of Maitreya Future Buddha.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: "Leh Taxi Union Verified Shared Circuit Pass",
      passTypeBadge: "Ladakh Mountain Circuit Transit",
      passPrice: "₹1,200 / Person (Shared Pangong / Nubra Hop)",
      passPriceUSD: 13.00,
      passValidity: "Fixed official union-regulated rate for 4x4 high-clearance SUV transport over Khardung La Pass.",
      howToUse: "Book at the Leh Main Bazaar Taxi Union Counter. Fixed fair tariffs prevent tourist overcharging.",
      operatorCode: "LADAKH-TAXI-UNION-OFFICIAL",
      options: [
        { name: "Union 4x4 Mahindra Scorpio / Innova", type: "auto", cost: "Regulated union tariff", tip: "Experienced local mountain drivers skilled in high-altitude passes and stream crossings." },
        { name: "Royal Enfield 350/500cc Motorcycle", type: "bike", cost: "₹1,200–₹1,800 / day", tip: "The classic Ladakh adventure ride. Acclimatize in Leh for 48 hours first to prevent altitude sickness (AMS)." },
      ],
    },
  },
};

// Smart lookup helper for any Indian city
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

  // Fallback high-precision Indian city generator
  const cleanName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const hero = fallbackHero || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=92&dpr=2";

  return {
    id: key.replace(/\s+/g, "-"),
    name: cleanName,
    country: "India",
    flag: "🇮🇳",
    tagline: `Curated cultural heritage, local verified transit passes, and authenticated itineraries for ${cleanName}.`,
    heroImg: hero,
    thumbs: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    durationDays: 3,
    avgDailyBudgetUSD: 45,
    attractions: [
      {
        id: `${cleanName.toLowerCase()}-heritage`,
        name: `${cleanName} Historic Heritage Citadel & Old Fort`,
        category: "Cultural Landmark",
        duration: "2.5 hours",
        costDisplay: "₹50 Indian / ₹300 Foreign",
        costUSD: 0.55,
        img: hero,
        bestTime: "09:00 AM (Quiet morning light, ideal for architectural photography)",
        tip: "Start at the main gate. Features traditional regional stonework, peaceful inner courtyards, and artisan shops.",
        crowdRating: "Moderate",
      },
      {
        id: `${cleanName.toLowerCase()}-market`,
        name: `${cleanName} Central Spice, Silk & Artisan Bazaar`,
        category: "Local Culture & Flavors",
        duration: "2 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "11:30 AM or 04:30 PM (Peak vibrant marketplace colors and aromas)",
        tip: "Look for government-certified handloom emporiums to guarantee authentic silk and craft quality.",
        crowdRating: "High",
      },
      {
        id: `${cleanName.toLowerCase()}-temple`,
        name: `${cleanName} Ancient Riverside Temple & Sunset Ghat`,
        category: "Spiritual & Panorama",
        duration: "1.5 hours",
        costDisplay: "Free Entry",
        costUSD: 0,
        img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
        bestTime: "05:30 PM (Sunset ceremony and sacred river reflection)",
        tip: "Dress modestly covering shoulders and knees; remove shoes at temple counter.",
        crowdRating: "Peaceful",
      },
    ],
    transit: {
      recommendedPass: `${cleanName} Smart City Transit Pass`,
      passTypeBadge: `${cleanName} Urban Bus & Rail Card`,
      passPrice: "₹80 / Day Pass",
      passPriceUSD: 0.85,
      passValidity: `Unlimited travel on city transport buses and local transit lines across ${cleanName}.`,
      howToUse: "Obtain from bus station counter or conductor on boarding.",
      operatorCode: `${cleanName.toUpperCase().slice(0, 3)}-CITY-TRANSIT`,
      options: [
        { name: `${cleanName} City Bus Network`, type: "bus", cost: "₹15–₹40 / trip", tip: "Affordable and frequent buses connecting railway stations to major heritage sights." },
        { name: "Metered Auto-Rickshaws", type: "auto", cost: "₹30 flag down + ₹15/km", tip: "Ask driver to turn on digital meter or confirm fair price before departure." },
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
  return [
    { label: "National Emergency Service", number: "112", color: "#5585E0" },
    { label: "Incredible India 24x7 Tourist Helpline (12 Languages)", number: "1800-11-1363 / 1363", color: "var(--yellow)" },
    { label: "Police Emergency", number: "100", color: "#5585E0" },
    { label: "Medical Ambulance Service", number: "108", color: "#E05555" },
    { label: "Women's Safety Helpline (24/7)", number: "181 / 1090", color: "#9B59B6" },
    { label: "Fire & Rescue Brigade", number: "101", color: "#E07030" },
    { label: "National Highway Emergency Line", number: "1033", color: "#14F195" },
  ];
}

export interface ReferenceRateItem {
  service: string;
  rate: string;
}

export function getCityReferenceRates(cityName: string, country: string): ReferenceRateItem[] {
  return [
    { service: "Auto-rickshaw (short hop 2–4 km)", rate: "₹50–₹100" },
    { service: "City taxi / App cab (10 km)", rate: "₹160–₹280" },
    { service: "Licensed ASI Tour Guide (half-day)", rate: "₹500–₹1,000" },
    { service: "Clean budget guesthouse / hotel room", rate: "₹800–₹1,600 / night" },
    { service: "Heritage haveli / 4-star hotel stay", rate: "₹2,500–₹5,500 / night" },
    { service: "Authentic local thali lunch meal", rate: "₹100–₹250" },
    { service: "National monument entry ticket", rate: "₹25–₹50 (Indian) / ₹300–₹650 (Foreign)" },
  ];
}
