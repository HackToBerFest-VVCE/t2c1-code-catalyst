import { NextResponse } from "next/server";

// ─── Static itinerary database for popular Indian destinations ────────────
// These are the fallback/AI-generated itineraries when no API key is configured.
// All costs are estimates based on travel guides (2024-2025). Verify locally.

type Stop = {
  time: string;
  name: string;
  description: string;
  estimatedCost: string;
  type: string;
};

type DayPlan = {
  theme: string;
  stops: Stop[];
};

type Destination = {
  summary: string;
  tips: string[];
  days: DayPlan[];
};

const ITINERARY_DB: Record<string, Destination> = {
  mysuru: {
    summary: "Mysuru (Mysore) is Karnataka's cultural capital, famous for its magnificent palace, vibrant markets, and Dasara festival. A relaxed city with excellent food, silk, and sandalwood products.",
    tips: [
      "Mysuru Palace is closed on Tuesdays — plan around this.",
      "Best season: October–February; Dasara (Oct) draws huge crowds.",
      "Mysuru silk and sandalwood products are authentic local buys — purchase from Karnataka Silk Industries stores to avoid fakes.",
      "Auto-rickshaws are readily available; agree on the fare before starting.",
      "Chamundi Hill is best visited at sunrise for views and a cooler climb.",
    ],
    days: [
      {
        theme: "Palaces & Markets",
        stops: [
          { time: "09:00", name: "Mysuru Palace", description: "Stunning Indo-Saracenic palace; Sunday evenings it is illuminated with 100,000 bulbs.", estimatedCost: "70", type: "heritage" },
          { time: "11:00", name: "Devaraja Market", description: "Historic covered market selling flowers, spices, incense, and local produce. Excellent photography.", estimatedCost: "0", type: "market" },
          { time: "13:00", name: "Vinayaka Mylari", description: "Iconic local restaurant famous for dosas and idlis — a Mysuru institution.", estimatedCost: "80", type: "food" },
          { time: "15:00", name: "Mysore Zoo (Sri Chamarajendra Zoological Gardens)", description: "One of India's oldest and best-maintained zoos; home to white tigers and gorillas.", estimatedCost: "80", type: "attraction" },
          { time: "17:30", name: "Mysuru Palace Evening Illumination (Sunday)", description: "Witness the palace lit up with 100,000 lights — only on Sunday evenings.", estimatedCost: "0", type: "heritage" },
        ],
      },
      {
        theme: "Temples & Hills",
        stops: [
          { time: "06:30", name: "Chamundi Hill", description: "Sacred hill with Chamundeshwari Temple; climb 1000 steps or take a vehicle. Great city views at sunrise.", estimatedCost: "0", type: "temple" },
          { time: "09:30", name: "Nandi Bull Statue", description: "Monolithic 5-metre Nandi bull carved from solid rock, halfway down the hill steps.", estimatedCost: "0", type: "heritage" },
          { time: "11:00", name: "St. Philomena's Cathedral", description: "Neo-Gothic cathedral, one of the largest in India. Peaceful and photogenic.", estimatedCost: "0", type: "heritage" },
          { time: "13:00", name: "Hotel RRR or Mylari", description: "Famous for Mysuru-style mutton and vegetarian thali.", estimatedCost: "150", type: "food" },
          { time: "15:00", name: "Mysuru Sand Sculpture Museum", description: "Unique sand art exhibits with themes from Indian mythology and history.", estimatedCost: "50", type: "museum" },
          { time: "17:00", name: "Kukkarahalli Lake", description: "Tranquil bird-watching lake in the heart of the city; excellent for evening walks.", estimatedCost: "0", type: "nature" },
        ],
      },
      {
        theme: "Day Trip — Srirangapatna & Brindavan Gardens",
        stops: [
          { time: "08:00", name: "Srirangapatna (16 km from Mysuru)", description: "Historic island fortress; site of Tipu Sultan's battles. Visit Darya Daulat Bagh palace and Jama Masjid.", estimatedCost: "50", type: "heritage" },
          { time: "11:00", name: "Ranganathittu Bird Sanctuary", description: "Excellent river boat ride to see egrets, ibis, kingfishers, and monitor lizards.", estimatedCost: "150", type: "nature" },
          { time: "13:30", name: "Local dhaba at Srirangapatna", description: "Simple local meals — fish or vegetarian thali.", estimatedCost: "100", type: "food" },
          { time: "15:30", name: "Brindavan Gardens", description: "Musical fountain garden at the base of the KRS Dam. Spectacular in the evenings.", estimatedCost: "30", type: "attraction" },
          { time: "18:00", name: "Return to Mysuru", description: "Evening back in the city; explore the palace lights or MG Road area.", estimatedCost: "0", type: "transport" },
        ],
      },
    ],
  },
  goa: {
    summary: "Goa offers a perfect blend of beaches, Portuguese heritage, seafood, and vibrant nightlife. North Goa is livelier; South Goa has calmer, cleaner beaches.",
    tips: [
      "Hire a scooter or motorbike for the most flexible exploration.",
      "Avoid swimming at unguarded beaches or during monsoon (June–September).",
      "Most beach shacks serve excellent fresh seafood — ask for the daily catch.",
      "Carry cash — smaller shacks and local markets are often cash-only.",
      "Old Goa church complex (UNESCO) is best visited in the morning before crowds.",
    ],
    days: [
      {
        theme: "North Goa Beaches",
        stops: [
          { time: "09:00", name: "Calangute Beach", description: "Goa's most popular beach; good for people-watching and water sports.", estimatedCost: "200", type: "beach" },
          { time: "11:30", name: "Baga Beach", description: "Livelier adjacent beach with beach shacks, parasailing, and jet-skiing.", estimatedCost: "300", type: "beach" },
          { time: "13:30", name: "Lila Café or Martin's Corner (Baga)", description: "Popular for Goan fish curry, prawn balchão, and cold King Fisher beer.", estimatedCost: "400", type: "food" },
          { time: "15:30", name: "Anjuna Flea Market (Wednesdays)", description: "Iconic weekly market with handicrafts, hippie goods, and local art.", estimatedCost: "500", type: "market" },
          { time: "18:00", name: "Sunset at Vagator or Chapora Fort", description: "Chapora Fort offers panoramic sunset views over the coast.", estimatedCost: "0", type: "heritage" },
        ],
      },
      {
        theme: "Old Goa & Heritage",
        stops: [
          { time: "09:00", name: "Basilica of Bom Jesus (Old Goa)", description: "UNESCO World Heritage Site housing St. Francis Xavier's remains. Baroque architecture.", estimatedCost: "0", type: "heritage" },
          { time: "10:30", name: "Sé Cathedral & Church of St. Francis of Assisi", description: "Largest church in Asia; beautiful blue azulejo tiles inside.", estimatedCost: "0", type: "heritage" },
          { time: "12:00", name: "Ritz Classic or Bhatti Village", description: "Authentic Goan cuisine — xacuti, cafreal, and sorpotel.", estimatedCost: "500", type: "food" },
          { time: "14:30", name: "Fontainhas — Latin Quarter, Panaji", description: "Colourful Portuguese-era neighbourhood; best walked slowly.", estimatedCost: "0", type: "heritage" },
          { time: "16:30", name: "Miramar Beach", description: "Panaji city beach; less crowded, good for an evening walk.", estimatedCost: "0", type: "beach" },
        ],
      },
    ],
  },
  default: {
    summary: "A curated itinerary for your destination. All costs are estimates — verify locally before travel.",
    tips: [
      "Research your destination's local customs and dress codes, especially at religious sites.",
      "Carry small denomination local currency for markets and auto-rickshaws.",
      "Purchase travel insurance covering medical emergencies and trip cancellations.",
      "Keep digital copies of all documents (passport, visa, insurance) in a secure cloud service.",
      "Inform your bank of travel plans to prevent card blocks abroad.",
    ],
    days: [
      {
        theme: "Arrival & Orientation",
        stops: [
          { time: "10:00", name: "Check in & Rest", description: "Settle into your accommodation and rest after travel.", estimatedCost: "0", type: "accommodation" },
          { time: "13:00", name: "Local Lunch", description: "Try a popular local restaurant recommended by your hotel for authentic regional cuisine.", estimatedCost: "200", type: "food" },
          { time: "15:00", name: "City Centre Walk", description: "Explore the main market area, town square, or waterfront at your leisure.", estimatedCost: "0", type: "exploration" },
          { time: "18:00", name: "Sunset Viewpoint", description: "Find a recommended local viewpoint for the evening — ask your hotel for the best spot.", estimatedCost: "0", type: "nature" },
        ],
      },
      {
        theme: "Major Attractions",
        stops: [
          { time: "09:00", name: "Top Heritage Site", description: "Visit the most-recommended heritage site, museum, or natural attraction in the area.", estimatedCost: "200", type: "heritage" },
          { time: "12:00", name: "Lunch at Local Eatery", description: "Eat at a locally-recommended restaurant away from tourist hotspots for better value.", estimatedCost: "250", type: "food" },
          { time: "14:00", name: "Local Market", description: "Browse the local market for authentic souvenirs, fresh produce, and street food.", estimatedCost: "300", type: "market" },
          { time: "17:00", name: "Cultural Experience", description: "Evening cultural show, music, dance, or guided walk to understand local traditions.", estimatedCost: "300", type: "culture" },
        ],
      },
    ],
  },
};

function findDestination(destination: string): { key: string; data: Destination } {
  const key = destination.toLowerCase().replace(/[^a-z]/g, "");
  const matched = Object.keys(ITINERARY_DB).find(
    (k) => k !== "default" && (key.includes(k) || k.includes(key.slice(0, 5)))
  );
  return matched
    ? { key: matched, data: ITINERARY_DB[matched] }
    : { key: "default", data: ITINERARY_DB.default };
}

function buildItinerary(params: {
  destination: string;
  duration: string;
  budget: string;
  currency: string;
  interests: string;
  pace: string;
  agentName?: string;
}) {
  const { destination, duration, budget, currency, pace, agentName } = params;
  const numDays = Math.min(Math.max(parseInt(duration) || 3, 1), 14);
  const { data } = findDestination(destination);

  // Repeat days cyclically if duration > available days
  const days = Array.from({ length: numDays }, (_, i) => {
    const template = data.days[i % data.days.length];
    const date = new Date();
    date.setDate(date.getDate() + 1 + i);
    const dateStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    // Adjust stops based on pace
    let stops = template.stops;
    if (pace === "relaxed") stops = stops.slice(0, 3);
    if (pace === "packed") stops = [...stops, ...template.stops.slice(0, 2)].slice(0, 7);

    return {
      day: i + 1,
      date: dateStr,
      theme: template.theme,
      stops,
    };
  });

  return {
    destination,
    duration: `${numDays} day${numDays !== 1 ? "s" : ""}`,
    budget: parseFloat(budget || "0").toLocaleString(),
    currency,
    summary: data.summary,
    days,
    tips: data.tips,
    generatedAt: new Date().toISOString(),
    agentName: agentName ?? undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      destination?: string;
      duration?: string;
      budget?: string;
      currency?: string;
      interests?: string;
      pace?: string;
      agentName?: string;
    };

    const {
      destination = "Mysuru, India",
      duration = "3",
      budget = "5000",
      currency = "INR",
      interests = "general",
      pace = "moderate",
      agentName,
    } = body;

    // If OpenAI API key is configured, use it
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const prompt = `Create a detailed ${duration}-day tourism itinerary for ${destination} with a budget of ${budget} ${currency}. 
Interests: ${interests}. Pace: ${pace}.
${agentName ? `Agent: ${agentName}` : ""}

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "destination": "${destination}",
  "duration": "${duration} days",
  "budget": "${budget}",
  "currency": "${currency}",
  "summary": "2-3 sentence destination overview",
  "days": [
    {
      "day": 1,
      "date": "Day 1 date label",
      "theme": "Theme for the day",
      "stops": [
        {
          "time": "09:00",
          "name": "Place name",
          "description": "Brief description (1-2 sentences)",
          "estimatedCost": "numeric cost only in ${currency}",
          "type": "heritage|food|market|nature|temple|museum|beach|culture|transport"
        }
      ]
    }
  ],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "generatedAt": "${new Date().toISOString()}",
  "agentName": ${agentName ? `"${agentName}"` : "null"}
}`;

        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 3000,
            temperature: 0.7,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json() as { choices?: Array<{ message?: { content?: string } }> };
          const content = aiData.choices?.[0]?.message?.content?.trim() ?? "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const itinerary = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ itinerary, source: "openai" });
          }
        }
      } catch {
        // Fall through to static data
      }
    }

    // Static / rule-based itinerary
    const itinerary = buildItinerary({ destination, duration, budget, currency, interests, pace, agentName });
    return NextResponse.json({ itinerary, source: "static" });
  } catch (e) {
    return NextResponse.json(
      { error: `Itinerary generation failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 }
    );
  }
}
