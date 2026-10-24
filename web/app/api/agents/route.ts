import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "travel";
  async function search(term: string, filtered = true) {
    const url = new URL("https://api.metaplex.com/v1/agents");
    url.searchParams.set("network", "solana-devnet");
    url.searchParams.set("query", term);
    if (filtered) {
      url.searchParams.set("hasServices", "true");
      url.searchParams.set("activeOnly", "true");
    }
    url.searchParams.set("pageSize", "12");
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) throw new Error("Agent discovery is unavailable.");
    return response.json();
  }

  try {
    const result = await search(query);
    if (result.data?.agents?.length || query.toLowerCase() === "travel") return NextResponse.json(result);
    const fallback = await search("travel", false);
    return NextResponse.json({ ...fallback, fallbackSearch: "travel", originalQuery: query });
  } catch {
    return NextResponse.json({ error: "Agent discovery is unavailable." }, { status: 502 });
  }
}
