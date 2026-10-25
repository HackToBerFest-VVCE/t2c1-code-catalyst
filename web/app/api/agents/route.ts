import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Tourism-relevance keywords found in real Metaplex agent descriptions
const TOURISM_KEYWORDS = [
  "travel", "trip", "tour", "tourism", "hotel", "accommodation", "flight",
  "itinerary", "destination", "booking", "holiday", "vacation", "journey",
  "adventure", "explore", "guide", "sightseeing", "attraction", "transport",
  "local", "cultural", "heritage"
];

function scoreTourismRelevance(agent: { name?: string; description?: string; services?: Array<{ name: string }> }): {
  score: number;
  reason: string;
} {
  const text = [
    agent.name ?? "",
    agent.description ?? "",
    ...(agent.services?.map((s) => s.name) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const matched = TOURISM_KEYWORDS.filter((kw) => text.includes(kw));
  return {
    score: matched.length,
    reason: matched.length > 0 ? `Matched keywords: ${matched.join(", ")}` : "No tourism keywords in metadata",
  };
}

async function fetchAgents(params: Record<string, string>) {
  const url = new URL("https://api.metaplex.com/v1/agents");
  url.searchParams.set("network", "solana-devnet");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Metaplex API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "travel";

  const diagnostics: string[] = [];

  try {
    // Step 1: Try direct name query with services filter
    let result: { data?: { agents?: unknown[]; total?: number } } | null = null;
    diagnostics.push(`Query 1: name="${query}" hasServices=true activeOnly=true`);

    try {
      result = await fetchAgents({
        query,
        hasServices: "true",
        activeOnly: "true",
        pageSize: "20",
      });
      diagnostics.push(`  → ${result?.data?.agents?.length ?? 0} agents (total: ${result?.data?.total ?? "?"})`);
    } catch (e) {
      diagnostics.push(`  → failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Step 2: If no results or query not "travel", also try broad active-only search
    let fallbackSearch = false;
    if (!result?.data?.agents?.length) {
      diagnostics.push(`Query 2: name="travel" activeOnly=true (fallback)`);
      try {
        result = await fetchAgents({
          query: "travel",
          activeOnly: "true",
          pageSize: "20",
        });
        diagnostics.push(`  → ${result?.data?.agents?.length ?? 0} agents`);
        fallbackSearch = true;
      } catch (e) {
        diagnostics.push(`  → failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // Step 3: If still nothing, try completely unfiltered
    if (!result?.data?.agents?.length) {
      diagnostics.push(`Query 3: unfiltered, pageSize=20`);
      try {
        result = await fetchAgents({ pageSize: "20" });
        diagnostics.push(`  → ${result?.data?.agents?.length ?? 0} agents`);
        fallbackSearch = true;
      } catch (e) {
        diagnostics.push(`  → failed: ${e instanceof Error ? e.message : String(e)}`);
        result = null;
      }
    }

    const agents = (result?.data?.agents ?? []) as Array<{
      name?: string; description?: string; mintAddress?: string; active?: boolean;
      services?: Array<{ name: string; endpoint: string }>;
    }>;

    // Score tourism relevance (for display — not as a hard filter)
    const scored = agents.map((a) => {
      const { score, reason } = scoreTourismRelevance(a);
      return { ...a, isTourismRelevant: score > 0, relevanceReason: reason };
    });

    diagnostics.push(
      `Tourism-relevant (keyword match): ${scored.filter((a) => a.isTourismRelevant).length}/${scored.length}`
    );
    diagnostics.push(
      `Note: Devnet registry is sparse. Most entries are dev/test agents, not tourism services.`
    );

    return NextResponse.json({
      data: { agents: scored, total: result?.data?.total ?? scored.length },
      fallbackSearch,
      originalQuery: query,
      diagnostics: diagnostics.join("\n"),
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: `Agent discovery unavailable: ${e instanceof Error ? e.message : String(e)}`,
        diagnostics: diagnostics.join("\n"),
      },
      { status: 502 }
    );
  }
}
