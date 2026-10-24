import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "travel";
  const url = new URL("https://api.metaplex.com/v1/agents");
  url.searchParams.set("network", "solana-devnet");
  url.searchParams.set("query", query);
  url.searchParams.set("hasServices", "true");
  url.searchParams.set("activeOnly", "true");
  url.searchParams.set("pageSize", "12");

  const response = await fetch(url, { next: { revalidate: 30 } });
  if (!response.ok) {
    return NextResponse.json({ error: "Agent discovery is unavailable." }, { status: 502 });
  }
  return NextResponse.json(await response.json());
}
