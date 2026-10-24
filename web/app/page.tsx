"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Agent = {
  mintAddress?: string;
  name?: string;
  description?: string;
  active?: boolean;
  services?: Array<{ name: string; endpoint: string }>;
};

export default function Home() {
  const [destination, setDestination] = useState("Mysuru");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState("Choose a destination, then discover active registered agents.");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);

  async function discover() {
    setStatus("Checking the indexed Solana agent directory…");
    try {
      const response = await fetch(`/api/agents?query=${encodeURIComponent(destination)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setAgents(payload.data?.agents ?? []);
      setStatus(`Found ${(payload.data?.agents ?? []).length} candidate agent(s). Identity is checked before commitment.`);
    } catch (error) {
      setAgents([]);
      setStatus(error instanceof Error ? error.message : "Discovery failed.");
    }
  }

  async function verifyAgent(asset?: string) {
    if (!asset) return;
    setStatus("Verifying the agent identity directly on Solana Devnet…");
    const response = await fetch(`/api/agents/verify?asset=${encodeURIComponent(asset)}`);
    const payload = await response.json();
    if (!response.ok || !payload.registered) {
      setVerifiedAsset(null);
      setStatus("This asset does not have a readable registered agent identity on Devnet.");
      return;
    }
    setVerifiedAsset(asset);
    setStatus(`Agent identity verified on Devnet. PDA: ${payload.identityPda}`);
  }

  return (
    <main>
      <div className="eyebrow">Solana tourism infrastructure</div>
      <h1>Plan a trip. Know which agent you trusted.</h1>
      <p className="lede">
        ProofTrip finds tourism agents registered on Solana, lets you review their advertised services,
        and prepares an itinerary commitment you can verify later.
      </p>

      <section className="panel">
        <div className="toolbar">
          <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Destination or agent name" />
          <button onClick={discover}>Discover registered agents</button>
          <WalletMultiButton className="wallet-button" />
        </div>
        <div className="status" role="status">{status}</div>
        <div className="agents">
          {agents.map((agent) => (
            <article className="agent" key={agent.mintAddress ?? agent.name}>
              <span className="badge">REGISTERED DIRECTORY RESULT</span>
              <h3>{agent.name ?? "Unnamed agent"}</h3>
              <p>{agent.description ?? "No description was provided in the registration metadata."}</p>
              <button className="secondary" onClick={() => verifyAgent(agent.mintAddress)}>
                {verifiedAsset === agent.mintAddress ? "Identity verified" : "Verify identity"}
              </button>
            </article>
          ))}
        </div>
        <p className="fineprint">
          Discovery is indexed and may lag recent registrations. A directory result is not a tourism license or quality guarantee.
          Itinerary content remains off-chain until its hash is committed on Devnet.
        </p>
        {verifiedAsset && <button onClick={() => setStatus("Next slice: sign the itinerary commitment transaction from your connected wallet.")}>Prepare itinerary commitment</button>}
      </section>
    </main>
  );
}
