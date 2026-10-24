import { NextResponse } from "next/server";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import {
  findAgentIdentityV1Pda,
  mplAgentIdentity,
  safeFetchAgentIdentityV1,
} from "@metaplex-foundation/mpl-agent-registry";

export async function GET(request: Request) {
  const asset = new URL(request.url).searchParams.get("asset");
  if (!asset) return NextResponse.json({ error: "asset is required" }, { status: 400 });

  try {
    const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com")
      .use(mplAgentIdentity());
    const identityPda = findAgentIdentityV1Pda(umi, { asset: publicKey(asset) });
    const identity = await safeFetchAgentIdentityV1(umi, identityPda);
    return NextResponse.json({ registered: identity !== null, identityPda: identityPda[0].toString() });
  } catch {
    return NextResponse.json({ error: "The asset address could not be verified on Solana." }, { status: 400 });
  }
}
