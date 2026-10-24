"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";

type Agent = {
  mintAddress?: string;
  name?: string;
  description?: string;
  active?: boolean;
  services?: Array<{ name: string; endpoint: string }>;
};

export default function Home() {
  const [destination, setDestination] = useState("Mysuru");
  const [travelDate, setTravelDate] = useState("2026-11-14");
  const [stops, setStops] = useState("Mysuru Palace, Devaraja Market, Chamundi Hill");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState("Choose a destination, then discover active registered agents.");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [commitmentSignature, setCommitmentSignature] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  async function discover() {
    setStatus("Checking the indexed Solana agent directory…");
    try {
      const response = await fetch(`/api/agents?query=${encodeURIComponent(destination)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setAgents(payload.data?.agents ?? []);
      setStatus(payload.fallbackSearch
        ? `No agent matched “${payload.originalQuery}”; showing active travel agents instead.`
        : `Found ${(payload.data?.agents ?? []).length} candidate agent(s). Identity is checked before commitment.`);
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

  async function commitItinerary() {
    if (!verifiedAsset || !wallet.publicKey || !wallet.sendTransaction) {
      setStatus("Connect a wallet and verify an agent before committing the itinerary.");
      return;
    }
    const configuredProgram = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID;
    if (!configuredProgram) {
      setStatus("The Anchor program is not deployed yet. Set NEXT_PUBLIC_TOURISM_PROGRAM_ID after Devnet deployment.");
      return;
    }

    try {
      const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
      const program = new Program({ ...tourismIdl, address: configuredProgram } as Idl, provider);
      const commitment = Keypair.generate();
      const itinerary = {
        destination,
        dates: { start: travelDate, end: travelDate },
        days: [{ date: travelDate, stops: stops.split(",").map((name) => ({ name: name.trim() })).filter((stop) => stop.name) }],
      };
      const bytes = new TextEncoder().encode(JSON.stringify(itinerary));
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const hash = Array.from(new Uint8Array(digest));
      const instruction = await program.methods
        .commitItinerary(new PublicKey(verifiedAsset), hash, destination)
        .accounts({ commitment: commitment.publicKey, traveler: wallet.publicKey, systemProgram: SystemProgram.programId })
        .instruction();
      const transaction = new Transaction().add(instruction);
      const signature = await wallet.sendTransaction(transaction, connection, { signers: [commitment] });
      await connection.confirmTransaction(signature, "confirmed");
      setCommitmentSignature(signature);
      setStatus("Itinerary commitment confirmed on Solana Devnet.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The itinerary commitment failed.");
    }
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
          <input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} aria-label="Trip date" />
          <button onClick={discover}>Discover registered agents</button>
          <WalletMultiButton className="wallet-button" />
        </div>
        <label className="field-label" htmlFor="stops">Stops to include in the itinerary</label>
        <input id="stops" value={stops} onChange={(event) => setStops(event.target.value)} placeholder="Separate stops with commas" />
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
        {verifiedAsset && <button onClick={commitItinerary}>Commit itinerary hash on Devnet</button>}
        {commitmentSignature && <p className="fineprint">Transaction: {commitmentSignature}</p>}
      </section>
    </main>
  );
}
