import fs from 'fs';

const pagePath = 'app/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');

const updatedDestinations = `// ─── Image Fallbacks (Ultra-HD 2K & Verified Local Landmarks) ───────────────
const FALLBACK_HERO = "/images/destinations/mysore-palace.jpg";
const FALLBACK_THUMB = "/images/destinations/hawa-mahal.jpg";

// ─── Data: 20 Curated 100% Indian Cultural Destinations ───────────────────────
const DESTINATIONS: DestinationItem[] = [
  {
    id: "mysuru", name: "Mysuru", country: "India", flag: "🇮🇳",
    price: "From ₹4,500", tag: "Heritage Pick",
    tagline: "Palaces of light, sandalwood heritage, and Karnataka's cultural heartland.",
    tripTitle: "Royal Heritage & Mysore Silk", duration: "3 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Havelis & 4-Star",
    bestSeason: "Oct – Mar",
    description: "Mysuru is Karnataka's cultural capital, celebrated for the illuminated Mysore Palace with 100,000 bulbs, Chamundi Hill vistas, Devaraja Market fragrances, and centuries-old sandalwood carving and silk weaving traditions.",
    heroImg: "/images/destinations/mysore-palace.jpg",
    thumbs: [
      "/images/destinations/chamundi-hill.jpg",
      "/images/destinations/devaraja-market.jpg",
      "/images/destinations/brindavan-gardens.jpg",
    ],
    stops: [
      { time: "09:30 AM", name: "Mysuru Palace Grand Tour", cost: "₹100", desc: "Indo-Saracenic royal residence and golden throne hall" },
      { time: "12:00 PM", name: "Devaraja Market & Spice Walk", cost: "₹0", desc: "Historic covered bazaar with fresh jasmine and local crafts" },
      { time: "04:30 PM", name: "Chamundi Hill & Sunrise Vista", cost: "₹0", desc: "Panoramic view over the city and sacred Nandi Bull" },
    ],
  },
  {
    id: "jaipur", name: "Jaipur", country: "India", flag: "🇮🇳",
    price: "From ₹5,200", tag: "Heritage Pick",
    tagline: "The Pink City — Rajput royalty, desert colors, and artisan bazaars.",
    tripTitle: "Forts, Palaces & Desert Gold", duration: "4 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Forts & Palace Hotels",
    bestSeason: "Oct – Mar",
    description: "Jaipur is the jewel of Rajasthan — a city built in rose-pink sandstone. Explore the majestic Amber Fort, the latticed Hawa Mahal, and the royal city palace, while shopping for gems, silk, and lac bangles in Johari Bazaar.",
    heroImg: "/images/destinations/hawa-mahal.jpg",
    thumbs: [
      "/images/destinations/amber-fort.jpg",
      "/images/destinations/city-palace-jaipur.jpg",
      "/images/destinations/jantar-mantar.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Amer Fort & Maota Lake", cost: "₹100", desc: "Hilltop citadel with Sheesh Mahal (Mirror Palace)" },
      { time: "01:30 PM", name: "Hawa Mahal (Palace of Winds)", cost: "₹50", desc: "Five-story pink sandstone screen built for royal women" },
      { time: "04:30 PM", name: "Johari Bazaar Gem & Silk Walk", cost: "₹0", desc: "Famous market for traditional jewelry and Jaipuri quilts" },
    ],
  },
  {
    id: "goa", name: "Goa", country: "India", flag: "🇮🇳",
    price: "From ₹7,500", tag: "Budget Friendly",
    tagline: "Sun, sea, Portuguese history, and India's most vibrant beach culture.",
    tripTitle: "Beaches & Bougainvillea", duration: "5 days",
    activityLevel: "Easy", accommodation: "Beach Resorts & Boutique Stays",
    bestSeason: "Nov – Feb",
    description: "Goa is India's coastal gem — a blend of Konkani culture, Portuguese colonial heritage, silver-sand beaches, and vibrant nightlife. Explore Old Goa's UNESCO churches, spice plantations, and legendary beach shacks.",
    heroImg: "/images/destinations/palolem-beach.jpg",
    thumbs: [
      "/images/destinations/bom-jesus.jpg",
      "/images/destinations/fontainhas.jpg",
      "/images/destinations/dudhsagar-falls.jpg",
    ],
    stops: [
      { time: "10:00 AM", name: "Basilica of Bom Jesus, Old Goa", cost: "₹0", desc: "UNESCO World Heritage baroque church housing St. Francis Xavier" },
      { time: "02:00 PM", name: "Palolem Crescent Beach", cost: "₹0", desc: "Calm swimming waters, dolphin boat trips, and seaside shacks" },
      { time: "07:00 PM", name: "Panjim Latin Quarter Walk", cost: "₹0", desc: "Portuguese-era colorful houses and riverfront dining" },
    ],
  },
  {
    id: "delhi", name: "Delhi", country: "India", flag: "🇮🇳",
    price: "From ₹5,000", tag: "Heritage Pick",
    tagline: "Imperial monuments, street food corridors, and timeless cultural heritage.",
    tripTitle: "Mughal Grandeur & Modern Capital", duration: "3 days",
    activityLevel: "Moderate", accommodation: "Boutique Havelis & Luxury Stays",
    bestSeason: "Oct – Mar",
    description: "Delhi is a vibrant tapestry of centuries — from Mughal-era Red Fort and Jama Masjid to the illuminated India Gate and Qutub Minar, complete with world-famous street food in Old Delhi.",
    heroImg: "/images/destinations/india-gate.jpg",
    thumbs: [
      "/images/destinations/qutub-minar.jpg",
      "/images/destinations/humayuns-tomb.jpg",
      "/images/destinations/red-fort.jpg",
    ],
    stops: [
      { time: "09:30 AM", name: "India Gate & Kartavya Path", cost: "₹0", desc: "Iconic war memorial archway surrounded by sprawling lawns and fountains" },
      { time: "01:00 PM", name: "Chandni Chowk Street Food Trail", cost: "₹350", desc: "Century-old parathas, jalebis, and spicy chaat in Old Delhi" },
      { time: "04:30 PM", name: "Qutub Minar Complex", cost: "₹40", desc: "UNESCO World Heritage 73-meter minaret and Iron Pillar of Delhi" },
    ],
  },
  {
    id: "bangalore", name: "Bangalore", country: "India", flag: "🇮🇳",
    price: "From ₹6,200", tag: "Trending",
    tagline: "Garden City elegance meets the cutting-edge Silicon Valley of India.",
    tripTitle: "Tech Parks, Craft Beer & Botanical Green", duration: "3 days",
    activityLevel: "Easy", accommodation: "Modern Business Hotels & Suites",
    bestSeason: "Year-Round",
    description: "Bangalore blends leafy boulevards, colonial-era parks like Lalbagh, vibrant microbreweries, and the futuristic innovation hub that powers India's digital revolution.",
    heroImg: "/images/destinations/vidhana-soudha.jpg",
    thumbs: [
      "/images/destinations/lalbagh-glasshouse.jpg",
      "/images/destinations/bangalore-palace.jpg",
      "/images/destinations/cubbon-park.jpg",
    ],
    stops: [
      { time: "08:30 AM", name: "Lalbagh Botanical Garden", cost: "₹30", desc: "Historic glass house inspired by London's Crystal Palace and centuries-old trees" },
      { time: "01:00 PM", name: "Indiranagar Craft Breweries & Cafes", cost: "₹800", desc: "Artisanal food and vibrant city social scene" },
      { time: "05:00 PM", name: "Bangalore Palace Grand Tour", cost: "₹250", desc: "Tudor-style royal estate with ornate woodwork and family memorabilia" },
    ],
  },
  {
    id: "kerala", name: "Kerala", country: "India", flag: "🇮🇳",
    price: "From ₹8,900", tag: "Trending",
    tagline: "Emerald backwaters, misty tea gardens of Munnar, and Ayurvedic wellness.",
    tripTitle: "God's Own Country Explorer", duration: "6 days",
    activityLevel: "Easy", accommodation: "Houseboats & Plantation Bungalows",
    bestSeason: "Sep – Mar",
    description: "Kerala features palm-fringed lagoons, tranquil backwaters in Alleppey, sprawling tea estates in Munnar, and centuries-old Kathakali traditions along the Arabian Sea.",
    heroImg: "/images/destinations/kerala-backwaters.jpg",
    thumbs: [
      "/images/destinations/munnar-tea.jpg",
      "/images/destinations/kochi-nets.jpg",
      "/images/destinations/athirappilly.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Alleppey Houseboat Cruise", cost: "₹1,200", desc: "Gliding through palm-fringed canals and tranquil lagoons" },
      { time: "02:00 PM", name: "Munnar Tea Estate & Tasting", cost: "₹150", desc: "Lush green rolling hills and fresh cardamom plantations" },
      { time: "06:30 PM", name: "Fort Kochi Chinese Nets Sunset", cost: "₹0", desc: "Cantilevered wooden nets silhouetted against the Arabian Sea" },
    ],
  },
  {
    id: "varanasi", name: "Varanasi", country: "India", flag: "🇮🇳",
    price: "From ₹4,800", tag: "Heritage Pick",
    tagline: "The eternal spiritual city along the sacred Ganges ghats.",
    tripTitle: "Ghats, Ganga Aarti & Silk", duration: "3 days",
    activityLevel: "Moderate", accommodation: "Riverside Havelis",
    bestSeason: "Oct – Mar",
    description: "Varanasi is one of the world's oldest living cities. Experience the mesmerizing evening Ganga Aarti at Dashashwamedh Ghat, dawn boat rides along the ghats, and ancient Banarasi silk weaving.",
    heroImg: "/images/destinations/varanasi-ghats.jpg",
    thumbs: [
      "/images/destinations/dashashwamedh-ghat.jpg",
      "/images/destinations/kashi-vishwanath.jpg",
      "/images/destinations/sarnath.jpg",
    ],
    stops: [
      { time: "05:30 AM", name: "Sunrise Boat Ride on Ganges", cost: "₹250", desc: "Peaceful morning views of historic bathing ghats and palaces" },
      { time: "11:00 AM", name: "Kashi Vishwanath Corridor", cost: "₹0", desc: "Revered golden temple dedicated to Lord Shiva" },
      { time: "06:30 PM", name: "Dashashwamedh Ganga Aarti", cost: "₹0", desc: "Grand multi-priest devotional prayer with flaming lamps" },
    ],
  },
  {
    id: "hampi", name: "Hampi", country: "India", flag: "🇮🇳",
    price: "From ₹5,000", tag: "Heritage Pick",
    tagline: "Vijayanagara boulder kingdom and UNESCO architectural marvels.",
    tripTitle: "Ruins of the Forgotten Empire", duration: "3 days",
    activityLevel: "Moderate", accommodation: "Heritage Resorts & River Huts",
    bestSeason: "Nov – Feb",
    description: "Hampi's surreal landscape of granite boulders frames the ruins of the 14th-century Vijayanagara Empire. Marvel at the stone chariot of Vittala Temple and the towering Virupaksha Temple.",
    heroImg: "/images/destinations/hampi-chariot.jpg",
    thumbs: [
      "/images/destinations/virupaksha-temple.jpg",
      "/images/destinations/matanga-hill.jpg",
      "/images/destinations/lotus-mahal.jpg",
    ],
    stops: [
      { time: "08:30 AM", name: "Vittala Temple & Stone Chariot", cost: "₹40", desc: "Iconic chariot sculpture and acoustic musical pillars" },
      { time: "01:00 PM", name: "Lotus Mahal & Elephant Stables", cost: "₹0", desc: "Indo-Islamic royal pavilions amidst gardens" },
      { time: "05:00 PM", name: "Sunset at Matanga Hill", cost: "₹0", desc: "Spectacular 360-degree panorama of boulder fields and ruins" },
    ],
  },
  {
    id: "ladakh", name: "Ladakh", country: "India", flag: "🇮🇳",
    price: "From ₹14,500", tag: "Trending",
    tagline: "High-altitude Himalayan desert, monasteries, and sapphire lakes.",
    tripTitle: "Roof of the World Expedition", duration: "7 days",
    activityLevel: "Challenging", accommodation: "Luxury Glamping & Homestays",
    bestSeason: "Jun – Sep",
    description: "Ladakh is a stark high-altitude paradise known for Tibetan Buddhist monasteries perched on cliffs, the crystal-blue Pangong Tso lake, and the highest motorable passes in the world.",
    heroImg: "/images/destinations/pangong-tso.jpg",
    thumbs: [
      "/images/destinations/thiksey-monastery.jpg",
      "/images/destinations/khardung-la.jpg",
      "/images/destinations/nubra-valley.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Thiksey Monastery Morning Prayer", cost: "₹50", desc: "12-story hilltop complex resembling Lhasa's Potala Palace" },
      { time: "02:00 PM", name: "Khardung La Pass Crossing", cost: "₹0", desc: "Drive across 17,982 ft mountain pass into Nubra Valley" },
      { time: "05:00 PM", name: "Pangong Tso Sunset Reflections", cost: "₹0", desc: "World's highest saltwater lake changing from turquoise to deep blue" },
    ],
  },
  {
    id: "coorg", name: "Coorg", country: "India", flag: "🇮🇳",
    price: "From ₹6,200", tag: "Budget Friendly",
    tagline: "Coffee capital of India, cascading waterfalls, and Kodava hospitality.",
    tripTitle: "Coffee Trails & Western Ghats", duration: "3 days",
    activityLevel: "Easy", accommodation: "Coffee Plantation Estates",
    bestSeason: "Oct – Apr",
    description: "Nestled in the lush Western Ghats, Coorg (Kodagu) is renowned for misty coffee plantations, spice gardens, Abbey Falls, and the source of the sacred River Cauvery.",
    heroImg: "/images/destinations/coorg-hills.jpg",
    thumbs: [
      "/images/destinations/abbey-falls.jpg",
      "/images/destinations/rajas-seat.jpg",
      "/images/destinations/namdroling-monastery.jpg",
    ],
    stops: [
      { time: "09:30 AM", name: "Organic Coffee & Pepper Walk", cost: "₹150", desc: "Guided walking tour through Arabica and Robusta plantations" },
      { time: "01:30 PM", name: "Abbey Falls & Hanging Bridge", cost: "₹20", desc: "Spectacular waterfall dropping amidst dense spice groves" },
      { time: "05:00 PM", name: "Raja's Seat Sunset Garden", cost: "₹25", desc: "Historic royal viewpoint overlooking rolling green valleys" },
    ],
  },
  {
    id: "udaipur", name: "Udaipur", country: "India", flag: "🇮🇳",
    price: "From ₹6,800", tag: "Heritage Pick",
    tagline: "The City of Lakes — marble palaces, ghats, and royal Mewar heritage.",
    tripTitle: "Venice of the East Royalty", duration: "4 days",
    activityLevel: "Easy", accommodation: "Heritage Lakefront Havelis",
    bestSeason: "Oct – Mar",
    description: "Udaipur captivates visitors with romantic Lake Pichola, the sprawling City Palace complex, Jag Mandir island, and colorful traditional artisan markets.",
    heroImg: "/images/destinations/udaipur-city-palace.jpg",
    thumbs: [
      "/images/destinations/lake-pichola.jpg",
      "/images/destinations/saheliyon-ki-bari.jpg",
      "/images/destinations/jagdish-temple.jpg",
    ],
    stops: [
      { time: "09:30 AM", name: "Udaipur City Palace", cost: "₹300", desc: "Rajasthan's largest royal palace with mirrors, tiles, and lake views" },
      { time: "02:00 PM", name: "Lake Pichola Boat Ride", cost: "₹450", desc: "Cruising past Jag Niwas (Lake Palace) and Jag Mandir" },
      { time: "06:00 PM", name: "Bagore Ki Haveli Folk Dance", cost: "₹100", desc: "Evening Dharohar cultural performance on the edge of the lake" },
    ],
  },
  {
    id: "agra", name: "Agra", country: "India", flag: "🇮🇳",
    price: "From ₹4,200", tag: "Heritage Pick",
    tagline: "The Taj Mahal, monumental Agra Red Fort, and Mughal architectural grandeur.",
    tripTitle: "Mughal Splendor & Marble Poetry", duration: "2 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Hotels with Taj Views",
    bestSeason: "Oct – Mar",
    description: "Home to the incomparable Taj Mahal, Agra was the seat of the Mughal Empire at its zenith. Marvel at the white marble poetry of the Taj, explore the fortified palaces of Agra Fort, and visit the imperial ghost city of Fatehpur Sikri.",
    heroImg: "/images/destinations/taj-mahal.jpg",
    thumbs: [
      "/images/destinations/agra-fort.jpg",
      "/images/destinations/mehtab-bagh.jpg",
      "/images/destinations/fatehpur-sikri.jpg",
    ],
    stops: [
      { time: "06:00 AM", name: "Taj Mahal Sunrise Visit", cost: "₹50", desc: "Witness the morning light transform white Makrana marble" },
      { time: "11:30 AM", name: "Agra Red Fort Tour", cost: "₹50", desc: "Massive sandstone fortress and royal Mughal pavilions" },
      { time: "05:00 PM", name: "Mehtab Bagh Sunset View", cost: "₹25", desc: "Mughal charbagh garden across the river from the Taj" },
    ],
  },
  {
    id: "mumbai", name: "Mumbai", country: "India", flag: "🇮🇳",
    price: "From ₹6,500", tag: "Trending",
    tagline: "City of Dreams — Gateway of India, Marine Drive promenades, and coastal pulse.",
    tripTitle: "Colonial Grandeur & Arabian Coasts", duration: "3 days",
    activityLevel: "Moderate", accommodation: "South Mumbai Heritage Stays",
    bestSeason: "Nov – Feb",
    description: "Mumbai is India's financial and cultural powerhouse, featuring Victorian Gothic landmarks, bustling Marine Drive sunsets, historic Irani cafés, and the ancient rock-cut Elephanta Island caves.",
    heroImg: "/images/destinations/mumbai-gateway.jpg",
    thumbs: [
      "/images/destinations/marine-drive.jpg",
      "/images/destinations/cst-mumbai.jpg",
      "/images/destinations/elephanta-caves.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Gateway of India & Elephanta Ferry", cost: "₹260", desc: "Harbor boat trip to 5th-century rock-cut Shiva Trimurti caves" },
      { time: "02:00 PM", name: "Kala Ghoda Art & Cafe Trail", cost: "₹0", desc: "Pedestrian art district with Victorian buildings and artisanal dining" },
      { time: "06:00 PM", name: "Marine Drive Queen's Necklace Walk", cost: "₹0", desc: "Sunset sea breeze along the illuminated 3.6 km crescent promenade" },
    ],
  },
  {
    id: "amritsar", name: "Amritsar", country: "India", flag: "🇮🇳",
    price: "From ₹3,900", tag: "Heritage Pick",
    tagline: "The Golden Temple, community langar hospitality, and patriotic Wagah border pride.",
    tripTitle: "Sacred Gold & Punjabi Heritage", duration: "2 days",
    activityLevel: "Easy", accommodation: "Heritage Hotels near Golden Temple",
    bestSeason: "Oct – Mar",
    description: "Amritsar is the spiritual heart of Sikhism, famous for the glowing Harmandir Sahib surrounded by the sacred Amrit Sarovar, the poignant history of Jallianwala Bagh, and the patriotic Wagah border ceremony.",
    heroImg: "/images/destinations/golden-temple.jpg",
    thumbs: [
      "/images/destinations/jallianwala-bagh.jpg",
      "/images/destinations/wagah-border.jpg",
      "/images/destinations/golden-temple.jpg",
    ],
    stops: [
      { time: "08:00 AM", name: "Golden Temple (Harmandir Sahib)", cost: "₹0", desc: "Sacred gilded shrine, peaceful hymns, and community langar" },
      { time: "12:00 PM", name: "Jallianwala Bagh Memorial", cost: "₹0", desc: "Historic national memorial and martyrs' well" },
      { time: "04:30 PM", name: "Attari-Wagah Border Ceremony", cost: "₹0", desc: "Daily military beating retreat ceremony at international border" },
    ],
  },
  {
    id: "rishikesh", name: "Rishikesh", country: "India", flag: "🇮🇳",
    price: "From ₹4,500", tag: "Budget Friendly",
    tagline: "Yoga capital of the world, sacred turquoise Ganges, and Himalayan foothills.",
    tripTitle: "Yoga, Ganga Aarti & Himalayan Rapids", duration: "3 days",
    activityLevel: "Moderate", accommodation: "Riverside Ashrams & Wellness Resorts",
    bestSeason: "Sep – Nov / Feb – May",
    description: "Cradled in the Himalayan foothills along the crystal-clear Ganges, Rishikesh is the global capital of yoga and meditation. Experience suspension bridges, evening Ganga Aarti at Triveni Ghat, and thrilling white-water rafting.",
    heroImg: "/images/destinations/lakshman-jhula.jpg",
    thumbs: [
      "/images/destinations/triveni-ghat.jpg",
      "/images/destinations/parmarth-niketan.jpg",
      "/images/destinations/beatles-ashram.jpg",
    ],
    stops: [
      { time: "07:30 AM", name: "Ganges Yoga & Meditation", cost: "₹0", desc: "Morning yoga session by the sacred river banks" },
      { time: "11:00 AM", name: "Beatles Ashram & Ram Jhula Walk", cost: "₹150", desc: "Historic 1968 meditation retreat and suspension bridge" },
      { time: "06:00 PM", name: "Triveni Ghat Maha Aarti", cost: "₹0", desc: "Spectacular evening lamp ritual with devotional chants" },
    ],
  },
  {
    id: "jaisalmer", name: "Jaisalmer", country: "India", flag: "🇮🇳",
    price: "From ₹5,800", tag: "Heritage Pick",
    tagline: "The Golden City — living sandstone fort, Thar Desert dunes, and camel safaris.",
    tripTitle: "Thar Desert Magic & Golden Citadel", duration: "3 days",
    activityLevel: "Moderate", accommodation: "Desert Luxury Tents & Havelis",
    bestSeason: "Oct – Mar",
    description: "Rising like a mirage from the Thar Desert, Jaisalmer is crafted entirely from golden yellow sandstone. Explore the living 12th-century Jaisalmer Fort, ornate Patwon Ki Haveli, and spend a night stargazing over the Sam Sand Dunes.",
    heroImg: "/images/destinations/jaisalmer-fort.jpg",
    thumbs: [
      "/images/destinations/sam-sand-dunes.jpg",
      "/images/destinations/patwon-ki-haveli.jpg",
      "/images/destinations/gadisar-lake.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Jaisalmer Golden Fort Walk", cost: "₹0", desc: "Explore the living fortress with medieval residences and Jain temples" },
      { time: "02:00 PM", name: "Patwon Ki Haveli Stone Carving", cost: "₹50", desc: "Elaborately carved sandstone balconies and courtyards" },
      { time: "04:30 PM", name: "Sam Sand Dunes Camel Safari", cost: "₹500", desc: "Sunset camel ride across Thar desert dunes with folk music" },
    ],
  },
  {
    id: "srinagar", name: "Srinagar", country: "India", flag: "🇮🇳",
    price: "From ₹9,200", tag: "Trending",
    tagline: "Paradise on Earth — Dal Lake shikaras, floating houseboats, and Mughal gardens.",
    tripTitle: "Kashmir Valley Splendor", duration: "4 days",
    activityLevel: "Easy", accommodation: "Cedar Houseboats & Luxury Resorts",
    bestSeason: "Apr – Oct (Autumn Gold)",
    description: "Srinagar is the jewel of Kashmir, surrounded by snow-capped Pir Panjal mountains. Glide in wooden shikaras along Dal Lake, stay in carved walnut-wood houseboats, and walk through Nishat and Shalimar Mughal terraced gardens.",
    heroImg: "/images/destinations/dal-lake.jpg",
    thumbs: [
      "/images/destinations/nishat-bagh.jpg",
      "/images/destinations/shankaracharya-temple.jpg",
      "/images/destinations/gulmarg.jpg",
    ],
    stops: [
      { time: "06:00 AM", name: "Dal Lake Shikara & Floating Market", cost: "₹800", desc: "Peaceful morning boat ride past lotus gardens and markets" },
      { time: "11:00 AM", name: "Nishat & Shalimar Mughal Gardens", cost: "₹25", desc: "Terraced water fountains with majestic Chinar tree canopies" },
      { time: "04:00 PM", name: "Shankaracharya Hilltop Temple", cost: "₹0", desc: "Ancient stone Shiva shrine overlooking Srinagar valley" },
    ],
  },
  {
    id: "andaman", name: "Andaman Islands", country: "India", flag: "🇮🇳",
    price: "From ₹12,800", tag: "Trending",
    tagline: "Pristine turquoise waters, white coral sands, and lush tropical islands.",
    tripTitle: "Tropical Reefs & Coral Paradise", duration: "5 days",
    activityLevel: "Moderate", accommodation: "Beachfront Eco-Villas & Resorts",
    bestSeason: "Oct – May",
    description: "The Andaman Islands offer India's ultimate tropical escape. Visit Radhanagar Beach on Havelock Island (voted among Asia's best beaches), snorkel vibrant coral reefs at Elephant Beach, and tour the historic Cellular Jail in Port Blair.",
    heroImg: "/images/destinations/radhanagar-beach.jpg",
    thumbs: [
      "/images/destinations/cellular-jail.jpg",
      "/images/destinations/elephant-beach.jpg",
      "/images/destinations/ross-island.jpg",
    ],
    stops: [
      { time: "09:00 AM", name: "Cellular Jail National Memorial", cost: "₹30", desc: "Historic freedom struggle monument in Port Blair" },
      { time: "02:00 PM", name: "Radhanagar Beach Sunset Walk", cost: "₹0", desc: "Pristine white sand and crystalline turquoise ocean water" },
      { time: "06:00 PM", name: "Ross Island Heritage Ruins", cost: "₹50", desc: "British colonial ruins overgrown with giant banyan roots" },
    ],
  },
  {
    id: "darjeeling", name: "Darjeeling", country: "India", flag: "🇮🇳",
    price: "From ₹5,500", tag: "Budget Friendly",
    tagline: "Queen of the Hills — Himalayan toy train, tea estates, and Kanchenjunga peaks.",
    tripTitle: "Tea Gardens & Mountain Steam", duration: "3 days",
    activityLevel: "Easy to Moderate", accommodation: "Colonial Heritage Hotels & Homestays",
    bestSeason: "Mar – May / Oct – Dec",
    description: "Perched at 6,700 feet with panoramic views of Mount Kanchenjunga, Darjeeling is world-famous for its aromatic tea plantations, the UNESCO World Heritage steam Toy Train, and crisp mountain air.",
    heroImg: "/images/destinations/darjeeling-toy-train.jpg",
    thumbs: [
      "/images/destinations/tiger-hill.jpg",
      "/images/destinations/happy-valley-tea.jpg",
      "/images/destinations/peace-pagoda.jpg",
    ],
    stops: [
      { time: "04:30 AM", name: "Tiger Hill Sunrise over Kanchenjunga", cost: "₹50", desc: "Witness dawn illuminate the world's 3rd highest mountain peak" },
      { time: "10:00 AM", name: "Darjeeling Himalayan Railway (Toy Train)", cost: "₹600", desc: "UNESCO heritage narrow-gauge steam engine joyride via Batasia Loop" },
      { time: "02:30 PM", name: "Happy Valley Tea Estate Tasting", cost: "₹150", desc: "Walk through emerald tea bushes and taste fine First Flush teas" },
    ],
  },
  {
    id: "meghalaya", name: "Meghalaya", country: "India", flag: "🇮🇳",
    price: "From ₹7,900", tag: "Trending",
    tagline: "Abode of Clouds — living root bridges, thundering waterfalls, and crystal Dawki river.",
    tripTitle: "Living Root Bridges & Cloud Forests", duration: "4 days",
    activityLevel: "Challenging", accommodation: "Bamboo Eco-Lodges & Homestays",
    bestSeason: "Oct – Apr",
    description: "Meghalaya is a wonderland of bio-engineered living root bridges in Cherrapunji, crystalline transparent waters in Dawki River, and roaring waterfalls plunging into emerald rainforest canyons.",
    heroImg: "/images/destinations/living-root-bridge.jpg",
    thumbs: [
      "/images/destinations/nohkalikai-falls.jpg",
      "/images/destinations/dawki-river.jpg",
      "/images/destinations/krang-shuri.jpg",
    ],
    stops: [
      { time: "08:00 AM", name: "Double Decker Living Root Bridge Trek", cost: "₹50", desc: "Hike through lush Khasi rainforest to 150-year-old living rubber tree bridges" },
      { time: "01:30 PM", name: "Nohkalikai Falls Observation", cost: "₹20", desc: "Tallest plunge waterfall in India dropping 1,115 feet into an emerald pool" },
      { time: "04:30 PM", name: "Dawki Umngot River Boat Ride", cost: "₹800", desc: "Boating on crystal-clear transparent waters where boats seem to float in air" },
    ],
  },
];`;

const startMarker = '// ─── Image Fallbacks';
const endMarker = '// ─── Dynamic AI Destination Generator';

const startIndex = page.indexOf(startMarker);
const endIndex = page.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers', { startIndex, endIndex });
  process.exit(1);
}

const newPage = page.slice(0, startIndex) + updatedDestinations + '\n\n' + page.slice(endIndex);
fs.writeFileSync(pagePath, newPage);
console.log('Successfully updated DESTINATIONS in app/page.tsx');
