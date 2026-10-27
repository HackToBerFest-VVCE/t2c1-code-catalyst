import pptxgen from "pptxgenjs";
import path from "node:path";

const pptx = new pptxgen();

// Set 16:9 widescreen dimensions (13.33 x 7.5 inches)
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

// Brand Color Palette - Dark Obsidian + Solana Theme
const COLORS = {
  bgDark: "0A0E17",        // Deep Obsidian
  cardDark: "121826",      // Midnight Slate Card
  cardDark2: "182133",     // Elevated Card
  cardBorder: "23304A",    // Subtle Border
  gold: "F59E0B",          // Amber / Brand Accent
  goldLight: "FBBF24",
  solanaGreen: "14F195",   // Solana Green
  cyan: "06B6D4",          // Devnet / Tech Cyan
  purple: "9945FF",        // Solana Purple
  red: "EF4444",           // Warning / Problem Red
  white: "FFFFFF",         // Text Header
  silver: "94A3B8",        // Text Muted
  silverLight: "CBD5E1",   // Body text
};

const FONT_TITLE = "Trebuchet MS";
const FONT_BODY = "Calibri";

// Helper for Slide Background
function setSlideBackground(slide) {
  slide.background = { color: COLORS.bgDark };
  
  // Top gradient accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.08,
    fill: { color: COLORS.gold },
    line: { color: COLORS.gold, width: 0 },
  });
}

// Helper for Category Tag / Kicker
function addKicker(slide, text, x = 0.8, y = 0.5) {
  slide.addText(text.toUpperCase(), {
    x,
    y,
    w: 8.0,
    h: 0.35,
    fontFace: FONT_TITLE,
    fontSize: 10,
    bold: true,
    color: COLORS.gold,
    charSpacing: 2,
  });
}

// Helper for Slide Header
function addSlideHeader(slide, kicker, title, subtitle) {
  setSlideBackground(slide);
  addKicker(slide, kicker, 0.8, 0.45);
  
  slide.addText(title, {
    x: 0.8,
    y: 0.8,
    w: 11.7,
    h: 0.6,
    fontFace: FONT_TITLE,
    fontSize: 24,
    bold: true,
    color: COLORS.white,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.4,
      w: 11.7,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: COLORS.silver,
    });
  }
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
  const slide = pptx.addSlide();
  setSlideBackground(slide);

  // Decorative Solana / Amber glow pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.1,
    w: 4.2,
    h: 0.4,
    rectRadius: 0.2,
    fill: { color: "1E293B" },
    line: { color: COLORS.gold, width: 1 },
  });
  slide.addText("⚡ SOLANA DEVNET  •  VERIFIABLE AI", {
    x: 0.8,
    y: 1.1,
    w: 4.2,
    h: 0.4,
    fontFace: FONT_TITLE,
    fontSize: 10,
    bold: true,
    color: COLORS.goldLight,
    align: "center",
    valign: "middle",
    charSpacing: 1,
  });

  // Main Project Title
  slide.addText("ProofTrip", {
    x: 0.8,
    y: 1.7,
    w: 11.5,
    h: 1.1,
    fontFace: FONT_TITLE,
    fontSize: 54,
    bold: true,
    color: COLORS.white,
  });

  // Catchy Subtitle
  slide.addText("Autonomous AI Travel Agents with Cryptographic On-Chain Proof", {
    x: 0.8,
    y: 2.85,
    w: 11.5,
    h: 0.5,
    fontFace: FONT_BODY,
    fontSize: 20,
    bold: true,
    color: COLORS.solanaGreen,
  });

  // Human, punchy one-liner
  slide.addText(
    "AI plans the trip. Solana proves nobody tampered with it. No fake quotes. No scam middlemen.",
    {
      x: 0.8,
      y: 3.45,
      w: 10.5,
      h: 0.6,
      fontFace: FONT_BODY,
      fontSize: 15,
      color: COLORS.silverLight,
    }
  );

  // Team Card Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 4.5,
    w: 11.73,
    h: 2.3,
    rectRadius: 0.15,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1.5 },
  });

  // Team Catalyst Badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.2,
    y: 4.85,
    w: 2.8,
    h: 0.45,
    rectRadius: 0.1,
    fill: { color: COLORS.gold },
    line: { color: COLORS.gold, width: 0 },
  });
  slide.addText("TEAM CODE CATALYST", {
    x: 1.2,
    y: 4.85,
    w: 2.8,
    h: 0.45,
    fontFace: FONT_TITLE,
    fontSize: 11,
    bold: true,
    color: "000000",
    align: "center",
    valign: "middle",
  });

  // Key Highlights row
  const highlights = [
    { label: "SMART CONTRACT", val: "Anchor on Solana Devnet\n(A7yU8i4...VSzN)" },
    { label: "REGISTRY STANDARD", val: "Metaplex Agent Registry\n(1DREGFg...B2p)" },
    { label: "PROOF MECHANISM", val: "SHA-256 Trip Commitment\nCanonical JSON Hash" },
    { label: "VERIFICATION", val: "14/14 Automated Tests\nLive RPC Validation" },
  ];

  highlights.forEach((h, idx) => {
    const startX = 1.2 + idx * 2.8;
    slide.addText(h.label, {
      x: startX,
      y: 5.5,
      w: 2.6,
      h: 0.25,
      fontFace: FONT_TITLE,
      fontSize: 9,
      bold: true,
      color: COLORS.cyan,
      charSpacing: 1,
    });
    slide.addText(h.val, {
      x: startX,
      y: 5.75,
      w: 2.6,
      h: 0.8,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      color: COLORS.white,
    });
  });
}

// ==========================================
// SLIDE 2: THE PROBLEM & OUR INSIGHT
// ==========================================
{
  const slide = pptx.addSlide();
  addSlideHeader(
    slide,
    "The Reality & The Friction",
    "Why Travel Planning Fails Tourists Today",
    "Tourists in unfamiliar destinations face rigged pricing, rogue AI hallucinations, and zero accountability."
  );

  // 3 Problem Cards
  const problems = [
    {
      num: "01",
      icon: "🤖",
      title: "Unaccountable AI Agents",
      desc: "Anyone can slap a GPT wrapper and call it a 'guide'. When it hallucinates closed venues, fake hours, or sponsored scams, there is zero verifiable identity or liability.",
      color: COLORS.red,
    },
    {
      num: "02",
      icon: "💸",
      title: "The Tourist Tax & Touts",
      desc: "Autos and local vendors routinely charge 3x-5x fair prices because visitors don't know regional benchmarks. Tourists lack real-time ground truth pricing.",
      color: COLORS.gold,
    },
    {
      num: "03",
      icon: "🔀",
      title: "Disputed & Tampered Plans",
      desc: "Quotes change between WhatsApp messages and arrival. Without cryptographic proof of the agreed itinerary, tourists have zero recourse during disputes.",
      color: COLORS.purple,
    },
  ];

  problems.forEach((p, idx) => {
    const x = 0.8 + idx * 4.0;
    const y = 2.0;
    const w = 3.73;
    const h = 3.4;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText(p.num, {
      x: x + 0.3,
      y: y + 0.3,
      w: 1.0,
      h: 0.3,
      fontFace: FONT_TITLE,
      fontSize: 14,
      bold: true,
      color: p.color,
    });

    slide.addText(`${p.icon} ${p.title}`, {
      x: x + 0.3,
      y: y + 0.7,
      w: w - 0.6,
      h: 0.6,
      fontFace: FONT_TITLE,
      fontSize: 16,
      bold: true,
      color: COLORS.white,
    });

    slide.addText(p.desc, {
      x: x + 0.3,
      y: y + 1.4,
      w: w - 0.6,
      h: 1.6,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: COLORS.silverLight,
      lineSpacing: 18,
    });
  });

  // The Code Catalyst Solution Banner
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 5.65,
    w: 11.73,
    h: 1.3,
    rectRadius: 0.15,
    fill: { color: "10231D" },
    line: { color: COLORS.solanaGreen, width: 1.2 },
  });

  slide.addText("THE CODE CATALYST SHIFT:", {
    x: 1.2,
    y: 5.8,
    w: 3.2,
    h: 0.3,
    fontFace: FONT_TITLE,
    fontSize: 11,
    bold: true,
    color: COLORS.solanaGreen,
  });

  slide.addText(
    "Don't trust blind chatbot output. Discover registered Metaplex agents, verify their identity PDA on Solana, and commit the canonical SHA-256 itinerary hash to Devnet. If one word changes, the hash breaks.",
    {
      x: 1.2,
      y: 6.1,
      w: 11.0,
      h: 0.7,
      fontFace: FONT_BODY,
      fontSize: 13,
      bold: true,
      color: COLORS.white,
    }
  );
}

// ==========================================
// SLIDE 3: ARCHITECTURE & HOW IT WORKS
// ==========================================
{
  const slide = pptx.addSlide();
  addSlideHeader(
    slide,
    "Under the Hood",
    "Clean Architecture: Privacy Off-Chain, Trust On-Chain",
    "How ProofTrip balances low transaction cost and privacy with unbreakable blockchain trust."
  );

  // 4-Step Process Cards across the slide
  const steps = [
    {
      step: "STEP 1",
      title: "Plan Generation",
      where: "Off-Chain (Next.js)",
      body: "Tourists input destination, budget, & schedule.\nDynamic engine builds detailed day-by-day plan with cost breakdowns.",
      border: COLORS.cyan,
    },
    {
      step: "STEP 2",
      title: "Agent Verification",
      where: "Metaplex Registry",
      body: "Client checks agent PDA on Solana Devnet.\nConfirms agent asset is legitimately registered under official Metaplex program.",
      border: COLORS.purple,
    },
    {
      step: "STEP 3",
      title: "Hash Commitment",
      where: "Anchor Program",
      body: "Generates canonical SHA-256 hash (32 bytes).\nTourist signs Devnet transaction writing hash & agent pubkey to TripCommitment PDA.",
      border: COLORS.solanaGreen,
    },
    {
      step: "STEP 4",
      title: "Tamper Proof",
      where: "Solana Explorer",
      body: "Anyone can re-hash the trip JSON.\nIf matched = 100% verified authentic.\nIf altered = signature mismatch flag.",
      border: COLORS.gold,
    },
  ];

  steps.forEach((s, idx) => {
    const x = 0.8 + idx * 3.0;
    const y = 2.0;
    const w = 2.75;
    const h = 3.3;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: s.border, width: 1.5 },
    });

    slide.addText(s.step, {
      x: x + 0.25,
      y: y + 0.25,
      w: w - 0.5,
      h: 0.25,
      fontFace: FONT_TITLE,
      fontSize: 10,
      bold: true,
      color: s.border,
      charSpacing: 1,
    });

    slide.addText(s.title, {
      x: x + 0.25,
      y: y + 0.55,
      w: w - 0.5,
      h: 0.5,
      fontFace: FONT_TITLE,
      fontSize: 16,
      bold: true,
      color: COLORS.white,
    });

    slide.addText(s.where, {
      x: x + 0.25,
      y: y + 1.1,
      w: w - 0.5,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 10,
      bold: true,
      color: COLORS.silver,
    });

    slide.addText(s.body, {
      x: x + 0.25,
      y: y + 1.45,
      w: w - 0.5,
      h: 1.6,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: COLORS.silverLight,
      lineSpacing: 16,
    });

    // Arrow indicator between steps (except last)
    if (idx < 3) {
      slide.addText("➔", {
        x: x + w + 0.02,
        y: y + 1.4,
        w: 0.25,
        h: 0.4,
        fontFace: FONT_TITLE,
        fontSize: 16,
        bold: true,
        color: COLORS.silver,
        align: "center",
      });
    }
  });

  // Privacy & Scalability Assurance Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 5.55,
    w: 11.73,
    h: 1.4,
    rectRadius: 0.15,
    fill: { color: COLORS.cardDark2 },
    line: { color: COLORS.cardBorder, width: 1 },
  });

  slide.addText("🛡️ ZERO PII ON-CHAIN — MAXIMUM PRIVACY & SPEED", {
    x: 1.1,
    y: 5.75,
    w: 6.0,
    h: 0.3,
    fontFace: FONT_TITLE,
    fontSize: 12,
    bold: true,
    color: COLORS.gold,
  });

  slide.addText(
    "• On-chain Account: 32-byte SHA-256 hash + traveler pubkey + agent pubkey + destination string.\n• Off-chain: Full itinerary text, names, dates, private notes, and receipts.\n• Benefit: Microscopic Devnet gas (<0.001 SOL), absolute data privacy, instantaneous confirmation.",
    {
      x: 1.1,
      y: 6.05,
      w: 11.0,
      h: 0.8,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: COLORS.white,
      lineSpacing: 16,
    }
  );
}

// ==========================================
// SLIDE 4: THE TOURIST TOOL SUITE
// ==========================================
{
  const slide = pptx.addSlide();
  addSlideHeader(
    slide,
    "The Product",
    "A Complete Toolkit Built for Real Travelers",
    "More than just an itinerary generator — an active shield against tourist exploitation."
  );

  const tools = [
    {
      icon: "🗺️",
      title: "Verified AI Planner",
      desc: "Tailored schedules with actual logistics, realistic transit times, and transparent pricing for Mysuru, Goa, Jaipur, Bangalore, and Delhi.",
      tag: "Autonomous Agent",
      tagColor: COLORS.cyan,
    },
    {
      icon: "🔐",
      title: "Tamper-Proof Seal",
      desc: "One-click Devnet commitment via Phantom/Solflare. Produces permanent proof on Solana Explorer that neither guide nor user can retroactively alter.",
      tag: "Solana Anchor",
      tagColor: COLORS.solanaGreen,
    },
    {
      icon: "💰",
      title: "Fair Price Checker",
      desc: "Input local quotes (auto-rickshaw, taxi, monument tickets). Instantly flags overpricing against verified government and regional benchmarks.",
      tag: "Real-time Ground Truth",
      tagColor: COLORS.gold,
    },
    {
      icon: "🛡️",
      title: "Scam & Safety Guardian",
      desc: "Paste suspicious tout messages ('temple closed today', 'special government emporium'). Instant risk flag + 1-tap Indian tourist emergency numbers.",
      tag: "Threat Detection",
      tagColor: COLORS.red,
    },
  ];

  tools.forEach((t, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 6.0;
    const y = 2.0 + row * 2.55;
    const w = 5.73;
    const h = 2.35;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    // Tag Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + w - 2.3,
      y: y + 0.25,
      w: 2.0,
      h: 0.35,
      rectRadius: 0.08,
      fill: { color: "1E293B" },
      line: { color: t.tagColor, width: 1 },
    });
    slide.addText(t.tag, {
      x: x + w - 2.3,
      y: y + 0.25,
      w: 2.0,
      h: 0.35,
      fontFace: FONT_TITLE,
      fontSize: 9,
      bold: true,
      color: t.tagColor,
      align: "center",
      valign: "middle",
    });

    slide.addText(`${t.icon}  ${t.title}`, {
      x: x + 0.35,
      y: y + 0.3,
      w: 3.5,
      h: 0.45,
      fontFace: FONT_TITLE,
      fontSize: 17,
      bold: true,
      color: COLORS.white,
    });

    slide.addText(t.desc, {
      x: x + 0.35,
      y: y + 0.9,
      w: w - 0.7,
      h: 1.25,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: COLORS.silverLight,
      lineSpacing: 18,
    });
  });
}

// ==========================================
// SLIDE 5: TECH STACK, TRACTION & ROADMAP
// ==========================================
{
  const slide = pptx.addSlide();
  addSlideHeader(
    slide,
    "Hackathon Delivery",
    "Live on Devnet Today • Tested • Built to Scale",
    "ProofTrip is not a mock concept. It is a fully functioning, verifiable decentralized product."
  );

  const cols = [
    {
      title: "LIVE DEPLOYMENT",
      tag: "100% OPERATIONAL",
      tagColor: COLORS.solanaGreen,
      items: [
        { label: "Tourism Anchor Program", val: "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN" },
        { label: "Metaplex Registry", val: "1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p" },
        { label: "Automated Test Suite", val: "14 / 14 Tests Passing (Smart contract, PDA, API, Hashes)" },
        { label: "Network", val: "Solana Devnet (Sub-second finality)" },
      ],
    },
    {
      title: "TECH STACK",
      tag: "MODERN & SECURE",
      tagColor: COLORS.cyan,
      items: [
        { label: "Blockchain Framework", val: "Rust & Anchor Framework 0.30" },
        { label: "Web3 Client", val: "@solana/web3.js + Wallet Adapter" },
        { label: "Frontend", val: "Next.js 14 (App Router) + TypeScript" },
        { label: "Agent Discovery", val: "Metaplex Agent Registry API & PDA" },
      ],
    },
    {
      title: "THE ROADMAP",
      tag: "NEXT MILESTONES",
      tagColor: COLORS.gold,
      items: [
        { label: "Phase 1: Escrow Release", val: "Unlock guide payouts only upon traveler milestone check-ins." },
        { label: "Phase 2: Agent Staking", val: "Agents stake SOL; bad advice leads to slashed stake." },
        { label: "Phase 3: Solana Mobile", val: "Offline itinerary caching & SMS wallet signing for remote travel." },
        { label: "Phase 4: Global Scale", val: "Benchmark expansion across Southeast Asia & Europe." },
      ],
    },
  ];

  cols.forEach((col, idx) => {
    const x = 0.8 + idx * 4.0;
    const y = 2.0;
    const w = 3.73;
    const h = 4.0;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText(col.title, {
      x: x + 0.3,
      y: y + 0.3,
      w: 2.2,
      h: 0.3,
      fontFace: FONT_TITLE,
      fontSize: 13,
      bold: true,
      color: COLORS.white,
    });

    slide.addText(col.tag, {
      x: x + w - 1.5,
      y: y + 0.3,
      w: 1.2,
      h: 0.25,
      fontFace: FONT_TITLE,
      fontSize: 8,
      bold: true,
      color: col.tagColor,
      align: "right",
    });

    slide.addShape(pptx.ShapeType.line, {
      x: x + 0.3,
      y: y + 0.7,
      w: w - 0.6,
      h: 0,
      line: { color: COLORS.cardBorder, width: 1 },
    });

    col.items.forEach((it, iIdx) => {
      const itemY = y + 0.85 + iIdx * 0.72;
      slide.addText(it.label.toUpperCase(), {
        x: x + 0.3,
        y: itemY,
        w: w - 0.6,
        h: 0.2,
        fontFace: FONT_TITLE,
        fontSize: 8.5,
        bold: true,
        color: col.tagColor,
      });
      slide.addText(it.val, {
        x: x + 0.3,
        y: itemY + 0.2,
        w: w - 0.6,
        h: 0.45,
        fontFace: FONT_BODY,
        fontSize: 11,
        color: COLORS.white,
        lineSpacing: 14,
      });
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 6.2,
    w: 11.73,
    h: 0.8,
    rectRadius: 0.1,
    fill: { color: "1E293B" },
    line: { color: COLORS.gold, width: 1 },
  });

  slide.addText(
    "TEAM CODE CATALYST  |  \"Verifiable Intelligence for the Real World — Zero Slop, Real Code, Real Solana Devnet.\"",
    {
      x: 0.8,
      y: 6.2,
      w: 11.73,
      h: 0.8,
      fontFace: FONT_TITLE,
      fontSize: 12,
      bold: true,
      color: COLORS.goldLight,
      align: "center",
      valign: "middle",
    }
  );
}

// Generate the presentation file
const outputPath = path.resolve("..", "ProofTrip_Hackathon_CodeCatalyst.pptx");
console.log("Saving presentation to:", outputPath);

await pptx.writeFile({ fileName: outputPath });
console.log("Presentation generated successfully!");
