import { Connection, PublicKey } from "@solana/web3.js";

export type RegisteredAgent = {
  mintAddress: string;
  name: string;
  description?: string;
  agentRegistrationUri?: string;
  services?: Array<{ name: string; endpoint: string; skills?: string[]; domains?: string[] }>;
  active?: boolean;
};

export const METAPLEX_AGENT_REGISTRY_PROGRAM_ID = new PublicKey(
  "1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p"
);

const METAPLEX_API = "https://api.metaplex.com/v1/agents";

/**
 * Derives the official Metaplex Agent Identity PDA for an MPL Core asset.
 */
export function findAgentIdentityPda(
  assetPubkey: PublicKey,
  programId: PublicKey = METAPLEX_AGENT_REGISTRY_PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("agent_identity", "utf-8"), assetPubkey.toBuffer()],
    programId
  );
}

/**
 * Verifies on Solana whether an asset has an active AgentIdentityV1 account
 * registered under the Metaplex Agent Registry program.
 */
export async function verifyAgentIdentityOnChain(
  connection: Connection,
  assetPubkey: PublicKey,
  programId: PublicKey = METAPLEX_AGENT_REGISTRY_PROGRAM_ID
): Promise<{
  registered: boolean;
  identityPda: PublicKey;
  storedAssetMatches: boolean;
}> {
  const [identityPda] = findAgentIdentityPda(assetPubkey, programId);
  const account = await connection.getAccountInfo(identityPda);

  if (!account || !account.owner.equals(programId) || account.data.length < 40) {
    return { registered: false, identityPda, storedAssetMatches: false };
  }

  const storedAsset = new PublicKey(account.data.subarray(8, 40));
  return {
    registered: true,
    identityPda,
    storedAssetMatches: storedAsset.equals(assetPubkey),
  };
}

/**
 * Discovers agents through Metaplex's indexed REST API.
 */
export async function discoverAgents(query = "travel", network = "solana-devnet") {
  const url = new URL(METAPLEX_API);
  url.searchParams.set("network", network);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "20");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Agent discovery failed: ${response.status}`);
  return (await response.json()) as { data: { agents: RegisteredAgent[]; total: number } };
}
