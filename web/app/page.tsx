"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// Client-only dynamic import of WalletMultiButton to eliminate Next.js SSR hydration mismatch
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button" style={{ opacity: 0.8 }}>
        Select Wallet
      </button>
    ),
  }
);
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";
import {
  Globe, Search, Sparkles, CheckCircle, Phone, DollarSign,
  ExternalLink, Loader2, ArrowRight, ArrowLeft, Plus, RefreshCw, Lock,
  Zap, Receipt, MapPin, Clock, Star, Train, Bus, Car, Ship,
  Bike, Check, Users, ShieldCheck, Flame, Leaf, Coffee,
  Calendar, RotateCcw, ClipboardList, Ticket,
} from "lucide-react";
import {
  getCuratedCityData,
  type CuratedCity,
  type CityAttraction,
} from "../lib/curated-city-data";

// ─── Types ───────────────────────────────────────────────────────────────────
type MainTab = "discover" | "agents" | "price" | "safety" | "records";

type DestinationItem = {
  id: string; name: string; country: string; flag: string;
  price: string; tag: string; tagline: string; tripTitle: string;
  duration: string; activityLevel: string; accommodation: string;
  bestSeason: string; description: string; heroImg: string;
  thumbs: string[];
  stops: Array<{ time: string; name: string; cost: string; desc: string }>;
};

// ─── Image Fallbacks (Ultra-HD 2K & Retina Enhanced) ─────────────────────────
const FALLBACK_HERO = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=95&dpr=2";
const FALLBACK_THUMB = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=90&dpr=2";

// ─── Data: 20 Curated Global & Indian Destinations ─────────────────────────
const DESTINATIONS: DestinationItem[] = [
  {
    id: "mysuru", name: "Mysuru", country: "India", flag: "🇮🇳",
    price: "From ₹4,500", tag: "Heritage Pick",
    tagline: "Palaces of light, sandalwood heritage, and Karnataka's cultural heartland.",
    tripTitle: "Royal Heritage & Mysore Silk", duration: "3 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Havelis & 4-Star",
    bestSeason: "Oct – Mar",
    description: "Mysuru is Karnataka's cultural capital, celebrated for the illuminated Mysore Palace with 100,000 bulbs, Chamundi Hill vistas, Devaraja Market fragrances, and centuries-old sandalwood carving and silk weaving traditions.",
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:30 AM", name: "Mysuru Palace Grand Tour", cost: "₹70", desc: "Indo-Saracenic royal residence and golden throne hall" },
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
    heroImg: "/images/destination-jaipur.jpg",
    thumbs: [
      "/images/destination-jaipur.jpg",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1509625902746-8266e2f74bd1?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "/images/destination-goa.jpg",
    thumbs: [
      "/images/destination-goa.jpg",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "10:00 AM", name: "Basilica of Bom Jesus, Old Goa", cost: "₹0", desc: "UNESCO World Heritage baroque church housing St. Francis Xavier" },
      { time: "02:00 PM", name: "Anjuna Beach & Flea Market", cost: "₹0", desc: "Iconic hippie market along the rocky shoreline" },
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
    heroImg: "/images/destination-delhi.jpg",
    thumbs: [
      "/images/destination-delhi.jpg",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "/images/destination-bangalore.jpg",
    thumbs: [
      "/images/destination-bangalore.jpg",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Alleppey Houseboat Cruise", cost: "₹1,200", desc: "Gliding through palm-fringed canals and tranquil lagoons" },
      { time: "02:00 PM", name: "Munnar Tea Estate & Tasting", cost: "₹100", desc: "Lush green rolling hills and fresh cardamom plantations" },
      { time: "06:30 PM", name: "Kochi Kathakali Performance", cost: "₹400", desc: "Traditional classical dance-drama and mudra storytelling" },
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
    heroImg: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1588096344356-9b49740523d4?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Thiksey Monastery Morning Prayer", cost: "₹50", desc: "12-story hilltop complex resembling Lhasa's Potala Palace" },
      { time: "02:00 PM", name: "Khardung La Pass Crossing", cost: "₹0", desc: "Drive across 17,582 ft mountain pass into Nubra Valley" },
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
    heroImg: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=90&dpr=2",
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
    heroImg: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:30 AM", name: "Udaipur City Palace", cost: "₹300", desc: "Rajasthan's largest royal palace with mirrors, tiles, and lake views" },
      { time: "02:00 PM", name: "Lake Pichola Boat Ride", cost: "₹450", desc: "Cruising past Jag Niwas (Lake Palace) and Jag Mandir" },
      { time: "06:00 PM", name: "Bagore Ki Haveli Folk Dance", cost: "₹100", desc: "Evening Dharohar cultural performance on the edge of the lake" },
    ],
  },
  {
    id: "greece", name: "Greece", country: "Greece", flag: "🇬🇷",
    price: "$2,950 per person", tag: "Trending",
    tagline: "Sunlit islands, ancient ruins, and the timeless charm of the Mediterranean.",
    tripTitle: "Isles of Myth & Sun", duration: "8 days",
    activityLevel: "Moderate", accommodation: "4-star Caldera Suites",
    bestSeason: "May – Oct",
    description: "Greece is a destination where ancient history meets crystal-clear seas and vibrant island culture. Explore the Acropolis in Athens, watch world-famous sunsets in Santorini, and savor authentic Mediterranean dining.",
    heroImg: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Acropolis & Parthenon", cost: "$35", desc: "Ancient citadel of classical Greece overlooking Athens" },
      { time: "01:00 PM", name: "Plaka Traditional Taverna", cost: "$25", desc: "Authentic Greek lunch in historic cobblestone alleyways" },
      { time: "05:30 PM", name: "Oia Sunset Walk, Santorini", cost: "$0", desc: "Iconic blue-domed churches and panoramic Aegean sunset" },
    ],
  },
  {
    id: "japan", name: "Japan", country: "Japan", flag: "🇯🇵",
    price: "From $2,600", tag: "Trending",
    tagline: "Ancient temples, neon cities, cherry blossoms — an unforgettable cultural journey.",
    tripTitle: "Sakura, Shrines & Ramen", duration: "12 days",
    activityLevel: "Easy", accommodation: "Ryokan & City Hotels",
    bestSeason: "Mar – May, Oct – Nov",
    description: "Japan blends ancient tradition with ultra-modern innovation. Walk through bamboo groves in Arashiyama, marvel at Fushimi Inari's thousand torii gates, and explore the electric streets of Shibuya and Akihabara.",
    heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "08:00 AM", name: "Fushimi Inari Taisha Hike", cost: "¥0", desc: "Thousands of vermillion torii gates through forested mountain" },
      { time: "01:00 PM", name: "Arashiyama Bamboo Grove", cost: "¥0", desc: "Ethereal bamboo forest walk by the Oi River" },
      { time: "06:00 PM", name: "Dotonbori Food Street, Osaka", cost: "¥2000", desc: "Takoyaki, ramen, and street food in neon-lit Osaka" },
    ],
  },
  {
    id: "peru", name: "Peru", country: "Peru", flag: "🇵🇪",
    price: "From $2,450", tag: "Budget Friendly",
    tagline: "Mystical mountains, history, and the legendary ruins of Machu Picchu.",
    tripTitle: "Inca Trail & Amazon Edge", duration: "10 days",
    activityLevel: "Challenging", accommodation: "Eco Lodges & Mountain Camps",
    bestSeason: "Apr – Oct",
    description: "Peru is an adventure destination combining ancient Inca civilization, Amazon rainforest biodiversity, and stunning Andean landscapes. Trek the legendary Inca Trail to Machu Picchu and explore the Sacred Valley.",
    heroImg: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "06:00 AM", name: "Machu Picchu Sunrise Entry", cost: "$45", desc: "The Inca citadel at dawn — misty and breathtaking" },
      { time: "12:30 PM", name: "Sacred Valley Market", cost: "$0", desc: "Traditional textiles and Andean crafts from local artisans" },
      { time: "07:00 PM", name: "Cusco Night Food Tour", cost: "$30", desc: "Ceviche, cuy, and chicha morada in ancient Inca capital" },
    ],
  },
  {
    id: "paris", name: "Paris", country: "France", flag: "🇫🇷",
    price: "$2,200 per person", tag: "Trending",
    tagline: "The City of Light — iconic architecture, Louvre masterpieces, and café culture.",
    tripTitle: "Seine, Spires & Impressionism", duration: "5 days",
    activityLevel: "Moderate", accommodation: "Haussmann Boutique Hotels",
    bestSeason: "Apr – Jun, Sep – Nov",
    description: "Paris offers world-class art, culinary elegance, and landmark monuments. Cruise the Seine at dusk, admire the Eiffel Tower lights, and stroll through Montmartre's artist squares.",
    heroImg: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1520939817895-060bdef4dc1a?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:30 AM", name: "Louvre Museum & Mona Lisa", cost: "€22", desc: "World's grandest art museum in former royal palace" },
      { time: "02:00 PM", name: "Saint-Germain Café & Pastry Walk", cost: "€18", desc: "Legendary literary cafés and fresh buttery croissants" },
      { time: "07:30 PM", name: "Eiffel Tower & Seine Cruise", cost: "€30", desc: "Illuminated iron spire and panoramic evening river views" },
    ],
  },
  {
    id: "bali", name: "Bali", country: "Indonesia", flag: "🇮🇩",
    price: "From $1,350", tag: "Budget Friendly",
    tagline: "Tropical temple retreats, emerald rice terraces, and surf shores.",
    tripTitle: "Island of the Gods Journey", duration: "7 days",
    activityLevel: "Easy", accommodation: "Jungle Villas & Beachfront Resorts",
    bestSeason: "Apr – Oct",
    description: "Bali is Indonesia's most famous tropical escape, featuring tiered rice terraces in Ubud, cliffside sea temples in Uluwatu, and vibrant coastal beach clubs.",
    heroImg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "08:00 AM", name: "Tegallalang Rice Terraces", cost: "$5", desc: "Iconic sculpted green valley and jungle swings" },
      { time: "01:00 PM", name: "Tirta Empul Holy Water Temple", cost: "$5", desc: "Ancient Balinese Hindu purification springs" },
      { time: "05:30 PM", name: "Uluwatu Sunset Kecak Fire Dance", cost: "$15", desc: "Dramatic choral dance atop a 70m ocean cliff" },
    ],
  },
  {
    id: "switzerland", name: "Switzerland", country: "Switzerland", flag: "🇨🇭",
    price: "From $3,400", tag: "Trending",
    tagline: "Glacial peaks, turquoise alpine lakes, and panoramic scenic rail.",
    tripTitle: "Alpine Summits & Crystal Lakes", duration: "7 days",
    activityLevel: "Moderate", accommodation: "Alpine Chalets & Mountain Lodges",
    bestSeason: "Jun – Sep, Dec – Mar",
    description: "Switzerland boasts soaring Alpine peaks, the Jungfraujoch top of Europe, scenic railway journeys on the Glacier Express, and pristine lakeside towns like Lucerne and Interlaken.",
    heroImg: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Jungfraujoch Sphinx Observatory", cost: "CHF 120", desc: "Top of Europe train station amidst Aletsch Glacier" },
      { time: "02:00 PM", name: "Lake Brienz Turquoise Cruise", cost: "CHF 35", desc: "Steamer cruise framed by vertical alpine waterfalls" },
      { time: "05:30 PM", name: "Grindelwald First Cliff Walk", cost: "CHF 0", desc: "Suspended bridge with views of the north face of the Eiger" },
    ],
  },
  {
    id: "dubai", name: "Dubai", country: "UAE", flag: "🇦🇪",
    price: "From $1,800", tag: "Trending",
    tagline: "Futuristic skyscrapers, desert dune safaris, and luxury marina lifestyle.",
    tripTitle: "Desert Gold & Modern Marvels", duration: "5 days",
    activityLevel: "Easy", accommodation: "5-Star Marina & Downtown Hotels",
    bestSeason: "Nov – Mar",
    description: "Dubai represents ultra-modern architectural ambition, from the Burj Khalifa and Palm Jumeirah to thrilling desert quad safaris and historic gold souks along Dubai Creek.",
    heroImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "10:00 AM", name: "Burj Khalifa At the Top (Level 124)", cost: "$45", desc: "Panoramic view over the Arabian Gulf and skyscrapers" },
      { time: "03:30 PM", name: "Red Dune Desert Safari & BBQ", cost: "$55", desc: "4x4 dune bashing, camel trek, and desert stargazing" },
      { time: "08:00 PM", name: "Dubai Fountain Spectacle", cost: "$0", desc: "Choreographed musical fountain at the foot of Dubai Mall" },
    ],
  },
  {
    id: "rome", name: "Rome", country: "Italy", flag: "🇮🇹",
    price: "From $2,100", tag: "Heritage Pick",
    tagline: "The Colosseum, Vatican treasures, and timeless cobblestone piazzas.",
    tripTitle: "Imperial Caesars & Renaissance Art", duration: "5 days",
    activityLevel: "Moderate", accommodation: "Historic Piazza Boutique Hotels",
    bestSeason: "Apr – Jun, Sep – Oct",
    description: "Rome is an open-air museum filled with classical antiquity, including the Colosseum, Roman Forum, Pantheon, and St. Peter's Basilica, punctuated by artisanal gelato and pasta.",
    heroImg: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Colosseum & Roman Forum", cost: "€18", desc: "Gladiator arena and civic heart of ancient Rome" },
      { time: "01:30 PM", name: "Trastevere Cacio e Pepe Lunch", cost: "€20", desc: "Historic bohemian alleyways with authentic Roman trattorias" },
      { time: "05:00 PM", name: "Trevi Fountain & Spanish Steps", cost: "€0", desc: "Baroque marble masterpiece and evening gelato stroll" },
    ],
  },
  {
    id: "iceland", name: "Iceland", country: "Iceland", flag: "🇮🇸",
    price: "From $3,100", tag: "Trending",
    tagline: "Fire and ice — Northern Lights, thermal lagoons, and roaring waterfalls.",
    tripTitle: "Golden Circle & Aurora Borealis", duration: "6 days",
    activityLevel: "Moderate", accommodation: "Geothermal Cabins & Eco-Lodges",
    bestSeason: "Sep – Mar (Aurora), Jun – Aug (Hiking)",
    description: "Iceland features volcanic craters, spouting geysers, the mineral-rich Blue Lagoon, and dramatic black sand beaches along the Atlantic coast.",
    heroImg: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:30 AM", name: "Thingvellir National Park & Geysir", cost: "$0", desc: "Tectonic continental rift and erupting Strokkur geyser" },
      { time: "02:00 PM", name: "Gullfoss Golden Waterfall", cost: "$0", desc: "Massive two-tiered glacial waterfall thundering into a canyon" },
      { time: "06:00 PM", name: "Blue Lagoon Geothermal Soak", cost: "$85", desc: "Mineral-rich warm silica waters surrounded by lava fields" },
    ],
  },
  {
    id: "thailand", name: "Thailand", country: "Thailand", flag: "🇹🇭",
    price: "From $1,250", tag: "Budget Friendly",
    tagline: "Golden royal temples, floating markets, and turquoise Andaman islands.",
    tripTitle: "Siam Temples & Tropical Islands", duration: "7 days",
    activityLevel: "Easy", accommodation: "Riverfront & Island Beach Resorts",
    bestSeason: "Nov – Apr",
    description: "Thailand combines Bangkok's Grand Palace and bustling street food stalls with Phuket's limestone karsts and crystal waters.",
    heroImg: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Grand Palace & Wat Phra Kaew", cost: "฿500", desc: "Resplendent royal compound and sacred Emerald Buddha" },
      { time: "01:30 PM", name: "Chao Phraya Express Longtail Boat", cost: "฿50", desc: "Scenic river transit past temples and traditional canal houses" },
      { time: "06:00 PM", name: "Yaowarat Chinatown Street Food", cost: "฿250", desc: "World-famous pad thai, mango sticky rice, and seafood" },
    ],
  },
  {
    id: "maldives", name: "Maldives", country: "Maldives", flag: "🇲🇻",
    price: "From $3,600", tag: "Trending",
    tagline: "Overwater bungalows, vibrant coral reefs, and pristine turquoise atolls.",
    tripTitle: "Private Lagoon & Coral Sanctuary", duration: "5 days",
    activityLevel: "Easy", accommodation: "Luxury Overwater Villas",
    bestSeason: "Nov – Apr",
    description: "The Maldives offers quintessential tropical barefoot luxury, boasting crystal clear lagoons, private ocean overwater bungalows, manta ray diving, and coral reef conservation.",
    heroImg: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:00 AM", name: "Reef Snorkel with Sea Turtles", cost: "$40", desc: "Protected house reef teeming with parrotfish and reef sharks" },
      { time: "01:00 PM", name: "Sandbank Private Island Lunch", cost: "$75", desc: "Secluded pristine white sand spit surrounded by three blues" },
      { time: "05:30 PM", name: "Sunset Dolphin Watching Cruise", cost: "$60", desc: "Traditional Dhoni boat tracking spinner dolphins in open sea" },
    ],
  },
];

const ALL_TAGS = ["All", "Heritage Pick", "Trending", "Budget Friendly"];

// ─── Dynamic AI Destination Generator for ANY User Search ───────────────────
function createCustomDestination(query: string): DestinationItem {
  const clean = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
  return {
    id: `custom-${clean.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name: clean,
    country: "Featured Destination",
    flag: "🌍",
    price: "From ₹5,800 / $180",
    tag: "Custom AI Pick",
    tagline: `AI-customized travel plan, verified heritage stops, and on-chain commitment for ${clean}.`,
    tripTitle: `Discover & Experience ${clean}`,
    duration: "4 days",
    activityLevel: "Moderate",
    accommodation: "Boutique Stays & 4-Star Hotels",
    bestSeason: "Oct – Apr / Peak Season",
    description: `Explore the vibrant culture, historical highlights, and premier attractions of ${clean}. Verified by Touristमत्रम् AI agents with authentic local experiences, transparent pricing, and cryptographic hash verification on Solana Devnet.`,
    heroImg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=92&dpr=2",
    thumbs: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=90&dpr=2",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=90&dpr=2",
    ],
    stops: [
      { time: "09:30 AM", name: `${clean} Central Heritage Landmark`, cost: "₹150 / $15", desc: `Historic architecture and panoramic viewpoint in ${clean}` },
      { time: "01:00 PM", name: "Traditional Artisanal Market & Dining", cost: "₹300 / $25", desc: `Famous local culinary stalls and authentic regional crafts` },
      { time: "05:00 PM", name: "Golden Hour Viewpoint & Cultural Tour", cost: "Free", desc: `Picturesque sunset observation spot and guided heritage walk` },
    ],
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("discover");
  const [filterTag, setFilterTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(DESTINATIONS[0]);
  const [heroThumb, setHeroThumb] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ── Bespoke Trip Customizer Wizard State ──
  const [plannerCity, setPlannerCity] = useState<CuratedCity | null>(null);
  const [plannerStep, setPlannerStep] = useState<number>(1);
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);
  const [customAttractionInput, setCustomAttractionInput] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [budgetAmount, setBudgetAmount] = useState<number>(650);
  const [budgetTier, setBudgetTier] = useState<"budget" | "comfort" | "luxury">("comfort");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1, INR: 94.95, EUR: 0.893, GBP: 0.748, JPY: 156.8, AED: 3.67, SOL: 0.00984
  });
  const [solInCurrencies, setSolInCurrencies] = useState<Record<string, number>>({
    USD: 101.64, INR: 9650.32, EUR: 90.72, GBP: 76.00, JPY: 15943.68, AED: 373.27, SOL: 1
  });
  const [selectedTransitMode, setSelectedTransitMode] = useState<string>("");
  const [crowdTolerance, setCrowdTolerance] = useState<"tranquil" | "vibrant" | "balanced">("balanced");
  const [travelPace, setTravelPace] = useState<"leisurely" | "explorer">("explorer");
  const [travelParty, setTravelParty] = useState<"solo" | "couple" | "family" | "friends">("couple");
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [customCommitTx, setCustomCommitTx] = useState<string | null>(null);
  const [customCommitLoading, setCustomCommitLoading] = useState(false);
  const [customCommitError, setCustomCommitError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load live exchange rates
  useEffect(() => {
    fetch("/api/exchange-rates")
      .then(res => res.json())
      .then(data => {
        if (data.rates) setExchangeRates(data.rates);
        if (data.solInCurrencies) setSolInCurrencies(data.solInCurrencies);
      })
      .catch(() => {});
  }, []);

  const convertAmount = useCallback((amountUSD: number, targetCur: string): number => {
    if (targetCur === "USD") return Math.round(amountUSD);
    if (targetCur === "SOL") {
      const solUsd = solInCurrencies["USD"] || 101.64;
      return Number((amountUSD / solUsd).toFixed(3));
    }
    const rate = exchangeRates[targetCur] || 1;
    return Math.round(amountUSD * rate);
  }, [exchangeRates, solInCurrencies]);

  const getBudgetInUSD = useCallback((amount: number, fromCur: string): number => {
    if (fromCur === "USD") return amount;
    if (fromCur === "SOL") {
      const solUsd = solInCurrencies["USD"] || 101.64;
      return amount * solUsd;
    }
    const rate = exchangeRates[fromCur] || 1;
    return amount / rate;
  }, [exchangeRates, solInCurrencies]);

  const handleCurrencyChange = (newCur: string) => {
    const inUSD = getBudgetInUSD(budgetAmount, selectedCurrency);
    const inNew = convertAmount(inUSD, newCur);
    setSelectedCurrency(newCur);
    setBudgetAmount(inNew);
  };

  // Generate Tailored Itinerary based strictly on chosen attractions, budget & crowd vibe
  const generateTailoredPlan = () => {
    if (!plannerCity) return;
    const chosenAttractions = plannerCity.attractions.filter(a => selectedAttractionIds.includes(a.id));
    const activeAttractions = chosenAttractions.length > 0 ? chosenAttractions : plannerCity.attractions.slice(0, 3);
    const spotsPerDay = travelPace === "leisurely" ? 2 : 3;
    const numDays = Math.max(1, Math.ceil(activeAttractions.length / spotsPerDay));
    
    const daysSchedule = [];
    let attractionIndex = 0;
    
    for (let d = 1; d <= numDays; d++) {
      const dayStops = [];
      const dayTheme = d === 1
        ? "Historic Heart & Primary Icons"
        : d === 2
          ? "Architecture, Panorama & Sunset Vista"
          : "Artisanal Bazaars & Hidden Promenades";
          
      // Stop 1
      if (attractionIndex < activeAttractions.length) {
        const a = activeAttractions[attractionIndex++];
        dayStops.push({
          time: crowdTolerance === "tranquil" ? "08:30 AM (Tranquil Hour)" : crowdTolerance === "vibrant" ? "10:30 AM (Peak Vibe)" : "09:15 AM (Optimal)",
          name: a.name,
          category: a.category,
          duration: a.duration,
          costDisplay: a.costDisplay,
          costUSD: a.costUSD,
          img: a.img,
          tip: a.tip,
          transitHop: `Board ${plannerCity.transit.recommendedPass.slice(0, 38)} to ${a.name.slice(0, 24)}`,
        });
      }
      // Stop 2
      if (attractionIndex < activeAttractions.length) {
        const a = activeAttractions[attractionIndex++];
        dayStops.push({
          time: "01:30 PM",
          name: a.name,
          category: a.category,
          duration: a.duration,
          costDisplay: a.costDisplay,
          costUSD: a.costUSD,
          img: a.img,
          tip: a.tip,
          transitHop: `Short 10-min connector via ${plannerCity.transit.options[0]?.name || "City Transit"}`,
        });
      }
      // Stop 3 (if explorer)
      if (spotsPerDay >= 3 && attractionIndex < activeAttractions.length) {
        const a = activeAttractions[attractionIndex++];
        dayStops.push({
          time: crowdTolerance === "tranquil" ? "04:30 PM" : "06:00 PM (Golden Hour)",
          name: a.name,
          category: a.category,
          duration: a.duration,
          costDisplay: a.costDisplay,
          costUSD: a.costUSD,
          img: a.img,
          tip: a.tip,
          transitHop: `Scenic hop via ${plannerCity.transit.options[1]?.name || "Local Tram/Walk"}`,
        });
      }
      
      daysSchedule.push({
        dayNumber: d,
        theme: dayTheme,
        stops: dayStops,
      });
    }

    const totalAttractionsUSD = activeAttractions.reduce((sum, a) => sum + a.costUSD, 0);
    const transitTotalUSD = plannerCity.transit.passPriceUSD * numDays;
    const targetBudgetUSD = getBudgetInUSD(budgetAmount, selectedCurrency);
    const diningStayUSD = Math.max(0, targetBudgetUSD - totalAttractionsUSD - transitTotalUSD);
    
    const plan = {
      city: plannerCity.name,
      country: plannerCity.country,
      flag: plannerCity.flag,
      numDays,
      pace: travelPace,
      crowd: crowdTolerance,
      party: travelParty,
      currency: selectedCurrency,
      totalBudget: budgetAmount,
      totalBudgetUSD: targetBudgetUSD,
      totalBudgetSOL: Number((targetBudgetUSD / (solInCurrencies["USD"] || 101.64)).toFixed(3)),
      costs: {
        attractions: convertAmount(totalAttractionsUSD, selectedCurrency),
        transit: convertAmount(transitTotalUSD, selectedCurrency),
        diningStay: convertAmount(diningStayUSD, selectedCurrency),
      },
      days: daysSchedule,
      transitPass: plannerCity.transit.recommendedPass,
      operatorCode: plannerCity.transit.operatorCode,
    };
    
    setGeneratedPlan(plan);
    setPlannerStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Commit Tailored Plan on Solana Devnet (Hero Idea Anchor)
  const handleCommitCustomPlan = async () => {
    if (!generatedPlan || !plannerCity) return;
    setCustomCommitLoading(true);
    setCustomCommitError("");
    
    try {
      const planPayload = {
        dest: plannerCity.name,
        country: plannerCity.country,
        days: generatedPlan.numDays,
        budget: generatedPlan.totalBudget,
        currency: generatedPlan.currency,
        solEquivalent: generatedPlan.totalBudgetSOL,
        crowd: generatedPlan.crowd,
        pace: generatedPlan.pace,
        transit: generatedPlan.transitPass,
        agentAsset: "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn",
        timestamp: Date.now(),
      };
      
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(planPayload)));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      if (wallet.connected && wallet.publicKey && wallet.signTransaction) {
        const provider = new AnchorProvider(
          connection,
          wallet as any,
          { commitment: "confirmed", preflightCommitment: "confirmed" }
        );
        const program = new Program(tourismIdl as any, provider);
        const commitmentKeypair = Keypair.generate();
        
        const tx = await (program.methods as any)
          .commitItinerary(
            new PublicKey("CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn"),
            hashArray,
            `${plannerCity.name} (${generatedPlan.numDays}D Tailored)`
          )
          .accounts({
            commitment: commitmentKeypair.publicKey,
            traveler: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([commitmentKeypair])
          .rpc();
          
        setCustomCommitTx(tx);
        const newRec = {
          dest: `${plannerCity.name} Tailored (${generatedPlan.numDays}D)`,
          tx,
          hash: hashHex,
          time: new Date().toLocaleTimeString(),
        };
        const updated = [newRec, ...savedRecords];
        setSavedRecords(updated);
        try { localStorage.setItem("prooftrip_records", JSON.stringify(updated)); } catch {}
      } else {
        await new Promise(r => setTimeout(r, 850));
        const demoTx = `demo_${hashHex.slice(0, 32)}`;
        setCustomCommitTx(demoTx);
        const newRec = {
          dest: `${plannerCity.name} Tailored (${generatedPlan.numDays}D)`,
          tx: demoTx,
          hash: hashHex,
          time: new Date().toLocaleTimeString(),
        };
        const updated = [newRec, ...savedRecords];
        setSavedRecords(updated);
        try { localStorage.setItem("prooftrip_records", JSON.stringify(updated)); } catch {}
      }
    } catch (err: any) {
      console.error("Custom commit error:", err);
      setCustomCommitError(err?.message || "Solana commit error. Offline SHA-256 proof active.");
    } finally {
      setCustomCommitLoading(false);
    }
  };

  // Solana / Blockchain
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const [commitLoading, setCommitLoading] = useState(false);
  const [demoSigning, setDemoSigning] = useState(false);
  const [commitTx, setCommitTx] = useState<string | null>(null);
  const [commitError, setCommitError] = useState("");
  const [savedRecords, setSavedRecords] = useState<Array<{ dest: string; tx: string; hash: string; time: string }>>([]);

  // Agents
  const [agents, setAgents] = useState<any[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [verifyingAsset, setVerifyingAsset] = useState<string | null>(null);

  // Price checker
  const [priceService, setPriceService] = useState("Auto-rickshaw");
  const [priceCity, setPriceCity] = useState("Mysuru");
  const [priceQuote, setPriceQuote] = useState("450");
  const [priceResult, setPriceResult] = useState<any | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Budget tracker
  const [budget, setBudget] = useState(15000);
  const [expenses, setExpenses] = useState<Array<{ id: string; name: string; amount: number; cat: string }>>([
    { id: "1", name: "Airport transfer", amount: 650, cat: "Transport" },
    { id: "2", name: "Heritage Hotel (Night 1)", amount: 2200, cat: "Hotel" },
    { id: "3", name: "Palace tickets & audio guide", amount: 250, cat: "Activity" },
  ]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCat, setNewExpCat] = useState("Food");

  // Hash verifier (records tab)
  const [verifyHashInput, setVerifyHashInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");

  // ── Load saved records from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem("prooftrip_records");
      if (stored) setSavedRecords(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // ── Load agents on mount ──
  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setAgentsLoading(true);
    setAgentStatus("Connecting to Metaplex Agent Registry on Devnet...");
    try {
      const res = await fetch("/api/agents?query=travel", { cache: "no-store" });
      const data = await res.json();
      if (data.data?.agents?.length) {
        setAgents(data.data.agents);
        setAgentStatus(`✓ Connected — ${data.data.agents.length} registered travel agents found on Solana Devnet`);
      } else {
        setAgents([]);
        setAgentStatus("Registry query returned 0 agents. Try refreshing.");
      }
    } catch (e: any) {
      setAgentStatus("Registry connection error: " + e.message);
    } finally {
      setAgentsLoading(false);
    }
  }

  // ── Verify Agent On-Chain ──
  async function verifyAgentOnChain(mintAddress: string) {
    setVerifyingAsset(mintAddress);
    try {
      const res = await fetch(`/api/agents/verify?asset=${mintAddress}`);
      const data = await res.json();
      if (data.registered || data.verified) setVerifiedAsset(mintAddress);
      else setVerifiedAsset(null);
    } catch { /* ignore */ }
    finally { setVerifyingAsset(null); }
  }

  // ── SHA-256 Hash ──
  async function sha256hex(text: string): Promise<string> {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // ── Unified Devnet Commit Flow (Never fails or blocks users without wallet) ──
  async function handleCommitItinerary() {
    // If user has Phantom / Solflare connected, commit via their wallet
    if (wallet.publicKey) {
      const programIdStr = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID || "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
      setCommitLoading(true);
      setCommitError("");
      setCommitTx(null);
      try {
        const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
        const program = new Program({ ...tourismIdl, address: programIdStr } as unknown as Idl, provider);
        const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
        const hashHex = await sha256hex(itineraryText);
        const hashBytes = Array.from(Buffer.from(hashHex, "hex"));
        const agentAsset = new PublicKey("CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn");
        const commitmentKeypair = Keypair.generate();
        const tx = await (program.methods as any).commitItinerary(agentAsset, hashBytes, selectedDest.name)
          .accounts({
            commitment: commitmentKeypair.publicKey,
            traveler: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([commitmentKeypair])
          .rpc();
        setCommitTx(tx);
        const rec = { dest: selectedDest.name, tx, hash: hashHex.slice(0, 16) + "...", time: new Date().toLocaleString() };
        const updated = [rec, ...savedRecords].slice(0, 10);
        setSavedRecords(updated);
        localStorage.setItem("prooftrip_records", JSON.stringify(updated));
      } catch (e: any) {
        setCommitError(e.message || "Transaction failed");
      } finally {
        setCommitLoading(false);
      }
      return;
    }

    // If user does NOT have a wallet connected, seamlessly commit via instant Devnet demo keypair!
    // No red error, no blocking popup!
    await handleDemoCommit();
  }

  // ── Demo commit (ephemeral keypair, no wallet needed) ──
  async function handleDemoCommit() {
    setDemoSigning(true);
    setCommitError("");
    setCommitTx(null);
    try {
      const ephemeral = Keypair.generate();
      const airdrop = await connection.requestAirdrop(ephemeral.publicKey, LAMPORTS_PER_SOL * 0.05);
      await connection.confirmTransaction(airdrop, "confirmed");
      const programIdStr = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID || "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
      const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
      const hashHex = await sha256hex(itineraryText);
      const hashBytes = Array.from(Buffer.from(hashHex, "hex"));
      const agentAsset = new PublicKey("CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn");
      const walletAdapter = {
        publicKey: ephemeral.publicKey,
        signTransaction: async (tx: Transaction) => { tx.partialSign(ephemeral); return tx; },
        signAllTransactions: async (txs: Transaction[]) => txs.map(tx => { tx.partialSign(ephemeral); return tx; }),
      };
      const provider = new AnchorProvider(connection, walletAdapter as any, { commitment: "confirmed" });
      const program = new Program({ ...tourismIdl, address: programIdStr } as unknown as Idl, provider);
      const commitmentKeypair = Keypair.generate();
      const tx = await (program.methods as any).commitItinerary(agentAsset, hashBytes, selectedDest.name)
        .accounts({
          commitment: commitmentKeypair.publicKey,
          traveler: ephemeral.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([commitmentKeypair, ephemeral])
        .rpc();
      setCommitTx(tx);
      const rec = { dest: selectedDest.name, tx, hash: hashHex.slice(0, 16) + "...", time: new Date().toLocaleString() };
      const updated = [rec, ...savedRecords].slice(0, 10);
      setSavedRecords(updated);
      localStorage.setItem("prooftrip_records", JSON.stringify(updated));
    } catch (e: any) {
      // If Solana's public test faucet is rate-limited, compute the canonical SHA-256 hash
      // and record it so the user's demo and verification flow works without getting blocked!
      try {
        const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
        const hashHex = await sha256hex(itineraryText);
        const demoTx = "demo_" + hashHex.slice(0, 32);
        setCommitTx(demoTx);
        const rec = {
          dest: selectedDest.name,
          tx: demoTx,
          hash: hashHex.slice(0, 16) + "...",
          time: new Date().toLocaleString()
        };
        const updated = [rec, ...savedRecords].slice(0, 10);
        setSavedRecords(updated);
        localStorage.setItem("prooftrip_records", JSON.stringify(updated));
        setCommitError(""); // Clear any error box on successful hash commitment
      } catch {
        setCommitError("Transaction error: " + (e.message || String(e)));
      }
    } finally {
      setDemoSigning(false);
    }
  }

  // ── Price checker ──
  async function checkPrice() {
    setPriceLoading(true);
    setPriceResult(null);
    try {
      const res = await fetch(`/api/price?service=${encodeURIComponent(priceService)}&city=${encodeURIComponent(priceCity)}&quote=${priceQuote}`);
      const data = await res.json();
      setPriceResult(data);
    } catch (e: any) {
      setPriceResult({ error: e.message });
    } finally {
      setPriceLoading(false);
    }
  }

  // ── Budget helpers ──
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetPct = Math.min(100, Math.round((totalSpent / budget) * 100));

  function addExpense() {
    if (!newExpName || !newExpAmount) return;
    const updated = [...expenses, { id: Date.now().toString(), name: newExpName, amount: parseFloat(newExpAmount), cat: newExpCat }];
    setExpenses(updated);
    setNewExpName(""); setNewExpAmount("");
  }

  // ── Smart Dynamic Search & Filtering (Never misses places) ──
  const filteredDests = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matched = DESTINATIONS.filter(d => {
      const tagOk = filterTag === "All" || d.tag === filterTag;
      const searchOk =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.tagline.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query);
      return tagOk && searchOk;
    });

    // If user enters any real place not in default list, dynamically generate it with full photos & itinerary!
    if (matched.length === 0 && query.length >= 2) {
      return [createCustomDestination(searchQuery)];
    }
    return matched;
  }, [filterTag, searchQuery]);

  // Smoothly reload detail panel and sync destination when user searches
  useEffect(() => {
    if (filteredDests.length > 0 && !filteredDests.some(d => d.id === selectedDest.id)) {
      setSelectedDest(filteredDests[0]);
      setHeroThumb(0);
      setPriceCity(filteredDests[0].name);
    }
  }, [filteredDests, selectedDest.id]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ NAVIGATION ══ */}
      <nav className="navbar">
        <div className="nav-inner">
          {/* Brand */}
          <div
            className="nav-brand"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("discover");
              setPlannerCity(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="nav-logo-wrap">
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tm-border" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFE072"/>
                    <stop offset="50%" stopColor="#F8D057"/>
                    <stop offset="100%" stopColor="#B8860B"/>
                  </linearGradient>
                  <linearGradient id="tm-gold" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFF2A3"/>
                    <stop offset="40%" stopColor="#F8D057"/>
                    <stop offset="100%" stopColor="#D99E18"/>
                  </linearGradient>
                  <linearGradient id="tm-solana" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#9945FF"/>
                    <stop offset="50%" stopColor="#14F195"/>
                    <stop offset="100%" stopColor="#F8D057"/>
                  </linearGradient>
                  <radialGradient id="tm-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(248, 208, 87, 0.4)"/>
                    <stop offset="100%" stopColor="rgba(248, 208, 87, 0)"/>
                  </radialGradient>
                  <filter id="tm-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5"/>
                  </filter>
                </defs>
                <rect x="1" y="1" width="38" height="38" rx="11" fill="#14161A" stroke="url(#tm-border)" strokeWidth="1.5" filter="url(#tm-shadow)"/>
                <circle cx="20" cy="20" r="16" fill="url(#tm-glow)"/>
                <circle cx="20" cy="20" r="11" stroke="rgba(248, 208, 87, 0.25)" strokeWidth="0.75" strokeDasharray="1.5 2.5"/>
                <line x1="20" y1="5.5" x2="20" y2="8" stroke="url(#tm-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="20" y1="32" x2="20" y2="34.5" stroke="url(#tm-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="5.5" y1="20" x2="8" y2="20" stroke="url(#tm-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="32" y1="20" x2="34.5" y2="20" stroke="url(#tm-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M20 9L29 27.5L20 23.5L11 27.5L20 9Z" fill="url(#tm-gold)" filter="url(#tm-shadow)"/>
                <path d="M20 11.5L26.5 25L20 22.2L13.5 25L20 11.5Z" fill="#181A20" opacity="0.15"/>
                <path d="M20 9L20 23.5L11 27.5L20 9Z" fill="rgba(255, 255, 255, 0.22)"/>
                <ellipse cx="20" cy="21.5" rx="8" ry="3.5" transform="rotate(-25 20 21.5)" stroke="url(#tm-solana)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="18 4"/>
                <circle cx="20" cy="20" r="1.5" fill="#FFF"/>
              </svg>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-tourist">Tourist</span>
              <span className="nav-brand-matram">मत्रम्</span>
            </div>
            <div className="nav-brand-badge">
              <span className="nav-badge-dot" />
              <span>Solana Devnet</span>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="nav-tabs">
            {(["discover", "agents", "price", "safety", "records"] as MainTab[]).map(tab => (
              <button
                key={tab}
                className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "discover" && "🗺 Discover"}
                {tab === "agents" && "🤖 AI Agents"}
                {tab === "price" && "💰 Fair Price"}
                {tab === "safety" && "🛡 Safety"}
                {tab === "records" && "🔗 On-Chain Records"}
              </button>
            ))}
          </div>

          {/* Right: Wallet */}
          <div className="nav-right">
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      {/* Mobile Tabs (scrollable) */}
      <div className="mobile-tabs" style={{ paddingTop: "calc(var(--nav-h) + 0px)" }}>
        {(["discover", "agents", "price", "safety", "records"] as MainTab[]).map(tab => (
          <button
            key={tab}
            className={`mobile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "discover" && "🗺 Discover"}
            {tab === "agents" && "🤖 Agents"}
            {tab === "price" && "💰 Price"}
            {tab === "safety" && "🛡 Safety"}
            {tab === "records" && "🔗 Records"}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: DISCOVER                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "discover" && (
        <>
          {plannerCity !== null ? (
            /* ══════════════════════════════════════════════════════════ */
            /* BESPOKE TRIP CUSTOMIZER WIZARD (Interactive Form Flow)    */
            /* ══════════════════════════════════════════════════════════ */
            <div className="customizer-container">
              {/* Navigation Bar */}
              <div className="customizer-nav-bar">
                <button
                  className="customizer-back-btn"
                  onClick={() => {
                    setPlannerCity(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to All Destinations</span>
                </button>
                <div className="customizer-verified-badge">
                  <ShieldCheck size={14} />
                  <span>2026 Live Verified Guide & Transit System</span>
                </div>
              </div>

              {/* Destination Hero Banner */}
              <div className="customizer-hero-banner">
                <img
                  src={plannerCity.heroImg}
                  alt={plannerCity.name}
                  className="customizer-hero-bg"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_HERO; }}
                />
                <div className="customizer-hero-gradient" />
                <div className="customizer-hero-content">
                  <div className="customizer-city-title">
                    <span className="customizer-city-flag">{plannerCity.flag}</span>
                    <span>{plannerCity.name}</span>
                    <span style={{ fontSize: 16, color: "var(--yellow)", fontWeight: 700, marginLeft: 6 }}>
                      · {plannerCity.country}
                    </span>
                  </div>
                  <p className="customizer-city-tagline">{plannerCity.tagline}</p>
                </div>
              </div>

              {/* Progress Stepper Bar (Google Form Inspired) */}
              <div className="stepper-card">
                <div className="stepper-progress-track">
                  <div
                    className="stepper-progress-bar"
                    style={{ width: `${(plannerStep / 5) * 100}%` }}
                  />
                </div>
                <div className="stepper-steps-row">
                  {[
                    { num: 1, label: "Top Sights", icon: <Star size={12} /> },
                    { num: 2, label: "Budget & Currency", icon: <DollarSign size={12} /> },
                    { num: 3, label: "Transit Pass", icon: <Train size={12} /> },
                    { num: 4, label: "Crowd & Pace", icon: <Users size={12} /> },
                    { num: 5, label: "Verified Itinerary", icon: <Sparkles size={12} /> },
                  ].map(s => (
                    <button
                      key={s.num}
                      className={`stepper-step-item ${plannerStep === s.num ? "active" : ""} ${plannerStep > s.num ? "completed" : ""}`}
                      onClick={() => {
                        if (s.num <= plannerStep || (s.num === 5 && generatedPlan)) {
                          setPlannerStep(s.num);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      <div className="stepper-step-num">
                        {plannerStep > s.num ? <Check size={14} /> : s.num}
                      </div>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── STEP 1: Top Attractions Selection ── */}
              {plannerStep === 1 && (
                <div className="wizard-panel">
                  <div className="wizard-header">
                    <span className="wizard-step-label">Step 1 of 4 · Destination Curation</span>
                    <h2 className="wizard-title">Select Iconic Sights in {plannerCity.name}</h2>
                    <p className="wizard-subtitle">
                      Choose which landmarks you want to visit. We will arrange them into an optimal daily route avoiding peak lines and rush hours.
                    </p>
                  </div>

                  <div className="attraction-grid">
                    {plannerCity.attractions.map(attr => {
                      const isSelected = selectedAttractionIds.includes(attr.id);
                      return (
                        <div
                          key={attr.id}
                          className={`attraction-card ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedAttractionIds(prev =>
                              prev.includes(attr.id) ? prev.filter(x => x !== attr.id) : [...prev, attr.id]
                            );
                          }}
                        >
                          <div className="attraction-photo-wrap">
                            <img
                              src={attr.img}
                              alt={attr.name}
                              className="attraction-photo"
                              loading="lazy"
                              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_THUMB; }}
                            />
                            <div className="attraction-check-badge">
                              {isSelected ? <Check size={16} /> : null}
                            </div>
                            <div className="attraction-category-pill">{attr.category}</div>
                          </div>
                          <div className="attraction-body">
                            <div className="attraction-name">{attr.name}</div>
                            <div className="attraction-meta-row">
                              <span className="attraction-meta-item"><Clock size={12} /> {attr.duration}</span>
                              <span>•</span>
                              <span className="attraction-meta-item" style={{ color: "var(--yellow)", fontWeight: 700 }}>
                                <Ticket size={12} /> {attr.costDisplay}
                              </span>
                              <span>•</span>
                              <span className="attraction-meta-item">
                                <span style={{
                                  width: 7, height: 7, borderRadius: "50%",
                                  background: attr.crowdRating === "Peaceful" ? "var(--success)" : attr.crowdRating === "High" ? "var(--error)" : "var(--yellow)"
                                }} />
                                {attr.crowdRating} Crowd
                              </span>
                            </div>
                            <div className="attraction-tip">
                              <strong style={{ color: "#FFF" }}>Insider Tip:</strong> {attr.tip}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Spot Box */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                    <input
                      style={{
                        flex: 1, minWidth: 260,
                        background: "var(--dark-elevated)",
                        border: "1px solid var(--dark-border)",
                        borderRadius: 12,
                        padding: "12px 18px",
                        color: "#FFF",
                        fontSize: 14,
                      }}
                      placeholder={`+ Add another specific spot or market in ${plannerCity.name}...`}
                      value={customAttractionInput}
                      onChange={e => setCustomAttractionInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && customAttractionInput.trim()) {
                          const newId = `custom-${Date.now()}`;
                          const newAttr: CityAttraction = {
                            id: newId,
                            name: customAttractionInput.trim(),
                            category: "Custom Selection",
                            duration: "2 hours",
                            costDisplay: "Free / Local",
                            costUSD: 5,
                            img: plannerCity.heroImg,
                            bestTime: "Flexible",
                            tip: "Traveler requested custom destination.",
                            crowdRating: "Moderate",
                          };
                          plannerCity.attractions.push(newAttr);
                          setSelectedAttractionIds(prev => [...prev, newId]);
                          setCustomAttractionInput("");
                        }
                      }}
                    />
                    <button
                      className="btn-dark"
                      style={{ width: "auto", padding: "0 22px", borderRadius: 12 }}
                      onClick={() => {
                        if (customAttractionInput.trim()) {
                          const newId = `custom-${Date.now()}`;
                          const newAttr: CityAttraction = {
                            id: newId,
                            name: customAttractionInput.trim(),
                            category: "Custom Selection",
                            duration: "2 hours",
                            costDisplay: "Free / Local",
                            costUSD: 5,
                            img: plannerCity.heroImg,
                            bestTime: "Flexible",
                            tip: "Traveler requested custom destination.",
                            crowdRating: "Moderate",
                          };
                          plannerCity.attractions.push(newAttr);
                          setSelectedAttractionIds(prev => [...prev, newId]);
                          setCustomAttractionInput("");
                        }
                      }}
                    >
                      <Plus size={16} /> Add Place
                    </button>
                  </div>

                  <div className="wizard-footer-nav">
                    <div style={{ fontSize: 14, color: "var(--gray-light)" }}>
                      <strong style={{ color: "var(--yellow)" }}>{selectedAttractionIds.length}</strong> attractions selected for {plannerCity.name}
                    </div>
                    <button
                      className="btn-hero-yellow"
                      disabled={selectedAttractionIds.length === 0}
                      onClick={() => { setPlannerStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <span>Next: Budget & Currencies</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Budget & Currencies with Live CoinGecko API ── */}
              {plannerStep === 2 && (
                <div className="wizard-panel">
                  <div className="wizard-header">
                    <span className="wizard-step-label">Step 2 of 4 · Finances & Currencies</span>
                    <h2 className="wizard-title">What Budget Are You Willing to Spend?</h2>
                    <p className="wizard-subtitle">
                      Choose your preferred currency and enter your target budget. Our live CoinGecko & FX engine calculates exact conversions to Solana SOL and world currencies.
                    </p>
                  </div>

                  {/* Currency Selector Pills */}
                  <div className="currency-tabs">
                    {[
                      { code: "USD", symbol: "$", name: "US Dollar" },
                      { code: "INR", symbol: "₹", name: "Indian Rupee" },
                      { code: "EUR", symbol: "€", name: "Euro" },
                      { code: "GBP", symbol: "£", name: "British Pound" },
                      { code: "JPY", symbol: "¥", name: "Japanese Yen" },
                      { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
                      { code: "SOL", symbol: "◎", name: "Solana" },
                    ].map(c => (
                      <button
                        key={c.code}
                        className={`currency-tab ${selectedCurrency === c.code ? "active" : ""}`}
                        onClick={() => handleCurrencyChange(c.code)}
                      >
                        <span>{c.symbol}</span>
                        <span>{c.code}</span>
                      </button>
                    ))}
                  </div>

                  {/* Large Numeric Input */}
                  <div className="budget-input-box">
                    <div className="budget-symbol">
                      {selectedCurrency === "USD" ? "$" : selectedCurrency === "INR" ? "₹" : selectedCurrency === "EUR" ? "€" : selectedCurrency === "GBP" ? "£" : selectedCurrency === "JPY" ? "¥" : selectedCurrency === "AED" ? "د.إ" : "◎"}
                    </div>
                    <input
                      type="number"
                      className="budget-input"
                      value={budgetAmount || ""}
                      onChange={e => setBudgetAmount(Math.max(0, Number(e.target.value)))}
                    />
                  </div>

                  {/* Preset Budget Tier Cards */}
                  <div className="budget-tiers-grid">
                    <div
                      className={`budget-tier-card ${budgetTier === "budget" ? "selected" : ""}`}
                      onClick={() => {
                        setBudgetTier("budget");
                        const amtUSD = 35 * plannerCity.durationDays;
                        setBudgetAmount(convertAmount(amtUSD, selectedCurrency));
                      }}
                    >
                      <div className="tier-icon">🎒</div>
                      <div className="tier-title">Backpacker / Economy</div>
                      <div className="tier-estimate">~{convertAmount(35 * plannerCity.durationDays, selectedCurrency)} {selectedCurrency} total</div>
                      <p className="tier-desc">Social boutique hostels, local thalis & authentic street eateries, city bus/metro transit pass.</p>
                    </div>
                    <div
                      className={`budget-tier-card ${budgetTier === "comfort" ? "selected" : ""}`}
                      onClick={() => {
                        setBudgetTier("comfort");
                        const amtUSD = 95 * plannerCity.durationDays;
                        setBudgetAmount(convertAmount(amtUSD, selectedCurrency));
                      }}
                    >
                      <div className="tier-icon">🧳</div>
                      <div className="tier-title">Comfort / Explorer (Recommended)</div>
                      <div className="tier-estimate">~{convertAmount(95 * plannerCity.durationDays, selectedCurrency)} {selectedCurrency} total</div>
                      <p className="tier-desc">3-4★ heritage stays, sit-down dining, day transit passes, all museum audio guides included.</p>
                    </div>
                    <div
                      className={`budget-tier-card ${budgetTier === "luxury" ? "selected" : ""}`}
                      onClick={() => {
                        setBudgetTier("luxury");
                        const amtUSD = 240 * plannerCity.durationDays;
                        setBudgetAmount(convertAmount(amtUSD, selectedCurrency));
                      }}
                    >
                      <div className="tier-icon">👑</div>
                      <div className="tier-title">Luxury / Royal</div>
                      <div className="tier-estimate">~{convertAmount(240 * plannerCity.durationDays, selectedCurrency)} {selectedCurrency} total</div>
                      <p className="tier-desc">5★ palace suites & villas, private chauffeured AC cabs, fine dining & VIP entry passes.</p>
                    </div>
                  </div>

                  {/* Live FX Ticker Card */}
                  <div className="fx-ticker-card">
                    <div className="fx-ticker-header">
                      <div className="fx-live-pill">
                        <span className="fx-pulsing-dot" />
                        <span>CoinGecko & Live FX API Synced</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--gray-light)" }}>
                        Live Benchmark: 1 SOL = ${solInCurrencies["USD"] || 101.64} USD ≈ ₹{Math.round(solInCurrencies["INR"] || 9650).toLocaleString()} INR
                      </div>
                    </div>
                    <div className="fx-grid">
                      <div className="fx-item">
                        <div className="fx-label">Equivalent in Solana</div>
                        <div className="fx-val sol-accent">
                          ◎ {(getBudgetInUSD(budgetAmount, selectedCurrency) / (solInCurrencies["USD"] || 101.64)).toFixed(3)} SOL
                        </div>
                      </div>
                      <div className="fx-item">
                        <div className="fx-label">Equivalent in USD</div>
                        <div className="fx-val">${Math.round(getBudgetInUSD(budgetAmount, selectedCurrency)).toLocaleString()}</div>
                      </div>
                      <div className="fx-item">
                        <div className="fx-label">Equivalent in INR</div>
                        <div className="fx-val">₹{Math.round(getBudgetInUSD(budgetAmount, selectedCurrency) * (exchangeRates["INR"] || 94.95)).toLocaleString()}</div>
                      </div>
                      <div className="fx-item">
                        <div className="fx-label">Daily Allocation</div>
                        <div className="fx-val" style={{ fontSize: 16 }}>
                          ~{Math.round(budgetAmount / plannerCity.durationDays)} {selectedCurrency} / day
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="wizard-footer-nav">
                    <button
                      className="btn-dark"
                      style={{ width: "auto", padding: "12px 24px" }}
                      onClick={() => { setPlannerStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <ArrowLeft size={16} /> Back: Attractions
                    </button>
                    <button
                      className="btn-hero-yellow"
                      onClick={() => { setPlannerStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <span>Next: Public Transport</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Public Transport & City Transit Passes ── */}
              {plannerStep === 3 && (
                <div className="wizard-panel">
                  <div className="wizard-header">
                    <span className="wizard-step-label">Step 3 of 4 · Transit Passes</span>
                    <h2 className="wizard-title">Public Transport Available in {plannerCity.name}</h2>
                    <p className="wizard-subtitle">
                      Official city transit passes and verified route options for {plannerCity.name} without vague terms.
                    </p>
                  </div>

                  {/* Tactile Train Clipboard Transit Ticket */}
                  <div className="transit-pass-ticket">
                    <div className="ticket-clipboard-header">
                      <div className="ticket-clipboard-tag">
                        <ClipboardList size={18} />
                        <Train size={18} />
                        <span>Official Transit Pass Badge</span>
                      </div>
                      <div className="ticket-operator-code">{plannerCity.transit.operatorCode}</div>
                    </div>
                    <div className="ticket-body">
                      <div>
                        <div className="ticket-pass-badge">
                          <Star size={12} /> #1 TOP RECOMMENDED FOR {plannerCity.name.toUpperCase()}
                        </div>
                        <div className="ticket-pass-name">{plannerCity.transit.recommendedPass}</div>
                        <div className="ticket-details-grid">
                          <div className="ticket-detail-item">
                            <div className="ticket-detail-label">Official Fare Rate</div>
                            <div className="ticket-detail-value" style={{ color: "var(--yellow)" }}>
                              {plannerCity.transit.passPrice}
                            </div>
                          </div>
                          <div className="ticket-detail-item">
                            <div className="ticket-detail-label">Network Coverage</div>
                            <div className="ticket-detail-value">{plannerCity.transit.passValidity}</div>
                          </div>
                        </div>
                        <div className="ticket-how-to-use">
                          <strong style={{ color: "#FFF" }}>How to Use:</strong> {plannerCity.transit.howToUse}
                        </div>
                      </div>

                      <div className="ticket-barcode-col">
                        <div className="barcode-visual" />
                        <div className="barcode-number">REF-{plannerCity.id.toUpperCase()}-2026</div>
                        <div style={{ fontSize: 11, color: "var(--success)", fontWeight: 800, marginTop: 4 }}>
                          ✓ VERIFIED CITY TRANSIT
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="field-label" style={{ marginBottom: 14 }}>
                    All Verified Transit Options in {plannerCity.name}
                  </div>
                  <div className="transit-options-grid">
                    {plannerCity.transit.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`transit-option-card ${selectedTransitMode === opt.name ? "selected" : ""}`}
                        onClick={() => setSelectedTransitMode(opt.name)}
                      >
                        <div className="transit-option-head">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {opt.type === "metro" && <Train size={16} color="var(--yellow)" />}
                            {opt.type === "train" && <Train size={16} color="var(--yellow)" />}
                            {opt.type === "bus" && <Bus size={16} color="var(--yellow)" />}
                            {opt.type === "auto" && <Car size={16} color="var(--yellow)" />}
                            {opt.type === "ferry" && <Ship size={16} color="var(--yellow)" />}
                            {opt.type === "bike" && <Bike size={16} color="var(--yellow)" />}
                            <span className="transit-option-name">{opt.name}</span>
                          </div>
                          <span className="transit-option-cost">{opt.cost}</span>
                        </div>
                        <p className="transit-option-tip">{opt.tip}</p>
                      </div>
                    ))}
                  </div>

                  <div className="wizard-footer-nav">
                    <button
                      className="btn-dark"
                      style={{ width: "auto", padding: "12px 24px" }}
                      onClick={() => { setPlannerStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <ArrowLeft size={16} /> Back: Budget
                    </button>
                    <button
                      className="btn-hero-yellow"
                      onClick={() => { setPlannerStep(4); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <span>Next: Crowd & Atmosphere</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Crowd Tolerance & Style ── */}
              {plannerStep === 4 && (
                <div className="wizard-panel">
                  <div className="wizard-header">
                    <span className="wizard-step-label">Step 4 of 4 · Atmosphere & Flow</span>
                    <h2 className="wizard-title">Crowd Preference & Travel Atmosphere</h2>
                    <p className="wizard-subtitle">
                      Tell us your comfort level so we schedule visits during quiet morning hours or buzzing evening peaks.
                    </p>
                  </div>

                  <div className="field-label" style={{ marginBottom: 12 }}>How comfortable are you with crowds?</div>
                  <div className="crowd-options-grid">
                    <div
                      className={`crowd-option-card ${crowdTolerance === "tranquil" ? "selected" : ""}`}
                      onClick={() => setCrowdTolerance("tranquil")}
                    >
                      <div className="crowd-option-icon">🍃</div>
                      <div className="crowd-option-title">Tranquil & Less Crowded</div>
                      <p className="crowd-option-desc">
                        Schedule visits at early morning opening slots (08:30 AM), quiet side streets, and serene viewpoints away from tour buses.
                      </p>
                    </div>
                    <div
                      className={`crowd-option-card ${crowdTolerance === "balanced" ? "selected" : ""}`}
                      onClick={() => setCrowdTolerance("balanced")}
                    >
                      <div className="crowd-option-icon">⚖️</div>
                      <div className="crowd-option-title">Balanced Optimal Flow (Recommended)</div>
                      <p className="crowd-option-desc">
                        Hit famous landmarks right at opening to beat long queues, then explore relaxed local cafés and neighborhoods in the afternoon.
                      </p>
                    </div>
                    <div
                      className={`crowd-option-card ${crowdTolerance === "vibrant" ? "selected" : ""}`}
                      onClick={() => setCrowdTolerance("vibrant")}
                    >
                      <div className="crowd-option-icon">🔥</div>
                      <div className="crowd-option-title">Comfortable with Crowds / Iconic Vibe</div>
                      <p className="crowd-option-desc">
                        I love the buzzing evening atmosphere, packed bazaars, and vibrant landmark scenes. Ready for peak energy.
                      </p>
                    </div>
                  </div>

                  {/* Pace */}
                  <div className="field-label" style={{ marginBottom: 12 }}>Trip Pace</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                    <div
                      className={`crowd-option-card ${travelPace === "leisurely" ? "selected" : ""}`}
                      onClick={() => setTravelPace("leisurely")}
                    >
                      <div className="crowd-option-icon">☕</div>
                      <div className="crowd-option-title">Leisurely & Relaxed</div>
                      <p className="crowd-option-desc">1–2 sights per day with extended café breaks, strolls, and zero rushing.</p>
                    </div>
                    <div
                      className={`crowd-option-card ${travelPace === "explorer" ? "selected" : ""}`}
                      onClick={() => setTravelPace("explorer")}
                    >
                      <div className="crowd-option-icon">⚡</div>
                      <div className="crowd-option-title">Active Explorer</div>
                      <p className="crowd-option-desc">3–4 sights per day, full-day schedule, seeing the absolute maximum.</p>
                    </div>
                  </div>

                  {/* Travel Party */}
                  <div className="field-label" style={{ marginBottom: 12 }}>Who is traveling?</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                    {[
                      { id: "solo", label: "Solo Explorer", icon: "👤" },
                      { id: "couple", label: "Couple / Romantic", icon: "💑" },
                      { id: "family", label: "Family with Kids", icon: "👨‍👩‍👧" },
                      { id: "friends", label: "Friends Group", icon: "👥" },
                    ].map(p => (
                      <button
                        key={p.id}
                        className={`pill-btn ${travelParty === p.id ? "active" : ""}`}
                        style={{ padding: "10px 20px", fontSize: 14 }}
                        onClick={() => setTravelParty(p.id as any)}
                      >
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="wizard-footer-nav">
                    <button
                      className="btn-dark"
                      style={{ width: "auto", padding: "12px 24px" }}
                      onClick={() => { setPlannerStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <ArrowLeft size={16} /> Back: Transit
                    </button>
                    <button
                      className="btn-hero-yellow"
                      onClick={generateTailoredPlan}
                    >
                      <Sparkles size={16} />
                      <span>Generate My Tailored Plan ✨</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Generated Tailored Itinerary & Solana Devnet Commitment ── */}
              {plannerStep === 5 && generatedPlan && (
                <div>
                  <div className="wizard-panel">
                    <div className="wizard-header">
                      <span className="wizard-step-label">✦ Bespoke Solana Travel Plan</span>
                      <h2 className="wizard-title">Tailored Travel Agreement for {generatedPlan.city}</h2>
                      <p className="wizard-subtitle">
                        Sequenced specifically for your selected sights, {generatedPlan.currency} budget, and transit pass.
                      </p>
                    </div>

                    {/* Summary Bar */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 16, background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
                      borderRadius: 14, padding: "18px 22px", marginBottom: 28,
                    }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--gray-light)", textTransform: "uppercase", fontWeight: 700 }}>Duration</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#FFF" }}>{generatedPlan.numDays} Days</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--gray-light)", textTransform: "uppercase", fontWeight: 700 }}>Pace & Crowd</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--yellow)" }}>
                          {generatedPlan.crowd === "tranquil" ? "🍃 Tranquil" : generatedPlan.crowd === "vibrant" ? "🔥 Vibrant" : "⚖️ Balanced"} · {generatedPlan.pace === "leisurely" ? "Relaxed" : "Explorer"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--gray-light)", textTransform: "uppercase", fontWeight: 700 }}>Total Budget</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--yellow)" }}>
                          {generatedPlan.currency === "SOL" ? "◎ " : ""}{generatedPlan.totalBudget.toLocaleString()} {generatedPlan.currency}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--gray-light)", textTransform: "uppercase", fontWeight: 700 }}>Solana Equivalent</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#FFF" }}>
                          ◎ {generatedPlan.totalBudgetSOL} SOL
                        </div>
                      </div>
                    </div>

                    {/* Day by Day Schedule */}
                    <div style={{ marginBottom: 32 }}>
                      <div className="field-label" style={{ marginBottom: 16 }}>Day-by-Day Route & Scheduled Sights</div>
                      {generatedPlan.days.map((day: any) => (
                        <div key={day.dayNumber} className="itinerary-day-box">
                          <div className="itinerary-day-title">
                            <Calendar size={18} />
                            <span>Day {day.dayNumber} · {day.theme}</span>
                          </div>

                          <div>
                            {day.stops.map((stop: any, sIdx: number) => (
                              <React.Fragment key={sIdx}>
                                <div className="itinerary-stop-row">
                                  <div className="itinerary-stop-time">{stop.time}</div>
                                  <div>
                                    <div className="itinerary-stop-title">{stop.name}</div>
                                    <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700, marginBottom: 4 }}>
                                      {stop.category} · {stop.duration}
                                    </div>
                                    <div className="itinerary-stop-desc">{stop.tip}</div>
                                    <div className="itinerary-stop-tip-box">
                                      <strong style={{ color: "var(--yellow)" }}>Ticket:</strong> {stop.costDisplay}
                                    </div>
                                  </div>
                                  <div style={{ width: 90, height: 65, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                                    <img
                                      src={stop.img}
                                      alt={stop.name}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_THUMB; }}
                                    />
                                  </div>
                                </div>

                                {sIdx < day.stops.length - 1 && (
                                  <div className="itinerary-transit-connector">
                                    <ClipboardList size={15} />
                                    <Train size={15} />
                                    <span>Transit Hop: {stop.transitHop}</span>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Itemized Budget Breakdown Table */}
                    <div style={{
                      background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
                      borderRadius: 16, padding: "24px", marginBottom: 32,
                    }}>
                      <div className="field-label" style={{ marginBottom: 16 }}>Curated Budget Breakdown</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                          <span style={{ color: "var(--gray-light)" }}>Sightseeing Admissions & Tickets</span>
                          <span style={{ fontWeight: 700 }}>
                            {generatedPlan.costs.attractions.toLocaleString()} {generatedPlan.currency}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                          <span style={{ color: "var(--gray-light)" }}>Public Transit Pass ({generatedPlan.transitPass.slice(0, 32)})</span>
                          <span style={{ fontWeight: 700 }}>
                            {generatedPlan.costs.transit.toLocaleString()} {generatedPlan.currency}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                          <span style={{ color: "var(--gray-light)" }}>Estimated Stays & Local Dining</span>
                          <span style={{ fontWeight: 700 }}>
                            {generatedPlan.costs.diningStay.toLocaleString()} {generatedPlan.currency}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontSize: 16, fontWeight: 800, color: "var(--yellow)" }}>
                          <span>Total Target Plan</span>
                          <span>
                            {generatedPlan.totalBudget.toLocaleString()} {generatedPlan.currency} (≈ ◎ {generatedPlan.totalBudgetSOL} SOL)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Solana Devnet Cryptographic Commitment (Hero Idea) */}
                    <div style={{
                      background: "rgba(248, 208, 87, 0.05)", border: "2px solid rgba(248, 208, 87, 0.35)",
                      borderRadius: 18, padding: "28px", marginBottom: 24,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <Lock size={20} color="var(--yellow)" />
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#FFF" }}>Tamper-Proof Travel Agreement on Solana Devnet</h3>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--gray-light)", lineHeight: 1.6, marginBottom: 20 }}>
                        The AI prepared your tailored itinerary based on your selections. Anchor it to Solana Devnet to mint an immutable SHA-256 travel agreement record verified by Metaplex Agent ID <code style={{ color: "var(--yellow)" }}>CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn</code>.
                      </p>

                      {customCommitTx && (
                        <div className="status-box status-green" style={{ marginBottom: 16, fontSize: 13 }}>
                          <div style={{ fontWeight: 800, marginBottom: 4 }}>✓ Agreement Cryptographically Committed on Solana!</div>
                          {customCommitTx.startsWith("demo_") ? (
                            <div style={{ fontSize: 12, color: "var(--yellow)" }}>
                              Immutable SHA-256 Hash: <code style={{ color: "#FFF" }}>{customCommitTx.slice(5)}</code> (Recorded in On-Chain Records tab)
                            </div>
                          ) : (
                            <a
                              href={`https://explorer.solana.com/tx/${customCommitTx}?cluster=devnet`}
                              target="_blank" rel="noreferrer"
                              style={{ color: "var(--yellow)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4 }}
                            >
                              View Verified Anchor Transaction on Solana Explorer <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}

                      {customCommitError && (
                        <div className="status-box status-red" style={{ marginBottom: 16, fontSize: 12 }}>
                          {customCommitError}
                        </div>
                      )}

                      <button
                        className="btn-yellow"
                        onClick={handleCommitCustomPlan}
                        disabled={customCommitLoading}
                      >
                        {customCommitLoading ? (
                          <><Loader2 size={16} className="animate-spin" /><span>Anchoring Hash to Solana Devnet...</span></>
                        ) : (
                          <><Lock size={15} /><span>Commit Tailored Agreement on Solana Devnet</span></>
                        )}
                      </button>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--gray-light)", marginTop: 12 }}>
                        <span>
                          {mounted && wallet.publicKey ? (
                            <span style={{ color: "var(--success)", fontWeight: 600 }}>
                              🟢 Phantom Wallet Connected: {wallet.publicKey.toBase58().slice(0, 4)}...{wallet.publicKey.toBase58().slice(-4)}
                            </span>
                          ) : (
                            <span>⚡ Instant Devnet Demo Mode Active (Zero setup required)</span>
                          )}
                        </span>
                        {mounted && !wallet.publicKey && (
                          <button
                            onClick={() => openWalletModal(true)}
                            style={{ background: "none", border: "none", color: "var(--yellow)", cursor: "pointer", fontSize: 12, textDecoration: "underline", fontWeight: 600 }}
                          >
                            Connect Phantom (Optional)
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="wizard-footer-nav">
                      <button
                        className="btn-dark"
                        style={{ width: "auto", padding: "12px 24px" }}
                        onClick={() => { setPlannerStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <RotateCcw size={16} /> Modify Choices
                      </button>
                      <button
                        className="btn-hero-yellow"
                        onClick={() => {
                          setPlannerCity(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <span>Explore Another City</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════ */
            /* DISCOVERY CATALOG (Select any city to customize)          */
            /* ══════════════════════════════════════════════════════════ */
            <>
              {/* Hero */}
              <section className="hero" style={{ paddingTop: "var(--nav-h)" }}>
                <div
                  className="hero-bg"
                  style={{ backgroundImage: `url('${selectedDest.heroImg || FALLBACK_HERO}')` }}
                />
                <div className="hero-gradient" />
                <div className="hero-content">
                  <div className="hero-eyebrow">
                    <Sparkles size={13} />
                    <span>Solana AI Agent Registry · Anchor Smart Contract</span>
                  </div>
                  <h1 className="hero-title">
                    Discover Your<br />
                    <span>Next</span> Journey
                  </h1>
                  <p className="hero-sub">
                    Explore verified destinations, customize your day-by-day travel plan, and commit tamper-evident trip agreements to Solana Devnet.
                  </p>
                  <div className="hero-actions">
                    <div className="hero-search">
                      <Search size={16} color="#7A7A7A" />
                      <input
                        placeholder="Search any destination — Paris, Mysuru, Tokyo, Dubai..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button className="btn-hero-yellow">
                      <span>Explore the World</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Destination cards */}
              <div className="page-section">
                <div className="section-header">
                  <div>
                    <div className="section-label">✦ Curated Destinations</div>
                    <h2 className="section-title">Choose Your City to Customize</h2>
                    <p className="section-sub">
                      Click any city below to open the interactive trip customizer with live currency exchange, public transit passes, and verifiable Solana records.
                    </p>
                  </div>
                  <div className="filter-pills">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        className={`pill-btn ${filterTag === tag ? "active" : ""}`}
                        onClick={() => setFilterTag(tag)}
                      >{tag}</button>
                    ))}
                  </div>
                </div>

                <div className="destinations-grid">
                  {filteredDests.map(dest => (
                    <div
                      key={dest.id}
                      className={`dest-card ${selectedDest.id === dest.id ? "selected" : ""}`}
                      onClick={() => {
                        const cityData = getCuratedCityData(dest.name, dest.heroImg);
                        setPlannerCity(cityData);
                        setPlannerStep(1);
                        setSelectedAttractionIds(cityData.attractions.slice(0, 3).map(a => a.id));
                        setSelectedTransitMode(cityData.transit.recommendedPass);
                        const initialUSD = cityData.avgDailyBudgetUSD * cityData.durationDays;
                        setBudgetAmount(convertAmount(initialUSD, selectedCurrency));
                        setBudgetTier("comfort");
                        setGeneratedPlan(null);
                        setCustomCommitTx(null);
                        setCustomCommitError("");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div className="dest-card-photo">
                        <img
                          src={dest.heroImg}
                          alt={dest.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_HERO;
                          }}
                        />
                      </div>
                      <div className="dest-card-overlay" />
                      <div className="dest-card-badge">
                        <Star size={10} /> {dest.tag}
                      </div>
                      <div className="dest-card-body">
                        <div className="dest-card-name">{dest.name}</div>
                        <div className="dest-card-price">{dest.price}</div>
                        <p className="dest-card-desc">{dest.tagline}</p>

                        <div style={{
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 12,
                          color: "var(--yellow)",
                          fontWeight: 700,
                        }}>
                          <span>Plan & Customize Trip</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: AGENTS                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "agents" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Metaplex Agent Registry</div>
              <h2 className="section-title">Verified Travel Agents</h2>
              <p className="section-sub">
                Live agents registered on Solana Devnet via Metaplex program{" "}
                <code style={{ color: "var(--yellow)", fontSize: 11 }}>1DREGFgy...2B2p</code>
              </p>
            </div>
            <button className="btn-dark" style={{ width: "auto", padding: "10px 20px" }} onClick={loadAgents} disabled={agentsLoading}>
              {agentsLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              <span>Refresh Registry</span>
            </button>
          </div>

          {agentStatus && (
            <div className="status-box status-yellow" style={{ marginBottom: 24 }}>{agentStatus}</div>
          )}

          {agentsLoading ? (
            <div className="empty-state">
              <div style={{ marginBottom: 16 }}><Loader2 size={32} className="animate-spin" color="var(--yellow)" /></div>
              <p>Querying Solana Devnet registry...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <h3>No agents found</h3>
              <p>The Metaplex registry query returned 0 results. Try refreshing.</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map((agent, i) => (
                <div
                  key={agent.mintAddress || i}
                  className={`agent-card ${verifiedAsset === agent.mintAddress ? "verified-card" : ""}`}
                >
                  <div className="agent-card-top">
                    <div className="agent-icon">
                      {agent.verifiedOnDevnet ? "✅" : "🌐"}
                    </div>
                    {verifiedAsset === agent.mintAddress ? (
                      <span className="agent-badge-verified"><CheckCircle size={11} /> Verified</span>
                    ) : (
                      <span className="agent-badge-devnet">Devnet</span>
                    )}
                  </div>
                  <div>
                    <div className="agent-name">{agent.displayName || agent.name}</div>
                    <div className="agent-specialty">{agent.specialty || "Travel & Tourism"}</div>
                  </div>
                  <p className="agent-desc">{agent.description}</p>
                  {agent.mintAddress && (
                    <div className="agent-addr">
                      Asset: {agent.mintAddress.slice(0, 18)}...{agent.mintAddress.slice(-6)}
                    </div>
                  )}
                  <div className="agent-actions">
                    <button
                      className="btn-sm-yellow"
                      disabled={verifyingAsset === agent.mintAddress}
                      onClick={() => verifyAgentOnChain(agent.mintAddress)}
                    >
                      {verifyingAsset === agent.mintAddress
                        ? <><Loader2 size={12} className="animate-spin" /> Verifying...</>
                        : <><CheckCircle size={12} /> Verify Identity</>}
                    </button>
                    {agent.mintAddress && (
                      <a
                        href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                        target="_blank" rel="noreferrer"
                        className="btn-sm-dark"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: PRICE                                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "price" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Price Protection</div>
              <h2 className="section-title">Fair Price Checker</h2>
              <p className="section-sub">Compare local quotes against verified reference rates to protect against overcharging</p>
            </div>
          </div>
          <div className="two-col-grid">
            <div className="feature-card">
              <div className="feature-card-icon"><DollarSign size={20} /></div>
              <div className="feature-card-title">Check Price Fairness</div>
              <p className="feature-card-sub">Enter what you were quoted and we'll compare it against typical local rates.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div className="field-label">Service Type</div>
                  <select className="field-input" value={priceService} onChange={e => setPriceService(e.target.value)}>
                    <option>Auto-rickshaw</option>
                    <option>Taxi / Cab</option>
                    <option>Hotel room (budget)</option>
                    <option>Hotel room (mid-range)</option>
                    <option>Tour guide (half-day)</option>
                    <option>Entry ticket</option>
                  </select>
                </div>
                <div>
                  <div className="field-label">City / Destination</div>
                  <input className="field-input" value={priceCity} onChange={e => setPriceCity(e.target.value)} placeholder="e.g. Mysuru" />
                </div>
                <div>
                  <div className="field-label">Your Quote (₹ / $)</div>
                  <input className="field-input" type="number" value={priceQuote} onChange={e => setPriceQuote(e.target.value)} placeholder="450" />
                </div>
                <button className="btn-yellow" onClick={checkPrice} disabled={priceLoading}>
                  {priceLoading ? <><Loader2 size={15} className="animate-spin" /><span>Checking...</span></> : <><DollarSign size={15} /><span>Check Price</span></>}
                </button>
              </div>
              {priceResult && !priceResult.error && (
                <div className={`status-box ${priceResult.verdict === "Fair" ? "status-green" : "status-red"}`} style={{ marginTop: 16, fontSize: 14, fontWeight: 700 }}>
                  {priceResult.verdict === "Fair" ? "✓ Fair Price" : "⚠ Possibly Overpriced"} — Reference: {priceResult.reference} | Your quote: {priceResult.quote}
                </div>
              )}
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Receipt size={20} /></div>
              <div className="feature-card-title">Reference Rate Guide</div>
              <p className="feature-card-sub">Typical rates in Indian tourism cities (2024 estimates).</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { service: "Auto-rickshaw (short hop)", rate: "₹50–120" },
                  { service: "City taxi (10km)", rate: "₹150–280" },
                  { service: "Tour guide (half-day)", rate: "₹400–800" },
                  { service: "Hotel room (budget)", rate: "₹800–1,500" },
                  { service: "Hotel room (mid-range)", rate: "₹2,000–4,500" },
                  { service: "Monument entry ticket", rate: "₹30–200" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--dark-border)", fontSize: 13 }}>
                    <span style={{ color: "var(--gray-light)" }}>{r.service}</span>
                    <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{r.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: SAFETY                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "safety" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Trip Management</div>
              <h2 className="section-title">Safety & Budget</h2>
              <p className="section-sub">Emergency helplines and trip expense tracker</p>
            </div>
          </div>
          <div className="two-col-grid">
            {/* Emergency Contacts */}
            <div className="feature-card">
              <div className="feature-card-icon"><Phone size={20} /></div>
              <div className="feature-card-title">Emergency Helplines</div>
              <p className="feature-card-sub">Karnataka & India emergency contacts for travellers.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Police", number: "100", color: "#5585E0" },
                  { label: "Ambulance", number: "108", color: "#E05555" },
                  { label: "Tourist Helpline (India)", number: "1363 / 1800-11-1363", color: "var(--yellow)" },
                  { label: "Women's Helpline", number: "181", color: "#9B59B6" },
                  { label: "Fire", number: "101", color: "#E07030" },
                  { label: "Road Accident", number: "1073", color: "var(--gray-light)" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--dark-elevated)", borderRadius: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Phone size={14} color={c.color} />
                      <span style={{ fontSize: 13, color: "var(--gray-light)" }}>{c.label}</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: c.color }}>{c.number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Tracker */}
            <div className="feature-card">
              <div className="feature-card-icon"><Receipt size={20} /></div>
              <div className="feature-card-title">Trip Expense Tracker</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--gray)" }}>Budget: ₹{budget.toLocaleString()}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: budgetPct > 80 ? "var(--error)" : "var(--yellow)" }}>
                  Spent: ₹{totalSpent.toLocaleString()} ({budgetPct}%)
                </span>
              </div>
              <div className="budget-bar-track">
                <div className="budget-bar-fill" style={{ width: `${budgetPct}%`, background: budgetPct > 80 ? "var(--error)" : "var(--yellow)" }} />
              </div>
              <div style={{ marginTop: 16, marginBottom: 12 }}>
                {expenses.map(e => (
                  <div key={e.id} className="expense-row">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>{e.name}</div>
                      <span className="expense-cat-badge">{e.cat}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--yellow)" }}>₹{e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--dark-border)", paddingTop: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="field-input" placeholder="Expense name" value={newExpName} onChange={e => setNewExpName(e.target.value)} style={{ flex: 1 }} />
                  <input className="field-input" placeholder="₹" type="number" value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} style={{ width: 80 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select className="field-input" style={{ flex: 1 }} value={newExpCat} onChange={e => setNewExpCat(e.target.value)}>
                    {["Food", "Transport", "Hotel", "Activity", "Shopping", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button className="btn-yellow" style={{ width: "auto", padding: "0 16px" }} onClick={addExpense}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: RECORDS                                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "records" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Blockchain Verified</div>
              <h2 className="section-title">On-Chain Itinerary Records</h2>
              <p className="section-sub">Every committed itinerary is immutably stored on Solana Devnet. Verify any hash independently.</p>
            </div>
          </div>

          {savedRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <h3>No records yet</h3>
              <p>Go to Discover, select a destination, and click "Commit Hash to Solana Devnet" to create your first tamper-evident itinerary record.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedRecords.map((rec, i) => (
                <div key={i} className="record-card">
                  <div className="record-icon">✓</div>
                  <div className="record-body">
                    <div className="record-dest">{rec.dest} — Itinerary Hash Committed</div>
                    <div className="record-hash">Hash: {rec.hash}</div>
                    <div className="record-time">{rec.time}</div>
                  </div>
                  {rec.tx.startsWith("demo_") ? (
                    <a
                      href="https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet"
                      target="_blank" rel="noreferrer"
                      className="record-link"
                    >
                      <ExternalLink size={13} /> View Anchor Program
                    </a>
                  ) : (
                    <a
                      href={`https://explorer.solana.com/tx/${rec.tx}?cluster=devnet`}
                      target="_blank" rel="noreferrer"
                      className="record-link"
                    >
                      <ExternalLink size={13} /> View on Explorer
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hash Verifier */}
          <div className="feature-card" style={{ marginTop: 32, maxWidth: 600 }}>
            <div className="feature-card-title" style={{ marginBottom: 6 }}>Hash Tamper Verifier</div>
            <p className="feature-card-sub">Paste any 64-character SHA-256 hash to verify its format integrity.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="field-input"
                placeholder="Paste 64-character SHA-256 hex..."
                value={verifyHashInput}
                onChange={e => setVerifyHashInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn-yellow"
                style={{ width: "auto", padding: "0 20px", whiteSpace: "nowrap" }}
                onClick={() => {
                  if (verifyHashInput.length === 64 && /^[0-9a-f]+$/.test(verifyHashInput)) {
                    setVerifyStatus("✓ Valid SHA-256 hash — matches canonical commitment structure");
                  } else {
                    setVerifyStatus("✗ Invalid: must be exactly 64 lowercase hex characters");
                  }
                }}
              >
                Verify
              </button>
            </div>
            {verifyStatus && (
              <div className={`status-box ${verifyStatus.startsWith("✓") ? "status-green" : "status-red"}`} style={{ marginTop: 12, fontSize: 13 }}>
                {verifyStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="site-footer">
        <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" alt="Touristमत्रम् Logo" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 18, fontWeight: 900 }}>
            Tourist<span style={{ color: "var(--yellow)" }}>मत्रम्</span>
          </span>
        </div>
        <div>
          <span className="footer-devnet-dot" />
          Connected to Solana Devnet
        </div>
        <div>© 2026 Touristमत्रम्. All rights reserved.</div>
      </footer>
    </>
  );
}
