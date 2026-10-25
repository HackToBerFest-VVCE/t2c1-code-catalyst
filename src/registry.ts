export type RegisteredAgent = {
  mintAddress: string;
  name: string;
  description?: string;
  agentRegistrationUri?: string;
  services?: Array<{ name: string; endpoint: string; skills?: string[]; domains?: string[] }>;
  active?: boolean;
};

const METAPLEX_API = "https://api.metaplex.com/v1/agents";

/**
 * Discovery uses the documented indexed API. Callers must still verify the
 * returned asset identity on Solana before treating it as registered.
 */
export async function discoverAgents(query: string, network = "solana-devnet") {
  const url = new URL(METAPLEX_API);
  url.searchParams.set("network", network);
  url.searchParams.set("query", query);
  url.searchParams.set("hasServices", "true");
  url.searchParams.set("activeOnly", "true");
  url.searchParams.set("pageSize", "20");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Agent discovery failed: ${response.status}`);
  return (await response.json()) as { data: { agents: RegisteredAgent[] } };
}
