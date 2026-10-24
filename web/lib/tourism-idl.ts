export const tourismIdl = {
  address: "11111111111111111111111111111111",
  metadata: { name: "tourism_registry", version: "0.1.0", spec: "0.1.0" },
  version: "0.1.0",
  name: "tourism_registry",
  instructions: [{
    name: "commitItinerary",
    discriminator: [225, 116, 127, 250, 81, 231, 31, 70],
    accounts: [
      { name: "commitment", writable: true, signer: true },
      { name: "traveler", writable: true, signer: true },
      { name: "systemProgram", address: "11111111111111111111111111111111" }
    ],
    args: [
      { name: "agentAsset", type: "pubkey" },
      { name: "itineraryHash", type: { array: ["u8", 32] } },
      { name: "destination", type: "string" }
    ]
  }]
} as const;
